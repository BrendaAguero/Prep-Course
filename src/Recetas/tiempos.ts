import type { Duraciones, Receta } from "./tipos";

export const FPS = 30;
export const TRANSICION = 15;
const f = (seg: number) => Math.ceil(seg * FPS);

export const calcularTiempos = (receta: Receta, d: Duraciones) => {
  const portada = { voz: 20, total: 20 + f(d.intro) + 40 };

  const inicioLista = 15 + f(d.ingredientes) + 8;
  let t = inicioLista;
  const ingredientes = receta.ingredientes.map((_, i) => {
    const desde = t;
    t += f(d[`ingrediente-${i + 1}`]) + 10;
    return desde;
  });
  const lista = { titulo: 15, ingredientes, total: t + 45 };

  const pasos = receta.pasos.map((_, i) => ({ voz: 20, total: Math.max(100, 20 + f(d[`paso-${i + 1}`]) + 40) }));
  const cierre = { voz: 25, total: 25 + f(d.cierre) + 75 };

  const escenas = [portada.total, lista.total, ...pasos.map((p) => p.total), cierre.total];
  const total = escenas.reduce((a, b) => a + b, 0) - TRANSICION * (escenas.length - 1);
  return { portada, lista, pasos, cierre, total };
};
