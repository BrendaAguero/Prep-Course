"""Genera la voz de un video de receta y guarda las duraciones para sincronizar.

Uso:
    .venv/bin/python scripts/generar_audio_receta.py panqueques

Lee src/Recetas/recetas/<id>.json, escribe la voz en public/audio/recetas/<id>/
y las duraciones en src/Recetas/recetas/<id>.audio.json.
La música de fondo es public/audio/musica.mp3 (la genera scripts/generar_audio.py).
"""

import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_audio import RAIZ, duracion, tts  # noqa: E402

# Voz por defecto de las recetas: misma voz que los videos infantiles, con tono natural.
VOZ = {"voz": "es-MX-DaliaNeural", "rate": "-5%", "pitch": "+0Hz"}


async def main(receta_id: str) -> None:
    ruta = RAIZ / "src" / "Recetas" / "recetas" / f"{receta_id}.json"
    receta = json.loads(ruta.read_text())
    voz = {**VOZ, **receta.get("voz", {})}
    carpeta = RAIZ / "public" / "audio" / "recetas" / receta_id

    clips = {
        "intro": receta["intro"],
        "ingredientes": "Vas a necesitar:",
        "cierre": receta["cierre"],
    }
    for i, ing in enumerate(receta["ingredientes"], start=1):
        clips[f"ingrediente-{i}"] = ing.get("voz", ing["texto"])
    for i, paso in enumerate(receta["pasos"], start=1):
        texto = paso.get("voz", paso["texto"])
        clips[f"paso-{i}"] = f"Paso {i}. {texto}"

    for nombre, texto in clips.items():
        await tts(nombre, texto, carpeta=carpeta, **voz)

    duraciones = {n: duracion(carpeta / f"{n}.mp3") for n in clips}
    salida = ruta.with_name(f"{receta_id}.audio.json")
    salida.write_text(json.dumps(duraciones, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(clips)} clips de voz para '{receta_id}'.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Uso: generar_audio_receta.py <id-de-receta>")
    asyncio.run(main(sys.argv[1]))
