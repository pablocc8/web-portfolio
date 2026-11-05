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
  doc.documentElement.classList.add('js');

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

  var lastStatus = '';
  function renderStatus() {
    var n = now();
    var s = computeStatus(n);
    var html = '<strong>' + s.title + '</strong>' + (s.detail ? ' · ' + s.detail : '');
    /* Solo se reescribe si cambia, para no repetir el aviso del lector de pantalla */
    if (html !== lastStatus) {
      lastStatus = html;
      $$('[data-status]').forEach(function (el) {
        el.classList.remove('is-open', 'is-soon', 'is-closed');
        el.classList.add('is-' + s.state);
        var t = $('.status-text', el);
        if (t) t.innerHTML = html;
      });
    }
    $$('[data-now]').forEach(function (el) {
      el.textContent = 'En Castelló son las ' + fmtMin(n.min) + ' del ' + DIAS[n.dow] + (simulated ? ' (hora simulada).' : '.');
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

  /* ---------- Aviso de demo ---------- */
  var notice = $('#notice');
  var lastTrigger = null;
  var AVISOS = {
    call: {
      title: 'Llamar',
      text: '<strong>En tu web, este botón llama a tu negocio.</strong> El cliente no tiene que copiar el número.'
    },
    whatsapp: {
      title: 'WhatsApp',
      text: '<strong>En tu web, este botón abre WhatsApp con un mensaje ya escrito.</strong> La consulta te llega directamente al móvil.'
    },
    maps: {
      title: 'Cómo llegar',
      text: '<strong>En tu web, este botón abre el mapa del móvil</strong> con la ruta hasta tu local, a pie o en coche.'
    },
    legal: {
      title: 'Aviso legal y privacidad',
      text: 'En tu web, aquí irían tu aviso legal y tu política de privacidad, adaptados a tu negocio.'
    },
    booking: {
      title: 'Reserva lista para enviar',
      text: '<strong>En tu web, este botón abre WhatsApp con este mensaje.</strong> La reserva te llega al móvil y tú contestas con la hora exacta.'
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
  function initMenu() {
    var toggle = $('.menu-toggle');
    var nav = $('#menu');
    if (!toggle || !nav) return;
    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }
    function setMenu(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () { setMenu(!isOpen()); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setMenu(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (isOpen() && !e.target.closest('#cabecera')) setMenu(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900 && isOpen()) setMenu(false); });
  }

  /* ---------- Botón flotante de WhatsApp ----------
     Se oculta en la reserva (ya tiene su botón de WhatsApp) y en la sección final */
  function initFloat() {
    var btn = $('#wa-float');
    if (!btn || !('IntersectionObserver' in window)) return;
    var visibles = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visibles[en.target.id] = en.isIntersecting; });
      btn.classList.toggle('is-hidden', !!(visibles.reserva || visibles['tu-web']));
    }, { rootMargin: '0px 0px -10% 0px' });
    ['#reserva', '#tu-web'].forEach(function (s) { var el = $(s); if (el) io.observe(el); });
  }

  /* ---------- Servicios: filtros ---------- */
  function initFilters() {
    var chips = $$('[data-filter]');
    var groups = $$('.menu-group');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        groups.forEach(function (g) {
          g.hidden = !(f === 'todo' || g.getAttribute('data-group') === f);
        });
      });
    });
  }

  /* ---------- Reserva ---------- */
  var form = $('#booking');
  var sel = $('#f-servicio');
  var daysBox = $('#opt-dia');
  var slotsBox = $('#opt-franja');
  var slotsHint = $('#hint-franja');
  var nameInput = $('#f-nombre');
  var SERVICES = {};
  var lastDaysHtml = '';

  function buildServices() {
    $$('.menu-group').forEach(function (g) {
      var og = doc.createElement('optgroup');
      og.label = $('.group-title', g).textContent.trim();
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

  function dayLabel(d, k) {
    return (k === 0 ? 'Hoy, ' : (k === 1 ? 'Mañana, ' : '')) + DIAS[d.dow] + ' ' + d.d + ' de ' + MESES[d.mo - 1];
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
      var label = dayLabel(d, k) + (closed ? ', cerrado' : (full ? ', sin franjas libres' : ''));
      html += '<label class="opt"><input type="radio" name="dia" value="' + iso + '" data-k="' + k + '"' + (closed || full ? ' disabled' : '') + '>' +
        '<span class="opt-box" aria-hidden="true"><span class="day-w">' + (k === 0 ? 'Hoy' : DIAS_CORTO[d.dow]) + '</span>' +
        '<span class="day-n">' + d.d + '</span><span class="day-m">' + MESES_CORTO[d.mo - 1] + '</span></span>' +
        '<span class="sr-only">' + esc(label) + '</span></label>';
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
    if (!k) {
      slotsBox.innerHTML = '<p class="slots-empty">Primero elige un día.</p>';
      slotsHint.hidden = true;
      return;
    }
    var d = addDays(n, +k.getAttribute('data-k'));
    var dur = currentService() ? currentService().min : 20;
    var slots = slotsFor(d.dow, +k.getAttribute('data-k') === 0, n, dur);
    var prev = checked('franja');
    var html = '';
    slots.forEach(function (s) {
      var val = s.name + '|' + s.from + '|' + s.to;
      html += '<label class="opt"><input type="radio" name="franja" value="' + esc(val) + '"' + (s.past ? ' disabled' : '') + (prev === val && !s.past ? ' checked' : '') + '>' +
        '<span class="opt-box"><span class="opt-title">' + s.name + '</span><span class="opt-sub">' + (s.past ? 'Ya ha pasado' : fmtMin(s.from) + ' a ' + fmtMin(s.to)) + '</span></span></label>';
    });
    slotsBox.innerHTML = html;
    var hint = '';
    if (d.dow === 6) hint = 'Los sábados se llenan antes. Si puedes, reserva con unos días de margen.';
    if (d.dow === 5) hint = 'Los viernes no cerramos a mediodía. La sobremesa suele estar más tranquila.';
    slotsHint.textContent = hint;
    slotsHint.hidden = !hint;
  }

  function franjaText(fr) {
    var p = fr.split('|');
    return p[0] + ', de ' + fmtMin(+p[1]) + ' a ' + fmtMin(+p[2]);
  }

  function buildMessage() {
    var s = currentService();
    var dk = daysBox.querySelector('input:checked');
    var fr = checked('franja');
    var nombre = nameInput.value.trim();
    var lines = ['Hola, quería reservar una cita en ' + NEGOCIO.nombre + '.'];
    lines.push('Servicio: ' + (s ? s.name + ' (' + s.min + ' min, ' + s.price + ' €)' : 'sin elegir'));
    lines.push('Barbero: ' + (checked('barbero') || 'Me da igual'));
    if (dk) {
      var d = addDays(now(), +dk.getAttribute('data-k'));
      lines.push('Día: ' + DIAS[d.dow] + ' ' + d.d + ' de ' + MESES[d.mo - 1]);
    } else lines.push('Día: sin elegir');
    lines.push('Franja: ' + (fr ? franjaText(fr).toLowerCase() : 'sin elegir'));
    lines.push((nombre ? 'Soy ' + nombre + '. ' : '') + '¿Me confirmáis la hora? Gracias.');
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
      var k = +dk.getAttribute('data-k');
      var d = addDays(now(), k);
      var dn = DIAS[d.dow];
      setT('dia', (k === 0 ? 'Hoy, ' + dn : k === 1 ? 'Mañana, ' + dn : dn.charAt(0).toUpperCase() + dn.slice(1)) + ' ' + d.d + ' ' + MESES_CORTO[d.mo - 1]);
    } else setT('dia', 'Sin elegir', true);
    var fr = checked('franja');
    if (fr) setT('franja', franjaText(fr));
    else setT('franja', 'Sin elegir', true);
    setT('duracion', s ? s.min + ' min' : 'Sin elegir', !s);
    setT('precio', s ? s.price + ' €' : 'Sin elegir', !s);
    $('#wa-msg').textContent = buildMessage();
  }

  function clearError(field) {
    var map = { servicio: ['err-servicio', sel], dia: ['err-dia', daysBox], franja: ['err-franja', slotsBox] };
    var m = map[field];
    if (!m) return;
    $('#' + m[0]).hidden = true;
    m[1].closest('.field').classList.remove('is-invalid');
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
      e[2].closest('.field').classList.add('is-invalid');
      if (e[0] === 'servicio') sel.setAttribute('aria-invalid', 'true');
    });
    if (errors.length) {
      var first = errors[0];
      var target = first[0] === 'servicio' ? sel : first[2].querySelector('input:not(:disabled)');
      if (!target && first[0] === 'franja') target = daysBox.querySelector('input:checked') || daysBox.querySelector('input:not(:disabled)');
      if (target) {
        first[2].closest('.field').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      }
      return false;
    }
    return true;
  }

  function goToBooking(focusEl) {
    $('#reserva').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
    });
    form.addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'dia') { clearError('dia'); renderSlots(); }
      if (n === 'franja') clearError('franja');
      if (n !== 'servicio') updateTicket();
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
        goToBooking(daysBox.querySelector('input:checked') || daysBox.querySelector('input:not(:disabled)'));
        return;
      }
      var br = e.target.closest('[data-barber]');
      if (br) {
        var r = form.querySelector('input[name="barbero"][value="' + br.getAttribute('data-barber') + '"]');
        if (r) { r.checked = true; updateTicket(); }
        goToBooking(sel.value ? daysBox.querySelector('input:not(:disabled)') : sel);
      }
    });
  }

  /* ---------- Arranque ---------- */
  applyConfig();
  renderStatus();
  initMenu();
  initFloat();
  initFilters();
  initBooking();

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
