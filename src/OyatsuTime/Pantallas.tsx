// Pantallas comunes del juego おやつタイム (vista 1050×900 de la ventana).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Destello, Encaje, Sprite, Vichy } from "../CocinaDulce/Deco";
import { Conejita } from "../CocinaDulce/disenos/Conejita";
import { BotonP, Cocina } from "../CocinaDulce/disenos/Escenas";
import { Miniatura } from "./Interfaz";
import { Bocadillo } from "./Nube";
import { BOTON_COCINAR, BOTON_GUARDAR, BOTON_JUGAR, huecoInventario, inventario, VISTA } from "./posiciones";
import { borde, FUENTES, P, texto } from "./tema";
import type { Receta } from "./tipos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = VISTA.ancho;

/** La cocina (lienzo de 1200) centrada en la vista de 1050. */
const CocinaCentrada: React.FC = () => (
  <div style={{ position: "absolute", left: (W - 1200) / 2, top: 0, width: 1200, height: 900 }}>
    <Cocina p={P} />
  </div>
);

/** El plato terminado, centrado en (x, y) con un ancho dado. */
export const PlatoReceta: React.FC<{ r: Receta; x: number; y: number; ancho: number; alto: number; temblor?: number }> = ({ r, x, y, ancho, alto, temblor = 0 }) => (
  <Miniatura
    cx={r.plato.cx}
    cy={r.plato.cy}
    k={ancho / r.plato.ancho}
    w={ancho * 1.6}
    h={alto}
    style={{ left: x - ancho * 0.8, top: y - alto / 2, transform: `scale(${1 - temblor * 0.6}, ${1 + temblor})`, transformOrigin: "50% 85%" }}
  >
    {r.plato.dibujo}
  </Miniatura>
);

