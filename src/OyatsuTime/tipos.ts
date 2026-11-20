import type React from "react";
import type { Aparicion } from "./Nube";
import type { GuionHecho } from "./guion";

export type Ingrediente = { s: string; cant: string; nombre: string };
export type PasoReceta = { titulo: string; truco: string; items: [string, string][] };

/** Todo lo que una receta aporta a la base común. */
export type Receta = {
  numero: number;
  nombre: string;
  sprite: string; // sprite del chip de la cabecera
  porciones: string; // "Para 3 pancakes"
  tiempo: string; // "45 min"
  ingredientes: Ingrediente[];
  utensilios: string[];
  pasos: PasoReceta[];
  /** Frase del panel en el gancho/menú. */
  intro: string;
  g: GuionHecho;
  apariciones: Aparicion[];
  /** Barras de progreso dentro de la cocina (p. ej. "Esponjoso"). */
  barras?: { etiqueta: string; desde: number; hasta: number; x: number; y: number }[];
  /** Dibujo del plato terminado en coordenadas de la ventana (1200×900) y su centro. */
  plato: { dibujo: React.ReactNode; cx: number; cy: number };
};

export const pasoInicio = (r: Receta) => r.pasos.map((_, i) => r.g.ev[`paso${i}`]);

/** Paso en curso (−1 fuera de la cocina). */
export const pasoActual = (r: Receta, frame: number) => {
  let p = -1;
  pasoInicio(r).forEach((f, i) => {
    if (frame >= f) p = i;
  });
  return frame >= r.g.ev.completada ? -1 : p;
};

/** Puntos acumulados (+100 por paso terminado). */
export const puntos = (r: Receta, frame: number) => r.pasos.filter((_, i) => frame >= (r.g.ev[`puntos${i}`] ?? Infinity)).length * 100;
