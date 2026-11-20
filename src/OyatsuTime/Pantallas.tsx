// Pantallas comunes del juego おやつタイム (dentro de la ventana 1200×900).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Encaje, Sprite, Vichy } from "../CocinaDulce/Deco";
import { BotonP, Cocina } from "../CocinaDulce/disenos/Escenas";
import { Miniatura } from "./Interfaz";
import { BOTON_COCINAR, BOTON_GUARDAR, BOTON_JUGAR, huecoInventario, inventario } from "./posiciones";
import { borde, FUENTES, MARCA, P, texto } from "./tema";
import type { Receta } from "./tipos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Logo: おやつタイム grande + Oyatsu Time pequeño al costado. */
export const Logo: React.FC<{ tam: number; romaji?: number; style?: React.CSSProperties }> = ({ tam, romaji = tam * 0.34, style }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: tam * 0.12, ...style }}>
    <div style={{ fontFamily: FUENTES.japones, fontSize: tam, lineHeight: 1, ...texto(P, "#FFFFFF", tam * 0.13) }}>{MARCA.japones}</div>
    <div style={{ fontFamily: FUENTES.redonda, fontSize: romaji, lineHeight: 1.1, marginBottom: tam * 0.08, ...texto(P, P.ui, romaji * 0.2) }}>{MARCA.romaji}</div>
  </div>
);

const numero = (n: number) => `Receta nº ${n}`;

export const MenuJuego: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const logo = spring({ frame: frame - E.menu, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill>
      <Cocina p={P} />
      <AbsoluteFill style={{ backgroundColor: `${P.exterior}B3` }} />
      <Logo tam={150} style={{ position: "absolute", top: 80, width: "100%", transform: `scale(${logo}) rotate(-3deg)` }} />
      <div style={{ position: "absolute", left: 470, top: 340, width: 620, height: 470, borderRadius: 36, backgroundColor: P.panel, border: borde(P, 6), boxShadow: `0 12px 0 ${P.contorno}` }}>
        <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, color: P.texto }}>
          {numero(r.numero)} · {r.nombre}
        </div>
      </div>
      <BotonP p={P} x={BOTON_JUGAR.x} y={BOTON_JUGAR.y} w={460} texto="Jugar" icono="▶" tam={52} presionado={frame >= E.clicJugar && frame < E.clicJugar + 6} />
      <BotonP p={P} x={780} y={608} w={460} texto="Libro de recetas" color={P.acento} tam={40} />
      <BotonP p={P} x={780} y={728} w={460} texto="Opciones" color={P.maderaOscura} tam={40} />
    </AbsoluteFill>
  );
};

