export type Ingrediente = { emoji: string; texto: string; voz?: string };
export type Paso = { emoji: string; texto: string; voz?: string; nota?: string; imagen?: string };

export type Receta = {
  id: string;
  titulo: string;
  subtitulo?: string;
  emoji: string;
  tiempo: string;
  porciones: string;
  dificultad: string;
  intro: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
  cierre: string;
  /** Foto del plato terminado en public/ (opcional; si no, se usa el emoji). */
  imagen?: string;
};

export type Duraciones = Record<string, number>;
