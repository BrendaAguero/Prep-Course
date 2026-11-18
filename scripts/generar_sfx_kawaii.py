"""Música y efectos originales para el estilo "Cocina Dulce" (juego rosa de los 2000).

Uso: .venv/bin/python scripts/generar_sfx_kawaii.py
Escribe public/audio/kawaii/{musica.mp3, click.wav, bips.wav, pop.wav, brillo.wav,
jingle.wav, chorro.wav, untar.wav}.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_audio import RAIZ, SR, guardar_wav, nota, tono  # noqa: E402
from generar_sfx_juego import cuadrada, triangular  # noqa: E402

SALIDA = RAIZ / "public" / "audio" / "kawaii"


def campana(m: float, dur: float, decay: float = 0.35) -> np.ndarray:
    return tono(nota(m), dur, decay, (1.0, 0.0, 0.45, 0.0, 0.15))


def musica() -> np.ndarray:
    """Bucle tierno estilo juego portátil: Cmaj7-Am7-Dm7-G7, campanitas y bajo suave."""
    bpm = 128
    beat = 60 / bpm
    compases = 16
    total = int(compases * 4 * beat * SR)
    mix = np.zeros(total + SR)

    def poner(s: np.ndarray, t: float, vol: float) -> None:
        i = int(t * SR)
        mix[i:i + len(s)] += s[: len(mix) - i] * vol

    acordes = [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]]
    bajos = [48, 45, 50, 43]
    melodias = [
        [79, None, 76, 77, 79, None, 84, None],
        [81, None, 79, None, 76, None, None, None],
        [77, None, 81, 79, 77, None, 74, None],
        [76, 77, 79, None, 74, None, None, None],
        [79, None, 76, 77, 79, None, 84, 86],
        [88, None, 86, None, 84, None, 81, None],
        [81, 79, 77, None, 81, None, 79, None],
        [76, None, 74, None, 72, None, None, None],
    ]
    for c in range(compases):
        t0 = c * 4 * beat
        a = acordes[c % 4]
        for b in range(4):
            poner(triangular(nota(bajos[c % 4] - (0 if b % 2 == 0 else -7)), beat * 0.8), t0 + b * beat, 0.45)
        for k in range(8):  # "piano de juguete" en corcheas a contratiempo
            if k % 2 == 1:
                for m in a[1:]:
                    poner(cuadrada(nota(m), beat * 0.3, 0.07, 0.25), t0 + k * beat / 2, 0.05)
        for k, m in enumerate(melodias[c % 8]):
            if m is not None:
                poner(campana(m, beat * 1.2), t0 + k * beat / 2, 0.22)
        for b in range(4):  # shaker suave
            r = np.random.default_rng(c * 4 + b).standard_normal(int(0.03 * SR))
            poner(np.diff(r, prepend=0) * np.exp(-np.arange(len(r)) / SR / 0.01), t0 + b * beat + beat / 2, 0.05)
    cola = mix[total:]
    mix = mix[:total]
    mix[: len(cola)] += cola
    return mix


def click() -> np.ndarray:
    s = campana(96, 0.12, 0.03)
    s[: int(0.03 * SR)] += cuadrada(nota(91), 0.03, 0.008, 0.25) * 0.4
    return s


def bips() -> np.ndarray:
    """Texto que se escribe: bips agudos a 14 por segundo (2 s, en bucle)."""
    s = np.zeros(2 * SR)
    for k in range(28):
        b = cuadrada(nota(84 + (k * 5) % 3), 0.03, 0.012, 0.5)
        i = int(k * SR / 14)
        s[i:i + len(b)] += b
    return s


def pop() -> np.ndarray:
    t = np.arange(int(0.12 * SR)) / SR
    return np.sin(2 * np.pi * (500 + 1600 * t / 0.12) * t) * np.exp(-t / 0.035)


def brillo() -> np.ndarray:
    s = np.zeros(int(0.7 * SR))
    for k, m in enumerate([84, 88, 91, 96, 100]):
        c = campana(m, 0.45, 0.15)
        i = int(k * 0.05 * SR)
        s[i:i + len(c)] += c[: len(s) - i]
    return s


def jingle() -> np.ndarray:
    """"¡Receta nueva!": arpegio feliz con final sostenido."""
    notas = [(72, 0.0), (76, 0.12), (79, 0.24), (84, 0.36), (83, 0.6), (84, 0.72), (88, 0.84)]
    s = np.zeros(int(2.2 * SR))
    for m, t in notas:
        larga = m == 88
        c = campana(m, 1.3 if larga else 0.4, 0.6 if larga else 0.18)
        c[: int(0.12 * SR)] += cuadrada(nota(m), 0.12, 0.05, 0.25) * 0.2
        i = int(t * SR)
        s[i:i + len(c)] += c[: len(s) - i]
    return s


def chorro() -> np.ndarray:
    """Chorrito de miel: gorgoteo suave (1,5 s)."""
    t = np.arange(int(1.5 * SR)) / SR
    return np.sin(2 * np.pi * (300 + 80 * np.sin(2 * np.pi * 9 * t)) * t) * 0.3 * np.exp(-((t - 0.75) ** 2) / 0.3)


def untar() -> np.ndarray:
    """Cuchillo untando: ruido filtrado en vaivén (1 s, en bucle)."""
    rng = np.random.default_rng(3)
    n = SR
    r = np.convolve(rng.standard_normal(n), np.ones(30) / 30, mode="same")
    env = 0.5 + 0.5 * np.sin(2 * np.pi * 3 * np.arange(n) / SR) ** 2
    return r * env


def crack() -> np.ndarray:
    """Huevo que se casca: chasquido seco + pequeño goteo."""
    rng = np.random.default_rng(11)
    s = np.zeros(int(0.35 * SR))
    for k, t0 in enumerate([0.0, 0.025, 0.06]):
        n = int(0.03 * SR)
        r = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / 0.006)
        i = int(t0 * SR)
        s[i:i + n] += np.diff(r, prepend=0) * (1 - k * 0.25)
    t = np.arange(int(0.12 * SR)) / SR
    gota = np.sin(2 * np.pi * (900 - 2500 * t) * t) * np.exp(-t / 0.04) * 0.4
    i = int(0.18 * SR)
    s[i:i + len(gota)] += gota
    return s


def batir() -> np.ndarray:
    """Batidor en un bol: vaivén rítmico de ruido suave (1 s, en bucle)."""
    rng = np.random.default_rng(5)
    n = SR
    r = np.convolve(rng.standard_normal(n), np.ones(12) / 12, mode="same")
    env = np.abs(np.sin(2 * np.pi * 4 * np.arange(n) / SR)) ** 3
    return r * env


def boing() -> np.ndarray:
    """Rebote gelatinoso de los pancakes."""
    t = np.arange(int(0.45 * SR)) / SR
    f = 220 + 140 * np.sin(2 * np.pi * 7 * t) * np.exp(-t / 0.15)
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * np.exp(-t / 0.18)


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    guardar_wav(SALIDA / "musica.wav", musica(), pico=0.3)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(SALIDA / "musica.wav"),
                    "-b:a", "160k", str(SALIDA / "musica.mp3")], check=True)
    (SALIDA / "musica.wav").unlink()
    for nombre, fn, pico in [("click", click, 0.5), ("bips", bips, 0.25), ("pop", pop, 0.5),
                             ("brillo", brillo, 0.45), ("jingle", jingle, 0.6),
                             ("chorro", chorro, 0.35), ("untar", untar, 0.25),
                             ("crack", crack, 0.5), ("batir", batir, 0.3), ("boing", boing, 0.45)]:
        guardar_wav(SALIDA / f"{nombre}.wav", fn(), pico=pico)
    print("Música y efectos de Cocina Dulce generados.")


if __name__ == "__main__":
    main()
