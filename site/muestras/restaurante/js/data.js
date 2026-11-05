/* ==========================================================
   Arrossos del Marjal · Datos de la carta, menú y horario
   ========================================================== */

window.MARJAL = (function () {
  "use strict";

  // 14 alérgenos de declaración obligatoria · Reglamento (UE) 1169/2011
  const ALERGENOS = [
    { id: "gluten", nombre: "Gluten" },
    { id: "crustaceos", nombre: "Crustáceos" },
    { id: "huevo", nombre: "Huevo" },
    { id: "pescado", nombre: "Pescado" },
    { id: "cacahuetes", nombre: "Cacahuetes" },
    { id: "soja", nombre: "Soja" },
    { id: "lacteos", nombre: "Lácteos" },
    { id: "frutos", nombre: "Frutos de cáscara" },
    { id: "apio", nombre: "Apio" },
    { id: "mostaza", nombre: "Mostaza" },
    { id: "sesamo", nombre: "Sésamo" },
    { id: "sulfitos", nombre: "Sulfitos" },
    { id: "altramuces", nombre: "Altramuces" },
    { id: "moluscos", nombre: "Moluscos" }
  ];

  const CATEGORIAS = [
    { id: "picar", nombre: "Para picar", nota: "Al centro, para abrir boca mientras se hace el arroz." },
    { id: "secos", nombre: "Arroces secos", nota: "En paellera, con su socarrat.", arroz: true },
    { id: "melosos", nombre: "Melosos y caldosos", nota: "De cuchara, con el caldo justo.", arroz: true },
    { id: "fideua", nombre: "Fideuàs", nota: "Fideo fino tostado, con alioli de la casa.", arroz: true },
    { id: "brasa", nombre: "Mar y brasa", nota: "Pescado de la lonja del Grau y carnes a la leña." },
    { id: "postres", nombre: "Postres", nota: "Caseros, como los de la yaya." }
  ];

  // arroz: true -> precio por persona, mínimo 2 raciones y tiempo de espera
  const CARTA = [
    // Para picar
    { id: "esgarraet", cat: "picar", nombre: "Esgarraet con bacalao", desc: "Pimiento rojo asado a la leña, bacalao desalado, ajo tierno y aceite de la Plana.", precio: 12.5, alergenos: ["pescado"] },
    { id: "clochinas", cat: "picar", nombre: "Clóchinas al vapor", desc: "Mejillón autóctono del puerto con limón y pimienta negra.", precio: 13, alergenos: ["moluscos"] },
    { id: "tellinas", cat: "picar", nombre: "Tellinas a la plancha", desc: "Con ajo y perejil, recién llegadas de la playa del Pinar.", precio: 15.5, alergenos: ["moluscos"] },
    { id: "calamar", cat: "picar", nombre: "Calamar de playa a la andaluza", desc: "Rebozado ligero, frito en aceite de oliva y con mayonesa de lima.", precio: 16, alergenos: ["moluscos", "gluten", "huevo"] },
    { id: "langostinos", cat: "picar", nombre: "Langostinos de Vinaròs", desc: "A la plancha, con sal gruesa y un hilo de aceite.", precio: 22, alergenos: ["crustaceos"] },
    { id: "ensalada", cat: "picar", nombre: "Ensalada valenciana", desc: "Tomate de la huerta, cebolla tierna, olivas partidas y huevo cocido.", precio: 9.5, alergenos: ["huevo"], veg: true },
    { id: "alcachofas", cat: "picar", nombre: "Alcachofas de Benicarló a la brasa", desc: "Abiertas en flor, con sal en escamas y aceite de oliva virgen extra.", precio: 11.5, alergenos: [], veg: true },
    { id: "croquetas", cat: "picar", nombre: "Croquetas de puchero (6\u00a0uds.)", desc: "Cremosas, de cocido de toda la vida.", precio: 10, alergenos: ["gluten", "lacteos", "huevo", "apio"] },

    // Arroces secos
    { id: "valenciana", cat: "secos", nombre: "Paella valenciana", desc: "Pollo y conejo de corral, garrofó, judía ferraura, tomate y romero.", precio: 17.5, alergenos: [], arroz: true, espera: 25 },
    { id: "banda", cat: "secos", nombre: "Arroz a banda", desc: "Fumet de morralla, sepia y gamba pelada. Con alioli.", precio: 17, alergenos: ["pescado", "moluscos", "crustaceos", "huevo"], arroz: true, espera: 25 },
    { id: "negro", cat: "secos", nombre: "Arroz negro", desc: "Calamar, sepia y su tinta, ñora y alioli suave.", precio: 17.5, alergenos: ["pescado", "moluscos", "huevo"], arroz: true, espera: 25 },
    { id: "senyoret", cat: "secos", nombre: "Arroz del senyoret", desc: "Todo pelado: gamba roja, sepia y rape. Para comer sin mancharse.", precio: 19.5, alergenos: ["pescado", "moluscos", "crustaceos"], arroz: true, espera: 25 },
    { id: "verduras", cat: "secos", nombre: "Arroz de la huerta", desc: "Alcachofa, coliflor, judía, pimiento y ajo tierno en caldo de verduras.", precio: 15.5, alergenos: ["apio"], arroz: true, espera: 25, veg: true },

    // Melosos y caldosos
    { id: "bogavante", cat: "melosos", nombre: "Arroz meloso de bogavante", desc: "Bogavante entero, sofrito de ñora y caldo de cabezas tostadas.", precio: 29, alergenos: ["crustaceos", "pescado", "apio"], arroz: true, espera: 20 },
    { id: "rape", cat: "melosos", nombre: "Arroz caldoso de rape y alcachofa", desc: "Caldo de roca, rape en tacos y alcachofa de Benicarló.", precio: 21, alergenos: ["pescado", "apio"], arroz: true, espera: 20 },
    { id: "setas", cat: "melosos", nombre: "Meloso de setas y trufa", desc: "Boletus, níscalos y trufa negra de Morella, mantecado con queso curado.", precio: 18, alergenos: ["lacteos", "apio"], arroz: true, espera: 20, veg: true },

    // Fideuàs
    { id: "fideua", cat: "fideua", nombre: "Fideuà marinera", desc: "Gamba, sepia y rape con fideo fino tostado en la paellera.", precio: 16.5, alergenos: ["gluten", "crustaceos", "moluscos", "pescado", "huevo"], arroz: true, espera: 20 },
    { id: "fideuanegra", cat: "fideua", nombre: "Fideuà negra", desc: "Con tinta de calamar, ajos tiernos y alioli negro.", precio: 17, alergenos: ["gluten", "moluscos", "pescado", "huevo"], arroz: true, espera: 20 },

    // Mar y brasa
    { id: "lubina", cat: "brasa", nombre: "Lubina de lonja a la sal", desc: "Pieza entera para dos, con patata panadera y verduras.", precio: 24, alergenos: ["pescado"] },
    { id: "suquet", cat: "brasa", nombre: "Suquet de rape", desc: "Guiso marinero con patata, picada de almendra y pan frito.", precio: 23, alergenos: ["pescado", "crustaceos", "frutos", "gluten"] },
    { id: "pulpo", cat: "brasa", nombre: "Pulpo a la brasa", desc: "Sobre parmentier de patata y pimentón de la Vera.", precio: 21, alergenos: ["moluscos", "lacteos"] },
    { id: "entrecot", cat: "brasa", nombre: "Entrecot de vaca a la leña", desc: "300 g, con pimientos asados y patatas fritas caseras.", precio: 24.5, alergenos: [] },

    // Postres
    { id: "arrozleche", cat: "postres", nombre: "Arroz con leche requemado", desc: "Con piel de limón, canela y azúcar tostado al momento.", precio: 6, alergenos: ["lacteos"], veg: true },
    { id: "coca", cat: "postres", nombre: "Coca de llanda con helado de horchata", desc: "Bizcocho esponjoso de la casa y horchata de Alboraia.", precio: 6.5, alergenos: ["gluten", "huevo", "lacteos"], veg: true },
    { id: "sorbete", cat: "postres", nombre: "Sorbete de limón al cava", desc: "Limones de la Plana, sin lácteos. Ideal para cerrar.", precio: 6, alergenos: ["sulfitos"], veg: true },
    { id: "naranjas", cat: "postres", nombre: "Naranjas de la Plana", desc: "En gajos, con miel de azahar y canela.", precio: 5.5, alergenos: [], veg: true }
  ];

  // Horario de apertura por día de la semana (0 = domingo … 6 = sábado)
  const HORARIO = {
    0: [["13:00", "16:30"]],
    1: [],
    2: [["13:00", "16:00"]],
    3: [["13:00", "16:00"]],
    4: [["13:00", "16:00"]],
    5: [["13:00", "16:00"], ["20:30", "23:30"]],
    6: [["13:00", "16:00"], ["20:30", "23:30"]]
  };

  // Turnos que se pueden reservar
  const COMIDA = ["13:00", "13:30", "14:00", "14:30", "15:00"];
  const CENA = ["20:30", "21:00", "21:30", "22:00", "22:30"];
  const TURNOS = {
    0: { comida: COMIDA.concat("15:30"), cena: [] },
    1: { comida: [], cena: [] },
    2: { comida: COMIDA, cena: [] },
    3: { comida: COMIDA, cena: [] },
    4: { comida: COMIDA, cena: [] },
    5: { comida: COMIDA, cena: CENA },
    6: { comida: COMIDA, cena: CENA }
  };

  // Menú del día por día de la semana
  const MENU_DIA = {
    1: null, // lunes: descanso
    2: {
      titulo: "Menú del día",
      precio: 18.5,
      platos: [
        { curso: "Primeros", opciones: [{ n: "Ensalada de tomate con ventresca" }, { n: "Clóchinas al vapor" }] },
        { curso: "Segundos", opciones: [{ n: "Arroz a banda con alioli", arroz: true }, { n: "Merluza a la plancha con verduras" }] },
        { curso: "Postre", opciones: [{ n: "Flan casero", veg: true }, { n: "Fruta de temporada", veg: true }] }
      ],
      incluye: "Pan, bebida y postre o café"
    },
    3: {
      titulo: "Menú del día",
      precio: 18.5,
      platos: [
        { curso: "Primeros", opciones: [{ n: "Esgarraet con bacalao" }, { n: "Crema de calabaza asada", veg: true }] },
        { curso: "Segundos", opciones: [{ n: "Arroz de la huerta", arroz: true, veg: true }, { n: "Pollo de corral al ajillo" }] },
        { curso: "Postre", opciones: [{ n: "Arroz con leche", veg: true }, { n: "Fruta de temporada", veg: true }] }
      ],
      incluye: "Pan, bebida y postre o café"
    },
    4: {
      titulo: "Jueves de paella",
      destacado: "Los jueves hay paella valenciana.",
      precio: 18.5,
      platos: [
        { curso: "Primeros", opciones: [{ n: "Ensalada valenciana", veg: true }, { n: "Sepia a la plancha con alioli" }] },
        { curso: "Segundos", opciones: [{ n: "Paella valenciana", arroz: true }, { n: "Bacalao confitado con pisto" }] },
        { curso: "Postre", opciones: [{ n: "Coca de llanda", veg: true }, { n: "Fruta de temporada", veg: true }] }
      ],
      incluye: "Pan, bebida y postre o café"
    },
    5: {
      titulo: "Menú del día",
      precio: 18.5,
      platos: [
        { curso: "Primeros", opciones: [{ n: "Croquetas de puchero" }, { n: "Alcachofas a la brasa", veg: true }] },
        { curso: "Segundos", opciones: [{ n: "Arroz negro con alioli", arroz: true }, { n: "Dorada a la espalda" }] },
        { curso: "Postre", opciones: [{ n: "Sorbete de limón", veg: true }, { n: "Fruta de temporada", veg: true }] }
      ],
      incluye: "Pan, bebida y postre o café. Solo a mediodía"
    },
    6: {
      titulo: "Menú de fin de semana",
      precio: 26,
      platos: [
        { curso: "Para compartir", opciones: [{ n: "Clóchinas al vapor" }, { n: "Croquetas de puchero" }, { n: "Ensalada valenciana", veg: true }], todos: true },
        { curso: "Arroz a elegir", opciones: [{ n: "Arroz del senyoret", arroz: true }, { n: "Caldoso de rape y alcachofa", arroz: true }, { n: "Arroz de la huerta", arroz: true, veg: true }] },
        { curso: "Postre", opciones: [{ n: "Coca de llanda con helado de horchata", veg: true }, { n: "Naranjas de la Plana", veg: true }] }
      ],
      incluye: "Pan, bebida, postre y café. Solo a mediodía"
    },
    0: {
      titulo: "Menú de fin de semana",
      precio: 26,
      platos: [
        { curso: "Para compartir", opciones: [{ n: "Tellinas a la plancha" }, { n: "Esgarraet con bacalao" }, { n: "Alcachofas a la brasa", veg: true }], todos: true },
        { curso: "Arroz a elegir", opciones: [{ n: "Paella valenciana", arroz: true }, { n: "Arroz a banda", arroz: true }, { n: "Arroz de la huerta", arroz: true, veg: true }] },
        { curso: "Postre", opciones: [{ n: "Arroz con leche requemado", veg: true }, { n: "Sorbete de limón al cava", veg: true }] }
      ],
      incluye: "Pan, bebida, postre y café"
    }
  };

  return {
    WHATSAPP: "34600123456",
    TELEFONO: "+34600123456",
    TELEFONO_VISIBLE: "600 12 34 56",
    MAX_COMENSALES: 12,
    MARGEN_MIN: 60, // minutos de antelación para reservar hoy
    DIAS_VISTA: 60, // reservas con hasta 60 días de antelación
    ALERGENOS: ALERGENOS,
    CATEGORIAS: CATEGORIAS,
    CARTA: CARTA,
    HORARIO: HORARIO,
    TURNOS: TURNOS,
    MENU_DIA: MENU_DIA
  };
})();
