import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, Folder, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Destello, Lazo, Sprite } from "../Deco";
import { C } from "../tema";
import { Conejita } from "../disenos/Conejita";
import { borde, texto } from "../disenos/Escenas";
import { PALETAS, type Paleta } from "../disenos/paletas";
import { ALTO, ANCHO, VentanaPancakes } from "./Ventana";
import { DURACION, FPS, T } from "./tiempos";

// Paleta elegida: A · Fresa y crema
const P: Paleta = PALETAS.find((x) => x.id === "A")!;
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

const Fondo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.exterior, backgroundImage: P.exteriorPatron, backgroundSize: P.exteriorTam, backgroundPosition: "0 0, 28px 28px" }} />
);

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
        border: borde(P, 7),
        boxShadow: `0 14px 0 ${P.contorno}`,
      }}
    />
    <div style={{ position: "absolute", left: x, top: y, width: ANCHO, height: ALTO, transform: `scale(${escala})`, transformOrigin: "0 0", borderRadius: 30 / escala, overflow: "hidden" }}>
      <VentanaPancakes p={P} />
    </div>
  </>
);

export const Horizontal: React.FC = () => {
  const frame = useCurrentFrame();
  const escala = 1.08;
  const x = (1920 - ANCHO * escala) / 2;
  const y = (1080 - ALTO * escala) / 2 - 6;
  return (
    <AbsoluteFill>
      <Fondo />
      <Lazo x={150} y={130} tam={220} rot={-18} color={P.ui} />
      <Lazo x={1770} y={130} tam={220} rot={18} color={P.ui} />
      <Destello x={140} y={560} tam={70} color={P.acento} />
      <Destello x={1790} y={480} tam={70} fase={2} />
      <Destello x={1760} y={700} tam={46} fase={1} color={P.acento} />
      <Conejita p={P} px={7} pose={Math.floor(frame / 15) % 3 === 0 ? "feliz" : "normal"} style={{ position: "absolute", left: 60, top: 820 }} />
      <Pantalla x={x} y={y} escala={escala} />
      <Musica />
    </AbsoluteFill>
  );
};

const ListaTareas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1335,
        padding: "22px 36px",
        borderRadius: 36,
        backgroundColor: P.panel,
        border: borde(P, 6),
        boxShadow: `0 10px 0 ${P.contorno}`,
        opacity: frame >= T.cortina - 30 ? 1 : 0.6,
      }}
    >
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 36, color: P.ui, marginBottom: 6 }}>♡ Tareas</div>
      {T.pasos.map((ps, i) => {
        const hecho = frame >= ps.fin;
        const actual = !hecho && frame >= ps.banner;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: C.pixel, fontWeight: 700, fontSize: 32, color: hecho ? "#B79AA8" : P.texto, textDecoration: hecho ? "line-through" : "none", margin: "3px 0" }}>
            <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, border: borde(P, 5), backgroundColor: hecho ? P.ui : actual ? P.acento : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#FFFFFF" }}>
              {hecho ? "✓" : ""}
            </div>
            {ps.texto}
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
      <Fondo />
      <Lazo x={130} y={240} tam={190} rot={-18} color={P.ui} />
      <Lazo x={950} y={240} tam={190} rot={18} color={P.ui} />
      <div style={{ position: "absolute", top: 200, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: C.redonda, fontSize: 110, lineHeight: 1, ...texto(P, "#FFFFFF", 16) }}>Cocina Dulce</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 14, padding: "6px 26px", borderRadius: 30, backgroundColor: P.ui, border: borde(P, 5) }}>
          <Sprite n="huevo" tam={40} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 36, ...texto(P, "#FFFFFF", 7) }}>Pancakes japoneses</div>
        </div>
      </div>
      <Pantalla x={x} y={510} escala={escala} />
      <ListaTareas />
      <Destello x={990} y={470} tam={56} fase={2} color={P.acento} />
      <Destello x={90} y={470} tam={44} />
      <Musica />
    </AbsoluteFill>
  );
};

export const PancakesCompositions: React.FC = () => (
  <Folder name="Cocina-Dulce-pancakes">
    <Composition id="CocinaDulce-pancakes-vertical" component={Vertical} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
    <Composition id="CocinaDulce-pancakes-horizontal" component={Horizontal} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
  </Folder>
);
