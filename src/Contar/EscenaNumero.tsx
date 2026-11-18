import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Globo } from "./Globo";
import { fontFamily } from "./fuente";
import type { Numero } from "./datos";
import { PASO_CUENTA, tiemposEscena } from "./tiempos";

export const EscenaNumero: React.FC<Numero> = ({ numero, palabra, frase, color, fondo, colores }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tiemposEscena(numero);

  const numeroIn = spring({ frame: frame - t.titulo + 4, fps, config: { damping: 7, stiffness: 140 } });
  const giro = interpolate(numeroIn, [0, 1], [-30, 0]);
  const fraseIn = spring({ frame: frame - t.frase, fps, config: { damping: 14 } });

  const dosFilas = numero > 5;
  const size = numero <= 3 ? 230 : numero <= 5 ? 190 : 140;
  const filas = dosFilas
    ? [Array.from({ length: 5 }, (_, i) => i), Array.from({ length: numero - 5 }, (_, i) => i + 5)]
    : [Array.from({ length: numero }, (_, i) => i)];

  return (
    <AbsoluteFill style={{ backgroundColor: fondo, fontFamily }}>
      <Audio src={staticFile(`audio/voz/titulo-${numero}.mp3`)} from={t.titulo} name="Voz número" />
      {Array.from({ length: numero }).map((_, i) => (
        <React.Fragment key={i}>
          <Audio
            src={staticFile(`audio/voz/cuenta-${i + 1}.mp3`)}
            from={t.primerGlobo + i * PASO_CUENTA}
            name={`Voz cuenta ${i + 1}`}
          />
          <Audio
            src={staticFile("audio/pop.wav")}
            from={t.primerGlobo + i * PASO_CUENTA}
            volume={0.25}
            name={`Pop ${i + 1}`}
          />
        </React.Fragment>
      ))}
      <Audio src={staticFile(`audio/voz/frase-${numero}.mp3`)} from={t.frase} name="Voz frase" />

      <div
        style={{
          position: "absolute",
          top: dosFilas ? 30 : 60,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            fontSize: dosFilas ? 200 : 260,
            fontWeight: 700,
            color,
            lineHeight: 1,
            textShadow: "8px 8px 0 rgba(0,0,0,0.15)",
            transform: `scale(${numeroIn}) rotate(${giro}deg)`,
          }}
        >
          {numero}
        </div>
        <div
          style={{
            fontSize: dosFilas ? 120 : 150,
            fontWeight: 700,
            color: "#333",
            opacity: numeroIn,
            transform: `translateX(${(1 - numeroIn) * 80}px)`,
          }}
        >
          ¡{palabra}!
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: dosFilas ? 270 : 360,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {filas.map((fila, r) => (
          <div key={r} style={{ display: "flex", justifyContent: "center", gap: dosFilas ? 70 : 40 }}>
            {fila.map((i) => (
              <Globo
                key={i}
                color={colores ? colores[i] : color}
                numero={i + 1}
                size={size}
                fontSize={dosFilas ? 52 : 64}
                delay={t.primerGlobo + i * PASO_CUENTA}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          fontSize: 80,
          fontWeight: 600,
          color: "#333",
          opacity: fraseIn,
          transform: `translateY(${(1 - fraseIn) * 60}px) scale(${interpolate(fraseIn, [0, 1], [0.8, 1])})`,
        }}
      >
        ¡{frase}!
      </div>
    </AbsoluteFill>
  );
};
