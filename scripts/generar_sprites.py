"""Convierte emojis de comida en sprites de pixel art (con contorno) para el estilo "Cocina Dulce".

Uso: .venv/bin/python scripts/generar_sprites.py
Escribe public/sprites/<nombre>.png en tamaño pequeño (p. ej. 24×24); en el video se
amplían con `image-rendering: pixelated` para que se vean los píxeles.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "public" / "sprites"
FUENTE = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
CONTORNO = (138, 90, 110, 255)  # marrón rosado suave, como los juegos "kawaii"

SPRITES = {
    "pan": ("🍞", 24),
    "mantequilla": ("🧈", 24),
    "fresa": ("🍓", 24),
    "miel": ("🍯", 24),
    "flor": ("🌸", 20),
    "estrella": ("⭐", 16),
    "corazon": ("💗", 16),
    "huevo": ("🥚", 24),
    "leche": ("🥛", 24),
    "agua": ("💧", 22),
}


def sprite(emoji: str, lado: int) -> Image.Image:
    fuente = ImageFont.truetype(FUENTE, 109)
    lienzo = Image.new("RGBA", (160, 160))
    ImageDraw.Draw(lienzo).text((10, 10), emoji, font=fuente, embedded_color=True)
    lienzo = lienzo.crop(lienzo.getbbox())
    interior = lado - 2
    lienzo.thumbnail((interior, interior), Image.Resampling.BOX)
    # Alfa binario (píxeles nítidos) y paleta reducida.
    r, g, b, a = lienzo.split()
    a = a.point(lambda v: 255 if v > 110 else 0)
    rgb = Image.merge("RGB", (r, g, b)).quantize(14, method=Image.Quantize.MEDIANCUT).convert("RGB")
    pequeno = Image.merge("RGBA", (*rgb.split(), a))
    final = Image.new("RGBA", (lado, lado))
    ox = (lado - pequeno.width) // 2
    oy = (lado - pequeno.height) // 2
    # Contorno de 1 px alrededor de la silueta.
    mascara = Image.new("L", (lado, lado))
    mascara.paste(a, (ox, oy))
    borde = mascara.filter(ImageFilter.MaxFilter(3))
    final.paste(Image.new("RGBA", (lado, lado), CONTORNO), (0, 0), borde)
    final.paste(pequeno, (ox, oy), pequeno)
    return final


def saco_harina(lado: int = 24) -> Image.Image:
    """Saco de harina dibujado a mano (no hay emoji adecuado)."""
    im = Image.new("RGBA", (lado, lado))
    d = ImageDraw.Draw(im)
    crema, sombra, rosa = (246, 235, 217, 255), (226, 208, 182, 255), (238, 124, 156, 255)
    d.polygon([(8, 2), (15, 2), (14, 7), (9, 7)], fill=crema)
    d.rounded_rectangle((3, 7, 20, 22), radius=5, fill=crema)
    d.rectangle((15, 9, 19, 21), fill=sombra)
    d.rectangle((8, 6, 15, 7), fill=rosa)
    d.rectangle((7, 12, 14, 18), fill=(255, 255, 255, 255))
    d.rectangle((9, 14, 12, 16), fill=rosa)
    d.point([(9, 1), (12, 1), (14, 1)], fill=(255, 255, 255, 255))
    a = im.split()[3]
    borde = a.filter(ImageFilter.MaxFilter(3))
    final = Image.new("RGBA", (lado, lado))
    final.paste(Image.new("RGBA", (lado, lado), CONTORNO), (0, 0), borde)
    final.paste(im, (0, 0), im)
    return final


def con_contorno(im: Image.Image) -> Image.Image:
    a = im.split()[3]
    borde = a.filter(ImageFilter.MaxFilter(3))
    final = Image.new("RGBA", im.size)
    final.paste(Image.new("RGBA", im.size, CONTORNO), (0, 0), borde)
    final.paste(im, (0, 0), im)
    return final


def botella(liquido: tuple, tapon: tuple, etiqueta: tuple, lado: int = 24) -> Image.Image:
    """Botellita dibujada a mano (vainilla, aceite)."""
    im = Image.new("RGBA", (lado, lado))
    d = ImageDraw.Draw(im)
    d.rectangle((10, 2, 13, 5), fill=tapon)
    d.rectangle((10, 6, 13, 8), fill=(235, 240, 245, 255))
    d.rounded_rectangle((6, 8, 17, 22), radius=3, fill=(235, 240, 245, 255))
    d.rounded_rectangle((7, 11, 16, 21), radius=2, fill=liquido)
    d.rectangle((8, 14, 15, 18), fill=etiqueta)
    d.point([(8, 9), (8, 10)], fill=(255, 255, 255, 255))
    return con_contorno(im)


def bolsa(color: tuple, cinta: tuple, lado: int = 24) -> Image.Image:
    """Bolsita de azúcar."""
    im = Image.new("RGBA", (lado, lado))
    d = ImageDraw.Draw(im)
    d.polygon([(6, 5), (17, 5), (19, 21), (4, 21)], fill=color)
    d.rectangle((6, 3, 17, 5), fill=cinta)
    d.rectangle((8, 10, 15, 16), fill=(255, 255, 255, 255))
    for x, y in [(10, 12), (13, 13), (11, 14)]:
        d.point((x, y), fill=(200, 210, 230, 255))
    return con_contorno(im)


def lata(color: tuple, lado: int = 24) -> Image.Image:
    """Latita de polvo de hornear."""
    im = Image.new("RGBA", (lado, lado))
    d = ImageDraw.Draw(im)
    d.rectangle((6, 6, 17, 21), fill=color)
    d.rectangle((5, 4, 18, 6), fill=(210, 210, 220, 255))
    d.rectangle((7, 11, 16, 16), fill=(255, 250, 235, 255))
    d.point([(9, 13), (11, 13), (13, 13), (10, 14), (12, 14)], fill=color)
    d.line([(7, 8), (7, 20)], fill=(255, 255, 255, 120))
    return con_contorno(im)


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    for nombre, (emoji, lado) in SPRITES.items():
        sprite(emoji, lado).save(SALIDA / f"{nombre}.png")
    saco_harina().save(SALIDA / "harina.png")
    botella((150, 90, 50, 255), (120, 70, 40, 255), (255, 240, 210, 255)).save(SALIDA / "vainilla.png")
    botella((240, 200, 90, 255), (110, 160, 80, 255), (255, 250, 230, 255)).save(SALIDA / "aceite.png")
    bolsa((170, 205, 240, 255), (238, 124, 156, 255)).save(SALIDA / "azucar.png")
    lata((238, 124, 156, 255)).save(SALIDA / "polvo.png")
    print(f"{len(SPRITES)} sprites en {SALIDA}")


if __name__ == "__main__":
    main()
