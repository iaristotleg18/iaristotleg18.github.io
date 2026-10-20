/* Hover the name and it tears like a tuned-off TV: two color-split copies
   slide sideways in thin horizontal slices for a split second, then lock back.
   Off on touch screens and for reduced-motion visitors. */
(function () {
  var h1 = document.querySelector(".home h1");
  if (!h1) return;
  var reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var touch = !window.matchMedia("(hover:hover)").matches;
  if (reduced && !touch) return;

  h1.setAttribute("aria-label", "Isaiah Glick");
  var html = h1.innerHTML;
  var main = document.createElement("span");
  main.innerHTML = html; main.setAttribute("aria-hidden", "true");
  h1.innerHTML = ""; h1.appendChild(main);

  function layer(color) {
    var l = document.createElement("span");
    l.className = "tv"; l.setAttribute("aria-hidden", "true");
    l.style.color = color; l.innerHTML = html;
    h1.appendChild(l); return l;
  }
  var a = layer("#4a90e8"), b = layer("#ff4d6d");
  var busy = false;

  function rnd(n) { return Math.random() * n; }
  function band() { // a random horizontal slice, as inset() values
    var top = rnd(75), h = 8 + rnd(touch ? 30 : 22);
    return "inset(" + top + "% 0 " + Math.max(0, 100 - top - h) + "% 0)";
  }
  function run() {
    if (busy) return; busy = true;
    var size = parseFloat(getComputedStyle(h1).fontSize), n = 0, total = touch ? (reduced ? 10 : 18) : 11, amp = touch ? (reduced ? 1 : 1.6) : 1;
    h1.classList.add("glitch");
    (function tick() {
      if (n++ >= total) {
        [a, b].forEach(function (l) { l.style.clipPath = l.style.webkitClipPath = "inset(0 0 100% 0)"; l.style.transform = ""; });
        main.style.transform = ""; h1.classList.remove("glitch"); busy = false; return;
      }
      var k = 1 - n / total; // fades out as it settles
      a.style.clipPath = a.style.webkitClipPath = band(); a.style.transform = "translateX(" + ((rnd(2) - 1) * size * .09 * amp * k - size * .02 * amp) + "px)";
      b.style.clipPath = b.style.webkitClipPath = band(); b.style.transform = "translateX(" + ((rnd(2) - 1) * size * .09 * amp * k + size * .02 * amp) + "px)";
      main.style.transform = Math.random() < .35 ? "translateX(" + ((rnd(2) - 1) * size * .03 * amp * k) + "px)" : "";
      setTimeout(tick, 35 + rnd(30));
    })();
  }
  h1.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") run(); });
  h1.addEventListener("pointerdown", run);          // tap on phones
  if (touch) {                                       // phones have no hover: play on load, and again whenever the name scrolls back into view
    setTimeout(run, 500);
    if ("IntersectionObserver" in window) {
      var seen = true;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !seen) run(); seen = e.isIntersecting; });
      }, { threshold: .6 }).observe(h1);
    }
  }
})();
