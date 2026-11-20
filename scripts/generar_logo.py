"""Logo pixel art de おやつタイム (Oyatsu Time).

Letras redondas y esponjosas (Mochiy Pop One) dibujadas a baja resolución: relleno rosa con
degradado y brillo, contorno fino rosa oscuro, doble contorno blanco + marrón, sombra, gotitas,
corazones, lazo, destellos y una nube con "Oyatsu Time". Diseño original.

Uso:  python scripts/generar_logo.py   →  public/logo/oyatsu-time.png (resolución nativa; se escala
con image-rendering: pixelated)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "scripts/fuentes/MochiyPopOne.ttf"
PIXEL = RAIZ / "scripts/fuentes/PixelifySans.ttf"
SALIDA = RAIZ / "public/logo/oyatsu-time.png"

# Paleta A (Fresa y crema)
CONTORNO = (124, 79, 99)
SOMBRA = (124, 79, 99)
BLANCO = (255, 255, 255)
ROSA_CLARO = (255, 214, 228)
ROSA = (247, 160, 190)
ROSA_FUERTE = (238, 124, 156)
ROSA_OSCURO = (200, 90, 124)
AMARILLO = (255, 211, 110)

W, H = 300, 130  # lienzo en "píxeles" del logo


def mascara_texto(texto, tam, x, y, fuente=FUENTE, umbral=0.5, sobre=8, giro=0):
    """Texto rasterizado a baja resolución (supermuestreo + umbral → bordes pixelados limpios)."""
    f = ImageFont.truetype(str(fuente), tam * sobre)
    img = Image.new("L", (W * sobre, H * sobre), 0)
    ImageDraw.Draw(img).text((x * sobre, y * sobre), texto, font=f, fill=255)
    if giro:
        bb = img.getbbox()
        if bb:
            img = img.rotate(giro, resample=Image.BICUBIC, center=((bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2))
    a = np.asarray(img.resize((W, H), Image.BOX), dtype=float) / 255
    return a > umbral


def mover(m, dy, dx):
    """Desplaza sin dar la vuelta (lo que sale por un borde se pierde)."""
    out = np.zeros_like(m)
    h, w = m.shape
    out[max(0, dy) : h + min(0, dy), max(0, dx) : w + min(0, dx)] = m[max(0, -dy) : h + min(0, -dy), max(0, -dx) : w + min(0, -dx)]
    return out


def dilatar(m, r):
    out = m.copy()
    ys, xs = np.nonzero(np.ones((2 * r + 1, 2 * r + 1)))
    for dy, dx in zip(ys - r, xs - r):
        if dx * dx + dy * dy <= r * r + r:  # disco
            out |= mover(m, dy, dx)
    return out


def borde_interior(m):
    e = m.copy()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        e &= mover(m, dy, dx)
    return m & ~e


def sprite(lineas, x, y, colores, capa):
    for j, fila in enumerate(lineas):
        for i, ch in enumerate(fila):
            if ch != "." and 0 <= y + j < H and 0 <= x + i < W:
                capa[y + j, x + i] = colores[ch]


CORAZON = [".oo.oo.", "ohhoppo", "ohppppo", "ompppmo", ".ompmo.", "..omo..", "...o..."]
CORAZON_P = [".o.o.", "opopo", "opppo", ".opo.", "..o.."]
DESTELLO = ["...y...", "...y...", "..yyy..", "yyywyyy", "..yyy..", "...y...", "...y..."]
CRUZ = [".o.", "ooo", ".o."]
LAZO = [
    "oo.........oo",
    "opoo.....oopo",
    "ohppo...opphpo"[:13],
    "ohpppooopppho",
    "oppppomoppppo",
    "ohpppooopppho",
    "opppo.o.opppo",
    "oppoo.o.ooppo",
    "ooo..opo..ooo",
    ".....opo.....",
    "....op.po....",
    "....o...o....",
]


def main():
    # --- letras saltarinas: おやつ grande + タイム más pequeño (como el sufijo de la referencia)
    letras = np.zeros((H, W), bool)
    for ch, tam, x, y, g in (
        ("お", 50, 30, 30, 6),
        ("や", 46, 80, 22, -5),
        ("つ", 50, 128, 30, 4),
        ("タ", 38, 180, 44, -6),
        ("イ", 34, 214, 44, 4),
        ("ム", 38, 242, 46, -5),
    ):
        letras |= mascara_texto(ch, tam, x + 6, y - 6, giro=g)
    letras = dilatar(letras, 1)  # trazos más gorditos
    blanco = dilatar(letras, 3)
    marron = dilatar(letras, 5)
    sombra = mover(marron, 4, 2) & ~marron

    # gotitas que cuelgan del contorno (en el blanco), a mano
    gotas = np.zeros_like(letras)
    for gx, largo in ((52, 6), (104, 5), (150, 7), (226, 5)):
        fondo_y = np.nonzero(blanco[:, gx])[0]
        if len(fondo_y):
            y0 = fondo_y.max()
            gotas[y0 : y0 + largo, gx : gx + 3] = True
            gotas[y0 + largo - 2 : y0 + largo, gx - 1 : gx + 4] = True
    blanco |= gotas
    marron |= dilatar(gotas, 1)

    img = np.zeros((H, W, 4), dtype=np.uint8)

    def pintar(m, color):
        img[m] = (*color, 255)

    pintar(sombra, SOMBRA)
    pintar(marron, CONTORNO)
    pintar(blanco & ~letras, BLANCO)

    # relleno con degradado vertical por bandas (pixel art: pocos tonos)
    ys = np.nonzero(letras.any(1))[0]
    y0, y1 = ys.min(), ys.max()
    for y in range(H):
        t = (y - y0) / max(1, y1 - y0)
        color = ROSA_CLARO if t < 0.3 else ROSA if t < 0.7 else ROSA_FUERTE
        fila = letras[y]
        img[y][fila] = (*color, 255)
    # rayas diagonales de brillo (como el "glaseado" de la referencia)
    yy, xx = np.mgrid[0:H, 0:W]
    rayas = letras & (((xx + yy) % 11) < 2) & (yy < y0 + (y1 - y0) * 0.75)
    pintar(rayas, BLANCO)
    # contorno interior rosa oscuro + brillo arriba
    pintar(borde_interior(letras), ROSA_OSCURO)
    arriba = letras & ~mover(letras, 1, 0)
    pintar(mover(arriba, 1, 0) & letras & ~borde_interior(letras), BLANCO)

    capa = {}
    col = {"o": CONTORNO, "h": BLANCO, "p": ROSA_FUERTE, "m": ROSA_OSCURO, "y": AMARILLO, "w": BLANCO}

    def deco(spr, x, y):
        for j, fila in enumerate(spr):
            for i, ch in enumerate(fila):
                if ch != "." and 0 <= y + j < H and 0 <= x + i < W:
                    img[y + j, x + i] = (*col[ch], 255)

    deco(CORAZON, 286, 60)
    deco(CORAZON, 4, 80)
    deco(CORAZON_P, 282, 94)
    deco(CORAZON_P, 176, 22)
    deco(DESTELLO, 166, 12)
    deco(DESTELLO, 84, 98)
    deco(DESTELLO, 116, 8)
    deco(CRUZ, 150, 104)
    deco(CRUZ, 250, 22)
    deco(CRUZ, 14, 70)
    deco(LAZO, 272, 24)
    # corazoncito amarillo sobre una letra (detalle de la referencia)
    col["p"], col["m"] = AMARILLO, (230, 170, 60)
    deco(CORAZON_P, 60, 56)
    col["p"], col["m"] = ROSA_FUERTE, ROSA_OSCURO

    # --- nube con "Oyatsu Time" arriba a la izquierda
    nube = np.zeros_like(letras)
    d = ImageDraw.Draw(im_n := Image.new("L", (W, H), 0))
    for cx, cy, r in ((10, 13, 8), (24, 9, 9), (40, 8, 9), (56, 9, 9), (70, 10, 8), (80, 15, 7), (16, 20, 7), (34, 21, 7), (52, 21, 7), (68, 20, 7)):
        d.ellipse((cx - r, cy - r + 10, cx + r, cy + r + 10), fill=255)
    nube = np.asarray(im_n) > 0
    nube_m = dilatar(nube, 1)
    sombra_n = mover(nube_m, 2, 1) & ~nube_m
    sobre = nube_m | sombra_n
    img[sobre] = 0
    pintar(sombra_n, SOMBRA)
    pintar(nube_m, CONTORNO)
    pintar(nube, BLANCO)
    rom = mascara_texto("Oyatsu Time", 13, 9, 14, PIXEL, 0.45)
    pintar(rom & nube, ROSA_OSCURO)

    # recorte al contenido
    a = img[..., 3] > 0
    ys, xs = np.nonzero(a)
    img = img[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(img, "RGBA").save(SALIDA)
    print(SALIDA, img.shape[1], "x", img.shape[0])


if __name__ == "__main__":
    main()
