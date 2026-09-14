/* ============================================================
   motion.js — dependency-free motion engine (~120 lines)
   Replaces the GSAP + ScrollTrigger runtime used by the Nuxt
   source site. One requestAnimationFrame loop drives everything.

     Motion.tween()    time-based animation with easing
     Motion.scrub()    scroll-linked value with smoothing
     Motion.onEnter()  one-shot "element top crosses N% of viewport"
     Motion.watch()    run a function every frame
     Motion.timeline() sampled sequence of tracks (scrub or play)
   ============================================================ */
window.Motion = (function () {
  "use strict";

  /* Easing curves — same shapes as GSAP's standard set. */
  var EASE = {
    linear: function (t) { return t; },
    "power1.out": function (t) { return 1 - (1 - t) * (1 - t); },
    "power1.inOut": function (t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    },
    "power2.out": function (t) { return 1 - Math.pow(1 - t, 3); },
    "power2.inOut": function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    "power3.out": function (t) { return 1 - Math.pow(1 - t, 4); },
    "power3.inOut": function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },
    "sine.out": function (t) { return Math.sin((t * Math.PI) / 2); },
    "sine.inOut": function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
  };

  var tweens = [];    // active time-based tweens
  var scrubs = [];    // scroll-linked items (persist)
  var watchers = [];  // per-frame callbacks (persist)
  var running = false;
  var last = 0;

  function loop(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    for (var i = tweens.length - 1; i >= 0; i--) {
      var tw = tweens[i];
      if (tw.dead) { tweens.splice(i, 1); continue; }
      tw.t += dt;
      if (tw.t < 0) continue; // still in delay
      var p = Math.min(tw.t / tw.dur, 1);
      tw.onUpdate(tw.ease(p), p);
      if (p >= 1) {
        tweens.splice(i, 1);
        if (tw.onComplete) tw.onComplete();
      }
    }

    for (var s = 0; s < scrubs.length; s++) {
      var sc = scrubs[s];
      var target = sc.getTarget();
      /* Exponential approach; tau = smoothing/3 ≈ GSAP's scrub duration. */
      var k = sc.tau > 0 ? 1 - Math.exp(-dt / sc.tau) : 1;
      sc.value += (target - sc.value) * k;
      if (Math.abs(target - sc.value) < 0.0001) sc.value = target;
      sc.apply(sc.value);
    }

    for (var w = 0; w < watchers.length; w++) watchers[w]();

    if (tweens.length || scrubs.length || watchers.length) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  }

  function wake() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  /* tween({ dur, delay, ease, onUpdate(eased, raw), onComplete })
     Returns a handle with .kill(). */
  function tween(opts) {
    var tw = {
      t: -(opts.delay || 0),
      dur: Math.max(opts.dur || 0.001, 0.001),
      ease: EASE[opts.ease || "linear"] || EASE.linear,
      onUpdate: opts.onUpdate || function () {},
      onComplete: opts.onComplete,
      dead: false,
    };
    tweens.push(tw);
    wake();
    return {
      kill: function () { tw.dead = true; },
    };
  }

  /* scrub(getTarget, apply, smoothingSeconds)
     getTarget() → desired value (read live each frame);
     apply(value) receives the smoothed value. */
  function scrub(getTarget, apply, smoothingSeconds) {
    var item = {
      getTarget: getTarget,
      apply: apply,
      tau: (smoothingSeconds || 0) / 3,
      value: getTarget(),
    };
    scrubs.push(item);
    wake();
    return item;
  }

  /* watch(fn) — run fn every frame (scroll predicates, lerps). */
  function watch(fn) {
    watchers.push(fn);
    wake();
  }

  /* onEnter(el, viewportFraction, cb) — fire cb once when el's top
     crosses the given fraction of the viewport height (0.82 ≈ GSAP
     ScrollTrigger start "top 82%"). Fires immediately if already past. */
  function onEnter(el, viewportFraction, cb) {
    if (!el) return;
    var shrink = -(1 - viewportFraction) * 100;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            io.disconnect();
            cb();
          }
        });
      },
      { rootMargin: "0px 0px " + shrink + "% 0px", threshold: 0 }
    );
    io.observe(el);
  }

  /* timeline() — a set of tracks positioned on a shared time axis.
     add(start, dur, easeName, apply) → apply(easedProgress 0..1).
     Then either play() (time-based) or sample(t) (scroll-driven). */
  function timeline() {
    var tracks = [];
    var total = 0;
    var api = {
      add: function (start, dur, easeName, apply) {
        tracks.push({
          start: start,
          dur: dur,
          ease: EASE[easeName] || EASE.linear,
          apply: apply,
        });
        total = Math.max(total, start + dur);
        return api;
      },
      duration: function () { return total; },
      sample: function (t) {
        for (var i = 0; i < tracks.length; i++) {
          var tr = tracks[i];
          var p = Math.min(Math.max((t - tr.start) / tr.dur, 0), 1);
          tr.apply(tr.ease(p));
        }
      },
      play: function () {
        return tween({
          dur: total,
          onUpdate: function (_, raw) { api.sample(raw * total); },
        });
      },
    };
    return api;
  }

  /* Convenience: set the hidden "before" state for a rise-in reveal.
     JS-only, so a no-JS page still shows everything. */
  function hideRise(el, y) {
    el.style.opacity = "0";
    el.style.transform = "translateY(" + y + "px)";
  }

  /* Convenience: animate a hidden-with-hideRise element back in. */
  function riseIn(el, y, dur, easeName, delay) {
    return tween({
      dur: dur,
      delay: delay,
      ease: easeName,
      onUpdate: function (e) {
        el.style.opacity = String(e);
        el.style.transform = "translateY(" + (1 - e) * y + "px)";
      },
      onComplete: function () {
        el.style.opacity = "";
        el.style.transform = "";
      },
    });
  }

  return {
    tween: tween,
    scrub: scrub,
    watch: watch,
    onEnter: onEnter,
    timeline: timeline,
    hideRise: hideRise,
    riseIn: riseIn,
    clamp: function (v, lo, hi) { return Math.min(Math.max(v, lo), hi); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
  };
})();
