#@title 🍓 Fuwa Fuwa Kitchen · Descargar sonidos CC0 de Freesound { display-mode: "form" }
#@markdown ### 1. Tu clave de Freesound
#@markdown Pega aquí tu *Client secret / API key* (freesound.org/apiv2/apply).
#@markdown **Obligatoria para "Lista de la receta".** En "Búsqueda" puedes dejarla vacía (se usa Openverse).
TOKEN_FREESOUND = ""  #@param {type:"string"}

#@markdown ### 2. ¿Qué quieres descargar?
MODO = "Lista de la receta"  #@param ["Lista de la receta", "Búsqueda"]
RECETA = "Pancakes japoneses (38 sonidos)"  #@param ["Pancakes japoneses (38 sonidos)", "Lista personalizada"]
#@markdown Solo para **Lista personalizada**: pares `accion:id` separados por espacios (ej. `cascar-huevo:336612 tapa:435000`).
LISTA_PERSONALIZADA = ""  #@param {type:"string"}

#@markdown Solo para **Búsqueda** (en inglés funciona mejor):
BUSQUEDA = "egg crack"  #@param {type:"string"}
ACCION = "cascar-huevo"  #@param {type:"string"}
CANTIDAD = 5  #@param {type:"slider", min:1, max:20, step:1}

#@markdown ### 3. Filtros y formato
DURACION_MIN = 0.7  #@param {type:"number"}
DURACION_MAX = 30  #@param {type:"number"}
CONVERTIR_A = "WAV 48 kHz 24-bit"  #@param ["No convertir (MP3 HQ)", "WAV 48 kHz 24-bit", "MP3 320 kbps"]

# ------------------------------------------------------------------------------------
# A partir de aquí no hace falta tocar nada.
# ------------------------------------------------------------------------------------
import csv
import datetime
import json
import os
import re
import shutil
import subprocess
import time
import urllib.parse
import urllib.request
import urllib.error

USER_AGENT = "FuwaFuwaKitchen-SoundBank/1.0 (Google Colab; descarga de sonidos CC0)"
CC0 = "publicdomain/zero/1.0"
CARPETA = "sonidos-asmr"
LISTA_PANCAKES = """
cascar-huevo:336612 cascar-huevo:253798 cascar-huevo:585636 cascar-huevo:539488
separar-huevo:118608
batir-mano:467898 batir-mano:132474 batir-mano:266637
batidora:181409 batidora:479424
tamizar:671468 tamizar:634166 tamizar:199333
mezclar:671469 mezclar:447861 mezclar:447871
verter-leche:546719 verter-leche:693092
aceite:636150
agua-sarten:170235
chisporroteo:587050 chisporroteo:382709 chisporroteo:353124
tapa:435000 tapa:181717
voltear:274499 voltear:530831
plato:419985 plato:382643 plato:622416
espolvorear:119797 espolvorear:437567
sirope:241880 sirope:720665
temporizador:372515 temporizador:149506
congelador:658821 congelador:468940
"""

informe = {"descargados": [], "saltados": [], "errores": []}
bloqueos_403 = 0


