# Fisio Camí · muestra de clínica de fisioterapia

Web de muestra de una sola página para una clínica de fisioterapia **ficticia** en Castelló de la Plana. Es un escaparate comercial: no representa a ningún negocio real.

- Ruta pública prevista: `/web-portfolio/muestras/fisioterapia/`
- HTML, CSS y JS puro. Sin build, sin dependencias externas, sin peticiones a terceros. Rutas relativas.
- Archivos: `index.html`, `styles.css`, `script.js`, `favicon.svg`, `fonts/` (Source Sans 3 400 y 600 + licencia).
- Miniatura para la landing: `site/assets/muestras/fisioterapia.webp` (800 × 500, como las otras tres).
- No se ha tocado la landing ni las otras muestras. Tampoco está en `sitemap.xml`, porque lleva `noindex`.

## Cómo enlazarla desde la landing

La landing no se ha modificado. Para añadir la tarjeta, en `site/index.html`, sección `#muestras`:

1. Cambia `<div class="cols cols--3">` por `<div class="cols cols--2">`. Con cuatro tarjetas queda una rejilla de 2 × 2; con `cols--3` la cuarta se quedaría sola en otra fila. No hace falta tocar el CSS: `.cols--2` ya existe.
2. Cambia el texto «Webs de muestra para tres tipos de negocio.» por «Webs de muestra para cuatro tipos de negocio.».
3. Añade esta tarjeta después de la del restaurante:

```html
<a class="sample" href="muestras/fisioterapia/">
  <div class="sample__shot"><img src="assets/muestras/fisioterapia.webp" width="800" height="500" loading="lazy" decoding="async" alt="Captura de la web de muestra de una clínica de fisioterapia: titular, botón de cita por WhatsApp y horario."></div>
  <div class="sample__body"><h3>Fisioterapia</h3><p>Tratamientos con duración y precio, horario por franjas y cita por WhatsApp eligiendo tratamiento y franja.</p><span class="sample__go">Ver muestra<span class="sr-only"> de fisioterapia</span> →</span></div>
</a>
```

4. Opcional: añade `fisioterapia/  Fisio Camí (clínica de fisioterapia, Castelló)` al árbol de carpetas del `README.md` raíz.
5. Ejecuta `node scripts/check.mjs` para confirmar que los enlaces siguen bien.

El enlace de vuelta del banner de la muestra ya apunta a `../../#muestras`.

## Qué hay en la página

| Bloque | Qué hace |
|---|---|
| Banner fijo | «Ejemplo de diseño con un negocio ficticio · Volver a las muestras» (`../../#muestras`). Siempre visible arriba. En móvil el enlace muestra solo «Volver», pero su nombre accesible sigue siendo «Volver a las muestras». |
| Cabecera | Logotipo, cinco enlaces y botón «Pedir cita». En móvil, botón «Menú» que despliega la navegación (Escape la cierra). |
| Hero | Titular descriptivo, un solo botón, estado en vivo (abierto o cerrado según la hora de España) y dirección. Hueco de foto. |
| Tratamientos y precios | 9 tratamientos con descripción, duración y precio. Cada uno tiene «Pedir cita», que lo deja elegido en el formulario. Debajo, bono de 5 sesiones y nota sobre seguros. |
| Primera visita | Qué pasa en la primera sesión. Hueco de foto. |
| Equipo | Tres fisioterapeutas con nombre de pila y especialidad, sin fotos. |
| Reseñas de ejemplo | Etiqueta visible «Reseñas de ejemplo» y solo nombres de pila. |
| Horario por franjas (mapa de horarios) | Tabla días × franjas (primera hora, media mañana, tarde, última hora). Marca el día de hoy. Cada franja abierta es un botón: al pulsarla, el formulario queda con ese día (el próximo que toque) y esa franja. |
| Pedir cita por WhatsApp | Tratamiento, día (próximos 14 días sin domingos), franja, nombre y motivo opcional. Las franjas se desactivan según el día (viernes sin última hora, sábado solo mañana) y las de hoy que ya han pasado. Valida con mensajes en español y lleva el foco al primer error. Al enviar, muestra el mensaje de WhatsApp que se generaría. |
| Preguntas frecuentes | 7 preguntas con `<details>`. |
| Pie | Dirección ficticia, «Cómo llegar», horario, teléfono, WhatsApp, email y textos legales. |
| ¿Quieres una web así para tu negocio? | Separada del ejemplo con fondo oscuro y el aviso «Aquí termina el ejemplo». Qué incluye, 395 € de pago único, entrega en 3 días laborables y botón a `https://wa.me/34623130633` con el texto precargado. |
| Botón flotante | Solo en móvil y solo uno: WhatsApp. Se oculta mientras se ve el botón del hero y en la cita, el pie y la sección comercial, para no tapar el formulario ni competir con otros botones. |

