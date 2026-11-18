export type Ingrediente = { emoji: string; texto: string; voz?: string };
export type AccionJuego = "machacar" | "agregar" | "mezclar" | "calentar" | "cocinar" | "servir";

export type Paso = {
  emoji: string;
  texto: string;
  voz?: string;
  nota?: string;
  imagen?: string;
  /** Modo juego: animación de cocina para este paso. */
  accion?: string;
  /** Modo juego: emojis que intervienen (lo que se machaca, se agrega o se sirve encima). */
  ingredientes?: string[];
  /** Modo juego: color de la mezcla al terminar el paso. */
  color?: string;
  /** Modo juego: en "agregar", mezclar al final. */
  mezclar?: boolean;
};

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
