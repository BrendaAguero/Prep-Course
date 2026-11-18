"""Genera la voz (edge-tts), la música y los efectos del video "Aprende a contar".

Uso:
    python -m venv .venv && .venv/bin/pip install edge-tts numpy
    .venv/bin/python scripts/generar_audio.py

Escribe los audios en public/audio/ y sus duraciones en src/Contar/audio.json,
que el video usa para sincronizar las animaciones con la voz.
"""

import asyncio
import json
import os
import subprocess
import wave
from pathlib import Path

# El proxy del entorno re-firma TLS: edge-tts debe confiar en su CA si existe.
_CA = "/root/.ccr/ca-bundle.crt"
if os.path.exists(_CA):
    import certifi

    certifi.where = lambda: _CA

import edge_tts  # noqa: E402
import numpy as np  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
AUDIO = RAIZ / "public" / "audio"
VOZ_DIR = AUDIO / "voz"
VOZ = "es-MX-DaliaNeural"
SR = 44100

PALABRAS = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez"]
FRASES = [
    "¡Un globo rojo!",
    "¡Dos globos azules!",
    "¡Tres globos verdes!",
    "¡Cuatro globos amarillos!",
    "¡Cinco globos morados!",
    "¡Seis globos rosados!",
    "¡Siete globos anaranjados!",
    "¡Ocho globos celestes!",
    "¡Nueve globos marrones!",
    "¡Diez globos de colores!",
]

CLIPS: dict[str, str] = {
    "intro": "¡Hola, amiguitos! ¡Vamos a aprender a contar del uno al diez, con globos!",
    "final-a": "¡Muy bien! Contemos todos juntos.",
    "final-b": "¡Ya sabes contar hasta diez! ¡Hasta pronto!",
}
for i, p in enumerate(PALABRAS, start=1):
    CLIPS[f"titulo-{i}"] = f"¡{p}!"
    CLIPS[f"cuenta-{i}"] = f"{p.lower()}."
    CLIPS[f"frase-{i}"] = FRASES[i - 1]


async def tts(
    nombre: str,
    texto: str,
    carpeta: Path = VOZ_DIR,
    voz: str = VOZ,
    rate: str = "-8%",
    pitch: str = "+10Hz",
) -> None:
    carpeta.mkdir(parents=True, exist_ok=True)
    crudo = carpeta / f"{nombre}.raw.mp3"
    final = carpeta / f"{nombre}.mp3"
    await edge_tts.Communicate(texto, voz, rate=rate, pitch=pitch).save(str(crudo))
    # Recorta silencios al principio y al final para sincronizar con precisión.
    recorte = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(crudo),
         "-af", f"{recorte},areverse,{recorte},areverse,loudnorm=I=-16:TP=-1.5:LRA=11",
         "-ar", "44100", "-b:a", "128k", str(final)],
        check=True,
    )
    crudo.unlink()


def duracion(ruta: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ruta)],
        capture_output=True, text=True, check=True,
    )
    return round(float(out.stdout.strip()), 3)


def guardar_wav(ruta: Path, senal: np.ndarray, pico: float = 0.9) -> None:
    senal = senal / max(1e-9, np.max(np.abs(senal))) * pico
    datos = (senal * 32767).astype(np.int16)
    with wave.open(str(ruta), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())


def nota(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def tono(freq: float, dur: float, decay: float, armonicos=(1.0, 0.3, 0.1)) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * freq * (k + 1) * t) for k, a in enumerate(armonicos))
    ataque = np.minimum(1, t / 0.005)
    return s * ataque * np.exp(-t / decay)


