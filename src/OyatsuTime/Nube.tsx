import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Conejita, CONEJITA_ALTO, CONEJITA_ANCHO, type Pose } from "../CocinaDulce/disenos/Conejita";
import { Escribir } from "../CocinaDulce/Juego";
import { borde, FUENTES, P } from "./tema";

/** Cómo aparece Nube dentro de la ventana del juego. */
export type TipoAparicion = "asomada" | "batiendo" | "probando" | "celebra";
export type Aparicion = { desde: number; hasta: number; tipo: TipoAparicion; frase?: string; lado?: "izq" | "der" };

const PX = 10; // tamaño de píxel de Nube dentro de la ventana
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** ¿Está Nube visible en este frame? (para decidir el icono del panel de consejo) */
export const nubeVisible = (apariciones: Aparicion[], frame: number) => apariciones.some((a) => frame >= a.desde && frame < a.hasta);

/** Accesorio en pixel art que Nube sostiene (coordenadas de su cuadrícula). */
const Accesorio: React.FC<{ que: "batidor" | "cuchara"; frame: number }> = ({ que, frame }) => {
  const giro = que === "batidor" ? Math.sin(frame / 3) * 18 : -20 + Math.sin(frame / 8) * 6;
  return (
    <svg
      width={8 * PX}
      height={14 * PX}
      viewBox="0 0 8 14"
      shapeRendering="crispEdges"
      style={{ position: "absolute", left: 20 * PX, top: 9 * PX, transform: `rotate(${giro}deg)`, transformOrigin: "50% 80%" }}
    >
      {que === "batidor" ? (
        <>
          <rect x={3} y={9} width={2} height={5} fill={P.ui} />
          <rect x={2} y={1} width={1} height={8} fill="#C9C1C8" />
          <rect x={5} y={1} width={1} height={8} fill="#C9C1C8" />
          <rect x={3} y={0} width={2} height={1} fill="#C9C1C8" />
          <rect x={1} y={3} width={1} height={4} fill="#C9C1C8" />
          <rect x={6} y={3} width={1} height={4} fill="#C9C1C8" />
        </>
      ) : (
        <>
          <rect x={3} y={5} width={2} height={9} fill={P.maderaOscura} />
          <rect x={2} y={1} width={4} height={4} fill="#D9D3DB" />
          <rect x={3} y={2} width={2} height={2} fill="#FFF1D6" />
        </>
      )}
    </svg>
  );
};

/** Bocadillo con texto corto que se escribe letra a letra. */
export const Bocadillo: React.FC<{ texto: string; desde: number; x: number; y: number; haciaIzq?: boolean }> = ({ texto: t, desde, x, y, haciaIzq = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - desde, fps, config: { damping: 10 } });
  return (
    <div
      style={{
        position: "absolute",
        ...(haciaIzq ? { right: 1200 - x } : { left: x }),
        top: y,
        transform: `scale(${s})`,
        transformOrigin: haciaIzq ? "90% 100%" : "10% 100%",
        backgroundColor: "#FFFFFF",
        border: borde(P, 5),
        borderRadius: 24,
        padding: "10px 24px",
        fontFamily: FUENTES.pixel,
        fontWeight: 700,
        fontSize: 40,
        color: P.uiOscuro,
        whiteSpace: "nowrap",
        boxShadow: `0 6px 0 ${P.contorno}`,
      }}
    >
      <Escribir texto={t} desde={desde} vel={2} />
      <div style={{ position: "absolute", [haciaIzq ? "right" : "left"]: 30, bottom: -22, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `22px solid ${P.contorno}` }} />
      <div style={{ position: "absolute", [haciaIzq ? "right" : "left"]: 34, bottom: -14, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "16px solid #FFFFFF" }} />
    </div>
  );
};

/** Nube dentro de la ventana del juego (1200×900): entra, actúa, habla y sale. */
export const NubeEnVentana: React.FC<{ apariciones: Aparicion[] }> = ({ apariciones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = apariciones.find((x) => frame >= x.desde - 2 && frame < x.hasta + 14);
  if (!a) return null;
  const entra = spring({ frame: frame - a.desde, fps, config: { damping: 13 } });
  const sale = interpolate(frame, [a.hasta, a.hasta + 14], [0, 1], clamp);
  const ancho = CONEJITA_ANCHO * PX;
  const alto = CONEJITA_ALTO * PX;
  const der = a.lado === "der";
  // asomada: solo cabeza y hombros sobre el borde inferior; resto: cuerpo entero en la esquina
  const visibleY = a.tipo === "asomada" ? alto * 0.55 : alto * 0.98;
  const oculto = (1 - entra) + sale;
  const x = der ? 1200 - ancho - 20 + oculto * (ancho + 40) : 20 - oculto * (ancho + 40);
  const y = 900 - visibleY + (a.tipo === "celebra" ? -Math.abs(Math.sin(frame / 5)) * 26 : 0);
  const pose: Pose =
    a.tipo === "celebra" ? (Math.floor(frame / 6) % 2 ? "brazos" : "feliz") : a.tipo === "probando" ? (frame % 40 < 20 ? "feliz" : "normal") : a.tipo === "batiendo" ? "feliz" : "normal";
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: ancho, height: alto, transform: der ? "scaleX(-1)" : undefined }}>
        <Conejita p={P} px={PX} pose={pose} />
        {a.tipo === "batiendo" && <Accesorio que="batidor" frame={frame} />}
        {a.tipo === "probando" && <Accesorio que="cuchara" frame={frame} />}
      </div>
      {a.frase && frame < a.hasta && <Bocadillo texto={a.frase} desde={a.desde + 10} x={der ? x + ancho * 0.45 : x + ancho * 0.55} y={y - 90} haciaIzq={der} />}
    </>
  );
};
