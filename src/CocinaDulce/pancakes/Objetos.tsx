import React from "react";
import { useCurrentFrame } from "remotion";
import type { Paleta } from "../disenos/paletas";

const W = 1200;
const H = 900;

export const Lienzo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

/** Pancake japonés: cilindro alto (vista 3/4). `yBase` es la base; `h` la altura. */
export const Pancake: React.FC<{
  p: Paleta;
  x: number;
  yBase: number;
  rx: number;
  ry: number;
  h: number;
  arriba: string;
  lado: string;
}> = ({ p, x, yBase, rx, ry, h, arriba, lado }) => {
  const yTop = yBase - h;
  return (
    <g>
      <path
        d={`M${x - rx} ${yTop} L ${x - rx} ${yBase} A ${rx} ${ry} 0 0 0 ${x + rx} ${yBase} L ${x + rx} ${yTop} Z`}
        fill={lado}
        stroke={p.contorno}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* franja dorada inferior */}
      <path d={`M${x - rx} ${yBase - 10} A ${rx} ${ry} 0 0 0 ${x + rx} ${yBase - 10}`} stroke="#E3A55A" strokeWidth={10} fill="none" opacity={0.7} />
      <ellipse cx={x} cy={yTop} rx={rx} ry={ry} fill={arriba} stroke={p.contorno} strokeWidth={5} />
      <ellipse cx={x - rx * 0.35} cy={yTop - ry * 0.2} rx={rx * 0.25} ry={ry * 0.25} fill="#FFFFFF" opacity={0.35} />
    </g>
  );
};

/** Bol en vista 3/4. `contenido` se dibuja dentro (recortado a la boca), `encima` sobresale. */
export const Bol: React.FC<{
  p: Paleta;
  x: number;
  y: number;
  contenido?: React.ReactNode;
  encima?: React.ReactNode;
}> = ({ p, x, y, contenido, encima }) => {
  const rx = 200;
  const ry = 54;
  const top = y - 70;
  return (
    <Lienzo>
      <defs>
        <clipPath id="boca-bol">
          <ellipse cx={x} cy={top} rx={rx - 8} ry={ry - 6} />
        </clipPath>
      </defs>
      <ellipse cx={x + 8} cy={y + 96} rx={rx * 0.8} ry={30} fill="#00000018" />
      <ellipse cx={x} cy={top} rx={rx} ry={ry} fill="#EADFE4" stroke={p.contorno} strokeWidth={6} />
      <g clipPath="url(#boca-bol)">{contenido}</g>
      {encima}
      <path
        d={`M${x - rx} ${top} A ${rx} ${ry} 0 0 0 ${x + rx} ${top} Q ${x + rx - 12} ${y + 90} ${x} ${y + 92} Q ${x - rx + 12} ${y + 90} ${x - rx} ${top} Z`}
        fill="#FFFFFF"
        stroke={p.contorno}
        strokeWidth={6}
      />
      <path d={`M${x - rx + 22} ${top + 40} Q ${x} ${top + 92} ${x + rx - 22} ${top + 40}`} stroke={p.ui} strokeWidth={16} fill="none" strokeLinecap="round" />
      {[-110, -40, 40, 110].map((dx) => (
        <circle key={dx} cx={x + dx} cy={top + 64 + Math.abs(dx) * -0.14} r={6} fill="#FFFFFF" />
      ))}
      <path d={`M${x - rx + 40} ${top + 20} Q ${x - rx + 50} ${top + 90} ${x - 80} ${top + 140}`} stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.8} strokeLinecap="round" />
    </Lienzo>
  );
};

