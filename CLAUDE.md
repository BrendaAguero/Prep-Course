# Videos infantiles con Remotion

## Reglas para todos los videos

- **Todos los videos llevan música y voz**, excepto el estilo "Cocina Dulce" (juego), que va
  **sin voz salvo que sea necesaria**: el texto aparece en pantalla con bips, como en un juego.
  - Voz en español con `edge-tts` (voz `es-MX-DaliaNeural`, `rate=-8%`, `pitch=+10Hz`),
    normalizada a -16 LUFS y sin silencios al inicio/fin.
  - Música de fondo original (generada por código, sin derechos de terceros),
    unos 13 dB por debajo de la voz, con fade de entrada y salida.
  - Efectos de sonido suaves (p. ej. "pop") cuando aparece un elemento contado.
- Las animaciones se sincronizan con la duración real de cada clip de voz
  (las duraciones se guardan en un `audio.json` junto al video).
- Público infantil: textos grandes, colores vivos, ritmo pausado (≈1 s por número al contar).

## Ejemplo de referencia

`src/Contar/` (composición `AprendeAContar`) + `scripts/generar_audio.py`.

```bash
python3 -m venv .venv && .venv/bin/pip install edge-tts numpy
.venv/bin/python scripts/generar_audio.py   # genera public/audio/* y src/Contar/audio.json
npm run dev                                  # Remotion Studio
npx remotion render AprendeAContar out/aprende-a-contar.mp4
```

## Videos de recetas (`src/Recetas/`)

- Formato vertical 1080×1920 (Reels/TikTok/Shorts), 30 fps.
- Cada receta es un JSON en `src/Recetas/recetas/<id>.json` (título, emoji, tiempo,
  porciones, ingredientes, pasos con `nota`/`imagen` opcionales, cierre).
- Voz: `.venv/bin/python scripts/generar_audio_receta.py <id>` → `public/audio/recetas/<id>/`
  y `src/Recetas/recetas/<id>.audio.json`. Voz Dalia con tono natural (`pitch +0Hz`).
  Luego registrar la receta en `RECETAS` de `src/Recetas/index.tsx`.
- Estilos en `src/Recetas/estilos.ts`: `casero`, `moderno`, `infantil`. Cada receta
  aparece en Studio como `Receta-<id>-<estilo>`.
- Texto fuera de los 200 px superiores y 280 px inferiores (zonas que tapa la app).
- Si hay fotos/videos reales del plato, usar `imagen` en vez del emoji.

### Modo juego (`src/RecetaJuego/`)

- Estilo "juego de cocina" para público adulto (no infantil): cocina ilustrada, HUD con
  puntos y pasos, popups "¡PERFECTO!", pantalla de "¡Receta completada!".
- Composición `Receta-<id>-juego`. Usa la misma voz de la receta.
- Cada paso del JSON puede llevar `accion`: `machacar`, `agregar` (+ `mezclar: true`),
  `mezclar`, `calentar`, `cocinar` (voltear), `servir`; `ingredientes` (emojis que
  intervienen) y `color` (color de la mezcla). Sin `accion` se usa una animación genérica.
- Música chiptune y efectos (ding, click, chisporroteo, fanfarria):
  `.venv/bin/python scripts/generar_sfx_juego.py` → `public/audio/juego/`.

## Estilo "Cocina Dulce" (`src/CocinaDulce/`)

- Inspirado en juegos de cocina "para niña" de los 2000 (mezcla de pixel art y estilo ilustrado
  pastel), con aspecto pulido y detallado.
- **Diseño elegido: paleta A "Fresa y crema"** (`src/CocinaDulce/disenos/paletas.ts`), paleta fija:
  rosa fresa para interfaz, crema para paneles, madera clara para la despensa, fondo exterior lila
  con lunares (distinto del interior), interior = cocina (ventana con cortinas, estante, azulejos,
  encimera). Mascota: **Nube, la conejita repostera** en pixel art (`disenos/Conejita.tsx`, poses
  normal/feliz/brazos). La mascota antigua "Mochi" ya no se usa.
  Estilo original: no copiar personajes, dibujos ni pantallas de juegos existentes.
- Se siente como un juego: cursor de mano pixelado que se mueve, pasa por encima (tooltips),
  hace clic (onda + sonido) y arrastra ingredientes. Pantallas: título con "▶ JUGAR", cocina con
  despensa y cinta de instrucciones, "¡Has conseguido una receta nueva!", libro de recetas.
- Sin voz. Texto letra a letra con bips; música propia tipo juego portátil más alta que en los
  videos con voz (≈ -22 dB), con los efectos por encima.
- Dos formatos de la misma ventana de juego (1200×900 lógicos): `CocinaDulce-<receta>-vertical`
  (1080×1920, Instagram/TikTok, con lista de tareas abajo) y `-horizontal` (1920×1080, YouTube).
- Receta de referencia con el diseño final: `src/CocinaDulce/pancakes/` (pancakes japoneses,
  composiciones `CocinaDulce-pancakes-vertical` / `-horizontal`). La coreografía (cursor, clics,
  tiempos) está en `pancakes/tiempos.ts`; los objetos (bol, sartén, plato, pancake) en `pancakes/Objetos.tsx`.
- Sprites pixelados: `scripts/generar_sprites.py` (emoji → pixel art con contorno) → `public/sprites/`.
- Sonidos: `scripts/generar_sfx_kawaii.py` → `public/audio/kawaii/`.

## Banco de sonidos ASMR (`sonidos-asmr/`)

- Banco **general** de sonidos de cocina reales CC0, organizado por acción, para cualquier receta
  (ver `sonidos-asmr/README.md`). Se usa en las versiones ASMR (YouTube) y se mezcla con los
  sonidos de "juego" en TikTok.
- Se llena con `scripts/colab_descargar_sonidos.py` en Google Colab (Freesound bloquea las
  descargas desde el entorno de Claude). Al añadir una receta: pasos reales → acciones del banco;
  si falta una acción, añadirla al `CATALOGO` del script y al README.
