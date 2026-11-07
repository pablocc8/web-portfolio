# Navaja & Azahar · demo de barbería

Web de muestra para un negocio **ficticio** (barbería de autor en Castelló de la Plana). Es una pieza de escaparate comercial: no representa a ningún negocio real.

- Ruta pública prevista: `/web-portfolio/muestras/barberia/`
- Funciona igual abriendo `index.html` con doble clic (sin servidor, sin build, sin módulos, sin `fetch`).
- Archivos: `index.html`, `styles.css`, `script.js`, `favicon.svg`, `fonts/`, `LICENSE-lucide.txt`.

---

## 1. Decisiones de diseño (antes de escribir código)

### Concepto en una frase
**El oficio clásico de la navaja con el aroma de la tierra: una barbería de autor en Castelló que huele a toalla caliente y a azahar.**

El nombre une las dos ideas: la *navaja* (oficio, precisión, ritual) y el *azahar* (la flor del naranjo, símbolo de la Plana). Todo el sistema visual sale de ahí: negro de sillón de cuero, latón de bacía antigua, crema de espuma de afeitar y un único punto naranja, el de la naranja de Castelló.

### Paleta (contraste comprobado con la fórmula WCAG 2.1)

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--bg` negro cálido | `#13100D` | Fondo principal | — |
| `--bg-2` | `#1B1713` | Bandas alternas | — |
| `--bg-3` | `#241F1A` | Superficies, tarjetas | — |
| `--cream` crema | `#F2E9D8` | Texto principal | 15,7:1 sobre `--bg` (AAA) |
| `--brass` latón | `#C8A15A` | Acentos, líneas, botón principal | 7,9:1 sobre `--bg`, 6,8:1 sobre `--bg-3` (AA/AAA) |
| `--muted` | `#B3A794` | Texto secundario | 8,0:1 sobre `--bg`, 6,9:1 sobre `--bg-3` |
| `--dim` | `#9A8E7B` | Texto terciario (notas) | 5,9:1 sobre `--bg`, 5,5:1 sobre `--bg-2` |
| `--orange` naranja | `#E38B3C` | Un solo detalle: la naranja de la ilustración | 7,2:1 sobre `--bg` |
| `--green` | `#9CC48A` | Punto de «Abierto ahora» | 9,6:1 sobre `--bg` |
| Botón latón | texto `#13100D` sobre `#C8A15A` | CTA principal | 7,9:1 |
| Sección del autor | `#1A1511` sobre `#F2E9D8`, acento `#6B4E1C` | Bloque comercial final | 15,0:1 y 6,4:1 |

Prohibido: degradados morado-azul, negros puros fríos, blancos puros.

### Pareja tipográfica
- **Gloock** (serif display de alto contraste, con remates afilados como el filo de una navaja) para titulares, precios y numerales. Solo 26 KB.
- **Manrope** variable (sans geométrica limpia, muy legible en móvil) para texto, etiquetas y botones. 25 KB.
- Ambas en woff2 latino, servidas desde `fonts/`, con `preload` y `font-display: swap`. Total tipografía ≈ 51 KB.
- Fallbacks con métricas ajustadas (`Gloock Fallback`, `Manrope Fallback`) para que el cambio de fuente apenas mueva nada (CLS 0,013).

Escala tipográfica fluida (`clamp`) con contraste fuerte: H1 de 2,9 rem (móvil) a 7,6 rem (escritorio); H2 de 2,3 a 4,6 rem; texto 1–1,125 rem; etiquetas 0,75 rem en versalitas espaciadas (0,18 em).

### Retícula
- Escritorio: 12 columnas, ancho máximo 1320 px, medianil 24 px, márgenes laterales fluidos.
- Móvil: 4 columnas, márgenes de 20 px.
- Hero asimétrico 7/5, carta 4/8 con columna izquierda fija (`sticky`), ritual 5/7 invertido con tipografía que desborda su columna, equipo escalonado verticalmente.

