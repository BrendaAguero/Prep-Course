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


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    for nombre, (emoji, lado) in SPRITES.items():
        sprite(emoji, lado).save(SALIDA / f"{nombre}.png")
    print(f"{len(SPRITES)} sprites en {SALIDA}")


if __name__ == "__main__":
    main()
