# Navaja & Azahar · muestra de barbería

Web de muestra para un negocio **ficticio** (barbería en el centro de Castelló de la Plana). Es una pieza de escaparate comercial: no representa a ningún negocio real.

- Ruta pública prevista: `/web-portfolio/muestras/barberia/`
- Funciona igual abriendo `index.html` con doble clic (sin servidor, sin build, sin módulos, sin `fetch`).
- Archivos: `index.html`, `styles.css`, `script.js`, `favicon.svg`, `fonts/`, `LICENSE-lucide.txt`.
- Miniatura de la landing: `site/assets/muestras/barberia.webp` (800 × 500).

---

## 1. Rediseño de noviembre de 2026: qué se pedía y qué decidí

Objetivo: que parezca hecha a mano por un diseñador de un estudio pequeño para una barbería de barrio, y no generada por IA. Se mantienen la funcionalidad, el banner de ejemplo, el `noindex`, las rutas, la sección final con la oferta y las correcciones de accesibilidad.

### Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Fondo | Claro (blanco y un gris cálido `#F4F3F0` para alternar secciones) | Una barbería no pide fondo oscuro. |
| Acento | Un solo color: rojo ladrillo `#A3261D` (hover `#861C15`) | Es el rojo del poste de barbero, sin recurrir a dorados. Se usa solo en botones principales, enlaces «Reservar», selección del formulario, errores y la etiqueta «Hoy». |
| Neutros | Texto `#1C1B19`, secundario `#57544E`, bordes `#D7D5D0`, bordes de controles `#8C8983` | Todos con contraste comprobado (tabla abajo). |
| Capa del diseñador | Banner superior y sección final en gris muy oscuro `#1F1E1C` | Todo lo oscuro es «del diseñador» y todo lo claro es «del negocio». Así la oferta queda separada sin adornos. El botón de la oferta es blanco para no usar el acento del negocio. |
| Tipografía | Una sola familia: **Source Sans 3** variable (28 KB), pesos 400, 500, 600 y 700 | Sans humanista sobria, distinta de las otras muestras (Barlow en el taller, DM Sans en el restaurante). Titulares de 28 a 44 px: H1 de 32 a 44 px, H2 de 28 a 36 px. Texto a 17 px. |
| Radios y sombras | 6 px en botones y controles, 8 px en tarjetas, 4 px en la etiqueta «Hoy». Bordes de 1 px. Sombra solo en el desplegable del menú, el botón flotante y el aviso | Lo pedido: radios de 4 a 8 px, bordes finos, sombras mínimas. |
| Cabecera | Nombre a la izquierda y 4 enlaces (Servicios, Equipo, Reservar, Dónde estamos). Fija arriba. En móvil, botón «Menú» con un desplegable sencillo | Sin botón extra en la cabecera: «Reservar» es uno de los 4 enlaces. Sin JavaScript, los enlaces se ven debajo del nombre. |
| Portada | Titular descriptivo («Barbería en el centro de Castelló»), dos frases, un botón («Reservar cita»), una línea con el estado del horario en vivo y un hueco de foto 4:3 | La tarjeta de la landing describe la captura como «titular, botón de reserva y horario en vivo», así que el estado se queda en la portada. |
| Fotos | Recuadros grises con la proporción final y la etiqueta «Aquí iría una foto del negocio» | No hay fotos. Solo dos huecos (portada y fachada) para no repetir el mismo recuadro cinco veces. El equipo va sin retratos. |
| Mapa | Eliminado; queda el botón «Cómo llegar» | Era una ilustración SVG decorativa. Un mapa real necesitaría un servicio de terceros. |
| Sección «El ritual» | Eliminada. Su contenido pasa a la descripción del afeitado | Tenía pasos numerados 01 a 04 y un titular tipo eslogan. Su botón de reserva ya existe en la lista de servicios. |
| Servicios | Cuatro grupos en dos columnas (una en móvil) con filas de nombre y precio, descripción, duración y enlace «Reservar». Se mantienen los filtros | Sin puntos guía ni etiquetas «La de la casa» o «Para regalar». Cada enlace se lee como «Reservar corte clásico» con lector de pantalla. |
| Renombrados | «Degradado a navaja» → «Degradado», «Combos» → «Packs», «Corte + barba» → «Corte y barba», «Ritual Azahar» → «Servicio completo» (id `completo`), «Cejas a navaja» → «Cejas» | Nombres normales de barbería de barrio. |
| Nombre del negocio | Se mantiene «Navaja & Azahar» | Aparece en el README raíz, que no debía tocar. Si se cambia, hay que hacerlo en los dos sitios. |
| Formulario | Mismos pasos y lógica. Sin los círculos numerados 1 a 4. Días en rejilla de 7 columnas; los cerrados se ven tachados y en gris, con la nota «Domingo y lunes cerrado» | En móvil «Cerrado» no cabe en cada casilla; el nombre accesible de cada día sí lo dice. |
| Resumen de la cita | Tarjeta con filas y el mensaje de WhatsApp tal cual se enviará. Fija al hacer scroll en escritorio | Sin efecto de «ticket» ni animación al cambiar. |
| Botón flotante | Uno solo, «WhatsApp», abajo a la derecha y solo en móvil (por debajo de 900 px). Color del acento | Sustituye a la barra de tres botones. Se oculta en la sección de reserva (ya tiene su botón de WhatsApp) y en la sección final (la oferta tiene el suyo). No usa el verde de WhatsApp para respetar el acento único. |
| Animación | Solo transiciones de color de 150 ms al pasar el ratón y desplazamiento suave entre secciones | Fuera: entradas al hacer scroll, cinta en bucle, poste giratorio, navaja que se abre, pulso del mapa y «rebote» del ticket. Con `prefers-reduced-motion` no hay ni eso. |
| Eliminado | Etiquetas 01 a 05, versalitas espaciadas, ilustraciones SVG (navaja, azahar, herramientas, sillón, retratos, mapa, fachada, emblema), grano de fondo, cinta de servicios, barra flotante de tres botones, ocultación de la cabecera al bajar | Lo pedido. El favicon pasa a ser una «N» blanca sobre el acento. |
| Textos | Frases cortas, titulares descriptivos («Servicios y precios», «Equipo», «Reservar cita», «Opiniones de clientes», «Dónde estamos»), horas con «a» (`10:00 a 14:00`) en vez de rayas | Sin eslóganes, sin guiones largos y sin series de adjetivos. |
| Sección final | Mismo contenido y mismos datos (395 €, 3 días laborables, WhatsApp con el mensaje precargado, `data-cfg`). Retoqué la redacción para que siga las mismas reglas de estilo | La lista de lo que incluye es la misma. |

