"""Diseño sonoro: crea sonidos de miel / sirope vertidos a partir de sonidos CC0 del banco.

Técnica clásica de foley: un vertido de líquido normal, ralentizado, con el tono más grave y los
agudos suavizados, suena espeso y pegajoso como la miel.

Uso: python scripts/disenar_miel.py
Escribe en sounds/verter-espeso/ y añade sus créditos a sounds/creditos.csv (licencia CC0: las
fuentes son CC0, así que las versiones modificadas también pueden usarse libremente).
"""

import csv
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BANCO = RAIZ / "sounds"
DESTINO = BANCO / "verter-espeso"
CREDITOS = BANCO / "creditos.csv"
LUFS = -20  # volumen de referencia del banco

# (nombre, fuente relativa a sounds/, tempo, tono, corte de agudos Hz, duración máx s, descripción)
RECETAS = [
    ("miel-chorro-lento", "verter-aceite/pouring-oil-onto-pan__636150__nataliegonzalez19__cc0.mp3",
     0.60, 0.62, 2800, 9, "chorro de miel lento"),
    ("miel-chorro-espeso", "verter-liquido/pouring-boiling-water-into-large-cup-1__740116__fossarts__cc0.mp3",
     0.55, 0.55, 2200, 10, "chorro de sirope muy espeso"),
    ("miel-gotas-cuchara", "gotear/water-dripping-in-shower__749688__hemogobblin__cc0.mp3",
     0.70, 0.60, 3000, 8, "gotas espesas cayendo de una cuchara"),
]


def procesar(origen: Path, destino: Path, tempo: float, tono: float, corte: int, maximo: float) -> None:
    filtros = ",".join([
        f"rubberband=tempo={tempo}:pitch={tono}:transients=smooth:formant=preserved",
        "highpass=f=60",
        f"lowpass=f={corte}",
        "acompressor=threshold=-24dB:ratio=3:attack=15:release=250",
        f"atrim=0:{maximo}",
        "afade=t=in:d=0.08",
        f"afade=t=out:st={maximo - 0.8}:d=0.8",
        f"loudnorm=I={LUFS}:TP=-2:LRA=11",
    ])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(origen), "-af", filtros,
                    "-ar", "48000", "-b:a", "192k", str(destino)], check=True)


def main() -> int:
    DESTINO.mkdir(parents=True, exist_ok=True)
    filas = list(csv.DictReader(CREDITOS.open(encoding="utf-8")))
    campos = list(filas[0].keys())
    fuentes = {r["archivo"]: r for r in filas}
    ids = {r["id"] for r in filas}
    nuevas = []
    for i, (nombre, fuente, tempo, tono, corte, maximo, desc) in enumerate(RECETAS, start=1):
        origen = BANCO / fuente
        meta = fuentes.get(fuente)
        if not origen.exists() or meta is None or meta["licencia"] != "CC0 1.0":
            print(f"↷ {nombre}: falta la fuente CC0 {fuente}")
            continue
        sid = f"diseno-{meta['id']}"
        archivo = f"verter-espeso/{nombre}__{sid}__fuwafuwa__cc0.mp3"
        procesar(origen, BANCO / archivo, tempo, tono, corte, maximo)
        dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                              str(BANCO / archivo)], capture_output=True, text=True).stdout.strip()
        print(f"✓ {archivo} · {float(dur):.1f} s")
        if sid in ids:
            continue
        nuevas.append({
            "archivo": archivo, "accion": "verter-espeso", "id": sid,
            "titulo": f"Miel – {desc} (diseño sonoro)", "autor": f"Fuwa Fuwa Kitchen, sobre {meta['autor']}",
            "licencia": "CC0 1.0", "licencia_url": meta["licencia_url"], "atribucion_obligatoria": "no",
            "atribucion": f'{meta["atribucion"]} — modificado por Fuwa Fuwa Kitchen (ralentizado, tono más grave y filtrado)',
            "duracion_s": f"{float(dur):.1f}", "url": meta["url"], "consulta": f"diseño sonoro {i}",
        })
    if nuevas:
        with CREDITOS.open("a", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=campos).writerows(nuevas)
    return 0


if __name__ == "__main__":
    sys.exit(main())
