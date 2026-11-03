# Landing: webs para negocios locales (Comunidad Valenciana)

Landing en HTML, CSS y JS puro (sin build) que vende un único servicio: web profesional en 3 días laborables por 395 € de pago único, con mantenimiento opcional de 20 €/mes. Objetivo único: que el visitante escriba por WhatsApp.

```
site/                 ← lo que se publica
  index.html          landing
  aviso-legal.html    aviso legal (LSSI)
  privacidad.html     privacidad y cookies (RGPD / LOPDGDD / LSSI)
  404.html, robots.txt, sitemap.xml
  assets/             styles.css, main.js, favicon.svg, og.png
scripts/check.mjs     comprueba enlaces internos y lista marcadores pendientes
.github/workflows/pages.yml   despliegue a GitHub Pages
```

## ⚠️ Aviso: textos legales

`aviso-legal.html` y `privacidad.html` son un **borrador redactado conforme a LSSI-CE, RGPD y LOPDGDD, pero no son asesoramiento jurídico**. El titular debe revisarlos entero antes de publicar (en especial: plazos de conservación, proveedores/encargados, transferencias internacionales y la jurisdicción) y ajustarlos a su situación real. Si algún día se añade analítica, formularios, cookies o publicidad, hay que actualizarlos.

## Marcadores que debes sustituir

Búscalos con `grep -rn "\[\[" site/` o ejecuta `node scripts/check.mjs` (lista cada marcador y en qué archivo está). Cuando no quede ninguno, el script no imprime marcadores.

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
| `TODO_URL_MUESTRA_3` | index, `href` de la tarjeta «Clínica» | URL de la web de muestra |

La tarjeta «Barbería» enlaza a `demos/barberia/` (demo en `demos/barberia`, rama `claude/jolly-fermi-g3ldm0`). La tarjeta «Taller» ya enlaza a `demos/taller/` (demo en `demos/taller`, que el workflow copia al sitio publicado; **fusiona antes la rama de esa demo**, o `check.mjs` fallará por enlace roto). Al poner cada URL de muestra restante, cambia `href="#TODO_URL_MUESTRA_n"` por la URL real y borra la etiqueta `<span class="todo">TODO: añadir URL</span>` de esa tarjeta.

### Valores que no son marcadores pero debes revisar

- **URL base `https://pablocc8.github.io/web-portfolio/`**: es la URL que tendrá en GitHub Pages. Aparece en `canonical`, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` y `404.html` (ruta `/web-portfolio/`). Si usas dominio propio, sustitúyela en todos esos sitios (búscala con `grep -rn "pablocc8.github.io\|/web-portfolio/" site/`).
- **WhatsApp**: todos los botones apuntan a `https://wa.me/34623130633?text=…` (prefijo 34, sin `+` ni espacios; el mensaje precargado es «Hola, me interesa la web de 395 € en 3 días. Mi negocio es: »). Hay 5 enlaces en `index.html`.
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
9. **Muestras**: las tarjetas son ilustraciones CSS genéricas (peluquería, taller, clínica), rotuladas como ejemplos y no como clientes. Sin testimonios, cifras ni premios.
10. **Sin cookies ni analítica**: la web no usa ninguna, por eso no hay banner de cookies y la política lo declara. Fuentes del sistema, sin recursos de terceros.
11. **Formulario**: la landing no tiene formulario (el único canal es WhatsApp). El servicio ofrece «formulario o WhatsApp» a los clientes, pero eso es para sus webs.
12. **Textos legales**: asumo titular persona física (autónomo). Plazos de conservación citados: 4 años (tributario) y 6 años (mercantil). Si eres sociedad o los plazos difieren, corrígelo.
13. **Hosting**: la política cita GitHub Pages como proveedor de alojamiento de esta web.
14. **`404.html`** usa rutas absolutas `/web-portfolio/…` (necesario para que funcione en cualquier ruta de Pages).

## Despliegue (GitHub Pages)

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz merge a `main`. El workflow `.github/workflows/pages.yml` ejecuta `node scripts/check.mjs` (falla si hay enlaces internos rotos) y publica `site/`.
3. También se puede lanzar a mano desde la pestaña Actions (`workflow_dispatch`).

## Probar en local

```bash
cd site && python3 -m http.server 8000   # http://localhost:8000
node scripts/check.mjs                    # enlaces y marcadores
```

## Verificación realizada

- Navegador (Chromium) a 375 px y 1440 px: sin desbordamiento horizontal ni errores de consola; barra fija de WhatsApp en móvil y FAQ funcionando.
- Lighthouse 12 (móvil y escritorio) en las tres páginas: Rendimiento, Accesibilidad, Buenas prácticas y SEO = 100.
- Enlaces internos y anclas comprobados con `scripts/check.mjs`.
- **No verificado**: los enlaces externos (wa.me, AEPD, política de WhatsApp, declaración de GitHub), porque el entorno de desarrollo no tenía salida a esos dominios. Haz clic en ellos tras desplegar. Tampoco se ha probado el despliegue real en Pages.
