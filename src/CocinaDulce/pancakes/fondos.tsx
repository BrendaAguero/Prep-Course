import React from "react";
import { AbsoluteFill } from "remotion";
import { Sprite } from "../Deco";
import { Conejita } from "../disenos/Conejita";
import { PALETAS } from "../disenos/paletas";

// Fondos exteriores para el formato vertical (1080×1920), todos con la paleta A "Fresa y crema".
const P = PALETAS.find((x) => x.id === "A")!;
const ROSA = P.ui;
const ROSA_OSC = P.uiOscuro;
const ROSA_CLARO = "#FDE4EE";
const CREMA = P.panel;
const AMARILLO = P.acento;
const LILA = "#D9CCF5";
const LILA_CLARO = P.exterior;
const MADERA = P.madera;
const LINEA = P.contorno;

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const css = (s: React.CSSProperties) => () => <AbsoluteFill style={s} />;

const Svg: React.FC<{ children: React.ReactNode; fondo?: string }> = ({ children, fondo }) => (
  <AbsoluteFill style={{ backgroundColor: fondo }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  </AbsoluteFill>
);

const corazon = "M0 8 C -14 -2, -10 -14, 0 -7 C 10 -14, 14 -2, 0 8 Z";

// ---------- Lámina 1 · Patrones clásicos ----------
const Lunares = css({
  backgroundColor: ROSA_CLARO,
  backgroundImage: `radial-gradient(${ROSA} 22%, transparent 23%), radial-gradient(${ROSA} 22%, transparent 23%)`,
  backgroundSize: "90px 90px",
  backgroundPosition: "0 0, 45px 45px",
});

const Vichy = css({
  backgroundColor: CREMA,
  backgroundImage: `linear-gradient(90deg, ${ROSA}66 50%, transparent 50%), linear-gradient(${ROSA}66 50%, transparent 50%)`,
  backgroundSize: "100px 100px",
});

const RayasCaramelo = css({
  backgroundImage: `repeating-linear-gradient(90deg, ${ROSA_CLARO} 0 60px, ${CREMA} 60px 90px, ${ROSA} 90px 110px, ${CREMA} 110px 140px)`,
});

const Arlequin = css({
  backgroundColor: LILA_CLARO,
  backgroundImage: `linear-gradient(45deg, ${ROSA_CLARO} 25%, transparent 25%, transparent 75%, ${ROSA_CLARO} 75%), linear-gradient(-45deg, ${LILA} 25%, transparent 25%, transparent 75%, ${LILA} 75%)`,
  backgroundSize: "120px 120px",
});

const Corazones: React.FC = () => (
  <Svg fondo={ROSA_CLARO}>
    <defs>
      <pattern id="corazones" width={120} height={120} patternUnits="userSpaceOnUse">
        <path d={corazon} transform="translate(30 32) scale(1.6)" fill={ROSA} />
        <path d={corazon} transform="translate(90 92) scale(1.6) rotate(12)" fill="#FFFFFF" />
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#corazones)" />
  </Svg>
);

const Escoces = css({
  backgroundColor: CREMA,
  backgroundImage: [
    `repeating-linear-gradient(90deg, transparent 0 70px, ${ROSA}44 70px 110px, transparent 110px 140px, ${LILA}88 140px 150px, transparent 150px 180px)`,
    `repeating-linear-gradient(0deg, transparent 0 70px, ${ROSA}44 70px 110px, transparent 110px 140px, ${LILA}88 140px 150px, transparent 150px 180px)`,
  ].join(", "),
});

// ---------- Lámina 2 · Dulces ----------
const FresasPixelTile: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CREMA }}>
    {Array.from({ length: 11 * 7 }).map((_, i) => {
      const fila = Math.floor(i / 7);
      const col = i % 7;
      return (
        <Sprite
          key={i}
          n={(fila + col) % 3 === 0 ? "flor" : "fresa"}
          tam={72}
          style={{ position: "absolute", left: col * 160 + (fila % 2) * 80 - 20, top: fila * 180, opacity: 0.85, transform: `rotate(${(rnd(i) - 0.5) * 30}deg)` }}
        />
      );
    })}
  </AbsoluteFill>
);

