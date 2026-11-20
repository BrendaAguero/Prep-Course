// Constructor de guion común a todas las recetas de おやつタイム.
// Genera el recorrido del cursor, los clics, lo que lleva en la mano, los sonidos y los
// momentos clave (eventos) que leen las animaciones. Ventana lógica 1200×900, 30 fps.
import { BOTON_COCINAR, BOTON_GUARDAR, BOTON_JUGAR, huecoDespensa, huecoInventario } from "./posiciones";

/** `a`: nombre en audio/cocina-juego/ (sin extensión) o ruta dentro de audio/ con "/" (p. ej. "kawaii/click.wav"). */
export type Sonido = { f: number; a: string; vol?: number; dur?: number };

export type GuionHecho = {
  cursor: [number, number, number][];
  clics: number[];
  cargas: [number, number, string][];
  sonidos: Sonido[];
  ev: Record<string, number>;
  duracion: number;
};

/** Pausa final de cada paso para ver el resultado. */
export const PAUSA_RESULTADO = 30;
/** Duración mínima de un paso: leer el consejo (≈2,5 palabras/s) + 1,5 s. */
export const minimoPaso = (consejo: string) => Math.round((consejo.split(/\s+/).length / 2.5 + 1.5) * 30);

export class Guion {
  f = 0;
  x = 1100;
  y = 1000;
  cursor: [number, number, number][] = [[0, 1100, 1000]];
  clics: number[] = [];
  cargas: [number, number, string][] = [];
  sonidos: Sonido[] = [];
  ev: Record<string, number> = {};
  private enMano: { desde: number; que: string } | null = null;

  /** tempo < 1 acelera todo (movimientos, esperas y sonidos largos). */
  constructor(private tempo = 1) {}
  private r(d: number) {
    return Math.max(1, Math.round(d * this.tempo));
  }

  ir(x: number, y: number, d = 16) {
    this.f += this.r(d);
    this.cursor.push([this.f, x, y]);
    this.x = x;
    this.y = y;
    return this;
  }
  quieto(d: number) {
    this.f += this.r(d);
    this.cursor.push([this.f, this.x, this.y]);
    return this;
  }
  son(a: string, extra: Omit<Sonido, "f" | "a"> = {}) {
    this.sonidos.push({ f: this.f, a, ...extra, dur: extra.dur ? this.r(extra.dur) : undefined });
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
    const d = this.r(dur);
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
    const d = this.r(dur);
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
    const h = huecoDespensa(i, n);
    this.ir(h.x, h.y, 18).clic("toc", 0.6).coger(que);
    return this;
  }

  /* ---------- tramos comunes a todas las recetas ---------- */

  /** Gancho → menú → clic en "Jugar" → cortina. */
  intro(gancho = 75) {
    this.marca("gancho").quieto(gancho).marca("menu");
    this.ir(900, 700, 20).ir(BOTON_JUGAR.x + 20, BOTON_JUGAR.y + 10, 18).quieto(6).marca("clicJugar").clic("kawaii/click.wav", 0.4).quieto(14);
    return this.marca("cortina1").quieto(16);
  }

  /** Inventario: el cursor marca cada ingrediente y pulsa "¡A cocinar!". Deja el paso 0 empezado. */
  inventario(n: number) {
    this.marca("ingredientes").quieto(14);
    for (let i = 0; i < n; i++) {
      const h = huecoInventario(i, n);
      this.ir(h.x + 30, h.y + 20, i === 0 ? 22 : 13).marca(`ing${i}`).clic("check");
    }
    this.marca("captura").quieto(30);
    this.ir(BOTON_COCINAR.x, BOTON_COCINAR.y, 18).quieto(6).marca("clicCocinar").clic("kawaii/click.wav", 0.4).quieto(12);
    // el paso 1 empieza al cerrarse la cortina (sin hueco entre pantallas)
    return this.marca("cortina2").marca("paso0");
  }

  /** Cierra el paso i: duración mínima para leer el consejo + pausa de resultado con +100 puntos. */
  finPaso(i: number, consejo: string) {
    this.quieto(0);
    const hecho = this.f - this.ev[`paso${i}`];
    this.f += Math.max(0, minimoPaso(consejo) - hecho - PAUSA_RESULTADO);
    this.marca(`puntos${i}`).son("check", { vol: 0.5 });
    this.f += PAUSA_RESULTADO;
    this.cursor.push([this.f, this.x, this.y]);
    return this;
  }

  /** "¡Has conseguido una receta nueva!" → ♡ Guardar → ¡Guardada! → libro de recetas. */
  final() {
    this.marca("completada").son("kawaii/jingle.wav", { vol: 0.6 }).quieto(40);
    this.ir(BOTON_GUARDAR.x + 20, BOTON_GUARDAR.y + 10, 20).quieto(6).marca("clicGuardar").clic("kawaii/click.wav", 0.4);
    this.marca("guardada").son("tintineo").quieto(40);
    this.marca("cortina3").quieto(16).marca("libro").son("kawaii/brillo.wav", { vol: 0.5 }).quieto(60);
    return this.marca("fin");
  }

  hecho(): GuionHecho {
    this.soltar();
    return { cursor: this.cursor, clics: this.clics, cargas: this.cargas, sonidos: this.sonidos, ev: this.ev, duracion: this.f };
  }
}
