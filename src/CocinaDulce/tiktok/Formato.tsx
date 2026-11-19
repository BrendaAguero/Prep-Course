import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Destello, Lazo, Sprite } from "../Deco";
import { C } from "../tema";
import { Conejita } from "../disenos/Conejita";
import { borde, texto } from "../disenos/Escenas";
import { PALETAS } from "../disenos/paletas";
import { GRUPOS } from "../pancakes/fondos";
import { G, PASO_INICIO, PASOS } from "./guion";
import { ALTO, ANCHO, pasoActual, VentanaTikTok } from "./Ventana";

const P = PALETAS.find((x) => x.id === "A")!;
const PapelVintage = GRUPOS.flatMap((g) => g.fondos).find((f) => f.id === 14)!.C;
const E = G.ev;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VOLUMEN_MUSICA = 0.3;

const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = pasoActual(frame);
  let titulo = "Receta original japonesa ✿";
  let cuerpo = "Esponjosos, altos y temblorosos.";
  let inicio = 0;
  if (frame >= E.cortina1 && frame < E.cortina2) {
    titulo = "Ingredientes";
    cuerpo = "Para 3 pancakes · 45 min en total.";
    inicio = E.cortina1;
  } else if (paso >= 0) {
    titulo = `Paso ${paso + 1}/9 · ${PASOS[paso].titulo}`;
    cuerpo = PASOS[paso].truco;
    inicio = PASO_INICIO[paso];
  } else if (frame >= E.completada) {
    titulo = "¡Lo lograste!";
    cuerpo = "Guárdala para tu próximo desayuno 💾";
    inicio = E.completada;
  }
  const entra = spring({ frame: frame - inicio, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1330,
        minHeight: 250,
        padding: "26px 32px 26px 200px",
        borderRadius: 36,
        backgroundColor: P.panel,
        border: borde(P, 6),
        boxShadow: `0 10px 0 ${P.contorno}`,
      }}
    >
      <Conejita p={P} px={7} pose={frame % 60 < 30 ? "feliz" : "normal"} style={{ position: "absolute", left: 20, top: 40 }} />
      <div style={{ opacity: entra, transform: `translateX(${(1 - entra) * 30}px)` }}>
        <div style={{ fontFamily: C.redonda, fontSize: 44, color: P.uiOscuro, lineHeight: 1.1 }}>{titulo}</div>
        <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 32, color: P.texto, marginTop: 10, lineHeight: 1.3 }}>{cuerpo}</div>
      </div>
    </div>
  );
};

const juego = (n: string) => staticFile(`audio/cocina-juego/${n}.wav`);
const kawaii = (n: string) => staticFile(`audio/kawaii/${n}`);

const Sonidos: React.FC = () => (
  <>
    <Audio
      name="Música"
      src={kawaii("musica.mp3")}
      loop
      volume={(f) => interpolate(f, [0, 20, G.duracion - 45, G.duracion], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], clamp)}
    />
    <Audio src={juego("boing-esponjoso")} from={8} name="Gancho boing" />
    <Audio src={juego("boing-esponjoso")} from={38} volume={0.7} name="Gancho boing 2" />
    <Audio src={kawaii("click.wav")} from={E.clicJugar} volume={0.4} name="Clic jugar" />
    <Audio src={kawaii("click.wav")} from={E.clicCocinar} volume={0.4} name="Clic cocinar" />
    {G.sonidos.map((s, i) =>
      s.dur ? (
        <Sequence key={i} from={s.f} durationInFrames={s.dur} layout="none" name={s.a}>
          <Audio src={juego(s.a)} loop volume={s.vol ?? 1} />
        </Sequence>
      ) : (
        <Audio key={i} src={juego(s.a)} from={s.f} volume={s.vol ?? 1} name={s.a} />
      ),
    )}
  </>
);

export const PancakesTikTok: React.FC = () => {
  const escala = 0.86;
  const x = (1080 - ANCHO * escala) / 2;
  const y = 520;
  return (
    <AbsoluteFill>
      <PapelVintage />
      <Lazo x={130} y={250} tam={180} rot={-18} color={P.ui} />
      <Lazo x={950} y={250} tam={180} rot={18} color={P.ui} />
      <div style={{ position: "absolute", top: 205, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: C.redonda, fontSize: 96, lineHeight: 1, ...texto(P, "#FFFFFF", 14) }}>Fuwa Fuwa Kitchen</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 14, padding: "6px 24px", borderRadius: 30, backgroundColor: P.ui, border: borde(P, 5) }}>
          <Sprite n="huevo" tam={40} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 34, ...texto(P, "#FFFFFF", 7) }}>Pancakes japoneses</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: x - 18, top: y - 18, width: ANCHO * escala + 36, height: ALTO * escala + 36, borderRadius: 44, backgroundColor: "#FFFFFF", border: borde(P, 7), boxShadow: `0 14px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", left: x, top: y, width: ANCHO, height: ALTO, transform: `scale(${escala})`, transformOrigin: "0 0", borderRadius: 30 / escala, overflow: "hidden" }}>
        <VentanaTikTok p={P} />
      </div>
      <Panel />
      <Destello x={990} y={470} tam={50} fase={2} color={P.acento} />
      <Destello x={90} y={470} tam={40} />
      <Sonidos />
    </AbsoluteFill>
  );
};

export const PancakesTikTokComposition: React.FC = () => (
  <Composition id="TikTok-pancakes-japoneses" component={PancakesTikTok} durationInFrames={G.duracion} fps={30} width={1080} height={1920} />
);
