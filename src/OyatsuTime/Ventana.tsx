// Ventana de juego común (1200×900): cambia de pantalla según el guion y dibuja la interfaz.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Despensa } from "../CocinaDulce/disenos/Escenas";
import { BarraProgreso, Cinta, Cortina, CursorJuego, MasPuntos, posicionCursor } from "./Interfaz";
import { NubeEnVentana } from "./Nube";
import { Inventario, Libro, MenuJuego, RecetaNueva } from "./Pantallas";
import { huecoDespensa } from "./posiciones";
import { P } from "./tema";
import { pasoActual, pasoInicio, type Receta } from "./tipos";

export const VentanaJuego: React.FC<{
  r: Receta;
  /** Pantalla del gancho (resultado final). */
  gancho: React.ReactNode;
  /** Escena de la cocina durante los pasos. */
  cocina: React.ReactNode;
  /** Lo que el cursor lleva en la mano. */
  carga?: (que: string, frame: number) => React.ReactNode;
}> = ({ r, gancho, cocina, carga }) => {
  const frame = useCurrentFrame();
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  const enCocina = frame >= E.cortina2 && frame < E.completada;
  const items = paso >= 0 ? r.pasos[paso].items : [];
  const enMano = r.g.cargas.find(([a, b]) => frame >= a && frame < b);
  const cursor = posicionCursor(r.g, frame);
  const resaltado = enMano ? -1 : items.findIndex((_, i) => Math.hypot(cursor.x - huecoDespensa(i, items.length).x, cursor.y - huecoDespensa(i, items.length).y) < 55);
  const inicio = pasoInicio(r);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: P.pared }}>
      {frame < E.menu && gancho}
      {frame >= E.menu && frame < E.cortina1 && <MenuJuego r={r} />}
      {frame >= E.cortina1 && frame < E.cortina2 && <Inventario r={r} />}
      {enCocina && cocina}
      {frame >= E.completada && frame < E.cortina3 && <RecetaNueva r={r} />}
      {frame >= E.cortina3 && <Libro r={r} />}

      {enCocina && items.length > 0 && <Despensa p={P} items={items} resaltado={resaltado >= 0 ? resaltado : undefined} enMano={enMano?.[2]} />}
      {enCocina && (r.barras ?? []).map((b) => <BarraProgreso key={b.etiqueta + b.desde} {...b} />)}
      {enCocina && paso >= 0 && <Cinta n={paso + 1} total={r.pasos.length} titulo={r.pasos[paso].titulo} desde={inicio[paso]} />}
      {r.pasos.map((_, i) => (
        <MasPuntos key={i} desde={E[`puntos${i}`]} />
      ))}

      <NubeEnVentana apariciones={r.apariciones} />
      <CursorJuego g={r.g} visible={frame >= E.menu && frame < E.cortina3} carga={carga} />
      <Cortina centro={E.cortina1} id="c1" />
      <Cortina centro={E.cortina2} id="c2" />
      <Cortina centro={E.cortina3} id="c3" />
    </AbsoluteFill>
  );
};
