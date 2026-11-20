// Piezas de interfaz del juego (dentro de la ventana 1200×900).
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor } from "../CocinaDulce/Deco";
import { Escribir } from "../CocinaDulce/Juego";
import type { GuionHecho } from "./guion";
import { ALTO, ANCHO, borde, FUENTES, P, texto } from "./tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const posicionCursor = (g: GuionHecho, frame: number) => {
  const c = g.cursor;
  let i = 0;
  while (i < c.length - 2 && frame > c[i + 1][0]) i++;
  const [f0, x0, y0] = c[i];
  const [f1, x1, y1] = c[i + 1];
  const t = interpolate(frame, [f0, Math.max(f0 + 0.001, f1)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
};

/** Cinta superior "PASO n/N · título". */
export const Cinta: React.FC<{ n: number; total: number; titulo: string; desde: number }> = ({ n, total, titulo, desde }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 92, borderRadius: 24, backgroundColor: P.ui, border: borde(P, 5), boxShadow: `0 8px 0 ${P.contorno}`, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
    <div style={{ position: "absolute", inset: 8, borderRadius: 16, border: "3px dashed #FFFFFFAA" }} />
    <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 38, ...texto(P, P.acento, 7) }}>
      PASO {n}/{total}
    </div>
    <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 42, ...texto(P, "#FFFFFF", 7) }}>
      <Escribir key={n} texto={titulo} desde={desde} vel={1} sonido={false} />
    </div>
  </div>
);

/** "+100" que sube al terminar un paso. */
export const MasPuntos: React.FC<{ desde?: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (desde === undefined) return null;
  const t = frame - desde;
  if (t < 0 || t > 34) return null;
  const s = spring({ frame: t, fps, config: { damping: 8 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 170 - t * 1.6,
        textAlign: "center",
        opacity: interpolate(t, [24, 34], [1, 0], clamp),
        transform: `scale(${s})`,
        fontFamily: FUENTES.pixel,
        fontWeight: 700,
        fontSize: 64,
        ...texto(P, P.acento, 10),
      }}
    >
      ¡Bien! +100 ★
    </div>
  );
};

/** Barra de progreso de juego (p. ej. "Esponjoso") que se llena entre dos momentos. */
export const BarraProgreso: React.FC<{ etiqueta: string; desde: number; hasta: number; x: number; y: number; ancho?: number }> = ({ etiqueta, desde, hasta, x, y, ancho = 380 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < desde - 4 || frame > hasta + 40) return null;
  const entra = spring({ frame: frame - desde + 4, fps, config: { damping: 12 } });
  const v = interpolate(frame, [desde, hasta], [0, 1], clamp);
  const lleno = v >= 1;
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y, width: ancho, transform: `scale(${entra})`, opacity: interpolate(frame, [hasta + 30, hasta + 40], [1, 0], clamp) }}>
      <div style={{ fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, marginBottom: 6, ...texto(P, lleno ? P.acento : "#FFFFFF", 7) }}>
        {etiqueta} {lleno ? "¡MAX! ♡" : `${Math.round(v * 100)}%`}
      </div>
      <div style={{ height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", border: borde(P, 5), overflow: "hidden", boxShadow: `0 6px 0 ${P.contorno}` }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: `repeating-linear-gradient(-45deg, ${P.ui} 0 16px, #F59AB4 16px 32px)`, backgroundPosition: `${frame * 2}px 0` }} />
      </div>
    </div>
  );
};

/** Transición: cortina rosa con forma de corazón que se cierra y se abre. */
export const Cortina: React.FC<{ centro: number; id: string }> = ({ centro, id }) => {
  const frame = useCurrentFrame();
  if (frame < centro - 16 || frame > centro + 16) return null;
  const e =
    frame <= centro
      ? interpolate(frame, [centro - 16, centro], [1.2, 0], { ...clamp, easing: Easing.in(Easing.quad) })
      : interpolate(frame, [centro, centro + 16], [0, 1.2], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <svg width={ANCHO} height={ALTO} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <mask id={`m-${id}`}>
          <rect width={ANCHO} height={ALTO} fill="#fff" />
          <path d="M0 30 C -60 -10, -40 -60, 0 -30 C 40 -60, 60 -10, 0 30 Z" transform={`translate(600 470) scale(${e * 14})`} fill="#000" />
        </mask>
      </defs>
      <rect width={ANCHO} height={ALTO} fill={P.ui} mask={`url(#m-${id})`} />
    </svg>
  );
};

/** Cursor de mano con lo que lleva en la mano y las ondas de clic. */
export const CursorJuego: React.FC<{ g: GuionHecho; visible: boolean; carga?: (que: string, frame: number) => React.ReactNode }> = ({ g, visible, carga }) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  const cursor = posicionCursor(g, frame);
  const enMano = g.cargas.find(([a, b]) => frame >= a && frame < b);
  const ultimoClic = g.clics.filter((c) => c <= frame).pop();
  const presionado = (ultimoClic !== undefined && frame - ultimoClic < 6) || Boolean(enMano);
  return (
    <>
      {enMano && carga && <div style={{ position: "absolute", left: cursor.x, top: cursor.y }}>{carga(enMano[2], frame)}</div>}
      {g.clics.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 12) return null;
        const q = posicionCursor(g, c);
        return <div key={c} style={{ position: "absolute", left: q.x - 10 - t * 5, top: q.y - 10 - t * 5, width: 20 + t * 10, height: 20 + t * 10, borderRadius: "50%", border: `6px solid ${P.ui}`, opacity: 1 - t / 12 }} />;
      })}
      <Cursor x={cursor.x} y={cursor.y} presionado={presionado} />
    </>
  );
};

/** Muestra un dibujo hecho en coordenadas de la ventana, recortado alrededor de (cx, cy) y escalado. */
export const Miniatura: React.FC<{ cx: number; cy: number; k: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ cx, cy, k, w, h, children, style }) => (
  <div style={{ position: "absolute", width: w, height: h, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", width: ANCHO, height: ALTO, left: w / 2 - cx * k, top: h / 2 - cy * k, transform: `scale(${k})`, transformOrigin: "0 0" }}>{children}</div>
  </div>
);
