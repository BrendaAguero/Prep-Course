import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Intro } from "./Intro";
import { EscenaNumero } from "./EscenaNumero";
import { Final } from "./Final";
import { NUMEROS } from "./datos";
import { DURACION_TOTAL, FINAL, INTRO, TRANSICION, tiemposEscena } from "./tiempos";

export { DURACION_TOTAL };

const VOLUMEN_MUSICA = 0.7;

export const AprendeAContar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Audio
        name="Música"
        src={staticFile("audio/musica.mp3")}
        loop
        volume={interpolate(
          frame,
          [0, 30, DURACION_TOTAL - 60, DURACION_TOTAL],
          [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={INTRO}>
          <Intro />
        </TransitionSeries.Sequence>
        {NUMEROS.map((n, i) => (
          <React.Fragment key={n.numero}>
            <TransitionSeries.Transition
              presentation={slide({ direction: i % 2 === 0 ? "from-right" : "from-bottom" })}
              timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSICION })}
            />
            <TransitionSeries.Sequence name={`Número ${n.numero}`} durationInFrames={tiemposEscena(n.numero).total}>
              <EscenaNumero {...n} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSICION })} />
        <TransitionSeries.Sequence name="Final" durationInFrames={FINAL}>
          <Final />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
