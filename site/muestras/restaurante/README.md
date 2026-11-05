# Arrossos del Marjal · Muestra de arrocería

Web estática (HTML, CSS y JS, sin dependencias) para una arrocería ficticia en El Grau de Castelló. Se publica con la landing en `/muestras/restaurante/` y lleva `noindex` por ser un negocio inventado.

## Qué hace

- **Menú del día** por pestañas (abre en el día de hoy; lunes cerrado), con teclado: flechas, Inicio y Fin.
- **Carta** por categorías, con filtro «Solo vegetariano» y filtro de los 14 alérgenos (Reglamento UE 1169/2011).
- **Arroces y fideuàs**: aviso de mínimo 2 personas y tiempo de espera, y botón «Encargar al reservar».
- **Reserva de mesa** (día, hora, personas, zona, arroz encargado y observaciones). Valida los datos, enseña la vista previa del mensaje y abre WhatsApp con el texto escrito.
- **Estado abierto o cerrado** y horario calculados en el momento, en la sección «Dónde estamos» y en el pie.
- **Botón flotante de WhatsApp** solo en móvil.

Los datos (carta, horario, turnos, menús y teléfono) están en `js/data.js`.

## Rediseño: decisiones tomadas

Objetivo: que parezca una web hecha por un estudio pequeño para un restaurante de barrio, sin rasgos típicos de diseño generado.

**Tipografía**
- Una sola familia: DM Sans (ya estaba alojada en `fonts/`, licencia SIL OFL 1.1). Se elimina Fraunces y su licencia, unos 270 KB menos.
- H1 de 28 px en móvil a 44 px en escritorio. H2 de 28 a 34 px. Sin versalitas ni texto con espaciado amplio.

**Color**
- Neutros cálidos (texto `#1f2421`, secundario `#565b58`, fondos `#ffffff` y `#f5f4f1`, bordes `#dedcd6`) y un único acento verde oscuro `#2e6a4b`.
- Elegí verde porque encaja con el marjal y la huerta, y porque así el botón de WhatsApp no añade un segundo color: todos los botones usan el mismo acento.
- El único color fuera de la paleta es el rojo `#a33b2b` de los mensajes de error del formulario, por convención.
- Fondo claro en toda la página: un restaurante de este tipo no necesita fondo oscuro.
- Contrastes comprobados: acento sobre blanco 6,4:1, texto secundario sobre gris 6,3:1, etiqueta de las fotos 5,6:1.

**Maquetación**
- Cabecera con el nombre y 4 enlaces: Menú del día, Carta, Reservas y Dónde estamos. En móvil se pliegan en un menú.
- Hero con titular descriptivo, un párrafo, un botón («Reservar mesa») y una foto. Debajo, el estado abierto o cerrado y la dirección.
- Orden: hero, Sobre el restaurante, Menú del día, Carta y precios, Reservar mesa, Dónde estamos, pie y, al final, la sección de la oferta.
- La carta se presenta como lista a dos columnas (nombre y precio en la misma línea), como una carta impresa, en lugar de tarjetas. El «precio por persona» de los arroces va en la nota de cada grupo para no descuadrar la lista.
- Pie con horario (se genera desde `data.js`), dirección y contacto.
- Radios de 4 a 8 px (el punto del estado abierto o cerrado es un círculo de 8 px), bordes de 1 px y una única sombra suave en el botón flotante.
- Sin animaciones. El desplazamiento suave solo se activa si el sistema no pide reducir el movimiento.

**Qué se ha quitado**
- Las ilustraciones SVG (paella, limón, ola, mapa ilustrado), los separadores ondulados, los iconos de adorno y el logotipo dibujado.
- Los antetítulos tipo «Arrocería · El Grau de Castelló» en mayúsculas espaciadas.
- La barra flotante «Reservar mesa». En móvil queda un solo botón flotante de WhatsApp.
- Solo quedan dos iconos: el de WhatsApp en los botones que abren WhatsApp y la cruz de los alérgenos marcados.
- El favicon pasa a ser una «M» blanca sobre el verde del acento.

**Fotos**
- No hay fotos reales. Cada foto es un recuadro gris con la proporción final y la etiqueta «Aquí iría una foto del negocio»: hero 4:3, «Sobre el restaurante» 3:2 y fachada 4:3 (16:9 en tableta).
- Para poner una foto real, cambia el `<div class="foto …">` por `<img src="…" width="…" height="…" alt="…">` con la misma proporción y añade `loading="lazy"` en todas menos la del hero.

