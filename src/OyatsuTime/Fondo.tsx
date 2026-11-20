// Fondo exterior del formato vertical: pared de rayas celestes + zócalo + suelo de madera.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ZONAS } from "./tema";

const C = {
  raya1: "#C3E2F6",
  raya2: "#DDF0FB",
  zocalo: "#FFFFFF",
  zocaloSombra: "#93C6E8",
  madera: ["#EBC99B", "#E3BD8C", "#EFD2A8"],
  junta: "#C49A6C",
  veta: "#D9AE7D",
};

export const Fondo: React.FC = () => {
  const raya = 84;
  const y0 = ZONAS.suelo;
  const tabla = 46; // alto de cada tabla
  const filas = Math.ceil((1920 - y0) / tabla);
  return (
    <AbsoluteFill style={{ backgroundColor: C.raya2 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">
        <defs>
          <pattern id="rayas" width={raya * 2} height={10} patternUnits="userSpaceOnUse">
            <rect width={raya} height={10} fill={C.raya1} />
            <rect x={raya} width={raya} height={10} fill={C.raya2} />
          </pattern>
        </defs>
        <rect width={1080} height={y0} fill="url(#rayas)" />
        {/* suelo de tablas de madera, juntas escalonadas */}
        {Array.from({ length: filas }, (_, f) => {
          const y = y0 + f * tabla;
          const largo = 300;
          const desfase = (f * 130) % largo;
          return (
            <g key={f}>
              <rect y={y} width={1080} height={tabla} fill={C.madera[f % 3]} />
              <rect y={y + tabla - 4} width={1080} height={4} fill={C.junta} />
              <rect x={(f * 97) % 700} y={y + 16} width={120} height={3} fill={C.veta} />
              <rect x={((f * 211) % 600) + 380} y={y + 28} width={90} height={3} fill={C.veta} />
              {Array.from({ length: 6 }, (_, k) => (
                <rect key={k} x={k * largo - desfase} y={y} width={4} height={tabla} fill={C.junta} />
              ))}
            </g>
          );
        })}
        {/* zócalo */}
        <rect y={y0 - 26} width={1080} height={26} fill={C.zocalo} />
        <rect y={y0 - 6} width={1080} height={6} fill={C.zocaloSombra} />
        <rect y={y0 - 26} width={1080} height={4} fill={C.zocaloSombra} opacity={0.6} />
      </svg>
    </AbsoluteFill>
  );
};
