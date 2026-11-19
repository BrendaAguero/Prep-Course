"""Sonidos de cocina "estilo juego" (originales, generados por código) para Cocina Dulce.

Uso: .venv/bin/python scripts/generar_sfx_cocina_juego.py
Escribe public/audio/cocina-juego/*.wav. Son sonidos tiernos y estilizados, no realistas:
encajan con el pixel art y no necesitan créditos ni licencias de terceros.
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_audio import RAIZ, SR, guardar_wav, nota  # noqa: E402

SALIDA = RAIZ / "public" / "audio" / "cocina-juego"
rng = np.random.default_rng(42)


def t(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def ruido_filtrado(n: int, suavizado: int) -> np.ndarray:
    r = rng.standard_normal(n)
    k = np.ones(suavizado) / suavizado
    return np.convolve(r, k, mode="same")


def swish(dur: float = 0.22, brillo: int = 6) -> np.ndarray:
    """Barrido suave de aire (varillas, giros)."""
    x = t(dur)
    env = np.sin(np.pi * x / dur) ** 2
    return ruido_filtrado(len(x), brillo) * env


def batir(dur: float = 6.5, golpes_por_seg: float = 3.06) -> np.ndarray:
    """Varillas en la masa: 'fsh-fsh' rítmico + un clinc muy suave en cada vuelta."""
    s = np.zeros(int(dur * SR))
    paso = 1 / golpes_por_seg
    k = 0
    while k * paso < dur - 0.3:
        sw = swish(0.24, 5 if k % 2 else 8) * (0.9 if k % 2 else 0.7)
        i = int(k * paso * SR)
        s[i:i + len(sw)] += sw[: len(s) - i]
        if k % 2 == 0:  # clinc de las varillas contra el bol
            c = np.sin(2 * np.pi * nota(98) * t(0.08)) * np.exp(-t(0.08) / 0.015) * 0.12
            s[i:i + len(c)] += c[: len(s) - i]
        k += 1
    return s


def plop(tono: float = 1.0) -> np.ndarray:
    """Cucharada de masa: 'plop' blandito con el tono cayendo."""
    x = t(0.32)
    f = (520 * tono) * np.exp(-x * 9) + 140 * tono
    fase = 2 * np.pi * np.cumsum(f) / SR
    golpe = np.sin(fase) * np.exp(-x / 0.07)
    humedo = ruido_filtrado(len(x), 30) * np.exp(-x / 0.03) * 0.6
    return golpe + humedo


def chisporroteo(dur: float = 4.0) -> np.ndarray:
    """Chisporroteo tierno: crepitar suave y espaciado, sin ruido áspero (en bucle)."""
    n = int(dur * SR)
    s = ruido_filtrado(n, 3) * 0.04
    for _ in range(int(dur * 55)):
        i = rng.integers(0, n - 600)
        largo = int(rng.integers(120, 500))
        s[i:i + largo] += rng.standard_normal(largo) * np.exp(-np.arange(largo) / (largo / 5)) * rng.uniform(0.15, 0.5)
    return s


def fwip() -> np.ndarray:
    """Giro rápido en el aire (voltear)."""
    x = t(0.35)
    f = 300 + 1500 * (x / 0.35) ** 1.5
    fase = 2 * np.pi * np.cumsum(f) / SR
    env = np.sin(np.pi * x / 0.35) ** 1.5
    return (np.sin(fase) * 0.35 + ruido_filtrado(len(x), 4) * 0.8) * env


def toc(frec: float = 680, decay: float = 0.04) -> np.ndarray:
    """Golpecito suave (caer en la sartén, cucharita)."""
    x = t(0.25)
    return (np.sin(2 * np.pi * frec * x) + 0.4 * np.sin(2 * np.pi * frec * 2.7 * x)) * np.exp(-x / decay)


def tac_ceramica() -> np.ndarray:
    """Plato de cerámica apoyado: 'tac' brillante con un pequeño tintineo."""
    x = t(0.6)
    s = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x / d) for f, a, d in [(1250, 1.0, 0.09), (2900, 0.5, 0.05), (4300, 0.25, 0.03)])
    return s + ruido_filtrado(len(x), 2) * np.exp(-x / 0.006) * 0.8


def boing_esponjoso() -> np.ndarray:
    """Temblor esponjoso: 'boing' grave, blandito y amortiguado (nada de gelatina)."""
    x = t(0.9)
    f = 150 + 45 * np.sin(2 * np.pi * 6 * x) * np.exp(-x / 0.25)
    fase = 2 * np.pi * np.cumsum(f) / SR
    tono = np.sin(fase) + 0.25 * np.sin(2 * fase)
    aire = ruido_filtrado(len(x), 40) * 0.5  # "fff" de bizcocho aireado
    env = np.minimum(1, x / 0.02) * np.exp(-x / 0.28)
    return (tono + aire) * env


def gorgoteo(dur: float = 4.5) -> np.ndarray:
    """Sirope dulce cayendo: burbujitas lentas y melosas."""
    s = np.zeros(int(dur * SR))
    k = 0.0
    while k < dur - 0.3:
        x = t(0.18)
        f0 = rng.uniform(260, 420)
        burb = np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.8 * x / 0.18)) / SR) * np.exp(-x / 0.05)
        i = int(k * SR)
        s[i:i + len(burb)] += burb[: len(s) - i] * rng.uniform(0.4, 0.8)
        k += rng.uniform(0.11, 0.24)
    flujo = ruido_filtrado(len(s), 60) * 0.25
    return s + flujo * np.minimum(1, np.arange(len(s)) / SR / 0.3)


def tintineo() -> np.ndarray:
    """Brillito final (campanitas)."""
    s = np.zeros(int(0.9 * SR))
    for k, m in enumerate([88, 91, 95, 100]):
        x = t(0.6)
        c = (np.sin(2 * np.pi * nota(m) * x) + 0.3 * np.sin(2 * np.pi * nota(m) * 3 * x)) * np.exp(-x / 0.18)
        i = int(k * 0.07 * SR)
        s[i:i + len(c)] += c[: len(s) - i]
    return s


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    sonidos = {
        "batir": (batir(), 0.45),
        "plop-1": (plop(1.0), 0.6),
        "plop-2": (plop(0.9), 0.6),
        "plop-3": (plop(1.12), 0.6),
        "chisporroteo": (chisporroteo(), 0.3),
        "fwip": (fwip(), 0.5),
        "toc": (toc(), 0.5),
        "toc-huevo": (toc(900, 0.03), 0.45),
        "tac-plato": (tac_ceramica(), 0.55),
        "boing-esponjoso": (boing_esponjoso(), 0.6),
        "gorgoteo": (gorgoteo(), 0.4),
        "tintineo": (tintineo(), 0.45),
    }
    for nombre, (senal, pico) in sonidos.items():
        guardar_wav(SALIDA / f"{nombre}.wav", senal, pico=pico)
    print(f"{len(sonidos)} sonidos en {SALIDA}")


if __name__ == "__main__":
    main()
