import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Receta } from "../Recetas/tipos";
import { ACCIONES, Generica } from "./Acciones";
import { Cocina, Emoji, MOSTRADOR_Y } from "./Cocina";
import { Hud, Instruccion, Perfecto, textoJuego } from "./Hud";
import { panel, TEMA } from "./tema";
import { PUNTOS_POR_PASO } from "./tiempos";

const voz = (id: string, clip: string) => staticFile(`audio/recetas/${id}/${clip}.mp3`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PantallaTitulo: React.FC<{ receta: Receta; vozDesde: number; click: number }> = ({ receta, vozDesde, click }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 9 } });
  const boton = spring({ frame: frame - 25, fps, config: { damping: 10 } });
  const pulso = 1 + 0.04 * Math.sin(frame / 5);
  const presionado = frame >= click && frame < click + 6 ? 0.9 : 1;
  const cursor = interpolate(frame, [click - 30, click - 4], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Cocina />
      <Audio src={voz(receta.id, "intro")} from={vozDesde} name="Voz intro" />
      <Audio src={staticFile("audio/juego/click.wav")} from={click} volume={0.6} name="Click" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, gap: 40 }}>
        <div style={{ ...textoJuego(64, TEMA.oro), opacity: logo }}>MODO COCINA</div>
        <div style={{ transform: `scale(${logo})`, textAlign: "center", padding: "0 60px" }}>
          <div style={textoJuego(118)}>{receta.titulo}</div>
          {receta.subtitulo && <div style={{ ...textoJuego(90, TEMA.naranja), marginTop: 12 }}>{receta.subtitulo}</div>}
        </div>
        <div style={{ display: "flex", gap: 22, opacity: logo }}>
          {[`⏱ ${receta.tiempo}`, `🍽 ${receta.porciones}`, `⭐ ${receta.dificultad}`].map((t) => (
            <div key={t} style={panel({ padding: "12px 26px", borderRadius: 24, fontFamily: TEMA.fuenteTexto, fontWeight: 800, fontSize: 38, color: TEMA.texto })}>
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Emoji e={receta.emoji} x={540} y={MOSTRADOR_Y - 190 - Math.abs(Math.sin(frame / 10)) * 30} size={380} />
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 240,
          right: 240,
          transform: `scale(${boton * pulso * presionado})`,
          ...panel({ backgroundColor: TEMA.verde, padding: "30px 0", textAlign: "center" }),
          ...textoJuego(96),
        }}
      >
        ▶ COCINAR
      </div>
      {cursor > 0 && (
        <Emoji e="👆" x={interpolate(cursor, [0, 1], [900, 600])} y={interpolate(cursor, [0, 1], [1850, 1640])} size={150} />
      )}
    </AbsoluteFill>
  );
};

