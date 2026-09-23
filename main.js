/* ============================================================
   main.js — AUTO-GENERATED vanilla animation layer
   Source: app/components/demo/templates/events/AkiGatheringTemplate.vue (Nuxt/GSAP original — regenerate, do not hand-edit
   the generated sections; hand-completed blocks are marked TODO below).
   Engine primitives come from motion.js.
   ============================================================ */
(function () {
  "use strict";

  var M = window.Motion;
  var clamp = M.clamp;
  var lerp = M.lerp;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1024px)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var canReveal = !reduced;
  var canScrollLink = canReveal && desktop;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* reveal: hide now, rise-in when trigger top crosses start fraction */
  function reveal(triggerSel, sel, opts) {
    var trigger = $(triggerSel);
    if (!trigger) return;
    var els = sel ? $all(sel, trigger) : [trigger];
    if (!els.length) return;
    els.forEach(function (el) { M.hideRise(el, opts.y); });
    M.onEnter(trigger, opts.start, function () {
      els.forEach(function (el, i) {
        M.riseIn(el, opts.y, opts.dur, opts.ease, i * opts.stagger);
      });
    });
  }

  /* parallaxY: scrub yPercent -range..+range across the trigger (desktop) */
  function parallaxY(targetSel, range, triggerSel) {
    if (!canScrollLink) return;
    var el = $(targetSel);
    var trigger = $(triggerSel);
    if (!el || !trigger) return;
    M.scrub(function () {
      var r = trigger.getBoundingClientRect();
      var vh = window.innerHeight;
      return clamp((vh - r.top) / (vh + r.height), 0, 1);
    }, function (p) {
      el.style.transform = "translateY(" + lerp(-range, range, p) + "%)";
    }, 0);
  }

  /* parallaxBg: scrub background-position-y across the trigger (desktop) */
  function parallaxBg(targetSel, fromY, toY, triggerSel) {
    if (!canScrollLink) return;
    var el = $(targetSel);
    var trigger = $(triggerSel);
    if (!el || !trigger) return;
    var from = parseFloat(fromY);
    var to = parseFloat(toY);
    M.scrub(function () {
      var r = trigger.getBoundingClientRect();
      var vh = window.innerHeight;
      return clamp((vh - r.top) / (vh + r.height), 0, 1);
    }, function (p) {
      el.style.backgroundPositionY = lerp(from, to, p) + "%";
    }, 0);
  }

  /* svgDraw: stroke-dashoffset draw on enter (useSvgDraw equivalent) */
  function svgDraw(triggerSel, pathSel, opts) {
    var trigger = $(triggerSel);
    if (!trigger) return;
    var paths = $all(pathSel, trigger);
    if (!paths.length) return;
    var lens = paths.map(function (p) {
      try { return p.getTotalLength(); } catch (e) { return 200; }
    });
    paths.forEach(function (p, i) {
      p.style.strokeDasharray = String(lens[i]);
      p.style.strokeDashoffset = String(lens[i]);
    });
    M.onEnter(trigger, opts.start, function () {
      paths.forEach(function (p, i) {
        M.tween({
          dur: opts.dur,
          delay: i * opts.stagger,
          ease: opts.ease,
          onUpdate: function (e) {
            p.style.strokeDashoffset = String(lerp(lens[i], 0, e));
          },
        });
      });
    });
  }


  /* ── Mobile menu (was Vue @click + v-show) ────────────────────── */
  (function () {
    var burger = $('[aria-controls="ak-mobile-menu"]');
    var menu = document.getElementById("ak-mobile-menu");
    if (!burger || !menu) return;
    var setMenu = function (open) {
      menu.style.display = open ? "grid" : "none";
      burger.classList.toggle("ak-burger--open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    burger.addEventListener("click", function () {
      setMenu(menu.style.display === "none");
    });
    $all("a", menu).forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  })();


  /* ── Hero intro (time-based, on load) ─────────────────────────── */
  if (canReveal) {
    $all(".ak-word").forEach(function (w, i) {
      w.style.transform = "translateY(115%)";
      M.tween({
        dur: 1.2,
        delay: 0.15 + i * 0.1,
        ease: "power3.out",
        onUpdate: function (e) {
          w.style.transform = "translateY(" + (1 - e) * 115 + "%)";
        },
        onComplete: function () { w.style.transform = ""; },
      });
    });
    $all(".ak-hero-fade").forEach(function (el, i) {
      M.hideRise(el, 20);
      M.riseIn(el, 20, 0.9, "power2.out", 0.5 + i * 0.1);
    });
  }


  /* ── Scroll-linked parallax (desktop, full motion) ────────────── */
    parallaxY(".ak-hero-img", 3, ".ak-hero");
    parallaxY(".ak-night-img", 4, "#story");



  /* ── Section reveals ──────────────────────────────────────────── */
  if (canReveal) {
    reveal("#programme", ".ak-row", { stagger: 0.1, y: 24, dur: 0.65, ease: "power2.out", start: 0.82 });
    reveal("#story", ".ak-night-copy > *", { stagger: 0.1, y: 22, dur: 0.65, ease: "power2.out", start: 0.82 });
    reveal("#gifts", ".ak-coupon", { stagger: 0.14, y: 26, dur: 0.65, ease: "power2.out", start: 0.82 });
    reveal("#reviews", ".ak-voice", { stagger: 0.12, y: 22, dur: 0.65, ease: "power2.out", start: 0.82 });
    reveal("#visit", ".ak-visit-grid > *", { stagger: 0.12, y: 22, dur: 0.65, ease: "power2.out", start: 0.82 });
  }

  const track = document.getElementById("gallery-carousel");
    if (track) {
      const clone = track.cloneNode(true);
      clone.removeAttribute("id");          // Prevents duplicate ID in HTML
      clone.setAttribute("aria-hidden", "true"); // Hides duplicate from screen readers
      track.parentNode.appendChild(clone);
    }

})();