/** Cinta rosa con texto blanco (títulos de pantalla). */
const Cartel: React.FC<{ lineas: string[]; tam: number; style?: React.CSSProperties }> = ({ lineas, tam, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", ...style }}>
    <div style={{ padding: "14px 40px 18px", borderRadius: 30, backgroundColor: P.ui, border: borde(P, 6), boxShadow: `0 10px 0 ${P.contorno}`, textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 8, borderRadius: 22, border: "3px dashed #FFFFFFAA" }} />
      {lineas.map((l, i) => (
        <div key={i} style={{ fontFamily: FUENTES.redonda, fontSize: tam, lineHeight: 1.08, ...texto(P, "#FFFFFF", tam * 0.13) }}>
          {l}
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Gancho ---------- */

export const Gancho: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.sin(frame * 0.9) * Math.exp(-(frame % 30) / 10) * 0.08;
  const entra = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <CocinaCentrada />
      <PlatoReceta r={r} x={W / 2} y={600} ancho={470} alto={560} temblor={t} />
      <Destello x={170} y={520} tam={54} color={P.acento} />
      <Destello x={880} y={470} tam={44} fase={2} />
      <Destello x={830} y={720} tam={36} fase={4} color={P.acento} />
      <Cartel lineas={r.gancho} tam={66} style={{ top: 40, transform: `scale(${entra})` }} />
    </AbsoluteFill>
  );
};

/* ---------- Menú ---------- */

export const MenuJuego: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const entra = spring({ frame: frame - E.menu, fps, config: { damping: 12 } });
  const nube = spring({ frame: frame - E.menu - 8, fps, config: { damping: 10 } });
  const cx = BOTON_JUGAR.x;
  return (
    <AbsoluteFill>
      <CocinaCentrada />
      <AbsoluteFill style={{ backgroundColor: `${P.exterior}C0` }} />
      <div style={{ position: "absolute", left: cx - 360, top: 40, width: 720, height: 830, transform: `scale(${entra})`, borderRadius: 40, backgroundColor: P.panel, border: borde(P, 6), boxShadow: `0 12px 0 ${P.contorno}` }}>
        <div style={{ position: "absolute", inset: 12, borderRadius: 30, border: `3px dashed ${P.ui}66` }} />
        <div style={{ position: "absolute", top: 34, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "4px 22px", borderRadius: 20, backgroundColor: P.ui, border: borde(P, 4), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 36, ...texto(P, "#FFFFFF", 6) }}>Receta nº {r.numero}</div>
        </div>
        <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 64, ...texto(P, P.ui, 12) }}>{r.nombre}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${entra})`, transformOrigin: `${cx}px 450px` }}>
        <PlatoReceta r={r} x={cx} y={315} ancho={400} alto={230} />
      </div>
      <BotonP p={P} x={cx} y={BOTON_JUGAR.y} w={480} texto="Jugar" icono="▶" tam={56} presionado={frame >= E.clicJugar && frame < E.clicJugar + 6} />
      <BotonP p={P} x={cx} y={BOTON_JUGAR.y + 115} w={480} texto="Libro de recetas" color={P.acento} tam={42} />
      <BotonP p={P} x={cx} y={BOTON_JUGAR.y + 230} w={480} texto="Opciones" color={P.maderaOscura} tam={42} />
      {/* Nube saluda junto a la tarjeta */}
      <div style={{ position: "absolute", left: 18 - (1 - nube) * 300, top: 600 - Math.abs(Math.sin(frame / 7)) * 10 }}>
        <Conejita p={P} px={10} pose={Math.floor(frame / 10) % 2 ? "brazos" : "feliz"} />
      </div>
      {nube > 0.9 && <Bocadillo texto="¡Hola!" desde={E.menu + 18} x={40} y={610} />}
    </AbsoluteFill>
  );
};

/* ---------- Inventario ---------- */

export const Inventario: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const n = r.ingredientes.length;
  const geo = inventario(n);
  const captura = spring({ frame: frame - E.captura, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Vichy tam={50} color={`${P.ui}22`} fondo={P.panel} />
      <div style={{ position: "absolute", top: 24, left: 40, fontFamily: FUENTES.redonda, fontSize: 74, ...texto(P, P.ui, 12) }}>Ingredientes</div>
      <div style={{ position: "absolute", top: 120, left: 44, fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 36, color: P.texto }}>
        {r.porciones} · {r.tiempo}
      </div>
      {r.ingredientes.map((ing, i) => {
        const c = huecoInventario(i, n);
        const ok = frame >= E[`ing${i}`];
        const s = ok ? spring({ frame: frame - E[`ing${i}`], fps, config: { damping: 8 } }) : 0;
        const entra = spring({ frame: frame - E.ingredientes - i * 3, fps, config: { damping: 12 } });
        const L = geo.lado;
        return (
          <div key={ing.s + i} style={{ position: "absolute", left: c.x - L / 2, top: c.y - L / 2, width: L, height: L, transform: `scale(${entra * (1 + 0.25 * s * (1 - s))})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, backgroundColor: ok ? "#FFF6D6" : "#FFFFFF", border: borde(P, 5), boxShadow: ok ? `0 0 0 7px ${P.acento}, 0 8px 0 7px ${P.contorno}` : `0 8px 0 ${P.contorno}` }} />
            <Sprite n={ing.s} tam={L * 0.56} style={{ position: "absolute", left: L * 0.22, top: L * 0.06 }} />
            <div style={{ position: "absolute", right: -14, top: -16, padding: "0 12px", borderRadius: 14, backgroundColor: P.ui, border: borde(P, 4), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 38, ...texto(P, "#FFFFFF", 6) }}>{ing.cant}</div>
            <div style={{ position: "absolute", left: 4, right: 4, bottom: 12, textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, lineHeight: 1, color: P.texto }}>{ing.nombre}</div>
            {ok && <div style={{ position: "absolute", left: -12, top: -12, width: 50, height: 50, borderRadius: 14, backgroundColor: P.ui, border: borde(P, 4), color: "#FFFFFF", fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>✓</div>}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: geo.ys[geo.ys.length - 1] + geo.lado / 2 + 26, left: 30, right: 30, textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, color: P.texto }}>
        {r.utensilios.join(" · ")}
      </div>
      <BotonP p={P} x={BOTON_COCINAR.x} y={BOTON_COCINAR.y} w={440} texto="¡A cocinar!" icono="▶" tam={48} presionado={frame >= E.clicCocinar && frame < E.clicCocinar + 6} />
      {/* sello "¡Saca captura!" junto al botón */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: BOTON_COCINAR.y - 52,
          padding: "12px 22px",
          borderRadius: 22,
          backgroundColor: P.acento,
          border: borde(P, 5),
          boxShadow: `0 7px 0 ${P.contorno}`,
          fontFamily: FUENTES.pixel,
          fontWeight: 700,
          fontSize: 38,
          color: P.texto,
          transform: `rotate(-5deg) scale(${captura * (1 + Math.sin(frame / 8) * 0.03)})`,
        }}
      >
        📸 ¡Saca captura!
      </div>
    </AbsoluteFill>
  );
};

/* ---------- ¡Receta nueva! ---------- */

const Flores: React.FC<{ cx: number; cy: number; radio: number; n?: number }> = ({ cx, cy, radio, n = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + frame / 50;
        return (
          <Sprite
            key={i}
            n={i % 2 ? "flor" : "estrella"}
            tam={i % 2 ? 64 : 52}
            style={{ position: "absolute", left: cx + Math.cos(a) * radio - 30, top: cy + Math.sin(a) * radio * 0.62 - 30, transform: `rotate(${frame * 3 + i * 40}deg)` }}
          />
        );
      })}
    </>
  );
};

