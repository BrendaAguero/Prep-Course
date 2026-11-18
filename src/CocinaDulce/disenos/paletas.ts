export type Paleta = {
  id: string;
  nombre: string;
  descripcion: string;
  exterior: string;
  exteriorPatron: string;
  exteriorTam: string;
  ui: string;
  uiOscuro: string;
  acento: string;
  panel: string;
  madera: string;
  maderaOscura: string;
  pared: string;
  paredPatron: string;
  paredTam: string;
  azulejo: string;
  encimera: string;
  encimeraVeta: string;
  cielo: string;
  contorno: string;
  texto: string;
  conejo: { pelo: string; sombra: string; oreja: string; delantal: string; encaje: string; lazo: string };
};

export const PALETAS: Paleta[] = [
  {
    id: "A",
    nombre: "Fresa y crema",
    descripcion: "Rosa fresa con crema y lila. Dulce y clásica.",
    exterior: "#EFE6FA",
    exteriorPatron: "radial-gradient(#FFFFFF 18%, transparent 19%), radial-gradient(#FFFFFF 18%, transparent 19%)",
    exteriorTam: "56px 56px",
    ui: "#EE7C9C",
    uiOscuro: "#C85A7C",
    acento: "#FFD36E",
    panel: "#FFF8EE",
    madera: "#EDCFA6",
    maderaOscura: "#C99D72",
    pared: "#FCE6EC",
    paredPatron: "linear-gradient(90deg, #FFFFFF99 50%, transparent 50%)",
    paredTam: "56px 100%",
    azulejo: "#F6CBD8",
    encimera: "#F6E7D3",
    encimeraVeta: "#EAD3B6",
    cielo: "#CDEBFA",
    contorno: "#7C4F63",
    texto: "#6A3E52",
    conejo: { pelo: "#FFFFFF", sombra: "#EADCE4", oreja: "#FFC2D4", delantal: "#EE7C9C", encaje: "#FFFFFF", lazo: "#FFD36E" },
  },
  {
    id: "B",
    nombre: "Menta y melocotón",
    descripcion: "Menta fresca con melocotón. Luminosa y moderna.",
    exterior: "#E2F4EC",
    exteriorPatron: "repeating-linear-gradient(45deg, #FFFFFF88 0 14px, transparent 14px 40px)",
    exteriorTam: "auto",
    ui: "#FF9B85",
    uiOscuro: "#DE7560",
    acento: "#8ED1B5",
    panel: "#FFFAF2",
    madera: "#EFD5B0",
    maderaOscura: "#C8A27C",
    pared: "#E4F5EE",
    paredPatron: "linear-gradient(#FFFFFFAA 3px, transparent 3px), linear-gradient(90deg, #FFFFFFAA 3px, transparent 3px)",
    paredTam: "60px 60px",
    azulejo: "#BFE6D6",
    encimera: "#FFF4E4",
    encimeraVeta: "#F1DEC4",
    cielo: "#D4EEFF",
    contorno: "#6B5248",
    texto: "#5E463E",
    conejo: { pelo: "#FFF3E0", sombra: "#F0DCC4", oreja: "#FFC9B5", delantal: "#8ED1B5", encaje: "#FFFFFF", lazo: "#FF9B85" },
  },
  {
    id: "C",
    nombre: "Lavanda y frambuesa",
    descripcion: "Lavanda suave con frambuesa. Elegante y romántica.",
    exterior: "#EEE7FA",
    exteriorPatron: "radial-gradient(circle at 50% 50%, #D9CCF5 0 3px, transparent 4px)",
    exteriorTam: "34px 34px",
    ui: "#C9548A",
    uiOscuro: "#A33E6D",
    acento: "#B9A5EE",
    panel: "#FFF9F4",
    madera: "#E6CBB0",
    maderaOscura: "#BE9878",
    pared: "#FFF4EE",
    paredPatron: "radial-gradient(circle, #E9DDF8 22%, transparent 23%)",
    paredTam: "48px 48px",
    azulejo: "#E2D6F6",
    encimera: "#F8EAF1",
    encimeraVeta: "#ECD6E2",
    cielo: "#DCE8FF",
    contorno: "#6E4A66",
    texto: "#5C3A55",
    conejo: { pelo: "#FFFFFF", sombra: "#E7DDF0", oreja: "#F7B7D2", delantal: "#B9A5EE", encaje: "#FFFFFF", lazo: "#C9548A" },
  },
  {
    id: "D",
    nombre: "Algodón de azúcar",
    descripcion: "Celeste y rosa chicle. La más nostálgica de los 2000.",
    exterior: "#E0F0FC",
    exteriorPatron: "radial-gradient(#FFFFFF 30%, transparent 31%)",
    exteriorTam: "90px 60px",
    ui: "#F48FB1",
    uiOscuro: "#D66B91",
    acento: "#8CC8F0",
    panel: "#FFFFFF",
    madera: "#F3DEC6",
    maderaOscura: "#D2B08E",
    pared: "#E8F5FD",
    paredPatron: "linear-gradient(45deg, #FFFFFF 25%, transparent 25%, transparent 75%, #FFFFFF 75%), linear-gradient(45deg, #FFFFFF 25%, transparent 25%, transparent 75%, #FFFFFF 75%)",
    paredTam: "64px 64px",
    azulejo: "#CFE8F8",
    encimera: "#FFFFFF",
    encimeraVeta: "#EEF2F6",
    cielo: "#FFE4EE",
    contorno: "#6D5B7B",
    texto: "#5B4A6B",
    conejo: { pelo: "#FFEAF2", sombra: "#F6CFDF", oreja: "#F48FB1", delantal: "#8CC8F0", encaje: "#FFFFFF", lazo: "#F48FB1" },
  },
];
