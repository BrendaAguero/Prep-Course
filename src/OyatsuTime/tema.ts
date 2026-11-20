// Base de estilo de おやつタイム (Oyatsu Time). Ver recetas/ESTILO.md.
import { loadFont as dotGothic } from "@remotion/google-fonts/DotGothic16";
import { PALETAS, type Paleta } from "../CocinaDulce/disenos/paletas";
import { C } from "../CocinaDulce/tema";

export { borde, texto } from "../CocinaDulce/disenos/Escenas";
export type { Paleta };

/** Paleta fija del canal (A · Fresa y crema). */
export const P: Paleta = PALETAS.find((x) => x.id === "A")!;

export const FUENTES = {
  japones: dotGothic("normal", { weights: ["400"], subsets: ["japanese", "latin"] }).fontFamily,
  pixel: C.pixel,
  redonda: C.redonda,
};

export const MARCA = { japones: "おやつタイム", romaji: "Oyatsu Time" };

/** Ventana de juego lógica. */
export const ANCHO = 1200;
export const ALTO = 900;

/** Zonas del formato vertical 1080×1920 (zona segura de TikTok). */
export const ZONAS = {
  izquierda: 60,
  derecha: 960, // a partir de aquí, botones de TikTok
  marca: { y0: 120, y1: 330 }, // logo pixel ×2 (198 px de alto) + etiqueta de la receta
  ventana: { x: 60, y: 360, escala: 0.75 }, // 900×675 → hasta y 1035
  consejo: { y0: 1060, y1: 1290 },
  progreso: { y0: 1300, y1: 1460 },
  inferiorLibre: 1480, // desde aquí lo tapa la descripción de TikTok
};

export const VOLUMEN_MUSICA = 0.3;