/** Hornillo + sartén en vista 3/4. `dentro` se dibuja sobre la superficie. */
export const Sarten: React.FC<{ p: Paleta; x: number; y: number; dentro?: React.ReactNode; calor: number }> = ({
  p,
  x,
  y,
  dentro,
  calor,
}) => {
  const frame = useCurrentFrame();
  const rx = 290;
  const ry = 78;
  return (
    <Lienzo>
      {/* hornillo */}
      <rect x={x - 300} y={y + 20} width={600} height={120} rx={26} fill={p.panel} stroke={p.contorno} strokeWidth={6} />
      {[-240, 240].map((dx) => (
        <circle key={dx} cx={x + dx} cy={y + 84} r={18} fill={p.ui} stroke={p.contorno} strokeWidth={5} />
      ))}
      <ellipse cx={x} cy={y + 40} rx={230} ry={40} fill={p.ui} opacity={0.25 + 0.2 * calor * (0.8 + 0.2 * Math.sin(frame / 3))} />
      {/* sartén */}
      <rect x={x + rx - 20} y={y - 30} width={240} height={40} rx={20} fill={p.texto} stroke={p.contorno} strokeWidth={5} transform={`rotate(-8 ${x + rx} ${y - 10})`} />
      <path d={`M${x - rx} ${y - 10} L ${x - rx + 14} ${y + 30} Q ${x} ${y + 92} ${x + rx - 14} ${y + 30} L ${x + rx} ${y - 10} Z`} fill="#6E5A66" stroke={p.contorno} strokeWidth={6} />
      <ellipse cx={x} cy={y - 10} rx={rx} ry={ry} fill="#8A7682" stroke={p.contorno} strokeWidth={6} />
      <ellipse cx={x} cy={y - 6} rx={rx - 26} ry={ry - 18} fill="#9C8894" />
      {dentro}
    </Lienzo>
  );
};

/** Plato de presentación en vista 3/4. */
export const Plato: React.FC<{ p: Paleta; x: number; y: number }> = ({ p, x, y }) => (
  <Lienzo>
    <ellipse cx={x + 8} cy={y + 30} rx={270} ry={62} fill="#00000018" />
    <ellipse cx={x} cy={y + 12} rx={262} ry={70} fill="#F1E6EB" stroke={p.contorno} strokeWidth={6} />
    <ellipse cx={x} cy={y} rx={262} ry={70} fill="#FFFFFF" stroke={p.contorno} strokeWidth={6} />
    <ellipse cx={x} cy={y} rx={238} ry={58} fill="none" stroke={p.ui} strokeWidth={8} />
    {Array.from({ length: 18 }).map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      return <circle key={i} cx={x + Math.cos(a) * 238} cy={y + Math.sin(a) * 58} r={3} fill="#FFFFFF" />;
    })}
    <ellipse cx={x} cy={y} rx={170} ry={40} fill="none" stroke="#F3E8EE" strokeWidth={4} />
  </Lienzo>
);

/** Batidor de varillas (para llevar en la mano). */
export const Batidor: React.FC<{ p: Paleta; x: number; y: number; rot: number }> = ({ p, x, y, rot }) => (
  <svg width={120} height={200} viewBox="-60 -10 120 200" style={{ position: "absolute", left: x - 60, top: y - 170, transform: `rotate(${rot}deg)`, transformOrigin: "50% 90%" }}>
    {[-26, -12, 0, 12, 26].map((dx) => (
      <path key={dx} d={`M0 120 C ${dx * 1.6} 90, ${dx * 1.8} 20, 0 0`} stroke="#C9C1C8" strokeWidth={6} fill="none" />
    ))}
    {[-26, -12, 0, 12, 26].map((dx) => (
      <path key={`o${dx}`} d={`M0 120 C ${dx * 1.6} 90, ${dx * 1.8} 20, 0 0`} stroke={p.contorno} strokeWidth={2} fill="none" opacity={0.5} />
    ))}
    <rect x={-14} y={116} width={28} height={70} rx={14} fill={p.ui} stroke={p.contorno} strokeWidth={5} />
    <rect x={-8} y={126} width={6} height={40} rx={3} fill="#FFFFFF88" />
  </svg>
);

/** Fresa partida por la mitad (vista 3/4) para decorar. */
export const MediaFresa: React.FC<{ p: Paleta; x: number; y: number; rot?: number; s?: number }> = ({ p, x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -34 C 32 -34, 38 4, 0 36 C -38 4, -32 -34, 0 -34 Z" fill="#F2556F" stroke={p.contorno} strokeWidth={5} />
    <path d="M0 -24 C 18 -24, 22 2, 0 22 C -22 2, -18 -24, 0 -24 Z" fill="#FFA3B5" />
    <path d="M-14 -34 L -4 -46 L 0 -36 L 6 -46 L 14 -34 Z" fill="#7CC36E" stroke={p.contorno} strokeWidth={4} strokeLinejoin="round" />
    {[
      [-8, -10],
      [8, -10],
      [0, 2],
      [-6, 12],
      [6, 12],
    ].map(([sx, sy], k) => (
      <ellipse key={k} cx={sx} cy={sy} rx={2} ry={3.4} fill="#FFF3C4" />
    ))}
  </g>
);
