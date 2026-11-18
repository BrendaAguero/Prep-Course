import React from "react";
import { Composition, Folder } from "remotion";
import { VideoReceta, type VideoRecetaProps } from "./VideoReceta";
import { VideoJuego, type VideoJuegoProps } from "../RecetaJuego/VideoJuego";
import { tiemposJuego } from "../RecetaJuego/tiempos";
import { calcularTiempos, FPS } from "./tiempos";
import type { Receta } from "./tipos";
import panqueques from "./recetas/panqueques.json";
import panquequesAudio from "./recetas/panqueques.audio.json";

// Para añadir una receta: crea recetas/<id>.json, ejecuta
// scripts/generar_audio_receta.py <id> y agrégala a esta lista.
const RECETAS: { receta: Receta; duraciones: Record<string, number> }[] = [
  { receta: panqueques, duraciones: panquequesAudio },
];

export const ESTILOS_DISPONIBLES = ["casero", "moderno", "infantil"] as const;

export const RecetasCompositions: React.FC = () => (
  <Folder name="Recetas">
    {RECETAS.flatMap(({ receta, duraciones }) =>
      ESTILOS_DISPONIBLES.map((estilo) => (
        <Composition
          key={`${receta.id}-${estilo}`}
          id={`Receta-${receta.id}-${estilo}`}
          component={VideoReceta}
          durationInFrames={calcularTiempos(receta, duraciones).total}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ receta, duraciones, estilo } satisfies VideoRecetaProps}
        />
      )),
    )}
    {RECETAS.map(({ receta, duraciones }) => (
      <Composition
        key={`${receta.id}-juego`}
        id={`Receta-${receta.id}-juego`}
        component={VideoJuego}
        durationInFrames={tiemposJuego(receta, duraciones).total}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ receta, duraciones } satisfies VideoJuegoProps}
      />
    ))}
  </Folder>
);
