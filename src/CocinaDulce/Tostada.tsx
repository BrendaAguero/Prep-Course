import React from "react";
import { C } from "./tema";

/** Tostada vista desde arriba, con capas que se van añadiendo. Caja lógica 260×240. */
export const Tostada: React.FC<{
  untado: number; // 0–1, avance de la mantequilla (de izquierda a derecha)
  fresas: number; // cuántas rodajas de fresa (0–3)
  miel: number; // 0–1, avance del chorrito
  id: string;
}> = ({ untado, fresas, miel, id }) => {
  const forma =
    "M20 90 C 0 30, 60 0, 90 22 C 110 -4, 150 -4, 170 22 C 200 0, 260 30, 240 90 L 236 226 Q 236 240 222 240 L 38 240 Q 24 240 24 226 Z";
  const rodajas: [number, number, number][] = [
    [80, 95, -15],
    [170, 120, 20],
    [115, 185, 5],
  ];
  return (
    <svg viewBox="-10 -10 280 260" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`untado-${id}`}>
          <rect x={-10} y={-10} width={280 * untado} height={260} />
        </clipPath>
      </defs>
      <path d={forma} fill="#D99A52" stroke={C.contorno} strokeWidth={7} />
      <path d={forma} fill="#F6D9A0" transform="translate(130 130) scale(0.84) translate(-130 -122)" />
      {/* poros del pan */}
      {[
        [80, 80],
        [150, 70],
        [190, 150],
        [70, 170],
        [130, 200],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#E8BF7A" />
      ))}
      {untado > 0 && (
        <g clipPath={`url(#untado-${id})`}>
          <path
            d="M40 85 C 60 50, 110 40, 130 55 C 160 40, 210 50, 222 90 C 230 130, 220 180, 210 205 C 160 222, 100 222, 50 205 C 38 160, 32 120, 40 85 Z"
            fill="#FFE58A"
            stroke="#F2C94C"
            strokeWidth={4}
          />
          <path d="M70 90 C 110 80, 150 85, 190 95" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
        </g>
      )}
      {rodajas.slice(0, fresas).map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 -30 C 30 -30, 34 0, 0 30 C -34 0, -30 -30, 0 -30 Z" fill="#F2556F" stroke={C.contorno} strokeWidth={5} />
          <path d="M0 -20 C 16 -20, 18 0, 0 18 C -18 0, -16 -20, 0 -20 Z" fill="#FF9AAE" />
          {[
            [-8, -10],
            [8, -10],
            [0, 0],
            [-6, 8],
            [6, 8],
          ].map(([sx, sy], k) => (
            <ellipse key={k} cx={sx} cy={sy} rx={1.8} ry={3} fill="#FFF3C4" />
          ))}
        </g>
      ))}
      {miel > 0 && (
        <path
          d="M40 70 q 25 35 50 0 t 50 0 t 50 0 t 40 10 M 210 140 q -25 35 -50 0 t -50 0 t -50 0 t -30 10"
          stroke="#F2A93B"
          strokeWidth={13}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - miel}
        />
      )}
    </svg>
  );
};

/** Plato visto desde arriba, con lunares. */
export const PlatoArriba: React.FC<{ r: number }> = ({ r }) => (
  <svg viewBox="-110 -110 220 220" width={r * 2} height={r * 2}>
    <circle r={104} fill="#FFFFFF" stroke={C.contorno} strokeWidth={5} />
    <circle r={92} fill="none" stroke={C.rosa} strokeWidth={8} />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 92} r={3.5} fill="#FFFFFF" />;
    })}
    <circle r={70} fill="none" stroke="#F3E6EC" strokeWidth={4} />
  </svg>
);
