import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, Folder, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Destello, Lazo, Sprite, Vichy } from "./Deco";
import { ALTO, ANCHO, VentanaJuego } from "./Juego";
import { C, contorno } from "./tema";
import { DURACION, FPS, T } from "./tiempos";

const VOLUMEN_MUSICA = 1;

const Musica: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Audio
      name="Música"
      src={staticFile("audio/kawaii/musica.mp3")}
      loop
      volume={interpolate(frame, [0, 20, DURACION - 45, DURACION], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  );
};

/** La ventana del juego con marco de "consola", escalada y colocada. */
const Pantalla: React.FC<{ x: number; y: number; escala: number }> = ({ x, y, escala }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x - 18,
        top: y - 18,
        width: ANCHO * escala + 36,
        height: ALTO * escala + 36,
        borderRadius: 44,
        backgroundColor: "#FFFFFF",
        border: `7px solid ${C.contorno}`,
        boxShadow: `0 14px 0 ${C.contorno}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: ANCHO,
        height: ALTO,
        transform: `scale(${escala})`,
        transformOrigin: "0 0",
        borderRadius: 30 / escala,
        overflow: "hidden",
      }}
    >
      <VentanaJuego />
    </div>
  </>
);

const Cintas: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -300, top: 120, width: 900, height: 110, backgroundColor: C.rosa, border: `5px solid ${C.contorno}`, transform: "rotate(-35deg)" }} />
    <div style={{ position: "absolute", right: -300, bottom: 140, width: 900, height: 110, backgroundColor: C.rosa, border: `5px solid ${C.contorno}`, transform: "rotate(-35deg)" }} />
  </>
);

export const Horizontal: React.FC = () => {
  const escala = 1.08;
  const x = (1920 - ANCHO * escala) / 2;
  const y = (1080 - ALTO * escala) / 2 - 6;
  return (
    <AbsoluteFill>
      <Vichy tam={90} />
      <Cintas />
      <Lazo x={150} y={120} tam={230} rot={-20} />
      <Lazo x={1770} y={960} tam={230} rot={20} />
      <Destello x={140} y={600} tam={70} />
      <Destello x={1790} y={300} tam={80} fase={2} />
      <Destello x={200} y={900} tam={50} fase={4} color={C.amarillo} />
      <Destello x={1740} y={620} tam={50} fase={1} color={C.amarillo} />
      <Pantalla x={x} y={y} escala={escala} />
      <Musica />
    </AbsoluteFill>
  );
};

const ListaTareas: React.FC = () => {
  const frame = useCurrentFrame();
  const enJuego = frame >= T.cortina - 30;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1345,
        padding: "26px 40px",
        borderRadius: 36,
        backgroundColor: "#FFFFFF",
        border: `6px solid ${C.contorno}`,
        boxShadow: `0 10px 0 ${C.contorno}`,
        opacity: enJuego ? 1 : 0.6,
      }}
    >
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 40, color: C.rosaFuerte, marginBottom: 10 }}>♡ Tareas</div>
      {T.pasos.map((p, i) => {
        const hecho = frame >= p.fin;
        const actual = !hecho && frame >= p.banner;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: C.pixel, fontWeight: 700, fontSize: 36, color: hecho ? "#B79AA8" : C.texto, textDecoration: hecho ? "line-through" : "none", margin: "4px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, border: `5px solid ${C.contorno}`, backgroundColor: hecho ? C.menta : actual ? C.amarillo : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.contorno, textDecoration: "none" }}>
              {hecho ? "✓" : ""}
            </div>
            {p.texto}
          </div>
        );
      })}
    </div>
  );
};

export const Vertical: React.FC = () => {
  const escala = 0.86;
  const x = (1080 - ANCHO * escala) / 2;
  return (
    <AbsoluteFill>
      <Vichy tam={90} />
      <Cintas />
      <Lazo x={140} y={250} tam={200} rot={-20} />
      <Lazo x={940} y={250} tam={200} rot={20} />
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: C.redonda, fontSize: 110, lineHeight: 1, ...contorno("#FFFFFF", 16) }}>Cocina Dulce</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 14, padding: "6px 26px", borderRadius: 30, backgroundColor: C.rosaFuerte, border: `5px solid ${C.contorno}` }}>
          <Sprite n="fresa" tam={44} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 40, ...contorno("#FFFFFF", 7) }}>Receta nº 1</div>
        </div>
      </div>
      <Pantalla x={x} y={520} escala={escala} />
      <ListaTareas />
      <Destello x={100} y={1350} tam={60} />
      <Destello x={990} y={480} tam={60} fase={2} color={C.amarillo} />
      <Musica />
    </AbsoluteFill>
  );
};

export const CocinaDulceCompositions: React.FC = () => (
  <Folder name="Cocina-Dulce">
    <Composition id="CocinaDulce-tostada-vertical" component={Vertical} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
    <Composition id="CocinaDulce-tostada-horizontal" component={Horizontal} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
  </Folder>
);
