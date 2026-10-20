(function () {
  var S = window.SITE || {};
  var igUrl = /^https?:/.test(S.instagram || "") ? S.instagram : "https://www.instagram.com/" + String(S.instagram || "").replace(/^@/, "").replace(/\/+$/, "") + "/";
  var mailBase = "mailto:" + S.email;

  // Fill links from config
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    if (k === "resume") { el.href = S.resume; el.setAttribute("download", "Isaiah-Glick-Resume.pdf"); }
    if (k === "linkedin") el.href = S.linkedin;
    if (k === "instagram") el.href = igUrl;
    if (k === "instagram-text") { el.href = igUrl; el.textContent = "@" + igUrl.replace(/\/+$/, "").split("/").pop() + " ↗\uFE0E"; }
    if (k === "maroon") el.href = S.maroon;
    if (k === "drive") el.href = S.driveFolder;
    if (k === "mailto") el.href = mailBase + "?subject=Portfolio%20access%20request&body=Hi%20Isaiah%2C%20please%20share%20the%20portfolio%20with%20this%20Google%20account%3A%20";
    if (k === "mailto-text") { el.href = mailBase; el.textContent = S.email; }
    if (k === "tel-text") { el.href = S.phoneHref; el.textContent = S.phone; }
  });

  // Resume opens as a full-screen view at #/resume
  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));
  var lastTile = null;
  function route() {
    var m = (location.hash || "").match(/^#\/?([\w-]*)/);
    var name = m ? m[1] : "";
    var open = null;
    views.forEach(function (v) {
      var on = v.id === "v-" + name;
      v.classList.toggle("on", on);
      if (on) { v.removeAttribute("inert"); open = v; } else { v.setAttribute("inert", ""); }
    });
    document.body.classList.toggle("in-view", !!open);
    if (open) {
      var h = open.querySelector("h2"); if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, 60);
      open.scrollTop = 0;
    } else if (lastTile) { lastTile.focus({ preventScroll: true }); lastTile = null; }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(".tile");
    if (t && /^#\/.+/.test(t.getAttribute("href") || "")) lastTile = t;
  });
  window.addEventListener("hashchange", route);
  route();

  // Keyboard: press the letter in a tile's corner to open it; Esc closes the view
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("in-view")) { location.hash = "#/"; return; }
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
    if (document.body.classList.contains("in-view")) return;
    var tile = document.querySelector('.tile[data-key="' + e.key.toLowerCase() + '"]');
    if (!tile) return;
    tile.classList.add("press");
    setTimeout(function () { tile.classList.remove("press"); }, 220);
    tile.click();
  });

  // Portfolio: confidentiality note on hover (desktop) or tap (touch)
  var pf = document.querySelector('.tile[data-key="p"]'), pop = document.getElementById("pf-pop");
  if (pf && pop) {
    var touch = window.matchMedia("(hover:none)").matches, t;
    function show() { clearTimeout(t); pop.hidden = false; requestAnimationFrame(function () { pop.classList.add("show"); }); }
    function hide() { clearTimeout(t); t = setTimeout(function () { pop.classList.remove("show"); setTimeout(function () { if (!pop.classList.contains("show")) pop.hidden = true; }, 220); }, touch ? 0 : 160); }
    if (touch) {
      pf.addEventListener("click", function (e) { e.preventDefault(); show(); });
      pop.querySelector(".pop-x").addEventListener("click", hide);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    } else {
      [pf, pop].forEach(function (el) { el.addEventListener("mouseenter", show); el.addEventListener("mouseleave", hide); });
      pf.addEventListener("focus", show); pf.addEventListener("blur", hide);
    }
  }

  // Phrase highlight on touch screens: plays when it scrolls into view, and again on tap
  var em = document.querySelector(".statement em");
  if (em && window.matchMedia("(hover:none)").matches) {
    var off;
    function flash() { em.classList.remove("on"); void em.offsetWidth; em.classList.add("on"); clearTimeout(off); off = setTimeout(function () { em.classList.remove("on"); }, 1600); }
    em.addEventListener("click", flash);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setTimeout(flash, 1000); io.disconnect(); } }, { threshold: 1 });
      io.observe(em);
    } else { setTimeout(flash, 1000); }
  }

  // Email and phone slip up and out of the way once you scroll, so the name never runs under them
  var top = document.querySelector(".top");
  if (top) {
    var tucked = false;
    function check(y) {
      var t = y > 24;
      if (t !== tucked) { tucked = t; top.classList.toggle("tucked", t); }
    }
    window.addEventListener("scroll", function () { check(window.scrollY || document.documentElement.scrollTop); }, { passive: true });
    document.addEventListener("scroll", function (e) { if (e.target && e.target.classList && e.target.classList.contains("view")) check(e.target.scrollTop); }, { passive: true, capture: true });
    window.addEventListener("hashchange", function () { check(0); });
  }

  // Light / dark toggle
  var tb = document.querySelector(".theme"), root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function paint() {
    var light = root.getAttribute("data-theme") === "light";
    tb.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    if (meta) meta.setAttribute("content", light ? "#f1f2f4" : "#2b2c33");
  }
  if (tb) {
    paint();
    tb.addEventListener("click", function () {
      var light = root.getAttribute("data-theme") === "light";
      root.classList.add("theme-anim");
      if (light) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", "light");
      try { localStorage.setItem("theme", light ? "dark" : "light"); } catch (e) {}
      tb.classList.add("spin"); setTimeout(function () { tb.classList.remove("spin"); }, 450);
      paint();
      setTimeout(function () { root.classList.remove("theme-anim"); }, 450);
    });
  }
})();