### Contraste (WCAG 2.1, calculado)

| Par | Contraste |
|---|---|
| Texto `#1C1B19` sobre blanco | 17,2:1 |
| Secundario `#57544E` sobre blanco / sobre `#F4F3F0` | 7,5:1 / 6,8:1 |
| Blanco sobre acento `#A3261D` (botones) | 7,4:1 |
| Acento sobre blanco / sobre `#F4F3F0` / sobre selección `#FBF1EF` | 7,4:1 / 6,6:1 / 6,6:1 |
| Etiqueta de foto `#57544E` sobre `#EAE8E3` | 6,2:1 |
| Días y franjas deshabilitados `#6E6B65` sobre `#F4F3F0` | 4,8:1 |
| Borde de controles `#8C8983` sobre blanco | 3,5:1 (contraste no textual ≥ 3:1) |
| Banner `#E9E7E3` sobre `#1F1E1C` / secundario oscuro `#BDBAB3` | 13,5:1 / 8,6:1 |

### Accesibilidad que se conserva o mejora
- Enlace «Saltar al contenido» como primer elemento con el tabulador.
- Foco visible en todos los controles (rojo sobre claro, blanco sobre oscuro).
- Banner de muestra como `aside` con nombre («Aviso de muestra»), para que todo el contenido esté dentro de una región.
- Errores del formulario con texto, `aria-invalid` en el servicio y foco en el primer campo con error.
- Nombre accesible completo en cada día («Hoy, viernes 6 de noviembre» o «domingo 8 de noviembre, cerrado»).
- Botones «Reservar» con el nombre del servicio para lectores de pantalla.
- Aviso de demo con `<dialog>`: foco en «Entendido», cierre con Escape, con la X o haciendo clic fuera, y el foco vuelve al botón que lo abrió.
- El estado del horario solo se reescribe cuando cambia, para que el lector de pantalla no lo repita cada 30 segundos.
- La clase `js` se pone en el `<head>`, antes de pintar, para que la cabecera no cambie de alto al cargar (CLS 0).

---

## 2. Qué hay en la página

