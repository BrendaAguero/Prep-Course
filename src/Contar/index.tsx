import React from "react";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./Intro";
import { EscenaNumero } from "./EscenaNumero";
import { Final } from "./Final";
import { NUMEROS } from "./datos";

export const INTRO = 100;
export const ESCENA = 135;
export const FINAL = 150;
export const TRANSICION = 20;
export const DURACION_TOTAL = INTRO + ESCENA * NUMEROS.length + FINAL - TRANSICION * (NUMEROS.length + 1);

const transicion = (
  dir: "from-right" | "from-bottom",
) => (
  <TransitionSeries.Transition
    presentation={slide({ direction: dir })}
    timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSICION })}
  />
);

export const AprendeAContar: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Intro" durationInFrames={INTRO}>
        <Intro />
      </TransitionSeries.Sequence>
      {NUMEROS.map((n, i) => (
        <React.Fragment key={n.numero}>
          {transicion(i % 2 === 0 ? "from-right" : "from-bottom")}
          <TransitionSeries.Sequence name={`Número ${n.numero}`} durationInFrames={ESCENA}>
            <EscenaNumero {...n} />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSICION })}
      />
      <TransitionSeries.Sequence name="Final" durationInFrames={FINAL}>
        <Final />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
