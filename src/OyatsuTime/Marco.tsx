// Formato vertical 1080×1920 de おやつタイム, con la composición pensada para la zona segura de TikTok.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sprite } from "../CocinaDulce/Deco";
import { Conejita } from "../CocinaDulce/disenos/Conejita";
import { Fondo } from "./Fondo";
import { VISTA } from "./posiciones";
import { nubeVisible } from "./Nube";
import { borde, FUENTES, P, texto, VOLUMEN_MUSICA, ZONAS } from "./tema";
import { pasoActual, pasoInicio, puntos, type Receta } from "./tipos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const X0 = ZONAS.izquierda;
const ANCHO_UTIL = ZONAS.derecha - ZONAS.izquierda; // 900

/** Logo pixel art (public/logo/oyatsu-time.png, 292×99) escalado sin suavizar. */
export const LogoPixel: React.FC<{ escala: number; style?: React.CSSProperties }> = ({ escala, style }) => (
  <Img src={staticFile("logo/oyatsu-time.png")} style={{ width: 292 * escala, height: 99 * escala, imageRendering: "pixelated", ...style }} />
);

/** Cabecera: logo おやつタイム + etiqueta de la receta al lado. */
const Cabecera: React.FC<{ r: Receta }> = ({ r }) => (
  <div style={{ position: "absolute", left: X0 - 10, width: ANCHO_UTIL + 20, top: ZONAS.marca.y0, height: ZONAS.marca.y1 - ZONAS.marca.y0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <LogoPixel escala={2} />
    <div style={{ width: 280, padding: "12px 16px", borderRadius: 26, backgroundColor: P.panel, border: borde(P, 5), boxShadow: `0 7px 0 ${P.contorno}`, textAlign: "center", transform: "rotate(3deg)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "2px 16px", borderRadius: 20, backgroundColor: P.ui, border: borde(P, 4), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 30, ...texto(P, "#FFFFFF", 6) }}>
        <Sprite n={r.sprite} tam={30} />
        Nº {r.numero}
      </div>
      <div style={{ marginTop: 8, fontFamily: FUENTES.redonda, fontSize: 34, lineHeight: 1.05, color: P.uiOscuro }}>{r.nombre}</div>
    </div>
  </div>
);

/** Qué dice el panel de consejo en cada momento. */
const consejo = (r: Receta, frame: number): { titulo: string; texto: string; desde: number } => {
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  if (frame >= E.cortina3) return { titulo: "¡Hasta la próxima!", texto: "Guarda el video y hazla en casa ♡", desde: E.cortina3 };
  if (frame >= E.completada) return { titulo: "¡Lo lograste!", texto: "Guárdala en tu libro de recetas ♡", desde: E.completada };
  if (paso >= 0) return { titulo: "Truco", texto: r.pasos[paso].truco, desde: pasoInicio(r)[paso] };
  if (frame >= E.cortina1) return { titulo: "Truco", texto: r.consejoIngredientes, desde: E.cortina1 };
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
        padding: "18px 30px 18px 180px",
        borderRadius: 30,
        backgroundColor: P.panel,
        border: borde(P, 4),
        boxShadow: `0 5px 0 ${P.contorno}55`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)" }}>
        {conNube ? <Conejita p={P} px={6} pose={frame % 60 < 30 ? "feliz" : "normal"} /> : <Libreta />}
      </div>
      <div style={{ opacity: entra, transform: `translateX(${(1 - entra) * 30}px)` }}>
        <div style={{ fontFamily: FUENTES.redonda, fontSize: 38, color: P.uiOscuro, lineHeight: 1.1 }}>
          {conNube && c.titulo === "Truco" ? "Truco de Nube" : c.titulo}
        </div>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 36, color: P.texto, marginTop: 6, lineHeight: 1.2 }}>{c.texto}</div>
      </div>
    </div>
  );
};

/** Progreso de la receta: Paso n/N + barra por pasos + puntos. */
const ProgresoReceta: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  const n = r.pasos.length;
  const fin = frame >= E.completada;
  if (frame < E.cortina2) return null; // solo cuando empiezan los pasos
  const entra = spring({ frame: frame - E.cortina2, fps, config: { damping: 14 } });
  const etiqueta = fin ? "¡Completada!" : `Paso ${paso + 1} de ${n}`;
  return (
    <div style={{ position: "absolute", left: X0, width: ANCHO_UTIL, top: ZONAS.progreso.y0, height: ZONAS.progreso.y1 - ZONAS.progreso.y0, boxSizing: "border-box", padding: "12px 26px", borderRadius: 28, backgroundColor: `${P.panel}F2`, border: borde(P, 4), opacity: entra, transform: `translateY(${(1 - entra) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 40, color: P.uiOscuro }}>{etiqueta}</div>
        <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 40, color: P.texto }}>★ {puntos(r, frame)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {r.pasos.map((_, i) => {
          const hecho = fin || frame >= (E[`puntos${i}`] ?? Infinity);
          const ahora = i === paso && !hecho;
          return <div key={i} style={{ flex: 1, height: 30, borderRadius: 10, border: borde(P, 4), backgroundColor: hecho ? P.ui : ahora ? (Math.floor(frame / 12) % 2 ? "#F9B9CB" : "#FFFFFF") : "#FFFFFF" }} />;
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
      <div style={{ position: "absolute", right: 0, width: 100, top: 700, bottom: 320, backgroundColor: rojo }}>
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
      <Fondo />
      <Cabecera r={r} />
      <div style={{ position: "absolute", left: x - 14, top: y - 14, width: VISTA.ancho * escala + 28, height: VISTA.alto * escala + 28, borderRadius: 38, backgroundColor: "#FFFFFF", border: borde(P, 6), boxShadow: `0 12px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", left: x, top: y, width: VISTA.ancho, height: VISTA.alto, transform: `scale(${escala})`, transformOrigin: "0 0", borderRadius: 28 / escala, overflow: "hidden" }}>{ventana}</div>
      <PanelConsejo r={r} />
      <ProgresoReceta r={r} />
      <Sonidos r={r} />
      {zonaSegura && <ZonaSegura />}
    </AbsoluteFill>
  );
};
