// Línea de tiempo del juego (frames a 30 fps). Coordenadas en la ventana lógica de 1200×900.
export const FPS = 30;
export const DURACION = 1020;

export const T = {
  clickJugar: 80,
  cortina: 110, // cierre del corazón (título → juego)
  pasos: [
    { banner: 125, texto: "¡Lleva el pan al plato!", fin: 210, feedback: "¡Bien!" },
    { banner: 250, texto: "¡Unta la mantequilla!", fin: 382, feedback: "¡Qué rico!" },
    { banner: 410, texto: "¡Pon las fresas!", fin: 504, feedback: "¡Perfecto!" },
    { banner: 540, texto: "¡Un chorrito de miel!", fin: 660, feedback: "¡Listo!" },
  ],
  untar: [312, 380] as const,
  fresas: [468, 486, 504],
  miel: [602, 655] as const,
  cortina2: 730, // cierre del corazón (juego → receta nueva)
  jingle: 742,
  clickSiguiente: 845,
  libro: 860,
  ecuacion: [885, 897, 909, 921, 940],
  clickGuardar: 975,
};

// Fotogramas clave del cursor: [frame, x, y]
export const CURSOR: [number, number, number][] = [
  [0, 1000, 980],
  [30, 900, 820],
  [72, 600, 640],
  [95, 600, 640],
  [130, 600, 600],
  [160, 1010, 280],
  [170, 1010, 280],
  [205, 480, 520],
  [255, 480, 540],
  [280, 1010, 410],
  [290, 1010, 410],
  [310, 400, 450],
  ...Array.from({ length: 7 }, (_, i): [number, number, number] => [312 + i * 10 + 5, i % 2 === 0 ? 590 : 380, 460 + i * 22]),
  [382, 480, 610],
  [415, 480, 600],
  [440, 1010, 540],
  [448, 1010, 540],
  [465, 410, 470],
  [470, 410, 470],
  [483, 545, 500],
  [488, 545, 500],
  [501, 465, 600],
  [520, 470, 620],
  [545, 480, 600],
  [570, 1010, 670],
  [580, 1010, 670],
  [600, 360, 360],
  [615, 450, 380],
  [630, 540, 365],
  [645, 620, 385],
  [655, 600, 380],
  [690, 760, 700],
  [800, 760, 700],
  [835, 600, 790],
  [860, 600, 790],
  [960, 940, 800],
  [1020, 940, 800],
];

export const CLICKS = [T.clickJugar, 168, 285, 448, ...T.fresas, 578, T.clickSiguiente, T.clickGuardar];

/** Intervalos en que el cursor lleva algo: [desde, hasta, sprite] */
export const CARGA: [number, number, string][] = [
  [168, 210, "pan"],
  [285, 382, "mantequilla"],
  [448, 504, "fresa"],
  [578, 660, "miel"],
];
