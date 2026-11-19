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


def suavizar(x: np.ndarray, corte: float = 3000, ataque: float = 0.012) -> np.ndarray:
    """Suaviza un sonido: quita agudos con una caída gradual y redondea el ataque."""
    espectro = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    espectro *= 1 / np.sqrt(1 + (f / corte) ** 4)
    y = np.fft.irfft(espectro, n=len(x))
    n = max(1, int(ataque * SR))
    y[:n] *= np.linspace(0, 1, n) ** 2
    return y


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
        sw = swish(0.28, 18 if k % 2 else 24) * (0.8 if k % 2 else 0.6)
        i = int(k * paso * SR)
        s[i:i + len(sw)] += sw[: len(s) - i]
        if k % 2 == 0:  # "plof" grave y blando de la masa
            x = t(0.12)
            c = np.sin(2 * np.pi * (180 - 300 * x) * x) * np.exp(-x / 0.04) * 0.25
            s[i:i + len(c)] += c[: len(s) - i]
        k += 1
    return s


def plop(tono: float = 1.0) -> np.ndarray:
    """Cucharada de masa: 'plop' blandito con el tono cayendo."""
    x = t(0.32)
    f = (520 * tono) * np.exp(-x * 9) + 140 * tono
    fase = 2 * np.pi * np.cumsum(f) / SR
    golpe = np.sin(fase) * np.exp(-x / 0.07)
    humedo = ruido_filtrado(len(x), 60) * np.exp(-x / 0.03) * 0.25
    return golpe + humedo


def chisporroteo(dur: float = 4.0) -> np.ndarray:
    """Fuego bajo tierno: burbujitas suaves y redondas sobre un murmullo cálido (en bucle)."""
    n = int(dur * SR)
    s = ruido_filtrado(n, 80) * 0.08
    for _ in range(int(dur * 14)):
        x = t(0.07)
        f0 = rng.uniform(500, 900)
        b = np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.6 * x / 0.07)) / SR) * np.exp(-x / 0.02) * rng.uniform(0.15, 0.35)
        i = int(rng.integers(0, n - len(b)))
        s[i:i + len(b)] += b
    return s


def fwip() -> np.ndarray:
    """Giro rápido en el aire (voltear)."""
    x = t(0.35)
    f = 300 + 1500 * (x / 0.35) ** 1.5
    fase = 2 * np.pi * np.cumsum(f) / SR
    env = np.sin(np.pi * x / 0.35) ** 1.5
    return (np.sin(fase) * 0.5 + ruido_filtrado(len(x), 20) * 0.4) * env


def toc(frec: float = 680, decay: float = 0.04) -> np.ndarray:
    """Golpecito suave (caer en la sartén, cucharita)."""
    x = t(0.25)
    return (np.sin(2 * np.pi * frec * x) + 0.4 * np.sin(2 * np.pi * frec * 2.7 * x)) * np.exp(-x / decay)


def tac_ceramica() -> np.ndarray:
    """Plato apoyado: 'tin' de campanita, redondo y suave."""
    x = t(0.8)
    return sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x / d) for f, a, d in [(nota(84), 1.0, 0.22), (nota(91), 0.35, 0.15), (nota(84) * 0.5, 0.4, 0.08)])


def crack_suave() -> np.ndarray:
    """Huevo que se abre: 'tic-tic' tierno + un 'plip' blandito."""
    s = np.zeros(int(0.45 * SR))
    for i0, f, a in [(0.0, 1300, 0.7), (0.06, 1500, 0.5)]:
        x = t(0.06)
        c = np.sin(2 * np.pi * f * x) * np.exp(-x / 0.012) * a
        i = int(i0 * SR)
        s[i:i + len(c)] += c
    x = t(0.2)
    plip = np.sin(2 * np.pi * np.cumsum(700 * np.exp(-x * 8) + 250) / SR) * np.exp(-x / 0.06) * 0.6
    i = int(0.16 * SR)
    s[i:i + len(plip)] += plip[: len(s) - i]
    return s


def boing_esponjoso() -> np.ndarray:
    """Temblor esponjoso: 'boing' grave, blandito y amortiguado (nada de gelatina)."""
    x = t(0.9)
    f = 150 + 45 * np.sin(2 * np.pi * 6 * x) * np.exp(-x / 0.25)
    fase = 2 * np.pi * np.cumsum(f) / SR
    tono = np.sin(fase) + 0.25 * np.sin(2 * fase)
    aire = ruido_filtrado(len(x), 120) * 0.25  # "fff" de bizcocho aireado
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
    flujo = ruido_filtrado(len(s), 120) * 0.12
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
    # (señal, pico, corte de agudos Hz): todo filtrado y con volumen moderado para que suene suavecito
    sonidos = {
        "batir": (batir(), 0.28, 2200),
        "plop-1": (plop(1.0), 0.45, 1800),
        "plop-2": (plop(0.9), 0.45, 1800),
        "plop-3": (plop(1.12), 0.45, 1800),
        "chisporroteo": (chisporroteo(), 0.11, 2600),
        "fwip": (fwip(), 0.24, 2500),
        "toc": (toc(520, 0.05), 0.38, 2000),
        "toc-huevo": (toc(700, 0.035), 0.35, 2400),
        "crack-suave": (crack_suave(), 0.4, 3000),
        "tac-plato": (tac_ceramica(), 0.26, 3500),
        "boing-esponjoso": (boing_esponjoso(), 0.5, 1500),
        "gorgoteo": (gorgoteo(), 0.3, 2000),
        "tintineo": (tintineo(), 0.32, 4000),
    }
    for nombre, (senal, pico, corte) in sonidos.items():
        guardar_wav(SALIDA / f"{nombre}.wav", suavizar(senal, corte), pico=pico)
    print(f"{len(sonidos)} sonidos en {SALIDA}")


if __name__ == "__main__":
    main()
