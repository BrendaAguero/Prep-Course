import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Estilo } from "./estilos";
import type { Receta } from "./tipos";
import { Fondo } from "./Fondo";

const voz = (id: string, clip: string) => staticFile(`audio/recetas/${id}/${clip}.mp3`);

const useEntrada = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Titulo: React.FC<{ estilo: Estilo; size: number; color?: string; children: React.ReactNode }> = ({
  estilo,
  size,
  color,
  children,
}) => (
  <div
    style={{
      fontFamily: estilo.fuenteTitulo,
      fontWeight: estilo.pesoTitulo,
      fontSize: size * estilo.escalaTitulo,
      color: color ?? estilo.texto,
      lineHeight: 1.05,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const Plato: React.FC<{ estilo: Estilo; emoji: string; imagen?: string; size: number }> = ({
  estilo,
  emoji,
  imagen,
  size,
}) => {
  const frame = useCurrentFrame();
  const flotar = Math.sin(frame / 18) * 10;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: estilo.superficie,
        boxShadow: estilo.sombra,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: `translateY(${flotar}px)`,
        border: `10px solid ${estilo.acento}33`,
      }}
    >
      {imagen ? (
        <Img src={staticFile(imagen)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ fontSize: size * 0.55, transform: `rotate(${Math.sin(frame / 25) * 6}deg)` }}>{emoji}</div>
      )}
    </div>
  );
};

const Chip: React.FC<{ estilo: Estilo; texto: string; delay: number }> = ({ estilo, texto, delay }) => {
  const s = useEntrada(delay);
  return (
    <div
      style={{
        fontFamily: estilo.fuenteTexto,
        fontWeight: 700,
        fontSize: 40,
        color: estilo.texto,
        backgroundColor: estilo.superficie,
        borderRadius: 999,
        padding: "16px 34px",
        boxShadow: estilo.sombra,
        transform: `scale(${s})`,
      }}
    >
      {texto}
    </div>
  );
};