const ConfetiDulce: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: LILA_CLARO }}>
    {Array.from({ length: 70 }).map((_, i) => (
      <Sprite
        key={i}
        n={["corazon", "estrella", "flor", "fresa"][i % 4]}
        tam={40 + rnd(i) * 40}
        style={{ position: "absolute", left: rnd(i + 3) * 1040, top: rnd(i + 7) * 1880, transform: `rotate(${rnd(i + 9) * 360}deg)`, opacity: 0.9 }}
      />
    ))}
  </AbsoluteFill>
);

const Glaseado: React.FC = () => (
  <Svg fondo={CREMA}>
    <path
      d={`M0 0 H1080 V380 ${Array.from({ length: 9 })
        .map((_, i) => {
          const x0 = 1080 - i * 120;
          const largo = 60 + rnd(i) * 140;
          return `C ${x0 - 20} 380, ${x0 - 30} ${380 + largo}, ${x0 - 60} ${380 + largo} C ${x0 - 90} ${380 + largo}, ${x0 - 100} 380, ${x0 - 120} 380`;
        })
        .join(" ")} Z`}
      fill={ROSA}
      stroke={LINEA}
      strokeWidth={6}
    />
    {Array.from({ length: 80 }).map((_, i) => (
      <rect
        key={i}
        x={rnd(i) * 1080}
        y={rnd(i + 1) * (i < 30 ? 360 : 1900)}
        width={8}
        height={26}
        rx={4}
        fill={["#FFFFFF", AMARILLO, LILA, "#9ED8F0", ROSA][i % 5]}
        transform={`rotate(${rnd(i + 2) * 180} ${rnd(i) * 1080} ${rnd(i + 1) * 1900})`}
      />
    ))}
  </Svg>
);

const Macarons: React.FC = () => (
  <Svg fondo={ROSA_CLARO}>
    <defs>
      <pattern id="macaron" width={180} height={160} patternUnits="userSpaceOnUse">
        {[
          [50, 50, ROSA],
          [140, 130, LILA],
          [140, 40, AMARILLO],
          [50, 140, CREMA],
        ].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx={0} cy={8} rx={34} ry={14} fill={c as string} stroke={LINEA} strokeWidth={3} />
            <rect x={-30} y={-4} width={60} height={10} fill="#FFFFFF" stroke={LINEA} strokeWidth={3} />
            <ellipse cx={0} cy={-8} rx={34} ry={14} fill={c as string} stroke={LINEA} strokeWidth={3} />
          </g>
        ))}
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#macaron)" opacity={0.85} />
  </Svg>
);

const Picnic: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        backgroundImage: `linear-gradient(90deg, ${ROSA_OSC}88 50%, transparent 50%), linear-gradient(${ROSA_OSC}88 50%, transparent 50%)`,
        backgroundSize: "70px 70px",
      }}
    />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <React.Fragment key={i}>
          <circle cx={i * 40} cy={0} r={34} fill="#FFFFFF" stroke={ROSA} strokeWidth={4} />
          <circle cx={i * 40} cy={1920} r={34} fill="#FFFFFF" stroke={ROSA} strokeWidth={4} />
        </React.Fragment>
      ))}
    </svg>
  </AbsoluteFill>
);

const Piruletas: React.FC = () => (
  <Svg fondo={CREMA}>
    <defs>
      <pattern id="piruleta" width={200} height={200} patternUnits="userSpaceOnUse">
        {[
          [60, 60, ROSA],
          [160, 160, LILA],
        ].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={40} fill="#FFFFFF" stroke={LINEA} strokeWidth={4} />
            <path d="M0 0 C 10 -10 22 0 18 14 C 12 32 -18 30 -26 8 C -36 -22 -4 -40 22 -32 C 44 -24 46 4 36 22" fill="none" stroke={c as string} strokeWidth={10} strokeLinecap="round" />
          </g>
        ))}
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#piruleta)" />
  </Svg>
);

