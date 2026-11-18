import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, interpolateColors, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Paso } from "../Recetas/tipos";
import { Bol, Emoji, MOSTRADOR_Y, Panqueque, Plato, Sarten } from "./Cocina";
import { textoJuego } from "./Hud";
import { TEMA } from "./tema";

type Props = {
  paso: Paso;
  /** Frame (local a la escena) en que empieza la acción. */
  desde: number;
  /** Duración de la acción en frames. */
  duracion: number;
  /** Color de la mezcla del paso anterior (para continuar en el mismo bol). */
  colorPrevio?: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useProgreso = (desde: number, duracion: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [desde, desde + duracion], [0, 1], clamp);
};

/** Medidor circular (mezcla, temporizador...). */
const Medidor: React.FC<{ valor: number; etiqueta: string; centro?: string; color?: string }> = ({
  valor,
  etiqueta,
  centro,
  color = TEMA.verde,
}) => {
  const r = 66;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: 800, top: 400, width: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={r + 14} fill={TEMA.panel} stroke={TEMA.borde} strokeWidth={6} />
        <circle cx={90} cy={90} r={r} fill="none" stroke="#E5DCCD" strokeWidth={18} />
        <circle
          cx={90}
          cy={90}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={18}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - valor)}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
        <text x={90} y={104} textAnchor="middle" fontFamily={TEMA.fuenteJuego} fontSize={40} fill={TEMA.texto}>
          {centro ?? `${Math.round(valor * 100)}%`}
        </text>
      </svg>
      <div style={{ ...textoJuego(36), marginTop: 6 }}>{etiqueta}</div>
    </div>
  );
};

const Remolino: React.FC<{ angulo: number; color: string }> = ({ angulo, color }) => (
  <g transform={`translate(540 900) scale(1 0.24) rotate(${angulo})`}>
    <path
      d="M0 0 C 40 -10 60 30 30 60 C -10 100 -90 60 -90 0 C -90 -90 20 -150 110 -110 C 190 -70 200 40 150 110"
      fill="none"
      stroke={color}
      strokeWidth={22}
      strokeLinecap="round"
    />
  </g>
);

const Mezcla: React.FC<{ desde: number; duracion: number; nivel: number; de: string; a: string }> = ({
  desde,
  duracion,
  nivel,
  de,
  a,
}) => {
  const frame = useCurrentFrame();
  const p = useProgreso(desde, duracion);
  const color = interpolateColors(p, [0, 1], [de, a]);
  const ang = (frame - desde) * 14;
  const rad = (ang * Math.PI) / 180;
  return (
    <>
      <Bol nivel={nivel} color={color} contenido={p > 0 ? <Remolino angulo={ang} color="#00000022" /> : null}>
        <Emoji e="🥄" x={540 + Math.cos(rad) * 150} y={830 + Math.sin(rad) * 34} size={190} rot={-30 + Math.cos(rad) * 15} />
      </Bol>
      <Medidor valor={p} etiqueta="MEZCLA" />
    </>
  );
};

export const Machacar: React.FC<Props> = ({ paso, desde, duracion }) => {
  const frame = useCurrentFrame();
  const p = useProgreso(desde, duracion);
  const ingrediente = paso.ingredientes?.[0] ?? paso.emoji;
  const ciclo = 14;
  const t = Math.max(0, frame - desde);
  const golpe = Math.abs(Math.sin((t * Math.PI) / ciclo));
  const activo = p > 0 && p < 0.92;
  const combo = Math.floor(t / ciclo);
  const fase = (t % ciclo) / ciclo;
  return (
    <>
      <Bol nivel={p * 0.6} color={paso.color ?? "#F2D27C"}>
        <Emoji
          e={ingrediente}
          x={540}
          y={840 + p * 40}
          size={300}
          sx={1 + 0.4 * p}
          sy={1 - 0.7 * p}
          opacity={interpolate(p, [0.75, 0.95], [1, 0], clamp)}
        />
        {activo &&
          Array.from({ length: 6 }).map((_, i) => {
            const ang = Math.PI + (i / 5) * Math.PI;
            const d = fase * 160;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 540 + Math.cos(ang) * d * 1.6 - 14,
                  top: 860 + Math.sin(ang) * d - 14,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: paso.color ?? "#F2D27C",
                  border: `4px solid ${TEMA.borde}`,
                  opacity: 1 - fase,
                }}
              />
            );
          })}
      </Bol>
      {activo && (
        <>
          <Emoji e="🍴" x={600} y={560 + (1 - golpe) * 230} size={240} rot={150} />
          {combo > 0 && (
            <div style={{ position: "absolute", left: 90, top: 560, transform: "rotate(-8deg)", ...textoJuego(72, TEMA.oro) }}>
              x{combo} COMBO
            </div>
          )}
        </>
      )}
      <Medidor valor={p} etiqueta="PURÉ" color={TEMA.oro} />
    </>
  );
};

