/* =========================================================
   Taller Giroscopi · interacciones
   - Número de WhatsApp: atributo data-wa del <body>
   - Formulario de presupuesto -> mensaje de WhatsApp
   - Calculadora de próximo mantenimiento
   - Estado "abierto ahora" con hora de Madrid
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var WA = (document.body.getAttribute('data-wa') || '').replace(/\D/g, '');
  var SHOP = 'Taller Giroscopi';

  var SERVICES = {
    otro: 'Otra cosa / no lo sé',
    aceite: 'Cambio de aceite y filtros',
    preitv: 'Pre-ITV',
    frenos: 'Frenos',
    neumaticos: 'Neumáticos',
    diagnosis: 'Diagnosis electrónica',
    ac: 'Aire acondicionado'
  };

  /* ---------- utilidades ---------- */
  function fmt(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function num(input) {
    var v = input.value.trim();
    if (v === '') return NaN;
    var n = Number(v);
    return isFinite(n) ? n : NaN;
  }
  function setErr(input, msg) {
    var box = document.getElementById(input.id + '-err');
    if (box) box.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
  function waUrl(text) {
    return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  /* ---------- enlaces de WhatsApp ---------- */
  if (WA) {
    $$('a[data-wa-link]').forEach(function (a) { a.href = waUrl('Hola, quiero pedir presupuesto en ' + SHOP + '.'); });
  }

  /* ---------- menú móvil ---------- */
  (function () {
    var btn = $('.nav-toggle');
    var nav = $('#nav');
    if (!btn || !nav) return;
    function set(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) set(false); });
  })();

  /* ---------- aparición al hacer scroll ---------- */
  (function () {
    var items = $$('[data-rv]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        io.unobserve(el);
        if (el.classList.contains('card')) setTimeout(function () { el.classList.add('done'); }, 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- horario / abierto ahora (hora de Madrid) ---------- */
  (function () {
    // minutos desde las 00:00; 0 = domingo
    var WEEK = {
      0: [],
      1: [[510, 840], [960, 1170]],
      2: [[510, 840], [960, 1170]],
      3: [[510, 840], [960, 1170]],
      4: [[510, 840], [960, 1170]],
      5: [[510, 840], [960, 1170]],
      6: [[540, 780]]
    };
    var DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    function hhmm(m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); }

    function madridNow() {
      try {
        var parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).formatToParts(new Date());
        var o = {};
        parts.forEach(function (p) { o[p.type] = p.value; });
        return { day: MAP[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
      } catch (e) {
        var d = new Date();
        return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
      }
    }

    function status(now) {
      var slots = WEEK[now.day], i;
      for (i = 0; i < slots.length; i++) {
        if (now.min >= slots[i][0] && now.min < slots[i][1]) {
          return { open: true, text: 'Abierto ahora · cierra a las ' + hhmm(slots[i][1]) };
        }
      }
      for (i = 0; i < slots.length; i++) {
        if (now.min < slots[i][0]) return { open: false, text: 'Cerrado · abrimos hoy a las ' + hhmm(slots[i][0]) };
      }
      for (var k = 1; k <= 7; k++) {
        var d = (now.day + k) % 7;
        if (WEEK[d].length) {
          var when = k === 1 ? 'mañana' : 'el ' + DAYS[d];
          return { open: false, text: 'Cerrado · abrimos ' + when + ' a las ' + hhmm(WEEK[d][0][0]) };
        }
      }
      return { open: false, text: 'Cerrado' };
    }

    function render() {
      var now = madridNow();
      var st = status(now);
      $$('[data-open-status]').forEach(function (chip) {
        chip.setAttribute('data-open', st.open ? 'true' : 'false');
        $('[data-open-text]', chip).textContent = st.text;
      });
      $$('.hours tr').forEach(function (tr) {
        var days = tr.getAttribute('data-days').split(',');
        tr.classList.toggle('today', days.indexOf(String(now.day)) !== -1);
      });
    }
    render();
    setInterval(render, 60000);
  })();

  /* =======================================================
     Formulario de presupuesto
     ======================================================= */
  var form = $('#quote-form');
  var quote = null;

  if (form && WA) {
    var fNombre = $('#q-nombre'), fServicio = $('#q-servicio'), fCoche = $('#q-coche'),
        fAnio = $('#q-anio'), fProblema = $('#q-problema'),
        preview = $('#preview'), copyBtn = $('#copy-btn'), copyLabel = $('#copy-label'),
        statusEl = $('#form-status');
    var defaultStatus = statusEl.textContent;
    var maxYear = new Date().getFullYear() + 1;
    fAnio.max = String(maxYear);

    var clean = function (s) { return s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); };

    function values() {
      var urg = $('input[name="urgencia"]:checked', form);
      return {
        nombre: clean(fNombre.value),
        servicio: SERVICES[fServicio.value] || SERVICES.otro,
        coche: clean(fCoche.value),
        anio: fAnio.value.trim(),
        problema: clean(fProblema.value),
        urgencia: urg ? urg.value : 'Esta semana'
      };
    }

    function message(v) {
      var ph = function (t) { return '[' + t + ']'; };
      var car = v.coche ? v.coche + (v.anio ? ' (' + v.anio + ')' : '') : ph('marca y modelo');
      return [
        (v.nombre ? 'Hola, soy ' + v.nombre + '. Quiero' : 'Hola, quiero') + ' pedir presupuesto en ' + SHOP + '.',
        '',
        '*Coche:* ' + car,
        '*Servicio:* ' + v.servicio,
        '*Problema:* ' + (v.problema || ph('cuéntanos qué necesitas')),
        '*Urgencia:* ' + v.urgencia,
        '',
        '¿Me podéis dar un precio y una fecha? Gracias.'
      ].join('\n');
    }

    function nowHHMM() {
      try {
        return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
      } catch (e) { return ''; }
    }

    function renderPreview() {
      var text = message(values());
      var frag = document.createDocumentFragment();
      text.split('\n').forEach(function (line) {
        if (line === '') {
          var sp = document.createElement('div'); sp.className = 'sp'; frag.appendChild(sp); return;
        }
        var p = document.createElement('p');
        var m = /^\*([^*]+)\*\s?(.*)$/.exec(line);
        if (m) {
          var s = document.createElement('strong'); s.textContent = m[1] + ' '; p.appendChild(s);
          appendWithPlaceholders(p, m[2]);
        } else {
          appendWithPlaceholders(p, line);
        }
        frag.appendChild(p);
      });
      var t = document.createElement('span'); t.className = 'time'; t.textContent = nowHHMM();
      frag.appendChild(t);
      preview.textContent = '';
      preview.appendChild(frag);
    }

    // Los textos [entre corchetes] son huecos sin rellenar: se muestran atenuados.
    function appendWithPlaceholders(parent, str) {
      var re = /\[[^\]]+\]/g, last = 0, m;
      while ((m = re.exec(str))) {
        if (m.index > last) parent.appendChild(document.createTextNode(str.slice(last, m.index)));
        var s = document.createElement('span'); s.className = 'ph'; s.textContent = m[0]; parent.appendChild(s);
        last = m.index + m[0].length;
      }
      if (last < str.length) parent.appendChild(document.createTextNode(str.slice(last)));
    }

    function validate(show) {
      var v = values(), firstBad = null, ok = true;
      function check(input, msg) {
        if (msg) {
          ok = false;
          if (show) setErr(input, msg);
          if (!firstBad) firstBad = input;
        } else setErr(input, '');
      }
      check(fCoche, v.coche.length < 3 ? 'Indica la marca y el modelo de tu coche.' : '');
      var y = v.anio === '' ? null : Number(v.anio);
      check(fAnio, y !== null && (!isFinite(y) || y % 1 !== 0 || y < 1980 || y > maxYear) ? 'Año entre 1980 y ' + maxYear + '.' : '');
      check(fProblema, v.problema.length < 5 ? 'Cuéntanos en una frase qué necesitas o qué le pasa.' : '');
      return { ok: ok, first: firstBad, v: v };
    }

    quote = {
      setService: function (key) { if (SERVICES[key]) { fServicio.value = key; renderPreview(); } },
      appendNote: function (note) {
        var cur = fProblema.value.trim();
        if (cur.indexOf(note) !== -1) return;
        fProblema.value = cur ? cur + '\n' + note : note;
        setErr(fProblema, '');
        renderPreview();
      },
      focusCar: function () { fCoche.focus({ preventScroll: true }); }
    };

    form.addEventListener('input', function (e) {
      renderPreview();
      if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') validate(true);
    });
    form.addEventListener('change', renderPreview);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = validate(true);
      if (!r.ok) {
        statusEl.textContent = 'Revisa los campos marcados antes de enviar.';
        r.first.focus();
        return;
      }
      statusEl.textContent = defaultStatus;
      var a = document.createElement('a');
      a.href = waUrl(message(r.v));
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    var copyTimer;
    function flash(msg) {
      copyLabel.textContent = msg;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { copyLabel.textContent = 'Copiar mensaje'; }, 2200);
    }
    copyBtn.addEventListener('click', function () {
      var r = validate(true);
      if (!r.ok) { statusEl.textContent = 'Revisa los campos marcados antes de copiar.'; r.first.focus(); return; }
      statusEl.textContent = defaultStatus;
      var text = message(r.v);
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        ta.remove();
        flash(ok ? '¡Copiado!' : 'No se pudo copiar');
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { flash('¡Copiado!'); }, fallback);
      } else fallback();
    });

    renderPreview();
  }

  /* botones "Pedir este servicio" */
  $$('[data-service]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!quote) return;
      quote.setService(btn.getAttribute('data-service'));
      var target = $('#presupuesto');
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(quote.focusCar, 450);
    });
  });

  /* =======================================================
     Calculadora de mantenimiento
     ======================================================= */
  (function () {
    var cKm = $('#c-km'), cLast = $('#c-last'), cMeses = $('#c-meses'), cKmMes = $('#c-kmmes'),
        cAceite = $('#c-aceite'), cUso = $('#c-uso');
    if (!cKm) return;

    var el = {
      chip: $('#r-chip'), chipT: $('#r-chip-t'), big: $('#r-big'), sub: $('#r-sub'),
      fill: $('#r-fill'), int: $('#r-int'), next: $('#r-next'), date: $('#r-date'),
      interval: $('#r-interval'), limit: $('#r-limit'), formula: $('#r-formula'), list: $('#sched-list'), cta: $('#calc-to-quote')
    };

    var MAX_MONTHS = 12;
    var ITEMS = [
      { n: 'Filtro de habitáculo', every: 15000 },
      { n: 'Filtro de aire', every: 30000 },
      { n: 'Revisión de frenos y pastillas', every: 30000 },
      { n: 'Filtro de combustible', every: 60000 },
      { n: 'Bujías o calentadores', every: 60000 },
      { n: 'Distribución y bomba de agua', every: 120000 }
    ];
    var lastResult = null;

    function chip(state, text) {
      el.chip.setAttribute('data-state', state);
      el.chipT.textContent = text;
    }

    function idle(msg) {
      lastResult = null;
      chip('idle', 'Sin datos');
      el.big.textContent = '—';
      el.sub.textContent = msg;
      el.fill.style.width = '0%';
      el.int.textContent = '—';
      el.next.textContent = '—';
      el.date.textContent = '—';
      el.interval.textContent = '—';
      el.limit.textContent = '—';
      el.formula.textContent = '—';
      el.cta.disabled = true;
      el.cta.style.opacity = '.45';
      el.cta.style.pointerEvents = 'none';
      renderSchedule(NaN);
    }

    function renderSchedule(km) {
      el.list.textContent = '';
      if (!isFinite(km)) return;
      ITEMS.forEach(function (it) {
        var r = km % it.every;
        var remaining = (r === 0 && km > 0) ? 0 : it.every - r;
        var next = km + remaining;
        var badge = '';
        if (remaining > 0 && remaining <= 3000) badge = 'soon';
        else if (km >= it.every && r <= 1500) badge = 'check';

        var li = document.createElement('li');
        var n = document.createElement('span'); n.className = 's-n'; n.textContent = it.n;
        var a = document.createElement('span'); a.className = 's-m';
        a.innerHTML = '<b>Cada</b>' + fmt(it.every) + ' km';
        var b = document.createElement('span'); b.className = 's-m';
        b.innerHTML = '<b>Próxima marca</b>' + fmt(next) + ' km';
        var c = document.createElement('span'); c.className = 's-r';
        var left = document.createElement('span');
        left.textContent = remaining === 0 ? 'Toca ya' : 'Faltan ' + fmt(remaining) + ' km';
        c.appendChild(left);
        if (badge) {
          var bd = document.createElement('span');
          bd.className = 'badge ' + badge;
          bd.textContent = badge === 'soon' ? 'Pronto' : 'Confirmar';
          if (badge === 'check') bd.title = 'Has pasado esta marca hace poco: confirma que se hizo';
          c.appendChild(bd);
        }
        li.appendChild(n); li.appendChild(a); li.appendChild(b); li.appendChild(c);
        el.list.appendChild(li);
      });
    }

    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function round500(x) { return Math.round(x / 500) * 500; }

    function monthYear(d) {
      try { return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(d); }
      catch (e) { return d.toLocaleDateString(); }
    }

    function calc() {
      var km = num(cKm), last = num(cLast), meses = num(cMeses), kmMes = num(cKmMes);
      var bad = false;
      function chk(input, cond, msg) { if (cond) { setErr(input, msg); bad = true; } else setErr(input, ''); }

      chk(cKm, !isFinite(km) || km < 0 || km > 600000, 'Introduce los km actuales (0 a 600.000).');
      chk(cLast, !isFinite(last) || last < 0 || (isFinite(km) && last > km),
          isFinite(last) && isFinite(km) && last > km ? 'No puede superar los km actuales.' : 'Introduce los km del último cambio.');
      chk(cMeses, !isFinite(meses) || meses < 0 || meses > 60, 'Entre 0 y 60 meses.');
      chk(cKmMes, !isFinite(kmMes) || kmMes < 100 || kmMes > 8000, 'Entre 100 y 8.000 km al mes.');

      if (bad) { idle('Revisa los campos marcados para ver el resultado.'); return; }

      var base = Number(cAceite.value), factor = Number(cUso.value);
      var interval = round500(base * factor);
      el.formula.textContent = fmt(base) + ' km × ' + String(factor).replace('.', ',') + ' = ' + fmt(base * factor) +
        ' km, redondeado a ' + fmt(interval) + ' km';
      var done = km - last;
      var remKm = interval - done;
      var remMonths = MAX_MONTHS - meses;
      var pKm = done / interval;
      var pTime = meses / MAX_MONTHS;
      var progress = Math.max(pKm, pTime);
      var byTime = pTime > pKm;

      var state, label;
      if (progress >= 1) { state = 'due'; label = 'Toca ya'; }
      else if (progress >= 0.8) { state = 'soon'; label = 'Pronto'; }
      else { state = 'ok'; label = 'Al día'; }
      chip(state, label);

      // meses hasta que toca, por km y por tiempo
      var monthsKm = remKm / kmMes;
      var monthsLeft = Math.min(monthsKm, remMonths);

      if (state === 'due') {
        var over = [];
        if (remKm < 0) over.push(fmt(-remKm) + ' km');
        if (remMonths < 0) over.push(fmt(-remMonths) + (-remMonths === 1 ? ' mes' : ' meses'));
        el.big.textContent = over.length ? 'Pasado por ' + over.join(' y ') : 'Toca ya';
        el.sub.textContent = 'Te recomendamos cambiar el aceite cuanto antes: reserva cita y te lo hacemos esta semana.';
        el.date.textContent = 'Ahora';
      } else {
        el.big.textContent = 'Te quedan ' + fmt(remKm) + ' km';
        var d = new Date();
        d.setDate(d.getDate() + Math.round(monthsLeft * 30.44));
        el.date.textContent = cap(monthYear(d));
        el.sub.textContent = state === 'soon'
          ? 'Se acerca el momento: reserva cita y evita ir con el aceite agotado.'
          : 'Vas bien. Te avisaremos de lo que toque en la siguiente visita.';
      }

      el.fill.style.width = Math.min(100, progress * 100).toFixed(1) + '%';
      el.int.textContent = fmt(interval) + ' km';
      el.next.textContent = fmt(last + interval) + ' km';
      el.interval.textContent = fmt(interval) + ' km o ' + MAX_MONTHS + ' meses';
      el.limit.textContent = byTime ? 'El tiempo' : 'Los kilómetros';

      el.cta.disabled = false;
      el.cta.style.opacity = '';
      el.cta.style.pointerEvents = '';

      lastResult = {
        km: km, last: last, meses: meses, state: state, remKm: remKm, interval: interval,
        when: state === 'due' ? 'ya me toca' : 'me toca hacia ' + monthYear((function () {
          var dd = new Date(); dd.setDate(dd.getDate() + Math.round(monthsLeft * 30.44)); return dd;
        })())
      };
      renderSchedule(km);
    }

    $$('#calc-form input, #calc-form select').forEach(function (i) {
      i.addEventListener('input', calc);
      i.addEventListener('change', calc);
    });
    $('#calc-form').addEventListener('submit', function (e) { e.preventDefault(); });

    el.cta.addEventListener('click', function () {
      if (!lastResult || !quote) return;
      var r = lastResult;
      quote.setService('aceite');
      quote.appendNote('Llevo ' + fmt(r.km) + ' km; el último cambio de aceite fue a los ' + fmt(r.last) +
        ' km (hace ' + r.meses + (r.meses === 1 ? ' mes' : ' meses') + '), ' + r.when + '.');
      $('#presupuesto').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(quote.focusCar, 450);
    });

    calc();
  })();
})();
