// Fondo exterior del formato vertical: pared de rayas + suelo de rombos (escenario).
import React from "react";
import { AbsoluteFill } from "remotion";

export type ColorFondo = "menta" | "lavanda" | "celeste" | "mantequilla";

export const COLORES_FONDO: Record<ColorFondo, { raya1: string; raya2: string; rombo: string; suelo: string; zocalo: string }> = {
  menta: { raya1: "#BFE8D9", raya2: "#D9F4EA", rombo: "#C6EBDD", suelo: "#FFFFFF", zocalo: "#8FCFB8" },
  lavanda: { raya1: "#D6CAF3", raya2: "#E8E0FA", rombo: "#DCD1F6", suelo: "#FFFFFF", zocalo: "#B3A1E6" },
  celeste: { raya1: "#C3E2F6", raya2: "#DDF0FB", rombo: "#CBE6F8", suelo: "#FFFFFF", zocalo: "#93C6E8" },
  mantequilla: { raya1: "#F8E3A6", raya2: "#FCF0CC", rombo: "#F9E8B5", suelo: "#FFFFFF", zocalo: "#E8C66E" },
};

/** Altura (y) donde empieza el suelo. */
export const HORIZONTE = 1470;

export const Fondo: React.FC<{ color?: ColorFondo }> = ({ color = "menta" }) => {
  const c = COLORES_FONDO[color];
  const raya = 84;
  const rw = 150; // ancho del rombo
  const rh = 84; // alto del rombo (aplanado, en perspectiva)
  return (
    <AbsoluteFill style={{ backgroundColor: c.raya2 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">
        <defs>
          <pattern id="rayas" width={raya * 2} height={10} patternUnits="userSpaceOnUse">
            <rect width={raya} height={10} fill={c.raya1} />
            <rect x={raya} width={raya} height={10} fill={c.raya2} />
          </pattern>
          <pattern id="rombos" width={rw} height={rh} patternUnits="userSpaceOnUse" x={-rw / 4} y={HORIZONTE}>
            <rect width={rw} height={rh} fill={c.suelo} />
            <polygon points={`${rw / 2},0 ${rw},${rh / 2} ${rw / 2},${rh} 0,${rh / 2}`} fill={c.rombo} />
          </pattern>
        </defs>
        <rect width={1080} height={HORIZONTE} fill="url(#rayas)" />
        <rect y={HORIZONTE} width={1080} height={1920 - HORIZONTE} fill="url(#rombos)" />
        <rect y={HORIZONTE - 6} width={1080} height={12} fill={c.zocalo} />
        <rect y={HORIZONTE - 12} width={1080} height={6} fill="#FFFFFF" opacity={0.7} />
      </svg>
    </AbsoluteFill>
  );
};