export const Agregar: React.FC<Props> = ({ paso, desde, duracion, colorPrevio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = paso.ingredientes ?? [paso.emoji];
  const colorFinal = paso.color ?? "#E2B872";
  const base = colorPrevio ?? colorFinal;
  const ventana = duracion * (paso.mezclar ? 0.55 : 0.9);
  const vuelo = 22;
  const llegadas = items.map((_, i) => desde + (i * ventana) / items.length + vuelo);
  const nivelBase = colorPrevio ? 0.4 : 0.1;
  const nivel = nivelBase + llegadas.filter((l) => frame >= l).length * 0.1;

  if (paso.mezclar && frame > desde + ventana + vuelo) {
    return <Mezcla desde={desde + ventana + vuelo} duracion={duracion - ventana - vuelo} nivel={nivel} de={base} a={colorFinal} />;
  }

  return (
    <>
      <Bol nivel={nivel} color={base}>
        {items.map((e, i) => {
          const llegada = llegadas[i];
          const u = interpolate(frame, [llegada - vuelo, llegada], [0, 1], clamp);
          if (frame < llegada - vuelo || frame > llegada + 8) return null;
          const izquierda = i % 2 === 0;
          const x = interpolate(u, [0, 1], [izquierda ? -100 : 1180, 540]);
          const y = interpolate(u, [0, 1], [700, 870]) - 380 * 4 * u * (1 - u);
          const encoger = interpolate(frame, [llegada, llegada + 8], [1, 0], clamp);
          return <Emoji key={i} e={e} x={x} y={y} size={170} rot={u * 360 * (izquierda ? 1 : -1)} sx={encoger} sy={encoger} />;
        })}
      </Bol>
      {items.map((_, i) => {
        const t = frame - llegadas[i];
        const s = spring({ frame: t, fps, config: { damping: 12 } });
        return (
          <React.Fragment key={i}>
            <Audio src={staticFile("audio/pop.wav")} from={Math.round(llegadas[i])} volume={0.3} name={`Pop ${i + 1}`} />
            {t >= 0 && t < 25 && (
              <div
                style={{
                  position: "absolute",
                  left: 470,
                  top: 720 - t * 4,
                  opacity: interpolate(t, [15, 25], [1, 0], clamp),
                  transform: `scale(${s})`,
                  ...textoJuego(72, TEMA.verde),
                }}
              >
                +1
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const MezclarAccion: React.FC<Props> = ({ paso, desde, duracion, colorPrevio }) => (
  <Mezcla desde={desde} duracion={duracion} nivel={0.6} de={colorPrevio ?? "#E2B872"} a={paso.color ?? "#D9A55B"} />
);

const Chisporroteo: React.FC<{ desde: number; duracion: number }> = ({ desde, duracion }) => (
  <Sequence from={Math.round(desde)} durationInFrames={Math.round(duracion)} layout="none" name="Chisporroteo">
    <Audio src={staticFile("audio/juego/chisporroteo.wav")} loop volume={0.22} />
  </Sequence>
);

export const Calentar: React.FC<Props> = ({ desde, duracion }) => {
  const frame = useCurrentFrame();
  const p = useProgreso(desde, duracion);
  const calor = interpolate(p, [0, 0.55], [0, 0.6], clamp);
  const gota = interpolate(p, [0.45, 0.62], [0, 1], clamp);
  const aceite = interpolate(p, [0.62, 0.8], [0, 1], clamp);
  const listo = p > 0.85;
  return (
    <>
      <Chisporroteo desde={desde + duracion * 0.62} duracion={duracion * 0.38 + 50} />
      <Sarten
        calor={calor}
        aceite={aceite}
        encima={
          aceite > 0.5
            ? [0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={`M${430 + i * 110} 930 q 15 -30 0 -60 q -15 -30 0 -60`}
                  stroke="#FFFFFF"
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.35 + 0.25 * Math.sin(frame / 4 + i)}
                  transform={`translate(0 ${-((frame * 2 + i * 20) % 40)})`}
                />
              ))
            : null
        }
      >
        {gota > 0 && gota < 1 && <Emoji e="💧" x={540} y={interpolate(gota, [0, 1], [500, 990])} size={110} />}
      </Sarten>
      {/* Medidor de fuego */}
      <div style={{ position: "absolute", left: 900, top: 420, width: 110, alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            position: "relative",
            width: 70,
            height: 420,
            borderRadius: 35,
            border: `6px solid ${TEMA.borde}`,
            background: `linear-gradient(to top, #6CC3E8 0%, #6CC3E8 33%, ${TEMA.naranja} 33%, ${TEMA.naranja} 70%, ${TEMA.rojo} 70%)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -26,
              width: 110,
              height: 16,
              borderRadius: 8,
              backgroundColor: TEMA.panel,
              border: `5px solid ${TEMA.borde}`,
              bottom: `${(calor / 0.6) * 52}%`,
            }}
          />
        </div>
        <div style={{ ...textoJuego(34), marginTop: 12 }}>🔥</div>
      </div>
      {listo && (
        <div style={{ position: "absolute", left: 230, top: 520, transform: "rotate(-4deg)", ...textoJuego(76, TEMA.naranja) }}>
          FUEGO MEDIO ✓
        </div>
      )}
    </>
  );
};

export const Cocinar: React.FC<Props> = ({ desde, duracion }) => {
  const frame = useCurrentFrame();
  const p = useProgreso(desde, duracion);
  const crudo = "#F3E2B8";
  const dorado = "#D99A45";
  // 0–0.45 lado 1, 0.45–0.6 volteo, 0.6–1 lado 2
  const volteo = interpolate(p, [0.45, 0.6], [0, 1], clamp);
  const salto = Math.sin(volteo * Math.PI) * 260;
  const escalaY = Math.cos(volteo * Math.PI);
  const colorArriba =
    volteo < 0.5 ? interpolateColors(p, [0, 0.45], [crudo, "#EBCB8F"]) : interpolateColors(p, [0.6, 1], [dorado, "#C98634"]);
  const burbujas = volteo < 0.5 ? interpolate(p, [0.1, 0.45], [0, 1], clamp) : 0;
  const lado = p < 0.5 ? 1 : 2;
  const tiempoLado = lado === 1 ? interpolate(p, [0, 0.45], [0, 1], clamp) : interpolate(p, [0.6, 1], [0, 1], clamp);
  const restante = Math.ceil(120 * (1 - tiempoLado));
  return (
    <>
      <Chisporroteo desde={desde} duracion={duracion + 50} />
      <Sarten
        calor={0.6}
        aceite={1}
        encima={
          <>
            {[410, 540, 670].map((x, i) => (
              <g key={x} transform={`translate(0 ${-salto}) translate(${x} 1006) scale(1 ${Math.abs(escalaY) < 0.08 ? 0.08 : escalaY}) translate(${-x} -1006)`}>
                <Panqueque x={x} y={1006} rx={82} ry={26} color={colorArriba} />
                {burbujas > 0 &&
                  [-30, 10, 35, -5].map((dx, k) => (
                    <circle key={k} cx={x + dx} cy={1006 + ((k * 7) % 14) - 7} r={5 * burbujas} fill="#C9A86A" opacity={0.8} />
                  ))}
                {i === 1 && null}
              </g>
            ))}
            {p > 0.25 &&
              [0, 1, 2, 3].map((i) => (
                <path
                  key={`v${i}`}
                  d={`M${380 + i * 105} 940 q 20 -40 0 -80 q -20 -40 0 -80`}
                  stroke="#FFFFFF"
                  strokeWidth={10}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.3}
                  transform={`translate(0 ${-((frame * 3 + i * 25) % 60)})`}
                />
              ))}
          </>
        }
      />
      <MedidorTiempo lado={lado} valor={tiempoLado} restante={restante} />
      {volteo > 0.05 && volteo < 0.95 && (
        <div style={{ position: "absolute", left: 290, top: 470, transform: "rotate(-5deg)", ...textoJuego(90, TEMA.oro) }}>
          ¡VOLTEA!
        </div>
      )}
    </>
  );
};

const MedidorTiempo: React.FC<{ lado: number; valor: number; restante: number }> = ({ lado, valor, restante }) => {
  const r = 66;
  const c = 2 * Math.PI * r;
  const min = Math.floor(restante / 60);
  const seg = String(restante % 60).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: 800, top: 400, width: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={r + 14} fill={TEMA.panel} stroke={TEMA.borde} strokeWidth={6} />
        <circle
          cx={90}
          cy={90}
          r={r}
          fill="none"
          stroke={TEMA.naranja}
          strokeWidth={18}
          strokeDasharray={c}
          strokeDashoffset={c * valor}
          transform="rotate(-90 90 90)"
          strokeLinecap="round"
        />
        <text x={90} y={104} textAnchor="middle" fontFamily={TEMA.fuenteJuego} fontSize={42} fill={TEMA.texto}>
          {min}:{seg}
        </text>
      </svg>
      <div style={{ ...textoJuego(36), marginTop: 6 }}>LADO {lado}</div>
    </div>
  );
};

export const Servir: React.FC<Props> = ({ paso, desde, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useProgreso(desde, duracion);
  const extras = paso.ingredientes ?? [];
  const jarabe = extras[0];
  const toppings = extras.slice(1);
  const pisos = 4;
  const baseY = MOSTRADOR_Y - 70;
  const topeY = baseY - (pisos - 1) * 34;
  const miel = interpolate(p, [0.5, 0.78], [0, 1], clamp);
  return (
    <>
      <Plato />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: pisos }).map((_, i) => {
          const llega = desde + i * duracion * 0.1;
          const s = spring({ frame: frame - llega, fps, config: { damping: 11, stiffness: 120 } });
          if (frame < llega) return null;
          const y = baseY - i * 34;
          return (
            <g key={i} transform={`translate(0 ${(1 - s) * -700})`}>
              <Panqueque x={540} y={y} rx={210} ry={46} color="#E8B060" grosor={30} />
            </g>
          );
        })}
        {miel > 0 && (
          <>
            <path
              d={`M370 ${topeY} q 60 -24 120 0 t 120 0 t 70 6`}
              stroke="#E9A23B"
              strokeWidth={26}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={420}
              strokeDashoffset={420 * (1 - miel)}
            />
            {[400, 560, 690].map((x, i) => (
              <path
                key={x}
                d={`M${x} ${topeY + 6} l 0 ${interpolate(miel, [0.4 + i * 0.15, 1], [0, 70 + i * 20], clamp)}`}
                stroke="#E9A23B"
                strokeWidth={20}
                strokeLinecap="round"
              />
            ))}
          </>
        )}
      </svg>
      {jarabe && p > 0.42 && p < 0.85 && (
        <Emoji e={jarabe} x={300} y={topeY - 230} size={200} rot={interpolate(p, [0.42, 0.5, 0.78, 0.85], [0, -55, -55, 0], clamp)} />
      )}
      {toppings.map((e, i) => {
        const llega = desde + duracion * (0.8 + i * 0.05);
        const s = spring({ frame: frame - llega, fps, config: { damping: 9 } });
        if (frame < llega) return null;
        return <Emoji key={i} e={e} x={500 + i * 90} y={topeY - 60 - (1 - s) * 500} size={150} rot={-10} />;
      })}
      {p > 0.92 &&
        [
          [300, 700],
          [790, 760],
          [700, 600],
        ].map(([x, y], i) => (
          <Emoji key={i} e="✨" x={x} y={y} size={100} sx={0.7 + 0.3 * Math.sin(frame / 4 + i)} sy={0.7 + 0.3 * Math.sin(frame / 4 + i)} />
        ))}
    </>
  );
};

export const Generica: React.FC<Props> = ({ paso, desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - desde, fps, config: { damping: 8 } });
  return <Emoji e={paso.emoji} x={540} y={900 - Math.abs(Math.sin(frame / 8)) * 40} size={380 * s} />;
};

export const ACCIONES: Record<string, React.FC<Props>> = {
  machacar: Machacar,
  agregar: Agregar,
  mezclar: MezclarAccion,
  calentar: Calentar,
  cocinar: Cocinar,
  servir: Servir,
};
