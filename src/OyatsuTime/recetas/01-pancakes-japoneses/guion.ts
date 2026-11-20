// Guion de "Pancakes japoneses" (receta original de Just One Cookbook) · Receta nº 1 de おやつタイム.
// Usa el constructor común (src/OyatsuTime/guion.ts). Ventana lógica 1200×900, 30 fps.
import { Guion } from "../../guion";
import { huecoDespensa } from "../../posiciones";
import type { Ingrediente, PasoReceta } from "../../tipos";

export const INGREDIENTES: Ingrediente[] = [
  { s: "huevo", cant: "2", nombre: "huevos grandes" },
  { s: "leche", cant: "1½ cda", nombre: "leche entera" },
  { s: "vainilla", cant: "¼ cdta", nombre: "vainilla" },
  { s: "harina", cant: "¼ taza", nombre: "harina de repostería" },
  { s: "polvo", cant: "½ cdta", nombre: "polvo de hornear" },
  { s: "azucar", cant: "2 cdas", nombre: "azúcar" },
  { s: "aceite", cant: "1 cda", nombre: "aceite neutro" },
  { s: "agua", cant: "2 cdas", nombre: "agua (vapor)" },
];

export const PASOS: PasoReceta[] = [
  { titulo: "Separa los huevos", truco: "Ni una gota de yema en las claras, o no montan. ¡Claras 15 min al congelador!", items: [["huevo", "Huevo"]] },
  { titulo: "Yemas + leche + vainilla", truco: "Bate a mano hasta que la mezcla quede pálida y espumosa.", items: [["leche", "Leche"], ["vainilla", "Vainilla"]] },
  { titulo: "Tamiza la harina", truco: "Harina y polvo de hornear tamizados. Mezcla solo hasta que esté lisa.", items: [["harina", "Harina"], ["polvo", "Polvo de hornear"]] },
  { titulo: "Monta el merengue", truco: "Azúcar en 3 veces hasta picos firmes y brillantes.", items: [["azucar", "Azúcar"]] },
  { titulo: "Une en 3 partes", truco: "1/3 del merengue para igualar densidades; el resto, con movimientos envolventes.", items: [] },
  { titulo: "Sartén a fuego mínimo", truco: "150 °C y un hilo de aceite. Retira el exceso con papel.", items: [["aceite", "Aceite"]] },
  { titulo: "Montones altos + tapa", truco: "Apila la masa. Agua en los huecos, tapa y 6–7 min a fuego bajo.", items: [["agua", "Agua"]] },
  { titulo: "Voltea con cuidado", truco: "Si se resiste, espera 30 s. Agua, tapa y 4–5 min más.", items: [] },
  { titulo: "¡A servir!", truco: "Sírvelos al momento: fresas, azúcar glas y sirope.", items: [["fresa", "Fresa"], ["azucar", "Azúcar glas"], ["miel", "Sirope"]] },
];

// Posiciones fijas en la ventana
export const YEMAS = { x: 320, y: 740, k: 0.84 };
export const CLARAS = { x: 700, y: 740, k: 0.84 };
export const SARTEN = { x: 470, y: 720 };
export const PLATO = { x: 470, y: 760 };
export const PANCAKES_X = [340, 470, 600];

const g = new Guion();

// --- Gancho, menú e inventario (comunes)
g.intro();
g.inventario(INGREDIENTES.length);

const finPaso = (i: number) => g.finPaso(i, PASOS[i].truco);

// --- Paso 1: separar huevos (se muestra uno, con "×2")
g.quieto(26);
g.coger_de_despensa(0, 1, "huevo").ir(YEMAS.x, 560, 22).quieto(6).son("toc-huevo").quieto(10).marca("huevo1").clic("crack-suave").soltar().quieto(24);
g.ir(CLARAS.x + 130, 470, 20).marca("congelar").son("tictac", { dur: 50 }).quieto(50);
finPaso(0);

// --- Paso 2: yemas + leche + vainilla
g.marca("paso1").quieto(6);
g.coger_de_despensa(0, 2, "leche").ir(YEMAS.x + 60, 520, 22).marca("leche").son("gorgoteo", { dur: 28, vol: 0.6 }).quieto(28).soltar();
g.coger_de_despensa(1, 2, "vainilla").ir(YEMAS.x + 40, 540, 20).marca("vainilla0").clic("plop-3", 0.5).quieto(8);
g.soltar().coger("varillas").ir(YEMAS.x + 70, 545, 16).marca("batirY").son("batir", { dur: 54 }).girar(YEMAS.x, 545, 70, 16, 54, 3).marca("batirYfin").soltar();
finPaso(1);

// --- Paso 3: tamizar (harina y polvo de hornear juntos)
g.marca("paso2").quieto(6);
g.coger_de_despensa(0, 2, "tamiz").ir(huecoDespensa(1, 2).x, huecoDespensa(1, 2).y, 18).clic("toc", 0.6);
g.ir(YEMAS.x, 500, 22).marca("tamiz1").son("tamizar", { dur: 44 }).sacudir(44).marca("tamizFin").soltar();
g.coger("varillas").ir(YEMAS.x + 70, 545, 16).marca("mezclaY").son("batir", { dur: 36 }).girar(YEMAS.x, 545, 60, 14, 36, 2).marca("mezclaYfin").soltar();
finPaso(2);