def musica() -> np.ndarray:
    """Música alegre original: progresión C-G-Am-F, marimba, bajo y percusión suave."""
    bpm = 112
    beat = 60 / bpm
    compases = 16
    total = int(compases * 4 * beat * SR)
    mix = np.zeros(total + SR)

    def poner(s: np.ndarray, t: float, vol: float) -> None:
        i = int(t * SR)
        mix[i:i + len(s)] += s[: len(mix) - i] * vol

    acordes = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    bajos = [36, 43, 45, 41]
    # Melodía pentatónica (dos frases de 4 compases, se repite con variación).
    frase_a = [72, 74, 76, 79, 76, 74, 72, 74, 74, 76, 79, 81, 79, 76, 74, 76,
               76, 72, 69, 72, 74, 72, 69, 67, 65, 67, 69, 72, 69, 67, 65, 67]
    frase_b = [79, 81, 79, 76, 74, 76, 79, 76, 74, 72, 74, 76, 74, 72, 71, 74,
               72, 76, 72, 69, 72, 74, 76, 72, 69, 72, 74, 72, 69, 67, 69, 72]
    melodia = frase_a + frase_b + frase_a + frase_b

    for c in range(compases):
        t0 = c * 4 * beat
        acorde = acordes[c % 4]
        # Bajo en los tiempos 1 y 3
        for b in (0, 2):
            poner(tono(nota(bajos[c % 4]), beat * 1.8, 0.35, (1.0, 0.5, 0.15)), t0 + b * beat, 0.55)
        # Arpegio de marimba en corcheas
        patron = [0, 1, 2, 1, 0, 1, 2, 1]
        for k, idx in enumerate(patron):
            poner(tono(nota(acorde[idx] + 12), beat * 0.9, 0.18, (1.0, 0.0, 0.25, 0.0, 0.08)),
                  t0 + k * beat / 2, 0.22)
        # Melodía (negras, 8 notas por compás en dos compases -> 4 por compás)
        for k in range(4):
            m = melodia[(c * 4 + k) % len(melodia)]
            poner(tono(nota(m), beat * 0.95, 0.3, (1.0, 0.2, 0.05)), t0 + k * beat, 0.3)
        # Percusión: bombo suave en 1 y 3, platillo cerrado en contratiempos
        for b in range(4):
            if b % 2 == 0:
                tb = np.arange(int(0.18 * SR)) / SR
                bombo = np.sin(2 * np.pi * (110 * np.exp(-tb * 25) + 45) * tb) * np.exp(-tb / 0.07)
                poner(bombo, t0 + b * beat, 0.5)
            ruido = np.random.default_rng(c * 4 + b).standard_normal(int(0.05 * SR))
            ruido = np.diff(ruido, prepend=0) * np.exp(-np.arange(len(ruido)) / SR / 0.012)
            poner(ruido, t0 + b * beat + beat / 2, 0.06)

    # La cola que sobrepasa el bucle se suma al inicio para que el bucle sea continuo.
    cola = mix[total:]
    mix = mix[:total]
    mix[: len(cola)] += cola
    return mix


def pop() -> np.ndarray:
    t = np.arange(int(0.12 * SR)) / SR
    barrido = np.sin(2 * np.pi * (400 + 900 * t / 0.12) * t * 1.0)
    return barrido * np.exp(-t / 0.03)


async def main() -> None:
    VOZ_DIR.mkdir(parents=True, exist_ok=True)
    for nombre, texto in CLIPS.items():
        await tts(nombre, texto)

    # La música queda ~14 dB por debajo de la voz para que la voz se entienda bien.
    guardar_wav(AUDIO / "musica.wav", musica(), pico=0.3)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(AUDIO / "musica.wav"),
                    "-b:a", "160k", str(AUDIO / "musica.mp3")], check=True)
    (AUDIO / "musica.wav").unlink()
    guardar_wav(AUDIO / "pop.wav", pop())

    duraciones = {n: duracion(VOZ_DIR / f"{n}.mp3") for n in CLIPS}
    salida = RAIZ / "src" / "Contar" / "audio.json"
    salida.write_text(json.dumps(duraciones, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(duraciones)} clips de voz, música y efectos generados.")


if __name__ == "__main__":
    asyncio.run(main())
