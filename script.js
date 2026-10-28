(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Navigation */
  const nav = $("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = $(".nav__toggle");
  const mobile = $("#mobile-menu");

  const closeMenu = () => {
    if (!mobile || !toggle) return;
    mobile.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("is-locked");
  };

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu();
        return;
      }
      mobile.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("is-locked");
      const first = $(".mobile__links a");
      if (first) first.focus({ preventScroll: true });
    });

    $$("a", mobile).forEach((a) => a.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobile.hidden) {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960 && !mobile.hidden) closeMenu();
    });
  }

  /* Hero parallax */
  const parallax = $("[data-parallax]");
  if (parallax && !reduceMotion) {
    let ticking = false;
    const setTransform = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      parallax.style.transform = `scale(1.08) translate3d(0, ${y * 0.16}px, 0)`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(setTransform);
        }
      },
      { passive: true }
    );
  }

  /* Reveal on scroll */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const groups = [
      ["[data-slider-track] .slide", 0],
      [".section-head", 0],
      [".gallery__item", 80],
      [".visit__block", 70],
      [".reviews__aside", 0],
      [".reviews__body", 120],
      [".statement__media", 0],
      [".statement__copy", 100],
      [".menu__index", 0],
      [".menu__panels", 100],
      [".footer__top", 0]
    ];

    const seen = new Set();

    groups.forEach(([selector, step]) => {
      $$(selector).forEach((el, i) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add("reveal");
        if (step) el.style.setProperty("--reveal-delay", `${i * step}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    $$(".reveal").forEach((el) => observer.observe(el));
  }

  /* Approach slider */
  const slider = $("[data-slider]");
  if (slider) {
    const track = $("[data-slider-track]", slider);
    const slides = $$(".slide", slider);
    const indexEl = $("[data-slider-index]", slider);
    const prev = $("[data-slider-prev]", slider);
    const next = $("[data-slider-next]", slider);
    let index = 0;

    const render = () => {
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      if (indexEl) indexEl.textContent = String(index + 1).padStart(2, "0");
      slides.forEach((s, i) => {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
        $$("a, button", s).forEach((el) => el.setAttribute("tabindex", i === index ? "0" : "-1"));
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    };

    const go = (dir) => {
      index = Math.min(Math.max(index + dir, 0), slides.length - 1);
      render();
    };

    if (prev) prev.addEventListener("click", () => go(-1));
    if (next) next.addEventListener("click", () => go(1));

    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    let startX = null;
    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
        startX = null;
      },
      { passive: true }
    );

    render();
  }

  /* Menu tabs + section backdrop */
  const menu = $("[data-menu]");
  if (menu) {
    const menuSection = $("#menu");
    const tabs = $$(".menu__tab", menu);
    const panels = $$(".menu__panel", menu);
    const bgLayers = menuSection ? $$(".menu__bg-layer", menuSection) : [];
    let activeBg = 0;

    const setBg = (src) => {
      if (!src || bgLayers.length < 2) return;
      const next = bgLayers[1 - activeBg];
      const url = `url("${src}")`;
      if (next.style.backgroundImage === url) return;
      next.style.backgroundImage = url;
      next.classList.add("is-active");
      bgLayers[activeBg].classList.remove("is-active");
      activeBg = 1 - activeBg;
    };

    const activate = (key) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        if (active && window.innerWidth <= 960) {
          tab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        }
      });
      panels.forEach((panel) => {
        const active = panel.dataset.panel === key;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      const activePanel = panels.find((panel) => panel.dataset.panel === key);
      if (activePanel) setBg(activePanel.dataset.bg);
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab.dataset.tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const target = tabs[(i + dir + tabs.length) % tabs.length];
        target.focus();
        activate(target.dataset.tab);
      });
    });

    const canHover = window.matchMedia("(hover: hover) and (min-width: 900px)").matches;
    if (canHover) {
      $$(".menu__row", menu).forEach((row) => {
        row.addEventListener("mouseenter", () => setBg(row.dataset.img));
      });
    }

    const sources = new Set();
    $$(".menu__row", menu).forEach((row) => {
      if (row.dataset.img) sources.add(row.dataset.img);
    });
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  /* Reviews */
  const reviewWrap = $("[data-reviews]");
  if (reviewWrap) {
    const reviews = $$(".review", reviewWrap);
    const dots = $$("[data-review]", reviewWrap);
    let current = 0;
    let timer = null;

    const show = (i) => {
      current = i;
      reviews.forEach((r, idx) => r.classList.toggle("is-active", idx === i));
      dots.forEach((d, idx) => {
        d.classList.toggle("is-active", idx === i);
        if (idx === i) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    };

    const start = () => {
      if (reviews.length < 2) return;
      stop();
      timer = window.setInterval(() => show((current + 1) % reviews.length), 7000);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.review));
        start();
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  }
})();
