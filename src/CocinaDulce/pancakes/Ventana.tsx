import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cursor, Destello, Encaje, Sprite, Vichy } from "../Deco";
import { Escribir } from "../Juego";
import { C } from "../tema";
import { Conejita } from "../disenos/Conejita";
import { BotonP, borde, Cocina, Despensa, texto } from "../disenos/Escenas";
import type { Paleta } from "../disenos/paletas";
import { Batidor, Bol, Lienzo, MediaFresa, Pancake, Plato, Sarten } from "./Objetos";
import { CARGA, CLICKS, CURSOR, INGREDIENTES, MESA, SLOT_X, SLOT_Y, T } from "./tiempos";

export const ANCHO = 1200;
export const ALTO = 900;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sfx = (n: string) => staticFile(`audio/kawaii/${n}`);
const prog = (frame: number, r: readonly [number, number]) => interpolate(frame, [...r], [0, 1], clamp);

const DORADO = "#E2A253";
const LADO = "#F8DDAA";
const CRUDO = "#FFF1D6";

export const posicionCursor = (frame: number) => {
  let i = 0;
  while (i < CURSOR.length - 2 && frame > CURSOR[i + 1][0]) i++;
  const [f0, x0, y0] = CURSOR[i];
  const [f1, x1, y1] = CURSOR[i + 1];
  const t = interpolate(frame, [f0, f1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
};

/** Cortina con forma de corazón que se cierra y se abre en `centro`. */
const Cortina: React.FC<{ p: Paleta; centro: number; id: string }> = ({ p, centro, id }) => {
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
        <pattern id={`pt-${id}`} width={60} height={60} patternUnits="userSpaceOnUse">
          <rect width={60} height={60} fill={p.ui} />
          <circle cx={15} cy={15} r={7} fill="#FFFFFF77" />
          <circle cx={45} cy={45} r={7} fill="#FFFFFF77" />
        </pattern>
      </defs>
      <rect width={ANCHO} height={ALTO} fill={`url(#pt-${id})`} mask={`url(#m-${id})`} />
    </svg>
  );
};

/** Pila pequeña de pancakes para iconos (premio, libro). */
export const MiniPila: React.FC<{ p: Paleta; tam: number }> = ({ p, tam }) => (
  <svg viewBox="0 0 300 300" width={tam} height={tam} style={{ overflow: "visible" }}>
    <ellipse cx={150} cy={250} rx={140} ry={36} fill="#FFFFFF" stroke={p.contorno} strokeWidth={6} />
    {[0, 1, 2].map((i) => (
      <Pancake key={i} p={p} x={150} yBase={240 - i * 50} rx={100} ry={28} h={54} arriba={DORADO} lado={LADO} />
    ))}
    <path d="M70 92 Q 150 60 230 92 L 228 120 Q 220 140 214 118 L 200 104 Q 150 112 104 104 L 92 126 Q 84 140 78 120 Z" fill="#F2A93BCC" />
    <MediaFresa p={p} x={115} y={70} rot={-20} s={0.8} />
    <MediaFresa p={p} x={185} y={74} rot={18} s={0.8} />
    <rect x={132} y={56} width={36} height={22} rx={7} fill="#FFE58A" stroke={p.contorno} strokeWidth={4} />
  </svg>
);

const Menu: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 4, fps, config: { damping: 9 } });
  const panel = spring({ frame: frame - 14, fps, config: { damping: 12 } });
  const salta = Math.abs(Math.sin(frame / 7)) * 14;
  return (
    <AbsoluteFill>
      <Cocina p={p} />
      <AbsoluteFill style={{ backgroundColor: `${p.exterior}B3` }} />
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", transform: `scale(${logo}) rotate(-3deg)` }}>
        <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, "#FFFFFF", 22) }}>Cocina</div>
        <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, p.ui, 22) }}>Dulce ♡</div>
      </div>
      <Destello x={250} y={110} tam={60} color={p.acento} />
      <Destello x={960} y={250} tam={50} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - panel) * 500}px)` }}>
        <div style={{ position: "absolute", left: 470, top: 360, width: 620, height: 470, borderRadius: 36, backgroundColor: p.panel, border: borde(p, 6), boxShadow: `0 12px 0 ${p.contorno}` }}>
          <div style={{ position: "absolute", inset: 12, borderRadius: 26, border: `4px dashed ${p.ui}88` }} />
          <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 32, color: p.texto }}>
            Receta nº 2 · Pancakes japoneses
          </div>
        </div>
        <BotonP p={p} x={780} y={488} w={460} texto="Jugar" icono="▶" tam={52} presionado={frame >= T.clickJugar && frame < T.clickJugar + 6} />
        <BotonP p={p} x={780} y={608} w={460} texto="Libro de recetas" color={p.acento} tam={40} />
        <BotonP p={p} x={780} y={728} w={460} texto="Opciones" color={p.maderaOscura} tam={40} />
      </div>
      <div style={{ position: "absolute", left: 100, top: 410, width: 330, height: 360, borderRadius: "50%", backgroundColor: "#FFFFFF88" }} />
      <Conejita p={p} px={13} pose={Math.floor(frame / 12) % 2 ? "brazos" : "feliz"} style={{ position: "absolute", left: 105, top: 430 - salta }} />
      <div style={{ position: "absolute", left: 60, top: 820, width: 400, textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.texto }}>
        ¡Hola! Soy Nube ♡
      </div>
    </AbsoluteFill>
  );
};

const Burbuja: React.FC<{ p: Paleta; texto: string; desde: number; hasta: number }> = ({ p, texto: t, desde, hasta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < desde || frame > hasta) return null;
  const s = spring({ frame: frame - desde, fps, config: { damping: 9 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 34,
        top: 588,
        transform: `scale(${s})`,
        transformOrigin: "15% 100%",
        backgroundColor: "#FFFFFF",
        border: borde(p, 5),
        borderRadius: 22,
        padding: "8px 22px",
        fontFamily: C.pixel,
        fontWeight: 700,
        fontSize: 38,
        color: p.ui,
        whiteSpace: "nowrap",
      }}
    >
      <Escribir texto={t} desde={desde} vel={2} />
    </div>
  );
};

/** Contenido del bol según el avance de la receta. */
const ContenidoBol: React.FC<{ p: Paleta; frame: number }> = ({ frame }) => {
  const y = MESA.y - 70;
  const leche = prog(frame, T.leche);
  const harina = prog(frame, T.harina);
  const batir = prog(frame, T.batir);
  const huevos = T.cascar.filter((c) => frame >= c).length;
  const liquido = interpolateColors(harina, [0, 1], ["#FFF6DF", "#F6E2BC"]);
  const color = batir > 0 ? interpolateColors(batir, [0, 1], ["#F6E2BC", "#FFFBF2"]) : liquido;
  const nivel = Math.min(1, leche + huevos * 0.15);
  return (
    <>
      {nivel > 0 && <ellipse cx={MESA.x} cy={y + 18 - 10 * nivel} rx={120 + 60 * nivel} ry={28 + 14 * nivel} fill={color} stroke="#E6CFA4" strokeWidth={4} />}
      {[
        [430, y + 14],
        [510, y + 20],
      ]
        .slice(0, huevos)
        .map(([x, yy], i) => (
          <g key={i} opacity={1 - leche * 0.8}>
            <ellipse cx={x} cy={yy} rx={56} ry={18} fill="#FFFFFF" stroke="#EDE3D6" strokeWidth={3} />
            <circle cx={x} cy={yy - 3} r={17} fill="#FFC83D" stroke="#E8A63A" strokeWidth={3} />
            <circle cx={x - 5} cy={yy - 8} r={5} fill="#FFFFFF" opacity={0.7} />
          </g>
        ))}
      {batir > 0 && batir < 1 && (
        <g transform={`translate(${MESA.x} ${y + 10}) scale(1 0.26) rotate(${frame * 20})`}>
          <path d="M0 0 C 40 -10 60 30 30 60 C -10 100 -90 60 -90 0 C -90 -90 20 -150 110 -110" fill="none" stroke="#E9D3AE" strokeWidth={14} strokeLinecap="round" />
        </g>
      )}
    </>
  );
};

/** Merengue esponjoso que asoma por encima del bol al batir. */
const Espuma: React.FC<{ frame: number }> = ({ frame }) => {
  const b = prog(frame, T.batir);
  if (b <= 0) return null;
  const y = MESA.y - 70;
  const nubes: [number, number, number][] = [
    [-120, 0, 34],
    [-60, -14, 44],
    [0, -22, 52],
    [64, -12, 44],
    [122, 2, 32],
    [-30, -40, 30],
    [36, -44, 32],
  ];
  return (
    <g>
      {nubes.map(([dx, dy, r], i) => (
        <circle key={i} cx={MESA.x + dx} cy={y + 6 + dy * b} r={r * b} fill="#FFFDF7" stroke="#EADBC3" strokeWidth={3} />
      ))}
      <path d={`M${MESA.x - 4} ${y - 60 * b} q 10 -${30 * b} 22 -${8 * b}`} stroke="#EADBC3" strokeWidth={4} fill="#FFFDF7" />
    </g>
  );
};

const PantallaCocina: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cursor = posicionCursor(frame);
  const carga = CARGA.find(([a, b]) => frame >= a && frame < b);
  const pasoActual = T.pasos.findIndex((_, i) => frame < (T.pasos[i + 1]?.banner ?? Infinity));
  const paso = T.pasos[pasoActual];
  const hechos = T.pasos.filter((ps) => frame >= ps.fin).length;
  const resaltado = carga ? undefined : SLOT_Y.findIndex((y) => Math.hypot(cursor.x - SLOT_X, cursor.y - y) < 60);

  // Desplazamientos de los objetos de la mesa
  const dxBol = interpolate(frame, [T.bolSale, T.bolSale + 16], [0, -1000], { ...clamp, easing: Easing.in(Easing.quad) });
  const dxSarten =
    interpolate(frame, [T.sartenEntra, T.sartenEntra + 20], [1000, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) }) +
    interpolate(frame, [T.sartenSale, T.sartenSale + 16], [0, -1000], { ...clamp, easing: Easing.in(Easing.quad) });
  const dxPlato = interpolate(frame, [T.platoEntra, T.platoEntra + 18], [1000, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

  // Pancakes en la sartén
  const subir = prog(frame, T.subir);
  const vuelta = interpolate(frame, [T.voltear + 1, T.voltear + 21], [0, 1], clamp);
  const ultimoBoing = [...T.boings].reverse().find((b) => frame >= b);
  const temblor = ultimoBoing !== undefined ? Math.sin((frame - ultimoBoing) * 0.9) * Math.exp(-(frame - ultimoBoing) / 12) * 0.16 : 0;
  const PX = [340, 470, 600];

  const miel = prog(frame, T.miel);
  const mantequilla = spring({ frame: frame - T.mantequilla, fps, config: { damping: 8 } });
  const topeY = MESA.y + 40 - 2 * 62 - 70;

  return (
    <AbsoluteFill>
      <Cocina p={p} />
      {/* tabla de cortar */}
      <div style={{ position: "absolute", left: 200, top: 590, width: 560, height: 290, borderRadius: 40, backgroundColor: p.madera, border: borde(p, 5), boxShadow: `0 8px 0 ${p.contorno}` }} />

      {/* Paso 1–3: bol */}
      {frame < T.bolSale + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxBol}px)` }}>
          <Bol p={p} x={MESA.x} y={MESA.y} contenido={<ContenidoBol p={p} frame={frame} />} encima={<Espuma frame={frame} />} />
        </div>
      )}
      {/* cáscaras al cascar */}
      {T.cascar.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 18) return null;
        return (
          <svg key={c} width={ANCHO} height={ALTO} style={{ position: "absolute", inset: 0 }}>
            {[-1, 1].map((lado) => (
              <path
                key={lado}
                d="M-26 0 A 26 32 0 0 1 26 0 L 14 -6 L 4 4 L -6 -6 L -16 4 Z"
                transform={`translate(${470 + lado * (10 + t * 5)} ${600 + t * 3 + t * t * 0.3}) rotate(${lado * (30 + t * 8)}) scale(1 -1)`}
                fill="#F2B27A"
                stroke={p.contorno}
                strokeWidth={4}
                opacity={1 - t / 18}
              />
            ))}
          </svg>
        );
      })}

      {/* Paso 4: sartén */}
      {frame >= T.sartenEntra && frame < T.sartenSale + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxSarten}px)` }}>
          <Sarten
            p={p}
            x={MESA.x}
            y={MESA.y}
            calor={1}
            dentro={
              <>
                {PX.map((x, i) => {
                  const aparece = spring({ frame: frame - T.masa[i], fps, config: { damping: 10 } });
                  if (frame < T.masa[i]) return null;
                  const h = (22 + 70 * subir) * aparece;
                  const salto = Math.sin(vuelta * Math.PI) * 170;
                  const giro = Math.abs(Math.cos(vuelta * Math.PI));
                  const sy = (vuelta > 0 && vuelta < 1 ? Math.max(0.15, giro) : 1) * (1 + temblor);
                  const sx = 1 - temblor * 0.6;
                  const hecho = vuelta >= 0.5;
                  const base = MESA.y - 4;
                  return (
                    <g key={x} transform={`translate(0 ${-salto}) translate(${x} ${base}) scale(${sx} ${sy}) translate(${-x} ${-base})`}>
                      <Pancake p={p} x={x} yBase={base} rx={58} ry={18} h={h} arriba={hecho ? DORADO : CRUDO} lado={hecho ? LADO : "#FFF7EA"} />
                    </g>
                  );
                })}
                {subir > 0.2 &&
                  PX.map((x, i) => (
                    <path
                      key={`v${i}`}
                      d={`M${x} ${MESA.y - 130} q 16 -30 0 -60 q -16 -30 0 -60`}
                      stroke="#FFFFFF"
                      strokeWidth={9}
                      fill="none"
                      strokeLinecap="round"
                      opacity={0.45}
                      transform={`translate(0 ${-((frame * 2 + i * 22) % 50)})`}
                    />
                  ))}
              </>
            }
          />
        </div>
      )}

      {/* Paso 5: plato con la pila */}
      {frame >= T.platoEntra && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxPlato}px)` }}>
          <Plato p={p} x={MESA.x} y={MESA.y + 40} />
          <Lienzo>
            {T.pila.map((f, i) => {
              if (frame < f) return null;
              const s = spring({ frame: frame - f, fps, config: { damping: 10, stiffness: 140 } });
              return (
                <g key={f} transform={`translate(0 ${(1 - s) * -600})`}>
                  <Pancake p={p} x={MESA.x} yBase={MESA.y + 40 - i * 62} rx={138} ry={36} h={70} arriba={DORADO} lado={LADO} />
                </g>
              );
            })}
            {miel > 0 && (
              <g opacity={0.9}>
                <ellipse cx={MESA.x} cy={topeY} rx={125 * Math.min(1, miel * 1.4)} ry={32 * Math.min(1, miel * 1.4)} fill="#F2A93B" opacity={0.75} />
                {[
                  [-118, 0.3, 90],
                  [-70, 0.45, 150],
                  [40, 0.55, 120],
                  [105, 0.4, 170],
                ].map(([dx, d, largo], i) => {
                  const l = interpolate(miel, [d, 1], [0, largo], clamp);
                  const x = MESA.x + dx;
                  const y0 = topeY + Math.sqrt(Math.max(0, 1 - (dx / 138) ** 2)) * 30;
                  return <path key={i} d={`M${x} ${y0} L ${x} ${y0 + l}`} stroke="#F2A93B" strokeWidth={16} strokeLinecap="round" />;
                })}
              </g>
            )}
            {frame >= T.mantequilla && (
              <g transform={`translate(${MESA.x} ${topeY - 16}) scale(${mantequilla})`}>
                <rect x={-26} y={-16} width={52} height={30} rx={8} fill="#FFE58A" stroke={p.contorno} strokeWidth={4} />
                <rect x={-18} y={-11} width={18} height={6} rx={3} fill="#FFFFFF" opacity={0.7} />
              </g>
            )}
            {T.fresas.map((f, i) => {
              if (frame < f) return null;
              const s = spring({ frame: frame - f, fps, config: { damping: 8 } });
              return <MediaFresa key={f} p={p} x={i ? 535 : 405} y={topeY - 10 + i * 6} rot={i ? 18 : -20} s={s} />;
            })}
          </Lienzo>
          {frame >= T.pasos[4].fin &&
            [
              [300, 520],
              [660, 500],
              [640, 820],
              [290, 800],
            ].map(([x, y], i) => <Destello key={i} x={x} y={y} tam={60} fase={i * 1.4} color={i % 2 ? p.acento : "#FFFFFF"} />)}
        </div>
      )}

      {/* Medidor al batir */}
      {frame >= T.batir[0] - 10 && frame < T.pasos[2].fin + 20 && (
        <div style={{ position: "absolute", left: 560, top: 300, display: "flex", alignItems: "center", gap: 12, backgroundColor: p.panel, border: borde(p, 5), borderRadius: 20, padding: "8px 18px" }}>
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 28, color: p.texto }}>Esponjoso</div>
          <div style={{ width: 160, height: 24, borderRadius: 12, border: borde(p, 4), backgroundColor: "#FFFFFF", overflow: "hidden" }}>
            <div style={{ width: `${prog(frame, T.batir) * 100}%`, height: "100%", backgroundColor: p.ui }} />
          </div>
        </div>
      )}

      <Despensa p={p} items={INGREDIENTES} resaltado={resaltado !== undefined && resaltado >= 0 ? resaltado : undefined} enMano={carga?.[2]} />

      {/* Cinta de instrucción */}
      {paso && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 92, borderRadius: 24, backgroundColor: p.ui, border: borde(p, 5), boxShadow: `0 8px 0 ${p.contorno}`, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
          <div style={{ position: "absolute", inset: 8, borderRadius: 16, border: "3px dashed #FFFFFFAA" }} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 38, ...texto(p, p.acento, 7) }}>PASO {pasoActual + 1}/5</div>
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 42, ...texto(p, "#FFFFFF", 7) }}>
            <Escribir key={pasoActual} texto={paso.texto} desde={paso.banner} />
          </div>
        </div>
      )}

      {/* Nube y sus comentarios */}
      <Conejita
        p={p}
        px={8}
        pose={T.pasos.some((ps) => frame >= ps.fin && frame < ps.fin + 34) ? (Math.floor(frame / 6) % 2 ? "brazos" : "feliz") : "normal"}
        style={{ position: "absolute", left: 20, top: 670 - (T.pasos.some((ps) => frame >= ps.fin && frame < ps.fin + 34) ? Math.abs(Math.sin(frame / 4)) * 20 : 0) }}
      />
      {T.pasos.map((ps) => (
        <Burbuja key={ps.fin} p={p} texto={ps.feedback} desde={ps.fin + 2} hasta={ps.fin + 36} />
      ))}

      {/* Corazones y puntos */}
      <div style={{ position: "absolute", left: 740, top: 820, display: "flex", alignItems: "center", gap: 6, backgroundColor: p.panel, border: borde(p, 5), borderRadius: 18, padding: "2px 14px" }}>
        {T.pasos.map((_, i) => (
          <Sprite key={i} n="corazon" tam={40} style={{ filter: i < hechos ? "none" : "grayscale(1) opacity(0.35)" }} />
        ))}
        <div style={{ width: 4, height: 36, backgroundColor: `${p.contorno}33`, margin: "0 6px" }} />
        <Sprite n="estrella" tam={36} />
        <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 36, color: p.texto, minWidth: 66 }}>{hechos * 100}</div>
      </div>

      {/* Lo que lleva el cursor */}
      {carga && (
        <div
          style={{
            position: "absolute",
            left: cursor.x - 55,
            top: cursor.y - 75,
            transform:
              carga[2] === "leche" && frame >= T.leche[0]
                ? "rotate(-115deg)"
                : carga[2] === "harina" && frame >= T.harina[0]
                  ? `rotate(${-140 + Math.sin(frame) * 10}deg)`
                  : carga[2] === "miel" && frame >= T.miel[0]
                    ? "rotate(-120deg)"
                    : "rotate(-8deg)",
          }}
        >
          <Sprite n={carga[2]} tam={carga[2] === "fresa" ? 80 : 110} />
        </div>
      )}
      {/* chorros */}
      {(frame >= T.leche[0] && frame <= T.leche[1]) || (frame >= T.miel[0] && frame <= T.miel[1]) ? (
        <div
          style={{
            position: "absolute",
            left: cursor.x - 72,
            top: cursor.y - 20,
            width: 14,
            height: frame <= T.leche[1] ? MESA.y - 70 - cursor.y + 30 : 60,
            borderRadius: 7,
            backgroundColor: frame <= T.leche[1] ? "#FFFFFFEE" : "#F2A93BDD",
            border: frame <= T.leche[1] ? "3px solid #EADCE4" : "none",
          }}
        />
      ) : null}
      {/* harina cayendo */}
      {frame >= T.harina[0] &&
        frame <= T.harina[1] + 10 &&
        Array.from({ length: 14 }).map((_, i) => {
          const t = (frame * 3 + i * 17) % 60;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cursor.x - 80 + ((i * 23) % 50),
                top: cursor.y + t * 1.6,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#FFFFFF",
                opacity: (1 - t / 60) * (frame <= T.harina[1] ? 1 : 0.4),
              }}
            />
          );
        })}
      {frame >= T.batir[0] - 5 && frame < T.pasos[2].fin && <Batidor p={p} x={cursor.x} y={cursor.y + 70} rot={Math.sin(frame / 2) * 8} />}

      {/* Sonidos de la cocina */}
      {T.cascar.map((c) => (
        <Audio key={`k${c}`} src={sfx("crack.wav")} from={c} volume={0.6} name="Cascar huevo" />
      ))}
      <Sequence from={T.leche[0]} durationInFrames={T.leche[1] - T.leche[0]} layout="none" name="Leche">
        <Audio src={sfx("chorro.wav")} loop volume={0.5} />
      </Sequence>
      <Sequence from={T.harina[0]} durationInFrames={T.harina[1] - T.harina[0]} layout="none" name="Harina">
        <Audio src={sfx("untar.wav")} loop volume={0.35} />
      </Sequence>
      <Sequence from={T.batir[0]} durationInFrames={T.batir[1] - T.batir[0]} layout="none" name="Batir">
        <Audio src={sfx("batir.wav")} loop volume={0.5} />
      </Sequence>
      <Sequence from={T.sartenEntra + 20} durationInFrames={T.sartenSale - T.sartenEntra - 20} layout="none" name="Chisporroteo">
        <Audio src={staticFile("audio/juego/chisporroteo.wav")} loop volume={0.1} />
      </Sequence>
      {[...T.boings, T.subir[1] - 6].map((b) => (
        <Audio key={`b${b}`} src={sfx("boing.wav")} from={b} volume={0.45} name="Boing" />
      ))}
      <Sequence from={T.miel[0]} durationInFrames={T.miel[1] - T.miel[0]} layout="none" name="Miel">
        <Audio src={sfx("chorro.wav")} loop volume={0.5} />
      </Sequence>
      {[...T.masa, ...T.pila, ...T.fresas, T.mantequilla].map((f, i) => (
        <Audio key={`p${i}`} src={sfx("pop.wav")} from={f} volume={0.35} name="Pop" />
      ))}
      <Audio src={sfx("brillo.wav")} from={T.pasos[4].fin} volume={0.45} name="Brillo" />
    </AbsoluteFill>
  );
};

