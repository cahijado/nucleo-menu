/* ============================================================
   Leer una receta escrita, sin modelo

   Entra el texto que alguien pega —una receta suya, o las cuatro que traía una
   página— y sale una receta con la forma de la aplicación. Todo el trabajo lo
   hacen piezas que ya existían y digirieron 534 recetas: `vocabulario.js`
   trocea cada línea, `diccionario.js` la lleva a la tabla de alimentos y
   `pesar.js` la convierte en gramos. Aquí solo se añade lo que aquellas no
   necesitaban: entender la ESTRUCTURA de un texto pegado, que no viene con el
   marcado limpio de una ficha.

   La regla que ordena todo lo demás: **lo que no se sabe se pregunta**. No hay
   segunda vuelta con un modelo ni valores por defecto silenciosos. Una receta
   sin raciones no se guarda «a 4» porque suele ser cuatro; se para y se
   pregunta, porque de las raciones cuelgan las kcal por ración y esas se
   enseñan como si fueran ciertas.

   `leerRecetas()` es pura: mismo texto y mismas respuestas, mismo resultado.
   Por eso la interfaz no guarda nada a medias — vuelve a leer entero cada vez
   que se contesta algo, y así una respuesta nunca contradice a otra.
   ============================================================ */
import { trocear, alimento, canonico, variantes, sinTildes } from "./vocabulario.js";
import { DIETAS, ALLERGENS } from "../data/constants.js";
import { buscar, esResto } from "./diccionario.js";
import { pesar } from "./pesar.js";

/* ---------- 1. la estructura del texto ---------- */

/* Un rótulo de sección. Basta con que la línea NOMBRE la palabra, no con que
   sea la palabra: las páginas de recetas las envuelven en preguntas —«¿QUÉ
   NECESITAS PARA PREPARAR ESPAGUETIS DE CALABACÍN? INGREDIENTES»— y exigir la
   igualdad dejaba el documento entero como una sola lista de la compra. */
const ROTULO_ING = /\bingredientes\b|\bqu[ée] necesitas\b|\blista de la compra\b|\bnecesitar[áa]s\b/i;
const ROTULO_PASOS = /\bpasos?\b|\belaboraci[óo]n\b|\bpreparaci[óo]n\b|\bc[óo]mo (se hace|preparar|hacer)\b|\bpaso a paso\b|\binstrucciones\b|\bmodo de hacerlo\b/i;

/* La versión para la máquina, en su propia sección: «Thermomix», «Pasos en
   Thermomix», «En Thermomix». Va aparte de los pasos a mano porque la
   aplicación los guarda aparte —`tmx`— y filtra por ellos: pedir un menú de
   Thermomix busca `tmx`, no una etiqueta. Sin esto, una receta escrita entera
   para la máquina no la encontraba ese filtro.

   Se mira ANTES que el rótulo de pasos normal, porque «Pasos en Thermomix»
   también dice «pasos» y ganaría el otro. */
const ROTULO_TMX = /\b(thermomix|thermo|tmx|termomix)\b/i;

/* Rótulo de grupo dentro de los ingredientes: «Para la salsa:». `trocear()`
   también los quita línea a línea, pero cuando van en su propia línea hay que
   reconocerlos antes o se cuentan como un ingrediente vacío. */
const GRUPO = /^(?:para\s+[^:]{0,45}|relleno|salsa|masa|guarnici[óo]n|marinada|adobo|glaseado|cobertura|base|crema|majado|sofrito)\s*:$/i;

/* «Dietas: baja en fructosa, baja en histamina». Lo declara quien escribe la
   receta, porque la tabla de alimentos no tiene de dónde derivarlo —no sabe
   la fructosa de una manzana ni la histamina de un queso curado—. Los
   alérgenos NO van aquí: esos se calculan, y escribirlos a mano al lado de un
   filtro que los calcula es la forma de que un día no coincidan.

   Se reconoce en cualquier zona del texto —arriba, junto al título, o al final
   después de los pasos— porque no hay una costumbre establecida de dónde
   ponerlo y no vale la pena inventarse una. */