/** Inventario de ingredientes con cantidades + aviso "¡Saca captura!". */
export const Inventario: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const n = r.ingredientes.length;
  const geo = inventario(n);
  const captura = spring({ frame: frame - E.captura, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Vichy tam={50} color={`${P.ui}22`} fondo={P.panel} />
      <div style={{ position: "absolute", top: 36, left: 70, fontFamily: FUENTES.redonda, fontSize: 72, ...texto(P, P.ui, 12) }}>Ingredientes</div>
      <div style={{ position: "absolute", top: 130, left: 74, fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, color: P.texto }}>
        {r.porciones} · {r.tiempo}
      </div>
      {/* aviso de captura */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 50,
          padding: "12px 24px",
          borderRadius: 22,
          backgroundColor: P.acento,
          border: borde(P, 5),
          boxShadow: `0 7px 0 ${P.contorno}`,
          fontFamily: FUENTES.pixel,
          fontWeight: 700,
          fontSize: 38,
          color: P.texto,
          transform: `rotate(4deg) scale(${1 + 0.12 * captura * (1 - captura) * 4 + Math.sin(frame / 8) * 0.02})`,
        }}
      >
        📸 ¡Saca captura!
      </div>
      {r.ingredientes.map((ing, i) => {
        const c = huecoInventario(i, n);
        const ok = frame >= E[`ing${i}`];
        const s = ok ? spring({ frame: frame - E[`ing${i}`], fps, config: { damping: 8 } }) : 0;
        const entra = spring({ frame: frame - E.ingredientes - i * 3, fps, config: { damping: 12 } });
        const L = geo.lado;
        return (
          <div key={ing.s + i} style={{ position: "absolute", left: c.x - L / 2, top: c.y - L / 2, width: L, height: L, transform: `scale(${entra * (1 + 0.25 * s * (1 - s))})` }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 26,
                backgroundColor: ok ? "#FFF6D6" : "#FFFFFF",
                border: borde(P, 5),
                boxShadow: ok ? `0 0 0 7px ${P.acento}, 0 8px 0 7px ${P.contorno}` : `0 8px 0 ${P.contorno}`,
              }}
            />
            <div style={{ position: "absolute", inset: 10, borderRadius: 18, border: `3px dashed ${P.ui}55` }} />
            <Sprite n={ing.s} tam={L * 0.5} style={{ position: "absolute", left: L * 0.25, top: L * 0.1 }} />
            {/* cantidad */}
            <div style={{ position: "absolute", right: -14, top: -14, padding: "2px 12px", borderRadius: 14, backgroundColor: P.ui, border: borde(P, 4), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 34, ...texto(P, "#FFFFFF", 6) }}>
              {ing.cant}
            </div>
            <div style={{ position: "absolute", left: 4, right: 4, bottom: 10, textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 25, lineHeight: 1.05, color: P.texto }}>{ing.nombre}</div>
            {ok && <div style={{ position: "absolute", left: -12, top: -12, width: 48, height: 48, borderRadius: 14, backgroundColor: P.ui, border: borde(P, 4), color: "#FFFFFF", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>✓</div>}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: geo.ys[geo.ys.length - 1] + geo.lado / 2 + 34, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 27, color: P.texto }}>
        🥄 {r.utensilios.join(" · ")}
      </div>
      <BotonP p={P} x={BOTON_COCINAR.x} y={BOTON_COCINAR.y} w={420} texto="¡A cocinar!" icono="▶" tam={44} presionado={frame >= E.clicCocinar && frame < E.clicCocinar + 6} />
    </AbsoluteFill>
  );
};

/** Flores que giran alrededor de un centro. */
const Flores: React.FC<{ cx: number; cy: number; radio: number; n?: number }> = ({ cx, cy, radio, n = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + frame / 50;
        return (
          <Sprite
            key={i}
            n={i % 2 ? "flor" : "estrella"}
            tam={i % 2 ? 64 : 52}
            style={{ position: "absolute", left: cx + Math.cos(a) * radio - 30, top: cy + Math.sin(a) * radio * 0.7 - 30, transform: `rotate(${frame * 3 + i * 40}deg)` }}
          />
        );
      })}
    </>
  );
};