### Escala de espaciado (base 8)
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144` px, expuesta como tokens `--s-1` … `--s-10`. Las secciones respiran con `--s-9`/`--s-10` en escritorio y `--s-8` en móvil.

### Recursos visuales firma
1. **El poste de barbero reinterpretado**: una columna finísima con franjas en latón, crema y negro que gira (desplazamiento en bucle con `transform`) junto a la ilustración del hero. Es el detalle animado y aparece de nuevo, quieto, como separador.
2. **La navaja que se abre**: ilustración SVG propia de una navaja de barbero con una rama de azahar; al cargar, la hoja se abre sobre su eje. Es también el emblema (versión mínima en el logo y el favicon).
3. **La carta con puntos guía**: los servicios se leen como una pizarra de barbería antigua, con líneas de puntos entre nombre y precio, duración en versalitas y numerales en Gloock. Encima, grano SVG sutil en toda la página y filetes finos de latón.

### Movimiento
- Entradas al hacer scroll con `IntersectionObserver` (opacidad + desplazamiento corto), escalonadas.
- Microinteracciones: botones con flecha que avanza, tarjetas que se elevan con filete de latón, chips que se iluminan.
- Hero: navaja que se abre y poste que gira. La hoja, los anillos y el pulso del mapa son capas HTML independientes para que la animación vaya en el compositor y no en el hilo principal.
- Todo con `transform` y `opacity`. Con `prefers-reduced-motion: reduce` no hay animaciones ni desplazamientos suaves.

---

## 2. Qué hay en la página

| Sección | Qué demuestra al dueño del negocio |
|---|---|
| Banner fijo de demo | Honestidad: «Ejemplo de diseño con un negocio ficticio · Creado por [[NOMBRE_COMERCIAL]]», enlace de vuelta a `../../#muestras` (la sección Muestras de la landing). |
| Cabecera | Logo propio, navegación, **estado en vivo** (Abierto/Cierra a las…) y botón «Reservar cita». Se esconde al bajar y vuelve al subir. Menú a pantalla completa en móvil. |
| Hero | Qué es (barbería de navaja), dónde (Castelló), cómo reservar (CTA a WhatsApp) y estado del horario, todo en la primera pantalla del móvil. Ilustración animada. |
| 01 · La carta | 14 servicios con precio y duración, filtros por categoría y botón **«Reservar este»** que preselecciona el servicio en el formulario. |
| 02 · El ritual | Composición asimétrica con titular gigante que invade el hueco de foto; pasos del afeitado y CTA. |
| 03 · Equipo | Tres barberos ficticios (Toni, Lucía, Marc) con retrato ilustrado sin rasgos, especialidad y botón **«Reservar con…»** que marca al barbero en el formulario. |
| 04 · Reserva | Servicio → barbero → día (14 días, domingos y lunes cerrados) → franja (las pasadas se desactivan según la hora de España y la duración del servicio) → nombre. Ticket que se rellena solo y **vista previa del mensaje de WhatsApp**. Al enviar: aviso de demo con el mensaje. |
| Reseñas de ejemplo | Etiqueta visible, solo nombres de pila, texto sobrio. |
| 05 · Horario y dirección | Estado grande en vivo, tabla semanal con el día de hoy marcado, mapa ilustrativo, datos ficticios y botones WhatsApp / Llamar / Cómo llegar. |
| Barra flotante | En móvil: Llamar · WhatsApp · Reservar cita. En escritorio: píldora flotante. Aparece al pasar el hero y se oculta en la sección comercial. |
| ¿Quieres una web así? | Bloque comercial separado visualmente (fondo crema, borde troquelado): qué incluye, **395 €**, **3 días laborables** y botón a WhatsApp con el mensaje precargado. |

### Datos ficticios usados
- Dirección: «Plaça de l'Exemple, 0 · 12001 Castelló de la Plana (dirección ficticia)». El número 0 no existe.
- Teléfono: «964 XX XX XX». Email: `hola@navajayazahar.example` (dominio `.example`, reservado y sin dueño posible).
- Los botones de llamar, WhatsApp del negocio, cómo llegar y textos legales **no abren nada real**: muestran un aviso (`<dialog>` accesible) del tipo «En tu web, este botón abre WhatsApp con el mensaje ya escrito y la reserva te llega al móvil».
- Horario: martes a jueves 10:00–14:00 y 16:30–20:30; viernes 10:00–20:30 seguido; sábado 9:00–14:00; domingo y lunes cerrado.
- Precios (Comunitat Valenciana, 2026): corte clásico 16 €, degradado 18 €, tijera 20 €, infantil 12 €, rapado 10 €, arreglo de barba 11 €, barba con toalla caliente 15 €, afeitado clásico 20 €, corte + barba 26 €, Ritual Azahar 38 €, padre e hijo 25 €, extras de 5 a 12 €.
- JSON-LD `HairSalon` (schema.org no tiene `BarberShop`) con dirección, horario, precios y ofertas ficticias.

