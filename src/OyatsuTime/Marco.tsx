// Formato vertical 1080×1920 de おやつタイム, con la composición pensada para la zona segura de TikTok.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Destello, Lazo, Sprite } from "../CocinaDulce/Deco";
import { Conejita } from "../CocinaDulce/disenos/Conejita";
import { GRUPOS } from "../CocinaDulce/pancakes/fondos";
import { nubeVisible } from "./Nube";
import { Logo } from "./Pantallas";
import { ALTO, ANCHO, borde, FUENTES, P, texto, VOLUMEN_MUSICA, ZONAS } from "./tema";
import { pasoActual, pasoInicio, puntos, type Receta } from "./tipos";

const PapelVintage = GRUPOS.flatMap((g) => g.fondos).find((f) => f.id === 14)!.C;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const X0 = ZONAS.izquierda;
const ANCHO_UTIL = ZONAS.derecha - ZONAS.izquierda; // 900

/** Cabecera: おやつタイム + Oyatsu Time + chip con la receta. */
const Cabecera: React.FC<{ r: Receta }> = ({ r }) => (
  <div style={{ position: "absolute", left: X0, width: ANCHO_UTIL, top: ZONAS.marca.y0, height: ZONAS.marca.y1 - ZONAS.marca.y0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <Logo tam={104} romaji={40} />
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "4px 22px", borderRadius: 30, backgroundColor: P.ui, border: borde(P, 5) }}>
      <Sprite n={r.sprite} tam={38} />
      <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, ...texto(P, "#FFFFFF", 7) }}>
        Nº {r.numero} · {r.nombre}
      </div>
    </div>
  </div>
);

/** Qué dice el panel de consejo en cada momento. */
const consejo = (r: Receta, frame: number): { titulo: string; texto: string; desde: number } => {
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  if (frame >= E.completada) return { titulo: "¡Lo lograste!", texto: "Guárdala en tu libro y pruébala en casa ♡", desde: E.completada };
  if (paso >= 0) return { titulo: "Truco", texto: r.pasos[paso].truco, desde: pasoInicio(r)[paso] };
  if (frame >= E.cortina1) return { titulo: "Ingredientes", texto: `${r.porciones} · ${r.tiempo}. ¡Saca captura y ten la lista a mano!`, desde: E.cortina1 };
  return { titulo: "Receta original", texto: r.intro, desde: 0 };
};

/** Libreta pixelada (icono del consejo cuando Nube ya está en la ventana). */
const Libreta: React.FC = () => (
  <svg width={120} height={140} viewBox="0 0 12 14" shapeRendering="crispEdges">
    <rect x={1} y={0} width={10} height={14} fill={P.contorno} />
    <rect x={2} y={1} width={8} height={12} fill="#FFFDF7" />
    {[3, 5, 7, 9, 11].map((y) => (
      <rect key={y} x={3} y={y} width={6} height={1} fill={`${P.ui}88`} />
    ))}
    {[2, 5, 8].map((x) => (
      <rect key={x} x={x + 0.5} y={0} width={1} height={2} fill={P.acento} />
    ))}
    <rect x={8} y={8} width={1} height={5} fill={P.uiOscuro} transform="rotate(30 8 8)" />
  </svg>
);

