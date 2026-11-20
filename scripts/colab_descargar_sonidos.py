#@title 🍓 Oyatsu Time · Banco de sonidos ASMR (CC0) { display-mode: "form" }
#@markdown ### 1. Tu clave de Freesound
#@markdown Pega aquí tu *Client secret / API key* (freesound.org/apiv2/apply). Recomendada en todos los modos;
#@markdown sin clave solo funciona "Búsqueda" y "Banco general" (vía Openverse, con menos resultados).
TOKEN_FREESOUND = ""  #@param {type:"string"}

#@markdown ### 2. ¿Qué quieres descargar?
MODO = "Banco general"  #@param ["Banco general", "Búsqueda", "Lista de IDs"]

#@markdown **Banco general**: marca las categorías que quieras llenar (sirve para cualquier receta).
HUEVOS_Y_BATIDOS = True  #@param {type:"boolean"}
CORTAR_Y_PREPARAR = True  #@param {type:"boolean"}
SECOS = True  #@param {type:"boolean"}
LIQUIDOS = True  #@param {type:"boolean"}
COCCION = True  #@param {type:"boolean"}
HORNO_Y_APARATOS = True  #@param {type:"boolean"}
UTENSILIOS_Y_SERVICIO = True  #@param {type:"boolean"}
AMBIENTE = True  #@param {type:"boolean"}
SONIDOS_POR_ACCION = 3  #@param {type:"slider", min:1, max:8, step:1}

#@markdown **Búsqueda**: un término (en inglés funciona mejor) y la acción donde guardarlo.
BUSQUEDA = "egg crack"  #@param {type:"string"}
ACCION = "cascar-huevo"  #@param {type:"string"}
CANTIDAD = 5  #@param {type:"slider", min:1, max:20, step:1}

#@markdown **Lista de IDs**: pares `accion:id` separados por espacios. Vacío = lista elegida para los pancakes.
LISTA_IDS = ""  #@param {type:"string"}

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

