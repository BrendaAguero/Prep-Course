import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, Destello, Sprite } from "../Deco";
import { C } from "../tema";
import { Tostada } from "../Tostada";
import { Conejita } from "./Conejita";
import type { Paleta } from "./paletas";

const borde = (p: Paleta, g = 5) => `${g}px solid ${p.contorno}`;

const texto = (p: Paleta, color: string, grosor: number): React.CSSProperties => ({
  color,
  WebkitTextStroke: `${grosor}px ${p.contorno}`,
  paintOrder: "stroke fill",
});

/** Plato visto desde arriba con los colores de la paleta. */
const Plato: React.FC<{ p: Paleta; r: number }> = ({ p, r }) => (
  <svg viewBox="-110 -110 220 220" width={r * 2} height={r * 2}>
    <ellipse cx={4} cy={8} rx={104} ry={102} fill="#00000014" />
    <circle r={104} fill="#FFFFFF" stroke={p.contorno} strokeWidth={4} />
    <circle r={93} fill="none" stroke={p.ui} strokeWidth={7} />
    {Array.from({ length: 20 }).map((_, i) => {
      const a = (i / 20) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 93} cy={Math.sin(a) * 93} r={2.6} fill="#FFFFFF" />;
    })}
    <circle r={72} fill="none" stroke="#F1ECEF" strokeWidth={3} />
  </svg>
);

/** Ventana con cortinas festoneadas. */
const VentanaCocina: React.FC<{ p: Paleta; x: number; y: number }> = ({ p, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 290 }}>
    <div style={{ position: "absolute", left: 20, top: 20, width: 260, height: 240, borderRadius: "130px 130px 14px 14px", border: borde(p, 6), background: `linear-gradient(${p.cielo}, #FFFFFF)`, overflow: "hidden" }}>
      {[
        [40, 60, 70],
        [150, 110, 90],
      ].map(([cx, cy, w], i) => (
        <div key={i} style={{ position: "absolute", left: cx, top: cy, width: w, height: w * 0.4, borderRadius: w, backgroundColor: "#FFFFFF" }} />
      ))}
      <div style={{ position: "absolute", left: 127, top: 0, width: 6, height: 240, backgroundColor: p.madera, borderLeft: borde(p, 2), borderRight: borde(p, 2) }} />
      <div style={{ position: "absolute", left: 0, top: 120, width: 260, height: 6, backgroundColor: p.madera, borderTop: borde(p, 2), borderBottom: borde(p, 2) }} />
    </div>
    {/* barra y cortinas */}
    <div style={{ position: "absolute", left: -10, top: 6, width: 320, height: 16, borderRadius: 8, backgroundColor: p.maderaOscura, border: borde(p, 4) }} />
    {[0, 1].map((lado) => (
      <svg key={lado} width={120} height={240} viewBox="0 0 120 240" style={{ position: "absolute", top: 18, left: lado ? 190 : -10, transform: lado ? "scaleX(-1)" : undefined }}>
        <path d="M0 0 L110 0 C 100 60, 60 110, 50 150 C 45 180, 55 210, 60 236 L 0 236 Z" fill={p.ui} stroke={p.contorno} strokeWidth={5} />
        <path d="M10 10 C 20 70, 30 120, 20 230" stroke="#FFFFFF66" strokeWidth={8} fill="none" />
        <path d="M0 236 q 10 -14 20 0 t 20 0 t 20 0" fill={p.ui} stroke={p.contorno} strokeWidth={5} />
        <rect x={34} y={140} width={34} height={18} rx={9} fill={p.acento} stroke={p.contorno} strokeWidth={4} />
      </svg>
    ))}
    <div style={{ position: "absolute", left: 4, top: 256, width: 292, height: 22, borderRadius: 8, backgroundColor: p.madera, border: borde(p, 4) }} />
    <Sprite n="flor" tam={60} style={{ position: "absolute", left: 30, top: 205 }} />
  </div>
);

