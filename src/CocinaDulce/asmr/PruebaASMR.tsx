import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, Easing, interpolate, interpolateColors, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sprite } from "../Deco";
import { C } from "../tema";
import { Cocina, borde } from "../disenos/Escenas";
import { PALETAS } from "../disenos/paletas";
import { Batidor, Bol, Lienzo, Pancake, Plato, Sarten } from "../pancakes/Objetos";

// Prueba ASMR: sonidos reales del banco (sounds/, recortados en public/audio/asmr/) sincronizados
// con la animación. Sin música ni voz. Formato YouTube 1920×1080.
const P = PALETAS.find((x) => x.id === "A")!;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (seg: number) => Math.round(seg * 30);
const X = 600;
const Y = 700;

// Línea de tiempo (frames). Los "golpe" coinciden con el instante fuerte de cada sonido.
const T = {
  huevoAudio: 10,
  get crack() { return this.huevoAudio + s(2.6); },
  batir: [120, 315] as const,
  cambioSarten: 315,
  verterAudio: 345,
  verter: [350, 480] as const,
  chisporroteo: 360,
  subir: [480, 570] as const,
  voltearAudio: 585,
  get voltear() { return this.voltearAudio + s(0.86); },
  cambioPlato: 690,
  platoAudio: 725,
  get aterriza() { return this.platoAudio + s(0.64); },
  temblorAudio: 760,
  temblores: [0.24, 0.42, 1.1, 1.36, 2.04, 3.38].map((t) => 760 + s(t)),
  siropeAudio: 900,
  sirope: [905, 1040] as const,
  fresas: [1055, 1068],
  cucharadas: [368, 410, 452], // modo juego: cucharadas de masa que se apilan
  final: 1080,
  total: 1170,
};

const PASOS: [number, number, string][] = [
  [0, 115, "Cascar el huevo"],
  [120, 315, "Batir"],
  [345, 480, "Masa a la sartén"],
  [480, 585, "Fuego bajo"],
  [585, 690, "Dar la vuelta"],
  [720, 900, "Emplatar"],
  [900, 1075, "Sirope"],
];

const DORADO = "#E2A253";
const LADO = "#F8DDAA";

type Modo = "real" | "juego";
// En modo juego el temblor se marca con "boings" propios, no con el sonido de gelatina.
const tiemposTemblor = (modo: Modo) => (modo === "juego" ? [T.aterriza + 3, T.aterriza + 26, T.aterriza + 52, T.aterriza + 80] : T.temblores);

const Cuchara: React.FC<{ x: number; y: number; conMasa: boolean }> = ({ x, y, conMasa }) => (
  <svg width={220} height={300} viewBox="-110 -40 220 300" style={{ position: "absolute", left: x - 110, top: y - 40, overflow: "visible" }}>
    <rect x={-12} y={-190} width={24} height={200} rx={12} fill={P.maderaOscura} stroke={P.contorno} strokeWidth={5} transform="rotate(28 0 10)" />
    <ellipse cx={0} cy={30} rx={62} ry={40} fill="#D9D3DB" stroke={P.contorno} strokeWidth={6} />
    {conMasa && <ellipse cx={0} cy={18} rx={52} ry={30} fill="#FFF1D6" stroke="#EAD3A8" strokeWidth={4} />}
  </svg>
);