const LINEA_DIETAS = /^\s*(?:dietas?|apta?\s+para|apto\s+para)\s*:\s*(.+)$/i;

/* Un rótulo tiene forma de rótulo, no solo la palabra.

   «Ingredientes», «Ingredientes para 4 raciones», «Pasos:» lo son. «Agrega el
   tofu y revuelve para incorporar los ingredientes.» no, y sin embargo pasaba:
   nombra la palabra y mide 57 caracteres, por debajo del tope de 90 que era
   toda la guarda que había. El daño es peor de lo que parece — el rótulo
   devuelve la zona a los ingredientes, así que TODO lo que viniera detrás
   dejaba de ser un paso y se leía como comida. Tres recetas del cuaderno lo
   hacían, y «integrar los ingredientes» es de las frases más comunes que hay.

   La señal que los separa es de forma, no de vocabulario: un rótulo no acaba
   en punto. Los dos puntos sí —«Pasos:»—, el punto no. Y por debajo, o es
   corto —«Ingredientes para 4 raciones», cuatro palabras— o viene entero en
   mayúsculas, que es como lo escriben las páginas de recetas escondiéndolo
   dentro de una pregunta: «¿QUÉ NECESITAS PARA PREPARAR X? INGREDIENTES».
   Esa forma es larga y sigue siendo un rótulo, así que el recuento de palabras
   solo no valdría. */
const esRotulo = (l) => {
  const t = String(l).trim();
  if (t.length >= 90 || /[.;!]$/.test(t)) return false;
  const letras = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letras.length >= 4 && letras === letras.toUpperCase()) return true;
  return t.replace(/:$/, "").split(/\s+/).filter(Boolean).length <= 6;
};

/* Un título: línea corta, sin puntuación de final de frase, y o bien con
   almohadilla de markdown o bien en mayúsculas. Es lo que separa una receta de
   la siguiente en un documento con varias. */