### Avisos de los botones reales
Llamar, WhatsApp de la clínica, email, «Cómo llegar», aviso legal y privacidad abren un `<dialog>` que explica qué haría ese botón en la web del cliente (por ejemplo: «En la web de la clínica, este botón abriría el chat de WhatsApp con la clínica.»). En la cita, el aviso enseña además el mensaje completo. Se cierra con «Entendido», con Escape o pulsando fuera, y el foco vuelve al botón que lo abrió.

El único enlace externo real es el de la sección comercial (`wa.me/34623130633`).

## Configuración

Al principio de `script.js`:

```js
const CONFIG = {
  precio: 395,
  plazo: '3 días laborables',
  whatsapp: '34623130633',
  mensaje: 'Hola, he visto la web de ejemplo de fisioterapia y me interesa una así por {precio} € con entrega en {plazo}. Mi negocio es: '
};
```

El script rellena los elementos `data-cfg="precio"` y `data-cfg="plazo"` y genera el enlace de los `data-cfg-wa`. El HTML lleva los mismos valores escritos para que todo funcione también sin JavaScript; si cambias el precio o el plazo, cámbialo también en `index.html` (sección `#web-asi`) para que coincida sin JS.

### Horario
Está en tres sitios que deben coincidir: `HORARIO` y `FRANJAS` en `script.js` (estado en vivo y formulario), la tabla `.mapa` y el pie de `index.html`, y `openingHoursSpecification` en el JSON-LD.

- Lunes a jueves: 8:30 a 14:00 y 15:30 a 21:00
- Viernes: 8:30 a 14:00 y 15:30 a 18:30
- Sábado: 9:00 a 13:00
- Domingo y festivos: cerrado

### Probar a cualquier hora
Añade `?ahora=AAAA-MM-DDTHH:MM` (hora de España):

- `?ahora=2026-11-05T11:30` → «Abierto ahora · cierra a las 14:00»
- `?ahora=2026-11-05T13:45` → «Abierto · cierra pronto, a las 14:00»
- `?ahora=2026-11-05T14:30` → «Cerrado ahora · abre hoy a las 15:30»
- `?ahora=2026-11-07T14:00` → «Cerrado ahora · abre el lunes a las 8:30»

Sin parámetro usa la hora real de `Europe/Madrid` y se actualiza cada minuto.

## Decisiones tomadas (sin preguntar)

