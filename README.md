# Landing: webs para negocios locales (Comunidad Valenciana)

Landing en HTML, CSS y JS puro (sin build) que vende un único servicio: web profesional en 3 días laborables por 395 € de pago único, con mantenimiento opcional de 20 €/mes. Objetivo único: que el visitante escriba por WhatsApp.

```
site/                 ← lo que se publica
  index.html          landing
  aviso-legal.html    aviso legal (LSSI)
  privacidad.html     privacidad y cookies (RGPD / LOPDGDD / LSSI)
  404.html, robots.txt, sitemap.xml
  assets/             styles.css, favicon.svg, og.png, fonts/ (Source Sans 3), muestras/ (capturas de las tarjetas)
  muestras/           webs de muestra enlazadas desde la sección Muestras
    barberia/         Navaja & Azahar (Castelló)
    taller/           Taller Giroscopi (Valencia)
    restaurante/      Arrossos del Marjal (arrocería, El Grau de Castelló)
scripts/check.mjs     comprueba enlaces internos y lista marcadores pendientes
.github/workflows/pages.yml   despliegue a GitHub Pages
```

## ⚠️ Aviso: textos legales

`aviso-legal.html` y `privacidad.html` son un **borrador redactado conforme a LSSI-CE, RGPD y LOPDGDD, pero no son asesoramiento jurídico**. El titular debe revisarlos entero antes de publicar (en especial: plazos de conservación, proveedores/encargados, transferencias internacionales y la jurisdicción) y ajustarlos a su situación real. Si algún día se añade analítica, formularios, cookies o publicidad, hay que actualizarlos.

## Marcadores que debes sustituir

Búscalos con `grep -rn "\[\[" site/ --include=*.html --include=*.js` o ejecuta `node scripts/check.mjs` (lista cada marcador y en qué archivo está). Cuando no quede ninguno, el script no imprime marcadores.

| Marcador | Dónde | Qué poner |
|---|---|---|
| `[[TITULAR_NOMBRE_Y_APELLIDOS]]` | aviso-legal, privacidad | Nombre y apellidos completos (Pablo + apellidos) |
| `[[TITULAR_NIF]]` | aviso-legal, privacidad | Tu NIF/DNI |
| `[[TITULAR_DOMICILIO]]` | aviso-legal, privacidad | Domicilio (la LSSI exige uno a efectos de notificaciones) |
| `[[TITULAR_EMAIL]]` | aviso-legal, privacidad, JSON-LD de index | `pablocucala077@gmail.com` (ver nota 1) |
| `[[NOMBRE_COMERCIAL]]` | aviso-legal, index (`og:site_name` y JSON-LD) | Nombre comercial. Si no tienes, pon tu nombre completo |
| `[[LOCALIDAD]]` | index (JSON-LD `addressLocality`) | Localidad donde trabajas/estás dado de alta |
| `[[FECHA_ACTUALIZACION]]` | aviso-legal, privacidad | Fecha de la última revisión de los textos (p. ej. `3 de noviembre de 2026`) |
| `[[IVA_INDICACION]]` | index, sección Precio | `IVA incluido` o `+ IVA`, según cómo factures |
| `[[MANTENIMIENTO_ALCANCE]]` | index, FAQ | Qué incluye exactamente el mantenimiento de 20 €/mes |
| `[[DOMINIO_COSTE_Y_TITULARIDAD]]` | index, FAQ | Quién paga el dominio, cuánto cuesta al año y a nombre de quién queda |

`[[NOMBRE_COMERCIAL]]` aparece también en la web de muestra de la barbería: el banner superior y el bloque «Fin del ejemplo» de `site/muestras/barberia/index.html`, y `CONFIG.marca` en `site/muestras/barberia/script.js`. Se sustituye con el mismo valor que en la landing (antes el marcador de la barbería se llamaba `[[TU_MARCA]]`; lo he unificado). Su README (`site/muestras/barberia/README.md`) explica qué líneas tocar.

Ya **no hay marcadores `TODO_URL_MUESTRA_n`**: las tres tarjetas de la sección Muestras enlazan a `muestras/barberia/`, `muestras/taller/` y `muestras/restaurante/`.

### Valores que no son marcadores pero debes revisar