| Sección | Contenido |
|---|---|
| Banner de muestra | «Ejemplo de diseño con un negocio ficticio · Creado por [[NOMBRE_COMERCIAL]]», enlace a `../../#muestras`. |
| Cabecera | Nombre y 4 enlaces. Menú desplegable en móvil (Escape y clic fuera lo cierran). |
| Portada | Titular, texto, «Reservar cita», estado en vivo y hueco de foto. |
| Servicios y precios | 14 servicios en 4 grupos, filtros y «Reservar», que preselecciona el servicio en el formulario. |
| Equipo | Toni, Lucía y Marc, con «Reservar con…», que marca al barbero en el formulario. |
| Reservar cita | Servicio, barbero, día (14 días; domingo y lunes cerrados), franja (las pasadas se desactivan según la hora de España y la duración del servicio) y nombre. Resumen y vista previa del mensaje. Al enviar sale el aviso de demo con el mensaje. |
| Opiniones de clientes | Tres reseñas marcadas como de ejemplo. |
| Dónde estamos | Dirección ficticia, teléfono, correo, «Cómo llegar», «Llamar», «WhatsApp», horario semanal con el día de hoy marcado y estado en vivo, hueco de foto de la fachada. |
| Pie | Nombre, horario, dirección, contacto y «Aviso legal y privacidad». |
| ¿Quieres una web así? | Sección del autor, separada en oscuro: qué incluye, 395 €, 3 días laborables y botón real a WhatsApp. |

### Datos ficticios
- Dirección: «Plaça de l'Exemple, 0 · 12001 Castelló de la Plana (dirección ficticia)».
- Teléfono «964 XX XX XX» y correo `hola@navajayazahar.example` (dominio `.example`, reservado).
- Los botones de llamar, WhatsApp del negocio, cómo llegar, el botón flotante y los textos legales **no abren nada real**: muestran el aviso «Así funciona en tu web».
- Horario: martes a jueves 10:00 a 14:00 y 16:30 a 20:30; viernes 10:00 a 20:30 seguido; sábado 9:00 a 14:00; domingo y lunes cerrado.
- Precios: corte clásico 16 €, degradado 18 €, tijera 20 €, infantil 12 €, rapado 10 €, arreglo de barba 11 €, barba con toalla caliente 15 €, afeitado clásico 20 €, corte y barba 26 €, servicio completo 38 €, padre e hijo 25 €, extras de 5 a 12 €.
- JSON-LD `HairSalon` (schema.org no tiene `BarberShop`) con dirección, horario y precios ficticios.

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
El script rellena con estos valores los elementos con `data-cfg="marca|precio|plazo"` y genera el enlace `https://wa.me/34623130633?text=…` (atributo `data-cfg-wa`).

### Marcadores pendientes
- **`[[NOMBRE_COMERCIAL]]`**: cambiarlo en `CONFIG.marca` (`script.js`, línea 6). Para que salga bien también sin JavaScript, sustituirlo en `index.html`: banner (línea 76), primera línea de la sección final (línea 427) y pie de la sección final (línea 449).

### Probar el horario a cualquier hora
Añade `?ahora=AAAA-MM-DDTHH:MM` (hora de España) a la URL:
- `index.html?ahora=2026-11-03T11:00` → «Abierto ahora · Cierra a las 14:00»
- `index.html?ahora=2026-11-03T13:45` → «Cierra pronto · Hoy a las 14:00»
- `index.html?ahora=2026-11-03T15:00` → «Cerrado ahora · Abre hoy a las 16:30»
- `index.html?ahora=2026-11-07T15:00` → «Cerrado ahora · Abre el martes a las 10:00»

Sin parámetro usa la hora real de `Europe/Madrid` (con `Intl.DateTimeFormat`) y se actualiza cada 30 s.

### Fuente en local y en web
- En web (`http/https`), un script mínimo del `<head>` declara la `@font-face` de `fonts/source-sans-3-latin-wght-normal.woff2` y la precarga.
- Abriendo `index.html` con doble clic (`file://`) el navegador bloquea las fuentes por CORS, así que ese script carga `fonts/fuentes-local.js`, que trae la misma woff2 en base64. Misma tipografía y cero errores de consola en los dos casos.
- `styles.css` declara un fallback (`Source Sans Fallback`, sobre Arial) con `size-adjust: 91.6%`, medido en Chromium comparando el ancho de un mismo texto.

---

## 4. Huecos de foto (para el cliente real)

Cada hueco lleva la etiqueta «Aquí iría una foto del negocio» y un atributo `data-photo` con la foto que iría. Basta con cambiar el `<div class="photo-slot">` por un `<img>` con `width`, `height`, `alt` y la misma proporción (y `loading="lazy"` en la de la fachada).

| Dónde | Foto | Proporción | Tamaño recomendado |
|---|---|---|---|
| Portada | Interior del local: los sillones y el espejo, con luz de día | 4:3 (3:2 entre 600 y 899 px) | 1200 × 900 px, WebP o AVIF |
| Dónde estamos | Fachada con la puerta y el escaparate, desde la acera de enfrente | 3:2 | 1200 × 800 px |
| Equipo (opcional) | Retrato de cada barbero | 4:5 | 600 × 750 px |

---

## 5. Revisión y pruebas

