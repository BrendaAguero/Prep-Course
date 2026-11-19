import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Cursor, Destello, Encaje, Sprite, Vichy } from "../Deco";
import { Escribir } from "../Juego";
import { C } from "../tema";
import { BotonP, borde, Cocina, Despensa, texto } from "../disenos/Escenas";
import type { Paleta } from "../disenos/paletas";
import { Batidor, Bol, Lienzo, MediaFresa, Pancake, Plato, Sarten } from "../pancakes/Objetos";
import { BOTON_COCINAR, BOTON_JUGAR, CLARAS, G, hueco, INGREDIENTES, PANCAKES_X, PASO_INICIO, PASOS, PLATO, SARTEN, tarjeta, YEMAS } from "./guion";

export const ANCHO = 1200;
export const ALTO = 900;
const E = G.ev;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (f: number, a: number, b: number, easing?: (t: number) => number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
const DORADO = "#E2A253";
const LADO = "#F8DDAA";
const CRUDO = "#FFF1D6";

export const posicionCursor = (frame: number) => {
  const c = G.cursor;
  let i = 0;
  while (i < c.length - 2 && frame > c[i + 1][0]) i++;
  const [f0, x0, y0] = c[i];
  const [f1, x1, y1] = c[i + 1];
  const t = interpolate(frame, [f0, Math.max(f0 + 0.001, f1)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
};

export const pasoActual = (frame: number) => {
  let p = -1;
  PASO_INICIO.forEach((f, i) => {
    if (frame >= f) p = i;
  });
  return frame >= E.completada ? -1 : p;
};

/* ---------- utensilios que lleva el cursor ---------- */
const Utensilio: React.FC<{ p: Paleta; que: string; frame: number }> = ({ p, que, frame }) => {
  switch (que) {
    case "varillas":
      return <div style={{ position: "absolute", left: -10, top: 30 }}><Batidor p={p} x={0} y={0} rot={Math.sin(frame / 2) * 12} /></div>;
    case "batidora":
      return (
        <svg width={170} height={230} viewBox="-85 -20 170 230" style={{ position: "absolute", left: -85, top: -150, transform: `rotate(${Math.sin(frame) * 2}deg)` }}>
          {[-18, 18].map((dx) => (
            <g key={dx}>
              <rect x={dx - 3} y={110} width={6} height={50} fill="#C9C1C8" stroke={p.contorno} strokeWidth={2} />
              <ellipse cx={dx} cy={175} rx={14} ry={20} fill="none" stroke="#C9C1C8" strokeWidth={6} />
            </g>
          ))}
          <path d="M-70 40 Q -70 0 -30 0 L 50 0 Q 75 0 75 30 L 75 70 Q 75 110 40 110 L -40 110 Q -70 110 -70 80 Z" fill={p.panel} stroke={p.contorno} strokeWidth={6} />
          <rect x={-50} y={20} width={90} height={22} rx={11} fill={p.ui} stroke={p.contorno} strokeWidth={4} />
          <circle cx={45} cy={75} r={10} fill={p.acento} stroke={p.contorno} strokeWidth={4} />
        </svg>
      );
    case "tamiz":
      return (
        <svg width={220} height={130} viewBox="-110 -40 220 130" style={{ position: "absolute", left: -110, top: -40 }}>
          <rect x={60} y={-8} width={90} height={18} rx={9} fill={p.maderaOscura} stroke={p.contorno} strokeWidth={5} transform="rotate(-10 60 0)" />
          <ellipse cx={0} cy={0} rx={80} ry={24} fill="#E7E2EA" stroke={p.contorno} strokeWidth={6} />
          <path d="M-74 4 Q 0 80 74 4" fill="#F4F1F6" stroke={p.contorno} strokeWidth={6} />
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={-60 + i * 20} y1={6} x2={-60 + i * 20} y2={30 + 12 * Math.sin((i / 6) * Math.PI)} stroke="#C9C1C8" strokeWidth={2} />
          ))}
          <ellipse cx={0} cy={-2} rx={50} ry={12} fill="#FFFFFF" />
        </svg>
      );
    case "espatula":
      return (
        <svg width={120} height={240} viewBox="-60 -10 120 240" style={{ position: "absolute", left: -60, top: -10, transform: "rotate(-20deg)" }}>
          <rect x={-10} y={-180} width={20} height={190} rx={10} fill={p.maderaOscura} stroke={p.contorno} strokeWidth={5} />
          <path d="M-40 0 L 40 0 L 34 70 Q 0 86 -34 70 Z" fill={p.ui} stroke={p.contorno} strokeWidth={6} />
        </svg>
      );
    case "papel":
      return (
        <svg width={130} height={100} viewBox="-65 -50 130 100" style={{ position: "absolute", left: -65, top: -20 }}>
          <path d="M-55 -30 Q 0 -45 55 -30 L 50 35 Q 0 45 -50 35 Z" fill="#FFFFFF" stroke={p.contorno} strokeWidth={5} />
          <path d="M-35 -10 L 30 -10 M -35 10 L 25 10" stroke="#E9E2EA" strokeWidth={5} />
        </svg>
      );
    case "cuchara":
      return (
        <svg width={220} height={300} viewBox="-110 -200 220 300" style={{ position: "absolute", left: -110, top: -180 }}>
          <rect x={-12} y={-190} width={24} height={200} rx={12} fill={p.maderaOscura} stroke={p.contorno} strokeWidth={5} transform="rotate(28 0 10)" />
          <ellipse cx={0} cy={30} rx={62} ry={40} fill="#D9D3DB" stroke={p.contorno} strokeWidth={6} />
          <ellipse cx={0} cy={18} rx={52} ry={30} fill={CRUDO} stroke="#EAD3A8" strokeWidth={4} />
        </svg>
      );
    default: {
      const giros: Record<string, number> = { leche: -110, miel: -120 };
      const enUso =
        (que === "leche" && frame >= E.leche && frame < E.leche + 30) ||
        (que === "miel" && frame >= E.sirope && frame < E.siropeFin) ||
        (que === "azucar" && frame >= E.glas && frame < E.glas + 24);
      const rot = enUso ? (que === "azucar" ? -150 + Math.sin(frame) * 10 : giros[que] ?? -8) : -8;
      return <Sprite n={que} tam={que === "fresa" ? 80 : 110} style={{ position: "absolute", left: -55, top: -75, transform: `rotate(${rot}deg)` }} />;
    }
  }
};