def pedir(url, binario=False, intentos=4):
    """GET con User-Agent, timeout y reintentos con espera progresiva."""
    global bloqueos_403
    espera = 2
    for intento in range(1, intentos + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=40) as r:
                datos = r.read()
                return datos if binario else json.loads(datos.decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 403:
                bloqueos_403 += 1
                raise
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


def limpiar(texto):
    return re.sub(r"[^a-z0-9-]+", "-", texto.lower()).strip("-") or "sonido"


def info_freesound(sid):
    """Metadatos de un sonido por ID (con clave) o vía Openverse (sin clave)."""
    if TOKEN_FREESOUND.strip():
        campos = "id,name,username,license,duration,previews,url"
        url = f"https://freesound.org/apiv2/sounds/{sid}/?fields={campos}&token={TOKEN_FREESOUND.strip()}"
        d = pedir(url)
        return {
            "id": str(d["id"]), "titulo": d["name"], "autor": d["username"], "licencia": d["license"],
            "duracion": float(d["duration"]), "audio": d["previews"]["preview-hq-mp3"],
            "pagina": d.get("url") or f"https://freesound.org/s/{sid}/", "fuente": "freesound-api",
        }
    raise ValueError("falta la clave de Freesound (obligatoria en el modo lista)")


def desde_openverse(r):
    sid = r["foreign_landing_url"].rstrip("/").split("/")[-1]
    return {
        "id": sid, "titulo": r["title"], "autor": r.get("creator") or "desconocido",
        "licencia": r.get("license_url", ""), "duracion": (r.get("duration") or 0) / 1000,
        "audio": r["url"], "pagina": r["foreign_landing_url"], "fuente": "openverse",
    }


def buscar(termino, n):
    """Devuelve hasta n sonidos CC0 que cumplan la duración."""
    if TOKEN_FREESOUND.strip():
        filtro = f'license:"Creative Commons 0" duration:[{DURACION_MIN} TO {DURACION_MAX}]'
        q = urllib.parse.urlencode({
            "query": termino, "filter": filtro, "page_size": min(n * 2, 50),
            "fields": "id,name,username,license,duration,previews,url", "token": TOKEN_FREESOUND.strip(),
        })
        res = pedir(f"https://freesound.org/apiv2/search/text/?{q}").get("results", [])
        return [{
            "id": str(d["id"]), "titulo": d["name"], "autor": d["username"], "licencia": d["license"],
            "duracion": float(d["duration"]), "audio": d["previews"]["preview-hq-mp3"],
            "pagina": d.get("url") or f"https://freesound.org/s/{d['id']}/", "fuente": "freesound-api",
        } for d in res]
    q = urllib.parse.urlencode({"q": termino, "source": "freesound", "license": "cc0", "page_size": 20})
    return [desde_openverse(r) for r in pedir(f"https://api.openverse.org/v1/audio/?{q}").get("results", [])]


def convertir(origen, destino_sin_ext):
    if CONVERTIR_A.startswith("WAV"):
        destino = destino_sin_ext + ".wav"
        args = ["-ar", "48000", "-c:a", "pcm_s24le"]
    elif CONVERTIR_A.startswith("MP3"):
        destino = destino_sin_ext + ".mp3"
        args = ["-ar", "48000", "-b:a", "320k"]
    else:
        destino = destino_sin_ext + ".mp3"
        shutil.move(origen, destino)
        return destino
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", origen, *args, destino], check=True)
    os.remove(origen)
    return destino


def descargar(info, accion):
    sid = info["id"]
    if CC0 not in info["licencia"]:
        informe["saltados"].append((accion, sid, f"licencia no CC0 ({info['licencia']})"))
        return
    if not (DURACION_MIN <= info["duracion"] <= DURACION_MAX):
        informe["saltados"].append((accion, sid, f"duración {info['duracion']:.1f} s fuera del filtro"))
        return
    carpeta = os.path.join(CARPETA, accion)
    os.makedirs(carpeta, exist_ok=True)
    base = os.path.join(carpeta, f"{accion}__{sid}")
    temporal = base + ".descarga.mp3"
    with open(temporal, "wb") as f:
        f.write(pedir(info["audio"], binario=True))
    archivo = convertir(temporal, base)
    informe["descargados"].append({**info, "accion": accion, "archivo": os.path.relpath(archivo, CARPETA)})
    print(f"  ✓ {os.path.basename(archivo)} · {info['titulo'][:45]} · {info['autor']}")


def tareas():
    """Lista de (accion, id) o de (accion, info) según el modo."""
    if MODO == "Búsqueda":
        accion = limpiar(ACCION)
        encontrados = buscar(BUSQUEDA, CANTIDAD)
        validos = [i for i in encontrados if CC0 in i["licencia"] and DURACION_MIN <= i["duracion"] <= DURACION_MAX]
        return [(accion, i) for i in validos[:CANTIDAD]]
    texto = LISTA_PANCAKES if RECETA.startswith("Pancakes") else LISTA_PERSONALIZADA
    pares = []
    for trozo in texto.split():
        if ":" in trozo:
            accion, sid = trozo.split(":", 1)
            if sid.strip().isdigit():
                pares.append((limpiar(accion), sid.strip()))
    return pares


# ------------------------------------------------------------------------------------
print("🍓 Fuwa Fuwa Kitchen · banco de sonidos ASMR\n")
print("Fuente:", "API de Freesound (con clave)" if TOKEN_FREESOUND.strip() else "Openverse (sin clave)")
shutil.rmtree(CARPETA, ignore_errors=True)
os.makedirs(CARPETA)

if MODO != "Búsqueda" and not TOKEN_FREESOUND.strip():
    print("⚠️  Para descargar la lista necesitas tu clave de Freesound (arriba, en el paso 1).")
    print("   Pégala y vuelve a ejecutar la celda.\n")
try:
    trabajo = [] if (MODO != "Búsqueda" and not TOKEN_FREESOUND.strip()) else tareas()
except Exception as e:  # noqa: BLE001
    trabajo = []
    informe["errores"].append(("búsqueda", "-", str(e)))
print(f"Sonidos a procesar: {len(trabajo)}\n")

for accion, dato in trabajo:
    sid = dato if isinstance(dato, str) else dato["id"]
    try:
        info = info_freesound(dato) if isinstance(dato, str) else dato
        descargar(info, accion)
    except Exception as e:  # noqa: BLE001 — un fallo no detiene el resto
        informe["errores"].append((accion, sid, str(e)[:120]))
        print(f"  ✗ {accion}__{sid}: {str(e)[:80]}")
    time.sleep(0.6)  # respetar los límites de la API

# Créditos y registro de licencias
hoy = datetime.date.today().isoformat()
with open(os.path.join(CARPETA, "CREDITOS.txt"), "w", encoding="utf-8") as f:
    f.write("Fuwa Fuwa Kitchen · Banco de sonidos ASMR\n")
    f.write(f"Descargado el {hoy}. Todos los sonidos tienen licencia CC0 1.0 (dominio público).\n")
    f.write("https://creativecommons.org/publicdomain/zero/1.0/\n\n")
    for d in informe["descargados"]:
        f.write(f"- {d['archivo']}\n  \"{d['titulo']}\" de {d['autor']} · {d['duracion']:.1f} s\n  {d['pagina']}\n\n")
with open(os.path.join(CARPETA, "licencias.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["archivo", "accion", "id", "titulo", "autor", "licencia", "url_pagina", "duracion_s", "fuente", "fecha_descarga"])
    for d in informe["descargados"]:
        w.writerow([d["archivo"], d["accion"], d["id"], d["titulo"], d["autor"], d["licencia"], d["pagina"], f"{d['duracion']:.1f}", d["fuente"], hoy])

# Informe
print("\n──────── Informe ────────")
print(f"✓ Descargados: {len(informe['descargados'])}")
print(f"↷ Saltados:    {len(informe['saltados'])}")
for a, s, motivo in informe["saltados"]:
    print(f"   · {a}__{s}: {motivo}")
print(f"✗ Errores:     {len(informe['errores'])}")
for a, s, motivo in informe["errores"]:
    print(f"   · {a}__{s}: {motivo}")

if bloqueos_403 and not informe["descargados"]:
    print("\n⚠️  Freesound ha respondido 403 (prohibido) a todo: puede estar bloqueando las IP de Colab.")
    print("   Descarga estos sonidos a mano desde tu navegador:")
    for accion, dato in trabajo:
        sid = dato if isinstance(dato, str) else dato["id"]
        print(f"   {accion}__{sid}: https://freesound.org/s/{sid}/")

# Comprimir y descargar
if informe["descargados"]:
    zip_path = shutil.make_archive("sonidos-asmr", "zip", ".", CARPETA)
    print(f"\n📦 {zip_path} listo. Descargando…")
    try:
        from google.colab import files
        files.download(zip_path)
    except Exception as e:  # noqa: BLE001
        print("No se pudo iniciar la descarga automática:", e)
        print("Descárgalo desde el panel de archivos (icono de carpeta a la izquierda).")