/** Fondo de cocina: pared, azulejos, estante, utensilios y encimera. */
export const Cocina: React.FC<{ p: Paleta }> = ({ p }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: p.pared, backgroundImage: p.paredPatron, backgroundSize: p.paredTam }} />
    {/* moldura superior */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, backgroundColor: p.madera, borderBottom: borde(p, 4) }} />
    {/* azulejos */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 440,
        height: 90,
        backgroundColor: p.azulejo,
        backgroundImage: "linear-gradient(#FFFFFF 3px, transparent 3px), linear-gradient(90deg, #FFFFFF 3px, transparent 3px)",
        backgroundSize: "45px 45px",
        borderTop: borde(p, 4),
      }}
    />
    <VentanaCocina p={p} x={60} y={150} />
    {/* estante con frascos */}
    <div style={{ position: "absolute", left: 420, top: 300, width: 400, height: 22, borderRadius: 6, backgroundColor: p.madera, border: borde(p, 4) }} />
    {[440, 780].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 318, width: 14, height: 40, backgroundColor: p.maderaOscura, border: borde(p, 3), borderTop: "none" }} />
    ))}
    {[
      [450, p.acento, 80],
      [545, p.ui, 64],
      [625, "#FFFFFF", 90],
      [725, p.conejo.delantal, 70],
    ].map(([x, color, h], i) => (
      <div key={i} style={{ position: "absolute", left: x as number, top: 300 - (h as number), width: 70, height: h as number, borderRadius: "16px 16px 10px 10px", backgroundColor: "#FFFFFFCC", border: borde(p, 4) }}>
        <div style={{ position: "absolute", left: -4, right: -4, top: -14, height: 18, borderRadius: 6, backgroundColor: color as string, border: borde(p, 4) }} />
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: (h as number) * 0.45, borderRadius: 6, backgroundColor: color as string, opacity: 0.7 }} />
      </div>
    ))}
    {/* barra con utensilios */}
    <div style={{ position: "absolute", left: 440, top: 140, width: 330, height: 12, borderRadius: 6, backgroundColor: p.maderaOscura, border: borde(p, 3) }} />
    {[
      [470, "M10 0 L10 60 M0 60 Q 10 100 20 60 Z"],
      [560, "M10 0 L10 55 M-2 55 L22 55 L22 90 L-2 90 Z"],
      [650, "M10 0 L10 50 M10 50 m -14 0 a 14 18 0 1 0 28 0 a 14 18 0 1 0 -28 0"],
      [730, "M10 0 L10 60 M4 60 L4 95 M10 60 L10 95 M16 60 L16 95"],
    ].map(([x, d], i) => (
      <svg key={i} width={40} height={110} viewBox="-10 -4 40 110" style={{ position: "absolute", left: (x as number) - 10, top: 146 }}>
        <path d={d as string} stroke={p.contorno} strokeWidth={5} fill={i % 2 ? p.acento : p.panel} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ))}
    {/* encimera */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 530,
        bottom: 0,
        backgroundColor: p.encimera,
        backgroundImage: `linear-gradient(90deg, ${p.encimeraVeta} 3px, transparent 3px)`,
        backgroundSize: "150px 100%",
        borderTop: borde(p, 6),
      }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: 536, height: 16, backgroundColor: "#FFFFFF88" }} />
  </AbsoluteFill>
);

