// Posiciones fijas de la interfaz dentro de la ventana de juego (1200×900).
// Las usan tanto el guion (recorrido del cursor) como los componentes.

export const BOTON_JUGAR = { x: 780, y: 488 };
export const BOTON_COCINAR = { x: 600, y: 830 };
export const BOTON_GUARDAR = { x: 600, y: 800 };

/** Geometría del inventario de ingredientes (1 o 2 filas, centrado). */
export const inventario = (n: number) => {
  const filas = n > 4 ? 2 : 1;
  const cols = Math.ceil(n / filas);
  const lado = cols >= 5 ? 184 : 200;
  const hueco = cols >= 5 ? 22 : 34;
  const x0 = (1200 - (cols * lado + (cols - 1) * hueco)) / 2;
  const ys = filas === 1 ? [440] : [330, 330 + lado + 46];
  return { filas, cols, lado, hueco, x0, ys };
};

/** Centro del hueco i del inventario con n ingredientes. */
export const huecoInventario = (i: number, n: number) => {
  const g = inventario(n);
  const col = i % g.cols;
  const fila = Math.floor(i / g.cols);
  return { x: g.x0 + col * (g.lado + g.hueco) + g.lado / 2, y: g.ys[fila] };
};

/** Centro del hueco i de la despensa con n ingredientes (igual que el componente Despensa). */
export const huecoDespensa = (i: number, n: number) => {
  const paso = (640 - 50) / n;
  return { x: 1025, y: 190 + i * paso + (paso - 26) / 2 };
};