### Rondas de crítica en navegador (Chromium, 375 px y 1440 px, página completa)
**Ronda 1**, corregido:
- En las filas de servicios, el botón «Reservar» a la derecha estrechaba la descripción en móvil y repetía 14 botones con borde. Ahora: nombre y precio en una línea, descripción debajo y «Reservar» como enlace de texto junto a la duración.
- El horario se partía en mitad de un tramo («16:30 a / 20:30»). Cada tramo va en un bloque que no se parte.
- En móvil, «Marc» quedaba solo en una segunda fila de barberos y «WhatsApp» solo en otra fila de botones de contacto. Barberos en rejilla 2 × 2; «Cómo llegar» a todo el ancho y «Llamar» y «WhatsApp» debajo, a medias.
- Viudas en titulares («Castelló» solo en la segunda línea): `text-wrap: balance` en H1 y H2 y `pretty` en párrafos.

**Ronda 2**, corregido:
- Las franjas de escritorio salían en 3 columnas con una cuarta suelta; ahora caben 4 por fila.
- En el resumen, el día salía en minúscula («martes 10 nov») junto a valores en mayúscula.
- Lighthouse marcaba CLS 0,032 en móvil: la cabecera se veía primero sin JavaScript (enlaces debajo del nombre) y se plegaba al cargar `script.js`. La clase `js` se añade ahora en el `<head>`. CLS 0.
- axe marcaba el banner fuera de una región: ahora es un `aside` con nombre.

**Ronda 3** (también a 320, 768 y 1024 px), corregido:
- A 768 px las tarjetas de equipo y opiniones quedaban muy estrechas en 3 columnas: ahora pasan a 3 columnas desde 900 px.
- El hueco de la portada era demasiado alto en tablet: 3:2 entre 600 y 899 px.
- Sin desbordamiento horizontal en ningún ancho.

### Pruebas automáticas (Playwright, 74 comprobaciones, todas OK por `http://` y por `file://`)
- Estado del horario en 10 momentos simulados (abierto, cierra pronto, pausa de mediodía, antes de abrir, después de cerrar, viernes seguido, sábado, domingo, lunes).
- `noindex`, enlace del banner, valores de `CONFIG` y enlace de WhatsApp del autor.
- Filtros (`aria-pressed` y grupos ocultos), opciones y grupos del `select`.
- Reserva: validación con 3 errores y foco en el servicio, «Reservar» desde la lista, domingos y lunes desactivados, franjas pasadas desactivadas, franjas y notas de viernes y sábado, día de hoy sin franjas libres, mensaje de WhatsApp completo, envío con Enter, aviso con el mensaje, Escape.
- «Reservar con Marc», avisos de llamar, WhatsApp, cómo llegar y textos legales (cierre con X, con Escape y con clic fuera, foco de vuelta), «Quiero una así».
- Botón flotante: visible arriba y en Equipo, oculto en Reserva, en la sección final y en escritorio.
- Menú móvil: abre, Escape devuelve el foco, enlace cierra y navega, clic fuera cierra.
- Primer Tab = «Saltar al contenido». Consola sin errores ni avisos.
- axe-core (WCAG 2.2 AA y buenas prácticas) en cinco estados: inicial, con errores, con franjas, con el menú abierto y con el aviso abierto. 0 infracciones.
- html-validate (reglas recomendadas): sin errores. `node scripts/check.mjs`: enlaces, recursos y anclas OK.

### Lighthouse 12.8.2 (servidor local con gzip, como GitHub Pages)

| | Móvil | Escritorio |
|---|---|---|
| Rendimiento | **100** (FCP 1,0 s · LCP 1,2 s · TBT 0 ms · CLS 0 · SI 1,0 s) | **100** |
| Accesibilidad | **100** | **100** |
| Buenas prácticas | **100** | **100** |
| SEO | **63**: la única auditoría fallida es `is-crawlable`, por el `noindex, nofollow` intencionado | **63**, mismo motivo |

### Miniatura
`site/assets/muestras/barberia.webp` (800 × 500, 11 KB): captura a 1120 × 700 px con `deviceScaleFactor: 2` y `?ahora=2026-11-06T11:30` (viernes, «Abierto ahora»), sin el banner, reducida con Lanczos. El ancho de 1120 px hace que el recorte 16:10 termine justo antes del titular de servicios, sin cortar texto. Para regenerarla, repite esa captura.

---

## 6. Licencias de recursos de terceros

| Recurso | Origen (npm) | Licencia | Archivo |
|---|---|---|---|
| Source Sans 3 (woff2 variable, latín) | `@fontsource-variable/source-sans-3` 5.3.1 | SIL Open Font License 1.1 · © 2023 Adobe, con nombre reservado «Source» | `fonts/LICENSE-source-sans-3.txt` |
| Iconos (message-circle, check, x) | `lucide-static` 1.66.0 | ISC · © Lucide Icons and Contributors | `LICENSE-lucide.txt` |

El favicon es original de esta muestra.
