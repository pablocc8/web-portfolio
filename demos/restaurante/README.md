# Arrossos del Marjal · Demo de arrocería

Web estática (HTML + CSS + JS, sin dependencias) para una arrocería ficticia en El Grau de Castelló.

- **Carta digital** por categorías, con filtro de los 14 alérgenos (UE 1169/2011) y opción solo vegetariano.
- **Arroces y fideuàs** con aviso de mínimo 2 personas y tiempo de espera; botón para encargarlos al reservar.
- **Menú del día** que cambia según el día de la semana (abre por defecto en el de hoy; lunes cerrado).
- **Reserva de mesa** (día, hora, comensales, zona, arroz encargado) que genera el mensaje de WhatsApp con vista previa en vivo.
- Estado *abierto / cerrado* y horario calculados en tiempo real.

Datos editables en `js/data.js`. Para verla en local: `python3 -m http.server` dentro de esta carpeta.