// ---------- Lámina 3 · Escenarios ----------
const CieloNubes: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(${LILA} 0%, ${ROSA_CLARO} 55%, ${CREMA} 100%)` }}>
    {[
      [60, 120, 260],
      [700, 60, 300],
      [-40, 900, 280],
      [760, 1040, 320],
      [180, 1700, 300],
      [820, 1760, 260],
    ].map(([x, y, w], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.42 }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: w, height: w * 0.28, borderRadius: w, backgroundColor: "#FFFFFF" }} />
        <div style={{ position: "absolute", left: w * 0.18, bottom: w * 0.1, width: w * 0.36, height: w * 0.36, borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
        <div style={{ position: "absolute", left: w * 0.44, bottom: w * 0.06, width: w * 0.3, height: w * 0.3, borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
      </div>
    ))}
  </AbsoluteFill>
);

const PapelVintage: React.FC = () => (
  <Svg fondo={ROSA_CLARO}>
    <defs>
      <pattern id="flores-vintage" width={160} height={160} patternUnits="userSpaceOnUse">
        {[
          [40, 40],
          [120, 120],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-13} rx={9} ry={14} fill={i ? LILA : ROSA} transform={`rotate(${a})`} />
            ))}
            <circle r={7} fill={AMARILLO} />
            <path d="M14 14 q 14 6 22 -4" stroke="#9CCB8E" strokeWidth={4} fill="none" />
          </g>
        ))}
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#flores-vintage)" />
    {/* zócalo de madera */}
    <rect x={0} y={1700} width={1080} height={220} fill={MADERA} />
    {Array.from({ length: 10 }).map((_, i) => (
      <line key={i} x1={i * 120} x2={i * 120} y1={1700} y2={1920} stroke={P.maderaOscura} strokeWidth={6} />
    ))}
    <rect x={0} y={1690} width={1080} height={24} fill={P.maderaOscura} />
  </Svg>
);

const AtardecerPixel: React.FC = () => {
  const bandas = [LILA, "#E6C7EE", "#F3C2DA", ROSA_CLARO, "#FFD9C9", "#FFE7B8", CREMA];
  return (
    <AbsoluteFill>
      {bandas.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i * 1920) / bandas.length, height: 1920 / bandas.length + 1, backgroundColor: c }} />
      ))}
      {/* borde "dithering" entre bandas */}
      {bandas.slice(1).map((c, i) => (
        <div
          key={`d${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ((i + 1) * 1920) / bandas.length - 24,
            height: 24,
            backgroundImage: `linear-gradient(45deg, ${c} 25%, transparent 25%, transparent 75%, ${c} 75%), linear-gradient(45deg, ${c} 25%, transparent 25%, transparent 75%, ${c} 75%)`,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <Sprite key={i} n="estrella" tam={30 + rnd(i) * 26} style={{ position: "absolute", left: rnd(i + 4) * 1040, top: rnd(i + 8) * 700 }} />
      ))}
    </AbsoluteFill>
  );
};

const Jardin: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(${ROSA_CLARO} 0%, ${CREMA} 60%, #DDF1D2 60%, #C8E6B8 100%)` }}>
    {Array.from({ length: 40 }).map((_, i) => (
      <Sprite key={i} n={i % 5 === 0 ? "fresa" : "flor"} tam={60 + rnd(i) * 40} style={{ position: "absolute", left: rnd(i + 1) * 1040 - 20, top: 1160 + rnd(i + 2) * 740 }} />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <Sprite key={`b${i}`} n="flor" tam={40} style={{ position: "absolute", left: rnd(i + 30) * 1040, top: rnd(i + 31) * 500, opacity: 0.6 }} />
    ))}
  </AbsoluteFill>
);

const NocheEstrellada: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#6E5A9E 0%, #9C82C8 50%, #E9B8D8 100%)" }}>
    {Array.from({ length: 60 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: rnd(i) * 1080, top: rnd(i + 1) * 1920, width: 6 + rnd(i + 2) * 8, height: 6 + rnd(i + 2) * 8, borderRadius: "50%", backgroundColor: i % 4 ? "#FFFFFF" : AMARILLO, opacity: 0.85 }} />
    ))}
    <div style={{ position: "absolute", right: 70, top: 1700, width: 150, height: 150, borderRadius: "50%", backgroundColor: "#FFF3C4", boxShadow: "0 0 60px #FFF3C4" }}>
      <div style={{ position: "absolute", left: 40, top: -10, width: 150, height: 150, borderRadius: "50%", backgroundColor: "#B08ED0" }} />
    </div>
    {Array.from({ length: 10 }).map((_, i) => (
      <Sprite key={`e${i}`} n="estrella" tam={40} style={{ position: "absolute", left: rnd(i + 50) * 1040, top: rnd(i + 51) * 1880 }} />
    ))}
  </AbsoluteFill>
);

