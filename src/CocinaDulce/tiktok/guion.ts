// Guion de "Pancakes japoneses" (receta original de Just One Cookbook) para TikTok.
// Un pequeño constructor genera, paso a paso, el recorrido del cursor, los clics, lo que lleva
// en la mano, los sonidos y los momentos clave (eventos) que usan las animaciones.
// Coordenadas: ventana de juego lógica de 1200×900. 30 fps.

export type Sonido = { f: number; a: string; vol?: number; dur?: number };
export type Paso = { titulo: string; truco: string; items: [string, string][] };

export const INGREDIENTES: { s: string; cant: string; nombre: string }[] = [
  { s: "huevo", cant: "2", nombre: "huevos grandes" },
  { s: "leche", cant: "1½ cda", nombre: "leche entera" },
  { s: "vainilla", cant: "¼ cdta", nombre: "vainilla" },
  { s: "harina", cant: "¼ taza", nombre: "harina de repostería" },
  { s: "polvo", cant: "½ cdta", nombre: "polvo de hornear" },
  { s: "azucar", cant: "2 cdas", nombre: "azúcar" },
  { s: "aceite", cant: "1 cda", nombre: "aceite neutro" },
  { s: "agua", cant: "2 cdas", nombre: "agua (vapor)" },
];

export const PASOS: Paso[] = [
  { titulo: "Separa los huevos", truco: "Ni una gota de yema en las claras, o no montan. ¡Claras 15 min al congelador!", items: [["huevo", "Huevo"]] },
  { titulo: "Yemas + leche + vainilla", truco: "Bate a mano hasta que la mezcla quede pálida y espumosa.", items: [["leche", "Leche"], ["vainilla", "Vainilla"]] },
  { titulo: "Tamiza la harina", truco: "Harina y polvo de hornear tamizados. Mezcla solo hasta que esté lisa.", items: [["harina", "Harina"], ["polvo", "Polvo de hornear"]] },
  { titulo: "Monta el merengue", truco: "Azúcar en 3 veces hasta picos firmes y brillantes.", items: [["azucar", "Azúcar"]] },
  { titulo: "Une en 3 partes", truco: "1/3 del merengue para igualar densidades; el resto, con movimientos envolventes.", items: [] },
  { titulo: "Sartén a fuego mínimo", truco: "150 °C y un hilo de aceite. Retira el exceso con papel.", items: [["aceite", "Aceite"]] },
  { titulo: "Montones altos + tapa", truco: "Apila la masa. Agua en los huecos, tapa y 6–7 min a fuego bajo.", items: [["agua", "Agua"]] },
  { titulo: "Voltea con cuidado", truco: "Si se resiste, espera 30 s. Agua, tapa y 4–5 min más.", items: [] },
  { titulo: "¡A servir!", truco: "Sírvelos al momento: fresas, azúcar glas y sirope.", items: [["fresa", "Fresa"], ["azucar", "Azúcar glas"], ["miel", "Sirope"]] },
];

// Posiciones fijas en la ventana
export const YEMAS = { x: 330, y: 730, k: 0.72 };
export const CLARAS = { x: 690, y: 730, k: 0.72 };
export const SARTEN = { x: 470, y: 720 };
export const PLATO = { x: 470, y: 760 };
export const PANCAKES_X = [340, 470, 600];
export const BOTON_JUGAR = { x: 780, y: 488 };
export const BOTON_COCINAR = { x: 600, y: 840 };
export const tarjeta = (i: number) => ({ x: i % 2 === 0 ? 330 : 870, y: 250 + Math.floor(i / 2) * 140 });

/** Centro del hueco i de la despensa con n ingredientes (igual que el componente Despensa). */
export const hueco = (i: number, n: number) => {
  const paso = (640 - 50) / n;
  return { x: 1025, y: 190 + i * paso + (paso - 26) / 2 };
};

/** Ritmo global: <1 acelera todo el guion (movimientos, esperas y sonidos largos). */
const TEMPO = 0.85;
const r = (d: number) => Math.max(1, Math.round(d * TEMPO));

class Guion {
  f = 0;
  x = 1100;
  y = 1000;
  cursor: [number, number, number][] = [[0, 1100, 1000]];
  clics: number[] = [];
  cargas: [number, number, string][] = [];
  sonidos: Sonido[] = [];
  ev: Record<string, number> = {};
  private enMano: { desde: number; que: string } | null = null;

