# Banco de sonidos ASMR · Fuwa Fuwa Kitchen

Banco general de sonidos de cocina **reales y con licencia CC0**, organizado por **acción** para reutilizarlo en cualquier receta.

## Estructura

```
sonidos-asmr/
  <accion>/<accion>__<id-freesound>.wav   # p. ej. cascar-huevo/cascar-huevo__336612.wav
  CREDITOS.txt                            # autor y enlace de cada sonido
  licencias.csv                           # registro: archivo, acción, id, autor, licencia, url…
```

## Cómo se usa en cada receta

1. Se escribe la ficha de la receta (pasos reales).
2. Cada paso se asocia a una o varias **acciones** del banco (p. ej. "picar la cebolla" → `picar-verdura` + `cortar-tabla`).
3. Si falta una acción, se busca con el script (modo **Búsqueda**) y se añade al catálogo.
4. El video elige variaciones distintas de cada acción para que no suene repetido.

## Cómo llenarlo

Script de Google Colab: `scripts/colab_descargar_sonidos.py` (modo **Banco general**, con casillas por categoría y número de sonidos por acción). Descarga un `.zip` que se sube a esta carpeta.

## Acciones del catálogo

### Huevos y batidos

| Acción | Búsquedas |
|---|---|
| `cascar-huevo` | egg crack, cracking egg, egg break bowl |
| `batir-mano` | whisking, whisk bowl, beating eggs |
| `batidora` | hand mixer, electric mixer, whipping cream |
| `mezclar-espatula` | mixing batter, spatula bowl, scraping bowl |
| `remover-cuchara` | stirring spoon, stirring bowl, stir pot |

### Cortar y preparar

| Acción | Búsquedas |
|---|---|
| `cortar-tabla` | chopping board, knife chopping, cutting board knife |
| `picar-verdura` | chopping vegetables, cutting onion, chopping carrot |
| `cortar-fruta` | cutting apple, slicing fruit, cutting strawberry |
| `pelar` | peeling vegetable, peeler, peeling potato |
| `rallar` | grater, grating cheese, grating |
| `amasar` | kneading dough, dough, bread dough |
| `rodillo` | rolling pin, rolling dough |
| `machacar` | mortar pestle, mashing, crushing garlic |

### Ingredientes secos

| Acción | Búsquedas |
|---|---|
| `tamizar` | sieve, sifting flour, sift |
| `verter-seco` | pouring sugar, pouring rice, pouring flour |
| `espolvorear` | sprinkle sugar, salt shaker, sprinkling |
| `bolsa-seca` | flour bag, paper bag kitchen, rustling bag |

### Líquidos

| Acción | Búsquedas |
|---|---|
| `verter-liquido` | pouring water, pouring milk, pour liquid |
| `verter-aceite` | pouring oil, oil pan |
| `verter-espeso` | pouring syrup, honey, viscous pour |
| `grifo` | kitchen faucet, tap water sink, filling glass water |
| `gotear` | dripping water, drip, drops |

### Cocción

| Acción | Búsquedas |
|---|---|
| `chisporroteo` | sizzle pan, frying pan sizzle, butter sizzling |
| `freir-aceite` | deep frying, frying oil, frying |
| `hervir` | boiling water, simmering pot, boiling |
| `agua-sarten` | water hot pan, water sizzle, steam sizzle |
| `tapa` | pot lid, glass lid, lid off |
| `voltear` | spatula flip, pancake flip, spatula |
| `olla-sarten` | pan on stove, frying pan, pot stove |
| `encender-fuego` | gas stove ignition, stove click, gas burner |

### Horno y aparatos

| Acción | Búsquedas |
|---|---|
| `horno-puerta` | oven door, oven open close |
| `horno-ambiente` | oven fan, oven hum |
| `microondas` | microwave, microwave beep |
| `tostadora` | toaster, toaster pop |
| `licuadora` | blender, food processor |
| `nevera` | fridge door, refrigerator open close, freezer door |
| `temporizador` | kitchen timer, timer ding, timer ticking |
| `hervidor` | kettle, electric kettle |

### Utensilios y servicio

| Acción | Búsquedas |
|---|---|
| `plato` | plate set down, ceramic plate, plate table |
| `cubiertos` | cutlery, spoon clink, fork plate |
| `vaso` | glass clink, glass table, pouring drink glass |
| `bol-mesa` | bowl on table, glass bowl, ceramic bowl |
| `cajon` | kitchen drawer, drawer open close |
| `frasco` | jar open, jar lid, unscrew lid |
| `envoltorio` | plastic wrap, foil, wrapper |
| `papel-cocina` | paper towel, tearing paper towel |

### Ambiente

| Acción | Búsquedas |
|---|---|
| `cocina-ambiente` | kitchen ambience, kitchen room tone, kitchen background |
| `lluvia-ventana` | rain window, soft rain |
| `pajaros` | birds morning, birdsong distant |

## Reglas

- Solo **CC0** (sin atribución obligatoria). Lo que no sea CC0 se descarta.
- Duración entre 0,7 y 30 s; formato de trabajo WAV 48 kHz 24-bit.
- Sonidos grabados por nosotros (p. ej. miel o sirope cayendo) van en la misma estructura con el id `propio-01`, `propio-02`…
- Para ampliar el banco, añadir acciones al `CATALOGO` del script y a esta tabla.