const Dulceria: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ROSA_CLARO, backgroundImage: `linear-gradient(90deg, #FFFFFF66 50%, transparent 50%)`, backgroundSize: "70px 100%" }}>
    {[380, 1260, 1840].map((y, f) => (
      <React.Fragment key={y}>
        <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 28, backgroundColor: MADERA, borderTop: `5px solid ${LINEA}`, borderBottom: `5px solid ${LINEA}` }} />
        {Array.from({ length: 7 }).map((_, i) => {
          const h = 90 + rnd(i + f * 9) * 60;
          const c = [ROSA, LILA, AMARILLO, "#9ED8F0"][(i + f) % 4];
          return (
            <div key={i} style={{ position: "absolute", left: 20 + i * 152, top: y - h, width: 110, height: h, borderRadius: "22px 22px 12px 12px", border: `5px solid ${LINEA}`, backgroundColor: "#FFFFFFCC" }}>
              <div style={{ position: "absolute", left: -6, right: -6, top: -16, height: 20, borderRadius: 8, backgroundColor: c, border: `5px solid ${LINEA}` }} />
              {Array.from({ length: 6 }).map((__, k) => (
                <div key={k} style={{ position: "absolute", left: 10 + (k % 3) * 30, bottom: 8 + Math.floor(k / 3) * 28, width: 24, height: 24, borderRadius: "50%", backgroundColor: c }} />
              ))}
            </div>
          );
        })}
      </React.Fragment>
    ))}
  </AbsoluteFill>
);

// ---------- Lámina 4 · Kawaii y brillo ----------
const DegradadoBrillos: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${ROSA} 0%, ${ROSA_CLARO} 45%, ${LILA} 100%)` }}>
    {Array.from({ length: 30 }).map((_, i) => {
      const t = 20 + rnd(i) * 50;
      return (
        <svg key={i} width={t} height={t} viewBox="-50 -50 100 100" style={{ position: "absolute", left: rnd(i + 1) * 1060, top: rnd(i + 2) * 1900 }}>
          <path d="M0 -50 Q 8 -8 50 0 Q 8 8 0 50 Q -8 8 -50 0 Q -8 -8 0 -50 Z" fill={i % 3 ? "#FFFFFF" : AMARILLO} />
        </svg>
      );
    })}
  </AbsoluteFill>
);

const EncajeGrande: React.FC = () => (
  <Svg fondo={ROSA}>
    <defs>
      <pattern id="blonda" width={240} height={240} patternUnits="userSpaceOnUse">
        <g transform="translate(120 120)">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 92} r={22} fill="#FFFFFF" />;
          })}
          <circle r={92} fill="#FFFFFF" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 64} cy={Math.sin(a) * 64} r={9} fill={ROSA_CLARO} />;
          })}
          <circle r={36} fill={ROSA_CLARO} />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 100} cy={Math.sin(a) * 100} r={5} fill={ROSA} />;
          })}
        </g>
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#blonda)" />
  </Svg>
);

const CintasLazos: React.FC = () => (
  <Svg fondo={CREMA}>
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-600 + i * 260} y={-200} width={70} height={2600} fill={i % 2 ? LILA : ROSA_CLARO} transform="rotate(-30 540 960)" />
    ))}
    {Array.from({ length: 12 }).map((_, i) => {
      const x = (i % 3) * 360 + 180 + ((Math.floor(i / 3) % 2) * 180 - 90);
      const y = Math.floor(i / 3) * 500 + 140;
      return (
        <g key={`l${i}`} transform={`translate(${x} ${y}) scale(0.7)`}>
          <path d="M-10 0 C -60 -60 -100 -30 -90 0 C -100 40 -60 60 -10 0 Z" fill={ROSA} stroke={LINEA} strokeWidth={6} />
          <path d="M10 0 C 60 -60 100 -30 90 0 C 100 40 60 60 10 0 Z" fill={ROSA} stroke={LINEA} strokeWidth={6} />
          <rect x={-18} y={-20} width={36} height={40} rx={12} fill={ROSA_OSC} stroke={LINEA} strokeWidth={6} />
        </g>
      );
    })}
  </Svg>
);

const TableroPixel = css({
  backgroundColor: LILA_CLARO,
  backgroundImage: `linear-gradient(45deg, ${ROSA_CLARO} 25%, transparent 25%, transparent 75%, ${ROSA_CLARO} 75%), linear-gradient(45deg, ${ROSA_CLARO} 25%, transparent 25%, transparent 75%, ${ROSA_CLARO} 75%), radial-gradient(${LILA} 20%, transparent 21%)`,
  backgroundSize: "120px 120px, 120px 120px, 30px 30px",
  backgroundPosition: "0 0, 60px 60px, 0 0",
  imageRendering: "pixelated",
});

const Burbujas: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(200deg, #FFE3F0 0%, ${LILA} 50%, #CFEAFB 100%)` }}>
    {Array.from({ length: 26 }).map((_, i) => {
      const r = 40 + rnd(i) * 120;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: rnd(i + 1) * 1080 - r / 2,
            top: rnd(i + 2) * 1920 - r / 2,
            width: r,
            height: r,
            borderRadius: "50%",
            border: "4px solid #FFFFFFCC",
            background: "radial-gradient(circle at 30% 30%, #FFFFFFCC 0 12%, #FFFFFF22 30%, transparent 70%)",
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const Stickers: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ROSA_CLARO, backgroundImage: `radial-gradient(#FFFFFF 18%, transparent 19%)`, backgroundSize: "60px 60px" }}>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = rnd(i + 70) * 960;
      const y = rnd(i + 71) * 1800;
      return i % 2 ? (
        <div key={i} style={{ position: "absolute", left: x, top: y, padding: 10, borderRadius: 30, backgroundColor: "#FFFFFF", transform: `rotate(${(rnd(i) - 0.5) * 40}deg)`, boxShadow: `4px 6px 0 ${LINEA}33` }}>
          <Conejita p={P} px={4} pose={i % 4 === 1 ? "feliz" : "brazos"} />
        </div>
      ) : (
        <div key={i} style={{ position: "absolute", left: x, top: y, padding: 12, borderRadius: "50%", backgroundColor: "#FFFFFF", transform: `rotate(${(rnd(i) - 0.5) * 40}deg)`, boxShadow: `4px 6px 0 ${LINEA}33` }}>
          <Sprite n={["corazon", "fresa", "estrella", "flor"][i % 4]} tam={70} />
        </div>
      );
    })}
  </AbsoluteFill>
);