- **URL base `https://pablocc8.github.io/web-portfolio/`**: es la URL que tendrá en GitHub Pages. Aparece en `canonical`, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` y `404.html` (ruta `/web-portfolio/`). Si usas dominio propio, sustitúyela en todos esos sitios (búscala con `grep -rn "pablocc8.github.io\|/web-portfolio/" site/`).
- **WhatsApp**: todos los botones apuntan a `https://wa.me/34623130633?text=…` (prefijo 34, sin `+` ni espacios; el mensaje precargado es «Hola, me interesa la web de 395 € en 3 días. Mi negocio es: »). Hay 4 enlaces en `index.html` (cabecera, portada, precio y cierre).
- **Teléfono visible en el aviso legal** (`623 130 633`) y en JSON-LD (`+34623130633`).
- **`og.png`**: imagen 1200×630 con el titular y el precio. Si cambias la oferta, regenérala.

## Suposiciones que he tomado (revísalas)

1. **Email**: me diste `pablocucala077@gmail.com` (tres sietes), pero la cuenta de esta sesión es `pablocucala07@gmail.com`. Comprueba cuál es el correcto antes de ponerlo en `[[TITULAR_EMAIL]]`.
2. **Marca**: no hay nombre comercial; la cabecera usa «Pablo · Webs para negocios locales».
3. **Plazo**: «3 días laborables» cuenta desde que tengo logotipo, fotos y datos básicos del cliente. Lo dice la FAQ; cámbialo si no es así.
4. **IVA**: no sabía si los 395 € y los 20 €/mes lo incluyen; por eso es un marcador.
5. **Mantenimiento y dominio**: no inventé qué incluye el mantenimiento ni el coste/titularidad del dominio; son marcadores.
6. **Cambios extra**: la FAQ dice «te digo cuánto costaría antes de hacerlo». No hay tarifa inventada.
7. **Ficha de Google**: interpreté «ficha» como la ficha de Google (Google Business Profile) y prometo ayudar con ella, no posiciones. La página lo aclara explícitamente.
8. **Textos de ayuda**: «si no tienes textos, te ayudo a redactarlos» es un compromiso que he añadido; quítalo si no lo vas a cumplir.
9. **Muestras**: son tres webs de ejemplo con negocios **ficticios** (barbería, taller, restaurante), anunciadas en la landing como «ejemplos de estilo, no clientes». Sus datos de contacto, teléfonos y precios son inventados (la propia demo lo indica); no son testimonios ni clientes. La tarjeta «Clínica» se sustituyó por «Restaurante». Las tres demos llevan `noindex` para que Google no indexe negocios ficticios bajo tu dominio, y por eso no están en `sitemap.xml`.
9b. **Demo de restaurante**: no estaba en `main`, sino en la rama del PR #3 (`claude/festive-feynman-5jxm6j`); la fusioné aquí junto con `main` para que la tarjeta no apuntase a una página inexistente. Si aceptas este PR antes que el #3, el #3 quedará redundante.
9c. **Rutas de las demos**: `demos/barberia` y `demos/taller` se han movido a `site/muestras/` para que las publique el workflow sin pasos extra (el workflow vuelve a subir solo `site/`). El enlace de vuelta de cada demo es `../../#muestras`. A la del taller le añadí un banner con ese enlace porque no lo tenía.
9d. **Capturas de las tarjetas**: `site/assets/muestras/*.webp` (800×500). La de la barbería sale de su captura `capturas/escritorio.png` (recortada, sin el banner de demo); las del taller y el restaurante las he generado con Chromium porque esas demos no traían capturas. Si cambias una demo, regenera su captura.
9e. **Peso**: eliminé las capturas PNG de página completa de la barbería (≈6 MB, ninguna página las usaba) para que no se publiquen. Su README explica cómo regenerarlas; la miniatura de la landing se conserva en `site/assets/muestras/barberia.webp`.
10. **Sin cookies ni analítica**: la web no usa ninguna, por eso no hay banner de cookies y la política lo declara. La tipografía (Source Sans 3) está alojada en el propio sitio, sin recursos de terceros.
11. **Formulario**: la landing no tiene formulario (el único canal es WhatsApp). El servicio ofrece «formulario o WhatsApp» a los clientes, pero eso es para sus webs.
12. **Textos legales**: asumo titular persona física (autónomo). Plazos de conservación citados: 4 años (tributario) y 6 años (mercantil). Si eres sociedad o los plazos difieren, corrígelo.
13. **Hosting**: la política cita GitHub Pages como proveedor de alojamiento de esta web.
14. **`404.html`** usa rutas absolutas `/web-portfolio/…` (necesario para que funcione en cualquier ruta de Pages).

## Decisiones del rediseño de la landing (noviembre 2026)

Las reglas de diseño y de textos para todas las webs del repo están en `CLAUDE.md`. Lo que decidí al aplicarlas a la landing:

