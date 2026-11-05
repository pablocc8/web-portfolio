# Muestra: Taller Giroscopi (taller mecánico, Valencia)

Web de ejemplo con un negocio **ficticio**. Los datos de contacto, la dirección y los precios son inventados. Lleva `noindex` y no está en `sitemap.xml`.

```
index.html   página
style.css    estilos (sin dependencias)
script.js    menú, horario, presupuesto por WhatsApp y calculadora
fonts/       Barlow 400 y 600 (woff2) + licencia OFL
```

Miniatura de la tarjeta de la landing: `site/assets/muestras/taller.webp` (800×500).

## Qué cambiar si se reutiliza

- **WhatsApp del taller**: atributo `data-wa` del `<body>` (formato internacional sin `+`). `script.js` reescribe con él todos los enlaces con `data-wa-link` y el envío del formulario.
- **Horario**: la tabla de `index.html`, el pie y el objeto `WEEK` de `script.js` (minutos desde medianoche, 0 = domingo).
- **Servicios**: las tarjetas de `#servicios`, las opciones de `#q-servicio` y el objeto `SERVICES` de `script.js` usan las mismas claves (`aceite`, `preitv`, `frenos`…).
- **Sección final (mi oferta)**: bloque `#tu-web` al final de `index.html`. Su botón va a mi WhatsApp (`34623130633`) y **no** lleva `data-wa-link`, para que el script no lo cambie por el número del taller.

## Rediseño (noviembre de 2026): decisiones

El objetivo era que pareciera hecha a mano por un estudio pequeño para un taller de barrio de verdad.

**Se ha quitado**
- La ilustración del giroscopio, el plano SVG del barrio, el sello de garantía, los iconos de cada servicio y el logotipo dibujado. La marca es ahora el nombre en texto.
- Las etiquetas numeradas (`01`, `02`…), la «cinta» animada, el fondo de cuadrícula, los textos en mayúsculas con espaciado y el titular-eslogan («Tu coche, a punto. El precio, claro.»).
- Las animaciones de aparición al hacer scroll y el giro del SVG. Solo quedan transiciones de color de 0,15 s en botones y el desplazamiento suave (desactivados con `prefers-reduced-motion`).
- Barlow Condensed y JetBrains Mono (y sus licencias), y el peso 500 de Barlow. Quedan dos archivos de fuente (≈45 KB).

**Estilo**
- Tipografía: una sola familia, Barlow (400 y 600). La mantengo porque ya estaba en la carpeta, es sobria y recuerda a la rotulación de carretera. Titulares: `h1` de 32 a 44 px y `h2` de 28 a 34 px según el ancho. Sin mayúsculas forzadas ni espaciado extra.
- Paleta: neutros (`#1d2125`, `#545b62`, `#f5f5f2`, bordes `#dddfd9`) y un único acento azul `#1f5a96` (azul de mono de taller). Fondos claros. El rojo `#b42318` se usa solo para errores de formulario, el asterisco de obligatorio y el aviso «Toca ya» de la calculadora; no es decorativo.
- Radios de 4 a 8 px, bordes de 1 px y una sola sombra suave en el botón flotante.
- El botón flotante de WhatsApp usa el azul del acento en lugar del verde de WhatsApp, para no meter un segundo color.

**Estructura**
- Cabecera: nombre y 4 enlaces (Servicios, Presupuesto, Mantenimiento, Dónde estamos). En móvil, botón «Menú» con texto. Sin botón de llamada a la acción en la cabecera.
- Hero: titular descriptivo («Taller mecánico en Valencia»), dos frases, un botón y la foto. Debajo, una línea con el estado abierto o cerrado según la hora de Madrid (sin JavaScript muestra el horario).
- Secciones en rejillas sencillas: «Servicios y precios» (6 tarjetas), «Cómo trabajamos» (4 pasos sin numerar y la garantía), «Pedir presupuesto» (formulario y vista previa del mensaje), «Calculadora de mantenimiento», «Dónde estamos».
- Pie con dirección, horario y contacto. Después, la sección «Fin del ejemplo» con mi oferta.
- Botón flotante: **solo en móvil** (≤ 860 px), uno, de WhatsApp. Se oculta mientras se ve la sección final para no confundir el WhatsApp del taller con el mío.
- Fotos: no hay, así que hay tres recuadros neutros 4:3 con el texto «Aquí iría una foto del negocio» (hero, «Cómo trabajamos» y fachada en «Dónde estamos»). El plano dibujado se sustituye por el botón «Cómo llegar en Google Maps»; no incrusto un mapa para no cargar terceros ni cookies.