/** "¡Has conseguido una receta nueva!" con botón ♡ Guardar y sello ¡Guardada!. */
export const RecetaNueva: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const s = spring({ frame: frame - E.completada, fps, config: { damping: 10 } });
  const sello = spring({ frame: frame - E.guardada, fps, config: { damping: 9, mass: 0.8 } });
  const guardada = frame >= E.guardada;
  return (
    <AbsoluteFill>
      <Vichy tam={46} color={`${P.ui}22`} fondo={P.exterior} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})` }}>
        <Encaje x={130} y={50} w={940} h={680} color={P.ui} fondo={<Vichy tam={46} color={`${P.ui}22`} fondo={P.panel} />}>
          <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 56, lineHeight: 1.1, ...texto(P, P.acento, 11) }}>
            ¡Has conseguido
            <br />
            una receta nueva!
          </div>
          <Flores cx={470} cy={350} radio={230} />
          <Miniatura cx={r.plato.cx} cy={r.plato.cy} k={0.62} w={420} h={300} style={{ left: 260, top: 190 }}>
            {r.plato.dibujo}
          </Miniatura>
          <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 56, ...texto(P, P.ui, 11) }}>{r.nombre}</div>
          <div style={{ position: "absolute", top: 596, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 32, color: P.texto }}>
            {numero(r.numero)} · ★ {r.pasos.length * 100} puntos
          </div>
        </Encaje>
      </div>
      <BotonP p={P} x={BOTON_GUARDAR.x} y={BOTON_GUARDAR.y} w={380} texto="Guardar" icono="♡" tam={46} presionado={frame >= E.clicGuardar && frame < E.clicGuardar + 6} />
      {guardada && (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 400,
            padding: "14px 30px",
            borderRadius: 20,
            border: `9px solid ${P.uiOscuro}`,
            color: P.uiOscuro,
            backgroundColor: "#FFFFFFCC",
            fontFamily: FUENTES.pixel,
            fontWeight: 700,
            fontSize: 70,
            transform: `rotate(-14deg) scale(${interpolate(sello, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, sello * 2),
          }}
        >
          ¡Guardada! ♡
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Libro de recetas abierto en la receta recién guardada. */
export const Libro: React.FC<{ r: Receta }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const E = r.g.ev;
  const abre = spring({ frame: frame - E.libro, fps, config: { damping: 13 } });
  const nueva = spring({ frame: frame - E.libro - 16, fps, config: { damping: 8 } });
  const pagina: React.CSSProperties = { position: "absolute", top: 120, width: 500, height: 680, backgroundColor: "#FFFDF7", border: borde(P, 6), backgroundImage: `repeating-linear-gradient(transparent 0 46px, ${P.ui}22 46px 49px)` };
  return (
    <AbsoluteFill>
      <Vichy tam={46} color={`${P.ui}22`} fondo={P.exterior} />
      <div style={{ position: "absolute", left: 90, top: 100, width: 1020, height: 720, borderRadius: 34, backgroundColor: P.ui, border: borde(P, 6), boxShadow: `0 14px 0 ${P.contorno}` }} />
      <div style={{ position: "absolute", inset: 0, transform: `scaleX(${abre})` }}>
        {/* página izquierda: índice */}
        <div style={{ ...pagina, left: 100, borderRadius: "26px 6px 6px 26px", top: 110 }}>
          <div style={{ marginTop: 26, textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 46, ...texto(P, P.ui, 9) }}>Libro de recetas</div>
          {Array.from({ length: 6 }, (_, i) => {
            const n = i + 1;
            const esta = n === r.numero;
            const conocida = n < r.numero;
            return (
              <div
                key={n}
                style={{
                  margin: "16px 30px 0",
                  padding: "10px 16px",
                  borderRadius: 16,
                  border: borde(P, 4),
                  backgroundColor: esta ? "#FFF3C4" : conocida ? "#FFFFFF" : "#EFE6EA",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FUENTES.pixel,
                  fontWeight: 700,
                  fontSize: 30,
                  color: esta || conocida ? P.texto : `${P.texto}66`,
                  transform: esta ? `scale(${1 + 0.06 * Math.sin(frame / 6) * nueva})` : undefined,
                  boxShadow: esta ? `0 0 0 6px ${P.acento}` : undefined,
                }}
              >
                <span style={{ color: P.uiOscuro }}>Nº {n}</span>
                <span>{esta ? r.nombre : conocida ? "· · ·" : "???"}</span>
                {esta && <span style={{ marginLeft: "auto", fontSize: 24, padding: "2px 10px", borderRadius: 10, backgroundColor: P.ui, color: "#FFFFFF", transform: `scale(${nueva})` }}>¡NUEVA!</span>}
              </div>
            );
          })}
        </div>
        {/* página derecha: la receta */}
        <div style={{ ...pagina, left: 600, borderRadius: "6px 26px 26px 6px", top: 110 }}>
          <div style={{ marginTop: 22, textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 30, color: P.uiOscuro }}>{numero(r.numero)}</div>
          <div style={{ textAlign: "center", fontFamily: FUENTES.redonda, fontSize: 46, ...texto(P, P.ui, 9) }}>{r.nombre}</div>
          <Miniatura cx={r.plato.cx} cy={r.plato.cy} k={0.5} w={420} h={250} style={{ left: 40, top: 150 }}>
            {r.plato.dibujo}
          </Miniatura>
          <div style={{ position: "absolute", top: 420, left: 30, right: 30, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {r.ingredientes.map((ing, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 12, backgroundColor: "#FFFFFF", border: borde(P, 3), fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 22, color: P.texto }}>
                <Sprite n={ing.s} tam={34} />
                {ing.cant}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: FUENTES.pixel, fontWeight: 700, fontSize: 28, color: P.texto, opacity: interpolate(frame, [E.libro + 30, E.libro + 40], [0, 1], clamp) }}>
            ★ {r.pasos.length * 100} · {r.tiempo} · ♡ guardada
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
