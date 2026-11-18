import type React from "react";
import { loadFont as pixelify } from "@remotion/google-fonts/PixelifySans";
import { loadFont as fredoka } from "@remotion/google-fonts/Fredoka";

// Paleta pastel de juego "para niña" de los 2000: rosa, celeste, crema y contorno marrón rosado.
export const C = {
  rosa: "#F7A8C4",
  rosaClaro: "#FDE4EE",
  rosaFuerte: "#E8678A",
  celeste: "#A8D8F0",
  azul: "#6FB7E9",
  lila: "#CDB7F2",
  crema: "#FFF8F0",
  amarillo: "#FFE27A",
  menta: "#BDEBC8",
  contorno: "#8A5A6E",
  texto: "#6B3F55",
  pixel: pixelify("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
  redonda: fredoka("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
};

/** Texto con contorno grueso, como los títulos de esos juegos. */
export const contorno = (color: string, grosor: number): React.CSSProperties => ({
  color,
  WebkitTextStroke: `${grosor}px ${C.contorno}`,
  paintOrder: "stroke fill",
});