**Textos**
- Español de España, frases cortas, titulares descriptivos. Sin rayas (—) ni semirrayas (–): los horarios se escriben «8:30 a 14:00» y los valores vacíos de la calculadora se muestran con un guion corto.
- Espacios duros entre cifra y unidad (`59 €`, `20.000 km`, `45 min`) para que no se partan de línea.
- Títulos y `meta` sin eslogan: «Taller Giroscopi | Taller mecánico en Valencia».

**Sección final con la oferta**
- Antes de este rediseño la muestra del taller **no tenía** bloque de oferta (solo la barbería lo tenía). Lo he añadido siguiendo el de la barbería: 395 € de pago único, 3 días laborables, mantenimiento opcional de 20 €/mes, botón a mi WhatsApp con el mensaje «Hola, he visto la web de ejemplo del taller y me interesa una para mi negocio» y enlaces a `../../#precio` y `../../#muestras`.
- No uso el marcador `[[NOMBRE_COMERCIAL]]` aquí: firmo como «Pablo», igual que la cabecera de la landing, para no añadir un marcador nuevo que el README principal no documenta.

**Se mantiene**
- Rutas (`site/muestras/taller/`), `noindex`, el banner «Ejemplo de diseño con un negocio ficticio · Volver a las muestras» y los anclajes `#servicios`, `#presupuesto`, `#mantenimiento`, `#proceso` y `#contacto`.
- Toda la funcionalidad: botón «Pedir presupuesto» de cada servicio (elige el servicio en el formulario y lleva el foco a «Marca y modelo»), validación, vista previa en vivo, envío a WhatsApp, copiar mensaje, calculadora con sus tres estados, lista de otras piezas y paso de los datos de la calculadora al formulario.

## Accesibilidad

- Se conserva la corrección anterior del logotipo: el enlace de la marca ya no lleva `aria-label`; su nombre accesible es el texto visible.
- El botón del menú tiene texto visible («Menú») y comunica el estado con `aria-expanded` (antes cambiaba un `aria-label` que no coincidía con nada visible).
- Contraste AA en todo el texto, incluidos los huecos sin rellenar de la vista previa y el texto de los recuadros de foto.
- Quité `aria-live` de la vista previa del mensaje (leía el mensaje entero a cada tecla). En la calculadora, la región viva cubre solo el resultado principal y los errores usan `aria-live="polite"` en vez de `role="alert"`, porque se recalcula mientras escribes. Los errores del formulario de presupuesto siguen con `role="alert"`, porque solo aparecen al enviar.
- El día de hoy en la tabla de horario se marca con `aria-current="date"`, además de en negrita.
- Los botones «Pedir presupuesto» de cada tarjeta añaden el nombre del servicio en texto oculto, y los enlaces que abren pestaña nueva lo avisan a lectores de pantalla.
- Enlace «Saltar al contenido», foco visible y botones y campos de 42 px de alto o más.

## Verificación

- Chromium a 375 px y 1440 px (y de paso a 320, 768 y 1024 px): sin desplazamiento horizontal ni errores de consola. Dos rondas de revisión visual; en la primera salió un choque de nombres de clase (`.bar` en la cabecera y en la barra de la calculadora), cifras separadas de «€» al partir línea y la línea del pie descuadrada. Están corregidos.
- Pruebas de funcionamiento con Playwright: menú (abrir, cerrar con Escape y al elegir enlace), estado abierto o cerrado (jueves por la mañana, domingo, sábado por la tarde), botones de servicio, errores del formulario, envío a WhatsApp con el mensaje completo, copiar, los tres estados de la calculadora, paso de datos al formulario y botón flotante (visible en móvil, oculto en la sección final y en escritorio).
- Lighthouse 12 (móvil y escritorio): Rendimiento 100, Accesibilidad 100, Buenas prácticas 100. **SEO 63 solo por el `noindex`**, que es intencionado.
- `node scripts/check.mjs`: enlaces, recursos y anclas internos OK.
- No verificado: la apertura real de wa.me y Google Maps, porque el entorno no tenía salida a esos dominios (se comprobó la URL generada).
