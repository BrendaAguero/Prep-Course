"""Descarga sonidos CC0 de Freesound a la carpeta `sounds/` del proyecto.

- Usa solo las URLs "preview-hq-mp3" de la API v2 (nunca el endpoint /download/, que exige OAuth2).
- Guarda cada MP3 directamente en `sounds/` (la crea si no existe), con nombre
  `<titulo>__<id>__<autor>__cc0.mp3`, y registra título, ID, autor, licencia y URL en
  `sounds/creditos.csv`.
- Comprueba que cada archivo descargado no está vacío y es un MP3 válido.

Uso:
    python scripts/freesound_descargar.py --buscar "egg crack" --cantidad 3
    python scripts/freesound_descargar.py --ids 336612 435000
    python scripts/freesound_descargar.py --pedido sounds/pedido.txt   # una búsqueda o ID por línea

Clave: variable de entorno FREESOUND_TOKEN. Si no existe, se envía la petición sin cabecera
(en el entorno de Claude Code el proxy añade la clave guardada).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CARPETA = RAIZ / "sounds"
CREDITOS = CARPETA / "creditos.csv"
API = "https://freesound.org/apiv2"
CAMPOS = "id,name,username,license,duration,previews,url"
CC0 = "publicdomain/zero/1.0"
USER_AGENT = "FuwaFuwaKitchen-SoundBank/1.0 (+https://freesound.org/docs/api/)"
TAM_MINIMO = 2048  # bytes; menos que esto no es un audio útil


class Bloqueado(Exception):
    """Freesound rechazó la conexión (403): suele ser un bloqueo por IP de servidor."""


def cabeceras() -> dict[str, str]:
    h = {"User-Agent": USER_AGENT}
    token = os.environ.get("FREESOUND_TOKEN", "").strip()
    if token:
        h["Authorization"] = f"Token {token}"
    return h


def pedir(url: str, binario: bool = False, intentos: int = 4):
    espera = 2.0
    for intento in range(1, intentos + 1):
        try:
            req = urllib.request.Request(url, headers=cabeceras())
            with urllib.request.urlopen(req, timeout=60) as r:
                datos = r.read()
                return datos if binario else json.loads(datos.decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 403:
                raise Bloqueado(f"403 en {urllib.parse.urlsplit(url).netloc}") from e
            if e.code == 401:
                raise SystemExit("401: la clave de Freesound no es válida.") from e
            if e.code in (429, 500, 502, 503, 504) and intento < intentos:
                time.sleep(espera)
                espera *= 2
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            if intento < intentos:
                time.sleep(espera)
                espera *= 2
                continue
            raise


def slug(texto: str, largo: int = 40) -> str:
    s = re.sub(r"\.(wav|mp3|aif+|flac|ogg|m4a)$", "", texto.lower())
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return (s[:largo].strip("-")) or "sonido"


def es_mp3(datos: bytes) -> bool:
    if datos[:3] == b"ID3":
        return True
    return len(datos) > 1 and datos[0] == 0xFF and (datos[1] & 0xE0) == 0xE0


def buscar(consulta: str, cantidad: int, dur_min: float, dur_max: float) -> list[dict]:
    filtro = f'license:"Creative Commons 0" duration:[{dur_min} TO {dur_max}]'
    q = urllib.parse.urlencode({"query": consulta, "filter": filtro, "fields": CAMPOS, "page_size": cantidad})
    return pedir(f"{API}/search/text/?{q}").get("results", [])


def info(sid: str) -> dict:
    return pedir(f"{API}/sounds/{sid}/?fields={CAMPOS}")


def ya_registrados() -> set[str]:
    if not CREDITOS.exists():
        return set()
    with CREDITOS.open(encoding="utf-8") as f:
        return {fila["id"] for fila in csv.DictReader(f)}


def registrar(fila: dict) -> None:
    nuevo = not CREDITOS.exists()
    with CREDITOS.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["archivo", "id", "titulo", "autor", "licencia", "duracion_s", "url", "consulta"])
        if nuevo:
            w.writeheader()
        w.writerow(fila)


def descargar(s: dict, consulta: str) -> str:
    """Descarga un sonido; devuelve 'ok', 'existe' o el motivo por el que se salta."""
    sid = str(s["id"])
    if CC0 not in s.get("license", ""):
        return f"licencia no CC0 ({s.get('license')})"
    url = (s.get("previews") or {}).get("preview-hq-mp3")
    if not url:
        return "sin preview-hq-mp3"
    nombre = f"{slug(s['name'])}__{sid}__{slug(s['username'], 24)}__cc0.mp3"
    destino = CARPETA / nombre
    if destino.exists() and destino.stat().st_size >= TAM_MINIMO:
        return "existe"
    datos = pedir(url, binario=True)
    if len(datos) < TAM_MINIMO:
        return f"archivo vacío o incompleto ({len(datos)} bytes)"
    if not es_mp3(datos):
        return "la respuesta no es un MP3 válido"
    destino.write_bytes(datos)  # se escribe directamente en sounds/, sin temporales
    if destino.stat().st_size != len(datos):
        destino.unlink(missing_ok=True)
        return "error al guardar en disco"
    registrar({
        "archivo": nombre, "id": sid, "titulo": s["name"], "autor": s["username"],
        "licencia": s["license"], "duracion_s": f"{float(s.get('duration', 0)):.1f}",
        "url": s.get("url") or f"https://freesound.org/s/{sid}/", "consulta": consulta,
    })
    return "ok"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--buscar", action="append", default=[], help="consulta de búsqueda (repetible)")
    ap.add_argument("--ids", nargs="*", default=[], help="IDs de Freesound")
    ap.add_argument("--pedido", help="archivo con una consulta o un ID por línea (# = comentario)")
    ap.add_argument("--cantidad", type=int, default=3, help="sonidos por consulta")
    ap.add_argument("--dur-min", type=float, default=0.7)
    ap.add_argument("--dur-max", type=float, default=30)
    a = ap.parse_args()

    consultas, ids = list(a.buscar), list(a.ids)
    if a.pedido:
        for linea in Path(a.pedido).read_text(encoding="utf-8").splitlines():
            linea = linea.split("#", 1)[0].strip()
            if linea:
                (ids if linea.isdigit() else consultas).append(linea)
    if not consultas and not ids:
        ap.error("indica --buscar, --ids o --pedido")

    CARPETA.mkdir(parents=True, exist_ok=True)
    vistos = ya_registrados()
    cuenta = {"ok": 0, "existe": 0, "saltado": 0, "error": 0}

    try:
        trabajo: list[tuple[dict, str]] = []
        for c in consultas:
            for s in buscar(c, a.cantidad, a.dur_min, a.dur_max):
                trabajo.append((s, c))
        for sid in ids:
            trabajo.append((info(sid), f"id:{sid}"))
    except Bloqueado as e:
        print(f"✗ Freesound rechaza las conexiones desde esta máquina ({e}).", file=sys.stderr)
        print("  No es un fallo del código: hay que ejecutar este script desde otra red.", file=sys.stderr)
        return 2

    for s, c in trabajo:
        sid = str(s["id"])
        if sid in vistos:
            cuenta["existe"] += 1
            continue
        try:
            r = descargar(s, c)
        except Bloqueado as e:
            print(f"✗ {sid}: bloqueado ({e})")
            cuenta["error"] += 1
            continue
        except Exception as e:  # noqa: BLE001 — un fallo no detiene el resto
            print(f"✗ {sid}: {e}")
            cuenta["error"] += 1
            continue
        if r == "ok":
            vistos.add(sid)
            cuenta["ok"] += 1
            print(f"✓ {sid} · {s['name'][:50]} · {s['username']}")
        elif r == "existe":
            cuenta["existe"] += 1
        else:
            cuenta["saltado"] += 1
            print(f"↷ {sid}: {r}")
        time.sleep(0.5)

    print(f"\nDescargados {cuenta['ok']} · ya existían {cuenta['existe']} · saltados {cuenta['saltado']} · errores {cuenta['error']}")
    print(f"Carpeta: {CARPETA}")
    return 0 if cuenta["error"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