/** Despensa: armario de madera con estantes. */
const Despensa: React.FC<{ p: Paleta; resaltado?: number }> = ({ p, resaltado }) => {
  const items = [
    ["pan", "Pan"],
    ["mantequilla", "Mantequilla"],
    ["fresa", "Fresa"],
    ["miel", "Miel"],
  ];
  return (
    <div style={{ position: "absolute", left: 900, top: 150, width: 250, height: 640 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 16px 16px", backgroundColor: p.madera, border: borde(p, 6), boxShadow: `0 10px 0 ${p.contorno}` }} />
      <div style={{ position: "absolute", left: -12, right: -12, top: -16, height: 40, borderRadius: 16, backgroundColor: p.maderaOscura, border: borde(p, 5) }} />
      <div style={{ position: "absolute", left: 45, right: 45, top: -32, height: 50, borderRadius: 14, backgroundColor: p.panel, border: borde(p, 5), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 28, color: p.texto }}>
        Despensa
      </div>
      {items.map(([n, nombre], i) => {
        const on = resaltado === i;
        return (
          <div key={n} style={{ position: "absolute", left: 18, right: 18, top: 40 + i * 148, height: 136 }}>
            <div style={{ position: "absolute", inset: "0 0 18px 0", borderRadius: 14, backgroundColor: on ? "#FFF3C4" : p.panel, border: borde(p, 4), boxShadow: on ? `0 0 0 6px ${p.acento}` : "inset 0 -10px 0 #00000010" }} />
            <Sprite n={n} tam={92} style={{ position: "absolute", left: 60, top: 10 }} />
            <div style={{ position: "absolute", left: -10, right: -10, bottom: 0, height: 22, borderRadius: 6, backgroundColor: p.maderaOscura, border: borde(p, 4) }} />
            {on && (
              <div style={{ position: "absolute", right: 250, top: 34, backgroundColor: p.texto, color: "#FFFFFF", fontFamily: C.pixel, fontWeight: 700, fontSize: 32, padding: "4px 16px", borderRadius: 10, whiteSpace: "nowrap" }}>
                {nombre}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const BotonP: React.FC<{ p: Paleta; texto: string; x: number; y: number; w: number; tam?: number; color?: string; icono?: string }> = ({
  p,
  texto: t,
  x,
  y,
  w,
  tam = 46,
  color,
  icono,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - 42,
      width: w,
      height: 84,
      borderRadius: 24,
      backgroundColor: color ?? p.ui,
      border: borde(p, 5),
      boxShadow: `0 9px 0 ${p.contorno}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      fontFamily: C.pixel,
      fontWeight: 700,
      fontSize: tam,
      ...texto(p, "#FFFFFF", 7),
    }}
  >
    <div style={{ position: "absolute", top: 9, left: 18, width: 30, height: 10, borderRadius: 5, backgroundColor: "#FFFFFF99" }} />
    {icono && <span style={{ fontSize: tam * 0.8 }}>{icono}</span>}
    {t}
  </div>
);

export const Menu: React.FC<{ p: Paleta }> = ({ p }) => (
  <AbsoluteFill>
    <Cocina p={p} />
    <AbsoluteFill style={{ backgroundColor: `${p.exterior}B3` }} />
    {/* Logo */}
    <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", transform: "rotate(-3deg)" }}>
      <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, "#FFFFFF", 22) }}>Cocina</div>
      <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, p.ui, 22) }}>Dulce ♡</div>
    </div>
    <Destello x={250} y={110} tam={60} color={p.acento} />
    <Destello x={960} y={250} tam={50} />
    {/* Panel de menú */}
    <div style={{ position: "absolute", left: 470, top: 390, width: 620, height: 440, borderRadius: 36, backgroundColor: p.panel, border: borde(p, 6), boxShadow: `0 12px 0 ${p.contorno}` }}>
      <div style={{ position: "absolute", inset: 12, borderRadius: 26, border: `4px dashed ${p.ui}88` }} />
    </div>
    <BotonP p={p} x={780} y={480} w={460} texto="Jugar" icono="▶" tam={52} />
    <BotonP p={p} x={780} y={600} w={460} texto="Libro de recetas" color={p.acento} tam={40} />
    <BotonP p={p} x={780} y={720} w={460} texto="Opciones" color={p.maderaOscura} tam={40} />
    {/* Conejita */}
    <div style={{ position: "absolute", left: 100, top: 410, width: 330, height: 360, borderRadius: "50%", backgroundColor: "#FFFFFF88" }} />
    <Conejita p={p} px={13} pose="brazos" style={{ position: "absolute", left: 105, top: 430 }} />
    <div style={{ position: "absolute", left: 60, top: 820, width: 400, textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.texto }}>
      ¡Hola! Soy Nube ♡
    </div>
    <Cursor x={830} y={490} />
  </AbsoluteFill>
);

export const Juego: React.FC<{ p: Paleta }> = ({ p }) => (
  <AbsoluteFill>
    <Cocina p={p} />
    {/* tabla de cortar bajo el plato */}
    <div style={{ position: "absolute", left: 250, top: 560, width: 480, height: 300, borderRadius: 40, backgroundColor: p.madera, border: borde(p, 5), boxShadow: `0 8px 0 ${p.contorno}` }}>
      <div style={{ position: "absolute", right: -40, top: 120, width: 60, height: 50, borderRadius: 25, backgroundColor: p.madera, border: borde(p, 5) }} />
    </div>
    <div style={{ position: "absolute", left: 490 - 175, top: 710 - 175 - 30 }}>
      <Plato p={p} r={175} />
    </div>
    <div style={{ position: "absolute", left: 490 - 120, top: 680 - 112, width: 240, height: 224 }}>
      <Tostada untado={0.55} fresas={0} miel={0} id={`prev-${p.id}`} />
    </div>
    <Despensa p={p} resaltado={2} />
    {/* Cinta de instrucción */}
    <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 92, borderRadius: 24, backgroundColor: p.ui, border: borde(p, 5), boxShadow: `0 8px 0 ${p.contorno}`, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
      <div style={{ position: "absolute", inset: 8, borderRadius: 16, border: "3px dashed #FFFFFFAA" }} />
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 38, ...texto(p, p.acento, 7) }}>PASO 2/4</div>
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 44, ...texto(p, "#FFFFFF", 7) }}>¡Unta la mantequilla!</div>
    </div>
    {/* Conejita con bocadillo */}
    <Conejita p={p} px={8} pose="feliz" style={{ position: "absolute", left: 30, top: 670 }} />
    <div style={{ position: "absolute", left: 40, top: 590, backgroundColor: "#FFFFFF", border: borde(p, 5), borderRadius: 22, padding: "8px 22px", fontFamily: C.pixel, fontWeight: 700, fontSize: 38, color: p.ui }}>
      ¡Qué rico!
    </div>
    {/* progreso y puntos */}
    <div style={{ position: "absolute", left: 760, top: 816, display: "flex", alignItems: "center", gap: 8, backgroundColor: p.panel, border: borde(p, 5), borderRadius: 18, padding: "2px 16px" }}>
      {[0, 1, 2, 3].map((i) => (
        <Sprite key={i} n="corazon" tam={44} style={{ filter: i < 1 ? "none" : "grayscale(1) opacity(0.35)" }} />
      ))}
      <div style={{ width: 4, height: 40, backgroundColor: `${p.contorno}33`, margin: "0 6px" }} />
      <Sprite n="estrella" tam={40} />
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 38, color: p.texto }}>100</div>
    </div>
    {/* cursor untando con la mantequilla */}
    <div style={{ position: "absolute", left: 500, top: 600, transform: "rotate(-10deg)" }}>
      <Sprite n="mantequilla" tam={100} />
    </div>
    <Cursor x={550} y={660} presionado />
  </AbsoluteFill>
);