/* ---------- objetos de la mesa ---------- */
const BolEscalado: React.FC<{ p: Paleta; b: { x: number; y: number; k: number }; contenido?: React.ReactNode; encima?: React.ReactNode; children?: React.ReactNode }> = ({
  p,
  b,
  contenido,
  encima,
  children,
}) => (
  <div style={{ position: "absolute", inset: 0, transformOrigin: `${b.x}px ${b.y}px`, transform: `scale(${b.k})` }}>
    <Bol p={p} x={b.x} y={b.y} contenido={contenido} encima={encima} />
    {children}
  </div>
);

const Nubes: React.FC<{ x: number; y: number; tam: number; color?: string }> = ({ x, y, tam, color = "#FFFFFF" }) => (
  <g>
    {[
      [-1, 0, 0.8],
      [-0.4, -0.35, 1],
      [0.35, -0.25, 0.95],
      [0.9, 0.05, 0.75],
      [0, -0.8, 0.7],
    ].map(([dx, dy, r], i) => (
      <circle key={i} cx={x + dx * tam} cy={y + dy * tam} r={r * tam * 0.55} fill={color} stroke="#EADBC3" strokeWidth={3} />
    ))}
  </g>
);

const Chip: React.FC<{ p: Paleta; x: number; y: number; children: React.ReactNode }> = ({ p, x, y, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 18px",
      borderRadius: 20,
      backgroundColor: p.panel,
      border: borde(p, 5),
      fontFamily: C.pixel,
      fontWeight: 700,
      fontSize: 34,
      color: p.texto,
    }}
  >
    {children}
  </div>
);