---

## 3. Configuración y marcadores pendientes

### Objeto de configuración (al principio de `script.js`)
```js
var CONFIG = {
  marca: '[[NOMBRE_COMERCIAL]]',
  precio: 395,
  plazo: '3 días laborables',
  whatsapp: '34623130633',
  sector: 'barbería',
  mensaje: 'Hola, he visto la web de ejemplo de {sector} y me interesa una para mi negocio'
};
```
El script rellena con estos valores todos los elementos con `data-cfg="marca|precio|plazo"` y genera el enlace `https://wa.me/34623130633?text=…` (atributo `data-cfg-wa`).

### Marcadores pendientes
- **`[[NOMBRE_COMERCIAL]]`**: cambiarlo en `CONFIG.marca` (`script.js`, línea 6). Para que también salga bien sin JavaScript y en el HTML que leen los buscadores, sustituirlo además en `index.html`: banner superior (línea ~90), *kicker* de la sección comercial (~823) y pie de la sección comercial (~846).

### Probar el horario a cualquier hora
Añade `?ahora=AAAA-MM-DDTHH:MM` (hora de España) a la URL. Ejemplos:
- `index.html?ahora=2026-11-03T11:00` → «Abierto ahora · Cierra a las 14:00»
- `index.html?ahora=2026-11-03T13:45` → «Cierra pronto · Hoy a las 14:00»
- `index.html?ahora=2026-11-03T15:00` → «Cerrado ahora · Abre hoy a las 16:30»
- `index.html?ahora=2026-11-07T15:00` → «Cerrado ahora · Abre el martes a las 10:00»

Sin parámetro usa la hora real de `Europe/Madrid` (vía `Intl.DateTimeFormat`) y se actualiza cada 30 s.

### Fuentes en local y en web
- En web (`http/https`), un script mínimo del `<head>` declara las `@font-face` con las woff2 de `fonts/` y añade los `preload`.
- Abriendo `index.html` con doble clic (`file://`) el navegador bloquea las fuentes por CORS, así que ese mismo script carga `fonts/fuentes-local.js`, que trae las mismas woff2 en base64. Resultado: misma tipografía y cero errores de consola en ambos casos.

---

## 4. Huecos de foto (para el cliente real)

Todos llevan la etiqueta «Hueco para foto» y un atributo `data-photo` con la descripción. Basta con cambiar el `<svg>` por un `<img>` (con `width`/`height`, `loading="lazy"` y `alt`) manteniendo la proporción.

| Dónde | Foto que iría | Proporción | Tamaño recomendado |
|---|---|---|---|
| Carta (columna izquierda) | Detalle de herramientas sobre la encimera: navaja, brocha, tijeras y peine | 1:1 | 800 × 800 px, WebP/AVIF |
| El ritual | El sillón de barbero junto a la ventana, luz de tarde | 4:5 | 920 × 1150 px |
| Horario y dirección | Fachada del local con el toldo y la puerta, desde la acera de enfrente | 3:2 | 1280 × 853 px |
| Equipo (opcional) | Retrato de cada barbero de cintura para arriba, fondo neutro oscuro | 6:7 (arco superior) | 480 × 560 px |
| Mapa (opcional) | Captura estática del mapa con la ubicación, o enlace a la ficha del negocio | 10:7 | 1200 × 840 px |

---

## 5. Revisión y pruebas

### Rondas de crítica visual (375 px y 1440 px, página completa)
**Ronda 1** — detectado y corregido:
- La navaja del hero salía cerrada por un error de rotación; ahora se abre sobre su eje.
- El H1 de escritorio ocupaba 4 líneas y empujaba los CTA bajo el pliegue → escala fluida recalculada, 2 líneas.
- Desbordamiento horizontal en móvil (496 px) por filas de chips sin `min-width: 0` en la rejilla.
- Pelo de dos retratos invisible sobre el fondo oscuro → espejo más claro y tonos de pelo con contraste.
- Sillón, tijeras y brocha toscos → redibujados.
- Primer chip de filtros y días cortado por el *scroll-snap* → `scroll-padding-inline`.
- Etiqueta del hero partida en dos líneas en móvil, insignias que rompían la línea de puntos, pie de foto tapando la ilustración, «— €» raro en el ticket, estado grande mal partido.
- El titular del ritual rozaba el marco de la foto → solape intencionado y más profundo, con el texto por encima.

