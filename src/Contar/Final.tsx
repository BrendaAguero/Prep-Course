import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fuente";
import { NUMEROS } from "./datos";

const Estrella: React.FC<{ x: number; y: number; delay: number; color: string }> = ({ x, y, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 6 } });
  return (
    <svg
      width={90}
      height={90}
      viewBox="0 0 24 24"
      style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${frame * 2}deg)` }}
    >
      <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7-6.3-3.6L5.7 21l1.5-7L2 9.3l7-.8z" fill={color} />
    </svg>
  );
};

export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titulo = spring({ frame, fps, config: { damping: 7 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF4D6", fontFamily }}>
      <Estrella x={120} y={100} delay={5} color="#FFD23F" />
      <Estrella x={1680} y={140} delay={10} color="#FF5A5F" />
      <Estrella x={220} y={820} delay={15} color="#3FA9F5" />
      <Estrella x={1600} y={830} delay={20} color="#7B5CFF" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 180, fontWeight: 700, color: "#2BB673", transform: `scale(${titulo})` }}>
          ¡Muy bien!
        </div>
        <div style={{ display: "flex", gap: 60 }}>
          {NUMEROS.map((n, i) => {
            const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 8 } });
            const salto = Math.abs(Math.sin((frame - i * 6) / 8)) * -30;
            return (
              <div
                key={n.numero}
                style={{
                  fontSize: 200,
                  fontWeight: 700,
                  color: n.color,
                  textShadow: "6px 6px 0 rgba(0,0,0,0.12)",
                  transform: `scale(${s}) translateY(${frame > 50 ? salto : 0}px)`,
                }}
              >
                {n.numero}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 70, fontWeight: 600, color: "#333", opacity: spring({ frame: frame - 60, fps }) }}>
          ¡Ya sabes contar hasta cinco!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
