# Guía de estilo · おやつタイム (Oyatsu Time)

Base común para **todos** los videos del canal. Cada receta solo aporta su guion y los objetos
nuevos que necesite; todo lo demás sale de aquí y del código común en `src/OyatsuTime/`.

> **El objetivo de cada video es enseñar una receta.** Todo (animación, textos, ritmo) está al
> servicio de que se entienda como un tutorial y se pueda repetir en casa.

---

## 1. Marca

- **Nombre del canal y del juego:** **おやつタイム** (grande, japonés) con **Oyatsu Time** (pequeño,
  al costado, romanizado). *Oyatsu* = merienda.
- **Tono:** tierno, tranquilo, acogedor; juego de cocina "para niña" de los 2000, pulido y detallado.
- **Original:** no copiar personajes, dibujos ni pantallas de juegos existentes.

## 2. Paleta fija (A · Fresa y crema)

| Uso | Color |
|---|---|
| Interfaz, botones, cinta | `#EE7C9C` (rosa fresa) · oscuro `#C85A7C` |
| Acento (estrellas, avisos, cantidades) | `#FFD36E` |
| Paneles | `#FFF8EE` (crema) |
| Despensa / madera | `#EDCFA6` · oscura `#C99D72` |
| Pared de la cocina | `#FCE6EC` con rayas blancas |
| Contorno de todo | `#7C4F63` |
| Texto | `#6A3E52` |

Definida en `src/CocinaDulce/disenos/paletas.ts` (paleta `A`) y reexportada por `src/OyatsuTime/tema.ts`.

## 3. Tipografías

| Uso | Fuente |
|---|---|
| Marca en japonés (おやつタイム) | **DotGothic16** (pixel, con japonés) |
| Títulos redondos ("Ingredientes", "LIBRO DE RECETAS") | **Fredoka** 700 |
| Interfaz, cinta, cantidades, bocadillos | **Pixelify Sans** 500/700 |

Textos con contorno grueso del color de contorno (estilo juego).

## 4. Composición vertical y zona segura de TikTok (1080 × 1920)

TikTok tapa: ~108 px arriba (pestañas), ~320 px abajo (descripción, usuario, música; sube si la
descripción es larga) y ~120 px a la derecha (me gusta, comentar, compartir). Margen izquierdo 60 px.

| Zona (y) | Contenido | x |
|---|---|---|
| 0–110 | Solo fondo | — |
| 120–330 | **Logo pixel おやつタイム** (×2) + etiqueta "Nº n · receta" al lado | 50–970 |
| 350–1139 | **Ventana del juego**: vista de 1050×900 a escala 0,876 (la cocina se ve con una cámara que recorta el margen izquierdo) | 50–970 |
| 1166–1366 | **Panel de consejo** (Nube o libreta + texto) | 50–970 |
| 1380–1500 | **Progreso** "Paso n de N" + barra + ★ puntos (solo durante los pasos) | 50–970 |
| 1530–1920 | Suelo de madera (lo tapa TikTok) | — |
| x 980–1080 | Nada importante (botones de TikTok) | — |

- **Logo:** `public/logo/oyatsu-time.png`, pixel art generado con `scripts/generar_logo.py`
  (letras esponjosas Mochiy Pop One a baja resolución, doble contorno blanco y marrón, brillo,
  gotitas, corazones, lazo y nube con "Oyatsu Time"). Se muestra con `image-rendering: pixelated`.
- **Fondo exterior:** pared de rayas celestes + zócalo blanco + suelo de madera (`src/OyatsuTime/Fondo.tsx`).
- **Tamaños:** dentro de la ventana, ningún texto por debajo de 32 px lógicos.
- **Cada dato en un solo sitio:** la cinta dice solo la acción; el número de paso va en el progreso.
- **Comprobación obligatoria:** cada video tiene una variante con la **capa de zona segura**
  (`zonaSegura`) que pinta encima la interfaz de TikTok; se revisa antes de publicar.

## 5. La cocina (siempre igual)

Ventana con cortinas, estante con frascos, utensilios colgados, azulejos rosas, encimera crema y
tabla de cortar. **Despensa** de madera a la derecha (dentro de la ventana) con **solo los
ingredientes del paso actual**. Recipientes en vista 3/4; **el contenido se ve dentro** del
recipiente (nunca flotando encima).