export const PantallaInventario: React.FC<{ receta: Receta; vozDesde: number; items: number[] }> = ({ receta, vozDesde, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titulo = spring({ frame, fps, config: { damping: 10 } });
  const huecos = Math.max(6, Math.ceil(receta.ingredientes.length / 3) * 3);
  return (
    <AbsoluteFill>
      <Cocina />
      <Hud titulo={receta.titulo} emoji={receta.emoji} puntos={0} pasoActual={-1} totalPasos={receta.pasos.length} />
      <Audio src={voz(receta.id, "ingredientes")} from={vozDesde} name="Voz ingredientes" />
      <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", transform: `scale(${titulo})`, ...textoJuego(100, TEMA.oro) }}>
        INGREDIENTES
      </div>
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 60,
          right: 60,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 30,
          ...panel({ padding: 34, backgroundColor: "#E9DCC6" }),
        }}
      >
        {Array.from({ length: huecos }).map((_, i) => {
          const ing = receta.ingredientes[i];
          const s = ing ? spring({ frame: frame - items[i], fps, config: { damping: 9 } }) : 0;
          return (
            <div
              key={i}
              style={{
                height: 300,
                borderRadius: 24,
                border: `5px solid ${TEMA.borde}`,
                backgroundColor: s > 0.01 ? TEMA.panel : "#D6C7AE",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 12,
                gap: 6,
              }}
            >
              {ing && s > 0.01 && (
                <>
                  <div style={{ fontSize: 120, transform: `scale(${s})` }}>{ing.emoji}</div>
                  <div style={{ fontFamily: TEMA.fuenteTexto, fontWeight: 800, fontSize: 32, color: TEMA.texto, textAlign: "center", lineHeight: 1.1, opacity: s }}>
                    {ing.texto}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {receta.ingredientes.map((_, i) => (
        <React.Fragment key={i}>
          <Audio src={voz(receta.id, `ingrediente-${i + 1}`)} from={items[i]} name={`Voz ingrediente ${i + 1}`} />
          <Audio src={staticFile("audio/pop.wav")} from={items[i]} volume={0.3} name={`Pop ${i + 1}`} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

export const PantallaPaso: React.FC<{
  receta: Receta;
  indice: number;
  vozDesde: number;
  accion: number;
  perfecto: number;
}> = ({ receta, indice, vozDesde, accion, perfecto }) => {
  const frame = useCurrentFrame();
  const paso = receta.pasos[indice];
  const Accion = (paso.accion && ACCIONES[paso.accion]) || Generica;
  const colorPrevio = receta.pasos.slice(0, indice).reverse().find((p) => p.color)?.color;
  const puntos = indice * PUNTOS_POR_PASO + interpolate(frame, [perfecto + 10, perfecto + 35], [0, PUNTOS_POR_PASO], clamp);
  return (
    <AbsoluteFill>
      <Cocina />
      <Audio src={voz(receta.id, `paso-${indice + 1}`)} from={vozDesde} name={`Voz paso ${indice + 1}`} />
      <Accion paso={paso} desde={vozDesde} duracion={accion} colorPrevio={colorPrevio} />
      <Hud
        titulo={receta.titulo}
        emoji={receta.emoji}
        puntos={puntos}
        pasoActual={indice}
        totalPasos={receta.pasos.length}
        completado={frame >= perfecto}
      />
      <Instruccion paso={indice + 1} texto={paso.texto} nota={paso.nota} desde={vozDesde} />
      <Perfecto desde={perfecto} />
    </AbsoluteFill>
  );
};

export const PantallaResultados: React.FC<{ receta: Receta; vozDesde: number }> = ({ receta, vozDesde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = receta.pasos.length * PUNTOS_POR_PASO;
  const banner = spring({ frame, fps, config: { damping: 9 } });
  const estrellas = [20, 34, 48];
  const puntos = interpolate(frame, [55, 95], [0, total], clamp);
  const cta = spring({ frame: frame - vozDesde - 40, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Cocina />
      <Audio src={staticFile("audio/juego/fanfarria.wav")} from={2} volume={0.5} name="Fanfarria" />
      {estrellas.map((d, i) => (
        <Audio key={i} src={staticFile("audio/juego/ding.wav")} from={d} volume={0.35} name={`Estrella ${i + 1}`} />
      ))}
      <Audio src={voz(receta.id, "cierre")} from={vozDesde} name="Voz cierre" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <div style={{ transform: `scale(${banner}) rotate(-3deg)`, textAlign: "center" }}>
          <div style={textoJuego(120, TEMA.oro)}>¡RECETA</div>
          <div style={textoJuego(120, TEMA.oro)}>COMPLETADA!</div>
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: 50 }}>
          {estrellas.map((d, i) => {
            const s = spring({ frame: frame - d, fps, config: { damping: 7 } });
            return (
              <div key={i} style={{ fontSize: i === 1 ? 190 : 150, transform: `scale(${s}) translateY(${i === 1 ? -30 : 0}px)` }}>
                ⭐
              </div>
            );
          })}
        </div>
        <div style={{ ...panel({ padding: "20px 50px", marginTop: 40, backgroundColor: TEMA.oro }), ...textoJuego(80) }}>
          {Math.round(puntos)} PTS
        </div>
      </AbsoluteFill>
      <Emoji e={receta.emoji} x={540} y={MOSTRADOR_Y - 150 - Math.abs(Math.sin(frame / 10)) * 25} size={330} />
      <div
        style={{
          position: "absolute",
          top: 1530,
          left: 70,
          right: 70,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 100}px)`,
          textAlign: "center",
          ...panel({ padding: "34px 30px" }),
          fontFamily: TEMA.fuenteTexto,
          fontWeight: 800,
          fontSize: 46,
          color: TEMA.texto,
        }}
      >
        💾 Guarda la receta y ¡a cocinar!
      </div>
    </AbsoluteFill>
  );
};
