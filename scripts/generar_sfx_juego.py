"""Música estilo videojuego y efectos para los videos de receta en modo juego.

Uso: .venv/bin/python scripts/generar_sfx_juego.py
Escribe public/audio/juego/{musica.mp3, ding.wav, click.wav, chisporroteo.wav, fanfarria.wav}.
Todo es sonido original sintetizado por código.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_audio import RAIZ, SR, guardar_wav, nota, tono  # noqa: E402

SALIDA = RAIZ / "public" / "audio" / "juego"


def cuadrada(freq: float, dur: float, decay: float, ancho: float = 0.5) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    fase = (t * freq) % 1.0
    s = np.where(fase < ancho, 1.0, -1.0)
    return s * np.minimum(1, t / 0.004) * np.exp(-t / decay)


def triangular(freq: float, dur: float) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    s = 2 * np.abs(2 * ((t * freq) % 1.0) - 1) - 1
    return s * np.minimum(1, t / 0.004) * np.minimum(1, (dur - t) / 0.02)


def musica() -> np.ndarray:
    """Bucle chiptune relajado: Fmaj7-Em7-Dm7-Cmaj7 (16 compases)."""
    bpm = 104
    beat = 60 / bpm
    compases = 16
    total = int(compases * 4 * beat * SR)
    mix = np.zeros(total + SR)

    def poner(s: np.ndarray, t: float, vol: float) -> None:
        i = int(t * SR)
        mix[i:i + len(s)] += s[: len(mix) - i] * vol

    acordes = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
    bajos = [41, 40, 38, 36]
    melodia = [
        [76, None, 74, 72, 74, None, 69, None],
        [71, None, 72, 74, 76, None, None, 74],
        [72, None, 69, 67, 69, None, 72, None],
        [71, 72, 74, None, 67, None, None, None],
    ]
    for c in range(compases):
        t0 = c * 4 * beat
        a = acordes[c % 4]
        for b in range(4):  # bajo triangular en negras
            poner(triangular(nota(bajos[c % 4] + (12 if b % 2 else 0)), beat * 0.9), t0 + b * beat, 0.5)
        for k in range(8):  # arpegio de onda cuadrada fina
            poner(cuadrada(nota(a[k % 4] + 12), beat * 0.45, 0.09, 0.25), t0 + k * beat / 2, 0.08)
        if c >= 4:  # la melodía entra a partir del compás 5
            for k, m in enumerate(melodia[c % 4]):
                if m is not None:
                    poner(cuadrada(nota(m), beat * 0.48, 0.22, 0.5), t0 + k * beat / 2, 0.11)
        for b in range(4):  # percusión de ruido
            r = np.random.default_rng(c * 8 + b).standard_normal(int(0.04 * SR))
            r *= np.exp(-np.arange(len(r)) / SR / 0.008)
            poner(r, t0 + b * beat + beat / 2, 0.08)
            if b in (0, 2):
                tb = np.arange(int(0.12 * SR)) / SR
                poner(np.sin(2 * np.pi * (90 * np.exp(-tb * 30) + 40) * tb) * np.exp(-tb / 0.05), t0 + b * beat, 0.45)
    cola = mix[total:]
    mix = mix[:total]
    mix[: len(cola)] += cola
    return mix


def ding() -> np.ndarray:
    a = tono(nota(88), 0.6, 0.25, (1.0, 0.0, 0.3))
    b = tono(nota(95), 0.8, 0.35, (1.0, 0.0, 0.3))
    s = np.zeros(int(0.9 * SR))
    s[: len(a)] += a
    i = int(0.09 * SR)
    s[i:i + len(b)] += b[: len(s) - i]
    return s


def click() -> np.ndarray:
    return cuadrada(nota(84), 0.06, 0.015) + cuadrada(nota(91), 0.06, 0.01) * 0.5


def chisporroteo() -> np.ndarray:
    """Chisporroteo de sartén (2 s, en bucle sin cortes)."""
    rng = np.random.default_rng(7)
    n = 2 * SR
    ruido = rng.standard_normal(n)
    ruido = np.diff(ruido, prepend=0)  # más agudo
    base = ruido * 0.15
    for _ in range(140):  # crujidos
        i = rng.integers(0, n - 800)
        base[i:i + 600] += rng.standard_normal(600) * np.exp(-np.arange(600) / 90) * rng.uniform(0.3, 1)
    return base


def fanfarria() -> np.ndarray:
    notas = [72, 76, 79, 84]
    s = np.zeros(int(1.6 * SR))
    for k, m in enumerate(notas):
        dur = 0.9 if k == 3 else 0.16
        n = cuadrada(nota(m), dur, 0.4 if k == 3 else 0.12) + cuadrada(nota(m + 12), dur, 0.3, 0.25) * 0.3
        i = int(k * 0.13 * SR)
        s[i:i + len(n)] += n[: len(s) - i]
    return s


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    guardar_wav(SALIDA / "musica.wav", musica(), pico=0.3)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(SALIDA / "musica.wav"),
                    "-b:a", "160k", str(SALIDA / "musica.mp3")], check=True)
    (SALIDA / "musica.wav").unlink()
    guardar_wav(SALIDA / "ding.wav", ding(), pico=0.6)
    guardar_wav(SALIDA / "click.wav", click(), pico=0.5)
    guardar_wav(SALIDA / "chisporroteo.wav", chisporroteo(), pico=0.4)
    guardar_wav(SALIDA / "fanfarria.wav", fanfarria(), pico=0.6)
    print("Música y efectos del modo juego generados.")


if __name__ == "__main__":
    main()