## 6. Pantallas del juego (en este orden)

1. **Gancho (≈2 s):** el resultado final en movimiento + pregunta corta ("¿Pancakes que tiemblan?").
2. **Menú:** logo おやつタイム, "Receta nº N · Nombre", botones **Jugar / Libro de recetas / Opciones**.
3. **Inventario de ingredientes:** cuadrícula tipo juego; cada hueco = sprite + **cantidad** en una
   etiqueta ("×2", "1½ cda"). Aviso **"📸 ¡Saca captura!"**. Utensilios en una línea.
4. **Pasos:** cinta "PASO n/N · verbo + qué", despensa del paso, **marcador de puntos** (+100 por
   paso), barras de progreso cuando aplica (p. ej. **"Esponjoso"**, "Derretido", "Cocción").
5. **¡Has conseguido una receta nueva!:** marco de encaje, plato en el centro, flores girando, Nube
   celebrando y botón **"♡ Guardar"** → sello **"¡Guardada!"**.
6. **Libro de recetas:** página con la receta añadida (Nº, ingredientes = plato, nombre).

## 7. Nube, la conejita repostera (personaje)

Pixel art propio (`src/CocinaDulce/disenos/Conejita.tsx`). Orejas largas con lazo, delantal con
bolsillo de corazón.

**Poses:** normal · feliz (ojos ^ ^) · brazos arriba (celebra).
**Apariciones dentro de la ventana** (entra y sale, no está siempre):
- **Asomada** desde una esquina (medio cuerpo).
- **Probando** la mezcla con una cucharita ("¡Mmm!").
- **Ayudando a batir** con su batidor.
- **Celebrando** (salta) en el final.

**Reglas de texto (importante):**

| Situación | Bocadillo de Nube | Panel de consejo (abajo) |
|---|---|---|
| Nube en pantalla, sin consejo | frase corta (2–5 palabras) | — |
| Nube en pantalla **y** consejo largo | frase corta | consejo con icono **📝 libreta** |
| Nube **no** está y hay consejo | — | consejo **con Nube** (sin libreta) |

Frases cortas: reacciones ("¡Qué esponjoso!", "¡Sin yema!", "¡Mira cómo suben!"). Los consejos
largos son los trucos de la receta original.

## 8. Cursor e interacción

Mano pixelada: se mueve, pasa por encima (tooltip con el nombre), hace clic (onda rosa + sonido),
**coge** ingredientes y utensilios. Herramientas bien orientadas: **la mano en el mango**, la
parte que trabaja dentro de la mezcla.

## 9. Sonido

- **Solo sonidos de juego** propios: suaves, esponjosos, redondos (sin agudos ásperos, ataques
  suaves). `scripts/generar_sfx_cocina_juego.py` y `scripts/generar_sfx_kawaii.py`.
- **Música** propia de juego portátil, baja (≈0,3), con fundido de entrada y salida.
- **Sin voz.** Texto letra a letra con bips suaves.
- (El banco de Freesound queda archivado; no se usa por ahora.)

## 10. Ritmo de tutorial

- Cada paso dura **al menos** lo que se tarda en leer su consejo (≈2,5 palabras/s) **+ 1,5 s**.
- Cada paso termina con **1 s de pausa** mostrando el resultado.
- Las acciones repetidas se resumen ("×2", "1/3 · 2/3 · 3/3").
- La **cantidad** del ingrediente se ve cuando se usa.
- Duración objetivo: **85–95 s**.

## 11. Errores a evitar (lista de comprobación)

- [ ] Sin huecos entre pantallas (la cinta/consejo nunca vuelve a un texto por defecto).
- [ ] Cada consejo se puede leer completo.
- [ ] El contenido se ve **dentro** de boles, sartenes y moldes.
- [ ] Herramientas con el mango en la mano.
- [ ] Nada importante en la franja derecha ni abajo (capa de zona segura revisada).
- [ ] Pasos fieles a la receta original investigada (ficha aprobada).
- [ ] Cantidades visibles en el inventario y al usarlas.
- [ ] Sonidos suaves; música por debajo de los efectos.
- [ ] Nube no tapa la acción principal.
- [ ] El final dice "♡ Guardar" y muestra el libro con el número correcto (ver `publicadas.md`).