export function esTitulo(linea) {
  const l = String(linea).trim();
  if (!l || l.length > 70 || /[.:;,]$/.test(l)) return false;
  if (/^#{1,3}\s+\S/.test(l)) return true;
  if (ROTULO_ING.test(l) || ROTULO_PASOS.test(l)) return false;
  const letras = l.replace(/[^A-Za-zÀ-ÿ]/g, "");
  return letras.length >= 4 && letras === letras.toUpperCase();
}

/* Prosa que se ha colado en la lista de ingredientes. Es la red de seguridad
   por si el rótulo no se reconoce: una frase larga, con verbo y sin una sola
   cifra no es un ingrediente, y colarla acaba contando «ánade» donde la receta
   decía «añade el ajo picado». */
const esProsa = (l) =>
  l.length > 60 && !/\d/.test(l) &&
  /\b(es|son|puedes|resulta|queda|sirve para|perfect[ao]s?|deliciosa?|ideal|una? (alternativa|opci[óo]n|cl[áa]sico|receta))\b/i.test(l);

const tituloLegible = (s) => {
  const t = String(s).replace(/^#{1,3}\s+/, "").trim();
  // los títulos en mayúsculas se bajan; los que ya venían escritos, se respetan
  const bajado = t === t.toUpperCase() ? t.toLowerCase() : t;
  return bajado.charAt(0).toUpperCase() + bajado.slice(1);
};

/* El guion de una lista no es parte del ingrediente, y dejarlo puesto costaba
   la cantidad entera: «4 huevos» se lee como cuatro huevos y «- 4 huevos» se
   leía como un alimento llamado «4 huevos», sin cantidad, al que después se le
   ponía un peso a ojo. Y el guion es como escribe la gente una lista —el propio
   ejemplo de la pantalla lo lleva—, así que se quita antes de leer nada.

   Solo símbolos: un «1.» delante podría ser la numeración de la lista o podría
   ser la cantidad, y equivocarse ahí es peor que dejarlo. */
const sinVineta = (l) => {
  const limpia = String(l).replace(/^\s*(?:[-–—*+•·‣▪◦]\s*)+/, "").trim();
  return limpia || String(l).trim();   // una línea que solo era el guion se queda como estaba
};

/** Parte un texto pegado en recetas, y cada receta en sus partes. */
export function partir(texto) {
  const recetas = [];
  let actual = null;
  let zona = "intro";
  const nueva = (n) => {
    actual = { n, descripcion: [], ingTexto: [], pasos: [], tmx: [], grupos: [], rotulos: [], dietas: [] };
    recetas.push(actual);
    zona = "intro";
  };

  for (const bruta of String(texto ?? "").replace(/\r\n?/g, "\n").split("\n")) {
    const l = bruta.trim();
    if (!l) continue;
    if (esTitulo(l)) { nueva(tituloLegible(l)); continue; }
    if (!actual) nueva("");
    // el rótulo largo no es rótulo: es una frase que menciona la palabra
    /* El rótulo cambia de zona y además SE GUARDA. No es redundante: casi
       todo el mundo escribe «Ingredientes para 4 personas», y tirar esa línea
       se llevaba con ella las raciones —de las que cuelgan las kcal por
       ración— para acabar preguntando por algo que el texto ya decía. Van
       aparte de `descripcion` porque esa acaba en los consejos de la receta,
       y «Pasos» no es un consejo. */
    /* Antes que los demás rótulos: «Dietas: baja en sal» lleva dos puntos y
       una lista detrás, y en la zona de ingredientes se leería como un grupo. */
    const dietas = LINEA_DIETAS.exec(l);
    if (dietas) {
      for (const trozo of dietas[1].split(/[,;]|\by\b/)) {
        const limpio = trozo.trim().replace(/\.$/, "");
        if (limpio) actual.dietas.push(limpio);
      }
      continue;
    }
    if (esRotulo(l) && ROTULO_TMX.test(l) && !/\d/.test(l)) { zona = "tmx"; actual.rotulos.push(l); continue; }
    if (esRotulo(l) && ROTULO_ING.test(l)) { zona = "ing"; actual.rotulos.push(l); continue; }
    if (esRotulo(l) && ROTULO_PASOS.test(l)) { zona = "pasos"; actual.rotulos.push(l); continue; }
    if (zona === "ing" && GRUPO.test(l)) { actual.grupos.push(l.replace(/:$/, "")); continue; }
    if (zona === "ing" && esProsa(l)) { actual.descripcion.push(l); continue; }
    if (zona === "intro") actual.descripcion.push(l);
    else if (zona === "ing") actual.ingTexto.push(sinVineta(l));
    else if (zona === "tmx") actual.tmx.push(l);
    else actual.pasos.push(l);
  }
  // sin ingredientes no hay receta que leer, por muy bonito que sea el título
  return recetas.filter((r) => r.ingTexto.length);
}

/* ---------- 2. lo que dicen los pasos ---------- */

/* Se mira en orden y manda la primera: una receta que precalienta el horno y
   luego usa la sartén es de horno. Thermomix va antes que ninguna porque sus
   palabras no se usan para otra cosa. */
const MAQUINAS = [
  [/varoma|cubilete|\bbocal\b|cestillo|\bvel(?:ocidad)?\.?\s*(?:\d|cuchara)|mariposa|giro inverso|modo b[áa]scula/i, "thermomix"],
  [/freidora de aire|air ?fryer/i, "freidora de aire"],
  [/olla r[áa]pida|olla expr[eé]s|olla a presi[óo]n/i, "olla rápida"],
  [/\bhorno\b|precalienta|gratina|hornea/i, "horno"],
  [/sart[ée]n|cazuela|\bcazo\b|\bolla\b|fuego|hervir|sofr[íi]e|plancha/i, "tradicional"],
];

const PISTAS_TOMA = [
  [/desayuno/i, "desayuno"],
  [/aperitivo|merienda|postre/i, "merienda"],
  [/\bcena\b|cenar/i, "cena"],
  [/\bcomida\b|almuerzo|comer\b/i, "comida"],
];

/** Minutos que nombran los pasos, sumados, y las partes que se sumaron. */
export function minutosDe(pasos) {
  const partes = [...String(pasos).matchAll(/(\d+(?:[.,]\d+)?)\s*(minutos?|min\b|horas?|\bh\b|segundos?|seg\b)/gi)]
    .map(([, n, u]) => {
      const v = Number(n.replace(",", "."));
      return /^h/i.test(u) ? v * 60 : /^seg/i.test(u) ? v / 60 : v;
    });
  return { min: Math.round(partes.reduce((a, b) => a + b, 0)), partes };
}

/* ---------- 3. los ingredientes ---------- */

const clave = (s) => sinTildes(String(s)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28);

/** Alimentos de la tabla que se parecen a un nombre, para ofrecerlos al elegir. */
export function parecidos(nombre, ingredientes, cuantos = 6) {
  const palabras = canonico(nombre).split(/\s+/).filter((p) => p.length >= 4);
  if (!palabras.length) return [];
  const puntos = ingredientes.map((ing) => {
    const suyo = sinTildes(ing.n).toLowerCase();
    return { ing, p: palabras.filter((w) => suyo.includes(w)).length };
  });
  return puntos.filter((x) => x.p > 0).sort((a, b) => b.p - a.p).slice(0, cuantos).map((x) => x.ing);
}

/* Las alternativas que la receta ofrece entre paréntesis —«carne picada (res,
   pollo o pavo)»— desaparecen al trocear, que quita los paréntesis enteros
   porque casi siempre son aclaraciones. Cuando lo que hay dentro son opciones,
   hay que leerlas ANTES y reconstruir la frase con cada una: «carne picada
   pollo» encuentra la carne picada de pollo, y «pollo» a secas, la pechuga. */
function opcionesDelParentesis(linea) {
  const m = linea.match(/\(([^)]*\s+o\s+[^)]*)\)/);
  if (!m) return null;
  const base = linea.slice(0, m.index).replace(/^[^a-zA-ZÀ-ÿ]*/, "").trim();
  const partes = m[1].split(/\s*,\s*|\s+o\s+/i).map((s) => s.trim()).filter(Boolean);
  if (partes.length < 2) return null;
  return { base, partes };
}

