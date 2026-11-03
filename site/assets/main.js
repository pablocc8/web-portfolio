// Barra de WhatsApp fija en móvil: aparece al pasar el primer botón
// y se oculta cuando ya hay otro botón de WhatsApp a la vista.
(function () {
  var bar = document.getElementById('sticky-cta');
  if (!bar || !('IntersectionObserver' in window)) return;
  var link = bar.querySelector('a');
  var buttons = document.querySelectorAll('a[data-wa]');
  var visible = new Set();
  var passedHero = false;
  function update() {
    var show = passedHero && visible.size === 0;
    bar.classList.toggle('is-visible', show);
    link.tabIndex = show ? 0 : -1;
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      if (e.target === buttons[0] && !e.isIntersecting && e.boundingClientRect.top < 0) passedHero = true;
      if (e.target === buttons[0] && e.isIntersecting) passedHero = false;
    });
    update();
  });
  buttons.forEach(function (b) { io.observe(b); });
  bar.setAttribute('aria-hidden', 'true');
})();
