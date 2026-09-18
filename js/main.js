(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar ---------- */
  var sp = document.getElementById("sp");
  var onScroll = function () {
    var h = document.documentElement;
    if (sp) sp.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll with stagger ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  var grids = [".serv-grid", ".why-grid", ".doc-grid", ".tst-grid", ".stats-grid"];
  document.querySelectorAll(grids.join(",")).forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (el, i) {
      if (el.classList.contains("reveal")) el.style.transitionDelay = (i * 80) + "ms";
    });
  });

  /* ---------- Hero parallax orbs ---------- */
  var heroFx = document.querySelector(".hero-fx");
  var raf = false;
  var parallax = function () {
    if (heroFx) heroFx.style.transform = "translateY(" + (window.scrollY * 0.22) + "px)";
    raf = false;
  };
  if (heroFx && !reduceMotion) {
    window.addEventListener("scroll", function () { if (!raf) { raf = true; requestAnimationFrame(parallax); } }, { passive: true });
    parallax();
  }

  /* ---------- Count-up stats ---------- */
  var counted = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target; counted.unobserve(el);
        var target = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "";
        var dur = 1300, t0 = performance.now();
        (function tick(t) {
          var p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target).toLocaleString("en-US") + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".stat strong[data-count]").forEach(function (el) { counted.observe(el); });

  /* ---------- Cursor spotlight on cards ---------- */
  document.querySelectorAll(".serv,.why,.doc,.tst,.info-item").forEach(function (el) { el.classList.add("spot"); });
  if (!reduceMotion) {
    document.querySelectorAll(".spot").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
      });
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  var headerEl = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  if (toggle && headerEl) {
    toggle.addEventListener("click", function () {
      var open = headerEl.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("#nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        headerEl.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- WhatsApp booking ---------- */
  // contact via email (phone removed)
  var buildMessage = function (lines) {
    return lines.filter(function (s) { return s && s.trim() !== ""; }).join("\n");
  };
  var openWhatsApp = function (text) {
    window.open("mailto:hello@carewellclinic.pk?subject=Enquiry&body=" + encodeURIComponent(text), "_blank");
  };

  document.querySelectorAll(".wa-booking").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var msg = "Hi CareWell Clinic, I'd like to book an appointment";
      if (btn.getAttribute("data-service")) msg += " for " + btn.getAttribute("data-service");
      msg += ".";
      openWhatsApp(msg);
    });
  });

  var bookingForms = document.querySelectorAll(".booking-form");
  bookingForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("[name=bname]").value.trim();
      var dep = form.querySelector("[name=bdep]").value;
      var date = form.querySelector("[name=bdate]").value;
      var msg = buildMessage([
        "Hi CareWell Clinic, I'd like to book an appointment.",
        "Name: " + name,
        "Department: " + dep,
        date ? "Preferred date: " + date : ""
      ]);
      openWhatsApp(msg);
    });
  });
})();