const Reloj: React.FC<{ p: Paleta; desde: number; hasta: number; min0: number; min1: number; frame: number }> = ({ p, desde, hasta, min0, min1, frame }) => {
  if (frame < desde - 6 || frame > hasta + 20) return null;
  const seg = Math.round(interpolate(frame, [desde, hasta], [min0 * 60, min1 * 60], clamp));
  return (
    <Chip p={p} x={560} y={160}>
      ⏱ {Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")}
    </Chip>
  );
};

const Cocina2: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (f: number, damping = 10) => spring({ frame: frame - f, fps, config: { damping } });

  // ----- Bol de yemas
  const yemas = (frame >= E.huevo1 + 8 ? 1 : 0) + (frame >= E.huevo2 + 8 ? 1 : 0);
  const leche = prog(frame, E.leche, E.leche + 28);
  const batidoY = prog(frame, E.batirY, E.batirYfin);
  const harina = prog(frame, E.tamiz1, E.tamizFin);
  const lisa = prog(frame, E.mezclaY, E.mezclaYfin);
  const merengueEnY = (frame >= E.deja1 ? 1 : 0) + (frame >= E.deja2 ? 1 : 0);
  const envuelto = prog(frame, E.envolver, E.envolverFin);
  let colorY = interpolateColors(batidoY, [0, 1], ["#FFC83D", "#FFE6A3"]);
  if (lisa > 0) colorY = interpolateColors(lisa, [0, 1], ["#FFE6A3", "#F6DDA6"]);
  if (envuelto > 0) colorY = interpolateColors(envuelto, [0, 1], ["#F6DDA6", "#FFF2D8"]);
  const nivelY = Math.min(1, yemas * 0.18 + leche * 0.25 + harina * 0.15 + merengueEnY * 0.15 + envuelto * 0.1);
  const yR = YEMAS.y - 70;

  // ----- Bol de claras
  const claras = (frame >= E.huevo1 + 10 ? 1 : 0) + (frame >= E.huevo2 + 10 ? 1 : 0);
  const congelado = prog(frame, E.congelar, E.congelar + 15) * (1 - prog(frame, E.paso1, E.paso1 + 15));
  const espuma = prog(frame, E.batidora, E.picos);
  const tomado = (frame >= E.toma1 ? 1 : 0) + (frame >= E.toma2 ? 1 : 0);
  const espumaVisible = espuma * (1 - tomado * 0.33);
  const cR = CLARAS.y - 70;

  const dxBoles = interpolate(frame, [E.salenBoles, E.salenBoles + 18], [0, -1300], { ...clamp, easing: Easing.in(Easing.quad) });

  // ----- Sartén
  const dxSarten =
    interpolate(frame, [E.salenBoles + 10, E.salenBoles + 30], [1300, 0], { ...clamp, easing: Easing.out(Easing.quad) }) +
    interpolate(frame, [E.salenSarten, E.salenSarten + 18], [0, -1300], { ...clamp, easing: Easing.in(Easing.quad) });
  const calor = prog(frame, E.fuego, E.fuego + 30);
  const aceite = prog(frame, E.papel, E.papel + 26);
  const tapaPuesta =
    (frame >= E.tapa1 && frame < E.ultima) || (frame >= E.ultima + 26 && frame < E.tapaFuera) || (frame >= E.tapa2 && frame < E.listo);
  const crecer = prog(frame, E.reloj1, E.reloj1fin);

  // ----- Plato
  const dxPlato = interpolate(frame, [E.plato - 12, E.plato + 6], [1300, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const golpes = [E.pila2, E.jiggle1, E.jiggle1 + 22, E.jiggle2, E.jiggle2 + 22].filter((f) => frame >= f);
  const ult = golpes.length ? golpes[golpes.length - 1] : undefined;
  const temblor = ult !== undefined ? Math.sin((frame - ult) * 1.0) * Math.exp(-(frame - ult) / 10) * 0.12 : 0;
  const sirope = prog(frame, E.sirope, E.siropeFin);
  const glas = prog(frame, E.glas, E.glas + 20);
  const hPila = 58;
  const baseP = PLATO.y + 30;
  const topeP = baseP - 3 * hPila;

  const cursor = posicionCursor(frame);

  return (
    <AbsoluteFill>
      <Cocina p={p} />
      <div style={{ position: "absolute", left: 120, top: 600, width: 760, height: 290, borderRadius: 40, backgroundColor: p.madera, border: borde(p, 5) }} />

      {/* ===== Boles ===== */}
      {frame < E.salenBoles + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxBoles}px)` }}>
          <BolEscalado
            p={p}
            b={YEMAS}
            contenido={
              <>
                {nivelY > 0 && <ellipse cx={YEMAS.x} cy={yR + 22 - 12 * nivelY} rx={110 + 80 * nivelY} ry={24 + 14 * nivelY} fill={colorY} stroke="#E6CFA4" strokeWidth={4} />}
                {batidoY === 0 &&
                  Array.from({ length: yemas }).map((_, i) => <circle key={i} cx={YEMAS.x - 30 + i * 60} cy={yR + 14} r={24} fill="#FFC83D" stroke="#E8A63A" strokeWidth={4} />)}
                {[0, 1, 2].map((i) => (frame >= E[`vainilla${i}`] && batidoY < 0.4 ? <circle key={i} cx={YEMAS.x + 30 + i * 18} cy={yR + 6 + i * 6} r={6} fill="#8A5A3A" /> : null))}
                {harina > 0 && lisa < 1 && <ellipse cx={YEMAS.x} cy={yR + 4} rx={90 * harina * (1 - lisa)} ry={26 * harina * (1 - lisa)} fill="#FFFFFF" />}
                {merengueEnY > 0 && envuelto < 1 && <Nubes x={YEMAS.x - 20} y={yR + 6} tam={40 * merengueEnY * (1 - envuelto)} />}
                {envuelto > 0 && envuelto < 1 &&
                  [0, 1, 2].map((i) => <path key={i} d={`M${YEMAS.x - 120} ${yR + 10 + i * 10} q 60 -16 120 0 t 120 0`} stroke="#FFFFFF" strokeWidth={6 * (1 - envuelto)} fill="none" />)}
              </>
            }
          >
            {frame >= E.huevo1 - 4 &&
              [E.huevo1, E.huevo2].map((h) => {
                const t = frame - h;
                if (t < 0 || t > 14) return null;
                return (
                  <svg key={h} width={ANCHO} height={ALTO} style={{ position: "absolute", inset: 0 }}>
                    {[-1, 1].map((l) => (
                      <path
                        key={l}
                        d="M-30 0 A 30 36 0 0 1 30 0 L 16 -8 L 4 4 L -6 -8 L -18 4 Z"
                        transform={`translate(${YEMAS.x + l * (12 + t * 6)} ${560 + t * 5}) rotate(${l * (30 + t * 9)}) scale(1 -1)`}
                        fill="#F2B27A"
                        stroke={p.contorno}
                        strokeWidth={4}
                        opacity={1 - t / 14}
                      />
                    ))}
                  </svg>
                );
              })}
          </BolEscalado>
          <BolEscalado
            p={p}
            b={CLARAS}
            contenido={
              <>
                {claras > 0 && <ellipse cx={CLARAS.x} cy={cR + 18} rx={100 + 30 * claras} ry={22 + 6 * claras} fill={interpolateColors(espuma, [0, 1], ["#F3F6F8", "#FFFFFF"])} stroke="#E3E8EC" strokeWidth={3} />}
              </>
            }
            encima={
              <>
                {espumaVisible > 0 && <Nubes x={CLARAS.x} y={cR + 10 - 30 * espumaVisible} tam={60 * espumaVisible} />}
                {frame >= E.picos && tomado < 2 && (
                  <path d={`M${CLARAS.x - 24} ${cR - 40} Q ${CLARAS.x} ${cR - 120} ${CLARAS.x + 14} ${cR - 130} Q ${CLARAS.x + 4} ${cR - 90} ${CLARAS.x + 26} ${cR - 40} Z`} fill="#FFFFFF" stroke="#EADBC3" strokeWidth={3} />
                )}
                {congelado > 0 && <ellipse cx={CLARAS.x} cy={cR} rx={190} ry={50} fill="#BFE3FA" opacity={0.45 * congelado} />}
              </>
            }
          />
          {congelado > 0 && (
            <div style={{ position: "absolute", left: CLARAS.x - 40, top: 470, fontSize: 70, opacity: congelado, transform: `rotate(${frame * 3}deg)` }}>❄️</div>
          )}
          {/* chorro de leche */}
          {frame >= E.leche && frame < E.leche + 30 && (
            <div style={{ position: "absolute", left: cursor.x - 70, top: cursor.y - 10, width: 14, height: yR * 1 - cursor.y + 120, borderRadius: 7, backgroundColor: "#FFFFFFEE", border: "3px solid #EADCE4" }} />
          )}
          {/* harina cayendo del tamiz */}
          {((frame >= E.tamiz1 && frame < E.tamiz2 - 10) || (frame >= E.tamiz2 && frame < E.tamizFin)) &&
            Array.from({ length: 16 }).map((_, i) => {
              const t = (frame * 3 + i * 13) % 50;
              return <div key={i} style={{ position: "absolute", left: cursor.x - 60 + ((i * 17) % 120), top: cursor.y + 30 + t * 2.4, width: 9, height: 9, borderRadius: 5, backgroundColor: "#FFFFFF", opacity: 1 - t / 50 }} />;
            })}
          {/* azúcar */}
          {[1, 2, 3].map((k) => {
            const t = frame - E[`azucar${k}`];
            if (t < 0 || t > 20) return null;
            return Array.from({ length: 10 }).map((_, i) => (
              <div key={`${k}-${i}`} style={{ position: "absolute", left: CLARAS.x - 50 + i * 11, top: 560 + t * 7 + (i % 3) * 8, width: 8, height: 8, backgroundColor: "#FFFFFF", border: "2px solid #E3E8EC", opacity: 1 - t / 20 }} />
            ));
          })}
          {frame >= E.picos && frame < E.picos + 30 && <Destello x={CLARAS.x + 20} y={cR * CLARAS.k + 120} tam={60} color={p.acento} />}
        </div>
      )}

      {/* ===== Sartén ===== */}
      {frame >= E.salenBoles + 8 && frame < E.salenSarten + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxSarten}px)` }}>
          <Sarten
            p={p}
            x={SARTEN.x}
            y={SARTEN.y}
            calor={calor}
            dentro={
              <>
                {aceite > 0 && <ellipse cx={SARTEN.x} cy={SARTEN.y - 4} rx={250 * aceite} ry={56 * aceite} fill={p.acento} opacity={0.3} />}
                {PANCAKES_X.map((x, i) => {
                  if (frame < E[`monton${i}`]) return null;
                  const a = sp(E[`monton${i}`], 9);
                  const apilado = frame >= E[`apila${i}`] ? sp(E[`apila${i}`], 9) : 0;
                  const ultimaC = frame >= E.ultima ? sp(E.ultima + i * 8, 9) : 0;
                  const h = (28 * a + 26 * apilado + 18 * ultimaC) * (1 + 0.45 * crecer);
                  const fv = E[`voltea${i}`];
                  const vuelta = prog(frame, fv - 2, fv + 12);
                  const salto = Math.sin(vuelta * Math.PI) * 150;
                  const sy = vuelta > 0 && vuelta < 1 ? Math.max(0.15, Math.abs(Math.cos(vuelta * Math.PI))) : 1;
                  const hecho = vuelta >= 0.5;
                  const base = SARTEN.y - 6;
                  return (
                    <g key={x} transform={`translate(0 ${-salto}) translate(${x} ${base}) scale(1 ${sy}) translate(${-x} ${-base})`}>
                      <Pancake p={p} x={x} yBase={base} rx={58} ry={18} h={h} arriba={hecho ? DORADO : CRUDO} lado={hecho ? LADO : "#FFF7EA"} />
                    </g>
                  );
                })}
                {[E.agua1, E.agua2].map((a) => {
                  const t = frame - a;
                  if (t < 0 || t > 40) return null;
                  return [405, 535].map((x, i) => <Nubes key={`${a}-${i}`} x={x} y={SARTEN.y - 30 - t * 2} tam={22 + t * 0.6} color="#FFFFFFCC" />);
                })}
                {tapaPuesta && (
                  <g>
                    <path d={`M${SARTEN.x - 280} ${SARTEN.y - 6} Q ${SARTEN.x - 270} ${SARTEN.y - 230} ${SARTEN.x} ${SARTEN.y - 240} Q ${SARTEN.x + 270} ${SARTEN.y - 230} ${SARTEN.x + 280} ${SARTEN.y - 6} Z`} fill="#DDEFFA66" stroke={p.contorno} strokeWidth={6} />
                    <path d={`M${SARTEN.x - 200} ${SARTEN.y - 150} Q ${SARTEN.x - 120} ${SARTEN.y - 210} ${SARTEN.x - 20} ${SARTEN.y - 214}`} stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.7} strokeLinecap="round" />
                    <rect x={SARTEN.x - 36} y={SARTEN.y - 268} width={72} height={30} rx={15} fill={p.ui} stroke={p.contorno} strokeWidth={5} />
                  </g>
                )}
              </>
            }
          />
          <Reloj p={p} desde={E.reloj1} hasta={E.reloj1fin} min0={6} min1={0} frame={frame} />
          <Reloj p={p} desde={E.reloj2} hasta={E.listo} min0={4} min1={0} frame={frame} />
          {frame >= E.fuego && frame < E.paso6 && (
            <Chip p={p} x={560} y={160}>
              🔥 {Math.round(20 + 130 * calor)} °C · bajo
            </Chip>
          )}
          {frame >= E.ultima - 4 && frame < E.ultima + 30 && (
            <div style={{ position: "absolute", left: 0, right: 300, top: 330, textAlign: "center", transform: "rotate(-4deg)", fontFamily: C.pixel, fontWeight: 700, fontSize: 46, ...texto(p, p.acento, 9) }}>
              2 min: ¡última cucharada!
            </div>
          )}
        </div>
      )}

      {/* ===== Plato ===== */}
      {frame >= E.plato - 12 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxPlato}px)` }}>
          <Plato p={p} x={PLATO.x} y={PLATO.y + 40} />
          <Lienzo>
            <g transform={`translate(${PLATO.x} ${baseP}) scale(${1 - temblor * 0.6} ${1 + temblor}) translate(${-PLATO.x} ${-baseP})`}>
              {[0, 1, 2].map((i) => {
                if (frame < E[`pila${i}`] - 10) return null;
                const c = sp(E[`pila${i}`] - 10, 12);
                return (
                  <g key={i} transform={`translate(0 ${(1 - c) * -500})`}>
                    <Pancake p={p} x={PLATO.x} yBase={baseP - i * hPila} rx={140} ry={38} h={hPila + 4} arriba={DORADO} lado={LADO} />
                  </g>
                );
              })}
              {glas > 0 &&
                Array.from({ length: 30 }).map((_, i) => (
                  <circle key={i} cx={PLATO.x - 110 + ((i * 37) % 220)} cy={topeP - 10 + ((i * 13) % 22)} r={3.2} fill="#FFFFFF" opacity={glas} />
                ))}
              {sirope > 0 && (
                <>
                  <ellipse cx={PLATO.x} cy={topeP} rx={130 * Math.min(1, sirope * 1.4)} ry={34 * Math.min(1, sirope * 1.4)} fill="#E89B2E" opacity={0.75} />
                  {[-125, -55, 65, 120].map((dx, i) => {
                    const l = interpolate(sirope, [0.3 + i * 0.12, 1], [0, 60 + i * 25], clamp);
                    const y0 = topeP + Math.sqrt(Math.max(0, 1 - (dx / 140) ** 2)) * 36;
                    return <path key={i} d={`M${PLATO.x + dx} ${y0} L ${PLATO.x + dx} ${y0 + l}`} stroke="#E89B2E" strokeWidth={16} strokeLinecap="round" />;
                  })}
                </>
              )}
              {[0, 1].map((k) => (frame >= E[`fresa${k}`] ? <MediaFresa key={k} p={p} x={PLATO.x - 50 + k * 100} y={topeP - 12} rot={k ? 18 : -18} s={sp(E[`fresa${k}`], 8)} /> : null))}
            </g>
          </Lienzo>
          {frame >= E.sirope && frame < E.siropeFin && (
            <div style={{ position: "absolute", left: cursor.x - 74, top: cursor.y - 10, width: 12, height: topeP - cursor.y + 20, borderRadius: 6, backgroundColor: "#E89B2ECC" }} />
          )}
          {frame >= E.jiggle2 &&
            [
              [280, 520],
              [660, 500],
              [650, 820],
              [290, 800],
            ].map(([x, y], i) => <Destello key={i} x={x} y={y} tam={56} fase={i * 1.4} color={i % 2 ? p.acento : "#FFFFFF"} />)}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- pantallas ---------- */
const Gancho: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const t = Math.sin(frame * 0.9) * Math.exp(-(frame % 30) / 10) * 0.12;
  const base = PLATO.y + 30;
  return (
    <AbsoluteFill>
      <Cocina p={p} />
      <Plato p={p} x={PLATO.x} y={PLATO.y + 40} />
      <Lienzo>
        <g transform={`translate(${PLATO.x} ${base}) scale(${1 - t * 0.6} ${1 + t}) translate(${-PLATO.x} ${-base})`}>
          {[0, 1, 2].map((i) => (
            <Pancake key={i} p={p} x={PLATO.x} yBase={base - i * 58} rx={140} ry={38} h={62} arriba={DORADO} lado={LADO} />
          ))}
          <ellipse cx={PLATO.x} cy={base - 174} rx={120} ry={30} fill="#E89B2E" opacity={0.75} />
          <MediaFresa p={p} x={PLATO.x - 50} y={base - 186} rot={-18} />
          <MediaFresa p={p} x={PLATO.x + 50} y={base - 186} rot={18} />
        </g>
      </Lienzo>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", transform: "rotate(-3deg)" }}>
        <div style={{ fontFamily: C.redonda, fontSize: 96, ...texto(p, "#FFFFFF", 16) }}>¿Pancakes que</div>
        <div style={{ fontFamily: C.redonda, fontSize: 110, ...texto(p, p.ui, 16) }}>tiemblan? ☁️</div>
      </div>
    </AbsoluteFill>
  );
};

const Menu: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - E.menu, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill>
      <Cocina p={p} />
      <AbsoluteFill style={{ backgroundColor: `${p.exterior}B3` }} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", transform: `scale(${logo}) rotate(-3deg)` }}>
        <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, "#FFFFFF", 22) }}>Cocina</div>
        <div style={{ fontFamily: C.redonda, fontSize: 150, lineHeight: 0.95, ...texto(p, p.ui, 22) }}>Dulce ♡</div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 380, width: 620, height: 440, borderRadius: 36, backgroundColor: p.panel, border: borde(p, 6), boxShadow: `0 12px 0 ${p.contorno}` }}>
        <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 32, color: p.texto }}>Receta nº 2 · Pancakes japoneses</div>
      </div>
      <BotonP p={p} x={BOTON_JUGAR.x} y={BOTON_JUGAR.y} w={460} texto="Jugar" icono="▶" tam={52} presionado={frame >= E.clicJugar && frame < E.clicJugar + 6} />
      <BotonP p={p} x={780} y={608} w={460} texto="Libro de recetas" color={p.acento} tam={40} />
      <BotonP p={p} x={780} y={728} w={460} texto="Opciones" color={p.maderaOscura} tam={40} />
    </AbsoluteFill>
  );
};

const Ingredientes: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Vichy tam={50} color={`${p.ui}22`} fondo={p.panel} />
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 72, ...texto(p, p.ui, 12) }}>Ingredientes</div>
      <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: p.texto }}>Para 3 pancakes · 45 min</div>
      {INGREDIENTES.map((ing, i) => {
        const t = tarjeta(i);
        const ok = frame >= E[`ing${i}`];
        const s = ok ? spring({ frame: frame - E[`ing${i}`], fps, config: { damping: 8 } }) : 0;
        const entra = spring({ frame: frame - E.ingredientes - i * 3, fps, config: { damping: 12 } });
        return (
          <div
            key={ing.s}
            style={{
              position: "absolute",
              left: t.x - 240,
              top: t.y - 60,
              width: 480,
              height: 120,
              borderRadius: 26,
              backgroundColor: ok ? "#FFF6D6" : "#FFFFFF",
              border: borde(p, 5),
              boxShadow: ok ? `0 0 0 6px ${p.acento}` : `0 6px 0 ${p.contorno}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 20px",
              transform: `scale(${entra * (1 + 0.06 * s * (1 - s))})`,
            }}
          >
            <Sprite n={ing.s} tam={84} />
            <div>
              <div style={{ fontFamily: C.redonda, fontSize: 40, color: p.uiOscuro, lineHeight: 1 }}>{ing.cant}</div>
              <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 28, color: p.texto }}>{ing.nombre}</div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                width: 52,
                height: 52,
                borderRadius: 14,
                border: borde(p, 5),
                backgroundColor: ok ? p.ui : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                color: "#FFFFFF",
                transform: `scale(${ok ? s : 1})`,
              }}
            >
              {ok ? "✓" : ""}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 760, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 26, color: p.texto }}>
        Utensilios: 2 boles · varillas · batidora · tamiz · sartén con tapa
      </div>
      <BotonP p={p} x={BOTON_COCINAR.x} y={BOTON_COCINAR.y} w={420} texto="¡A cocinar!" icono="▶" tam={44} presionado={frame >= E.clicCocinar && frame < E.clicCocinar + 6} />
    </AbsoluteFill>
  );
};

