// Coreografía de "Pancakes japoneses" (frames a 30 fps, coordenadas de la ventana 1200×900).
export const FPS = 30;
export const DURACION = 1450;

/** Centro de cada hueco de la despensa (5 ingredientes). */
export const SLOT_X = 1025;
export const SLOT_Y = [236, 354, 472, 590, 708];
export const INGREDIENTES: [string, string][] = [
  ["huevo", "Huevo"],
  ["leche", "Leche"],
  ["harina", "Harina"],
  ["fresa", "Fresa"],
  ["miel", "Miel"],
];

/** Centro de la zona de trabajo (bol, sartén o plato). */
export const MESA = { x: 470, y: 720 };

export const T = {
  clickJugar: 80,
  cortina: 110,
  pasos: [
    { banner: 125, texto: "¡Casca los huevos!", fin: 268, feedback: "¡Bien!" },
    { banner: 295, texto: "¡Añade leche y harina!", fin: 490, feedback: "¡Qué rico!" },
    { banner: 515, texto: "¡Bate hasta que esté esponjoso!", fin: 615, feedback: "¡Esponjoso!" },
    { banner: 645, texto: "¡Cocina a fuego lento!", fin: 855, feedback: "¡Mira cómo tiemblan!" },
    { banner: 880, texto: "¡Decora y sirve!", fin: 1100, feedback: "¡Perfecto!" },
  ],
  cascar: [200, 260],
  leche: [358, 392] as const,
  harina: [452, 482] as const,
  batir: [530, 610] as const,
  bolSale: 645,
  sartenEntra: 655,
  masa: [685, 697, 709],
  subir: [715, 775] as const,
  voltear: 785,
  boings: [806, 832],
  sartenSale: 880,
  platoEntra: 890,
  pila: [905, 915, 925],
  fresas: [978, 995],
  miel: [1044, 1085] as const,
  mantequilla: 1092,
  cortina2: 1140,
  jingle: 1152,
  clickSiguiente: 1275,
  libro: 1290,
  ecuacion: [1315, 1327, 1339, 1351, 1363, 1380],
  nombre: 1388,
  clickGuardar: 1415,
};

const S = (i: number): [number, number] => [SLOT_X, SLOT_Y[i]];

// Fotogramas clave del cursor: [frame, x, y]
export const CURSOR: [number, number, number][] = [
  [0, 1000, 980],
  [30, 950, 820],
  [70, 800, 488],
  [100, 800, 488],
  [135, 780, 500],
  [160, ...S(0)],
  [167, ...S(0)],
  [195, 470, 600],
  [202, 470, 600],
  [225, ...S(0)],
  [232, ...S(0)],
  [255, 470, 600],
  [300, 470, 600],
  [325, ...S(1)],
  [332, ...S(1)],
  [355, 570, 560],
  [365, 560, 565],
  [375, 575, 560],
  [392, 565, 562],
  [420, ...S(2)],
  [427, ...S(2)],
  [450, 500, 560],
  ...Array.from({ length: 8 }, (_, i): [number, number, number] => [452 + i * 4, 500 + (i % 2 ? 10 : -10), 560 + (i % 2 ? 18 : -6)]),
  [485, 500, 560],
  [525, 470, 640],
  ...Array.from({ length: 21 }, (_, i): [number, number, number] => {
    const a = (i / 20) * Math.PI * 2 * 5;
    return [530 + i * 4, 470 + Math.cos(a) * 110, 650 + Math.sin(a) * 30];
  }),
  [640, 600, 560],
  [680, 340, 690],
  [687, 340, 690],
  [694, 470, 680],
  [699, 470, 680],
  [706, 600, 690],
  [740, 640, 560],
  [778, 470, 650],
  [790, 470, 650],
  [850, 680, 560],
  [935, 900, 600],
  [955, ...S(3)],
  [960, ...S(3)],
  [975, 430, 545],
  [981, 430, 545],
  [992, 515, 555],
  [1000, 600, 560],
  [1020, ...S(4)],
  [1025, ...S(4)],
  [1042, 370, 470],
  [1060, 450, 480],
  [1075, 530, 470],
  [1088, 570, 480],
  [1120, 760, 760],
  [1240, 760, 760],
  [1265, 600, 790],
  [1290, 600, 790],
  [1400, 940, 800],
  [1450, 940, 800],
];

export const CLICKS = [
  T.clickJugar,
  165,
  ...T.cascar,
  230,
  330,
  425,
  ...T.masa,
  T.voltear,
  958,
  ...T.fresas,
  1023,
  T.clickSiguiente,
  T.clickGuardar,
];

/** Lo que lleva el cursor: [desde, hasta, sprite] */
export const CARGA: [number, number, string][] = [
  [165, 200, "huevo"],
  [230, 260, "huevo"],
  [330, 395, "leche"],
  [425, 485, "harina"],
  [958, 995, "fresa"],
  [1023, 1088, "miel"],
];