export const RecetaNueva: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const s = spring({ frame: frame - E.completada, fps, config: { damping: 10 } });
  const sello = spring({ frame: frame - E.guardada, fps, config: { damping: 9, mass: 0.8 } });
  return (
    <AbsoluteFill>
      <Vichy tam={46} color={`${P.ui}22`} fondo={P.exterior} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})` }}>
        <Encaje x={60} y={40} w={930} h={640} color={P.ui} fondo={<Vichy tam={46} color={`${P.ui}22`} fondo={P.panel} />} />
        <Flores cx={W / 2} cy={350} radio={300} />
        <PlatoReceta r={r} x={W / 2} y={350} ancho={400} alto={250} />
        <div style={{ position: "absolute", top: 482, width: "100%", textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 64, ...texto(P, P.ui, 12) }}>{r.nombre}</div>
        <div style={{ position: "absolute", top: 570, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 36, color: P.texto }}>
          Receta nº {r.numero} · ★ {r.pasos.length * 100}
        </div>
        <Cartel lineas={["¡Has conseguido", "una receta nueva!"]} tam={50} style={{ top: 10 }} />
      </div>
      <BotonP p={P} x={BOTON_GUARDAR.x} y={BOTON_GUARDAR.y} w={400} texto="Guardar" icono="♡" tam={50} presionado={frame >= E.clicGuardar && frame < E.clicGuardar + 6} />
      {frame >= E.guardada && (
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 230,
            padding: "10px 26px",
            borderRadius: 20,
            border: `9px solid ${P.uiOscuro}`,
            color: P.uiOscuro,
            backgroundColor: "#FFFFFFD9",
            fontFamily: FUENTES.pixel,
            fontWeight: 700,
            fontSize: 62,
            whiteSpace: "nowrap",
            transform: `rotate(-12deg) scale(${interpolate(sello, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, sello * 2),
          }}
        >
          ¡Guardada! ♡
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Libro de recetas ---------- */

export const Libro: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const abre = spring({ frame: frame - E.libro, fps, config: { damping: 13 } });
  const nueva = spring({ frame: frame - E.libro - 16, fps, config: { damping: 8 } });
  const pagina: React.CSSProperties = { position: "absolute", top: 58, height: 790, backgroundColor: "#FFFDF7", border: borde(P, 6), backgroundImage: `repeating-linear-gradient(transparent 0 52px, ${P.ui}1F 52px 55px)` };
  const dato: React.CSSProperties = { padding: "6px 18px", borderRadius: 16, backgroundColor: "#FFFFFF", border: borde(P, 4), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 36, color: P.texto };
  return (
    <AbsoluteFill>
      <Vichy tam={46} color={`${P.ui}22`} fondo={P.exterior} />
      <div style={{ position: "absolute", left: 24, top: 40, width: 1002, height: 830, borderRadius: 34, backgroundColor: P.ui, border: borde(P, 6), boxShadow: `0 14px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", inset: 0, transform: `scaleX(${abre})` }}>
        {/* izquierda: índice */}
        <div style={{ ...pagina, left: 40, width: 470, borderRadius: "26px 6px 6px 26px" }}>
          <div style={{ marginTop: 24, textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 50, ...texto(P, P.ui, 10) }}>Mis recetas</div>
          {Array.from({ length: 4 }, (_, i) => {
            const n = i + 1;
            const esta = n === r.numero;
            const conocida = n < r.numero;
            return (
              <div
                key={n}
                style={{
                  position: "relative",
                  margin: "26px 26px 0",
                  padding: "12px 18px",
                  borderRadius: 18,
                  border: borde(P, 4),
                  backgroundColor: esta ? "#FFF3C4" : conocida ? "#FFFFFF" : "#F1E8EC",
                  fontFamily: FUENTES.pixel,
                  fontWeight: 700,
                  color: esta || conocida ? P.texto : `${P.texto}66`,
                  boxShadow: esta ? `0 0 0 6px ${P.acento}` : undefined,
                }}
              >
                <div style={{ fontSize: 28, color: P.uiOscuro }}>Nº {n}</div>
                <div style={{ fontSize: 36, lineHeight: 1.05 }}>{esta ? r.nombre : conocida ? "· · ·" : "???"}</div>
                {esta && (
                  <div style={{ position: "absolute", right: -14, top: -18, padding: "2px 12px", borderRadius: 12, backgroundColor: P.ui, border: borde(P, 3), fontSize: 26, color: "#FFFFFF", transform: `rotate(6deg) scale(${nueva * (1 + 0.06 * Math.sin(frame / 6))})` }}>¡NUEVA!</div>
                )}
              </div>
            );
          })}
        </div>
        {/* derecha: la receta */}
        <div style={{ ...pagina, left: 540, width: 470, borderRadius: "6px 26px 26px 6px" }}>
          <div style={{ marginTop: 26, textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, color: P.uiOscuro }}>Receta nº {r.numero}</div>
          <div style={{ padding: "0 20px", textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 52, lineHeight: 1.05, ...texto(P, P.ui, 10) }}>{r.nombre}</div>
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [E.libro + 20, E.libro + 32], [0, 1], clamp) }}>
            <div style={dato}>★ {r.pasos.length * 100} puntos</div>
            <div style={dato}>⏱ {r.tiempo}</div>
            <div style={dato}>{r.porciones}</div>
          </div>
        </div>
        <PlatoReceta r={r} x={775} y={425} ancho={250} alto={230} />
      </div>
    </AbsoluteFill>
  );
};
