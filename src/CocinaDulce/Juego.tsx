import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Boton, Cursor, Destello, Encaje, Lazo, Mochi, Sprite, Vichy } from "./Deco";
import { C, contorno } from "./tema";
import { CARGA, CLICKS, CURSOR, T } from "./tiempos";
import { PlatoArriba, Tostada } from "./Tostada";

export const ANCHO = 1200;
export const ALTO = 900;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sfx = (n: string) => staticFile(`audio/kawaii/${n}`);

const SLOTS = [
  { n: "pan", nombre: "Pan", y: 280 },
  { n: "mantequilla", nombre: "Mantequilla", y: 410 },
  { n: "fresa", nombre: "Fresa", y: 540 },
  { n: "miel", nombre: "Miel", y: 670 },
];
const SLOT_X = 1010;
const PLATO = { x: 480, y: 520 };

export const posicionCursor = (frame: number) => {
  let i = 0;
  while (i < CURSOR.length - 2 && frame > CURSOR[i + 1][0]) i++;
  const [f0, x0, y0] = CURSOR[i];
  const [f1, x1, y1] = CURSOR[i + 1];
  const t = interpolate(frame, [f0, f1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
};

/** Texto que se escribe letra a letra, con bips. */
export const Escribir: React.FC<{ texto: string; desde: number; vel?: number; sonido?: boolean }> = ({
  texto,
  desde,
  vel = 2,
  sonido = true,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - desde) / vel));
  return (
    <>
      {sonido && (
        <Sequence from={desde} durationInFrames={texto.length * vel} layout="none" name={`Bips "${texto}"`}>
          <Audio src={sfx("bips.wav")} loop volume={0.35} />
        </Sequence>
      )}
      {texto.slice(0, n)}
      <span style={{ opacity: 0 }}>{texto.slice(n)}</span>
    </>
  );
};

const Corazon: React.FC<{ escala: number }> = ({ escala }) => (
  <path
    d="M0 30 C -60 -10, -40 -60, 0 -30 C 40 -60, 60 -10, 0 30 Z"
    transform={`translate(600 470) scale(${escala * 14})`}
    fill="#000"
  />
);

/** Cortina en forma de corazón que se cierra y se abre en `centro`. */
const Cortina: React.FC<{ centro: number }> = ({ centro }) => {
  const frame = useCurrentFrame();
  if (frame < centro - 16 || frame > centro + 16) return null;
  const escala =
    frame <= centro
      ? interpolate(frame, [centro - 16, centro], [1.2, 0], { ...clamp, easing: Easing.in(Easing.quad) })
      : interpolate(frame, [centro, centro + 16], [0, 1.2], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <svg width={ANCHO} height={ALTO} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <mask id="corazon-mask">
          <rect width={ANCHO} height={ALTO} fill="#fff" />
          <Corazon escala={escala} />
        </mask>
        <pattern id="lunares" width={60} height={60} patternUnits="userSpaceOnUse">
          <rect width={60} height={60} fill={C.rosa} />
          <circle cx={15} cy={15} r={7} fill="#FFFFFF88" />
          <circle cx={45} cy={45} r={7} fill="#FFFFFF88" />
        </pattern>
      </defs>
      <rect width={ANCHO} height={ALTO} fill="url(#lunares)" mask="url(#corazon-mask)" />
    </svg>
  );
};

const PantallaTitulo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 5, fps, config: { damping: 8 } });
  const salto = (k: number) => Math.abs(Math.sin((frame + k * 8) / 7)) * 20;
  return (
    <AbsoluteFill>
      <Vichy />
      <Lazo x={120} y={110} tam={200} rot={-15} />
      <Lazo x={1080} y={110} tam={200} rot={15} />
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", transform: `scale(${logo}) rotate(-3deg)` }}>
        <div style={{ fontFamily: C.redonda, fontSize: 170, lineHeight: 0.95, ...contorno("#FFFFFF", 22) }}>Cocina</div>
        <div style={{ fontFamily: C.redonda, fontSize: 170, lineHeight: 0.95, ...contorno(C.rosaFuerte, 22) }}>Dulce ♡</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 510,
          left: 250,
          right: 250,
          textAlign: "center",
          padding: "10px 0",
          borderRadius: 40,
          backgroundColor: "#FFFFFF",
          border: `5px solid ${C.contorno}`,
          fontFamily: C.pixel,
          fontWeight: 700,
          fontSize: 38,
          color: C.texto,
          opacity: logo,
        }}
      >
        Receta nº 1 · Tostada de fresa
      </div>
      <Boton x={600} y={660} w={380} texto="▶ JUGAR" presionado={frame >= T.clickJugar && frame < T.clickJugar + 6} tam={64} />
      <Mochi x={170} y={880} px={10} brazosArriba={Math.floor(frame / 8) % 2 === 0} salto={salto(0)} />
      <Mochi x={1030} y={880} px={10} brazosArriba={Math.floor(frame / 8) % 2 === 1} salto={salto(1)} />
      <Destello x={300} y={440} tam={60} />
      <Destello x={920} y={420} tam={50} fase={2} />
      <Destello x={980} y={560} tam={36} fase={4} color={C.amarillo} />
      <Destello x={220} y={600} tam={40} fase={1} color={C.amarillo} />
    </AbsoluteFill>
  );
};

