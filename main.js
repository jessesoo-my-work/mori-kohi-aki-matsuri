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
  const container = document.querySelector(".ak-carousel-container");

  if (track && container) {
    // Clean up in case this module is executed again.
    track
      .querySelectorAll("[data-carousel-clone]")
      .forEach((el) => el.remove());

    const originals = Array.from(track.children);
    const originalCount = originals.length;

    // These images are continuously moving toward the viewport,
    // so browser lazy-loading causes visible decode/loading jank.
    const originalImages = originals.flatMap((card) =>
      Array.from(card.querySelectorAll("img"))
    );

    originalImages.forEach((img) => {
      img.loading = "eager";
      img.decoding = "async";
    });

    // Duplicate the cards INSIDE the same flex track.
    originals.forEach((card) => {
      const clone = card.cloneNode(true);

      clone.dataset.carouselClone = "true";
      clone.setAttribute("aria-hidden", "true");

      clone
        .querySelectorAll("a, button, input, select, textarea, [tabindex]")
        .forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });

      track.appendChild(clone);
    });

    let distance = 0;
    const pixelsPerSecond = 38;
    let currentX = 0;
    let lastTime = null;
    let isHovered = false;
    let isPointerDown = false;
    let isDragging = false;
    let startPointerX = 0;
    let dragStartX = 0;
    let hasDragged = false;
    const DRAG_THRESHOLD = 6;

    function measureCarousel() {
      const firstOriginal = track.children[0];
      const firstClone = track.children[originalCount];

      if (!firstOriginal || !firstClone) return;

      // Exact distance between item 1 and its duplicate.
      // This automatically includes card widths, gaps and responsive sizing.
      distance =
        firstClone.getBoundingClientRect().left -
        firstOriginal.getBoundingClientRect().left;
    }

    function render() {
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }

    // Keep currentX always within (-distance, 0] for a seamless loop in both directions
    function wrap() {
      if (distance <= 0) return;
      while (currentX <= -distance) {
        currentX += distance;
      }
      while (currentX > 0) {
        currentX -= distance;
      }
    }

    function tick(now) {
      if (!lastTime) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Auto-scroll when not dragging, not hovered, and reduced motion is off
      if (!isDragging && !isHovered && !reduced && distance > 0) {
        currentX -= pixelsPerSecond * dt;
        wrap();
        render();
      }

      requestAnimationFrame(tick);
    }

    function imageReady(img) {
      const decode = () => {
        if (typeof img.decode === "function") {
          return img.decode().catch(() => {});
        }

        return Promise.resolve();
      };

      if (img.complete) {
        return decode();
      }

      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      }).then(decode);
    }

    // Don't start moving until the original product imagery is ready.
    Promise.all(originalImages.map(imageReady)).finally(() => {
      requestAnimationFrame(() => {
        measureCarousel();
        render();
        requestAnimationFrame(tick);
      });
    });

    let resizeTimer;

    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
          measureCarousel();
          wrap();
          render();
        }, 100);
      },
      { passive: true }
    );

    // Pause on hover
    container.addEventListener("mouseenter", () => {
      isHovered = true;
    });

    container.addEventListener("mouseleave", () => {
      isHovered = false;
      lastTime = performance.now();
    });

    // Pointer-based manual dragging (supports both mouse and touch)
    container.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;

      isPointerDown = true;
      isDragging = false;
      hasDragged = false;
      startPointerX = e.clientX;
      dragStartX = currentX;

      // Do NOT set pointer capture here on pointerdown.
      // Immediate capture on container blocks pointerup/click from reaching child <a> links.
    });

    container.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - startPointerX;

      // Only transition to dragging once threshold is crossed
      if (!isDragging) {
        if (Math.abs(deltaX) > DRAG_THRESHOLD) {
          isDragging = true;
          hasDragged = true;
          container.classList.add("is-dragging");

          if (typeof container.setPointerCapture === "function") {
            try {
              container.setPointerCapture(e.pointerId);
            } catch (_) {}
          }
        }
      }

      if (isDragging) {
        currentX = dragStartX + deltaX;
        wrap();
        render();
      }
    });

    function endDrag(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      lastTime = performance.now();

      if (isDragging) {
        isDragging = false;
        container.classList.remove("is-dragging");

        if (e && typeof container.releasePointerCapture === "function") {
          try {
            if (container.hasPointerCapture(e.pointerId)) {
              container.releasePointerCapture(e.pointerId);
            }
          } catch (_) {}
        }

        // Keep hasDragged = true for a brief tick so any pending click event from the drag is blocked
        setTimeout(() => {
          hasDragged = false;
        }, 50);
      } else {
        // Pure click, not a drag!
        hasDragged = false;
      }
    }

    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    // Prevent accidental link clicking if user dragged
    container.addEventListener(
      "click",
      (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      },
      true
    );

    // Prevent native image and link ghost drag
    track.querySelectorAll("img, a").forEach((el) => {
      el.addEventListener("dragstart", (e) => e.preventDefault());
    });
  }
})();