  ir(x: number, y: number, d = 16) {
    this.f += r(d);
    this.cursor.push([this.f, x, y]);
    this.x = x;
    this.y = y;
    return this;
  }
  quieto(d: number) {
    this.f += r(d);
    this.cursor.push([this.f, this.x, this.y]);
    return this;
  }
  son(a: string, extra: Omit<Sonido, "f" | "a"> = {}) {
    this.sonidos.push({ f: this.f, a, ...extra, dur: extra.dur ? r(extra.dur) : undefined });
    return this;
  }
  clic(sonido?: string, vol?: number) {
    this.clics.push(this.f);
    if (sonido) this.son(sonido, { vol });
    return this.quieto(6);
  }
  marca(n: string) {
    this.ev[n] = this.f;
    return this;
  }
  coger(que: string) {
    this.soltar();
    this.enMano = { desde: this.f, que };
    return this;
  }
  soltar() {
    if (this.enMano) this.cargas.push([this.enMano.desde, this.f, this.enMano.que]);
    this.enMano = null;
    return this;
  }
  /** Movimiento circular (batir, limpiar) alrededor de (cx, cy). */
  girar(cx: number, cy: number, rx: number, ry: number, dur: number, vueltas: number) {
    const d = r(dur);
    const pasos = Math.max(4, Math.round(d / 3));
    for (let i = 1; i <= pasos; i++) {
      const a = (i / pasos) * Math.PI * 2 * vueltas;
      this.f += d / pasos;
      this.f = Math.round(this.f * 1000) / 1000;
      this.cursor.push([this.f, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    this.x = cx + rx;
    this.y = cy;
    this.f = Math.round(this.f);
    return this;
  }
  /** Sacudir arriba y abajo (tamiz, salero). */
  sacudir(dur: number, amp = 14) {
    const d = r(dur);
    const cx = this.x;
    const cy = this.y;
    for (let i = 1; i <= Math.round(d / 4); i++) {
      this.f += 4;
      this.cursor.push([this.f, cx + (i % 2 ? 6 : -6), cy + (i % 2 ? amp : -amp / 2)]);
    }
    this.cursor.push([this.f, cx, cy]);
    return this;
  }
  coger_de_despensa(i: number, n: number, que: string) {
    const h = hueco(i, n);
    this.ir(h.x, h.y, 18).clic("toc", 0.6).coger(que);
    return this;
  }
}

const g = new Guion();

// --- Gancho (pancakes temblando) y menú
g.marca("gancho").quieto(75).marca("menu");
g.ir(900, 700, 30).ir(BOTON_JUGAR.x + 20, BOTON_JUGAR.y + 10, 24).quieto(8).marca("clicJugar").clic().quieto(14);
g.marca("cortina1").quieto(16);

// --- Ingredientes
g.marca("ingredientes").ir(tarjeta(0).x, tarjeta(0).y, 22);
INGREDIENTES.forEach((_, i) => {
  if (i > 0) g.ir(tarjeta(i).x, tarjeta(i).y, 13);
  g.marca(`ing${i}`).clic("check");
});
g.ir(BOTON_COCINAR.x, BOTON_COCINAR.y, 18).quieto(6).marca("clicCocinar").clic().quieto(12).marca("cortina2").quieto(16);

// --- Paso 1: separar huevos
g.marca("paso0").quieto(10);
for (const k of [1, 2]) {
  g.coger_de_despensa(0, 1, "huevo").ir(YEMAS.x, 560, 20).quieto(4).son("toc-huevo").quieto(8).marca(`huevo${k}`).clic("crack-suave").soltar().quieto(22);
}
g.ir(CLARAS.x + 120, 470, 16).marca("congelar").son("tictac", { dur: 50 }).quieto(55);

// --- Paso 2: yemas + leche + vainilla
g.marca("paso1").quieto(6);
g.coger_de_despensa(0, 2, "leche").ir(YEMAS.x + 60, 520, 18).marca("leche").son("gorgoteo", { dur: 34, vol: 0.6 }).quieto(34).soltar();
g.coger_de_despensa(1, 2, "vainilla").ir(YEMAS.x + 40, 540, 18);
for (let i = 0; i < 3; i++) g.marca(`vainilla${i}`).clic("plop-3", 0.5);
g.soltar().coger("varillas").ir(YEMAS.x + 70, 640, 14).marca("batirY").son("batir", { dur: 54 }).girar(YEMAS.x, 645, 70, 16, 54, 3).marca("batirYfin").soltar();

// --- Paso 3: tamizar
g.marca("paso2").quieto(6);
g.coger_de_despensa(0, 2, "tamiz").ir(YEMAS.x, 500, 18).marca("tamiz1").son("tamizar", { dur: 40 }).sacudir(40);
g.ir(hueco(1, 2).x, hueco(1, 2).y, 18).clic("toc", 0.6).ir(YEMAS.x, 500, 18).marca("tamiz2").son("tamizar", { dur: 24 }).sacudir(24).marca("tamizFin").soltar();
g.coger("varillas").ir(YEMAS.x + 70, 640, 12).marca("mezclaY").son("batir", { dur: 36 }).girar(YEMAS.x, 645, 60, 14, 36, 2).marca("mezclaYfin").soltar();

// --- Paso 4: merengue
g.marca("paso3").coger("batidora").ir(CLARAS.x + 60, 600, 18).marca("batidora").son("batidora", { dur: 190 });
for (let k = 1; k <= 3; k++) {
  g.girar(CLARAS.x, 610, 60, 12, 28, 2).soltar();
  g.coger_de_despensa(0, 1, "azucar").ir(CLARAS.x + 20, 540, 16).marca(`azucar${k}`).clic("espolvorear").soltar().coger("batidora").ir(CLARAS.x + 60, 600, 14);
}
g.girar(CLARAS.x, 610, 60, 12, 34, 2).marca("picos").son("tintineo", { vol: 0.6 }).quieto(18).soltar();

// --- Paso 5: unir en 3 partes
g.marca("paso4").coger("espatula");
g.ir(CLARAS.x, 640, 16).marca("toma1").clic("plop-2", 0.5).ir(YEMAS.x, 620, 18).marca("deja1").clic("plop-1", 0.5);
g.son("batir", { dur: 26 }).girar(YEMAS.x, 645, 55, 14, 26, 2);
g.ir(CLARAS.x, 640, 16).marca("toma2").clic("plop-2", 0.5).ir(YEMAS.x, 620, 18).marca("deja2").clic("plop-1", 0.5);
g.marca("envolver").son("fwip", { vol: 0.5 });
for (let i = 0; i < 4; i++) g.ir(YEMAS.x - 60, 600, 8).ir(YEMAS.x + 60, 690, 10);
g.marca("envolverFin").soltar().quieto(10).marca("salenBoles").quieto(30);

// --- Paso 6: sartén a fuego mínimo
g.marca("paso5").marca("fuego").quieto(36);
g.coger_de_despensa(0, 1, "aceite").ir(SARTEN.x + 40, 560, 18).marca("aceite").clic("plop-3", 0.4).quieto(10).soltar();
g.coger("papel").ir(SARTEN.x + 120, 690, 14).marca("papel").son("tamizar", { dur: 30, vol: 0.5 }).girar(SARTEN.x, 690, 120, 26, 30, 2).soltar().quieto(8);

// --- Paso 7: montones altos, agua, tapa 6–7 min
g.marca("paso6").coger("cuchara");
PANCAKES_X.forEach((x, i) => g.ir(x, 560, i === 0 ? 18 : 12).marca(`monton${i}`).clic(`plop-${i + 1}`));
PANCAKES_X.forEach((x, i) => g.ir(x, 520, 12).marca(`apila${i}`).clic(`plop-${((i + 1) % 3) + 1}`));
g.soltar().coger_de_despensa(0, 1, "agua").ir(SARTEN.x - 60, 620, 16).marca("agua1").clic("agua-puff").soltar();
g.ir(1000, 560, 14).marca("tapa1").son("tapa").quieto(10).marca("reloj1").son("tictac", { dur: 70 }).quieto(30);
g.marca("ultima").coger("cuchara");
PANCAKES_X.forEach((x, i) => g.ir(x, 470, 8).clic(`plop-${i + 1}`, 0.6));
g.soltar().ir(1000, 560, 10).quieto(20).marca("reloj1fin").son("tintineo", { vol: 0.5 }).quieto(10);

// --- Paso 8: voltear, agua, tapa 4–5 min
g.marca("paso7").marca("tapaFuera").son("tapa", { vol: 0.7 }).quieto(12).coger("espatula");
PANCAKES_X.forEach((x, i) => {
  g.ir(x, 620, 14).son("fwip").marca(`voltea${i}`).quieto(14).son("toc");
});
g.soltar().coger_de_despensa(0, 1, "agua").ir(SARTEN.x - 60, 620, 16).marca("agua2").clic("agua-puff").soltar();
g.ir(1000, 560, 14).marca("tapa2").son("tapa").marca("reloj2").son("tictac", { dur: 50 }).quieto(50).marca("listo").son("tapa", { vol: 0.6 }).quieto(18);

// --- Paso 9: servir
g.marca("paso8").marca("salenSarten").quieto(22).marca("plato");
PANCAKES_X.forEach((_, i) => g.quieto(10).marca(`pila${i}`).son(i === 2 ? "tac-plato" : "plop-1", { vol: 0.7 }));
g.quieto(4).marca("jiggle1").son("boing-esponjoso").quieto(30);
for (const k of [0, 1]) g.coger_de_despensa(0, 3, "fresa").ir(PLATO.x - 50 + k * 100, 470, 16).marca(`fresa${k}`).clic("plop-3", 0.6).soltar();
g.coger_de_despensa(1, 3, "azucar").ir(PLATO.x, 430, 16).marca("glas").son("espolvorear").sacudir(24, 10).soltar();
g.coger_de_despensa(2, 3, "miel").ir(PLATO.x - 90, 420, 16).marca("sirope").son("gorgoteo", { dur: 60 });
g.ir(PLATO.x + 80, 430, 60).marca("siropeFin").soltar().ir(1100, 980, 20);
g.marca("jiggle2").son("boing-esponjoso").quieto(26).son("boing-esponjoso", { vol: 0.6 }).quieto(30);

// --- Final
g.marca("completada").son("tintineo").quieto(80).marca("cta").quieto(75).marca("fin");

export const G = {
  cursor: g.cursor,
  clics: g.clics,
  cargas: g.cargas,
  sonidos: g.sonidos,
  ev: g.ev,
  duracion: g.f,
};

export const PASO_INICIO = PASOS.map((_, i) => G.ev[`paso${i}`]);