/**
 * Los ingredientes de una receta, con las dudas anotadas.
 *
 * `respuestas` es un objeto plano id-de-pregunta → valor. Se vuelve a leer
 * entero con las respuestas puestas en vez de parchear el resultado anterior:
 * cuesta un milisegundo y evita que dos respuestas se pisen.
 */
function leerIngredientes(receta, ingIndex, respuestas, p) {
  const ingredientes = Object.values(ingIndex);
  const acumulado = new Map();
  const preguntas = [];
  const supuestos = [];
  const pregunta = (o) => {
    /* `antes` es el identificador que tuvo esta misma pregunta en una versión
       anterior. El taller promete que lo contestado se guarda, así que cambiar
       la forma de un identificador no puede costarle a nadie volver a
       contestar: se busca por el nuevo y, si no está, por el viejo. */
    const v = respuestas[o.id] ?? (o.antes === undefined ? undefined : respuestas[o.antes]);
    /* Contestar «0 raciones» no es contestar. Cada pregunta dice cuándo se da
       por buena su respuesta; por defecto, con que la haya. */
    preguntas.push({ ...o, valor: v, respondida: o.valida ? o.valida(v) : v !== undefined });
  };

  const RANGO = /(\d+)\s*[-–—]\s*(\d+)\s*([a-zA-Z]+)?/;

  for (const [n, linea] of receta.ingTexto.entries()) {
    const base = `${p}:i${n}`;
    const alternativas = opcionesDelParentesis(linea);

    for (const bruto of trocear(linea)) {
      /* Un rango es una decisión que la receta no toma: «300-400 g de arroz»
         son cien gramos de arroz de diferencia. Coger el primero y callar era
         lo que hacía el prototipo, y es justo lo que no se puede hacer.

         Se busca en el trozo y no en la línea. Una línea trae varios
         ingredientes —«3-4 cucharadas de yogur, 1 pimiento del piquillo, un
         chorrito de aceite, sal y pimienta»— y preguntando por la línea
         entera, el pimiento, el aceite, la sal y la pimienta se quedaban
         esperando a que alguien decidiera lo del yogur. Además la pregunta
         citaba los doscientos caracteres de la línea para preguntar por
         cuatro. Ahora cada rango bloquea lo suyo y nada más. */
      const rango = bruto.match(RANGO);
      const idRango = `${base}:${clave(bruto)}:rango`;
      const idRangoAntes = `${base}:rango`;   // cuando el margen iba por línea
      let trozo = bruto;
      if (rango) {
        const [, a, b, u] = rango;
        pregunta({
          id: idRango, antes: idRangoAntes, tipo: "elegir", linea: bruto,
          texto: `«${bruto.trim()}» da un margen. ¿Con cuál me quedo?`,
          opciones: [a, String(Math.round((Number(a) + Number(b)) / 2)), b]
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .map((v) => ({ valor: v, etiqueta: `${v} ${u || ""}`.trim() })),
        });
        const elegido = respuestas[idRango] ?? respuestas[idRangoAntes];
        if (elegido === undefined) continue;       // sin respuesta no se cuenta
        trozo = bruto.replace(rango[0], `${elegido} ${u || ""}`);
      }

      const item = alimento(trozo);
      if (esResto(canonico(item.nombre))) continue;

      /* qué alimento es */
      let id = "";
      let elegida = "";
      for (const opcion of item.opciones ?? [item.nombre]) {
        id = buscar(canonico(opcion), variantes);
        if (id) { elegida = opcion; break; }
      }

      if (!id || !ingIndex[id]) {
        const idQue = `${base}:${clave(item.nombre || trozo)}:que`;
        pregunta({
          id: idQue, tipo: "elegir", linea: trozo,
          texto: `«${item.nombre || trozo}» no está en la tabla de alimentos. ¿Qué es?`,
          opciones: [
            ...parecidos(item.nombre || trozo, ingredientes).map((x) => ({ valor: x.id, etiqueta: x.n })),
            { valor: "", etiqueta: "no lo cuentes" },
          ],
          buscable: true,
        });
        id = respuestas[idQue];
        if (!id) continue;      // sin contestar, o contestado «no lo cuentes»
      }

      /* La receta ofrecía alternativas y hay que elegir una. Sin una primera
         palabra que buscar no hay nada que comprobar: antes se comparaba
         contra un carácter nulo para que no encajara nunca, y ese byte se
         quedaba dentro del archivo —invisible al leerlo y suficiente para que
         git lo diera por binario y dejara de enseñar sus diferencias—. */
      const cabeza = alternativas ? alternativas.base.split(/\s+/)[0] : "";
      const conParentesis = Boolean(cabeza) && trozo.includes(cabeza);
      if (conParentesis) {
        const idCual = `${base}:cual`;
        /* Dos alternativas pueden acabar en el mismo alimento —«pollo o pavo»
           comparten entrada en la tabla— y ofrecerlo dos veces obligaría a
           elegir entre dos botones idénticos. Se juntan en uno. */
        const porId = new Map();
        for (const t of alternativas.partes) {
          const i = buscar(canonico(`${alternativas.base} ${t}`), variantes);
          if (!i || !ingIndex[i]) continue;
          porId.set(i, [...(porId.get(i) || []), t]);
        }
        const opciones = [...porId.entries()].map(([i, textos]) => ({
          valor: i, etiqueta: `${textos.join(" o ")} → ${ingIndex[i].n}`,
        }));
        if (opciones.length > 1) {
          pregunta({
            id: idCual, tipo: "elegir", linea: linea.trim(),
            texto: `«${linea.trim()}» deja elegir. ¿Cuál lleva?`,
            opciones,
          });
          if (respuestas[idCual] === undefined) continue;
          id = respuestas[idCual];
        }
      } else if (item.opciones.length > 1 && elegida && elegida !== item.opciones[0]) {
        // «Crema agria o yogur»: la primera no está en la tabla y se cogió la segunda
        supuestos.push(`«${trozo}»: no tengo «${item.opciones[0]}», he contado ${ingIndex[id].n}.`);
      }

      /* cuánto es */
      const idCuanto = `${base}:${clave(ingIndex[id].n)}:cuanto`;
      if (respuestas[idCuanto] !== undefined) {
        pregunta({ id: idCuanto, tipo: "gramos", linea: trozo, omitible: true, texto: `«${trozo}» → ${ingIndex[id].n}: ¿cuántos gramos?` });
        // contestar con nada es contestar: «esto no lo lleva», y no se cuenta
        const puestos = Number(respuestas[idCuanto]) || 0;
        if (puestos > 0) acumulado.set(id, (acumulado.get(id) || 0) + puestos);
        continue;
      }
      const { g, origen } = pesar(item, ingIndex[id]);
      if (g === null) {
        pregunta({ id: idCuanto, tipo: "gramos", linea: trozo, omitible: true, texto: `«${trozo}» → ${ingIndex[id].n}: no sé cuánto es. ¿Cuántos gramos?` });
        continue;
      }
      /* Lo que sí se ha podido pesar, pero no con certeza, se dice. No se
         pregunta —serían cinco preguntas por receta y ninguna importante— pero
         tampoco se calla: quien revise el borrador verá de dónde sale cada
         cifra que le extrañe. */
      const redondo = Math.round(g * 10) / 10;
      if (origen === "a ojo") supuestos.push(`«${trozo}»: sin cantidad, he puesto ${redondo} g, lo que se echa a ojo.`);
      if (origen === "cuenta") supuestos.push(`«${trozo}»: ${redondo} g, contando el peso medio de una pieza.`);
      if (origen === "generica") supuestos.push(`«${trozo}»: ${redondo} g, con la medida de cocina general — de ese alimento en concreto no lo sé.`);
      acumulado.set(id, (acumulado.get(id) || 0) + g);
    }
  }

  const ing = [...acumulado.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([i, g]) => ({ i, q: Math.round(g * 10) / 10, u: "g", o: false }));
  return { ing, preguntas, supuestos };
}

