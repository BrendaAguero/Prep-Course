import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fuente";
import { NUMEROS } from "./datos";
import { FINAL_B, FINAL_CUENTA, FINAL_PASO } from "./tiempos";

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
  const cierre = spring({ frame: frame - FINAL_B, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF4D6", fontFamily }}>
      <Audio src={staticFile("audio/voz/final-a.mp3")} from={12} name="Voz muy bien" />
      {NUMEROS.map((n, i) => (
        <Audio
          key={n.numero}
          src={staticFile(`audio/voz/cuenta-${n.numero}.mp3`)}
          from={FINAL_CUENTA + i * FINAL_PASO}
          name={`Voz final ${n.numero}`}
        />
      ))}
      <Audio src={staticFile("audio/voz/final-b.mp3")} from={FINAL_B} name="Voz despedida" />

      <Estrella x={120} y={100} delay={5} color="#FFD23F" />
      <Estrella x={1680} y={140} delay={10} color="#FF5A5F" />
      <Estrella x={220} y={850} delay={15} color="#3FA9F5" />
      <Estrella x={1600} y={860} delay={20} color="#7B5CFF" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <div style={{ fontSize: 170, fontWeight: 700, color: "#2BB673", transform: `scale(${titulo})` }}>
          ¡Muy bien!
        </div>
        <div style={{ display: "flex", gap: 34 }}>
          {NUMEROS.map((n, i) => {
            const aparece = FINAL_CUENTA + i * FINAL_PASO;
            const s = spring({ frame: frame - aparece, fps, config: { damping: 8 } });
            const salto = frame > FINAL_B ? Math.abs(Math.sin((frame - i * 5) / 8)) * -30 : 0;
            return (
              <div
                key={n.numero}
                style={{
                  fontSize: 150,
                  fontWeight: 700,
                  color: n.color,
                  textShadow: "6px 6px 0 rgba(0,0,0,0.12)",
                  transform: `scale(${s}) translateY(${salto}px)`,
                }}
              >
                {n.numero}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 70, fontWeight: 600, color: "#333", opacity: cierre, transform: `scale(${cierre})` }}>
          ¡Ya sabes contar hasta diez!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