// --- Paso 4: merengue (espumoso → azúcar en 3 veces → picos firmes)
g.marca("paso3").coger("batidora").ir(CLARAS.x + 60, 600, 20).marca("batidora").son("batidora", { dur: 34 }).girar(CLARAS.x, 625, 60, 12, 34, 2).soltar();
g.coger_de_despensa(0, 1, "azucar").ir(CLARAS.x + 20, 540, 20);
for (let k = 1; k <= 3; k++) g.marca(`azucar${k}`).clic("espolvorear").quieto(14);
g.soltar().coger("batidora").ir(CLARAS.x + 60, 600, 16).son("batidora", { dur: 60 }).girar(CLARAS.x, 625, 60, 12, 60, 4);
g.marca("picos").son("tintineo", { vol: 0.6 }).soltar().ir(CLARAS.x + 150, 520, 14);
finPaso(3);

// --- Paso 5: unir en 3 partes (1/3 para igualar + envolver el resto)
g.marca("paso4").coger("espatula");
g.ir(CLARAS.x, 640, 20).marca("toma1").clic("plop-2", 0.5).ir(YEMAS.x, 620, 22).marca("deja1").clic("plop-1", 0.5);
g.son("batir", { dur: 26 }).girar(YEMAS.x, 645, 55, 14, 26, 2);
g.marca("toma2").marca("deja2").son("plop-2", { vol: 0.5 });
g.marca("envolver").son("fwip", { vol: 0.5 });
for (let i = 0; i < 3; i++) g.ir(YEMAS.x - 60, 600, 10).ir(YEMAS.x + 60, 690, 12);
g.marca("envolverFin").soltar();
finPaso(4);
g.marca("salenBoles").quieto(30);

// --- Paso 6: sartén a fuego mínimo
g.marca("paso5").marca("fuego").quieto(30);
g.coger_de_despensa(0, 1, "aceite").ir(SARTEN.x + 40, 560, 20).marca("aceite").clic("plop-3", 0.4).quieto(10).soltar();
g.coger("papel").ir(SARTEN.x + 120, 690, 16).marca("papel").son("tamizar", { dur: 30, vol: 0.5 }).girar(SARTEN.x, 690, 120, 26, 30, 2).soltar();
finPaso(5);

// --- Paso 7: montones altos (se apilan al pasar), agua, tapa 6–7 min
g.marca("paso6").coger("cuchara");
PANCAKES_X.forEach((x, i) => g.ir(x, 560, i === 0 ? 20 : 14).marca(`monton${i}`).clic(`plop-${i + 1}`));
PANCAKES_X.forEach((x, i) => g.ir(x, 520, 14).marca(`apila${i}`).son(`plop-${((i + 1) % 3) + 1}`, { vol: 0.7 }));
g.soltar().coger_de_despensa(0, 1, "agua").ir(SARTEN.x - 60, 620, 18).marca("agua1").clic("agua-puff").soltar();
g.ir(1000, 560, 16).marca("tapa1").son("tapa").quieto(10).marca("reloj1").son("tictac", { dur: 76 }).quieto(30);
g.marca("ultima").coger("cuchara");
PANCAKES_X.forEach((x, i) => g.ir(x, 470, 10).son(`plop-${i + 1}`, { vol: 0.6 }));
g.soltar().ir(1000, 560, 12).quieto(24).marca("reloj1fin").son("tintineo", { vol: 0.5 });
finPaso(6);

// --- Paso 8: voltear, agua, tapa 4–5 min
g.marca("paso7").marca("tapaFuera").son("tapa", { vol: 0.7 }).quieto(12).coger("espatula");
PANCAKES_X.forEach((x, i) => {
  g.ir(x, 620, 16).son("fwip").marca(`voltea${i}`).quieto(14).son("toc");
});
g.soltar().coger_de_despensa(0, 1, "agua").ir(SARTEN.x - 60, 620, 18).marca("agua2").clic("agua-puff").soltar();
g.ir(1000, 560, 16).marca("tapa2").son("tapa").marca("reloj2").son("tictac", { dur: 50 }).quieto(50).marca("listo").son("tapa", { vol: 0.6 });
finPaso(7);

// --- Paso 9: servir
g.marca("paso8").marca("salenSarten").quieto(22).marca("plato");
PANCAKES_X.forEach((_, i) => g.quieto(8).marca(`pila${i}`).son(i === 2 ? "tac-plato" : "plop-1", { vol: 0.7 }));
g.quieto(4).marca("jiggle1").son("boing-esponjoso").quieto(24);
g.coger_de_despensa(0, 3, "fresa").ir(PLATO.x, 470, 18).marca("fresa0").clic("plop-3", 0.6).quieto(4).marca("fresa1").son("plop-2", { vol: 0.5 }).soltar();
g.coger_de_despensa(1, 3, "azucar").ir(PLATO.x, 430, 18).marca("glas").son("espolvorear").sacudir(24, 10).soltar();
g.coger_de_despensa(2, 3, "miel").ir(PLATO.x - 90, 420, 18).marca("sirope").son("gorgoteo", { dur: 44 });
g.ir(PLATO.x + 80, 430, 44).marca("siropeFin").soltar().ir(1100, 980, 20);
g.marca("jiggle2").son("boing-esponjoso").quieto(16);
finPaso(8);

// --- Final (común): receta nueva → ♡ Guardar → libro
g.final();

export const G = g.hecho();
export const PASO_INICIO = PASOS.map((_, i) => G.ev[`paso${i}`]);