1. **Tipografía**: Source Sans 3 (variable, 29 KB, licencia OFL en `site/assets/fonts/`), alojada en el sitio y precargada. Es sobria, se lee bien en móvil y tiene todos los caracteres del español. Titulares: `h1` 32 px en móvil y 44 px en escritorio; `h2` 28 y 34 px. Los `h3` (20 px) son subtítulos de bloque, no titulares de sección.
2. **Color**: fondo blanco, gris muy claro (`#f5f6f4`) para alternar secciones, texto casi negro y un único acento verde (`#17804a`), que es también el color de los botones de WhatsApp. Contraste del texto blanco sobre el verde: 5:1.
3. **Forma**: radios de 4 a 6 px, bordes de 1 px, sin sombras. Solo hay transiciones de color al pasar el ratón (desactivadas con `prefers-reduced-motion`).
4. **Estructura**: cabecera con nombre, menú y botón; portada a dos columnas con una captura real de la muestra del restaurante en lugar de una ilustración; para quién es; qué incluye; pasos; muestras; precio; preguntas; cierre. La presentación («Me llamo Pablo…») va en el cierre, junto al último botón, en vez de en una sección propia que quedaba demasiado vacía.
5. **Quitado**: la barra fija de WhatsApp en móvil y su `main.js` (la página ya no lleva JavaScript), las etiquetas numeradas («01», «Caso 1»), las versalitas espaciadas, el bocadillo de chat de la portada, la sección oscura del precio y los títulos con serif.
6. **Pasos**: siguen siendo una lista ordenada (`<ol>`) para lectores de pantalla, pero sin números visibles; el orden se entiende por los títulos.
7. **Textos**: reescritos en español de España, en primera persona y con titulares que describen la sección. Se mantienen la oferta, los marcadores y las aclaraciones (sin promesa de posiciones en Google, cambios extra con precio previo). Cifras y unidades con espacio de no separación (`395&nbsp;€`) para que no se partan.
8. **Nueva afirmación**: «Hablas conmigo desde el primer mensaje hasta que la web está publicada, sin intermediarios». Quítala si en algún momento trabajas con otras personas.
9. **Páginas legales**: mismo contenido; solo cambian cabecera, pie y estilos para encajar con la landing. Mantienen la numeración de apartados, que es la habitual en textos legales.
10. **`og.png`**: regenerada con la nueva tipografía y colores.

## Despliegue (GitHub Pages)

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz merge a `main`. El workflow `.github/workflows/pages.yml` ejecuta `node scripts/check.mjs` (falla si hay enlaces o recursos internos rotos) y publica `site/` (landing y muestras).
3. También se puede lanzar a mano desde la pestaña Actions (`workflow_dispatch`).

## Probar en local

```bash
cd site && python3 -m http.server 8000   # http://localhost:8000
node scripts/check.mjs                    # enlaces y marcadores
```

## Verificación realizada

- Navegador (Chromium) a 375 px y 1440 px: landing, páginas legales, 404 y las tres demos sin desbordamiento horizontal ni errores de consola; tarjetas con captura y enlaces de ida y vuelta entre landing y demos funcionando.
- Rediseño revisado en tres rondas de crítica a 375 px y 1440 px. Se corrigió que «395 €» se partía en dos líneas, que las secciones estrechas no se alineaban con el resto y que la sección «Quién hace tu web» quedaba vacía.
- Lighthouse tras el rediseño (móvil y escritorio): landing, aviso legal y privacidad = 100 en las cuatro categorías.
- Lighthouse 12 (móvil y escritorio): landing, aviso legal y privacidad = 100 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- Lighthouse en las demos (no son parte de la landing): Accesibilidad 100 en las tres tras corregir contraste (etiquetas «veg», botón verde de WhatsApp, texto «pendiente») y `aria-label` que no contenían el texto visible (pestañas de días del restaurante, logotipo del taller). **SEO 63 en las tres, solo por el `noindex` intencionado.** Rendimiento en móvil: 97 (barbería), 97 (taller) y 91 (restaurante, sin optimizar); 100 en escritorio.
- `scripts/check.mjs` revisa ahora todo `site/` (html y css, anclas y `url()` de fuentes) y pasa sin errores.
- **No verificado**: los enlaces externos (wa.me, AEPD, política de WhatsApp, declaración de GitHub), porque el entorno de desarrollo no tenía salida a esos dominios. Haz clic en ellos tras desplegar. Tampoco se ha probado el despliegue real en Pages.