1. **Nombre y datos ficticios.** Teléfono «964 XX XX XX», email `hola@fisiocami.example` (dominio `.example`, reservado) y dirección «Carrer de l'Exemple, 0, bajo · 12001 Castelló de la Plana (dirección ficticia)».
2. **Tipografía.** Una sola familia, Source Sans 3 (pesos 400 y 600, subconjunto latino, 31 KB en total), alojada en `fonts/`. Es una sans humanista muy legible en móvil y poco vista en webs generadas. Hay una fuente de reserva con métricas ajustadas (Arial o Liberation Sans con `size-adjust`) para que el cambio de fuente no mueva el texto (CLS 0).
3. **Tamaños.** H1 de 32 px (móvil) a 44 px (escritorio); H2 de 28 a 34 px; el título del aviso, 28 px. Los títulos de tarjeta (19 px) y los de columna del pie (17 px) son subtítulos, no titulares.
4. **Color.** Neutros (texto `#1D2422`, secundario `#545C59`, bordes `#DCE0DD`, fondo blanco y gris claro `#F4F5F3`) y un solo acento verde azulado `#0E6B63`, habitual en salud. Contraste: texto 15,8:1; secundario 6,9:1; acento sobre blanco 6,4:1; blanco sobre el acento 6,4:1. El rojo `#A4161A` solo aparece en los errores del formulario, por accesibilidad.
5. **Forma.** Radios de 4 a 8 px, bordes de 1 px, sombra solo en el aviso, el menú móvil y el botón flotante. Sin etiquetas numeradas, sin versalitas, sin ilustraciones. Las únicas transiciones son de color (0,15 s), el giro de la flecha de las preguntas y la aparición del botón flotante; con `prefers-reduced-motion` se quitan.
6. **Fotos.** Dos huecos neutros con el texto «Aquí iría una foto del negocio»: hero (4:3, 3:2 en móvil) y primera visita (4:3). El equipo va sin fotos para no llenar la página de recuadros grises.
7. **Precios** (Castelló, 2026): primera visita 45 € (60 min), sesión 38 € (45 min), deportiva 40 €, punción seca 30 € (30 min, +10 € dentro de una sesión), rehabilitación tras cirugía 40 €, suelo pélvico 48 € (50 min), drenaje linfático 45 € (60 min), domicilio 55 €, pilates terapéutico 14 € la clase (bono de 4 clases al mes: 50 €). Bono de 5 sesiones: 175 €.
8. **Mapa de horarios.** Lo he interpretado como una tabla semanal por franjas, no como un mapa geográfico. Así sirve a la vez para ver el horario y para elegir hueco en el formulario. No hay mapa de ubicación: incrustar Google Maps añadiría peticiones a terceros y cookies; el botón «Cómo llegar» muestra el aviso.
9. **Franjas de 2,5 a 3 horas.** Para una muestra, pedir franja y no hora exacta es más realista: la clínica confirma la hora por WhatsApp. Para hoy solo se ofrecen franjas a las que les queden al menos 30 minutos.
10. **Reseñas.** Tres, con la etiqueta «Reseñas de ejemplo» y solo nombres de pila (Vicent, Amparo, Rubén). Sin estrellas.
11. **JSON-LD** de tipo `Physiotherapy` (subtipo de `MedicalBusiness` en schema.org) con dirección, horario y los 9 tratamientos como `Offer`. La descripción indica que es un negocio ficticio.
12. **`noindex`** en `<meta name="robots">`. Por eso Lighthouse da 63 en SEO: la única auditoría que falla es `is-crawlable`.
13. **Sección comercial.** Lo que incluye repite la oferta de la landing (diseño a medida, ficha de Google y SEO local básico, WhatsApp, dominio y hosting, una ronda de cambios). No digo si el precio lleva IVA porque en la landing sigue pendiente (`[[IVA_INDICACION]]`). La nota «los días cuentan desde que me envías textos, fotos y logotipo» sigue la FAQ de la landing.
14. **Abrir con doble clic.** Por `file://` el navegador bloquea las fuentes. Un script corto en el `<head>` lo detecta y usa la fuente de reserva, así que no salen errores en consola. Las precargas de las fuentes se añaden desde ese mismo script solo por http(s). Sin JavaScript, la página se ve y se lee entera: en móvil la navegación aparece como una fila de enlaces, el botón flotante no se muestra y los botones de aviso no hacen nada.
15. **Español de España** con frases cortas. Revisado: sin guiones largos, sin «no es X, es Y» y sin series de tres adjetivos.

## Verificación

