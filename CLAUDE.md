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