const Burbuja: React.FC<{ texto: string; desde: number; hasta: number }> = ({ texto, desde, hasta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < desde || frame > hasta) return null;
  const s = spring({ frame: frame - desde, fps, config: { damping: 9 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 600,
        transform: `scale(${s})`,
        transformOrigin: "20% 100%",
        backgroundColor: "#FFFFFF",
        border: `5px solid ${C.contorno}`,
        borderRadius: 26,
        padding: "12px 26px",
        fontFamily: C.pixel,
        fontWeight: 700,
        fontSize: 44,
        color: C.rosaFuerte,
        whiteSpace: "nowrap",
      }}
    >
      <Escribir texto={texto} desde={desde} vel={2} />
    </div>
  );
};

const PantallaCocina: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cursor = posicionCursor(frame);
  const carga = CARGA.find(([a, b]) => frame >= a && frame < b);
  const pasoActual = T.pasos.findIndex((p, i) => frame < (T.pasos[i + 1]?.banner ?? Infinity));
  const paso = T.pasos[pasoActual];
  const hechos = T.pasos.filter((p) => frame >= p.fin).length;

  const pan = spring({ frame: frame - T.pasos[0].fin, fps, config: { damping: 9 } });
  const untado = interpolate(frame, [...T.untar], [0, 1], clamp);
  const fresas = T.fresas.filter((f) => frame >= f).length;
  const miel = interpolate(frame, [...T.miel], [0, 1], clamp);
  const final = frame >= 690;
  const puntos = hechos * 100;

  return (
    <AbsoluteFill>
      <Vichy tam={70} />
      {/* Plato y tostada */}
      <div style={{ position: "absolute", left: PLATO.x - 230, top: PLATO.y - 230 }}>
        <PlatoArriba r={230} />
      </div>
      {frame >= T.pasos[0].fin && (
        <div
          style={{
            position: "absolute",
            left: PLATO.x - 150,
            top: PLATO.y - 140,
            width: 300,
            height: 280,
            transform: `scale(${interpolate(pan, [0, 1], [1.4, 1])})`,
            opacity: Math.min(1, pan * 3),
          }}
        >
          <Tostada untado={untado} fresas={fresas} miel={miel} id="juego" />
        </div>
      )}
      {final &&
        [
          [300, 330],
          [660, 360],
          [640, 700],
          [320, 690],
        ].map(([x, y], i) => <Destello key={i} x={x} y={y} tam={70} fase={i * 1.3} color={i % 2 ? C.amarillo : "#FFFFFF"} />)}

      {/* Despensa */}
      <Encaje x={905} y={175} w={210} h={590} color={C.rosa}>
        <div style={{ position: "absolute", top: 8, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: C.texto }}>
          Despensa
        </div>
      </Encaje>
      {SLOTS.map((s) => {
        const encima = !carga && Math.hypot(cursor.x - SLOT_X, cursor.y - s.y) < 70;
        return (
          <React.Fragment key={s.n}>
            <div
              style={{
                position: "absolute",
                left: SLOT_X - 62,
                top: s.y - 58,
                width: 124,
                height: 116,
                borderRadius: 20,
                border: `5px solid ${encima ? C.rosaFuerte : C.contorno}`,
                backgroundColor: encima ? C.amarillo : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${encima ? 1.08 : 1})`,
              }}
            >
              <Sprite n={s.n} tam={96} style={{ opacity: carga?.[2] === s.n ? 0.35 : 1 }} />
            </div>
            {encima && (
              <div
                style={{
                  position: "absolute",
                  right: ANCHO - SLOT_X + 80,
                  top: s.y - 30,
                  backgroundColor: C.texto,
                  color: "#FFFFFF",
                  fontFamily: C.pixel,
                  fontWeight: 700,
                  fontSize: 34,
                  padding: "6px 18px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                }}
              >
                {s.nombre}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Cinta superior con la instrucción */}
      {paso && (
        <div
          style={{
            position: "absolute",
            left: 50,
            right: 50,
            top: 30,
            height: 100,
            borderRadius: 26,
            backgroundColor: C.rosaFuerte,
            border: `5px solid ${C.contorno}`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 30px",
            boxShadow: `0 8px 0 ${C.contorno}`,
          }}
        >
          <div style={{ position: "absolute", inset: 8, borderRadius: 18, border: "3px dashed #FFFFFFAA" }} />
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 40, ...contorno(C.amarillo, 8) }}>
            PASO {pasoActual + 1}/4
          </div>
          <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 46, ...contorno("#FFFFFF", 8) }}>
            <Escribir key={pasoActual} texto={paso.texto} desde={paso.banner} />
          </div>
        </div>
      )}

      {/* Mascota que da ánimos */}
      <Mochi x={130} y={880} px={9} brazosArriba={T.pasos.some((p) => frame >= p.fin && frame < p.fin + 30) && Math.floor(frame / 5) % 2 === 0} />
      {T.pasos.map((p) => (
        <Burbuja key={p.fin} texto={p.feedback} desde={p.fin + 2} hasta={p.fin + 34} />
      ))}

      {/* Progreso y puntos */}
      <div style={{ position: "absolute", left: 270, top: 810, display: "flex", gap: 12 }}>
        {T.pasos.map((p, i) => (
          <Sprite key={i} n="corazon" tam={64} style={{ filter: i < hechos ? "none" : "grayscale(1) opacity(0.35)" }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 805,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#FFFFFF",
          border: `5px solid ${C.contorno}`,
          borderRadius: 20,
          padding: "4px 20px",
        }}
      >
        <Sprite n="estrella" tam={52} />
        <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 44, color: C.texto }}>{puntos}</div>
      </div>

      {/* Lo que lleva el cursor */}
      {carga && (
        <div
          style={{
            position: "absolute",
            left: cursor.x - 55,
            top: cursor.y - 70,
            transform: carga[2] === "miel" && frame >= T.miel[0] ? "rotate(-120deg)" : "rotate(-8deg)",
          }}
        >
          <Sprite n={carga[2]} tam={carga[2] === "fresa" ? 80 : 110} />
        </div>
      )}
      {frame >= T.miel[0] && frame <= T.miel[1] && (
        <div
          style={{
            position: "absolute",
            left: cursor.x - 70,
            top: cursor.y - 10,
            width: 12,
            height: 70,
            borderRadius: 6,
            backgroundColor: "#F2A93BDD",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const PantallaRecetaNueva: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marco = spring({ frame: frame - (T.cortina2 + 4), fps, config: { damping: 11 } });
  const tile = spring({ frame: frame - T.jingle, fps, config: { damping: 7 } });
  const nombre = T.jingle + 25;
  return (
    <AbsoluteFill>
      <Vichy color="#CDB7F255" fondo="#F4ECFF" tam={80} />
      <div style={{ position: "absolute", left: -200, top: 380, width: 1700, height: 120, backgroundColor: C.rosa, transform: "rotate(-14deg)", border: `5px solid ${C.contorno}` }} />
      <Lazo x={1080} y={90} tam={220} rot={20} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${marco})` }}>
        <Encaje x={130} y={90} w={940} h={570} color={C.azul} fondo={<Vichy tam={50} />}>
          <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: C.pixel, fontWeight: 700, fontSize: 60, lineHeight: 1.15, ...contorno(C.amarillo, 12) }}>
            ¡Has conseguido
            <br />
            una receta nueva!
          </div>
          <div
            style={{
              position: "absolute",
              left: 470 - 120,
              top: 210,
              width: 240,
              height: 240,
              borderRadius: 40,
              background: `linear-gradient(${C.amarillo}, #FFB86B)`,
              border: `6px solid ${C.contorno}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${tile})`,
            }}
          >
            <div style={{ width: 200, height: 200, borderRadius: 30, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 160, height: 150 }}>
                <Tostada untado={1} fresas={3} miel={1} id="premio" />
              </div>
            </div>
          </div>
          <Sprite n="flor" tam={130} style={{ position: "absolute", left: 140, top: 265, transform: `rotate(${frame * 2}deg) scale(${tile})` }} />
          <Sprite n="flor" tam={130} style={{ position: "absolute", left: 670, top: 265, transform: `rotate(${-frame * 2}deg) scale(${tile})` }} />
          <div style={{ position: "absolute", top: 478, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 52, ...contorno(C.rosaFuerte, 10) }}>
            {frame >= nombre && <Escribir texto="Tostada de fresa y miel" desde={nombre} vel={2} />}
          </div>
        </Encaje>
      </div>
      {[90, 210, 330, 870, 990, 1110].map((x, i) => (
        <Mochi
          key={x}
          x={x}
          y={900}
          px={8}
          brazosArriba={Math.floor((frame + i * 4) / 7) % 2 === 0}
          salto={frame >= T.jingle ? Math.abs(Math.sin((frame + i * 5) / 6)) * 28 : 0}
        />
      ))}
      <Boton x={600} y={790} w={360} texto="Siguiente ▶" presionado={frame >= T.clickSiguiente && frame < T.clickSiguiente + 6} tam={48} />
    </AbsoluteFill>
  );
};

