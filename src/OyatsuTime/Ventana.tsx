// Ventana de juego común (vista 1050×900): cambia de pantalla según el guion y dibuja la interfaz.
// Las pantallas comunes se dibujan en la vista; la cocina (lienzo 1200) se ve con la cámara CAMARA_COCINA.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Despensa } from "./Despensa";
import { BarraProgreso, Cinta, Cortina, CursorJuego, MasPuntos, posicionCursor } from "./Interfaz";
import { NubeEnVentana } from "./Nube";
import { Gancho, Inventario, Libro, MenuJuego, RecetaNueva } from "./Pantallas";
import { CAMARA_COCINA, huecoDespensa, INDICADOR, VISTA } from "./posiciones";
import { P } from "./tema";
import { pasoActual, pasoInicio, type Receta } from "./tipos";

export const VentanaJuego: React.FC<{
  r: Receta;
  /** Escena de la cocina durante los pasos (lienzo lógico 1200×900). */
  cocina: React.ReactNode;
  /** Lo que el cursor lleva en la mano. */
  carga?: (que: string, frame: number) => React.ReactNode;
}> = ({ r, cocina, carga }) => {
  const frame = useCurrentFrame();
  const E = r.g.ev;
  const paso = pasoActual(r, frame);
  const enCocina = frame >= E.cortina2 && frame < E.completada;
  const items = paso >= 0 ? r.pasos[paso].items : [];
  const enMano = r.g.cargas.find(([a, b]) => frame >= a && frame < b);
  const cursor = posicionCursor(r.g, frame);
  const resaltado = enMano ? -1 : items.findIndex((_, i) => Math.hypot(cursor.x - huecoDespensa(i, items.length).x, cursor.y - huecoDespensa(i, items.length).y) < 60);
  const inicio = pasoInicio(r);
  const cursorVisible = frame >= E.menu && frame < E.cortina3;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: P.pared, width: VISTA.ancho, height: VISTA.alto }}>
      {frame < E.menu && <Gancho r={r} />}
      {frame >= E.menu && frame < E.cortina1 && <MenuJuego r={r} />}
      {frame >= E.cortina1 && frame < E.cortina2 && <Inventario r={r} />}
      {frame >= E.completada && frame < E.cortina3 && <RecetaNueva r={r} />}
      {frame >= E.cortina3 && <Libro r={r} />}

      {enCocina ? (
        <div style={{ position: "absolute", left: CAMARA_COCINA, top: 0, width: 1200, height: 900 }}>
          {cocina}
          {items.length > 0 && <Despensa items={items} resaltado={resaltado >= 0 ? resaltado : undefined} enMano={enMano?.[2]} />}
          {(r.barras ?? []).map((b) => (
            <BarraProgreso key={b.etiqueta + b.desde} {...b} x={INDICADOR.x} y={INDICADOR.y} />
          ))}
          <CursorJuego g={r.g} visible={cursorVisible} carga={carga} />
        </div>
      ) : (
        <CursorJuego g={r.g} visible={cursorVisible} carga={carga} />
      )}

      {enCocina && paso >= 0 && <Cinta n={paso + 1} titulo={r.pasos[paso].titulo} desde={inicio[paso]} />}
      {r.pasos.map((_, i) => (
        <MasPuntos key={i} desde={E[`puntos${i}`]} />
      ))}
      <NubeEnVentana apariciones={r.apariciones} />
      <Cortina centro={E.cortina1} id="c1" />
      <Cortina centro={E.cortina2} id="c2" />
      <Cortina centro={E.cortina3} id="c3" />
    </AbsoluteFill>
  );
};
