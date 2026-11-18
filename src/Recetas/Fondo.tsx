import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Estilo } from "./estilos";

const CONFETI = ["#FF5A5F", "#3FA9F5", "#2BB673", "#F5B700", "#7B5CFF"];

export const Fondo: React.FC<{ readonly estilo: Estilo }> = ({ estilo }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: estilo.fondo, overflow: "hidden" }}>
      {estilo.patron === "puntos" && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(${estilo.acento}22 3px, transparent 3px)`,
            backgroundSize: "48px 48px",
            backgroundPosition: `0 ${frame * 0.4}px`,
          }}
        />
      )}
      {estilo.patron === "ninguno" && (
        <AbsoluteFill
          style={{ background: `radial-gradient(circle at 50% 35%, ${estilo.acento}18, transparent 60%)` }}
        />
      )}
      {estilo.patron === "confeti" &&
        Array.from({ length: 18 }).map((_, i) => {
          const x = (i * 197) % 1080;
          const y = ((i * 331 + frame * (1 + (i % 3))) % 2100) - 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 22,
                height: 22,
                borderRadius: i % 2 ? 11 : 4,
                backgroundColor: CONFETI[i % CONFETI.length],
                opacity: 0.35,
                transform: `rotate(${frame * 2 + i * 20}deg)`,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