**Textos**
- Español de España, frases cortas y titulares descriptivos («Carta y precios», «Reservar mesa», «Dónde estamos»).
- Sin eslóganes, sin rayas, sin series de tres adjetivos y sin estructuras tipo «no es X, es Y». Los horarios se escriben «13:00 a 16:00».
- El mensaje de WhatsApp de la reserva ya no lleva emojis.

**Banner de ejemplo y oferta**
- Esta muestra solo tenía el aviso de demo en el pie. He añadido el banner superior «Web de ejemplo con un negocio ficticio. Volver a las muestras», como en las otras dos muestras, y mantengo el aviso en el pie.
- Tampoco tenía sección final con la oferta. La he añadido después del pie, como en la barbería, con la etiqueta «Fin del ejemplo»: 395 € de pago único, lista en 3 días laborables, mantenimiento opcional de 20 € al mes y botón a WhatsApp (`34623130633`, con el mensaje «Hola, he visto la web de ejemplo del restaurante y me interesa una para mi negocio»).
- Firmo la oferta como «Pablo» (igual que la cabecera de la landing) para no meter aquí el marcador `[[NOMBRE_COMERCIAL]]`. Si prefieres el nombre comercial, cámbialo en la sección `#oferta` de `index.html`. No menciono el IVA porque en la landing aún es un marcador.

**Botón flotante de WhatsApp**
- Abre el WhatsApp del restaurante (el número ficticio de `data.js`), como lo haría la web real.
- Se oculta mientras se ve el formulario de reserva, que ya tiene su propio botón, y en la sección de la oferta, para no confundirlo con tu número.
- Lleva texto visible («WhatsApp») además del icono y tiene 8 px de radio, como el resto de botones.

## Lo que se mantiene

- Toda la funcionalidad anterior: pestañas, filtros, encargo de arroz, validación, vista previa y apertura de WhatsApp.
- `noindex`, las rutas (`/muestras/restaurante/`, enlace de vuelta `../../#muestras`) y los `id` de las secciones (`#inicio`, `#menu-dia`, `#carta`, `#reservar`, `#visitanos`).
- Las correcciones de accesibilidad: el `aria-label` de las pestañas contiene el texto visible, el texto «pendiente» de la vista previa usa `#5a6166` y los botones verdes cumplen el contraste.
- Además: enlace para saltar al contenido, menú con `aria-expanded` y cierre con Escape, errores con `role="alert"` y `aria-invalid`, y aviso de «se abre en una pestaña nueva» en los enlaces externos.

## Números ficticios

`600 12 34 56` (restaurante) es inventado, pero los botones abren WhatsApp con ese número. Si te preocupa que pertenezca a alguien, cámbialo por uno tuyo en `js/data.js` (`WHATSAPP`, `TELEFONO`, `TELEFONO_VISIBLE`) y en los `tel:` y `wa.me` de `index.html`.

## Miniatura de la landing

`site/assets/muestras/restaurante.webp` (800×500) se ha regenerado con Chromium: ventana de 1280×800 sin el banner de ejemplo, reducida a 800×500 y guardada en WebP con calidad 82. Si cambias el hero, repítela.

## Verificación

- Chromium a 375 px y 1440 px, dos rondas de crítica con capturas. También sin desbordamiento horizontal a 320, 414, 768, 1024, 1280 y 1920 px, y sin errores de consola.
- Prueba automática de la interacción (33 comprobaciones): menú móvil, pestañas con teclado, lunes cerrado, filtros, alérgenos, estado vacío, encargo de arroz, validación, lunes rechazado, envío a `wa.me` con el mensaje correcto y el botón flotante oculto sobre el formulario y la oferta.
- `node scripts/check.mjs`: enlaces, recursos y anclas OK, sin marcadores nuevos.
- Lighthouse 12.8. Móvil: Rendimiento 99 o 100 según la pasada, Accesibilidad 100, Buenas prácticas 100. Escritorio: 100, 100 y 100. SEO 63 en ambos, solo por el `noindex` (`is-crawlable`). CLS 0.

Para verla en local: `cd site && python3 -m http.server` y abrir `http://localhost:8000/muestras/restaurante/`.
