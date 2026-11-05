/* =========================================================
   Taller Giroscopi · interacciones
   - Número de WhatsApp del taller: atributo data-wa del <body>
   - Menú móvil
   - Abierto o cerrado según la hora de Madrid
   - Formulario de presupuesto que prepara el mensaje de WhatsApp
   - Calculadora del próximo cambio de aceite
   - Botón flotante de WhatsApp (móvil): se oculta en la sección final
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var WA = (document.body.getAttribute('data-wa') || '').replace(/\D/g, '');
  var SHOP = 'Taller Giroscopi';

  var SERVICES = {
    otro: 'No lo sé u otra cosa',
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
    if (box && box.textContent !== (msg || '')) box.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
  function waUrl(text) {
    return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  /* ---------- enlaces de WhatsApp del taller ---------- */
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
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (btn.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) set(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) set(false); });
  })();

  /* ---------- abierto o cerrado (hora de Madrid) ---------- */
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
          return { head: 'Abierto ahora.', rest: 'Hoy cerramos a las ' + hhmm(slots[i][1]) + '.' };
        }
      }
      for (i = 0; i < slots.length; i++) {
        if (now.min < slots[i][0]) return { head: 'Cerrado ahora.', rest: 'Abrimos hoy a las ' + hhmm(slots[i][0]) + '.' };
      }
      for (var k = 1; k <= 7; k++) {
        var d = (now.day + k) % 7;
        if (WEEK[d].length) {
          var when = k === 1 ? 'mañana' : 'el ' + DAYS[d];
          return { head: 'Cerrado ahora.', rest: 'Abrimos ' + when + ' a las ' + hhmm(WEEK[d][0][0]) + '.' };
        }
      }
      return { head: 'Cerrado.', rest: '' };
    }

    var last = '';
    function render() {
      var now = madridNow();
      var st = status(now);
      var key = st.head + st.rest;
      if (key !== last) {
        last = key;
        $$('[data-open-status]').forEach(function (p) {
          var s = document.createElement('strong');
          s.textContent = st.head;
          p.textContent = '';
          p.appendChild(s);
          p.appendChild(document.createTextNode(' ' + st.rest));
        });
      }
      $$('.hours tr').forEach(function (tr) {
        var days = tr.getAttribute('data-days').split(',');
        if (days.indexOf(String(now.day)) !== -1) tr.setAttribute('aria-current', 'date');
        else tr.removeAttribute('aria-current');
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
        '*Problema:* ' + (v.problema || ph('qué necesitas o qué le pasa')),
        '*Urgencia:* ' + v.urgencia,
        '',
        '¿Me podéis dar precio y fecha? Gracias.'
      ].join('\n');
    }

    function nowHHMM() {
      try {
        return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
      } catch (e) { return ''; }
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

    function renderPreview() {
      var frag = document.createDocumentFragment();
      message(values()).split('\n').forEach(function (line) {
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

    function validate(show) {
      var v = values(), firstBad = null, ok = true;
      function check(input, msg) {
        if (msg) {
          ok = false;
          if (show) setErr(input, msg);
          if (!firstBad) firstBad = input;
        } else setErr(input, '');
      }
      check(fCoche, v.coche.length < 3 ? 'Indica la marca y el modelo del coche.' : '');
      var y = v.anio === '' ? null : Number(v.anio);
      check(fAnio, y !== null && (!isFinite(y) || y % 1 !== 0 || y < 1980 || y > maxYear) ? 'Pon un año entre 1980 y ' + maxYear + '.' : '');
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
        flash(ok ? 'Mensaje copiado' : 'No se ha podido copiar');
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { flash('Mensaje copiado'); }, fallback);
      } else fallback();
    });

    renderPreview();
  }

  function goToQuote() {
    $('#presupuesto').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    setTimeout(quote.focusCar, 450);
  }

  /* botones «Pedir presupuesto» de cada servicio */
  $$('[data-service]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!quote) return;
      quote.setService(btn.getAttribute('data-service'));
      goToQuote();
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
      box: $('#r-box'), chip: $('#r-chip'), big: $('#r-big'), sub: $('#r-sub'),
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

    function setState(state, text) {
      el.box.setAttribute('data-state', state);
      el.chip.textContent = text;
    }

    function idle(msg) {
      lastResult = null;
      setState('idle', 'Sin datos');
      el.big.textContent = '-';
      el.sub.textContent = msg;
      el.fill.style.width = '0%';
      ['int', 'next', 'date', 'interval', 'limit', 'formula'].forEach(function (k) { el[k].textContent = '-'; });
      el.cta.disabled = true;
      renderSchedule(NaN);
    }

    function cell(cls, label, value) {
      var s = document.createElement('span');
      s.className = cls;
      if (label) {
        var l = document.createElement('span'); l.className = 's-l'; l.textContent = label;
        s.appendChild(l);
      }
      s.appendChild(document.createTextNode(value));
      return s;
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
        li.appendChild(cell('s-n', '', it.n));
        li.appendChild(cell('s-m', 'Cada', fmt(it.every) + '\u00a0km'));
        li.appendChild(cell('s-m', 'Próxima a los', fmt(next) + '\u00a0km'));
        var c = document.createElement('span'); c.className = 's-r';
        var left = document.createElement('span');
        left.textContent = remaining === 0 ? 'Toca ya' : 'Faltan ' + fmt(remaining) + '\u00a0km';
        c.appendChild(left);
        if (badge) {
          var bd = document.createElement('span');
          bd.className = 'badge ' + badge;
          bd.textContent = badge === 'soon' ? 'Pronto' : 'Comprueba si se hizo';
          c.appendChild(bd);
        }
        li.appendChild(c);
        el.list.appendChild(li);
      });
    }

    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function round500(x) { return Math.round(x / 500) * 500; }
    function monthYear(d) {
      try { return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(d); }
      catch (e) { return d.toLocaleDateString(); }
    }
    function inMonths(m) {
      var d = new Date();
      d.setDate(d.getDate() + Math.round(m * 30.44));
      return d;
    }

    function calc() {
      var km = num(cKm), last = num(cLast), meses = num(cMeses), kmMes = num(cKmMes);
      var bad = false;
      function chk(input, cond, msg) { if (cond) { setErr(input, msg); bad = true; } else setErr(input, ''); }

      chk(cKm, !isFinite(km) || km < 0 || km > 600000, 'Pon los km actuales (de 0 a 600.000).');
      chk(cLast, !isFinite(last) || last < 0 || (isFinite(km) && last > km),
          isFinite(last) && isFinite(km) && last > km ? 'No puede ser mayor que los km actuales.' : 'Pon los km del último cambio.');
      chk(cMeses, !isFinite(meses) || meses < 0 || meses > 60, 'Entre 0 y 60 meses.');
      chk(cKmMes, !isFinite(kmMes) || kmMes < 100 || kmMes > 8000, 'Entre 100 y 8.000 km al mes.');

      if (bad) { idle('Revisa los campos marcados para ver el resultado.'); return; }

      var base = Number(cAceite.value), factor = Number(cUso.value);
      var interval = round500(base * factor);
      el.formula.textContent = fmt(base) + '\u00a0km × ' + String(factor).replace('.', ',') + ' = ' + fmt(base * factor) +
        '\u00a0km, redondeado a ' + fmt(interval) + '\u00a0km';
      var done = km - last;
      var remKm = interval - done;
      var remMonths = MAX_MONTHS - meses;
      var pKm = done / interval;
      var pTime = meses / MAX_MONTHS;
      var progress = Math.max(pKm, pTime);
      var byTime = pTime > pKm;

      var state;
      if (progress >= 1) { state = 'due'; setState(state, 'Toca ya'); }
      else if (progress >= 0.8) { state = 'soon'; setState(state, 'Pronto'); }
      else { state = 'ok'; setState(state, 'Al día'); }

      // meses hasta que toca: lo que llegue antes, los km o los 12 meses
      var monthsLeft = Math.min(remKm / kmMes, remMonths);

      if (state === 'due') {
        var over = [];
        if (remKm < 0) over.push(fmt(-remKm) + '\u00a0km');
        if (remMonths < 0) over.push(fmt(-remMonths) + (-remMonths === 1 ? '\u00a0mes' : '\u00a0meses'));
        el.big.textContent = over.length ? 'Te has pasado ' + over.join(' y ') : 'Toca ya';
        el.sub.textContent = 'Conviene cambiar el aceite cuanto antes. Pide cita y te lo hacemos esta semana.';
        el.date.textContent = 'Ahora';
      } else {
        el.big.textContent = 'Te quedan ' + fmt(remKm) + '\u00a0km';
        el.date.textContent = cap(monthYear(inMonths(monthsLeft)));
        el.sub.textContent = state === 'soon'
          ? 'Ya queda poco. Pide cita para no ir con el aceite gastado.'
          : 'Vas bien. En la próxima visita te avisamos de lo que toque.';
      }

      el.fill.style.width = Math.min(100, progress * 100).toFixed(1) + '%';
      el.int.textContent = fmt(interval) + '\u00a0km';
      el.next.textContent = fmt(last + interval) + '\u00a0km';
      el.interval.textContent = fmt(interval) + '\u00a0km o ' + MAX_MONTHS + '\u00a0meses';
      el.limit.textContent = byTime ? 'Los 12 meses' : 'Los kilómetros';
      el.cta.disabled = false;

      lastResult = {
        km: km, last: last, meses: meses,
        when: state === 'due' ? 'ya me toca' : 'me toca hacia ' + monthYear(inMonths(monthsLeft))
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
      quote.appendNote('Llevo ' + fmt(r.km) + '\u00a0km; el último cambio de aceite fue a los ' + fmt(r.last) +
        '\u00a0km (hace ' + r.meses + (r.meses === 1 ? '\u00a0mes' : '\u00a0meses') + ') y ' + r.when + '.');
      goToQuote();
    });

    calc();
  })();

  /* ---------- botón flotante: oculto cuando se ve la sección final ---------- */
  (function () {
    var fab = $('.fab'), end = $('#tu-web');
    if (!fab || !end || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      fab.classList.toggle('is-hidden', entries[0].isIntersecting);
    }).observe(end);
  })();
})();
