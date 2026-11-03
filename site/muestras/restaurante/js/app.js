/* ==========================================================
   Arrossos del Marjal · Interacción
   ========================================================== */
(function () {
  "use strict";

  const D = window.MARJAL;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

  const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  const fechaLarga = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });

  const ALERGENO = {};
  D.ALERGENOS.forEach((a) => { ALERGENO[a.id] = a.nombre; });

  /* ---------- Utilidades de fecha y hora ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const aISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const deISO = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 ? d : null;
  };
  const aMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const hoy0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const sumarDias = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const mismoDia = (a, b) => aISO(a) === aISO(b);
  const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const minutosAhora = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

  // Turnos disponibles para una fecha (descarta los de hoy con menos margen del exigido)
  function turnosDe(fecha) {
    const t = D.TURNOS[fecha.getDay()];
    const esHoy = mismoDia(fecha, new Date());
    const limite = minutosAhora() + D.MARGEN_MIN;
    const marca = (lista) => lista.map((h) => ({ h, ok: !esHoy || aMin(h) >= limite }));
    return { comida: marca(t.comida), cena: marca(t.cena) };
  }
  const hayTurnos = (fecha) => {
    const t = turnosDe(fecha);
    return t.comida.concat(t.cena).some((x) => x.ok);
  };
  function proximaFechaCon(diaSemana) {
    const base = hoy0();
    for (let i = 0; i <= D.DIAS_VISTA; i++) {
      const f = sumarDias(base, i);
      if ((diaSemana === undefined || f.getDay() === diaSemana) && hayTurnos(f)) return f;
    }
    return null;
  }

  /* ---------- Cabecera y navegación ---------- */
  const cabecera = $("#cabecera");
  const navBoton = $("#navBoton");
  const nav = $("#nav");

  function cerrarNav() {
    nav.classList.remove("abierto");
    navBoton.setAttribute("aria-expanded", "false");
    navBoton.setAttribute("aria-label", "Abrir menú");
  }
  navBoton.addEventListener("click", () => {
    const abrir = navBoton.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("abierto", abrir);
    navBoton.setAttribute("aria-expanded", String(abrir));
    navBoton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", cerrarNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("abierto")) { cerrarNav(); navBoton.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("abierto") && !cabecera.contains(e.target)) cerrarNav();
  });
  window.matchMedia("(min-width: 860px)").addEventListener("change", (e) => { if (e.matches) cerrarNav(); });

  const alScroll = () => cabecera.classList.toggle("con-sombra", window.scrollY > 8);
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  /* ---------- Estado: abierto / cerrado ---------- */
  function textoEstado() {
    const ahora = new Date();
    const min = minutosAhora();
    const tramos = D.HORARIO[ahora.getDay()];
    for (const [a, c] of tramos) {
      if (min >= aMin(a) && min < aMin(c)) return { abierto: true, texto: `Abierto ahora · hasta las ${c}` };
    }
    for (let i = 0; i < 8; i++) {
      const f = sumarDias(hoy0(), i);
      const t = D.HORARIO[f.getDay()].find(([a]) => i > 0 || aMin(a) > min);
      if (t) {
        const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[f.getDay()]}`;
        return { abierto: false, texto: `Cerrado · abrimos ${cuando} a las ${t[0]}` };
      }
    }
    return { abierto: false, texto: "Cerrado" };
  }
  function pintarEstado() {
    const el = $("#estado");
    const e = textoEstado();
    el.classList.toggle("abierto", e.abierto);
    el.classList.toggle("cerrado", !e.abierto);
    $(".estado__texto", el).textContent = e.texto;
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ---------- Tabla de horario ---------- */
  (function pintarHorario() {
    const tbody = $("#tablaHorario tbody");
    const hoy = new Date().getDay();
    tbody.innerHTML = ORDEN_SEMANA.map((d) => {
      const tramos = D.HORARIO[d];
      const txt = tramos.length
        ? tramos.map(([a, c]) => `${a} – ${c}`).join("<br>")
        : '<span class="cerrado">Cerrado</span>';
      return `<tr${d === hoy ? ' class="hoy"' : ""}><th scope="row">${capital(DIAS[d])}</th><td>${txt}</td></tr>`;
    }).join("");
  })();

  /* ---------- Menú del día ---------- */
  const diasEl = $("#dias");
  const menuPanel = $("#menuPanel");
  const ICONO = (id, extra) => `<svg class="icono${extra ? " " + extra : ""}" aria-hidden="true"><use href="#${id}"/></svg>`;

  function marcasMenu(op) {
    let m = "";
    if (op.veg) m += `<span class="tag tag--veg tag--mini" title="Vegetariano">${ICONO("i-hoja")}<span class="visualmente-oculto">Vegetariano</span></span>`;
    if (op.arroz) m += `<span class="tag tag--arroz tag--mini">mín. 2</span>`;
    return m ? `<span class="md__marcas">${m}</span>` : "";
  }

  function pintarMenu(dia) {
    const menu = D.MENU_DIA[dia];
    const esHoy = dia === new Date().getDay();
    const proxima = proximaFechaCon(dia);
    const textoReserva = !proxima ? "" : mismoDia(proxima, new Date())
      ? "Reservar para hoy"
      : `Reservar el ${DIAS[dia]} ${proxima.getDate()}`;
    const etiqueta = esHoy ? `Hoy, ${DIAS[dia]}` : capital(DIAS[dia]);

    if (!menu) {
      menuPanel.innerHTML = `
        <div class="md__cerrado">
          <svg aria-hidden="true"><use href="#i-ola"/></svg>
          <div>
            <p class="md__dia">${etiqueta}</p>
            <h3 class="md__titulo">Los lunes, descansamos</h3>
            <p>La paellera también necesita su día de playa. Volvemos el martes con el menú de siempre.</p>
            <button type="button" class="boton boton--contorno" data-ver-dia="2">Ver el menú del martes</button>
          </div>
        </div>`;
      return;
    }

    const cursos = menu.platos.map((c) => `
      <div class="md__curso${c.todos ? " md__curso--todos" : ""}">
        <h4>${c.curso}</h4>
        <ul>${c.opciones.map((o) => `<li>${o.n}${marcasMenu(o)}</li>`).join("")}</ul>
      </div>`).join("");

    menuPanel.innerHTML = `
      <div class="md__cabecera">
        <div>
          <p class="md__dia">${etiqueta}</p>
          <h3 class="md__titulo">${menu.titulo}</h3>
          ${menu.destacado ? `<p class="md__destacado">${menu.destacado}</p>` : ""}
        </div>
        <div class="md__precio"><strong>${euros.format(menu.precio)}</strong><span>por persona, IVA incl.</span></div>
      </div>
      <div class="md__cursos">${cursos}</div>
      <div class="md__pie">
        <p class="md__incluye">${ICONO("i-check")}${menu.incluye}. El arroz del menú se sirve para toda la mesa (mín. 2 personas).</p>
        ${textoReserva ? `<button type="button" class="boton boton--azafran boton--peq" data-reservar-dia="${dia}">
          ${textoReserva} ${ICONO("i-flecha")}
        </button>` : ""}
      </div>`;
  }

  function seleccionarDia(dia, enfocar) {
    $$(".dia", diasEl).forEach((b) => {
      const sel = Number(b.dataset.dia) === dia;
      b.setAttribute("aria-selected", String(sel));
      b.tabIndex = sel ? 0 : -1;
      if (sel) {
        menuPanel.setAttribute("aria-labelledby", b.id);
        if (enfocar) b.focus();
        // centra la pestaña en la tira sin mover la página
        diasEl.scrollLeft = b.offsetLeft - (diasEl.clientWidth - b.offsetWidth) / 2;
      }
    });
    pintarMenu(dia);
  }

  (function iniciarMenu() {
    const hoy = new Date().getDay();
    diasEl.innerHTML = ORDEN_SEMANA.map((d) => `
      <button type="button" role="tab" class="dia${D.MENU_DIA[d] ? "" : " dia--cerrado"}" id="tab-dia-${d}"
        data-dia="${d}" aria-controls="menuPanel" aria-selected="false" tabindex="-1"
        aria-label="${d === hoy ? "Hoy " : ""}${DIAS_CORTOS[d]}, ${DIAS[d]}${D.MENU_DIA[d] ? "" : ", cerrado"}">
        <small>${d === hoy ? "Hoy" : ""}</small> <span>${DIAS_CORTOS[d]}</span>
      </button>`).join("");

    diasEl.addEventListener("click", (e) => {
      const b = e.target.closest(".dia");
      if (b) seleccionarDia(Number(b.dataset.dia));
    });
    diasEl.addEventListener("keydown", (e) => {
      const botones = $$(".dia", diasEl);
      const i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % botones.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + botones.length) % botones.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = botones.length - 1;
      if (j !== null) { e.preventDefault(); seleccionarDia(Number(botones[j].dataset.dia), true); }
    });
    menuPanel.addEventListener("click", (e) => {
      const ver = e.target.closest("[data-ver-dia]");
      if (ver) { seleccionarDia(Number(ver.dataset.verDia), true); return; }
      const res = e.target.closest("[data-reservar-dia]");
      if (res) reservarDia(Number(res.dataset.reservarDia));
    });

    seleccionarDia(hoy);
  })();

  /* ---------- Carta ---------- */
  const estado = { cat: "todo", veg: false, sin: new Set() };
  const listado = $("#cartaListado");
  const resumen = $("#resumenCarta");
  const limpiar = $("#limpiarFiltros");
  const catEl = $("#categorias");
  const soloVeg = $("#soloVeg");
  const botonAl = $("#botonAlergenos");
  const panelAl = $("#panelAlergenos");
  const opcionesAl = $("#alergenosOpciones");
  const contadorAl = $("#contadorAlergenos");

  const pasaFiltros = (p) => (!estado.veg || p.veg) && !p.alergenos.some((a) => estado.sin.has(a));

  function tarjeta(p) {
    const marcas = [];
    if (p.veg) marcas.push(`<span class="tag tag--veg">${ICONO("i-hoja")}Vegetariano</span>`);
    if (p.arroz) {
      marcas.push(`<span class="tag tag--arroz">${ICONO("i-grupo")}Mín. 2 personas</span>`);
      marcas.push(`<span class="tag tag--tiempo">${ICONO("i-reloj")}${p.espera} min</span>`);
    }
    const alerg = p.alergenos.length
      ? p.alergenos.map((a) => `<li>${ALERGENO[a]}</li>`).join("")
      : '<li class="sin">Sin alérgenos declarados</li>';
    return `
      <article class="plato${p.arroz ? " plato--arroz" : ""}">
        <div class="plato__top">
          <h4 class="plato__nombre">${p.nombre}</h4>
          <p class="plato__precio">${euros.format(p.precio)}${p.arroz ? "<small>por persona</small>" : ""}</p>
        </div>
        <p class="plato__desc">${p.desc}</p>
        ${marcas.length ? `<div class="plato__marcas">${marcas.join("")}</div>` : ""}
        <ul class="plato__alergenos" aria-label="Alérgenos">${alerg}</ul>
        ${p.arroz ? `<button type="button" class="plato__encargar" data-encargar="${p.id}">Encargar al reservar ${ICONO("i-flecha")}</button>` : ""}
      </article>`;
  }

  function pintarCarta() {
    const visibles = D.CARTA.filter(pasaFiltros);

    // contadores en las categorías
    $$(".chip", catEl).forEach((b) => {
      const c = b.dataset.cat;
      const n = visibles.filter((p) => c === "todo" || p.cat === c).length;
      $(".chip__n", b).textContent = n;
      b.setAttribute("aria-pressed", String(c === estado.cat));
    });

    const enCat = visibles.filter((p) => estado.cat === "todo" || p.cat === estado.cat);
    const grupos = D.CATEGORIAS
      .filter((c) => estado.cat === "todo" || c.id === estado.cat)
      .map((c) => ({ c, platos: enCat.filter((p) => p.cat === c.id) }))
      .filter((g) => g.platos.length);

    const hayFiltros = estado.veg || estado.sin.size > 0;
    limpiar.hidden = !hayFiltros;

    if (!enCat.length) {
      resumen.textContent = "Ningún plato cumple todos los filtros.";
      listado.innerHTML = `
        <div class="vacio">
          <svg aria-hidden="true"><use href="#i-ola"/></svg>
          <h3>Aquí no hay nada que te podamos ofrecer</h3>
          <p>Con estos filtros no queda ningún plato en esta sección. Prueba con otra categoría o quita algún filtro; y si lo prefieres, pregúntanos: adaptamos muchos platos.</p>
          <button type="button" class="boton boton--contorno boton--peq" data-limpiar>Quitar filtros</button>
        </div>`;
      return;
    }

    const partes = [];
    if (estado.veg) partes.push("vegetarianos");
    if (estado.sin.size) {
      const n = Array.from(estado.sin).map((a) => ALERGENO[a].toLowerCase());
      partes.push("sin " + (n.length > 1 ? n.slice(0, -1).join(", ") + " ni " + n[n.length - 1] : n[0]));
    }
    resumen.textContent = `${enCat.length} ${enCat.length === 1 ? "plato" : "platos"}${partes.length ? " " + partes.join(" y ") : ""}.`;

    listado.innerHTML = grupos.map((g) => `
      <section class="grupo" aria-labelledby="g-${g.c.id}">
        <header class="grupo__cabecera">
          <h3 class="grupo__titulo" id="g-${g.c.id}">${g.c.nombre}</h3>
          <p class="grupo__nota">${g.c.nota}</p>
        </header>
        <div class="grupo__rejilla">${g.platos.map(tarjeta).join("")}</div>
      </section>`).join("");
  }

  (function iniciarCarta() {
    const cats = [{ id: "todo", nombre: "Todo" }].concat(D.CATEGORIAS);
    catEl.innerHTML = cats.map((c) =>
      `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="false">${c.nombre} <span class="chip__n"></span></button>`
    ).join("");
    catEl.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      estado.cat = b.dataset.cat;
      pintarCarta();
    });

    opcionesAl.innerHTML = D.ALERGENOS.map((a) =>
      `<button type="button" class="chip-alergeno" data-alergeno="${a.id}" aria-pressed="false">${ICONO("i-cerrar")}<span>${a.nombre}</span></button>`
    ).join("");
    opcionesAl.addEventListener("click", (e) => {
      const b = e.target.closest(".chip-alergeno");
      if (!b) return;
      const id = b.dataset.alergeno;
      if (estado.sin.has(id)) estado.sin.delete(id); else estado.sin.add(id);
      b.setAttribute("aria-pressed", String(estado.sin.has(id)));
      b.setAttribute("aria-label", `${ALERGENO[id]}${estado.sin.has(id) ? ": excluido" : ""}`);
      contadorAl.textContent = estado.sin.size;
      contadorAl.hidden = estado.sin.size === 0;
      pintarCarta();
    });

    botonAl.addEventListener("click", () => {
      const abrir = panelAl.hidden;
      panelAl.hidden = !abrir;
      botonAl.setAttribute("aria-expanded", String(abrir));
    });
    if (window.matchMedia("(min-width: 760px)").matches) {
      panelAl.hidden = false;
      botonAl.setAttribute("aria-expanded", "true");
    }

    soloVeg.addEventListener("change", () => { estado.veg = soloVeg.checked; pintarCarta(); });

    const quitar = () => {
      estado.veg = false;
      estado.sin.clear();
      soloVeg.checked = false;
      $$(".chip-alergeno", opcionesAl).forEach((b) => { b.setAttribute("aria-pressed", "false"); b.removeAttribute("aria-label"); });
      contadorAl.hidden = true;
      contadorAl.textContent = "0";
      estado.cat = "todo";
      pintarCarta();
    };
    limpiar.addEventListener("click", quitar);
    listado.addEventListener("click", (e) => {
      if (e.target.closest("[data-limpiar]")) { quitar(); return; }
      const enc = e.target.closest("[data-encargar]");
      if (enc) encargarArroz(enc.dataset.encargar);
    });

    pintarCarta();
  })();

  /* ---------- Reserva ---------- */
  const form = $("#formReserva");
  const fecha = $("#fecha");
  const horas = $("#horas");
  const comensales = $("#comensales");
  const menos = $("#menos");
  const mas = $("#mas");
  const arroz = $("#arroz");
  const raciones = $("#raciones");
  const arrozAyuda = $("#arrozAyuda");
  const nombre = $("#nombre");
  const notas = $("#notas");
  const burbuja = $("#burbuja");
  const ok = $("#reservaOk");
  const AYUDA_ARROZ = arrozAyuda.textContent;
  const ARROCES = D.CARTA.filter((p) => p.arroz);
  const horaElegida = () => { const r = form.querySelector('input[name="hora"]:checked'); return r ? r.value : ""; };

  // límites de fecha
  const minF = hoy0();
  const maxF = sumarDias(minF, D.DIAS_VISTA);
  fecha.min = aISO(minF);
  fecha.max = aISO(maxF);

  // selector de arroz agrupado por categoría
  arroz.innerHTML = '<option value="">Lo decidimos en la mesa</option>' +
    D.CATEGORIAS.filter((c) => c.arroz).map((c) =>
      `<optgroup label="${c.nombre}">${ARROCES.filter((p) => p.cat === c.id)
        .map((p) => `<option value="${p.id}">${p.nombre} · ${euros.format(p.precio)}/pers.</option>`).join("")}</optgroup>`
    ).join("");

  const setError = (campo, idError, msg) => {
    const el = $("#" + idError);
    el.textContent = msg || "";
    if (campo) campo.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  function pintarHoras() {
    const anterior = horaElegida();
    const f = deISO(fecha.value);
    setError(null, "horaError", "");
    horas.classList.remove("invalido");

    if (!f) { horas.innerHTML = '<p class="horas__vacio">Elige primero el día.</p>'; return; }
    if (f.getDay() === 1) { horas.innerHTML = '<p class="horas__vacio">Los lunes cerramos por descanso. Prueba con otro día.</p>'; return; }

    const t = turnosDe(f);
    const libres = t.comida.concat(t.cena).filter((x) => x.ok);
    if (!libres.length) {
      horas.innerHTML = '<p class="horas__vacio">Para hoy ya no quedan turnos online. Llámanos al <a href="tel:+34600123456">600 12 34 56</a> o elige otro día.</p>';
      return;
    }
    const grupo = (titulo, lista) => !lista.length ? "" : `
      <div class="horas__grupo">
        <p>${titulo}</p>
        <div class="horas__lista">${lista.map((x) => `
          <label class="hora"><input type="radio" name="hora" value="${x.h}" ${x.ok ? "" : "disabled"} ${x.ok && x.h === anterior ? "checked" : ""}><span>${x.h}</span></label>`).join("")}
        </div>
      </div>`;
    horas.innerHTML = grupo("Comida", t.comida) + grupo("Cena", t.cena);
  }

  function validarFecha() {
    const f = deISO(fecha.value);
    if (!fecha.value) { setError(fecha, "fechaError", "Elige el día de la reserva."); return false; }
    if (!f) { setError(fecha, "fechaError", "La fecha no es válida."); return false; }
    if (f < minF) { setError(fecha, "fechaError", "Esa fecha ya ha pasado."); return false; }
    if (f > maxF) { setError(fecha, "fechaError", `Solo aceptamos reservas hasta el ${fechaLarga.format(maxF)}.`); return false; }
    if (f.getDay() === 1) { setError(fecha, "fechaError", "Los lunes cerramos por descanso."); return false; }
    if (!hayTurnos(f)) { setError(fecha, "fechaError", ""); return false; } // el aviso ya aparece en las horas
    setError(fecha, "fechaError", "");
    return true;
  }

  function nComensales() {
    const n = parseInt(comensales.value, 10);
    return Number.isFinite(n) ? Math.min(D.MAX_COMENSALES, Math.max(1, n)) : 1;
  }
  function fijarComensales(n) {
    comensales.value = n;
    menos.disabled = n <= 1;
    mas.disabled = n >= D.MAX_COMENSALES;
    pintarRaciones();
  }

  function pintarRaciones() {
    const n = nComensales();
    const elegido = arroz.value;
    const previa = parseInt(raciones.value, 10);
    if (n < 2) {
      arroz.value = "";
      arroz.disabled = true;
      raciones.innerHTML = "<option>—</option>";
      raciones.disabled = true;
      arrozAyuda.textContent = "Los arroces y fideuàs se preparan para un mínimo de 2 personas.";
      arrozAyuda.classList.add("aviso");
      return;
    }
    arroz.disabled = false;
    arrozAyuda.classList.remove("aviso");
    if (!elegido) {
      raciones.innerHTML = "<option>—</option>";
      raciones.disabled = true;
      arrozAyuda.textContent = AYUDA_ARROZ;
      return;
    }
    const valor = Number.isFinite(previa) ? Math.min(n, Math.max(2, previa)) : n;
    let opts = "";
    for (let i = 2; i <= n; i++) opts += `<option value="${i}"${i === valor ? " selected" : ""}>${i} raciones</option>`;
    raciones.innerHTML = opts;
    raciones.disabled = false;
    const p = ARROCES.find((x) => x.id === elegido);
    arrozAyuda.textContent = `Lo empezamos a cocinar ${p.espera} min antes de vuestra hora: al sentaros, a la mesa.`;
  }

  function datos() {
    const f = deISO(fecha.value);
    const h = horaElegida();
    const zona = form.querySelector('input[name="zona"]:checked');
    const p = ARROCES.find((x) => x.id === arroz.value);
    return {
      fecha: f && validarFechaSilenciosa(f) ? capital(fechaLarga.format(f)) : "",
      hora: h || "",
      comensales: nComensales(),
      zona: zona ? zona.value : "",
      arroz: p && !arroz.disabled ? `${p.nombre} (${raciones.value} raciones)` : "",
      nombre: nombre.value.trim(),
      notas: notas.value.trim().replace(/\s+/g, " ")
    };
  }
  function validarFechaSilenciosa(f) {
    return f >= minF && f <= maxF && f.getDay() !== 1 && hayTurnos(f);
  }

  function mensaje(d, conHuecos) {
    const v = (x, hueco) => x || (conHuecos ? hueco : "");
    const lineas = [
      "¡Hola, Arrossos del Marjal! Quería reservar mesa:",
      "",
      `📅 Día: ${v(d.fecha, "…")}`,
      `🕐 Hora: ${v(d.hora, "…")}`,
      `👥 Comensales: ${d.comensales} ${d.comensales === 1 ? "persona" : "personas"}`
    ];
    if (d.zona) lineas.push(`☀️ Zona: ${d.zona}`);
    if (d.arroz) lineas.push(`🥘 Arroz encargado: ${d.arroz}`);
    if (d.notas) lineas.push(`📝 Notas: ${d.notas}`);
    lineas.push("", `A nombre de: ${v(d.nombre, "…")}`, "", "¡Gracias!");
    return lineas.join("\n");
  }

  function pintarVista() {
    const d = datos();
    const texto = mensaje(d, true);
    // escapamos y marcamos los huecos pendientes
    const esc = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    burbuja.innerHTML = esc.replace(/…/g, '<span class="pendiente">pendiente</span>');
    const ahora = new Date();
    burbuja.dataset.hora = `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
  }

  // eventos del formulario
  fecha.addEventListener("change", () => { validarFecha(); pintarHoras(); pintarVista(); });
  horas.addEventListener("change", () => { setError(null, "horaError", ""); horas.classList.remove("invalido"); pintarVista(); });
  menos.addEventListener("click", () => { fijarComensales(nComensales() - 1); pintarVista(); });
  mas.addEventListener("click", () => { fijarComensales(nComensales() + 1); pintarVista(); });
  comensales.addEventListener("input", () => { if (comensales.value !== "") { pintarRaciones(); pintarVista(); } });
  comensales.addEventListener("change", () => { fijarComensales(nComensales()); pintarVista(); });
  arroz.addEventListener("change", () => { pintarRaciones(); pintarVista(); });
  raciones.addEventListener("change", pintarVista);
  form.addEventListener("change", (e) => { if (e.target.name === "zona") pintarVista(); });
  nombre.addEventListener("input", () => { if (nombre.value.trim()) setError(nombre, "nombreError", ""); pintarVista(); });
  notas.addEventListener("input", pintarVista);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ok.hidden = true;
    const errores = [];

    if (!validarFecha()) errores.push(fecha);
    pintarHoras();
    const hora = horaElegida();
    if (fecha.value && !hora && deISO(fecha.value) && validarFechaSilenciosa(deISO(fecha.value))) {
      setError(null, "horaError", "Elige una hora.");
      horas.classList.add("invalido");
      errores.push(horas.querySelector("input:not(:disabled)"));
    }
    if (!nombre.value.trim()) { setError(nombre, "nombreError", "Dinos a nombre de quién va la reserva."); errores.push(nombre); }
    else setError(nombre, "nombreError", "");

    if (errores.length) { pintarVista(); if (errores[0]) errores[0].focus(); return; }

    const url = `https://wa.me/${D.WHATSAPP}?text=${encodeURIComponent(mensaje(datos(), false))}`;
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.target = "_blank";
    enlace.rel = "noopener";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    ok.innerHTML = `${ICONO("i-check")}<span>¡Listo! Hemos abierto WhatsApp con tu mensaje. Envíalo y te confirmaremos la mesa en el mismo chat.</span>`;
    ok.hidden = false;
  });

  // accesos desde otras secciones
  function irAReserva(foco) {
    $("#reservar").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (foco) setTimeout(() => foco.focus({ preventScroll: true }), 450);
  }
  function reservarDia(dia) {
    const f = proximaFechaCon(dia);
    if (f) { fecha.value = aISO(f); validarFecha(); pintarHoras(); pintarVista(); }
    irAReserva(horas.querySelector("input:not(:disabled)") || fecha);
  }
  function encargarArroz(id) {
    if (nComensales() < 2) fijarComensales(2);
    arroz.value = id;
    pintarRaciones();
    pintarVista();
    irAReserva(arroz);
  }

  // estado inicial: primer día con turnos libres
  const primera = proximaFechaCon();
  if (primera) fecha.value = aISO(primera);
  fijarComensales(2);
  pintarHoras();
  pintarVista();

  /* ---------- CTA flotante en móvil ---------- */
  const cta = $("#ctaMovil");
  if ("IntersectionObserver" in window) {
    const visibles = new Set();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => { if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target); });
      cta.classList.toggle("oculto", visibles.size > 0);
    }, { threshold: 0.05 });
    [$("#inicio"), $("#reservar")].forEach((s) => io.observe(s));
  }

  $("#anio").textContent = new Date().getFullYear();
})();