export const Portada: React.FC<{ receta: Receta; estilo: Estilo; vozDesde: number }> = ({ receta, estilo, vozDesde }) => {
  const plato = useEntrada(0, 10);
  const titulo = useEntrada(10);
  return (
    <AbsoluteFill>
      <Fondo estilo={estilo} />
      <Audio src={voz(receta.id, "intro")} from={vozDesde} name="Voz intro" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70, padding: 80 }}>
        <div style={{ transform: `scale(${plato})` }}>
          <Plato estilo={estilo} emoji={receta.emoji} imagen={receta.imagen} size={560} />
        </div>
        <div style={{ opacity: titulo, transform: `translateY(${(1 - titulo) * 60}px)` }}>
          <Titulo estilo={estilo} size={124}>
            {receta.titulo}
          </Titulo>
          {receta.subtitulo && (
            <Titulo estilo={estilo} size={96} color={estilo.acento}>
              {receta.subtitulo}
            </Titulo>
          )}
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <Chip estilo={estilo} texto={`⏱ ${receta.tiempo}`} delay={25} />
          <Chip estilo={estilo} texto={`🍽 ${receta.porciones}`} delay={31} />
          <Chip estilo={estilo} texto={`⭐ ${receta.dificultad}`} delay={37} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ingredientes: React.FC<{
  receta: Receta;
  estilo: Estilo;
  tiempos: { titulo: number; ingredientes: number[] };
}> = ({ receta, estilo, tiempos }) => {
  const titulo = useEntrada(0);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Fondo estilo={estilo} />
      <Audio src={voz(receta.id, "ingredientes")} from={tiempos.titulo} name="Voz ingredientes" />
      {receta.ingredientes.map((_, i) => (
        <React.Fragment key={i}>
          <Audio src={voz(receta.id, `ingrediente-${i + 1}`)} from={tiempos.ingredientes[i]} name={`Voz ingrediente ${i + 1}`} />
          <Audio src={staticFile("audio/pop.wav")} from={tiempos.ingredientes[i]} volume={0.2} name={`Pop ${i + 1}`} />
        </React.Fragment>
      ))}
      <AbsoluteFill style={{ padding: "230px 90px", gap: 34 }}>
        <div style={{ transform: `scale(${titulo})`, marginBottom: 30 }}>
          <Titulo estilo={estilo} size={110} color={estilo.acento}>
            Ingredientes
          </Titulo>
        </div>
        {receta.ingredientes.map((ing, i) => {
          const s = spring({ frame: frame - tiempos.ingredientes[i], fps, config: { damping: 14 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                backgroundColor: estilo.superficie,
                borderRadius: estilo.radio,
                boxShadow: estilo.sombra,
                padding: "26px 40px",
                opacity: s,
                transform: `translateX(${(1 - s) * -200}px)`,
              }}
            >
              <div style={{ fontSize: 84 }}>{ing.emoji}</div>
              <div style={{ fontFamily: estilo.fuenteTexto, fontWeight: 700, fontSize: 54, color: estilo.texto }}>
                {ing.texto}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PasoEscena: React.FC<{
  receta: Receta;
  estilo: Estilo;
  indice: number;
  vozDesde: number;
}> = ({ receta, estilo, indice, vozDesde }) => {
  const paso = receta.pasos[indice];
  const total = receta.pasos.length;
  const frame = useCurrentFrame();
  const cabecera = useEntrada(0);
  const plato = useEntrada(6, 10);
  const tarjeta = useEntrada(vozDesde, 14);
  const progreso = interpolate(cabecera, [0, 1], [indice / total, (indice + 1) / total]);
  // El texto aparece palabra por palabra al ritmo aproximado de la voz.
  const palabras = paso.texto.split(" ");
  const visibles = Math.min(palabras.length, Math.floor(Math.max(0, frame - vozDesde - 18) / 5) + 1);

  return (
    <AbsoluteFill>
      <Fondo estilo={estilo} />
      <Audio src={voz(receta.id, `paso-${indice + 1}`)} from={vozDesde} name={`Voz paso ${indice + 1}`} />
      <AbsoluteFill style={{ alignItems: "center", padding: "200px 80px 280px", gap: 60 }}>
        <div style={{ width: "100%", opacity: cabecera }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Titulo estilo={estilo} size={96} color={estilo.acento}>
              Paso {indice + 1}
            </Titulo>
            <div style={{ fontFamily: estilo.fuenteTexto, fontWeight: 700, fontSize: 40, color: estilo.textoSuave }}>
              {indice + 1} de {total}
            </div>
          </div>
          <div style={{ height: 14, borderRadius: 7, backgroundColor: `${estilo.textoSuave}33`, marginTop: 20 }}>
            <div style={{ height: "100%", width: `${progreso * 100}%`, borderRadius: 7, backgroundColor: estilo.acento }} />
          </div>
        </div>
        <div style={{ transform: `scale(${plato})`, marginTop: 40 }}>
          <Plato estilo={estilo} emoji={paso.emoji} imagen={paso.imagen} size={620} />
        </div>
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            backgroundColor: estilo.superficie,
            borderRadius: estilo.radio,
            boxShadow: estilo.sombra,
            padding: "44px 50px",
            opacity: tarjeta,
            transform: `translateY(${(1 - tarjeta) * 80}px)`,
          }}
        >
          <div style={{ fontFamily: estilo.fuenteTexto, fontWeight: 700, fontSize: 58, lineHeight: 1.25, color: estilo.texto }}>
            {palabras.map((p, i) => (
              <span key={i} style={{ opacity: i < visibles ? 1 : 0.15 }}>
                {p}{" "}
              </span>
            ))}
          </div>
          {paso.nota && (
            <div style={{ fontFamily: estilo.fuenteTexto, fontWeight: 700, fontSize: 40, color: estilo.acento, marginTop: 20 }}>
              ⚠️ {paso.nota}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Cierre: React.FC<{ receta: Receta; estilo: Estilo; vozDesde: number }> = ({ receta, estilo, vozDesde }) => {
  const plato = useEntrada(0, 8);
  const texto = useEntrada(vozDesde + 30, 9);
  const cta = useEntrada(vozDesde + 70);
  return (
    <AbsoluteFill>
      <Fondo estilo={estilo} />
      <Audio src={voz(receta.id, "cierre")} from={vozDesde} name="Voz cierre" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 80, padding: 80 }}>
        <div style={{ transform: `scale(${plato})` }}>
          <Plato estilo={estilo} emoji={receta.emoji} imagen={receta.imagen} size={600} />
        </div>
        <div style={{ transform: `scale(${texto})` }}>
          <Titulo estilo={estilo} size={140} color={estilo.acento}>
            ¡Buen provecho!
          </Titulo>
        </div>
        <div
          style={{
            fontFamily: estilo.fuenteTexto,
            fontWeight: 700,
            fontSize: 46,
            color: estilo.textoSuave,
            opacity: cta,
          }}
        >
          Guarda la receta y compártela 💛
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
