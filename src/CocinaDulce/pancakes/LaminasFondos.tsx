import React from "react";
import { AbsoluteFill, Folder, Sequence, Still } from "remotion";
import { C } from "../tema";
import { PALETAS } from "../disenos/paletas";
import { GRUPOS } from "./fondos";
import { Vertical } from "./Formatos";

const P = PALETAS.find((x) => x.id === "A")!;
const ESCALA = 0.255;
const FRAME_MUESTRA = 470; // momento de juego (añadiendo leche y harina)

export const LaminaFondos: React.FC<{ numero: number }> = ({ numero }) => {
  const grupo = GRUPOS[numero - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFDF9" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 36,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
        }}
      >
        <div style={{ fontFamily: C.redonda, fontSize: 60, color: P.texto }}>
          Lámina {numero} · {grupo.titulo}
        </div>
        <div
          style={{
            fontFamily: C.pixel,
            fontWeight: 500,
            fontSize: 30,
            color: P.uiOscuro,
          }}
        >
          Fondos para el formato vertical (la caja del juego no cambia)
        </div>
      </div>
      {grupo.fondos.map((f, i) => {
        const x = 60 + i * 305;
        return (
          <React.Fragment key={f.id}>
            <div
              style={{
                position: "absolute",
                left: x - 8,
                top: 140 - 8,
                width: 1080 * ESCALA + 16,
                height: 1920 * ESCALA + 16,
                borderRadius: 30,
                backgroundColor: "#2F2530",
                boxShadow: "0 10px 24px rgba(60,30,50,0.25)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: 140,
                width: 1080,
                height: 1920,
                transform: `scale(${ESCALA})`,
                transformOrigin: "0 0",
                borderRadius: 80,
                overflow: "hidden",
              }}
            >
              {/* Se adelanta el tiempo para mostrar un momento de juego */}
              <Sequence from={-FRAME_MUESTRA} layout="none">
                <Vertical fondo={f.C} sinMusica />
              </Sequence>
            </div>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 660,
                width: 1080 * ESCALA,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  flexShrink: 0,
                  borderRadius: 16,
                  backgroundColor: P.ui,
                  border: `4px solid ${P.contorno}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: C.redonda,
                  fontSize: 30,
                  color: "#FFFFFF",
                }}
              >
                {f.id}
              </div>
              <div
                style={{
                  fontFamily: C.redonda,
                  fontSize: 28,
                  color: P.texto,
                  lineHeight: 1.1,
                }}
              >
                {f.nombre}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const LaminasFondosCompositions: React.FC = () => (
  <Folder name="Cocina-Dulce-fondos">
    {GRUPOS.map((g, i) => (
      <Still
        key={g.titulo}
        id={`Fondos-lamina-${i + 1}`}
        component={LaminaFondos}
        width={1920}
        height={760}
        defaultProps={{ numero: i + 1 }}
      />
    ))}
  </Folder>
);