export type Fondo = { id: number; nombre: string; C: React.FC };
export type GrupoFondos = { titulo: string; fondos: Fondo[] };

export const GRUPOS: GrupoFondos[] = [
  {
    titulo: "Patrones clásicos",
    fondos: [
      { id: 1, nombre: "Lunares fresa", C: Lunares },
      { id: 2, nombre: "Vichy rosa", C: Vichy },
      { id: 3, nombre: "Rayas caramelo", C: RayasCaramelo },
      { id: 4, nombre: "Arlequín", C: Arlequin },
      { id: 5, nombre: "Corazones", C: Corazones },
      { id: 6, nombre: "Escocés pastel", C: Escoces },
    ],
  },
  {
    titulo: "Dulces",
    fondos: [
      { id: 7, nombre: "Fresas pixel", C: FresasPixelTile },
      { id: 8, nombre: "Confeti dulce", C: ConfetiDulce },
      { id: 9, nombre: "Glaseado y sprinkles", C: Glaseado },
      { id: 10, nombre: "Macarons", C: Macarons },
      { id: 11, nombre: "Mantel de picnic", C: Picnic },
      { id: 12, nombre: "Piruletas", C: Piruletas },
    ],
  },
  {
    titulo: "Escenarios",
    fondos: [
      { id: 13, nombre: "Cielo con nubes", C: CieloNubes },
      { id: 14, nombre: "Papel vintage", C: PapelVintage },
      { id: 15, nombre: "Atardecer pixel", C: AtardecerPixel },
      { id: 16, nombre: "Jardín de fresas", C: Jardin },
      { id: 17, nombre: "Noche estrellada", C: NocheEstrellada },
      { id: 18, nombre: "Dulcería", C: Dulceria },
    ],
  },
  {
    titulo: "Kawaii y brillo",
    fondos: [
      { id: 19, nombre: "Degradado con brillos", C: DegradadoBrillos },
      { id: 20, nombre: "Blonda de encaje", C: EncajeGrande },
      { id: 21, nombre: "Cintas y lazos", C: CintasLazos },
      { id: 22, nombre: "Tablero pixel", C: TableroPixel },
      { id: 23, nombre: "Burbujas", C: Burbujas },
      { id: 24, nombre: "Stickers de Nube", C: Stickers },
    ],
  },
];
