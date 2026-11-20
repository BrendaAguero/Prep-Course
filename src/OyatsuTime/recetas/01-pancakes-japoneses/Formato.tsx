// Receta nº 1 · Pancakes japoneses, montada sobre la base común de おやつタイム.
import React from "react";
import { Composition, Folder } from "remotion";
import { MarcoTikTok } from "../../Marco";
import type { Aparicion } from "../../Nube";
import { P } from "../../tema";
import type { Receta } from "../../tipos";
import { VentanaJuego } from "../../Ventana";
import { Cocina2, Gancho, PlatoFinal, Utensilio } from "./Escena";
import { CLARAS, G, INGREDIENTES, PASOS, PLATO } from "./guion";

const E = G.ev;

const APARICIONES: Aparicion[] = [
  { desde: E.huevo1 + 10, hasta: E.huevo1 + 70, tipo: "asomada", frase: "¡Sin yema!", lado: "der" },
  { desde: E.batirYfin, hasta: E.batirYfin + 60, tipo: "probando", frase: "¡Mmm!", lado: "der" },
  { desde: E.azucar3 + 14, hasta: E.picos + 10, tipo: "batiendo", frase: "¡Te ayudo!", lado: "der" },
  { desde: E.reloj1 + 6, hasta: E.reloj1 + 76, tipo: "asomada", frase: "¡Mira cómo suben!", lado: "der" },
  { desde: E.jiggle1, hasta: E.jiggle1 + 56, tipo: "asomada", frase: "¡Qué esponjoso!", lado: "der" },
  { desde: E.completada + 12, hasta: E.cortina3 - 4, tipo: "celebra", frase: "¡Receta nueva!", lado: "der" },
];

export const RECETA: Receta = {
  numero: 1,
  nombre: "Pancakes japoneses",
  sprite: "huevo",
  porciones: "Para 3 pancakes",
  tiempo: "45 min",
  ingredientes: INGREDIENTES,
  utensilios: ["2 boles", "varillas", "batidora", "tamiz", "sartén con tapa"],
  pasos: PASOS,
  intro: "Receta japonesa original: altos, esponjosos y temblorosos.",
  g: G,
  apariciones: APARICIONES,
  barras: [{ etiqueta: "Esponjoso", desde: E.batidora, hasta: E.picos, x: CLARAS.x, y: 160 }],
  plato: { dibujo: <PlatoFinal p={P} />, cx: PLATO.x, cy: PLATO.y - 60 },
};

const Ventana: React.FC = () => (
  <VentanaJuego r={RECETA} gancho={<Gancho p={P} />} cocina={<Cocina2 p={P} />} carga={(que, frame) => <Utensilio p={P} que={que} frame={frame} />} />
);

export const PancakesTikTok: React.FC<{ zonaSegura: boolean }> = ({ zonaSegura }) => <MarcoTikTok r={RECETA} ventana={<Ventana />} zonaSegura={zonaSegura} />;

export const PancakesTikTokComposition: React.FC = () => (
  <Folder name="OyatsuTime-01">
    <Composition id="OyatsuTime-01-pancakes-japoneses" component={PancakesTikTok} durationInFrames={G.duracion} fps={30} width={1080} height={1920} defaultProps={{ zonaSegura: false }} />
    <Composition id="OyatsuTime-01-pancakes-japoneses-zona-segura" component={PancakesTikTok} durationInFrames={G.duracion} fps={30} width={1080} height={1920} defaultProps={{ zonaSegura: true }} />
  </Folder>
);
