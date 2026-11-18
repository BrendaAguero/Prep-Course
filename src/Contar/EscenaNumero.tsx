import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Globo } from "./Globo";
import { fontFamily } from "./fuente";

export const EscenaNumero: React.FC<{
  readonly numero: number;
  readonly palabra: string;
  readonly frase: string;
  readonly color: string;
  readonly fondo: string;
}> = ({ numero, palabra, frase, color, fondo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numeroIn = spring({ frame, fps, config: { damping: 7, stiffness: 140 } });
  const giro = interpolate(numeroIn, [0, 1], [-30, 0]);
  const inicioGlobos = 18;
  const pasoGlobos = 12;
  const fraseIn = spring({
    frame: frame - (inicioGlobos + numero * pasoGlobos + 6),
    fps,
    config: { damping: 14 },
  });
  const size = numero <= 3 ? 230 : 190;

  return (
    <AbsoluteFill style={{ backgroundColor: fondo, fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            fontSize: 260,
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
            fontSize: 150,
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
          top: 360,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {Array.from({ length: numero }).map((_, i) => (
          <Globo
            key={i}
            color={color}
            numero={i + 1}
            size={size}
            delay={inicioGlobos + i * pasoGlobos}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          textAlign: "center",
          fontSize: 80,
          fontWeight: 600,
          color: "#333",
          opacity: fraseIn,
          transform: `translateY(${(1 - fraseIn) * 60}px)`,
        }}
      >
        {frase}
      </div>
    </AbsoluteFill>
  );
};
