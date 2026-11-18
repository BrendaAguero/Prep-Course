import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Duraciones, Receta } from "../Recetas/tipos";
import { PantallaInventario, PantallaPaso, PantallaResultados, PantallaTitulo } from "./Pantallas";
import { tiemposJuego, TRANSICION } from "./tiempos";

export type VideoJuegoProps = { receta: Receta; duraciones: Duraciones };

const VOLUMEN_MUSICA = 0.5;

export const VideoJuego: React.FC<VideoJuegoProps> = ({ receta, duraciones }) => {
  const frame = useCurrentFrame();
  const t = tiemposJuego(receta, duraciones);
  const timing = linearTiming({ durationInFrames: TRANSICION });
  return (
    <AbsoluteFill>
      <Audio
        name="Música"
        src={staticFile("audio/juego/musica.mp3")}
        loop
        volume={interpolate(frame, [0, 20, t.total - 60, t.total], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Título" durationInFrames={t.titulo.total}>
          <PantallaTitulo receta={receta} vozDesde={t.titulo.voz} click={t.titulo.click} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Ingredientes" durationInFrames={t.inventario.total}>
          <PantallaInventario receta={receta} vozDesde={t.inventario.voz} items={t.inventario.items} />
        </TransitionSeries.Sequence>
        {receta.pasos.map((_, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
            <TransitionSeries.Sequence name={`Paso ${i + 1}`} durationInFrames={t.pasos[i].total}>
              <PantallaPaso
                receta={receta}
                indice={i}
                vozDesde={t.pasos[i].voz}
                accion={t.pasos[i].accion}
                perfecto={t.pasos[i].perfecto}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Resultados" durationInFrames={t.resultados.total}>
          <PantallaResultados receta={receta} vozDesde={t.resultados.voz} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