const Escena: React.FC<{ modo: Modo }> = ({ modo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Bol: huevo y batido
  const yema = frame >= T.crack;
  const batir = interpolate(frame, [...T.batir], [0, 1], clamp);
  const colorMezcla = interpolateColors(batir, [0, 1], ["#FFF3D9", "#FFE6A8"]);
  const ang = frame * 0.32;
  const dxBol = interpolate(frame, [T.cambioSarten, T.cambioSarten + 18], [0, -1300], { ...clamp, easing: Easing.in(Easing.quad) });

  // --- Sartén: verter, subir, voltear
  const dxSarten =
    interpolate(frame, [T.cambioSarten + 6, T.cambioSarten + 26], [1300, 0], { ...clamp, easing: Easing.out(Easing.quad) }) +
    interpolate(frame, [T.cambioPlato, T.cambioPlato + 18], [0, -1300], { ...clamp, easing: Easing.in(Easing.quad) });
  const masa =
    modo === "juego"
      ? T.cucharadas.reduce((acc, c) => acc + spring({ frame: frame - c, fps, config: { damping: 9 } }) / T.cucharadas.length, 0)
      : interpolate(frame, [T.verter[0] + 20, T.verter[1]], [0, 1], clamp);
  const sube = interpolate(frame, [...T.subir], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const vuelta = interpolate(frame, [T.voltear - 22, T.voltear], [0, 1], clamp);
  const hecho = vuelta >= 0.5;
  const altura = (18 + 50 * masa) + 55 * sube;

  // --- Plato: aterrizaje, temblores y sirope
  const dxPlato = interpolate(frame, [T.cambioPlato + 6, T.cambioPlato + 26], [1300, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const caida = spring({ frame: frame - (T.aterriza - 10), fps, config: { damping: 12, stiffness: 160 } });
  const ultimo = [...tiemposTemblor(modo), T.aterriza].filter((t) => frame >= t).sort((a, b) => b - a)[0];
  const temblor = ultimo !== undefined ? Math.sin((frame - ultimo) * 1.1) * Math.exp(-(frame - ultimo) / 9) * 0.13 : 0;
  const sirope = interpolate(frame, [...T.sirope], [0, 1], clamp);
  const hPlato = 130;
  const topeY = Y + 30 - hPlato;

  return (
    <AbsoluteFill>
      <Cocina p={P} />
      <div style={{ position: "absolute", left: 300, top: 600, width: 600, height: 300, borderRadius: 40, backgroundColor: P.madera, border: borde(P, 5) }} />

      {/* Bol */}
      {frame < T.cambioSarten + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxBol}px)` }}>
          <Bol
            p={P}
            x={X}
            y={Y}
            contenido={
              <>
                {yema && <ellipse cx={X} cy={Y - 58} rx={120 + 50 * batir} ry={26 + 10 * batir} fill={batir > 0 ? colorMezcla : "#FFFFFF"} stroke="#EADBC3" strokeWidth={3} />}
                {yema && batir < 0.3 && <circle cx={X - 10} cy={Y - 62} r={22 * (1 - batir * 3)} fill="#FFC83D" stroke="#E8A63A" strokeWidth={3} />}
                {batir > 0 && batir < 1 && (
                  <g transform={`translate(${X} ${Y - 60}) scale(1 0.25) rotate(${frame * 18})`}>
                    <path d="M0 0 C 40 -10 60 30 30 60 C -10 100 -90 60 -90 0 C -90 -90 20 -150 110 -110" fill="none" stroke="#F0D9A8" strokeWidth={14} strokeLinecap="round" />
                  </g>
                )}
              </>
            }
          />
          {/* huevo que golpea el borde y se abre */}
          {frame < T.crack + 16 && (
            <div
              style={{
                position: "absolute",
                left: X - 60,
                top: 470 + (frame < T.crack ? Math.max(0, Math.sin((frame - 50) / 4)) * -18 : (frame - T.crack) * 6),
                opacity: frame < T.crack ? 1 : 1 - (frame - T.crack) / 16,
                transform: `rotate(${frame < T.crack ? -12 : -12 - (frame - T.crack) * 6}deg)`,
              }}
            >
              <Sprite n="huevo" tam={120} />
            </div>
          )}
          {frame >= T.batir[0] - 4 && frame < T.batir[1] && (
            <Batidor p={P} x={X + Math.cos(ang) * 110} y={Y - 30 + Math.sin(ang) * 26} rot={Math.sin(ang) * 14} />
          )}
        </div>
      )}

      {/* Sartén */}
      {frame >= T.cambioSarten && frame < T.cambioPlato + 20 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxSarten}px)` }}>
          <Sarten
            p={P}
            x={X}
            y={Y}
            calor={1}
            dentro={
              masa > 0 ? (
                <g transform={`translate(0 ${-Math.sin(vuelta * Math.PI) * 110}) translate(${X} ${Y - 6}) scale(1 ${Math.max(0.12, Math.abs(Math.cos(vuelta * Math.PI)))}) translate(${-X} ${-(Y - 6)})`}>
                  <Pancake p={P} x={X} yBase={Y - 6} rx={70 + 50 * masa} ry={20 + 12 * masa} h={altura} arriba={hecho ? DORADO : "#FFF1D6"} lado={hecho ? LADO : "#FFF7EA"} />
                </g>
              ) : null
            }
          />
          {/* chorro de masa */}
          {modo === "juego" &&
            T.cucharadas.map((c) => {
              if (frame < c - 28 || frame > c + 14) return null;
              const baja = interpolate(frame, [c - 28, c], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
              const sube = interpolate(frame, [c, c + 14], [0, 1], clamp);
              const yCuchara = 180 + (Y - 6 - altura - 60 - 180) * baja - 160 * sube;
              return <Cuchara key={c} x={X + 30} y={yCuchara} conMasa={frame < c} />;
            })}
          {modo === "real" && frame >= T.verter[0] && frame <= T.verter[1] && (
            <div
              style={{
                position: "absolute",
                left: X - 14 + Math.sin(frame / 6) * 4,
                top: 240,
                width: 28,
                height: Y - 6 - altura - 240,
                borderRadius: 14,
                background: "linear-gradient(90deg, #FFF1D6, #FFE7BF)",
                border: "3px solid #EAD3A8",
              }}
            />
          )}
          {sube > 0.3 && (
            <Lienzo>
              {[-40, 10, 60].map((dx, i) => (
                <path
                  key={i}
                  d={`M${X + dx} ${Y - altura - 40} q 18 -36 0 -72 q -18 -36 0 -72`}
                  stroke="#FFFFFF"
                  strokeWidth={9}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.4}
                  transform={`translate(0 ${-((frame * 2 + i * 24) % 56)})`}
                />
              ))}
            </Lienzo>
          )}
        </div>
      )}

      {/* Plato */}
      {frame >= T.cambioPlato && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxPlato}px)` }}>
          <Plato p={P} x={X} y={Y + 40} />
          <Lienzo>
            <g
              transform={`translate(0 ${(1 - caida) * -500}) translate(${X} ${Y + 30}) scale(${1 - temblor * 0.6} ${1 + temblor}) translate(${-X} ${-(Y + 30)})`}
            >
              <Pancake p={P} x={X} yBase={Y + 30} rx={150} ry={40} h={hPlato} arriba={DORADO} lado={LADO} />
              {sirope > 0 && (
                <>
                  <ellipse cx={X} cy={topeY} rx={140 * Math.min(1, sirope * 1.5)} ry={36 * Math.min(1, sirope * 1.5)} fill="#E89B2E" opacity={0.75} />
                  {[-130, -60, 70, 125].map((dx, i) => {
                    const l = interpolate(sirope, [0.3 + i * 0.12, 1], [0, 60 + i * 25], clamp);
                    const y0 = topeY + Math.sqrt(Math.max(0, 1 - (dx / 150) ** 2)) * 38;
                    return <path key={i} d={`M${X + dx} ${y0} L ${X + dx} ${y0 + l}`} stroke="#E89B2E" strokeWidth={18} strokeLinecap="round" />;
                  })}
                </>
              )}
            </g>
          </Lienzo>
          {/* hilo de sirope desde arriba */}
          {frame >= T.sirope[0] && frame <= T.sirope[1] - 10 && (
            <div style={{ position: "absolute", left: X - 8 + Math.sin(frame / 9) * 60, top: 240, width: 16, height: topeY - 240, borderRadius: 8, backgroundColor: "#E89B2ECC" }} />
          )}
          {T.fresas.map((f, i) => {
            if (frame < f) return null;
            const e = spring({ frame: frame - f, fps, config: { damping: 9 } });
            return <Sprite key={f} n="fresa" tam={110} style={{ position: "absolute", left: X - 120 + i * 120, top: topeY - 95 - (1 - e) * 300 }} />;
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Rotulo: React.FC = () => {
  const frame = useCurrentFrame();
  const paso = PASOS.find(([a, b]) => frame >= a && frame < b);
  if (!paso) return null;
  const o = interpolate(frame, [paso[0], paso[0] + 12, paso[1] - 12, paso[1]], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        bottom: 70,
        opacity: o,
        padding: "12px 28px",
        borderRadius: 999,
        backgroundColor: `${P.panel}E6`,
        border: borde(P, 4),
        fontFamily: C.redonda,
        fontSize: 40,
        color: P.texto,
      }}
    >
      {paso[2]}
    </div>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [T.final, T.final + 25], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", right: 70, bottom: 70, opacity: o, textAlign: "right" }}>
      <div style={{ fontFamily: C.redonda, fontSize: 56, color: P.texto }}>Pancakes japoneses</div>
      <div style={{ fontFamily: C.pixel, fontWeight: 700, fontSize: 30, color: P.uiOscuro }}>Fuwa Fuwa Kitchen ♡</div>
    </div>
  );
};

const sonido = (n: string) => staticFile(`audio/asmr/${n}.mp3`);
const juego = (n: string) => staticFile(`audio/cocina-juego/${n}.wav`);
const kawaii = (n: string) => staticFile(`audio/kawaii/${n}`);

const SonidosReales: React.FC = () => (
  <>
    <Audio src={sonido("cascar")} from={T.huevoAudio} name="Cascar huevo" />
    <Audio src={sonido("batir")} from={T.batir[0]} name="Batir" />
    <Audio src={sonido("verter-masa")} from={T.verterAudio} name="Verter masa" />
    <Sequence from={T.chisporroteo} durationInFrames={T.cambioPlato + 20 - T.chisporroteo} layout="none" name="Chisporroteo">
      <Audio src={sonido("chisporroteo")} volume={(f) => interpolate(f, [0, 20, 310, 350], [0, 0.9, 0.9, 0], clamp)} />
    </Sequence>
    <Audio src={sonido("voltear")} from={T.voltearAudio} name="Voltear" />
    <Audio src={sonido("plato")} from={T.platoAudio} name="Plato" />
    <Audio src={sonido("temblor")} from={T.temblorAudio} name="Temblor" />
    <Audio src={sonido("sirope")} from={T.siropeAudio} name="Sirope" />
  </>
);

const VOLUMEN_MUSICA = 0.32;

const SonidosJuego: React.FC = () => (
  <>
    <Audio
      name="Música"
      src={kawaii("musica.mp3")}
      loop
      volume={(f) => interpolate(f, [0, 30, T.total - 45, T.total], [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0], clamp)}
    />
    <Audio src={juego("toc-huevo")} from={63} name="Toc huevo" />
    <Audio src={juego("crack-suave")} from={T.crack} name="Crack" />
    <Audio src={juego("batir")} from={T.batir[0]} name="Batir" />
    {T.cucharadas.map((c, i) => (
      <Audio key={c} src={juego(`plop-${i + 1}`)} from={c} name={`Plop ${i + 1}`} />
    ))}
    <Sequence from={T.chisporroteo} durationInFrames={T.cambioPlato + 20 - T.chisporroteo} layout="none" name="Chisporroteo">
      <Audio src={juego("chisporroteo")} loop volume={(f) => interpolate(f, [0, 25, 310, 350], [0, 0.7, 0.7, 0], clamp)} />
    </Sequence>
    <Audio src={juego("fwip")} from={T.voltear - 22} name="Fwip" />
    <Audio src={juego("toc")} from={T.voltear} name="Toc" />
    <Audio src={juego("tac-plato")} from={T.aterriza} name="Tac plato" />
    {tiemposTemblor("juego").map((t, i) => (
      <Audio key={t} src={juego("boing-esponjoso")} from={t} volume={[0.9, 0.6, 0.4, 0.25][i]} name={`Boing ${i + 1}`} />
    ))}
    <Sequence from={T.sirope[0]} durationInFrames={T.sirope[1] - T.sirope[0]} layout="none" name="Sirope">
      <Audio src={juego("gorgoteo")} loop />
    </Sequence>
    {T.fresas.map((f) => (
      <Audio key={f} src={juego("plop-3")} from={f} volume={0.5} name="Plop fresa" />
    ))}
    <Audio src={juego("tintineo")} from={T.final} name="Tintineo" />
  </>
);

export const PruebaASMR: React.FC<{ modo: Modo }> = ({ modo }) => {
  const frame = useCurrentFrame();
  const fundido = interpolate(frame, [0, 15, T.total - 20, T.total], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fundido }}>
        {/* cámara cercana: ventana de juego 1200×900 ampliada sobre la encimera */}
        <div style={{ position: "absolute", left: 0, top: -340, width: 1200, height: 900, transform: "scale(1.6)", transformOrigin: "0 0", overflow: "hidden" }}>
          <Escena modo={modo} />
        </div>
        <Rotulo />
        <Final />
      </AbsoluteFill>
      {modo === "juego" ? <SonidosJuego /> : <SonidosReales />}
    </AbsoluteFill>
  );
};

export const PruebaASMRComposition: React.FC = () => (
  <>
    <Composition id="Prueba-ASMR-pancakes" component={PruebaASMR} durationInFrames={T.total} fps={30} width={1920} height={1080} defaultProps={{ modo: "real" as const }} />
    <Composition id="Prueba-juego-pancakes" component={PruebaASMR} durationInFrames={T.total} fps={30} width={1920} height={1080} defaultProps={{ modo: "juego" as const }} />
  </>
);