const Completada: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - E.completada, fps, config: { damping: 10 } });
  const cta = spring({ frame: frame - E.cta, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Vichy tam={46} color={`${p.ui}22`} fondo={p.exterior} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${s})` }}>
        <Encaje x={170} y={90} w={860} h={560} color={p.ui} fondo={<Vichy tam={46} color={`${p.ui}22`} fondo={p.panel} />}>
          <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 64, lineHeight: 1.1, ...texto(p, p.acento, 12) }}>
            ¡Receta
            <br />
            completada!
          </div>
          <div style={{ position: "absolute", top: 240, width: "100%", display: "flex", justifyContent: "center", gap: 20 }}>
            {[0, 1, 2].map((i) => (
              <Sprite key={i} n="estrella" tam={i === 1 ? 130 : 100} style={{ transform: `scale(${spring({ frame: frame - E.completada - 10 - i * 8, fps, config: { damping: 7 } })})` }} />
            ))}
          </div>
          <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 60, ...texto(p, p.ui, 11) }}>Pancakes japoneses</div>
        </Encaje>
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 720,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 60}px)`,
          textAlign: "center",
          padding: "18px 0",
          borderRadius: 30,
          backgroundColor: p.ui,
          border: borde(p, 6),
          fontFamily: C.pixel,
          fontWeight: 700,
          fontSize: 44,
          ...texto(p, "#FFFFFF", 8),
        }}
      >
        💾 Guarda la receta
      </div>
    </AbsoluteFill>
  );
};

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
      </defs>
      <rect width={ANCHO} height={ALTO} fill={p.ui} mask={`url(#m-${id})`} />
    </svg>
  );
};