USER_AGENT = "OyatsuTime-SoundBank/1.0 (Google Colab; descarga de sonidos CC0)"
CC0 = "publicdomain/zero/1.0"
CARPETA = "sonidos-asmr"
# Catálogo del banco: categoría → acción → búsquedas en inglés (de más a menos precisa).
# Para ampliar el banco, añade acciones aquí; el nombre de la acción es la carpeta.
CATALOGO = {
    "HUEVOS_Y_BATIDOS": {
        "cascar-huevo": ["egg crack", "cracking egg", "egg break bowl"],
        "batir-mano": ["whisking", "whisk bowl", "beating eggs"],
        "batidora": ["hand mixer", "electric mixer", "whipping cream"],
        "mezclar-espatula": ["mixing batter", "spatula bowl", "scraping bowl"],
        "remover-cuchara": ["stirring spoon", "stirring bowl", "stir pot"],
    },
    "CORTAR_Y_PREPARAR": {
        "cortar-tabla": ["chopping board", "knife chopping", "cutting board knife"],
        "picar-verdura": ["chopping vegetables", "cutting onion", "chopping carrot"],
        "cortar-fruta": ["cutting apple", "slicing fruit", "cutting strawberry"],
        "pelar": ["peeling vegetable", "peeler", "peeling potato"],
        "rallar": ["grater", "grating cheese", "grating"],
        "amasar": ["kneading dough", "dough", "bread dough"],
        "rodillo": ["rolling pin", "rolling dough"],
        "machacar": ["mortar pestle", "mashing", "crushing garlic"],
    },
    "SECOS": {
        "tamizar": ["sieve", "sifting flour", "sift"],
        "verter-seco": ["pouring sugar", "pouring rice", "pouring flour"],
        "espolvorear": ["sprinkle sugar", "salt shaker", "sprinkling"],
        "bolsa-seca": ["flour bag", "paper bag kitchen", "rustling bag"],
    },
    "LIQUIDOS": {
        "verter-liquido": ["pouring water", "pouring milk", "pour liquid"],
        "verter-aceite": ["pouring oil", "oil pan"],
        "verter-espeso": ["pouring syrup", "honey", "viscous pour"],
        "grifo": ["kitchen faucet", "tap water sink", "filling glass water"],
        "gotear": ["dripping water", "drip", "drops"],
    },
    "COCCION": {
        "chisporroteo": ["sizzle pan", "frying pan sizzle", "butter sizzling"],
        "freir-aceite": ["deep frying", "frying oil", "frying"],
        "hervir": ["boiling water", "simmering pot", "boiling"],
        "agua-sarten": ["water hot pan", "water sizzle", "steam sizzle"],
        "tapa": ["pot lid", "glass lid", "lid off"],
        "voltear": ["spatula flip", "pancake flip", "spatula"],
        "olla-sarten": ["pan on stove", "frying pan", "pot stove"],
        "encender-fuego": ["gas stove ignition", "stove click", "gas burner"],
    },
    "HORNO_Y_APARATOS": {
        "horno-puerta": ["oven door", "oven open close"],
        "horno-ambiente": ["oven fan", "oven hum"],
        "microondas": ["microwave", "microwave beep"],
        "tostadora": ["toaster", "toaster pop"],
        "licuadora": ["blender", "food processor"],
        "nevera": ["fridge door", "refrigerator open close", "freezer door"],
        "temporizador": ["kitchen timer", "timer ding", "timer ticking"],
        "hervidor": ["kettle", "electric kettle"],
    },
    "UTENSILIOS_Y_SERVICIO": {
        "plato": ["plate set down", "ceramic plate", "plate table"],
        "cubiertos": ["cutlery", "spoon clink", "fork plate"],
        "vaso": ["glass clink", "glass table", "pouring drink glass"],
        "bol-mesa": ["bowl on table", "glass bowl", "ceramic bowl"],
        "cajon": ["kitchen drawer", "drawer open close"],
        "frasco": ["jar open", "jar lid", "unscrew lid"],
        "envoltorio": ["plastic wrap", "foil", "wrapper"],
        "papel-cocina": ["paper towel", "tearing paper towel"],
    },
    "AMBIENTE": {
        "cocina-ambiente": ["kitchen ambience", "kitchen room tone", "kitchen background"],
        "lluvia-ventana": ["rain window", "soft rain"],
        "pajaros": ["birds morning", "birdsong distant"],
    },
}

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
    if MODO == "Banco general":
        elegidas = [c for c in CATALOGO if globals().get(c)]
        vistos, salida = set(), []
        for cat in elegidas:
            for accion, terminos in CATALOGO[cat].items():
                reunidos = []
                for termino in terminos:
                    if len(reunidos) >= SONIDOS_POR_ACCION:
                        break
                    try:
                        for i in buscar(termino, SONIDOS_POR_ACCION):
                            if i["id"] in vistos or CC0 not in i["licencia"]:
                                continue
                            if not (DURACION_MIN <= i["duracion"] <= DURACION_MAX):
                                continue
                            vistos.add(i["id"])
                            reunidos.append(i)
                            if len(reunidos) >= SONIDOS_POR_ACCION:
                                break
                    except Exception as e:  # noqa: BLE001
                        informe["errores"].append((accion, termino, f"búsqueda: {str(e)[:80]}"))
                    time.sleep(0.4)
                if not reunidos:
                    informe["saltados"].append((accion, "-", "sin resultados CC0 en el catálogo"))
                salida += [(accion, i) for i in reunidos]
                print(f"  · {accion}: {len(reunidos)} encontrados")
        return salida
    if MODO == "Búsqueda":
        accion = limpiar(ACCION)
        encontrados = buscar(BUSQUEDA, CANTIDAD)
        validos = [i for i in encontrados if CC0 in i["licencia"] and DURACION_MIN <= i["duracion"] <= DURACION_MAX]
        return [(accion, i) for i in validos[:CANTIDAD]]
    texto = LISTA_IDS if LISTA_IDS.strip() else LISTA_PANCAKES
    pares = []
    for trozo in texto.split():
        if ":" in trozo:
            accion, sid = trozo.split(":", 1)
            if sid.strip().isdigit():
                pares.append((limpiar(accion), sid.strip()))
    return pares


# ------------------------------------------------------------------------------------
print("🍓 Oyatsu Time · banco de sonidos ASMR\n")
print("Fuente:", "API de Freesound (con clave)" if TOKEN_FREESOUND.strip() else "Openverse (sin clave)")
print("Modo:", MODO, "\n")
shutil.rmtree(CARPETA, ignore_errors=True)
os.makedirs(CARPETA)

if MODO == "Lista de IDs" and not TOKEN_FREESOUND.strip():
    print("⚠️  Para descargar la lista necesitas tu clave de Freesound (arriba, en el paso 1).")
    print("   Pégala y vuelve a ejecutar la celda.\n")
try:
    trabajo = [] if (MODO == "Lista de IDs" and not TOKEN_FREESOUND.strip()) else tareas()
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
    f.write("Oyatsu Time · Banco de sonidos ASMR\n")
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
