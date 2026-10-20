/* Hover the email or phone to get a Copy button. Clicking it copies the text,
   and the line retypes itself as "Copied", then types the original back. */
(function () {
  var S = window.SITE || {};
  document.querySelectorAll(".copy").forEach(function (btn) {
    var box = btn.closest(".c"), link = box.querySelector("a"), busy = false;
    btn.addEventListener("click", function () {
      if (busy) return; busy = true;
      var text = S[btn.getAttribute("data-copy")] || link.textContent, orig = link.textContent;
      function done() {
        box.classList.add("done");
        var w = link.offsetWidth; link.style.display = "inline-block"; link.style.minWidth = w + "px";
        retype(link, "Copied", function () {
          setTimeout(function () {
            retype(link, orig, function () { box.classList.remove("done"); link.style.minWidth = ""; busy = false; });
          }, 900);
        });
      }
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(done, function () {
        var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e) {} t.remove(); done();
      });
    });
  });
  function retype(el, str, cb) {
    var n = el.textContent.length, i = 0;
    (function erase() { // backspace the old text
      if (n > 0) { el.textContent = el.textContent.slice(0, --n); return setTimeout(erase, 14); }
      (function type() { el.textContent = str.slice(0, ++i); if (i < str.length) setTimeout(type, 38); else cb(); })();
    })();
  }
})();