const PanelConsejo: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = consejo(r, frame);
  const conNube = !nubeVisible(r.apariciones, frame);
  const entra = spring({ frame: frame - c.desde, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        left: X0,
        width: ANCHO_UTIL,
        top: ZONAS.consejo.y0,
        height: ZONAS.consejo.y1 - ZONAS.consejo.y0,
        boxSizing: "border-box",
        padding: "22px 30px 22px 190px",
        borderRadius: 34,
        backgroundColor: P.panel,
        border: borde(P, 6),
        boxShadow: `0 10px 0 ${P.contorno}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "absolute", left: 26, top: 30 }}>
        {conNube ? <Conejita p={P} px={6} pose={frame % 60 < 30 ? "feliz" : "normal"} /> : <Libreta />}
      </div>
      <div style={{ opacity: entra, transform: `translateX(${(1 - entra) * 30}px)` }}>
        <div style={{ fontFamily: FUENTES.redonda, fontSize: 40, color: P.uiOscuro, lineHeight: 1.1 }}>
          {conNube ? (c.titulo === "Truco" ? "Truco de Nube" : c.titulo) : `📝 ${c.titulo}`}
        </div>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 33, color: P.texto, marginTop: 8, lineHeight: 1.25 }}>{c.texto}</div>
      </div>
    </div>
  );
};

/** Progreso de la receta: Paso n/N + barra por pasos + puntos. */
const ProgresoReceta: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  const n = r.pasos.length;
  const fin = frame >= E.completada;
  const etiqueta = fin ? "¡Completada!" : paso >= 0 ? `Paso ${paso + 1}/${n}` : `Receta nº ${r.numero}`;
  return (
    <div style={{ position: "absolute", left: X0, width: ANCHO_UTIL, top: ZONAS.progreso.y0, height: ZONAS.progreso.y1 - ZONAS.progreso.y0, boxSizing: "border-box", padding: "16px 28px", borderRadius: 30, backgroundColor: `${P.panel}EE`, border: borde(P, 5) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 40, ...texto(P, P.ui, 7) }}>{etiqueta}</div>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 40, ...texto(P, P.acento, 7) }}>★ {puntos(r, frame)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {r.pasos.map((_, i) => {
          const hecho = fin || frame >= (E[`puntos${i}`] ?? Infinity);
          const ahora = i === paso && !hecho;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 10,
                border: borde(P, 4),
                backgroundColor: hecho ? P.ui : ahora ? (Math.floor(frame / 12) % 2 ? "#F9B9CB" : "#FFFFFF") : "#FFFFFF",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Capa de comprobación: lo que tapa la interfaz de TikTok. */
const ZonaSegura: React.FC = () => {
  const rojo = "rgba(255,0,60,0.35)";
  const etiqueta: React.CSSProperties = { position: "absolute", color: "#FFFFFF", fontFamily: "sans-serif", fontWeight: 700, fontSize: 28, textShadow: "0 0 6px #000" };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 108, backgroundColor: rojo }}>
        <div style={{ ...etiqueta, left: 20, top: 30 }}>Pestañas (108)</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 320, backgroundColor: rojo }}>
        <div style={{ ...etiqueta, left: 20, top: 20 }}>Usuario · descripción · música (320)</div>
      </div>
      <div style={{ position: "absolute", right: 0, width: 120, top: 700, bottom: 320, backgroundColor: rojo }}>
        <div style={{ ...etiqueta, right: 10, top: 10, fontSize: 22 }}>♥ 💬 ↗</div>
      </div>
      <div style={{ position: "absolute", left: ZONAS.izquierda, width: ANCHO_UTIL, top: ZONAS.marca.y0, bottom: 1920 - ZONAS.progreso.y1, border: "4px dashed #00C853" }} />
    </AbsoluteFill>
  );
};

const ruta = (a: string) => staticFile(a.includes("/") ? `audio/${a}` : `audio/cocina-juego/${a}.wav`);

const Sonidos: React.FC<{ r: Receta }> = ({ r }) => {
  const d = r.g.duracion;
  return (
    <>
      <Audio name="Música" src={staticFile("audio/kawaii/musica.mp3")} loop volume={(f) => interpolate(f, [0, 20, d - 45, d], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], clamp)} />
      <Audio src={ruta("boing-esponjoso")} from={8} name="Gancho boing" />
      <Audio src={ruta("boing-esponjoso")} from={38} volume={0.7} name="Gancho boing 2" />
      {r.g.sonidos.map((s, i) =>
        s.dur ? (
          <Sequence key={i} from={s.f} durationInFrames={s.dur} layout="none" name={s.a}>
            <Audio src={ruta(s.a)} loop volume={s.vol ?? 1} />
          </Sequence>
        ) : (
          <Audio key={i} src={ruta(s.a)} from={s.f} volume={s.vol ?? 1} name={s.a} />
        ),
      )}
    </>
  );
};

/** Video vertical completo: fondo, cabecera, ventana del juego, consejo, progreso y sonido. */
export const MarcoTikTok: React.FC<{ r: Receta; ventana: React.ReactNode; zonaSegura?: boolean }> = ({ r, ventana, zonaSegura = false }) => {
  const { x, y, escala } = ZONAS.ventana;
  return (
    <AbsoluteFill>
      <PapelVintage />
      <Lazo x={110} y={1600} tam={160} rot={-18} color={P.ui} />
      <Lazo x={760} y={1640} tam={140} rot={14} color={P.ui} />
      <Destello x={1000} y={300} tam={44} fase={2} color={P.acento} />
      <Destello x={40} y={1500} tam={36} />
      <Cabecera r={r} />
      <div style={{ position: "absolute", left: x - 14, top: y - 14, width: ANCHO * escala + 28, height: ALTO * escala + 28, borderRadius: 38, backgroundColor: "#FFFFFF", border: borde(P, 6), boxShadow: `0 12px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", left: x, top: y, width: ANCHO, height: ALTO, transform: `scale(${escala})`, transformOrigin: "0 0", borderRadius: 28 / escala, overflow: "hidden" }}>{ventana}</div>
      <PanelConsejo r={r} />
      <ProgresoReceta r={r} />
      <Sonidos r={r} />
      {zonaSegura && <ZonaSegura />}
    </AbsoluteFill>
  );
};