**Ronda 2** — detectado y corregido:
- Rendimiento 91: las animaciones dentro del SVG (hoja, anillos, pulso del mapa) se repintaban en el hilo principal → capas HTML con `transform` (rendimiento 100, TBT 0 ms).
- Lectura de `scrollY`/`offsetHeight` que forzaba un reflujo al arrancar → `ResizeObserver` y `requestAnimationFrame`.
- Nota vertical «Desde 2014» cortada en móvil, días del formulario mal repartidos en escritorio (ahora semana de 7 columnas), panel derecho de «Visítanos» fijo al hacer scroll para equilibrar columnas.
- Validación HTML (html-validate, reglas recomendadas): sin errores. El botón de enviar es un `submit` asociado al formulario.

### Interacciones probadas (Playwright: 37 comprobaciones automáticas, todas OK por `http://` y por `file://`, más pruebas sueltas de Enter y de carga de fuentes)
- Estado del horario en 11 momentos simulados (abierto, cierra pronto, pausa de mediodía, antes de abrir, después de cerrar, sábado, domingo, lunes, viernes seguido).
- Reserva: validación con errores y foco, «Reservar este» desde la carta, franjas pasadas desactivadas, domingos y lunes desactivados, franjas de sábado, mensaje de WhatsApp completo, aviso con el mensaje, Escape y devolución del foco, Enter en el nombre envía.
- Avisos de llamar, WhatsApp, cómo llegar y textos legales; cierre con botón, con Escape y con clic fuera; «Quiero una así» lleva a la sección comercial.
- Filtros de la carta, «Reservar con Marc», menú móvil (apertura, foco, Escape, navegación), barra flotante (oculta arriba, visible en medio, oculta en la sección comercial), enlace de WhatsApp del autor y enlace del banner.
- Teclado: primer Tab = «Saltar al contenido»; foco visible en todos los controles.
- Consola: 0 errores y 0 avisos en `http://` y en `file://`.

### Lighthouse 13.6.0 (móvil, throttling simulado)

| Categoría | Resultado |
|---|---|
| Rendimiento | **100** (FCP 1,1 s · LCP 1,1 s · TBT 0 ms · CLS 0,013 · SI 1,1 s) |
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| SEO | **60** — la única auditoría fallida es `is-crawlable`, por el `noindex, nofollow` intencionado. El resto (título, descripción, enlaces, `hreflang`, código HTTP) pasa. |

Medido con un servidor local con gzip, como GitHub Pages. Sin compresión también da 100 / 100 / 100 / 60.

### Capturas
Las capturas de página completa (`movil.png` a 375 px y `escritorio.png` a 1440 px, unos 6 MB) se eliminaron del repositorio para no publicarlas con la web: ninguna página las usa. La miniatura de la landing está en `site/assets/muestras/barberia.webp`. Para regenerarlas, abre la demo con `?ahora=2026-11-06T11:30` (viernes por la mañana, estado «Abierto ahora») y haz una captura de página completa; la barra flotante conviene ocultarla porque, al ser fija, aparecería a mitad de la imagen.

---

## 6. Licencias de recursos de terceros

| Recurso | Origen (npm) | Licencia | Archivo |
|---|---|---|---|
| Gloock (woff2, latín) | `@fontsource/gloock` 5.3.0 | SIL Open Font License 1.1 · © 2022 The Gloock Project Authors | `fonts/LICENSE-gloock.txt` |
| Manrope variable (woff2, latín) | `@fontsource-variable/manrope` 5.3.0 | SIL Open Font License 1.1 · © 2019 The Manrope Project Authors | `fonts/LICENSE-manrope.txt` |
| Iconos (phone, message-circle, map-pin, clock, scissors, arrow-right, arrow-up-right, check, x, navigation, credit-card, car, mail, calendar-days; menú simplificado) | `lucide-static` 1.66.0 | ISC · © Lucide Icons and Contributors | `LICENSE-lucide.txt` |

Las ilustraciones (navaja, azahar, sillón, herramientas, fachada, retratos, mapa, emblema y favicon), el icono de toalla con vapor y la flor de azahar del sprite son originales de esta demo.
