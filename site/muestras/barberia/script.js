/* =========================================================
   CONFIGURACIÓN COMERCIAL (edita solo esto)
   Marca, precio, plazo y número de la sección «¿Quieres una web así?»
   ========================================================= */
var CONFIG = {
  marca: '[[NOMBRE_COMERCIAL]]',
  precio: 395,
  plazo: '3 días laborables',
  whatsapp: '34623130633',
  sector: 'barbería',
  mensaje: 'Hola, he visto la web de ejemplo de {sector} y me interesa una para mi negocio'
};

/* =========================================================
   Datos del negocio ficticio
   Horario en minutos desde medianoche, hora de España (Europe/Madrid).
   0 = domingo … 6 = sábado
   ========================================================= */
var NEGOCIO = {
  nombre: 'Navaja & Azahar',
  zona: 'Europe/Madrid',
  horario: {
    0: [],
    1: [],
    2: [[600, 840], [990, 1230]],
    3: [[600, 840], [990, 1230]],
    4: [[600, 840], [990, 1230]],
    5: [[600, 1230]],
    6: [[540, 840]]
  },
  franjas: {
    2: [['Mañana', 600, 720], ['Mediodía', 720, 840], ['Tarde', 990, 1110], ['Última hora', 1110, 1230]],
    3: [['Mañana', 600, 720], ['Mediodía', 720, 840], ['Tarde', 990, 1110], ['Última hora', 1110, 1230]],
    4: [['Mañana', 600, 720], ['Mediodía', 720, 840], ['Tarde', 990, 1110], ['Última hora', 1110, 1230]],
    5: [['Mañana', 600, 720], ['Mediodía', 720, 840], ['Sobremesa', 840, 990], ['Tarde', 990, 1110], ['Última hora', 1110, 1230]],
    6: [['Primera hora', 540, 690], ['Media mañana', 690, 840]]
  }
};

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');

  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtMin(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Configuración comercial ---------- */
  function applyConfig() {
    $$('[data-cfg="marca"]').forEach(function (el) { el.textContent = CONFIG.marca; });
    $$('[data-cfg="precio"]').forEach(function (el) { el.textContent = CONFIG.precio; });
    $$('[data-cfg="plazo"]').forEach(function (el) { el.textContent = CONFIG.plazo; });
    var texto = CONFIG.mensaje.replace('{sector}', CONFIG.sector);
    $$('[data-cfg-wa]').forEach(function (el) {
      el.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
    });
  }

  /* ---------- Hora de España (con simulación ?ahora=AAAA-MM-DDTHH:MM) ---------- */
  var simulated = null;
  (function readSim() {
    var m = /[?&]ahora=(\d{4})-(\d{2})-(\d{2})[T ](\d{2})(?::|%3A)(\d{2})/i.exec(location.search);
    if (m) simulated = { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] };
  })();

  function makeNow(y, mo, d, h, mi) {
    var date = new Date(Date.UTC(y, mo - 1, d));
    return { y: y, mo: mo, d: d, dow: date.getUTCDay(), min: h * 60 + mi, date: date };
  }

  function now() {
    if (simulated) return makeNow(simulated.y, simulated.mo, simulated.d, simulated.h, simulated.mi);
    var p = {};
    try {
      new Intl.DateTimeFormat('en-GB', {
        timeZone: NEGOCIO.zona, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return makeNow(+p.year, +p.month, +p.day, (+p.hour) % 24, +p.minute);
    } catch (e) {
      var t = new Date();
      return makeNow(t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes());
    }
  }

  function addDays(n, k) {
    var dt = new Date(n.date.getTime() + k * 86400000);
    return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() + 1, d: dt.getUTCDate(), dow: dt.getUTCDay(), date: dt };
  }

  /* ---------- Estado abierto / cerrado ---------- */
  function computeStatus(n) {
    var today = NEGOCIO.horario[n.dow] || [];
    var i, a, b;
    for (i = 0; i < today.length; i++) {
      a = today[i][0]; b = today[i][1];
      if (n.min >= a && n.min < b) {
        if (b - n.min <= 30) return { state: 'soon', title: 'Cierra pronto', detail: 'Hoy a las ' + fmtMin(b) };
        return { state: 'open', title: 'Abierto ahora', detail: 'Cierra a las ' + fmtMin(b) };
      }
    }
    for (i = 0; i < today.length; i++) {
      if (today[i][0] > n.min) return { state: 'closed', title: 'Cerrado ahora', detail: 'Abre hoy a las ' + fmtMin(today[i][0]) };
    }
    for (var k = 1; k <= 7; k++) {
      var dd = addDays(n, k);
      var h = NEGOCIO.horario[dd.dow] || [];
      if (h.length) {
        var when = k === 1 ? 'mañana' : 'el ' + DIAS[dd.dow];
        return { state: 'closed', title: 'Cerrado ahora', detail: 'Abre ' + when + ' a las ' + fmtMin(h[0][0]) };
      }
    }
    return { state: 'closed', title: 'Cerrado', detail: '' };
  }

  function renderStatus() {
    var n = now();
    var s = computeStatus(n);
    $$('[data-status]').forEach(function (el) {
      el.classList.remove('is-open', 'is-soon', 'is-closed');
      el.classList.add('is-' + s.state);
      var t = $('.status-text', el);
      if (t) t.innerHTML = '<strong>' + s.title + '</strong>' + (s.detail ? '<span class="status-detail"><span class="status-sep"> · </span>' + s.detail + '</span>' : '');
    });
    $$('[data-now]').forEach(function (el) {
      el.textContent = 'Son las ' + fmtMin(n.min) + ' del ' + DIAS[n.dow] + ' en Castelló' + (simulated ? ' (hora simulada)' : '') + '. Se actualiza solo.';
    });
    $$('#horario tr').forEach(function (tr) {
      var d = +tr.getAttribute('data-day');
      tr.classList.toggle('is-closed', !(NEGOCIO.horario[d] || []).length);
      var isToday = d === n.dow;
      tr.classList.toggle('is-today', isToday);
      var th = $('th', tr);
      var pill = $('.today-pill', th);
      if (isToday && !pill) th.insertAdjacentHTML('beforeend', '<span class="today-pill">Hoy</span>');
      if (!isToday && pill) pill.remove();
    });
    $$('[data-year]').forEach(function (el) { el.textContent = n.y; });
  }

  /* ---------- Banner: altura real ---------- */
  function syncBar() {
    var bar = $('.demo-bar');
    if (bar) root.style.setProperty('--bar-h', bar.offsetHeight + 'px');
  }

  /* ---------- Aviso de demo ---------- */
  var notice = $('#notice');
  var lastTrigger = null;
  var AVISOS = {
    call: {
      title: 'Llamada en un toque',
      text: '<strong>En tu web, este botón llama a tu negocio con un solo toque.</strong> El cliente no tiene que copiar ni apuntar ningún número.'
    },
    whatsapp: {
      title: 'WhatsApp directo',
      text: '<strong>En tu web, este botón abre WhatsApp con el mensaje ya escrito</strong> y la reserva te llega directamente al móvil.'
    },
    maps: {
      title: 'Cómo llegar',
      text: '<strong>En tu web, este botón abre el mapa del móvil con la ruta</strong> hasta tu puerta, a pie o en coche.'
    },
    legal: {
      title: 'Textos legales',
      text: 'En tu web, aquí van tu aviso legal y tus políticas de privacidad y cookies, adaptados a tu negocio.'
    },
    booking: {
      title: 'Reserva lista para enviar',
      text: '<strong>En tu web, este botón abre WhatsApp con este mensaje ya escrito</strong> y la reserva te llega al móvil. Tú solo contestas con la hora exacta.'
    }
  };

  function openNotice(type, trigger, message) {
    var a = AVISOS[type] || AVISOS.whatsapp;
    lastTrigger = trigger || doc.activeElement;
    $('#notice-title').textContent = a.title;
    $('#notice-text').innerHTML = a.text;
    var box = $('#notice-msg');
    if (message) { box.textContent = message; box.hidden = false; } else { box.textContent = ''; box.hidden = true; }
    if (typeof notice.showModal === 'function') {
      notice.showModal();
    } else {
      notice.setAttribute('open', '');
    }
    var first = $('[data-close]', notice);
    if (first) first.focus();
  }
  function closeNotice() {
    if (notice.open) {
      if (typeof notice.close === 'function') notice.close(); else notice.removeAttribute('open');
    }
  }
  if (notice) {
    notice.addEventListener('close', function () {
      if (lastTrigger && doc.contains(lastTrigger) && typeof lastTrigger.focus === 'function') lastTrigger.focus({ preventScroll: true });
    });
    notice.addEventListener('click', function (e) {
      if (e.target === notice) closeNotice();
      if (e.target.closest('[data-close]')) closeNotice();
      var link = e.target.closest('[data-close-link]');
      if (link) { lastTrigger = null; closeNotice(); }
    });
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-demo]');
    if (t) { e.preventDefault(); openNotice(t.getAttribute('data-demo'), t); }
  });

  /* ---------- Menú móvil ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#menu-movil');
  function setMenu(open) {
    if (!menu || !toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    $('.menu-toggle-label', toggle).textContent = open ? 'Cerrar' : 'Menú';
    if (open) {
      menu.hidden = false;
      menu.classList.add('is-open');
      doc.body.style.overflow = 'hidden';
      header.classList.remove('is-hidden');
      var f = $('a', menu); if (f) f.focus();
    } else {
      menu.hidden = true;
      menu.classList.remove('is-open');
      doc.body.style.overflow = '';
    }
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900 && !menu.hidden) setMenu(false); });
  }

  /* ---------- Cabecera que se esconde al bajar ---------- */
  var header = $('#cabecera');
  var lastY = 0;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    var menuOpen = toggle && toggle.getAttribute('aria-expanded') === 'true';
    if (!menuOpen && !header.contains(doc.activeElement)) {
      if (y > 420 && y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 420) header.classList.remove('is-hidden');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  /* ---------- Entradas al hacer scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (en) { return en.isIntersecting; });
      batch.forEach(function (en, i) {
        en.target.style.transitionDelay = Math.min(i * 90, 360) + 'ms';
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Dock flotante ---------- */
  function initDock() {
    var dock = $('#dock');
    var heroActions = $('.hero-actions');
    var author = $('#tu-web');
    if (!dock || !('IntersectionObserver' in window)) { if (dock) dock.classList.add('is-visible'); return; }
    var pastHero = false, inAuthor = false;
    function update() { dock.classList.toggle('is-visible', pastHero && !inAuthor); }
    new IntersectionObserver(function (en) {
      var e = en[0];
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    }).observe(heroActions);
    new IntersectionObserver(function (en) { inAuthor = en[0].isIntersecting; update(); }, { rootMargin: '0px 0px -15% 0px' }).observe(author);
  }

  /* ---------- Carta: filtros ---------- */
  function initFilters() {
    var chips = $$('[data-filter]');
    var groups = $$('.menu-group');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', String(on));
        });
        groups.forEach(function (g) {
          var show = f === 'todo' || g.getAttribute('data-group') === f;
          g.hidden = !show;
          if (show) g.classList.add('is-in');
        });
      });
    });
  }

  /* ---------- Reserva ---------- */
  var form = $('#booking');
  var sel = $('#f-servicio');
  var daysBox = $('#opt-dia');
  var slotsBox = $('#opt-franja');
  var nameInput = $('#f-nombre');
  var SERVICES = {};
  var lastDaysHtml = '';

  function buildServices() {
    $$('.menu-group').forEach(function (g) {
      var title = $('.group-title', g).firstChild.textContent.trim();
      var og = doc.createElement('optgroup');
      og.label = title;
      $$('.svc', g).forEach(function (li) {
        var s = {
          id: li.getAttribute('data-id'),
          name: li.getAttribute('data-name'),
          min: +li.getAttribute('data-min'),
          price: +li.getAttribute('data-price')
        };
        SERVICES[s.id] = s;
        var o = doc.createElement('option');
        o.value = s.id;
        o.textContent = s.name + ' · ' + s.min + ' min · ' + s.price + ' €';
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  }

  function currentService() { return SERVICES[sel.value] || null; }
  function checked(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }

  function slotsFor(dow, isToday, n, dur) {
    return (NEGOCIO.franjas[dow] || []).map(function (f) {
      var past = isToday && n.min > f[2] - dur;
      return { name: f[0], from: f[1], to: f[2], past: past };
    });
  }

  function renderDays() {
    var n = now();
    var dur = currentService() ? currentService().min : 20;
    var html = '';
    for (var k = 0; k < 14; k++) {
      var d = addDays(n, k);
      var slots = slotsFor(d.dow, k === 0, n, dur);
      var closed = !slots.length;
      var full = !closed && slots.every(function (s) { return s.past; });
      var iso = d.y + '-' + pad(d.mo) + '-' + pad(d.d);
      var w = k === 0 ? 'Hoy' : (k === 1 ? 'Mañana' : DIAS_CORTO[d.dow]);
      var sub = closed ? 'Cerrado' : (full ? 'Sin huecos' : MESES_CORTO[d.mo - 1]);
      var label = (k === 0 ? 'Hoy, ' : (k === 1 ? 'Mañana, ' : '')) + DIAS[d.dow] + ' ' + d.d + ' de ' + MESES[d.mo - 1] + (closed ? ', cerrado' : (full ? ', sin franjas disponibles' : ''));
      html += '<label class="opt"><input type="radio" name="dia" value="' + iso + '" data-k="' + k + '" aria-label="' + esc(label) + '"' + (closed || full ? ' disabled' : '') + '>' +
        '<span><span class="day-w">' + w + '</span><span class="day-n">' + d.d + '</span><span class="day-m">' + sub + '</span></span></label>';
    }
    if (html === lastDaysHtml) return;
    lastDaysHtml = html;
    var prev = checked('dia');
    daysBox.innerHTML = html;
    if (prev) {
      var again = daysBox.querySelector('input[value="' + prev + '"]:not(:disabled)');
      if (again) again.checked = true;
    }
  }

  function renderSlots() {
    var n = now();
    var k = daysBox.querySelector('input:checked');
    if (!k) { slotsBox.innerHTML = '<p class="slots-empty">Primero elige un día.</p>'; return; }
    var d = addDays(n, +k.getAttribute('data-k'));
    var dur = currentService() ? currentService().min : 20;
    var slots = slotsFor(d.dow, +k.getAttribute('data-k') === 0, n, dur);
    var prev = checked('franja');
    var html = '';
    slots.forEach(function (s) {
      var val = s.name + '|' + s.from + '|' + s.to;
      html += '<label class="opt"><input type="radio" name="franja" value="' + esc(val) + '"' + (s.past ? ' disabled' : '') + (prev === val && !s.past ? ' checked' : '') + '>' +
        '<span>' + s.name + '<small>' + (s.past ? 'Ya ha pasado' : fmtMin(s.from) + '–' + fmtMin(s.to)) + '</small></span></label>';
    });
    if (d.dow === 6) html += '<p class="slots-hint">Los sábados vuelan: si puedes, reserva con unos días de margen.</p>';
    if (d.dow === 5) html += '<p class="slots-hint">Los viernes no cerramos a mediodía: la sobremesa suele estar más tranquila.</p>';
    slotsBox.innerHTML = html;
  }

  function buildMessage() {
    var s = currentService();
    var b = checked('barbero');
    var dk = daysBox.querySelector('input:checked');
    var fr = checked('franja');
    var nombre = nameInput.value.trim();
    var lines = ['Hola, quería reservar en ' + NEGOCIO.nombre + ':'];
    lines.push('· Servicio: ' + (s ? s.name + ' (' + s.min + ' min, ' + s.price + ' €)' : '…'));
    lines.push('· Barbero: ' + (b || 'Me da igual'));
    if (dk) {
      var d = addDays(now(), +dk.getAttribute('data-k'));
      lines.push('· Día: ' + DIAS[d.dow] + ' ' + d.d + ' de ' + MESES[d.mo - 1]);
    } else lines.push('· Día: …');
    if (fr) {
      var p = fr.split('|');
      lines.push('· Franja: ' + p[0].toLowerCase() + ', de ' + fmtMin(+p[1]) + ' a ' + fmtMin(+p[2]));
    } else lines.push('· Franja: …');
    lines.push((nombre ? 'Soy ' + nombre + '. ' : '') + '¿Me confirmáis la hora? ¡Gracias!');
    return lines.join('\n');
  }

  function setT(key, value, empty) {
    var el = $('[data-t="' + key + '"]');
    if (!el) return;
    el.textContent = value;
    el.classList.toggle('is-empty', !!empty);
  }

  function updateTicket() {
    var s = currentService();
    setT('servicio', s ? s.name : 'Sin elegir', !s);
    setT('barbero', checked('barbero') || 'Me da igual');
    var dk = daysBox.querySelector('input:checked');
    if (dk) {
      var d = addDays(now(), +dk.getAttribute('data-k'));
      var k = +dk.getAttribute('data-k');
      setT('dia', (k === 0 ? 'Hoy, ' : k === 1 ? 'Mañana, ' : '') + DIAS[d.dow] + ' ' + d.d + ' ' + MESES_CORTO[d.mo - 1]);
    } else setT('dia', 'Sin elegir', true);
    var fr = checked('franja');
    if (fr) { var p = fr.split('|'); setT('franja', p[0] + ' · ' + fmtMin(+p[1]) + '–' + fmtMin(+p[2])); }
    else setT('franja', 'Sin elegir', true);
    setT('duracion', s ? 'Duración · ' + s.min + ' min' : 'Elige un servicio');
    setT('precio', s ? s.price + ' €' : '—');
    $('#wa-msg').textContent = buildMessage();
  }

  function bump() {
    var p = $('.ticket-paper');
    if (!p || reduceMotion) return;
    p.classList.remove('is-bump');
    void p.offsetWidth;
    p.classList.add('is-bump');
  }

  function clearError(field) {
    var map = { servicio: ['err-servicio', sel], dia: ['err-dia', daysBox], franja: ['err-franja', slotsBox] };
    var m = map[field];
    if (!m) return;
    $('#' + m[0]).hidden = true;
    m[1].closest('.step-field').classList.remove('is-invalid');
    if (field === 'servicio') sel.removeAttribute('aria-invalid');
  }

  function validate() {
    var errors = [];
    if (!currentService()) errors.push(['servicio', 'err-servicio', sel]);
    if (!daysBox.querySelector('input:checked')) errors.push(['dia', 'err-dia', daysBox]);
    if (!checked('franja')) errors.push(['franja', 'err-franja', slotsBox]);
    ['servicio', 'dia', 'franja'].forEach(clearError);
    errors.forEach(function (e) {
      $('#' + e[1]).hidden = false;
      e[2].closest('.step-field').classList.add('is-invalid');
      if (e[0] === 'servicio') sel.setAttribute('aria-invalid', 'true');
    });
    if (errors.length) {
      var first = errors[0];
      var target = first[0] === 'servicio' ? sel : first[2].querySelector('input:not(:disabled)');
      if (!target && first[0] === 'franja') target = daysBox.querySelector('input:checked') || daysBox.querySelector('input:not(:disabled)');
      if (target) {
        first[2].closest('.step-field').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      }
      return false;
    }
    return true;
  }

  function goToBooking(focusEl) {
    var sec = $('#reserva');
    sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) setTimeout(function () { focusEl.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }

  function initBooking() {
    if (!form) return;
    buildServices();
    renderDays();
    renderSlots();
    updateTicket();

    sel.addEventListener('change', function () {
      clearError('servicio');
      renderDays();
      renderSlots();
      updateTicket();
      bump();
    });
    form.addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'dia') { clearError('dia'); renderSlots(); }
      if (n === 'franja') clearError('franja');
      if (n !== 'servicio') { updateTicket(); bump(); }
    });
    nameInput.addEventListener('input', updateTicket);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      openNotice('booking', e.submitter || $('#send-booking'), buildMessage());
    });

    doc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-book]');
      if (b) {
        sel.value = b.getAttribute('data-book');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        var firstDay = daysBox.querySelector('input:checked') || daysBox.querySelector('input:not(:disabled)');
        goToBooking(firstDay);
        return;
      }
      var br = e.target.closest('[data-barber]');
      if (br) {
        var r = form.querySelector('input[name="barbero"][value="' + br.getAttribute('data-barber') + '"]');
        if (r) { r.checked = true; updateTicket(); bump(); }
        goToBooking(sel.value ? (daysBox.querySelector('input:not(:disabled)')) : sel);
      }
    });
  }

  /* ---------- Arranque ---------- */
  applyConfig();
  /* ResizeObserver mide tras el layout natural: sin reflujos forzados */
  if ('ResizeObserver' in window) new ResizeObserver(syncBar).observe($('.demo-bar'));
  else { syncBar(); window.addEventListener('resize', syncBar); }
  renderStatus();
  initReveal();
  initDock();
  initFilters();
  initBooking();
  window.requestAnimationFrame(onScroll);

  if (!simulated) {
    setInterval(function () {
      renderStatus();
      if (form) {
        var dayBefore = checked('dia');
        renderDays();
        if (dayBefore !== checked('dia')) renderSlots();
        updateTicket();
      }
    }, 30000);
  }
})();
