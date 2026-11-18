import duraciones from "./audio.json";

// Todas las animaciones se sincronizan con la duración real de cada clip de voz.
export const FPS = 30;
const f = (seg: number) => Math.ceil(seg * FPS);
export const dur = (clip: keyof typeof duraciones) => f(duraciones[clip]);

export const TRANSICION = 20;
export const PASO_CUENTA = 30; // un número por segundo al contar

export const tiemposEscena = (n: number) => {
  const titulo = 12;
  const primerGlobo = titulo + dur(`titulo-${n}` as keyof typeof duraciones) + 14;
  const frase =
    primerGlobo + (n - 1) * PASO_CUENTA + dur(`cuenta-${n}` as keyof typeof duraciones) + 14;
  const total = frase + dur(`frase-${n}` as keyof typeof duraciones) + 35;
  return { titulo, primerGlobo, frase, total };
};

export const INTRO_VOZ = 15;
export const INTRO = INTRO_VOZ + dur("intro") + 35;

export const FINAL_CUENTA = 12 + dur("final-a") + 10;
export const FINAL_PASO = 24;
export const FINAL_B = FINAL_CUENTA + 9 * FINAL_PASO + dur("cuenta-10") + 15;
export const FINAL = FINAL_B + dur("final-b") + 45;

export const DURACION_TOTAL =
  INTRO +
  Array.from({ length: 10 }, (_, i) => tiemposEscena(i + 1).total).reduce((a, b) => a + b, 0) +
  FINAL -
  TRANSICION * 11;
