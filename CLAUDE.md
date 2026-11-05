# Reglas para las webs de este repositorio

Se aplican a la landing (`site/`) y a cualquier web de muestra (`site/muestras/`). Si una regla choca con la identidad de un negocio de muestra (por ejemplo, su tipografía), manda la identidad de la muestra en lo visual, pero las reglas de contenido y de muestras se cumplen siempre.

## Aspecto

- Que parezca hecha a mano por un diseñador web, no generada. Ante la duda, lo convencional y sobrio.
- Una sola familia tipográfica sans-serif sobria, alojada en el propio sitio (`woff2`, con su licencia al lado) y precargada. Nada de Google Fonts ni CDN de fuentes.
- Titulares (`h1`, `h2`) entre 28 y 44 px. Subtítulos de bloque (`h3`) por debajo de 28 px.
- Colores: fondo claro, neutros y **un solo color de acento**. Contraste mínimo 4,5:1 en texto.
- Layout convencional: cabecera, secciones apiladas, rejillas simples. Sin composiciones experimentales.
- Radios pequeños (4 a 6 px), bordes finos (1 px), sombras mínimas o ninguna.
- Prohibido: etiquetas numeradas decorativas («01», «Paso 1» como adorno), versalitas espaciadas, ilustraciones decorativas, barras flotantes en píldora, fondos con degradados llamativos.
- Animación mínima: transiciones cortas de color o de borde. Todo se desactiva con `prefers-reduced-motion: reduce`.
- Para enseñar trabajo, capturas reales de las muestras, no dibujos.

## Textos

- Español de España, trato de tú, cercano y concreto. Frases cortas.
- Titulares descriptivos: dicen de qué va la sección. Sin eslóganes.
- Evitar: series de tres adjetivos, guiones largos (—), estructuras tipo «no es X, es Y», jerga de agencia y palabras huecas.
- Cifras y unidades con espacio de no separación (`395&nbsp;€`, `3&nbsp;días`).
- **No se inventan testimonios, clientes, reseñas, cifras, premios ni garantías.** Si un dato no está confirmado, va como marcador `[[NOMBRE_EN_MAYUSCULAS]]` y se documenta en la tabla del `README.md`.
- No se sustituyen los marcadores con datos personales del titular hasta que él lo pida.

## Webs de muestra (`site/muestras/`)

- Cada muestra es un negocio **ficticio** y lo dice: banner visible arriba («Ejemplo de diseño con un negocio ficticio») con enlace de vuelta a `../../#muestras`.
- `<meta name="robots" content="noindex">` en todas, y fuera de `sitemap.xml`.
- Datos de contacto ficticios (dominios `.example`, teléfonos que no existan). Las reseñas, si las hay, se marcan como «de ejemplo».
- Su captura para la landing va en `site/assets/muestras/<nombre>.webp` (800×500).

## Oferta y contacto

- Oferta: web en 3 días laborables por 395 € de pago único; mantenimiento opcional de 20 €/mes.
- Todos los botones de WhatsApp apuntan a `https://wa.me/34623130633` (prefijo 34, sin `+` ni espacios), con `?text=` para el mensaje precargado.

## Calidad antes de publicar

- Sin build: HTML, CSS y JS puro. Rutas relativas (salvo `404.html`, que usa `/web-portfolio/`).
- Accesible: HTML semántico, enlace para saltar al contenido, foco visible, `aria-label` que contengan el texto visible, objetivos táctiles de 44 px o más.
- Revisar en navegador a 375 px y 1440 px sin desbordamiento horizontal.
- `node scripts/check.mjs` sin errores.
- Lighthouse 95 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO en la landing y las páginas legales (las muestras pierden SEO por el `noindex`, y es intencionado).
- Despliegue: el workflow `.github/workflows/pages.yml` publica `site/` en GitHub Pages al hacer push a `main`.
