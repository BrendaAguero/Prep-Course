import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, contorno } from "./tema";

/** Fondo de cuadros vichy. */
export const Vichy: React.FC<{ color?: string; fondo?: string; tam?: number; style?: React.CSSProperties }> = ({
  color = "#F7A8C455",
  fondo = C.rosaClaro,
  tam = 60,
  style,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: fondo,
      backgroundImage: `linear-gradient(90deg, ${color} 50%, transparent 50%), linear-gradient(${color} 50%, transparent 50%)`,
      backgroundSize: `${tam}px ${tam}px`,
      ...style,
    }}
  />
);

/** Sprite de pixel art ampliado sin suavizar. */
export const Sprite: React.FC<{ n: string; tam: number; style?: React.CSSProperties }> = ({ n, tam, style }) => (
  <Img src={staticFile(`sprites/${n}.png`)} style={{ width: tam, height: tam, imageRendering: "pixelated", ...style }} />
);

/** Panel con borde de encaje (festón de círculos) alrededor. */
export const Encaje: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fondo?: React.ReactNode;
  children?: React.ReactNode;
  radio?: number;
}> = ({ x, y, w, h, color = C.azul, fondo, children, radio = 28 }) => {
  const paso = 30;
  const puntos: [number, number][] = [];
  for (let i = radio; i <= w - radio; i += paso) puntos.push([i, 0], [i, h]);
  for (let j = radio; j <= h - radio; j += paso) puntos.push([0, j], [w, j]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w + 40} height={h + 40} style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}>
        {puntos.map(([px, py], i) => (
          <circle key={i} cx={px + 20} cy={py + 20} r={17} fill="#FFFFFF" stroke={color} strokeWidth={4} />
        ))}
        <rect x={20 - 6} y={20 - 6} width={w + 12} height={h + 12} rx={radio + 6} fill={color} />
        {puntos.map(([px, py], i) => (
          <circle key={`d${i}`} cx={px + 20} cy={py + 20} r={4} fill="#FFFFFF" />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radio,
          overflow: "hidden",
          border: `4px solid #FFFFFF`,
          backgroundColor: C.crema,
        }}
      >
        {fondo}
        {children}
      </div>
    </div>
  );
};

/** Lazo rosa. */
export const Lazo: React.FC<{ x: number; y: number; tam: number; rot?: number; color?: string }> = ({
  x,
  y,
  tam,
  rot = 0,
  color = C.rosa,
}) => {
  const frame = useCurrentFrame();
  const b = Math.sin(frame / 12) * 3;
  return (
    <svg
      viewBox="-100 -80 200 180"
      width={tam}
      height={tam * 0.9}
      style={{ position: "absolute", left: x - tam / 2, top: y - tam * 0.45, transform: `rotate(${rot + b}deg)`, overflow: "visible" }}
    >
      <path d="M-14 10 L-50 90 L-28 80 L-18 98 L0 20 Z" fill={color} stroke={C.contorno} strokeWidth={5} />
      <path d="M14 10 L50 90 L28 80 L18 98 L0 20 Z" fill={color} stroke={C.contorno} strokeWidth={5} />
      <path d="M-10 0 C -60 -70 -100 -40 -90 0 C -100 40 -60 70 -10 0 Z" fill={color} stroke={C.contorno} strokeWidth={5} />
      <path d="M10 0 C 60 -70 100 -40 90 0 C 100 40 60 70 10 0 Z" fill={color} stroke={C.contorno} strokeWidth={5} />
      <path d="M-70 -20 C -55 -35 -40 -25 -35 -15" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
      <rect x={-20} y={-22} width={40} height={44} rx={14} fill={C.rosaFuerte} stroke={C.contorno} strokeWidth={5} />
    </svg>
  );
};

/** Destello de 4 puntas que parpadea. */
export const Destello: React.FC<{ x: number; y: number; tam: number; fase?: number; color?: string }> = ({
  x,
  y,
  tam,
  fase = 0,
  color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const s = 0.4 + 0.6 * Math.abs(Math.sin(frame / 10 + fase));
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={tam}
      height={tam}
      style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, transform: `scale(${s}) rotate(${frame + fase * 30}deg)` }}
    >
      <path d="M0 -50 Q 8 -8 50 0 Q 8 8 0 50 Q -8 8 -50 0 Q -8 -8 0 -50 Z" fill={color} />
    </svg>
  );
};

