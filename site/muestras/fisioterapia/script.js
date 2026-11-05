/* Configuración de la sección «¿Quieres una web así para tu negocio?».
   Precio, plazo y número de WhatsApp se cambian solo aquí. */
const CONFIG = {
  precio: 395,
  plazo: '3 días laborables',
  whatsapp: '34623130633',
  mensaje: 'Hola, he visto la web de ejemplo de fisioterapia y me interesa una así por {precio} € con entrega en {plazo}. Mi negocio es: '
};

(function () {
  'use strict';

  const CLINICA = 'Fisio Camí';

  /* Franjas de cita, en minutos desde medianoche. */
  const FRANJAS = [
    { id: 'primera', nombre: 'primera hora', ini: 510, fin: 660 },
    { id: 'media', nombre: 'media mañana', ini: 660, fin: 840 },
    { id: 'tarde', nombre: 'tarde', ini: 930, fin: 1110 },
    { id: 'ultima', nombre: 'última hora', ini: 1110, fin: 1260 }
  ];

  /* Horario por día de la semana (0 = domingo). Si cambia, hay que cambiar también
     la tabla del mapa de horarios, el pie y el JSON-LD de index.html. */
  const HORARIO = {
    0: [],
    1: [[510, 840], [930, 1260]],
    2: [[510, 840], [930, 1260]],
    3: [[510, 840], [930, 1260]],
    4: [[510, 840], [930, 1260]],
    5: [[510, 840], [930, 1110]],
    6: [[540, 780]]
  };

  /* Minutos que tienen que quedar de una franja para poder pedirla para hoy. */
  const MARGEN = 30;

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIA_MS = 86400000;

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.prototype.slice.call((el || document).querySelectorAll(s));

  /* ---------- Fecha y hora de España ---------- */

  // Para probar: ?ahora=2026-11-09T10:30 (hora de España)
  const simulada = /[?&]ahora=(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(location.search);

  function ahora() {
    let y, mo, d, h, mi;
    if (simulada) {
      [y, mo, d, h, mi] = simulada.slice(1).map(Number);
    } else {
      try {
        const p = {};
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Madrid', year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
        }).formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
        y = +p.year; mo = +p.month; d = +p.day; h = +p.hour % 24; mi = +p.minute;
      } catch (e) {
        const n = new Date();
        y = n.getFullYear(); mo = n.getMonth() + 1; d = n.getDate(); h = n.getHours(); mi = n.getMinutes();
      }
    }
    return { fecha: Date.UTC(y, mo - 1, d), min: h * 60 + mi };
  }

  const diaSemana = f => new Date(f).getUTCDay();
  const iso = f => new Date(f).toISOString().slice(0, 10);
  const hora = m => Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

  function textoFecha(f) {
    const d = new Date(f);
    return DIAS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' de ' + MESES[d.getUTCMonth()];
  }

  const franjaPorId = id => FRANJAS.find(f => f.id === id);

  /* Parte de la franja en la que la clínica está abierta ese día, o null. */
  function tramoFranja(dia, franja) {
    for (const [a, b] of HORARIO[dia]) {
      const ini = Math.max(a, franja.ini);
      const fin = Math.min(b, franja.fin);
      if (fin > ini) return [ini, fin];
    }
    return null;
  }

  function quedaHueco(t, f) {
    const tramo = tramoFranja(diaSemana(t.fecha), f);
    return !!tramo && t.min < tramo[1] - MARGEN;
  }

  /* ---------- Abierto o cerrado ---------- */

  function estado(t) {
    const dia = diaSemana(t.fecha);
    const tramos = HORARIO[dia];
    for (const [a, b] of tramos) {
      if (t.min >= a && t.min < b) {
        return {
          abierto: true,
          texto: b - t.min <= 30 ? 'Abierto · cierra pronto, a las ' + hora(b) : 'Abierto ahora · cierra a las ' + hora(b)
        };
      }
    }
    for (const [a] of tramos) {
      if (t.min < a) return { abierto: false, texto: 'Cerrado ahora · abre hoy a las ' + hora(a) };
    }
    for (let n = 1; n <= 7; n++) {
      const d = (dia + n) % 7;
      if (HORARIO[d].length) {
        return { abierto: false, texto: 'Cerrado ahora · abre ' + (n === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + hora(HORARIO[d][0][0]) };
      }
    }
    return { abierto: false, texto: 'Cerrado' };
  }

  function pintarEstado(t) {
    const e = estado(t);
    $$('[data-estado]').forEach(el => {
      el.classList.toggle('estado--abierto', e.abierto);
      $('.estado__texto', el).textContent = e.texto;
    });
    const hoy = diaSemana(t.fecha);
    $$('.mapa tbody tr').forEach(tr => {
      const esHoy = Number(tr.dataset.dia) === hoy;
      tr.classList.toggle('hoy', esHoy);
      let etq = $('.hoy-etq', tr);
      if (esHoy && !etq) {
        etq = document.createElement('span');
        etq.className = 'hoy-etq';
        etq.textContent = 'Hoy';
        $('th', tr).appendChild(etq);
      } else if (!esHoy && etq) {
        etq.remove();
      }
    });
  }

  /* ---------- Formulario de cita ---------- */

  const form = $('#form-cita');
  const selTrat = $('#f-tratamiento');
  const selDia = $('#f-dia');
  const nombre = $('#f-nombre');
  const motivo = $('#f-motivo');
  const grupoFranjas = $('.franjas');
  const radios = $$('input[name="franja"]');
  const anuncio = $('#cita-anuncio');

  function anunciar(texto) {
    anuncio.textContent = '';
    setTimeout(() => { anuncio.textContent = texto; }, 60);
  }

  function rellenarDias(t) {
    const previo = selDia.value;
    while (selDia.options.length > 1) selDia.remove(1);
    for (let n = 0; n < 14; n++) {
      const f = t.fecha + n * DIA_MS;
      if (!HORARIO[diaSemana(f)].length) continue;
      if (n === 0 && !FRANJAS.some(fr => quedaHueco(t, fr))) continue;
      const pre = n === 0 ? 'Hoy, ' : n === 1 ? 'Mañana, ' : '';
      selDia.add(new Option(pre ? pre + textoFecha(f) : mayus(textoFecha(f)), iso(f)));
    }
    selDia.value = previo;
    if (selDia.value !== previo) selDia.value = '';
  }

  function actualizarFranjas() {
    const t = ahora();
    const valor = selDia.value;
    const fecha = valor ? Date.parse(valor) : null;
    radios.forEach(r => {
      const f = franjaPorId(r.value);
      let tramo = [f.ini, f.fin];
      let motivoNo = '';
      if (fecha !== null) {
        tramo = tramoFranja(diaSemana(fecha), f);
        if (!tramo) motivoNo = 'Cerrado ese día';
        else if (fecha === t.fecha && t.min >= tramo[1] - MARGEN) motivoNo = 'Hoy ya no hay hueco';
      }
      r.disabled = !!motivoNo;
      if (motivoNo && r.checked) r.checked = false;
      $('[data-horas="' + f.id + '"]').textContent = motivoNo || hora(tramo[0]) + ' a ' + hora(tramo[1]);
    });
  }

  function marcarError(campo, error, hayError) {
    error.hidden = !hayError;
    // El error solo se asocia al campo mientras se ve, para que no se lea antes de tiempo.
    if (hayError) campo.setAttribute('aria-describedby', error.id);
    else campo.removeAttribute('aria-describedby');
    if (campo === grupoFranjas) {
      grupoFranjas.classList.toggle('invalido', hayError);
    } else if (hayError) {
      campo.setAttribute('aria-invalid', 'true');
    } else {
      campo.removeAttribute('aria-invalid');
    }
  }

  function irAlFormulario(foco) {
    $('#cita').scrollIntoView({ block: 'start' });
    foco.focus({ preventScroll: true });
  }

  function textoTratamiento() {
    const partes = selTrat.options[selTrat.selectedIndex].text.split(' · ');
    if (partes.length === 3) return partes[0] + ' (' + partes[1] + ', ' + partes[2] + ')';
    return partes[0];
  }

  function mensajeCita() {
    const r = radios.find(x => x.checked);
    const f = franjaPorId(r.value);
    const horas = $('[data-horas="' + f.id + '"]').textContent;
    const lineas = [
      'Hola, quiero pedir cita en ' + CLINICA + '.',
      'Tratamiento: ' + textoTratamiento(),
      'Día: ' + (selDia.value ? textoFecha(Date.parse(selDia.value)) : 'el primer día con hueco'),
      'Franja: ' + f.nombre + ', de ' + horas,
      'Nombre: ' + nombre.value.trim()
    ];
    if (motivo.value.trim()) lineas.push('Lo que me pasa: ' + motivo.value.trim());
    return lineas.join('\n');
  }

  if (form) {
    rellenarDias(ahora());
    actualizarFranjas();

    selDia.addEventListener('change', actualizarFranjas);
    selTrat.addEventListener('change', () => marcarError(selTrat, $('#e-tratamiento'), false));
    nombre.addEventListener('input', () => { if (nombre.value.trim()) marcarError(nombre, $('#e-nombre'), false); });
    radios.forEach(r => r.addEventListener('change', () => marcarError(grupoFranjas, $('#e-franja'), false)));

    form.addEventListener('submit', e => {
      e.preventDefault();
      actualizarFranjas();
      const fallos = [];
      const sinTrat = !selTrat.value;
      const sinFranja = !radios.some(r => r.checked);
      const sinNombre = !nombre.value.trim();
      marcarError(selTrat, $('#e-tratamiento'), sinTrat);
      marcarError(grupoFranjas, $('#e-franja'), sinFranja);
      marcarError(nombre, $('#e-nombre'), sinNombre);
      if (sinTrat) fallos.push(selTrat);
      if (sinFranja) fallos.push(radios.find(r => !r.disabled) || selDia);
      if (sinNombre) fallos.push(nombre);
      if (fallos.length) {
        fallos[0].focus();
        return;
      }
      // En la web real: window.open('https://wa.me/34964XXXXXX?text=' + encodeURIComponent(mensajeCita()))
      abrirAviso('cita', mensajeCita());
    });

    // «Pedir cita» desde la lista de tratamientos
    $$('[data-pedir]').forEach(b => {
      b.addEventListener('click', () => {
        selTrat.value = b.dataset.pedir;
        marcarError(selTrat, $('#e-tratamiento'), false);
        anunciar('Tratamiento elegido: ' + textoTratamiento() + '. Ahora elige el día y la franja.');
        irAlFormulario(selDia);
      });
    });

    // Mapa de horarios: pulsar una franja la deja marcada en el formulario
    $$('.franja').forEach(b => {
      b.addEventListener('click', () => {
        const t = ahora();
        const dia = Number(b.dataset.dia);
        const f = franjaPorId(b.dataset.franja);
        let n = (dia - diaSemana(t.fecha) + 7) % 7;
        if (n === 0 && !quedaHueco(t, f)) n = 7;
        const fecha = t.fecha + n * DIA_MS;
        rellenarDias(t);
        selDia.value = iso(fecha);
        actualizarFranjas();
        const radio = radios.find(r => r.value === f.id);
        radio.checked = true;
        marcarError(grupoFranjas, $('#e-franja'), false);
        const tramo = tramoFranja(dia, f);
        anunciar('Has elegido el ' + textoFecha(fecha) + ', ' + f.nombre + ', de ' + hora(tramo[0]) + ' a ' + hora(tramo[1]) + '.' +
          (selTrat.value ? '' : ' Ahora elige el tratamiento.'));
        irAlFormulario(selTrat.value ? nombre : selTrat);
      });
    });
  }

  /* ---------- Avisos de demostración ---------- */

  const AVISOS = {
    llamar: 'En la web de la clínica, este botón llamaría directamente al teléfono de la clínica.',
    whatsapp: 'En la web de la clínica, este botón abriría el chat de WhatsApp con la clínica.',
    email: 'En la web de la clínica, este enlace abriría tu programa de correo para escribir a la clínica.',
    mapa: 'En la web de la clínica, este botón abriría la ubicación en el mapa del móvil.',
    legal: 'En la web de la clínica, aquí estarían el aviso legal y la política de privacidad.',
    cita: 'En la web de la clínica, este botón abriría WhatsApp con este mensaje ya escrito. Solo faltaría pulsar enviar.'
  };

  const dialogo = $('#aviso');
  let vuelta = null;

  function abrirAviso(tipo, mensaje) {
    const texto = AVISOS[tipo] || AVISOS.whatsapp;
    if (!dialogo || typeof dialogo.showModal !== 'function') {
      window.alert(texto + (mensaje ? '\n\n' + mensaje : ''));
      return;
    }
    $('#aviso-texto').textContent = texto;
    const pre = $('#aviso-mensaje');
    pre.textContent = mensaje || '';
    pre.hidden = !mensaje;
    $('#aviso-pie').hidden = !mensaje;
    vuelta = document.activeElement;
    dialogo.showModal();
  }

  if (dialogo) {
    dialogo.addEventListener('close', () => {
      if (vuelta && document.contains(vuelta)) vuelta.focus();
      vuelta = null;
    });
    // Cerrar al pulsar fuera del recuadro
    dialogo.addEventListener('click', e => {
      if (e.target !== dialogo) return;
      const r = dialogo.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialogo.close();
    });
  }

  $$('[data-aviso]').forEach(b => b.addEventListener('click', () => abrirAviso(b.dataset.aviso)));

  /* ---------- Menú en móvil ---------- */

  const btnMenu = $('.menu-btn');
  const nav = $('#menu');

  function menu(abrir) {
    btnMenu.setAttribute('aria-expanded', String(abrir));
    nav.classList.toggle('abierta', abrir);
  }

  if (btnMenu && nav) {
    btnMenu.addEventListener('click', () => menu(btnMenu.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach(a => a.addEventListener('click', () => menu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && btnMenu.getAttribute('aria-expanded') === 'true') {
        menu(false);
        btnMenu.focus();
      }
    });
    document.addEventListener('click', e => {
      if (btnMenu.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !btnMenu.contains(e.target)) menu(false);
    });
    const escritorio = window.matchMedia('(min-width: 861px)');
    const alCambiar = () => { if (escritorio.matches) menu(false); };
    if (escritorio.addEventListener) escritorio.addEventListener('change', alCambiar);
  }

  /* ---------- Botón flotante: se oculta mientras se ve el botón del hero, en la cita, en el pie y en la sección comercial ---------- */

  const flotante = $('.wa-flotante');
  if (flotante && 'IntersectionObserver' in window) {
    const visibles = new Set();
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(en => { if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target); });
      flotante.classList.toggle('oculto', visibles.size > 0);
    }, { rootMargin: '-64px 0px 0px 0px' }); // la franja superior queda tapada por el banner
    $$('.hero .btn, #cita, .pie, .oferta').forEach(el => io.observe(el));
  }

  /* ---------- Sección comercial ---------- */

  $$('[data-cfg]').forEach(el => {
    const v = CONFIG[el.dataset.cfg];
    if (v !== undefined) el.textContent = v;
  });
  const textoWa = CONFIG.mensaje.replace('{precio}', CONFIG.precio).replace('{plazo}', CONFIG.plazo);
  $$('[data-cfg-wa]').forEach(a => {
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(textoWa);
  });

  /* ---------- Arranque ---------- */

  pintarEstado(ahora());
  if (!simulada) {
    setInterval(() => {
      const t = ahora();
      pintarEstado(t);
      if (form) { rellenarDias(t); actualizarFranjas(); }
    }, 60000);
  }
})();
