# Videos infantiles con Remotion

## Reglas para todos los videos

- **Todos los videos llevan música y voz.** Sin excepción.
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
