import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ESTILOS, type NombreEstilo } from "./estilos";
import type { Duraciones, Receta } from "./tipos";
import { calcularTiempos, TRANSICION } from "./tiempos";
import { Cierre, Ingredientes, PasoEscena, Portada } from "./Escenas";

export type VideoRecetaProps = {
  receta: Receta;
  duraciones: Duraciones;
  estilo: NombreEstilo;
};

const VOLUMEN_MUSICA = 0.7;

export const VideoReceta: React.FC<VideoRecetaProps> = ({ receta, duraciones, estilo: nombreEstilo }) => {
  const frame = useCurrentFrame();
  const estilo = ESTILOS[nombreEstilo];
  const t = calcularTiempos(receta, duraciones);
  const timing = linearTiming({ durationInFrames: TRANSICION });

  return (
    <AbsoluteFill>
      <Audio
        name="Música"
        src={staticFile("audio/musica.mp3")}
        loop
        volume={interpolate(frame, [0, 30, t.total - 60, t.total], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Portada" durationInFrames={t.portada.total}>
          <Portada receta={receta} estilo={estilo} vozDesde={t.portada.voz} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
        <TransitionSeries.Sequence name="Ingredientes" durationInFrames={t.lista.total}>
          <Ingredientes receta={receta} estilo={estilo} tiempos={t.lista} />
        </TransitionSeries.Sequence>
        {receta.pasos.map((_, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
            <TransitionSeries.Sequence name={`Paso ${i + 1}`} durationInFrames={t.pasos[i].total}>
              <PasoEscena receta={receta} estilo={estilo} indice={i} vozDesde={t.pasos[i].voz} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Cierre" durationInFrames={t.cierre.total}>
          <Cierre receta={receta} estilo={estilo} vozDesde={t.cierre.voz} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
