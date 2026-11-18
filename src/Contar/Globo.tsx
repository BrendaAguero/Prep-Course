import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Un globo dibujado en SVG que aparece con un rebote y luego flota.
export const Globo: React.FC<{
  readonly color: string;
  readonly delay: number;
  readonly numero: number;
  readonly size?: number;
}> = ({ color, delay, numero, size = 220 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrada = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 120 },
  });
  const flotar = Math.sin((frame + delay * 3) / 12) * 14;
  const etiqueta = spring({ frame: frame - delay - 8, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${flotar + (1 - entrada) * 300}px) scale(${entrada})`,
      }}
    >
      <svg width={size} height={size * 1.6} viewBox="0 0 100 160">
        <path
          d="M50 118 C 44 130, 58 140, 50 158"
          stroke="#555"
          strokeWidth={1.5}
          fill="none"
        />
        <ellipse cx={50} cy={58} rx={40} ry={52} fill={color} />
        <path d="M44 114 L56 114 L50 106 Z" fill={color} />
        <ellipse cx={34} cy={36} rx={8} ry={14} fill="white" opacity={0.45} transform="rotate(-25 34 36)" />
      </svg>
      <div
        style={{
          marginTop: -20,
          fontSize: 64,
          fontWeight: 700,
          color: "#333",
          opacity: etiqueta,
          transform: `scale(${interpolate(etiqueta, [0, 1], [0.4, 1])})`,
        }}
      >
        {numero}
      </div>
    </div>
  );
};
