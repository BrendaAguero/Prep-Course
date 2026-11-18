import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TEMA } from "./tema";

const W = 1080;
const H = 1920;
export const MOSTRADOR_Y = 1170;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

/** Pared de azulejos y mostrador de madera. */
export const Cocina: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: TEMA.pared }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${TEMA.paredLinea} 4px, transparent 4px), linear-gradient(90deg, ${TEMA.paredLinea} 4px, transparent 4px)`,
        backgroundSize: "120px 120px",
        opacity: 0.8,
      }}
    />
    <Svg>
      <rect x={0} y={MOSTRADOR_Y} width={W} height={H - MOSTRADOR_Y} fill={TEMA.madera} />
      <rect x={0} y={MOSTRADOR_Y} width={W} height={26} fill={TEMA.maderaOscura} />
      {[1290, 1400].map((y) => (
        <line key={y} x1={0} x2={W} y1={y} y2={y} stroke={TEMA.maderaOscura} strokeWidth={6} />
      ))}
      <line x1={0} x2={W} y1={MOSTRADOR_Y} y2={MOSTRADOR_Y} stroke={TEMA.borde} strokeWidth={8} />
    </Svg>
  </AbsoluteFill>
);

/** Bol en vista lateral. `children` se dibuja dentro (entre el fondo y el frente del bol). */
export const Bol: React.FC<{
  nivel: number;
  color: string;
  children?: React.ReactNode;
  contenido?: React.ReactNode;
}> = ({ nivel, color, children, contenido }) => {
  const rx = 160 + 90 * nivel;
  const ry = 32 + 22 * nivel;
  const cy = 912 - 18 * nivel;
  return (
    <>
      <Svg>
        <defs>
          <clipPath id="interior-bol">
            <ellipse cx={540} cy={880} rx={274} ry={66} />
          </clipPath>
        </defs>
        <ellipse cx={540} cy={880} rx={280} ry={70} fill="#D8CFC0" stroke={TEMA.borde} strokeWidth={8} />
        <g clipPath="url(#interior-bol)">
          {nivel > 0.01 && <ellipse cx={540} cy={cy} rx={rx} ry={ry} fill={color} stroke={TEMA.borde} strokeWidth={5} />}
          {contenido}
        </g>
      </Svg>
      {children}
      <Svg>
        <path
          d={`M260 880 A280 70 0 0 0 820 880 Q 812 ${MOSTRADOR_Y} 540 ${MOSTRADOR_Y} Q 268 ${MOSTRADOR_Y} 260 880 Z`}
          fill="#F4F1EA"
          stroke={TEMA.borde}
          strokeWidth={8}
        />
        <path d="M290 1000 Q 540 1060 790 1000" stroke={TEMA.naranja} strokeWidth={18} fill="none" strokeLinecap="round" />
      </Svg>
    </>
  );
};

/** Llamas bajo la sartén, con parpadeo. `calor` de 0 a 1. */
const Llamas: React.FC<{ calor: number }> = ({ calor }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[330, 400, 470, 540, 610, 680, 750].map((x, i) => {
        const s = calor * (0.75 + 0.25 * Math.sin(frame / 2.3 + i * 1.7));
        return (
          <g key={x} transform={`translate(${x} ${MOSTRADOR_Y - 34}) scale(${s})`}>
            <path d="M0 0 C -22 -30 -10 -66 0 -96 C 10 -66 22 -30 0 0 Z" fill={TEMA.naranja} />
            <path d="M0 0 C -11 -18 -5 -38 0 -54 C 5 -38 11 -18 0 0 Z" fill={TEMA.oro} />
          </g>
        );
      })}
    </>
  );
};

/** Estufa + sartén. `encima` se dibuja sobre la superficie de la sartén. */
export const Sarten: React.FC<{ calor: number; aceite?: number; encima?: React.ReactNode; children?: React.ReactNode }> = ({
  calor,
  aceite = 0,
  encima,
  children,
}) => (
  <>
    <Svg>
      <rect x={250} y={MOSTRADOR_Y - 40} width={580} height={46} rx={14} fill="#3B3B45" stroke={TEMA.borde} strokeWidth={6} />
      <Llamas calor={calor} />
      <rect x={810} y={985} width={250} height={44} rx={22} fill="#2F2F38" stroke={TEMA.borde} strokeWidth={6} transform="rotate(-6 810 1005)" />
      <path d="M240 1010 L 262 1075 Q 540 1125 818 1075 L 840 1010 Z" fill="#3F3F4A" stroke={TEMA.borde} strokeWidth={8} />
      <ellipse cx={540} cy={1010} rx={300} ry={78} fill="#555563" stroke={TEMA.borde} strokeWidth={8} />
      <ellipse cx={540} cy={1014} rx={262} ry={62} fill="#4A4A57" />
      {aceite > 0 && <ellipse cx={540} cy={1016} rx={240 * aceite} ry={52 * aceite} fill={TEMA.oro} opacity={0.35} />}
      {encima}
    </Svg>
    {children}
  </>
);

/** Plato blanco sobre el mostrador. */
export const Plato: React.FC = () => (
  <Svg>
    <ellipse cx={540} cy={MOSTRADOR_Y - 30} rx={350} ry={74} fill="#FFFFFF" stroke={TEMA.borde} strokeWidth={8} />
    <ellipse cx={540} cy={MOSTRADOR_Y - 34} rx={240} ry={46} fill="none" stroke="#E6DED2" strokeWidth={6} />
  </Svg>
);

/** Un panqueque (o tortita) en vista lateral, con grosor. */
export const Panqueque: React.FC<{ x: number; y: number; rx: number; ry: number; color: string; grosor?: number }> = ({
  x,
  y,
  rx,
  ry,
  color,
  grosor = 0,
}) => (
  <g>
    {grosor > 0 && (
      <path
        d={`M${x - rx} ${y} L ${x - rx} ${y + grosor} A ${rx} ${ry} 0 0 0 ${x + rx} ${y + grosor} L ${x + rx} ${y} Z`}
        fill="#B8763A"
        stroke={TEMA.borde}
        strokeWidth={5}
      />
    )}
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} stroke={TEMA.borde} strokeWidth={5} />
  </g>
);

export const Emoji: React.FC<{
  e: string;
  x: number;
  y: number;
  size: number;
  rot?: number;
  sx?: number;
  sy?: number;
  opacity?: number;
}> = ({ e, x, y, size, rot = 0, sx = 1, sy = 1, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      fontSize: size * 0.85,
      lineHeight: `${size}px`,
      textAlign: "center",
      opacity,
      transform: `rotate(${rot}deg) scale(${sx}, ${sy})`,
      transformOrigin: "50% 80%",
    }}
  >
    {e}
  </div>
);