### Dos rondas de crítica (375 px y 1440 px, página completa)
**Ronda 1.** Corregido:
- Las 22 franjas del mapa tenían un borde demasiado marcado y el bloque pesaba mucho → borde más suave.
- En escritorio la columna de texto de la cita quedaba vacía junto al formulario → ahora se queda fija mientras se rellena.
- La línea del pie legal era 32 px más ancha que el contenido → alineada.
- La lista de la sección comercial en dos columnas partía frases → una columna.
- Las franjas del formulario en móvil ocupaban demasiado alto → filas compactas con nombre y horas en la misma línea.

**Ronda 2.** Corregido:
- El botón flotante tapaba las opciones del formulario y la foto del hero → se oculta en esas zonas.
- «30 €» se partía al final de línea en el aviso → espacios de no separación entre cifra y unidad (41 casos).
- Palabras sueltas al final de párrafo («cita.») → `text-wrap: pretty`.
- Errores de CORS de las fuentes al abrir el archivo con doble clic → resuelto (punto 14).
- En tableta la etiqueta «Hoy» del mapa saltaba de línea con sangría → debajo del día, alineada.
- Sin JavaScript, la cabecera perdía el margen lateral en móvil y aparecía un botón flotante que no hacía nada → corregido.
- Los mensajes de error ocultos estaban enlazados con `aria-describedby` desde el principio, así que un lector de pantalla los habría leído sin haber error → ahora se enlazan solo cuando aparecen.
- `html-validate` (reglas recomendadas): 0 errores tras poner el `DOCTYPE` en mayúsculas.

Sin desbordamiento horizontal en 18 anchos de 320 a 1920 px.

### Interacciones (Playwright, 93 comprobaciones, todas OK)
Estado en vivo en 9 momentos (abierto, cierra pronto, mediodía, antes de abrir, después de cerrar, viernes, sábado, domingo), fila de hoy en el mapa, días del formulario sin domingos y sin hoy cuando ya no quedan franjas, franjas desactivadas por día y por hora, clic en el mapa (día correcto incluida la semana siguiente, franja marcada, foco y anuncio para lectores de pantalla), «Pedir cita» desde un tratamiento, validación, foco y asociación de los errores con `aria-describedby`, mensaje de WhatsApp completo, avisos de todos los botones (cierre con botón, Escape y clic fuera, con devolución del foco), menú móvil, anclas bajo el banner, botón flotante, enlace y texto de la sección comercial, banner fijo, enlace de vuelta y «Saltar al contenido». 0 errores y 0 avisos de consola por `http://` y por `file://`.

### Lighthouse 12.8.2 (móvil, throttling simulado)

| Servidor | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Sin compresión (`python3 -m http.server`), 9 pasadas | 99 o 100 (FCP 1,3 a 1,5 s · LCP 1,5 a 1,6 s · TBT 30 a 100 ms · CLS 0) | 100 | 100 | 63 |
| Con gzip, como GitHub Pages (`serve`), 7 pasadas | 100 en todas (FCP 0,8 a 1,1 s · LCP 1,1 a 1,2 s · TBT 0 ms · CLS 0) | 100 | 100 | 63 |

Una primera pasada aislada en frío dio 85 en rendimiento (TBT 560 ms por arranque del navegador); al repetirla dio 100 y no volvió a pasar.

### Comprobaciones del repositorio
`node scripts/check.mjs`: enlaces, recursos y anclas internos OK (incluido `../../#muestras`). Esta carpeta no añade marcadores.

### No verificado
El enlace a `wa.me` no se ha abierto, porque el entorno no tiene salida a ese dominio. Pruébalo tras desplegar.

## Miniatura
`site/assets/muestras/fisioterapia.webp`: captura a 1280 × 800 (escala 2) de `?ahora=2026-11-05T11:30`, reducida a 800 × 500 y guardada en WebP (17 KB). Si cambias el hero, regenérala igual.

## Licencias
Source Sans 3 (woff2, latín), de `@fontsource/source-sans-3` 5.3.1. SIL Open Font License 1.1 · © 2010-2024 Adobe. Texto completo en `fonts/LICENSE-source-sans-3.txt`. El logotipo, el favicon y el icono del botón flotante son originales de esta muestra.
