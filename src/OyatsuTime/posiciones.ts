// Posiciones fijas de la interfaz. Las usan tanto el guion (recorrido del cursor) como los componentes.
//
// La ventana del juego muestra un área VISIBLE de 1050×900. Las pantallas comunes (gancho, menú,
// inventario, receta nueva, libro) se diseñan directamente en ese espacio. La cocina de cada receta
// se dibuja en su lienzo lógico de 1200×900 y se ve a través de una "cámara" desplazada CAMARA_COCINA
// (se recorta el margen vacío de la izquierda, así todo se ve más grande).

export const VISTA = { ancho: 1050, alto: 900 };
export const CAMARA_COCINA = -110; // x lógica 110 → borde izquierdo visible

// Pantallas comunes (coordenadas visibles 1050×900)
export const BOTON_JUGAR = { x: 655, y: 540 };
export const BOTON_COCINAR = { x: 400, y: 820 };
export const BOTON_GUARDAR = { x: 660, y: 800 };

/** Geometría del inventario de ingredientes (1 o 2 filas, centrado en 1050). */
export const inventario = (n: number) => {
  const filas = n > 4 ? 2 : 1;
  const cols = Math.ceil(n / filas);
  const lado = cols >= 5 ? 180 : 214;
  const hueco = cols >= 5 ? 20 : 24;
  const x0 = (VISTA.ancho - (cols * lado + (cols - 1) * hueco)) / 2;
  const ys = filas === 1 ? [420] : [292, 292 + lado + 40];
  return { filas, cols, lado, hueco, x0, ys };
};

/** Centro del hueco i del inventario con n ingredientes. */
export const huecoInventario = (i: number, n: number) => {
  const g = inventario(n);
  const col = i % g.cols;
  const fila = Math.floor(i / g.cols);
  return { x: g.x0 + col * (g.lado + g.hueco) + g.lado / 2, y: g.ys[fila] };
};

// Cocina (coordenadas lógicas 1200×900)
/** Despensa: armario a la derecha cuya altura depende del número de ingredientes. */
export const DESPENSA = { x: 900, y: 150, ancho: 250, porItem: 160, maxAlto: 640 };
export const altoDespensa = (n: number) => Math.min(DESPENSA.maxAlto, 70 + n * DESPENSA.porItem);

/** Centro del hueco i de la despensa con n ingredientes (igual que el componente Despensa). */
export const huecoDespensa = (i: number, n: number) => {
  const paso = (altoDespensa(n) - 50) / n;
  return { x: DESPENSA.x + DESPENSA.ancho / 2, y: DESPENSA.y + 40 + i * paso + (paso - 26) / 2 };
};

/** Zona fija para indicadores (barra "Esponjoso", temporizador, temperatura): arriba a la izquierda. */
export const INDICADOR = { x: 130, y: 150 };