const PantallaLibro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: frame - T.libro, fps, config: { damping: 14 } });
  const guardada = spring({ frame: frame - T.clickGuardar - 2, fps, config: { damping: 7 } });
  const items = ["pan", "mantequilla", "fresa", "miel"];
  return (
    <AbsoluteFill>
      <Vichy color="#A8D8F044" fondo="#EAF6FC" tam={80} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - entra) * 1200}px) rotate(${(1 - entra) * 8}deg)` }}>
        {/* Tapa y hoja */}
        <div style={{ position: "absolute", left: 150, top: 30, width: 920, height: 840, borderRadius: 44, backgroundColor: "#F2789A", border: `6px solid ${C.contorno}` }} />
        <div
          style={{
            position: "absolute",
            left: 185,
            top: 48,
            width: 850,
            height: 790,
            borderRadius: 32,
            backgroundColor: "#FFFFFF",
            border: `5px solid ${C.contorno}`,
            backgroundImage: "linear-gradient(#FBE3EC 2px, transparent 2px), linear-gradient(90deg, #FBE3EC 2px, transparent 2px)",
            backgroundSize: "34px 34px",
          }}
        />
        {/* Espiral */}
        {[120, 250, 380, 510, 640, 770].map((y) => (
          <div key={y} style={{ position: "absolute", left: 140, top: y, width: 90, height: 34, borderRadius: 17, border: `6px solid ${C.contorno}`, background: "linear-gradient(#FFFFFF, #CFCFD8)" }} />
        ))}
        {/* Título */}
        <div style={{ position: "absolute", left: 300, top: 70, width: 660, height: 110, borderRadius: 24, backgroundColor: C.rosaClaro, border: `5px solid ${C.rosa}` }} />
        <div style={{ position: "absolute", left: 265, top: 60, width: 110, height: 60, transform: "rotate(-14deg)", border: `4px solid ${C.contorno}` }}>
          <Vichy tam={20} color="#E8678A88" fondo="#FFFFFF" />
        </div>
        <div style={{ position: "absolute", left: 300, top: 78, width: 660, textAlign: "center", fontFamily: C.redonda, fontSize: 74, ...contorno("#F2789A", 14) }}>
          LIBRO DE RECETAS
        </div>
        {/* Entrada nº 1 */}
        <div
          style={{
            position: "absolute",
            left: 260,
            top: 230,
            width: 720,
            height: 280,
            borderRadius: 28,
            border: `6px solid ${C.rosa}`,
            backgroundColor: C.rosaClaro,
            backgroundImage: "linear-gradient(#F7A8C433 2px, transparent 2px), linear-gradient(90deg, #F7A8C433 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div style={{ position: "absolute", left: 24, top: 14, fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: C.rosaFuerte }}>Nº 1</div>
          <div style={{ position: "absolute", left: 20, right: 20, top: 60, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {items.map((n, i) => {
              const s = spring({ frame: frame - T.ecuacion[i], fps, config: { damping: 8 } });
              return (
                <React.Fragment key={n}>
                  {i > 0 && <div style={{ fontFamily: C.redonda, fontSize: 54, color: C.contorno, opacity: s }}>+</div>}
                  <Sprite n={n} tam={96} style={{ transform: `scale(${s})` }} />
                </React.Fragment>
              );
            })}
            <div style={{ fontFamily: C.redonda, fontSize: 60, color: C.contorno, margin: "0 8px" }}>=</div>
            <div style={{ width: 130, height: 120, transform: `scale(${spring({ frame: frame - T.ecuacion[4], fps, config: { damping: 7 } })})` }}>
              <Tostada untado={1} fresas={3} miel={1} id="libro" />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 18, width: "100%", textAlign: "center", fontFamily: C.redonda, fontSize: 44, color: C.texto }}>
            {frame >= T.ecuacion[4] + 8 && <Escribir texto="Tostada de fresa y miel" desde={T.ecuacion[4] + 8} vel={1} />}
          </div>
        </div>
        {/* Entrada bloqueada */}
        <div
          style={{
            position: "absolute",
            left: 260,
            top: 540,
            width: 720,
            height: 170,
            borderRadius: 28,
            border: `6px solid ${C.menta}`,
            backgroundColor: "#F2FBF4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: C.pixel,
            fontWeight: 700,
            fontSize: 44,
            color: "#9CC9A8",
          }}
        >
          Nº 2 · ? ? ? (¡pronto!)
        </div>
        {/* Pie de página */}
        <div style={{ position: "absolute", left: 270, top: 760, display: "flex", gap: 22 }}>
          {[0, 1, 2, 3].map((i) => (
            <Sprite key={i} n={i % 2 ? "corazon" : "flor"} tam={44} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 150, top: 870, transform: "translateY(-50%)", backgroundColor: C.rosaClaro, border: `5px solid ${C.contorno}`, borderRadius: 30, padding: "4px 22px", fontFamily: C.redonda, fontSize: 36, color: C.rosaFuerte }}>
          1/24
        </div>
        <Boton x={900} y={790} w={250} texto="♡ Guardar" color="#7FD49B" presionado={frame >= T.clickGuardar && frame < T.clickGuardar + 6} tam={42} />
        {frame >= T.clickGuardar && (
          <div style={{ position: "absolute", left: 600, top: 420, transform: `scale(${guardada}) rotate(-12deg)`, display: "flex", alignItems: "center", gap: 10 }}>
            <Sprite n="corazon" tam={110} />
            <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 66, ...contorno(C.rosaFuerte, 10) }}>¡Guardada!</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Ventana del juego (1200×900 lógicos) con todo lo que pasa dentro, cursor y sonidos. */
export const VentanaJuego: React.FC = () => {
  const frame = useCurrentFrame();
  const cursor = posicionCursor(frame);
  const carga = CARGA.find(([a, b]) => frame >= a && frame < b);
  const ultimoClick = CLICKS.filter((c) => c <= frame).pop();
  const presionado = (ultimoClick !== undefined && frame - ultimoClick < 6) || (carga && ["pan", "miel"].includes(carga[2]));
  const pops = [T.pasos[0].fin, ...T.fresas, T.jingle + 2, ...T.ecuacion];

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.rosaClaro }}>
      {frame < T.cortina && <PantallaTitulo />}
      {frame >= T.cortina && frame < T.cortina2 && <PantallaCocina />}
      {frame >= T.cortina2 && frame < T.libro && <PantallaRecetaNueva />}
      {frame >= T.libro && <PantallaLibro />}

      {/* Ondas de clic */}
      {CLICKS.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 12) return null;
        const p = posicionCursor(c);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: p.x - 10 - t * 5,
              top: p.y - 10 - t * 5,
              width: 20 + t * 10,
              height: 20 + t * 10,
              borderRadius: "50%",
              border: `6px solid ${C.rosaFuerte}`,
              opacity: 1 - t / 12,
            }}
          />
        );
      })}
      <Cursor x={cursor.x} y={cursor.y} presionado={Boolean(presionado)} />
      <Cortina centro={T.cortina} />
      <Cortina centro={T.cortina2} />

      {/* Sonido */}
      {CLICKS.map((c) => (
        <Audio key={`c${c}`} src={sfx("click.wav")} from={c} volume={0.5} name="Clic" />
      ))}
      {pops.map((p, i) => (
        <Audio key={`p${i}`} src={sfx("pop.wav")} from={p} volume={0.35} name="Pop" />
      ))}
      <Sequence from={T.untar[0]} durationInFrames={T.untar[1] - T.untar[0]} layout="none" name="Untar">
        <Audio src={sfx("untar.wav")} loop volume={0.35} />
      </Sequence>
      <Sequence from={T.miel[0]} durationInFrames={T.miel[1] - T.miel[0]} layout="none" name="Chorro de miel">
        <Audio src={sfx("chorro.wav")} loop volume={0.5} />
      </Sequence>
      {[690, T.clickGuardar + 2].map((b) => (
        <Audio key={`b${b}`} src={sfx("brillo.wav")} from={b} volume={0.45} name="Brillo" />
      ))}
      <Audio src={sfx("jingle.wav")} from={T.jingle} volume={0.6} name="Receta nueva" />
    </AbsoluteFill>
  );
};
