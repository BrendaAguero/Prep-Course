// Despensa de madera (en la cocina, coordenadas lógicas 1200×900): su altura depende de cuántos
// ingredientes tiene el paso, así no queda un armario alto y vacío.
import React from "react";
import { Sprite } from "../CocinaDulce/Deco";
import { altoDespensa, DESPENSA } from "./posiciones";
import { borde, FUENTES, P } from "./tema";

export const Despensa: React.FC<{ items: [string, string][]; resaltado?: number; enMano?: string }> = ({ items, resaltado, enMano }) => {
  const n = items.length;
  const alto = altoDespensa(n);
  const paso = (alto - 50) / n;
  const tam = Math.min(104, paso - 40);
  return (
    <div style={{ position: "absolute", left: DESPENSA.x, top: DESPENSA.y, width: DESPENSA.ancho, height: alto }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 16px 16px", backgroundColor: P.madera, border: borde(P, 6), boxShadow: `0 10px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", left: -8, right: -8, top: -16, height: 40, borderRadius: 16, backgroundColor: P.maderaOscura, border: borde(P, 5) }} />
      <div style={{ position: "absolute", left: 22, right: 22, top: -40, height: 58, borderRadius: 16, backgroundColor: P.panel, border: borde(P, 5), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 34, color: P.texto }}>
        Despensa
      </div>
      {items.map(([s, nombre], i) => {
        const on = resaltado === i;
        return (
          <div key={s + i} style={{ position: "absolute", left: 18, right: 18, top: 40 + i * paso, height: paso - 8 }}>
            <div style={{ position: "absolute", inset: "0 0 18px 0", borderRadius: 14, backgroundColor: on ? "#FFF3C4" : P.panel, border: borde(P, 4), boxShadow: on ? `0 0 0 6px ${P.acento}` : "inset 0 -10px 0 #00000010" }} />
            <Sprite n={s} tam={tam} style={{ position: "absolute", left: (214 - tam) / 2, top: (paso - 26 - tam) / 2, opacity: enMano === s ? 0.3 : 1 }} />
            <div style={{ position: "absolute", left: -10, right: -10, bottom: 0, height: 22, borderRadius: 6, backgroundColor: P.maderaOscura, border: borde(P, 4) }} />
            {on && (
              <div style={{ position: "absolute", right: 250, top: (paso - 76) / 2, backgroundColor: P.texto, color: "#FFFFFF", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 38, padding: "4px 18px", borderRadius: 12, whiteSpace: "nowrap" }}>
                {nombre}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