/** Botón de juego estilo píxel. */
export const Boton: React.FC<{
  x: number;
  y: number;
  w: number;
  texto: string;
  color?: string;
  presionado?: boolean;
  tam?: number;
}> = ({ x, y, w, texto, color = C.rosaFuerte, presionado = false, tam = 52 }) => {
  const frame = useCurrentFrame();
  const pulso = presionado ? 1 : 1 + 0.03 * Math.sin(frame / 5);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - 50 + (presionado ? 8 : 0),
        width: w,
        height: 100,
        borderRadius: 22,
        backgroundColor: color,
        border: `5px solid ${C.contorno}`,
        boxShadow: presionado ? `0 2px 0 ${C.contorno}` : `0 10px 0 ${C.contorno}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: C.pixel,
        fontWeight: 700,
        fontSize: tam,
        transform: `scale(${pulso})`,
        ...contorno("#FFFFFF", 8),
      }}
    >
      {texto}
      <div style={{ position: "absolute", top: 10, left: 18, width: 30, height: 12, borderRadius: 6, backgroundColor: "#FFFFFF88" }} />
    </div>
  );
};

// Mascota original "Mochi": un bollito con gorro de chef en pixel art (16×16).
const MOCHI = [
  "....oooooooo....",
  "...owwwwwwwwo...",
  "..owwwwwwwwwwo..",
  "..owwwwwwwwwwo..",
  "...owwwwwwwwo...",
  "...oooooooooo...",
  "..oppppppppppo..",
  ".oppppppppppppo.",
  ".oppeppppppeppo.",
  ".oppeppppppeppo.",
  ".opbbppmmppbbpo.",
  ".oppppppppppppo.",
  "..oppppppppppo..",
  "...oooooooooo...",
];
const COLORES: Record<string, string> = { o: C.contorno, w: "#FFFFFF", p: "#FFD9C2", e: "#5A3344", b: "#FF9DB8", m: "#E8678A" };

export const Mochi: React.FC<{ x: number; y: number; px: number; brazosArriba?: boolean; salto?: number }> = ({
  x,
  y,
  px,
  brazosArriba = false,
  salto = 0,
}) => {
  const brazos = brazosArriba
    ? [
        [0, 5],
        [0, 6],
        [15, 5],
        [15, 6],
      ]
    : [
        [0, 10],
        [0, 11],
        [15, 10],
        [15, 11],
      ];
  return (
    <svg
      width={16 * px}
      height={14 * px}
      viewBox="0 0 16 14"
      shapeRendering="crispEdges"
      style={{ position: "absolute", left: x - 8 * px, top: y - 14 * px - salto, overflow: "visible" }}
    >
      {MOCHI.flatMap((fila, j) =>
        fila.split("").map((c, i) => (c === "." ? null : <rect key={`${i}-${j}`} x={i} y={j} width={1} height={1} fill={COLORES[c]} />)),
      )}
      {brazos.map(([i, j]) => (
        <rect key={`b${i}-${j}`} x={i === 0 ? -1 : 16} y={j} width={1} height={1} fill={COLORES.p} stroke={C.contorno} strokeWidth={0.15} />
      ))}
    </svg>
  );
};

// Cursor de mano en pixel art (original).
const MANO = [
  "....oo.......",
  "...owwo......",
  "...owwo......",
  "...owwo......",
  "...owwoooo...",
  "...owwowwoooo",
  ".ooowwowwowwo",
  "owwowwwwwwwwo",
  "owwwwwwwwwwwo",
  ".owwwwwwwwwwo",
  "..owwwwwwwwo.",
  "..owwwwwwwwo.",
  "...owwwwwwo..",
  "...oooooooo..",
];

export const Cursor: React.FC<{ x: number; y: number; px?: number; presionado?: boolean }> = ({
  x,
  y,
  px = 5,
  presionado = false,
}) => (
  <svg
    width={13 * px}
    height={14 * px}
    viewBox="0 0 13 14"
    shapeRendering="crispEdges"
    style={{
      position: "absolute",
      left: x - 4.5 * px,
      top: y - 0.5 * px,
      transform: `scale(${presionado ? 0.88 : 1})`,
      transformOrigin: "35% 5%",
      filter: "drop-shadow(4px 6px 0 rgba(138,90,110,0.35))",
    }}
  >
    {MANO.flatMap((fila, j) =>
      fila.split("").map((c, i) => (c === "." ? null : <rect key={`${i}-${j}`} x={i} y={j} width={1} height={1} fill={c === "o" ? C.contorno : "#FFFFFF"} />)),
    )}
  </svg>
);
