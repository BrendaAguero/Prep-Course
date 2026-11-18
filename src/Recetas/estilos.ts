import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { loadFont as nunito } from "@remotion/google-fonts/Nunito";
import { loadFont as playfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as fredoka } from "@remotion/google-fonts/Fredoka";

export type Estilo = {
  nombre: string;
  fondo: string;
  superficie: string;
  texto: string;
  textoSuave: string;
  acento: string;
  acento2: string;
  fuenteTitulo: string;
  pesoTitulo: number;
  escalaTitulo: number;
  fuenteTexto: string;
  radio: number;
  sombra: string;
  /** Patrón decorativo del fondo */
  patron: "puntos" | "ninguno" | "confeti";
};

const CAVEAT = caveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const NUNITO = nunito("normal", { weights: ["600", "800"], subsets: ["latin"] }).fontFamily;
const PLAYFAIR = playfair("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const INTER = inter("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const FREDOKA = fredoka("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;

export const ESTILOS = {
  casero: {
    nombre: "Cocina casera",
    fondo: "#FBF3E4",
    superficie: "#FFFFFF",
    texto: "#3B2A20",
    textoSuave: "#8A6F5C",
    acento: "#D9653B",
    acento2: "#6B8F4E",
    fuenteTitulo: CAVEAT,
    pesoTitulo: 700,
    escalaTitulo: 1.25,
    fuenteTexto: NUNITO,
    radio: 36,
    sombra: "0 12px 30px rgba(110, 70, 40, 0.15)",
    patron: "puntos",
  },
  moderno: {
    nombre: "Moderno oscuro",
    fondo: "#121212",
    superficie: "#1E1E1E",
    texto: "#F5F1EA",
    textoSuave: "#A39E95",
    acento: "#F4B942",
    acento2: "#E8E2D6",
    fuenteTitulo: PLAYFAIR,
    pesoTitulo: 700,
    escalaTitulo: 1,
    fuenteTexto: INTER,
    radio: 8,
    sombra: "0 20px 50px rgba(0, 0, 0, 0.5)",
    patron: "ninguno",
  },
  infantil: {
    nombre: "Infantil divertido",
    fondo: "#FFF4D6",
    superficie: "#FFFFFF",
    texto: "#2D2A4A",
    textoSuave: "#6B6890",
    acento: "#FF5A5F",
    acento2: "#3FA9F5",
    fuenteTitulo: FREDOKA,
    pesoTitulo: 700,
    escalaTitulo: 1,
    fuenteTexto: FREDOKA,
    radio: 48,
    sombra: "8px 8px 0 rgba(45, 42, 74, 0.15)",
    patron: "confeti",
  },
} satisfies Record<string, Estilo>;

export type NombreEstilo = keyof typeof ESTILOS;
