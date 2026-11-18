export type Numero = {
  numero: number;
  palabra: string;
  frase: string;
  color: string;
  fondo: string;
  colores?: readonly string[];
};

export const NUMEROS: readonly Numero[] = [
  { numero: 1, palabra: "Uno", frase: "Un globo rojo", color: "#FF5A5F", fondo: "#FFE3E3" },
  { numero: 2, palabra: "Dos", frase: "Dos globos azules", color: "#3FA9F5", fondo: "#DFF1FF" },
  { numero: 3, palabra: "Tres", frase: "Tres globos verdes", color: "#2BB673", fondo: "#DDF7E8" },
  { numero: 4, palabra: "Cuatro", frase: "Cuatro globos amarillos", color: "#F5B700", fondo: "#FFF6CC" },
  { numero: 5, palabra: "Cinco", frase: "Cinco globos morados", color: "#7B5CFF", fondo: "#ECE6FF" },
  { numero: 6, palabra: "Seis", frase: "Seis globos rosados", color: "#FF6FB5", fondo: "#FFE6F2" },
  { numero: 7, palabra: "Siete", frase: "Siete globos anaranjados", color: "#FF8A3D", fondo: "#FFEBDD" },
  { numero: 8, palabra: "Ocho", frase: "Ocho globos celestes", color: "#29C5E6", fondo: "#DDF7FC" },
  { numero: 9, palabra: "Nueve", frase: "Nueve globos marrones", color: "#A0673A", fondo: "#F5E9DE" },
  {
    numero: 10,
    palabra: "Diez",
    frase: "Diez globos de colores",
    color: "#FF5A5F",
    fondo: "#FFF8E1",
    colores: ["#FF5A5F", "#3FA9F5", "#2BB673", "#F5B700", "#7B5CFF", "#FF6FB5", "#FF8A3D", "#29C5E6", "#A0673A", "#2D3A8C"],
  },
];
