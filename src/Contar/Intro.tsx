import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fuente";
import { Globo } from "./Globo";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titulo = spring({ frame, fps, config: { damping: 8 } });
  const sub = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const sol = frame * 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: "#BDE7FF", fontFamily }}>
      <svg
        width={260}
        height={260}
        viewBox="0 0 100 100"
        style={{ position: "absolute", top: 40, right: 80, transform: `rotate(${sol}deg)` }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={48} y={2} width={4} height={16} rx={2} fill="#FFB400" transform={`rotate(${i * 30} 50 50)`} />
        ))}
        <circle cx={50} cy={50} r={28} fill="#FFD23F" />
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontSize: 170,
            fontWeight: 700,
            color: "#FF5A5F",
            textShadow: "8px 8px 0 #fff",
            transform: `scale(${titulo})`,
          }}
        >
          ¡Aprendamos a contar!
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 600,
            color: "#2D3A8C",
            opacity: sub,
            transform: `translateY(${(1 - sub) * 40}px)`,
          }}
        >
          Del 1 al 5 con globos
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 40, left: 80 }}>
        <Globo color="#FF5A5F" numero={1} delay={10} size={150} />
      </div>
      <div style={{ position: "absolute", bottom: 40, right: 80 }}>
        <Globo color="#7B5CFF" numero={5} delay={16} size={150} />
      </div>
    </AbsoluteFill>
  );
};
