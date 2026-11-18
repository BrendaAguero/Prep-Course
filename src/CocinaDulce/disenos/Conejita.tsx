import React from "react";
import type { Paleta } from "./paletas";

// Conejita repostera "Nube": diseño original en pixel art.
// Se define la mitad izquierda (columna 10 = centro) y se refleja.
const MITAD = [
  "....ooo....",
  "...offfo...",
  "...ofifo...",
  "...ofifo...",
  "...ofifo...",
  "...ofifo...",
  "...ofifo...",
  "...offfo...",
  "..ooffffooo",
  ".offfffffff",
  "offffffffff",
  "offffffffff",
  "offheffffff",
  "offeeffffff",
  "obbfffffffn",
  "offffffffmf",
  ".osssffffff",
  "..ooooooooo",
  "...olllllll",
  "..ofaaaaaaa",
  ".offaaaaaaa",
  ".offaaaaaaa",
  "..ooaaaaaaa",
  "...oaaaaaaa",
  "...olllllll",
  "...offfoooo",
  "...ooooo...",
];

const PAD = 2;
const ANCHO = 21 + PAD * 2;
const ALTO = MITAD.length;

export type Pose = "normal" | "feliz" | "brazos";

const construir = (pose: Pose): string[][] => {
  const g = MITAD.map((fila) => {
    const derecha = fila.slice(0, 10).split("").reverse().join("");
    return (".".repeat(PAD) + fila + derecha + ".".repeat(PAD)).split("");
  });
  const set = (x: number, y: number, c: string) => {
    if (y >= 0 && y < ALTO && x >= 0 && x < ANCHO) g[y][x] = c;
  };
  const espejo = (x: number, y: number, c: string) => {
    set(x, y, c);
    set(ANCHO - 1 - x, y, c);
  };
  // Lazo en la oreja derecha
  for (const [dx, dy, c] of [
    [0, 1, "r"], [1, 1, "r"], [3, 1, "r"], [4, 1, "r"],
    [0, 2, "r"], [1, 2, "r"], [2, 2, "R"], [3, 2, "r"], [4, 2, "r"],
    [0, 3, "r"], [1, 3, "r"], [3, 3, "r"], [4, 3, "r"],
  ] as const) set(PAD + 15 + dx, dy, c);
  // Bolsillo con corazón en el delantal
  espejo(PAD + 9, 21, "k");
  set(PAD + 10, 22, "k");

  // brillo de ambos ojos arriba a la izquierda
  set(PAD + 16, 12, "h");
  set(PAD + 17, 12, "e");
  if (pose === "feliz" || pose === "brazos") {
    // ojos cerrados felices (^ ^)
    for (const x of [3, 4]) {
      espejo(PAD + x, 12, "f");
      espejo(PAD + x, 13, "f");
    }
    espejo(PAD + 3, 13, "e");
    espejo(PAD + 4, 12, "e");
    espejo(PAD + 5, 13, "e");
  }
  if (pose === "brazos") {
    // quita brazos abajo y los pone arriba
    for (const [x, y] of [
      [1, 20], [2, 20], [1, 21], [2, 21], [2, 19], [3, 19], [3, 20], [3, 21],
    ]) espejo(PAD + x, y, x === 3 ? "a" : ".");
    espejo(PAD + 3, 19, "o");
    espejo(PAD + 2, 20, "o");
    espejo(PAD + 2, 21, "o");
    for (const [x, y, c] of [
      [1, 13, "o"], [0, 14, "o"], [1, 14, "f"], [0, 15, "o"], [1, 15, "f"],
      [0, 16, "o"], [1, 16, "f"], [1, 17, "o"], [2, 17, "f"], [2, 18, "o"], [3, 18, "f"],
    ] as const) espejo(x, y, c);
  }
  return g;
};

export const Conejita: React.FC<{
  p: Paleta;
  px: number;
  pose?: Pose;
  style?: React.CSSProperties;
}> = ({ p, px, pose = "normal", style }) => {
  const c = p.conejo;
  const colores: Record<string, string> = {
    o: p.contorno,
    f: c.pelo,
    s: c.sombra,
    i: c.oreja,
    e: "#3D2533",
    h: "#FFFFFF",
    b: c.oreja,
    n: c.oreja,
    m: p.contorno,
    a: c.delantal,
    l: c.encaje,
    k: c.lazo,
    r: c.lazo,
    R: p.contorno,
  };
  const g = construir(pose);
  return (
    <svg width={ANCHO * px} height={ALTO * px} viewBox={`0 0 ${ANCHO} ${ALTO}`} shapeRendering="crispEdges" style={style}>
      {g.flatMap((fila, y) =>
        fila.map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={colores[ch]} />)),
      )}
    </svg>
  );
};

export const CONEJITA_ANCHO = ANCHO;
export const CONEJITA_ALTO = ALTO;
