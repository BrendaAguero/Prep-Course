import React from "react";
import { AbsoluteFill, Folder, Still } from "remotion";
import { C } from "../tema";
import { Conejita } from "./Conejita";
import { Juego, Menu } from "./Escenas";
import { PALETAS, type Paleta } from "./paletas";

const ESCALA = 0.7;

const Marco: React.FC<{ p: Paleta; x: number; y: number; titulo: string; children: React.ReactNode }> = ({ p, x, y, titulo, children }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x - 16,
        top: y - 16,
        width: 1200 * ESCALA + 32,
        height: 900 * ESCALA + 32,
        borderRadius: 36,
        backgroundColor: "#FFFFFF",
        border: `6px solid ${p.contorno}`,
        boxShadow: `0 12px 0 ${p.contorno}`,
      }}
    />
    <div style={{ position: "absolute", left: x, top: y, width: 1200, height: 900, transform: `scale(${ESCALA})`, transformOrigin: "0 0", borderRadius: 30, overflow: "hidden" }}>
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        left: x + 30,
        top: y - 40,
        padding: "4px 22px",
        borderRadius: 16,
        backgroundColor: p.panel,
        border: `5px solid ${p.contorno}`,
        fontFamily: C.pixel,
        fontWeight: 700,
        fontSize: 30,
        color: p.texto,
      }}
    >
      {titulo}
    </div>
  </>
);

export const Lamina: React.FC<{ p: Paleta }> = ({ p }) => {
  const colores = [p.ui, p.uiOscuro, p.acento, p.panel, p.madera, p.pared, p.exterior, p.contorno];
  return (
    <AbsoluteFill style={{ backgroundColor: p.exterior, backgroundImage: p.exteriorPatron, backgroundSize: p.exteriorTam, backgroundPosition: "0 0, 28px 28px" }}>
      {/* Cabecera */}
      <div style={{ position: "absolute", left: 80, top: 34, display: "flex", alignItems: "center", gap: 26 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: p.ui,
            border: `6px solid ${p.contorno}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: C.redonda,
            fontSize: 64,
            color: "#FFFFFF",
            WebkitTextStroke: `8px ${p.contorno}`,
            paintOrder: "stroke fill",
          }}
        >
          {p.id}
        </div>
        <div>
          <div style={{ fontFamily: C.redonda, fontSize: 64, color: p.texto, lineHeight: 1 }}>Opción {p.id} · {p.nombre}</div>
          <div style={{ fontFamily: C.pixel, fontWeight: 500, fontSize: 32, color: p.texto, marginTop: 6 }}>{p.descripcion}</div>
        </div>
      </div>

      <Marco p={p} x={90} y={200} titulo="Menú">
        <Menu p={p} />
      </Marco>
      <Marco p={p} x={990} y={200} titulo="Juego">
        <Juego p={p} />
      </Marco>

      {/* Pie: paleta y poses */}
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          top: 900,
          height: 150,
          borderRadius: 30,
          backgroundColor: "#FFFFFFE6",
          border: `5px solid ${p.contorno}`,
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          gap: 30,
        }}
      >
        <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.texto, width: 130 }}>Paleta fija</div>
        <div style={{ display: "flex", gap: 14 }}>
          {colores.map((c) => (
            <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: c, border: `4px solid ${p.contorno}` }} />
              <div style={{ fontFamily: C.pixel, fontSize: 16, color: p.texto }}>{c.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.texto, textAlign: "right" }}>
          Nube,
          <br />
          la conejita
        </div>
        {(["normal", "feliz", "brazos"] as const).map((pose) => (
          <Conejita key={pose} p={p} px={4.6} pose={pose} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const LaminasCompositions: React.FC = () => (
  <Folder name="Cocina-Dulce-disenos">
    {PALETAS.map((p) => (
      <Still key={p.id} id={`Lamina-${p.id}`} component={Lamina} width={1920} height={1080} defaultProps={{ p }} />
    ))}
  </Folder>
);