/** Ventana completa del juego (1200×900): pantallas, despensa, cinta, cursor. */
export const VentanaTikTok: React.FC<{ p: Paleta }> = ({ p }) => {
  const frame = useCurrentFrame();
  const cursor = posicionCursor(frame);
  const carga = G.cargas.find(([a, b]) => frame >= a && frame < b);
  const paso = pasoActual(frame);
  const enCocina = frame >= E.cortina2 && frame < E.completada;
  const items = paso >= 0 ? PASOS[paso].items : [];
  const resaltado = carga ? undefined : items.findIndex((_, i) => Math.hypot(cursor.x - hueco(i, items.length).x, cursor.y - hueco(i, items.length).y) < 55);
  const ultimoClic = G.clics.filter((c) => c <= frame).pop();
  const presionado = (ultimoClic !== undefined && frame - ultimoClic < 6) || Boolean(carga);
  const mostrarCursor = frame >= E.menu && frame < E.completada + 10;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: p.pared }}>
      {frame < E.menu && <Gancho p={p} />}
      {frame >= E.menu && frame < E.cortina1 && <Menu p={p} />}
      {frame >= E.cortina1 && frame < E.cortina2 && <Ingredientes p={p} />}
      {enCocina && <Cocina2 p={p} />}
      {frame >= E.completada && <Completada p={p} />}

      {enCocina && items.length > 0 && <Despensa p={p} items={items} resaltado={resaltado !== undefined && resaltado >= 0 ? resaltado : undefined} enMano={carga?.[2]} />}

      {enCocina && paso >= 0 && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 92, borderRadius: 24, backgroundColor: p.ui, border: borde(p, 5), boxShadow: `0 8px 0 ${p.contorno}`, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
          <div style={{ position: "absolute", inset: 8, borderRadius: 16, border: "3px dashed #FFFFFFAA" }} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 38, ...texto(p, p.acento, 7) }}>PASO {paso + 1}/9</div>
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 42, ...texto(p, "#FFFFFF", 7) }}>
            <Escribir key={paso} texto={PASOS[paso].titulo} desde={PASO_INICIO[paso]} vel={1} sonido={false} />
          </div>
        </div>
      )}

      {/* lo que lleva el cursor */}
      {carga && mostrarCursor && (
        <div style={{ position: "absolute", left: cursor.x, top: cursor.y }}>
          <Utensilio p={p} que={carga[2]} frame={frame} />
        </div>
      )}
      {G.clics.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 12) return null;
        const q = posicionCursor(c);
        return <div key={c} style={{ position: "absolute", left: q.x - 10 - t * 5, top: q.y - 10 - t * 5, width: 20 + t * 10, height: 20 + t * 10, borderRadius: "50%", border: `6px solid ${p.ui}`, opacity: 1 - t / 12 }} />;
      })}
      {mostrarCursor && <Cursor x={cursor.x} y={cursor.y} presionado={presionado} />}
      <Cortina p={p} centro={E.cortina1} id="c1" />
      <Cortina p={p} centro={E.cortina2} id="c2" />
    </AbsoluteFill>
  );
};
