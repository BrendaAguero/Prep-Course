import type { Duraciones, Receta } from "../Recetas/tipos";

export const FPS = 30;
export const TRANSICION = 12;
const f = (seg: number) => Math.ceil(seg * FPS);

/** Duración del popup "¡Perfecto!" al terminar cada paso. */
export const PERFECTO = 55;
export const PUNTOS_POR_PASO = 250;

export const tiemposJuego = (receta: Receta, d: Duraciones) => {
  const titulo = { voz: 20, click: 20 + f(d.intro) + 18, total: 20 + f(d.intro) + 45 };

  let t = 15 + f(d.ingredientes) + 8;
  const items = receta.ingredientes.map((_, i) => {
    const desde = t;
    t += f(d[`ingrediente-${i + 1}`]) + 10;
    return desde;
  });
  const inventario = { voz: 15, items, total: t + 40 };

  const pasos = receta.pasos.map((_, i) => {
    const voz = 15;
    const accion = Math.max(f(d[`paso-${i + 1}`]) + 25, 130);
    return { voz, accion, perfecto: voz + accion, total: voz + accion + PERFECTO };
  });

  const resultados = { voz: 70, total: 70 + f(d.cierre) + 80 };

  const escenas = [titulo.total, inventario.total, ...pasos.map((p) => p.total), resultados.total];
  const total = escenas.reduce((a, b) => a + b, 0) - TRANSICION * (escenas.length - 1);
  return { titulo, inventario, pasos, resultados, total };
};
