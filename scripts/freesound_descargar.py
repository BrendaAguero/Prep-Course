"""Descarga sonidos de Freesound (CC0 y CC BY) a la carpeta `sounds/` del proyecto.

- Usa solo las URLs "preview-hq-mp3" de la API v2 (nunca el endpoint /download/, que exige OAuth2).
- Guarda cada MP3 directamente en `sounds/` (la crea si no existe), con nombre
  `<titulo>__<id>__<autor>__<licencia>.mp3`, y registra título, ID, autor, licencia, URL y el
  texto de atribución en `sounds/creditos.csv`; además regenera `sounds/CREDITOS.txt`, listo para
  pegar en la descripción del video.
- Solo acepta licencias compatibles con videos monetizados (--licencias):
    cc0  Creative Commons 0 (dominio público; atribución opcional pero se conserva)
    by   Creative Commons Attribution 3.0/4.0 (atribución OBLIGATORIA)
  Nunca descarga NonCommercial (BY-NC) ni Sampling+.
- Comprueba que cada archivo descargado no está vacío y es un MP3 válido.

Uso:
    python scripts/freesound_descargar.py --buscar "egg crack" --cantidad 3
    python scripts/freesound_descargar.py --ids 336612 435000
    python scripts/freesound_descargar.py --pedido sounds/pedido.txt   # una búsqueda o ID por línea
    python scripts/freesound_descargar.py --buscar "kitchen ambience" --licencias cc0      # solo CC0
    python scripts/freesound_descargar.py --catalogo scripts/catalogo_sonidos.txt --cantidad 3
        # banco por acciones: cada línea "accion | búsqueda 1 ; búsqueda 2 ; …" → sounds/<accion>/

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
# Licencias aceptadas: clave → (nombre del filtro en Freesound, fragmentos válidos de la URL, sufijo)
LICENCIAS = {
    "cc0": ("Creative Commons 0", ["publicdomain/zero/1.0"]),
    "by": ("Attribution", ["licenses/by/4.0", "licenses/by/3.0"]),
}


def tipo_licencia(url: str) -> str | None:
    """'cc0', 'by4', 'by3' o None si no es una licencia aceptada."""
    u = url.lower()
    if "publicdomain/zero/1.0" in u:
        return "cc0"
    if "/by-nc" in u or "sampling" in u:
        return None
    if "licenses/by/4.0" in u:
        return "by4"
    if "licenses/by/3.0" in u:
        return "by3"
    return None


def permitida(lic: str | None, licencias: list[str]) -> bool:
    return lic is not None and ((lic == "cc0" and "cc0" in licencias) or (lic.startswith("by") and "by" in licencias))


NOMBRE_LICENCIA = {"cc0": "CC0 1.0", "by4": "CC BY 4.0", "by3": "CC BY 3.0"}
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


_ultima_api = 0.0


def pedir(url: str, binario: bool = False, intentos: int = 4):
    global _ultima_api
    if url.startswith(API):  # la API permite 60 peticiones/minuto: como mucho una cada 1,1 s
        pausa = 1.1 - (time.monotonic() - _ultima_api)
        if pausa > 0:
            time.sleep(pausa)
        _ultima_api = time.monotonic()
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


def buscar(consulta: str, cantidad: int, dur_min: float, dur_max: float, licencias: list[str]) -> list[dict]:
    nombres = " OR ".join(f'"{LICENCIAS[l][0]}"' for l in licencias)
    filtro = f"license:({nombres}) duration:[{dur_min} TO {dur_max}]"
    q = urllib.parse.urlencode({"query": consulta, "filter": filtro, "fields": CAMPOS, "page_size": cantidad})
    return pedir(f"{API}/search/text/?{q}").get("results", [])


def info(sid: str) -> dict:
    return pedir(f"{API}/sounds/{sid}/?fields={CAMPOS}")


def ya_registrados() -> set[str]:
    if not CREDITOS.exists():
        return set()
    with CREDITOS.open(encoding="utf-8") as f:
        return {fila["id"] for fila in csv.DictReader(f)}


CAMPOS_CSV = ["archivo", "accion", "id", "titulo", "autor", "licencia", "licencia_url", "atribucion_obligatoria",
              "atribucion", "duracion_s", "url", "consulta"]


def atribucion(titulo: str, autor: str, url: str, lic: str, lic_url: str) -> str:
    """Texto de crédito según la recomendación de Creative Commons (título, autor, fuente, licencia)."""
    return f'"{titulo}" de {autor} ({url}), {NOMBRE_LICENCIA[lic]} – {lic_url}'


def escribir_creditos_txt() -> None:
    if not CREDITOS.exists():
        return
    with CREDITOS.open(encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    obligatorias = [r for r in filas if r["atribucion_obligatoria"] == "si"]
    opcionales = [r for r in filas if r["atribucion_obligatoria"] != "si"]
    lineas = ["CRÉDITOS DE SONIDO (Freesound.org)", ""]
    if obligatorias:
        lineas += ["Atribución obligatoria (Creative Commons Attribution):"]
        lineas += [f"- {r['atribucion']}" for r in obligatorias] + [""]
    if opcionales:
        lineas += ["Dominio público (CC0), créditos por cortesía:"]
        lineas += [f"- {r['atribucion']}" for r in opcionales]
    (CARPETA / "CREDITOS.txt").write_text("\n".join(lineas) + "\n", encoding="utf-8")


def registrar(fila: dict) -> None:
    nuevo = not CREDITOS.exists()
    with CREDITOS.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CAMPOS_CSV)
        if nuevo:
            w.writeheader()
        w.writerow(fila)


def descargar(s: dict, consulta: str, licencias: list[str], accion: str = "") -> str:
    """Descarga un sonido; devuelve 'ok', 'existe' o el motivo por el que se salta."""
    sid = str(s["id"])
    lic = tipo_licencia(s.get("license", ""))
    if not permitida(lic, licencias):
        return f"licencia no permitida ({s.get('license')})"
    url = (s.get("previews") or {}).get("preview-hq-mp3")
    if not url:
        return "sin preview-hq-mp3"
    nombre = f"{slug(s['name'])}__{sid}__{slug(s['username'], 24)}__{lic}.mp3"
    if accion:
        (CARPETA / accion).mkdir(parents=True, exist_ok=True)
        nombre = f"{accion}/{nombre}"
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
    pagina = s.get("url") or f"https://freesound.org/s/{sid}/"
    registrar({
        "archivo": nombre, "accion": accion, "id": sid, "titulo": s["name"], "autor": s["username"],
        "licencia": NOMBRE_LICENCIA[lic], "licencia_url": s["license"],
        "atribucion_obligatoria": "si" if lic.startswith("by") else "no",
        "atribucion": atribucion(s["name"], s["username"], pagina, lic, s["license"]),
        "duracion_s": f"{float(s.get('duration', 0)):.1f}", "url": pagina, "consulta": consulta,
    })
    return "ok"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--buscar", action="append", default=[], help="consulta de búsqueda (repetible)")
    ap.add_argument("--ids", nargs="*", default=[], help="IDs de Freesound")
    ap.add_argument("--pedido", help="archivo con una consulta o un ID por línea (# = comentario)")
    ap.add_argument("--catalogo", help="archivo 'accion | búsqueda ; búsqueda …' → sounds/<accion>/")
    ap.add_argument("--cantidad", type=int, default=3, help="sonidos por consulta (o por acción con --catalogo)")
    ap.add_argument("--dur-min", type=float, default=0.7)
    ap.add_argument("--dur-max", type=float, default=30)
    ap.add_argument("--licencias", default="cc0,by", help="licencias aceptadas: cc0, by o cc0,by (por defecto)")
    a = ap.parse_args()
    licencias = [l.strip() for l in a.licencias.split(",") if l.strip()]
    if not licencias or any(l not in LICENCIAS for l in licencias):
        ap.error("--licencias solo admite: cc0, by")

    consultas, ids = list(a.buscar), list(a.ids)
    if a.pedido:
        for linea in Path(a.pedido).read_text(encoding="utf-8").splitlines():
            linea = linea.split("#", 1)[0].strip()
            if linea:
                (ids if linea.isdigit() else consultas).append(linea)
    catalogo: list[tuple[str, list[str]]] = []
    if a.catalogo:
        for linea in Path(a.catalogo).read_text(encoding="utf-8").splitlines():
            linea = linea.split("#", 1)[0].strip()
            if "|" in linea:
                accion, busquedas = linea.split("|", 1)
                catalogo.append((slug(accion, 40), [b.strip() for b in busquedas.split(";") if b.strip()]))
    if not consultas and not ids and not catalogo:
        ap.error("indica --buscar, --ids, --pedido o --catalogo")

    CARPETA.mkdir(parents=True, exist_ok=True)
    vistos = ya_registrados()
    cuenta = {"ok": 0, "existe": 0, "saltado": 0, "error": 0}

    try:
        trabajo: list[tuple[dict, str, str]] = []
        for c in consultas:
            for s in buscar(c, a.cantidad, a.dur_min, a.dur_max, licencias):
                trabajo.append((s, c, ""))
        for sid in ids:
            trabajo.append((info(sid), f"id:{sid}", ""))
        # Catálogo: por cada acción se prueban sus búsquedas en orden hasta reunir --cantidad sonidos.
        elegidos: set[str] = set(vistos)
        for accion, busquedas in catalogo:
            reunidos = 0
            for c in busquedas:
                if reunidos >= a.cantidad:
                    break
                for s in buscar(c, a.cantidad * 3, a.dur_min, a.dur_max, licencias):
                    sid = str(s["id"])
                    if sid in elegidos or not permitida(tipo_licencia(s.get("license", "")), licencias):
                        continue
                    elegidos.add(sid)
                    trabajo.append((s, c, accion))
                    reunidos += 1
                    if reunidos >= a.cantidad:
                        break
            print(f"· {accion}: {reunidos} sonidos")
    except Bloqueado as e:
        print(f"✗ Freesound rechaza las conexiones desde esta máquina ({e}).", file=sys.stderr)
        print("  No es un fallo del código: hay que ejecutar este script desde otra red.", file=sys.stderr)
        return 2

    for s, c, accion in trabajo:
        sid = str(s["id"])
        if sid in vistos:
            cuenta["existe"] += 1
            continue
        try:
            r = descargar(s, c, licencias, accion)
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

    escribir_creditos_txt()
    print(f"\nDescargados {cuenta['ok']} · ya existían {cuenta['existe']} · saltados {cuenta['saltado']} · errores {cuenta['error']}")
    print(f"Carpeta: {CARPETA}")
    return 0 if cuenta["error"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