/* ---------- 4. la receta entera ---------- */

/**
 * Lee un texto pegado y devuelve las recetas que trae, cada una con sus
 * preguntas sin contestar. Con `respuestas` puestas, las mismas recetas ya
 * resueltas: la interfaz vuelve a llamar aquí cada vez que se contesta algo.
 */
export function leerRecetas(texto, ingIndex, respuestas = {}) {
  return partir(texto).map((receta, n) => {
    const p = `r${n}`;
    const preguntas = [];
    const pregunta = (o) => {
    const v = respuestas[o.id];
    /* Contestar «0 raciones» no es contestar. Cada pregunta dice cuándo se da
       por buena su respuesta; por defecto, con que la haya. */
    preguntas.push({ ...o, valor: v, respondida: o.valida ? o.valida(v) : v !== undefined });
  };

    /* Los tiempos y la máquina salen de TODOS los pasos, los de mano y los de
       la máquina. Una receta escrita solo para Thermomix tiene sus tiempos ahí
       dentro, y mirar solo `pasos` la dejaba sin tiempo y preguntando por algo
       que el texto ya decía. */
    const cuerpo = [...receta.pasos, ...(receta.tmx || [])].join(" ");
    const todo = [receta.n, ...receta.descripcion, ...receta.rotulos, ...receta.ingTexto, cuerpo].join(" ");

    /* el nombre */
    const idNombre = `${p}:nombre`;
    if (!receta.n) {
      pregunta({ id: idNombre, tipo: "texto", texto: "El texto no trae título. ¿Cómo se llama la receta?" });
    }
    const n1 = receta.n || respuestas[idNombre] || "";

    /* las raciones: de aquí cuelgan las kcal por ración, así que no hay
       valor por defecto que valga */
    const dice = todo.match(/(?:para\s+)?(\d+)\s*(raci[oó]n(?:es)?|personas?|comensales?)/i);
    const idRaciones = `${p}:raciones`;
    if (!dice) {
      pregunta({
        id: idRaciones, tipo: "numero", texto: "¿Para cuántas raciones es?",
        ayuda: "Sin esto no se pueden dar las kcal por ración.",
        valida: (v) => Number(v) > 0,
      });
    }
    const raciones = dice ? Number(dice[1]) : Number(respuestas[idRaciones]) || 0;

    /* las tomas */
    const pistas = PISTAS_TOMA.filter(([re]) => re.test(`${receta.n} ${receta.descripcion.join(" ")}`)).map(([, t]) => t);
    const idTomas = `${p}:tomas`;
    if (!pistas.length) {
      pregunta({ id: idTomas, tipo: "tomas", texto: "¿En qué comidas del día encaja?", valida: (v) => Array.isArray(v) && v.length > 0 });
    }
    const tomas = pistas.length ? pistas : (respuestas[idTomas] || []);

    /* los pasos, y de qué máquina son */
    /* El tiempo y la máquina salen de UNA de las dos versiones, no de las dos
       mezcladas: son dos formas de hacer el mismo plato, no dos fases. Manda
       la de mano, que es la que hace casi todo el mundo, y si no la hay, la de
       la máquina —y entonces la máquina es la Thermomix, lo diga o no el texto
       de los pasos. */
    const aMano = receta.pasos.length ? receta.pasos : (receta.tmx || []);
    const suyo = aMano.join(" ");
    const metodo = receta.pasos.length
      ? (MAQUINAS.find(([re]) => re.test(suyo))?.[1] || "")
      : (receta.tmx?.length ? "thermomix" : "");
    const { min, partes } = minutosDe(suyo);
    const idMin = `${p}:min`;
    if (!min) pregunta({ id: idMin, tipo: "numero", texto: "Los pasos no dicen tiempos. ¿Cuántos minutos lleva?", valida: (v) => Number(v) > 0 });

    const leidos = leerIngredientes(receta, ingIndex, respuestas, p);
    const supuestos = [...leidos.supuestos];
    if (partes.length > 1) {
      supuestos.push(`Tiempo: he sumado los que dicen los pasos (${partes.map((x) => Math.round(x * 10) / 10).join(" + ")} = ${min} min).`);
    }
    if (metodo) supuestos.push(`Los pasos parecen de ${metodo}.`);

    /* Las dietas declaradas, cotejadas contra la lista cerrada de
       `constants.js`. Salen en tres montones y no en uno:

       - las que están en la lista, que son las que se guardan;
       - las que nombran un alérgeno —«sin gluten», «sin lácteos»—, que se
         apartan porque eso lo calcula la tabla de alimentos: una etiqueta
         escrita a mano al lado de un filtro que la calcula es la forma de que
         un día no coincidan, y quien lee «sin gluten» no se para a mirar de
         dónde salió;
       - y las que no se reconocen, que no se inventan ni se guardan a medias:
         se devuelven para que quien llame lo diga en voz alta.

       Nada de esto para la receta. Una dieta mal escrita es una etiqueta que
       falta, no un dato equivocado. */
    const dietas = [];
    const dietasCalculadas = [];
    const dietasRaras = [];
    const iguales = (a, b) => sinTildes(a).toLowerCase().replace(/\s+/g, " ").trim()
                           === sinTildes(b).toLowerCase().replace(/\s+/g, " ").trim();
    for (const cruda of receta.dietas || []) {
      const buena = DIETAS.find((d) => iguales(d, cruda));
      if (buena) {
        if (!dietas.includes(buena)) dietas.push(buena);
        continue;
      }
      const norma = sinTildes(cruda).toLowerCase();
      const alergeno = ALLERGENS.find((a) => norma.includes(sinTildes(a).toLowerCase()));
      if (alergeno) dietasCalculadas.push({ escrito: cruda, alergeno });
      else dietasRaras.push(cruda);
    }

    const todas = [...preguntas, ...leidos.preguntas];
    return {
      ...receta,
      n: n1,
      dietas,
      dietasCalculadas,
      dietasRaras,
      tmx: receta.tmx?.length ? receta.tmx : null,
      raciones,
      tomas,
      min: min || Number(respuestas[idMin]) || 0,
      metodo,
      grados: cuerpo.match(/(\d{2,3})\s*[°º]\s*C/i)?.[1] || "",
      ing: leidos.ing,
      preguntas: todas,
      pendientes: todas.filter((q) => !q.respondida),
      supuestos,
    };
  });
}
