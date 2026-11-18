import type React from "react";
import { loadFont as lilita } from "@remotion/google-fonts/LilitaOne";
import { loadFont as nunito } from "@remotion/google-fonts/Nunito";

// Estética de juego de cocina "cozy" para público adulto: tonos cálidos y apagados,
// interfaz con bordes gruesos y sombras sólidas.
export const TEMA = {
  pared: "#2F5D66",
  paredLinea: "#3A6B74",
  madera: "#C98A55",
  maderaOscura: "#A56B3C",
  panel: "#FFF7EA",
  borde: "#2B2A33",
  texto: "#2B2A33",
  textoSuave: "#7A6E64",
  naranja: "#FF8A3D",
  verde: "#4CC38A",
  oro: "#FFC83D",
  rojo: "#F2545B",
  fuenteJuego: lilita("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  fuenteTexto: nunito("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily,
};

export const panel = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  backgroundColor: TEMA.panel,
  border: `6px solid ${TEMA.borde}`,
  borderRadius: 32,
  boxShadow: `0 10px 0 ${TEMA.borde}`,
  ...extra,
});