const RecetaNueva: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marco = spring({ frame: frame - (T.cortina2 + 4), fps, config: { damping: 11 } });
  const tile = spring({ frame: frame - T.jingle, fps, config: { damping: 7 } });
  const nombre = T.jingle + 25;
  const fiesta = frame >= T.jingle;
  return (
    <AbsoluteFill style={{ backgroundColor: p.exterior, backgroundImage: p.exteriorPatron, backgroundSize: p.exteriorTam, backgroundPosition: "0 0, 28px 28px" }}>
      {fiesta &&
        Array.from({ length: 16 }).map((_, i) => {
          const y = ((frame - T.jingle) * (3 + (i % 3)) + i * 70) % 1000 - 80;
          return <Sprite key={i} n={i % 3 ? "corazon" : "flor"} tam={44} style={{ position: "absolute", left: (i * 157) % 1180, top: y, transform: `rotate(${frame * 3 + i * 40}deg)` }} />;
        })}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${marco})` }}>
        <Encaje x={150} y={70} w={900} h={590} color={p.ui} fondo={<Vichy tam={46} color={`${p.ui}22`} fondo={p.panel} />}>
          <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 58, lineHeight: 1.15, ...texto(p, p.acento, 12) }}>
            ¡Has conseguido
            <br />
            una receta nueva!
          </div>
          <div
            style={{
              position: "absolute",
              left: 450 - 125,
              top: 200,
              width: 250,
              height: 250,
              borderRadius: 42,
              background: `linear-gradient(${p.acento}, #FFB86B)`,
              border: borde(p, 6),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${tile})`,
            }}
          >
            <div style={{ width: 208, height: 208, borderRadius: 32, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MiniPila p={p} tam={180} />
            </div>
          </div>
          <Sprite n="flor" tam={120} style={{ position: "absolute", left: 140, top: 265, transform: `rotate(${frame * 2}deg) scale(${tile})` }} />
          <Sprite n="flor" tam={120} style={{ position: "absolute", left: 640, top: 265, transform: `rotate(${-frame * 2}deg) scale(${tile})` }} />
          <div style={{ position: "absolute", top: 478, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 56, ...texto(p, p.ui, 11) }}>
            {frame >= nombre && <Escribir texto="Pancakes japoneses" desde={nombre} vel={2} />}
          </div>
        </Encaje>
      </div>
      <Conejita
        p={p}
        px={9}
        pose={fiesta ? (Math.floor(frame / 6) % 2 ? "brazos" : "feliz") : "normal"}
        style={{ position: "absolute", left: 40, top: 650 - (fiesta ? Math.abs(Math.sin(frame / 5)) * 30 : 0) }}
      />
      <Conejita
        p={p}
        px={9}
        pose={fiesta ? (Math.floor(frame / 6) % 2 ? "feliz" : "brazos") : "normal"}
        style={{ position: "absolute", left: 935, top: 650 - (fiesta ? Math.abs(Math.cos(frame / 5)) * 30 : 0), transform: "scaleX(-1)" }}
      />
      <BotonP p={p} x={600} y={780} w={360} texto="Siguiente ▶" tam={46} presionado={frame >= T.clickSiguiente && frame < T.clickSiguiente + 6} />
    </AbsoluteFill>
  );
};

const Libro: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: frame - T.libro, fps, config: { damping: 14 } });
  const guardada = spring({ frame: frame - T.clickGuardar - 2, fps, config: { damping: 7 } });
  const items = ["huevo", "leche", "harina", "fresa", "miel"];
  const cuadricula = (c: string): React.CSSProperties => ({
    backgroundImage: `linear-gradient(${c} 2px, transparent 2px), linear-gradient(90deg, ${c} 2px, transparent 2px)`,
    backgroundSize: "28px 28px",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: p.exterior, backgroundImage: p.exteriorPatron, backgroundSize: p.exteriorTam, backgroundPosition: "0 0, 28px 28px" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - entra) * 1200}px) rotate(${(1 - entra) * 8}deg)` }}>
        <div style={{ position: "absolute", left: 150, top: 30, width: 920, height: 840, borderRadius: 44, backgroundColor: p.ui, border: borde(p, 6) }} />
        <div style={{ position: "absolute", left: 185, top: 48, width: 850, height: 790, borderRadius: 32, backgroundColor: "#FFFFFF", border: borde(p, 5), ...cuadricula(`${p.ui}1F`), backgroundSize: "34px 34px" }} />
        {[120, 250, 380, 510, 640, 770].map((y) => (
          <div key={y} style={{ position: "absolute", left: 140, top: y, width: 90, height: 34, borderRadius: 17, border: borde(p, 6), background: "linear-gradient(#FFFFFF, #D6CFD8)" }} />
        ))}
        <div style={{ position: "absolute", left: 300, top: 70, width: 660, height: 110, borderRadius: 24, backgroundColor: `${p.ui}22`, border: `5px solid ${p.ui}` }} />
        <div style={{ position: "absolute", left: 265, top: 60, width: 110, height: 60, transform: "rotate(-14deg)", border: borde(p, 4), overflow: "hidden" }}>
          <Vichy tam={20} color={`${p.ui}99`} fondo="#FFFFFF" />
        </div>
        <div style={{ position: "absolute", left: 300, top: 78, width: 660, textAlign: "center", fontFamily: C.redonda, fontSize: 74, ...texto(p, p.ui, 14) }}>
          LIBRO DE RECETAS
        </div>
        {/* Nº 1 (ya conseguida) */}
        <div style={{ position: "absolute", left: 260, top: 210, width: 720, height: 120, borderRadius: 26, border: `5px solid ${p.ui}66`, backgroundColor: `${p.pared}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", opacity: 0.75 }}>
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 28, color: p.uiOscuro }}>Nº 1</div>
          {["pan", "mantequilla", "fresa", "miel"].map((n) => (
            <Sprite key={n} n={n} tam={48} />
          ))}
          <div style={{ fontFamily: C.redonda, fontSize: 32, color: p.texto, marginLeft: 10, whiteSpace: "nowrap" }}>Tostada de fresa</div>
          <div style={{ marginLeft: "auto", fontFamily: C.redonda, fontSize: 40, color: p.uiOscuro }}>✓</div>
        </div>
        {/* Nº 2 (nueva) */}
        <div style={{ position: "absolute", left: 260, top: 360, width: 720, height: 300, borderRadius: 28, border: `6px solid ${p.acento}`, backgroundColor: "#FFFBEA", ...cuadricula(`${p.acento}44`) }}>
          <div style={{ position: "absolute", left: 24, top: 14, fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.uiOscuro }}>Nº 2</div>
          <div style={{ position: "absolute", right: 20, top: -24, backgroundColor: p.ui, border: borde(p, 4), borderRadius: 14, padding: "2px 16px", fontFamily: C.pixel, fontWeight: 700, fontSize: 30, ...texto(p, "#FFFFFF", 6), transform: "rotate(6deg)" }}>
            ¡NUEVA!
          </div>
          <div style={{ position: "absolute", left: 10, right: 10, top: 64, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            {items.map((n, i) => {
              const s = spring({ frame: frame - T.ecuacion[i], fps, config: { damping: 8 } });
              return (
                <React.Fragment key={n}>
                  {i > 0 && <div style={{ fontFamily: C.redonda, fontSize: 44, color: p.contorno, opacity: s }}>+</div>}
                  <Sprite n={n} tam={80} style={{ transform: `scale(${s})` }} />
                </React.Fragment>
              );
            })}
            <div style={{ fontFamily: C.redonda, fontSize: 52, color: p.contorno, margin: "0 6px" }}>=</div>
            <div style={{ transform: `scale(${spring({ frame: frame - T.ecuacion[5], fps, config: { damping: 7 } })})` }}>
              <MiniPila p={p} tam={130} />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 22, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 48, color: p.texto }}>
            {frame >= T.nombre && <Escribir texto="Pancakes japoneses" desde={T.nombre} vel={1} />}
          </div>
        </div>
        <div style={{ position: "absolute", left: 270, top: 760, display: "flex", gap: 22 }}>
          {[0, 1, 2, 3].map((i) => (
            <Sprite key={i} n={i % 2 ? "corazon" : "flor"} tam={44} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 150, top: 850, backgroundColor: p.panel, border: borde(p, 5), borderRadius: 30, padding: "4px 22px", fontFamily: C.redonda, fontSize: 34, color: p.uiOscuro }}>2/24</div>
        <BotonP p={p} x={900} y={790} w={250} texto="♡ Guardar" color={p.acento} tam={40} presionado={frame >= T.clickGuardar && frame < T.clickGuardar + 6} />
        {frame >= T.clickGuardar && (
          <div style={{ position: "absolute", left: 470, top: 664, transform: `scale(${guardada}) rotate(-8deg)`, display: "flex", alignItems: "center", gap: 10 }}>
            <Sprite n="corazon" tam={100} />
            <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 62, ...texto(p, p.ui, 10) }}>¡Guardada!</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Ventana del juego (1200×900) con todas las pantallas, cursor y sonidos. */
export const VentanaPancakes: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const cursor = posicionCursor(frame);
  const carga = CARGA.find(([a, b]) => frame >= a && frame < b);
  const ultimo = CLICKS.filter((c) => c <= frame).pop();
  const presionado = (ultimo !== undefined && frame - ultimo < 6) || (carga && ["leche", "harina", "miel"].includes(carga[2]));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: p.pared }}>
      {frame < T.cortina && <Menu p={p} />}
      {frame >= T.cortina && frame < T.cortina2 && <PantallaCocina p={p} />}
      {frame >= T.cortina2 && frame < T.libro && <RecetaNueva p={p} />}
      {frame >= T.libro && <Libro p={p} />}

      {CLICKS.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 12) return null;
        const q = posicionCursor(c);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: q.x - 10 - t * 5,
              top: q.y - 10 - t * 5,
              width: 20 + t * 10,
              height: 20 + t * 10,
              borderRadius: "50%",
              border: `6px solid ${p.ui}`,
              opacity: 1 - t / 12,
            }}
          />
        );
      })}
      <Cursor x={cursor.x} y={cursor.y} presionado={Boolean(presionado)} />
      <Cortina p={p} centro={T.cortina} id="c1" />
      <Cortina p={p} centro={T.cortina2} id="c2" />

      {CLICKS.map((c) => (
        <Audio key={`c${c}`} src={sfx("click.wav")} from={c} volume={0.5} name="Clic" />
      ))}
      {[T.jingle + 2, ...T.ecuacion].map((f, i) => (
        <Audio key={`pp${i}`} src={sfx("pop.wav")} from={f} volume={0.35} name="Pop" />
      ))}
      <Audio src={sfx("jingle.wav")} from={T.jingle} volume={0.6} name="Receta nueva" />
      <Audio src={sfx("brillo.wav")} from={T.clickGuardar + 2} volume={0.45} name="Brillo guardar" />
    </AbsoluteFill>
  );
};
