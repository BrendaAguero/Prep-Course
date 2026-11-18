import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { panel, TEMA } from "./tema";
import { PUNTOS_POR_PASO } from "./tiempos";

const textoJuego = (size: number, color = "#FFFFFF"): React.CSSProperties => ({
  fontFamily: TEMA.fuenteJuego,
  fontSize: size,
  color,
  WebkitTextStroke: `${Math.round(size / 9)}px ${TEMA.borde}`,
  paintOrder: "stroke fill",
  lineHeight: 1,
});
export { textoJuego };

/** Barra superior: receta, puntos y progreso de pasos. */
export const Hud: React.FC<{
  titulo: string;
  emoji: string;
  puntos: number;
  pasoActual: number; // -1 = inventario
  totalPasos: number;
  completado?: boolean;
}> = ({ titulo, emoji, puntos, pasoActual, totalPasos, completado = false }) => (
  <div style={{ position: "absolute", top: 70, left: 50, right: 50 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
      <div style={panel({ display: "flex", alignItems: "center", gap: 18, padding: "14px 28px", borderRadius: 28 })}>
        <div style={{ fontSize: 60 }}>{emoji}</div>
        <div style={{ fontFamily: TEMA.fuenteJuego, fontSize: 44, color: TEMA.texto }}>{titulo}</div>
      </div>
      <div
        style={panel({
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 28px",
          borderRadius: 28,
          backgroundColor: TEMA.oro,
        })}
      >
        <div style={{ fontSize: 46 }}>⭐</div>
        <div style={{ fontFamily: TEMA.fuenteJuego, fontSize: 52, color: TEMA.texto, minWidth: 110, textAlign: "right" }}>
          {Math.round(puntos)}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 34 }}>
      {Array.from({ length: totalPasos }).map((_, i) => {
        const hecho = i < pasoActual || (i === pasoActual && completado);
        const actual = i === pasoActual && !completado;
        return (
          <div
            key={i}
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              border: `6px solid ${TEMA.borde}`,
              backgroundColor: hecho ? TEMA.verde : actual ? TEMA.naranja : TEMA.panel,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: TEMA.fuenteJuego,
              fontSize: 40,
              color: hecho || actual ? "#fff" : TEMA.textoSuave,
              transform: `scale(${actual ? 1.15 : 1})`,
            }}
          >
            {hecho ? "✓" : i + 1}
          </div>
        );
      })}
    </div>
  </div>
);

/** Panel de instrucción inferior con texto que se escribe. */
export const Instruccion: React.FC<{ paso: number; texto: string; nota?: string; desde: number }> = ({
  paso,
  texto,
  nota,
  desde,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: frame - desde + 10, fps, config: { damping: 14 } });
  const letras = Math.floor(interpolate(frame - desde, [0, texto.length * 1.1], [0, texto.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1490,
        transform: `translateY(${(1 - entrada) * 300}px)`,
        ...panel({ padding: "56px 44px 40px" }),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -34,
          left: 36,
          ...panel({ backgroundColor: TEMA.naranja, padding: "6px 26px", borderRadius: 20, boxShadow: "none" }),
          ...textoJuego(44),
        }}
      >
        PASO {paso}
      </div>
      <div style={{ fontFamily: TEMA.fuenteTexto, fontWeight: 800, fontSize: 52, lineHeight: 1.25, color: TEMA.texto }}>
        {texto.slice(0, letras)}
        <span style={{ opacity: 0 }}>{texto.slice(letras)}</span>
      </div>
      {nota && (
        <div style={{ fontFamily: TEMA.fuenteTexto, fontWeight: 800, fontSize: 38, color: TEMA.rojo, marginTop: 16 }}>
          ⚠️ {nota}
        </div>
      )}
    </div>
  );
};

/** Popup de paso completado: "¡PERFECTO!", estrellas y puntos. */
export const Perfecto: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - desde;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 8, stiffness: 160 } });
  const salida = interpolate(t, [38, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Audio src={staticFile("audio/juego/ding.wav")} from={desde} volume={0.5} name="Ding" />
      <div
        style={{
          position: "absolute",
          top: 560,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: salida,
          transform: `scale(${s}) rotate(-6deg)`,
        }}
      >
        <div style={textoJuego(150, TEMA.oro)}>¡PERFECTO!</div>
        <div style={{ ...textoJuego(70, TEMA.verde), marginTop: 10 }}>+{PUNTOS_POR_PASO}</div>
      </div>
      {Array.from({ length: 10 }).map((_, i) => {
        const ang = (i / 10) * Math.PI * 2;
        const d = interpolate(t, [0, 30], [0, 420], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * d - 35,
              top: 680 + Math.sin(ang) * d * 0.7 - 35,
              fontSize: 70,
              opacity: salida * interpolate(t, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
              transform: `rotate(${t * 8}deg)`,
            }}
          >
            ⭐
          </div>
        );
      })}
    </>
  );
};
