import { TOMA_PESO, DIAS } from "../data/constants.js";
import { gramsOf } from "./gramos.js";
import { rasgosDeReceta, puntuarCriterios } from "./criterios.js";
import { precioDe } from "../data/precios.js";

/* ============================================================
   Cálculo nutricional y escalado
   ============================================================ */
export { gramsOf } from "./gramos.js";

export const EMPTY_N = { kcal: 0, p: 0, c: 0, az: 0, g: 0, gs: 0, f: 0 };

/* Una receta solo tiene nutrición cuando TODOS sus ingredientes están
   identificados en la tabla. Si queda alguno sin reconocer, las kcal saldrían
   por debajo de la verdad, que es peor que no dar ninguna: quien las lea se las
   creería. Sin nutrición tampoco entra en el menú automático ni pasa por el
   filtro de alérgenos, porque de ella no se sabe del todo qué lleva. */
export const sinNutricion = (r) => !r?.ing?.length || Boolean(r?.ingPendiente?.length);

export function recipeNutrition(recipe, ingIndex) {
  const t = { ...EMPTY_N };
  for (const it of recipe.ing || []) {
    const ing = ingIndex[it.i];
    if (!ing) continue;
    const gr = gramsOf(ing, it.q, it.u) / 100;
    t.kcal += ing.kcal * gr; t.p += ing.p * gr; t.c += ing.c * gr;
    t.az += ing.az * gr; t.g += ing.g * gr; t.gs += ing.gs * gr; t.f += ing.f * gr;
  }
  const r = recipe.raciones || 1;
  Object.keys(t).forEach((k) => (t[k] = t[k] / r));
  return t; // por ración
}

export function recipeAllergens(recipe, ingIndex) {
  const s = new Set();
  (recipe.ing || []).forEach((it) => (ingIndex[it.i]?.al || []).forEach((a) => s.add(a)));
  return [...s];
}

/* ============================================================
   Coste del menú, por rangos (PLAN-PRECIOS.md)

   El precio es por categoría del ingrediente —o el que haya escrito quien
   usa la aplicación, que manda sobre la media (`precioDe`)—, no por producto — con eso hay precio para el 100 % de la tabla desde el
   primer día, así que aquí no hace falta un "sin coste" como sí hace
   falta sinNutricion(): siempre hay un número, aunque sea provisional
   (PRECIOS_META.confirmado lo avisa mientras no venga del informe leído
   a mano). Por eso se muestra como rango, nunca como cifra suelta: el
   método da un orden de magnitud fiable, no un céntimo exacto.
   ============================================================ */
const CORTES_COSTE = [5, 10, 15]; // € por persona: <5 / 5-10 / 10-15 / >15

export function rangoCoste(euros) {
  if (euros < CORTES_COSTE[0]) return `menos de ${CORTES_COSTE[0]} €`;
  if (euros < CORTES_COSTE[1]) return `${CORTES_COSTE[0]}-${CORTES_COSTE[1]} €`;
  if (euros < CORTES_COSTE[2]) return `${CORTES_COSTE[1]}-${CORTES_COSTE[2]} €`;
  return `más de ${CORTES_COSTE[2]} €`;
}

// coste de una receta para `comensales` personas: euros totales (para sumar
// por toma/día/semana) y precio por persona (para el rango y para el tope
// por comida, que compara siempre por persona, no por el total del plato)
export function recipeCost(recipe, ingIndex, comensales) {
  const factor = comensales / (recipe.raciones || 1);
  let euros = 0;
  for (const it of recipe.ing || []) {
    const ing = ingIndex[it.i];
    if (!ing) continue;
    const gr = gramsOf(ing, it.q, it.u) * factor;
    euros += (gr / 1000) * precioDe(ing).eurosKg;
  }
  const porPersona = comensales > 0 ? euros / comensales : 0;
  return { euros, porPersona, rango: rangoCoste(porPersona) };
}

/**
 * Los dos costes de un día del menú, que no son el mismo número:
 *   `total`      — lo que se paga en la compra, para todos los que comen ese día.
 *   `porPersona` — lo que le cuesta a uno, que no depende de cuántos coman.
 *
 * Salen juntos a propósito. El fallo que arreglan fue enseñar el total al lado
 * de las kcal del día, que van por persona: con el tope puesto en 5 € por
 * comida, un día de dos platos apareció con 17 € y parecía que el tope no se
 * respetaba, cuando lo que pasaba es que los tres números de esa línea no
 * medían lo mismo. Lo comparable con el tope es siempre `porPersona`.
 *
 * Los rangos se ponen al mostrar, nunca antes (PLAN-PRECIOS.md § 7): sumar
 * rangos no tiene sentido.
 */
export function costeDia(dia, cfg, recipes, ingIndex) {
  const platos = dia?.platos || dia || {};
  let total = 0, porPersona = 0;
  for (const [toma, rid] of Object.entries(platos)) {
    const r = recipes.find((x) => x.id === rid);
    if (!r) continue;
    total += recipeCost(r, ingIndex, dia.comensales?.[toma] ?? cfg.raciones).euros;
    porPersona += recipeCost(r, ingIndex, 1).porPersona;
  }
  return { total, porPersona };
}

/* Lo que suman los platos de un día. La usan el menú, para la cabecera de
   cada día, y Perfiles, para medir la semana contra cada persona. Vive aquí
   porque son dos pantallas mirando el mismo número: la misma cuenta escrita
   dos veces acaba siendo dos cuentas distintas.

   `dia` admite las dos formas que corren por el código —{platos, comensales}
   y el objeto de platos a secas— igual que `costeDia`. */
export function nutricionDia(dia, recipes, ingIndex) {
  const platos = dia?.platos || dia || {};
  const total = { ...EMPTY_N };
  for (const rid of Object.values(platos)) {
    const r = recipes.find((x) => x.id === rid);
    if (!r) continue;
    const n = recipeNutrition(r, ingIndex);
    for (const k of Object.keys(total)) total[k] += n[k];
  }
  return total;
}

/* Sal y aceite no se doblan porque se doble la ración: una receta pensada
   para 2 que pasa a servir a 4 no lleva el doble de aceite del sofrito ni el
   doble de sal, se corrige a ojo con bastante menos que el doble. El resto de
   ingredientes —el pollo, la verdura, el arroz— sí escala tal cual, así que
   el amortiguado es solo para estas dos categorías, no una regla general. */
const CATEGORIAS_A_OJO = new Set(["especia", "aceite y grasas"]);
const EXPONENTE_A_OJO = 0.6; // doblar la ración deja esto en +52 %, no en +100 %

// cantidad escalada, redondeada de forma legible. `cat` es la categoría del
// ingrediente (`ingIndex[it.i]?.cat`); sin ella escala tal cual, como antes.
export function scaledQty(q, factor, unit, cat) {
  const f = CATEGORIAS_A_OJO.has(cat) ? factor ** EXPONENTE_A_OJO : factor;
  const v = q * f;
  if (unit === "g" || unit === "ml") return Math.round(v);
  if (v >= 10) return Math.round(v);
  return Math.round(v * 4) / 4;
}

export const fmt = (n, d = 0) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString("es-ES");
export const uid = () => Math.random().toString(36).slice(2, 9);

// proteína principal de una receta, para no repetirla en la semana
function mainProtein(recipe, ingIndex) {
  let best = null, bestG = 0;
  for (const it of recipe.ing) {
    const ing = ingIndex[it.i];
    if (!ing) continue;
    if (!["carne", "pescado", "marisco", "huevos", "legumbre"].includes(ing.cat) && ing.id !== "caballa" && ing.id !== "melva") continue;
    const gr = gramsOf(ing, it.q, it.u);
    if (gr > bestG) { bestG = gr; best = ing.id; }
  }
  return best;
}

/* ============================================================
   Los filtros duros: quién quita recetas del montón

   En el generador hay dos clases de filtro y solo una se nota. Los **duros**
   arman el montón antes de repartir: si dejan cuatro recetas, con cuatro se
   hace la semana entera y el plato se repite sí o sí. Los **blandos** son
   puntos dentro del reparto: cuando no hay material, ceden sin decir nada.

   La lista de los duros vive aquí, en un sitio y no en tres, para que el
   generador y la pantalla contesten lo mismo: `generateMenu` arma el montón
   con esto, el panel pone el número al lado de cada opción con esto, y el
   aviso de un plato elegido a mano dice con esto qué filtro se está saltando.
   Antes cada uno lo habría calculado por su cuenta, y era cuestión de tiempo
   que dejaran de coincidir.
   ============================================================ */

/* Los duros que el usuario puede apagar, con cómo se apagan. Los alérgenos
   están en la lista porque hay que poder explicar que son ellos los que han
   dejado el recetario en cuatro recetas, pero llevan `quitable: false`: una
   alergia no se «quita» desde un botón de sugerencia. */
export const FILTROS_DUROS = [
  { clave: "metodo", quitable: true,
    activo: (c) => c.metodo === "thermomix" || c.metodo === "tradicional",
    nombre: (c) => `el método ${c.metodo}`,
    apagar: (c) => ({ ...c, metodo: "indiferente" }) },
  { clave: "limiteComida", quitable: true,
    activo: (c) => Boolean(c.limiteComida),
    nombre: (c) => `el tope de ${c.limiteComida} € por comida`,
    apagar: (c) => ({ ...c, limiteComida: null }) },
  { clave: "minRating", quitable: true,
    activo: (c) => c.minRating > 0,
    nombre: (c) => `la puntuación mínima de ${c.minRating} estrella${c.minRating === 1 ? "" : "s"}`,
    apagar: (c) => ({ ...c, minRating: 0 }) },
  { clave: "incluirSinValorar", quitable: true,
    activo: (c) => !c.incluirSinValorar,
    nombre: () => "dejar fuera las recetas sin valorar",
    apagar: (c) => ({ ...c, incluirSinValorar: true }) },
  { clave: "ingredientesVetados", quitable: true,
    activo: (c) => Boolean(c.ingredientesVetados?.length),
    nombre: (c) => c.ingredientesVetados.length === 1
      ? "el ingrediente que has vetado"
      : `los ${c.ingredientesVetados.length} ingredientes que has vetado`,
    apagar: (c) => ({ ...c, ingredientesVetados: [] }) },
  { clave: "alergenos", quitable: false,
    activo: (c) => Boolean(c.alergenos?.length),
    nombre: (c) => c.alergenos.length === 1
      ? `el alérgeno ${c.alergenos[0]}`
      : `los ${c.alergenos.length} alérgenos que has quitado`,
    apagar: (c) => ({ ...c, alergenos: [] }) },
];

/**
 * Por qué esta receta no entra en el menú con estos ajustes. Lista vacía =
 * entra. Devuelve todos los motivos, no el primero: si eliges un plato a mano
 * y se salta dos filtros, hay que poder decir los dos.
 */
export function motivosFuera(r, cfg, ingIndex) {
  const fuera = [];
  // sin ingredientes en la tabla no hay kcal ni alérgenos: no se reparte a ciegas
  if (sinNutricion(r)) fuera.push({ clave: "nutricion", texto: "le faltan ingredientes por identificar" });
  if (r.rating > 0 && r.rating < cfg.minRating)
    fuera.push({ clave: "minRating", texto: `tiene ${r.rating} estrella${r.rating === 1 ? "" : "s"}` });
  if (r.rating === 0 && !cfg.incluirSinValorar)
    fuera.push({ clave: "incluirSinValorar", texto: "está sin valorar" });
  const vetados = (r.ing || []).filter((it) => (cfg.ingredientesVetados || []).includes(it.i));
  if (vetados.length)
    fuera.push({ clave: "ingredientesVetados", texto: `lleva ${vetados.map((it) => ingIndex[it.i]?.n || it.i).join(", ")}` });
  const al = recipeAllergens(r, ingIndex).filter((a) => (cfg.alergenos || []).includes(a));
  if (al.length) fuera.push({ clave: "alergenos", texto: `lleva ${al.join(", ")}` });
  /* El método es simétrico: «thermomix» deja fuera lo que no tiene versión
     para la máquina, y «tradicional» lo que no tiene pasos a mano. Hoy casi
     todas llevan pasos, así que «tradicional» apenas descarta; «thermomix»,
     en cambio, deja el recetario en una decena escasa. */
  if (cfg.metodo === "thermomix" && !r.tmx?.length)
    fuera.push({ clave: "metodo", texto: "no tiene versión para Thermomix" });
  if (cfg.metodo === "tradicional" && !r.pasos?.length)
    fuera.push({ clave: "metodo", texto: "no tiene pasos a mano" });
  // tope por comida (D·4, Fase 3a): el precio por persona no depende de
  // cuántos coman — sube o baja la ración, pero no la proporción — así
  // que vale comparar con cualquier `comensales` positivo, no hace falta
  // saber todavía los de este día concreto
  if (cfg.limiteComida && recipeCost(r, ingIndex, 1).porPersona > cfg.limiteComida)
    fuera.push({ clave: "limiteComida", texto: `pasa del tope de ${cfg.limiteComida} € por persona` });
  return fuera;
}

/** El montón del que sale el menú con estos ajustes. */
export const poolRecetas = (cfg, recipes, ingIndex) =>
  recipes.filter((r) => motivosFuera(r, cfg, ingIndex).length === 0);

/**
 * Cuánto material queda y quién se está llevando por delante el recetario.
 *
 * El culpable se calcula quitando cada filtro por separado y viendo cuál
 * devuelve más recetas. Se nombra **uno solo**, el que más pesa: una lista de
 * seis sospechosos no es una respuesta, es otra pantalla de ajustes.
 *
 * `aprieta` se mira por toma, no en total, porque el total engaña: puede
 * haber cuarenta recetas de comida y una sola de cena, y con ese montón
 * «grande» repetirse la misma cena siete veces. Los huecos ya fijados con el
 * candado no cuentan: esos no los elige el generador.
 */
export function diagnosticoFiltros(cfg, recipes, ingIndex, pinned = {}) {
  const pool = poolRecetas(cfg, recipes, ingIndex);

  const porToma = {};
  for (const toma of cfg.tomas) {
    const hay = pool.filter((r) => r.tomas.includes(toma)).length;
    let huecos = 0;
    for (let d = 0; d < cfg.dias; d++) {
      if (comensalesDelDia(cfg, nombreDia(cfg, d), toma) <= 0) continue;
      if (pinned[`${d}-${toma}`]) continue;
      huecos++;
    }
    porToma[toma] = { hay, huecos, aprieta: huecos > 0 && hay < huecos };
  }
  const aprieta = Object.values(porToma).some((t) => t.aprieta);

  let culpable = null;
  if (aprieta) {
    for (const f of FILTROS_DUROS) {
      if (!f.activo(cfg)) continue;
      const sinEl = poolRecetas(f.apagar(cfg), recipes, ingIndex).length;
      const gana = sinEl - pool.length;
      if (gana > 0 && (!culpable || gana > culpable.gana))
        culpable = { clave: f.clave, quitable: f.quitable, nombre: f.nombre(cfg), apagar: f.apagar, sinEl, gana };
    }
  }
  return { total: pool.length, porToma, aprieta, culpable };
}

/* ============================================================
   Generador de menú
   ============================================================ */
// nombre del día real de la posición `d` dentro del menú, según dónde empiece
// la semana (cfg.diaInicio, PLAN-MENU.md § 2) — sustituye a DIAS[d] a secas
export const nombreDia = (cfg, d) => DIAS[((cfg.diaInicio || 0) + d) % 7];

// comensales de una toma en un día de la semana: la excepción de patrón si
// existe (§ 3, capa 1), si no el valor por defecto. Única fuente de verdad,
// la usan tanto generateMenu como el panel de ajuste en Menu.jsx.
export const comensalesDelDia = (cfg, nDia, toma) => cfg.comensalesExcepciones?.[nDia]?.[toma] ?? cfg.raciones;

/* La referencia de un adulto medio, a la que se apunta cuando nadie ha dicho
   a quién se le cocina. Estaba escrita dentro del generador y no salía de
   ahí, así que la pantalla no tenía forma de nombrarla y prefería cerrar la
   puerta: sin perfiles no se dejaba armar la semana. Ahora se exporta, porque
   un objetivo que no se dice en voz alta se lee como un objetivo tuyo. */
export const OBJETIVO_GENERAL = { kcal: 2000, p: 100 };

/* A qué apunta el generador: al promedio de los perfiles elegidos, y si no hay
   ninguno, a la referencia general. Fuera del bucle para que la pantalla pueda
   enseñarlo y las pruebas comprobarlo — antes vivía dentro y no era ni una cosa
   ni la otra. */
export function objetivoDelMenu(perfiles = []) {
  if (!perfiles.length) return { ...OBJETIVO_GENERAL };
  return {
    kcal: perfiles.reduce((a, p) => a + Number(p.kcal || 0), 0) / perfiles.length,
    p: perfiles.reduce((a, p) => a + Number(p.prot || 0), 0) / perfiles.length,
  };
}

export function generateMenu(cfg, recipes, ingIndex, pinned = {}) {
  const targets = objetivoDelMenu(cfg.perfiles);

  const pool = poolRecetas(cfg, recipes, ingIndex);

  const pesoTotal = cfg.tomas.reduce((a, t) => a + TOMA_PESO[t], 0) || 1;
  const usados = []; // [{id, dia}]
  const proteinasSemana = {};
  const dias = [];

  /* Los criterios del usuario (`lib/criterios.js`) miran el menú entero, no
     el plato: «como mucho dos comidas con carne roja» necesita saber cuántas
     van y cuántas quedan. `historial` son las ya colocadas y `huecos` las que
     faltan; los rasgos de cada receta se calculan una vez y se guardan,
     porque el bucle recorre el recetario entero por cada comida. */
  const historial = [];
  const rasgos = new Map();
  const rasgosDe = (r) => {
    if (!rasgos.has(r.id)) rasgos.set(r.id, rasgosDeReceta(r, ingIndex));
    return rasgos.get(r.id);
  };
  let huecos = 0;
  for (let d = 0; d < cfg.dias; d++) {
    const nDia = nombreDia(cfg, d);
    for (const toma of cfg.tomas) if (comensalesDelDia(cfg, nDia, toma) > 0) huecos++;
  }

  for (let d = 0; d < cfg.dias; d++) {
    const nDia = nombreDia(cfg, d);
    const diaSemana = ((cfg.diaInicio || 0) + d) % 7;
    const finde = diaSemana === 5 || diaSemana === 6; // sábado/domingo reales, no posición 5/6
    const maxT = finde ? cfg.tiempoFinde : cfg.tiempoDiario;
    const platos = {};
    const comensales = {};
    for (const toma of cfg.tomas) {
      // patrón de comensales (§ 3, capa 1): con 0, esta toma no se come ese
      // día — se salta sin buscar receta, como si no estuviera en cfg.tomas
      const comens = comensalesDelDia(cfg, nDia, toma);
      comensales[toma] = comens;
      if (comens <= 0) { platos[toma] = null; continue; }

      /* Una receta fijada con el candado cuenta **para todo** igual que una
         elegida por el generador: para los criterios, para la rotación de
         proteínas y para el «no repetir». Durante un tiempo solo contaba
         para los criterios, y el efecto era desconcertante desde fuera:
         fijabas el bacalao el lunes y el martes te lo volvía a proponer,
         porque `usados` no se había enterado de que existía. Lo que el
         usuario pone en la semana es parte de la semana. */
      const laFijada = pinned[`${d}-${toma}`] && recipes.find((r) => r.id === pinned[`${d}-${toma}`]);
      if (laFijada) {
        platos[toma] = laFijada.id;
        huecos = Math.max(0, huecos - 1);
        historial.push({ d, rasgos: rasgosDe(laFijada) });
        usados.push({ id: laFijada.id, dia: d });
        const protFijada = mainProtein(laFijada, ingIndex);
        if (protFijada) proteinasSemana[protFijada] = (proteinasSemana[protFijada] || 0) + 1;
        continue;
      }

      const objetivoKcal = (targets.kcal * TOMA_PESO[toma]) / pesoTotal;
      const objetivoP = (targets.p * TOMA_PESO[toma]) / pesoTotal;
      const cands = pool.filter((r) => r.tomas.includes(toma) && r.min <= maxT);
      const lista = cands.length ? cands : pool.filter((r) => r.tomas.includes(toma));
      if (!lista.length) { platos[toma] = null; continue; }

      let mejor = null, mejorScore = -Infinity;
      for (const r of lista) {
        const n = recipeNutrition(r, ingIndex);
        let s = 0;
        s -= (Math.abs(n.kcal - objetivoKcal) / Math.max(objetivoKcal, 1)) * 60;
        s -= Math.max(0, objetivoP - n.p) * 1.6;
        s += r.rating * 6;
        if (cfg.metodo === "thermomix" && r.tmx) s += 8;
        /* El «no repetir en N días» penaliza, no prohíbe: con el montón en
           cuatro recetas, prohibir dejaría huecos vacíos y eso no le sirve a
           nadie. Pero la penalización tiene que **acumular**. Cuando era
           plana — un −100 igual para la usada una vez y para la usada cinco —
           bastaba con que todos los candidatos la llevaran para que el término
           dejara de ordenar nada: volvía a mandar el encaje nutricional y salía
           siempre el mismo plato. Acumulando, entre dos ya penalizadas gana la
           menos gastada, y el menú rota por lo que de verdad hay. */
        const repes = usados.filter((u) => u.id === r.id && d - u.dia < cfg.noRepetir).length;
        if (repes) s -= 100 * repes;
        const prot = mainProtein(r, ingIndex);
        if (prot) s -= (proteinasSemana[prot] || 0) * 12;
        if (Object.values(platos).includes(r.id)) s -= 200;
        s += puntuarCriterios(rasgosDe(r), cfg, historial, d, huecos);
        s += Math.random() * 8;
        if (s > mejorScore) { mejorScore = s; mejor = r; }
      }
      platos[toma] = mejor?.id || null;
      huecos = Math.max(0, huecos - 1);
      if (mejor) {
        usados.push({ id: mejor.id, dia: d });
        historial.push({ d, rasgos: rasgosDe(mejor) });
        const prot = mainProtein(mejor, ingIndex);
        if (prot) proteinasSemana[prot] = (proteinasSemana[prot] || 0) + 1;
      }
    }
    dias.push({ platos, comensales });
  }
  return dias;
}

// `racionesPorDefecto` solo entra cuando un día no trae su propio
// `comensales` (menú guardado antes de esta versión) — con menú nuevo, cada
// plato escala a los comensales reales de su día y su toma (PLAN-MENU.md § 3).
export function shoppingList(menu, recipes, ingIndex, racionesPorDefecto) {
  const acc = {};
  menu.forEach((dia) => {
    const platos = dia.platos || dia; // compat: forma antigua, sin envolver
    Object.entries(platos).forEach(([toma, rid]) => {
      const r = recipes.find((x) => x.id === rid);
      if (!r) return;
      const comensales = dia.comensales?.[toma] ?? racionesPorDefecto;
      const f = comensales / (r.raciones || 1);
      r.ing.forEach((it) => {
        const ing = ingIndex[it.i];
        if (!ing) return;
        acc[it.i] = (acc[it.i] || 0) + gramsOf(ing, it.q, it.u) * f;
      });
    });
  });
  const porCat = {};
  Object.entries(acc).forEach(([id, gr]) => {
    const ing = ingIndex[id];
    if (!ing) return;
    (porCat[ing.cat] = porCat[ing.cat] || []).push({ ing, gr });
  });
  Object.values(porCat).forEach((l) => l.sort((a, b) => a.ing.n.localeCompare(b.ing.n)));
  return porCat;
}

/* La misma compra, contada por receta en vez de por categoría. Sirve para lo
   contrario que la de arriba: aquella es para el supermercado —todo el tomate
   junto, un pasillo, una parada— y esta para la cocina, para saber qué hace
   falta para un plato concreto y qué se puede dejar para otro día.

   Una receta que se repite en la semana sale una sola vez, con la suma: es lo
   que hay que comprar de ella, y verla dos veces obligaría a sumar a mano. */
export function compraPorReceta(menu, recipes, ingIndex, racionesPorDefecto) {
  const porReceta = {};
  menu.forEach((dia) => {
    const platos = dia.platos || dia; // compat: forma antigua, sin envolver
    Object.entries(platos).forEach(([toma, rid]) => {
      const r = recipes.find((x) => x.id === rid);
      if (!r) return;
      const comensales = dia.comensales?.[toma] ?? racionesPorDefecto;
      const f = comensales / (r.raciones || 1);
      const acc = (porReceta[r.n] = porReceta[r.n] || {});
      r.ing.forEach((it) => {
        if (!ingIndex[it.i]) return;
        acc[it.i] = (acc[it.i] || 0) + gramsOf(ingIndex[it.i], it.q, it.u) * f;
      });
    });
  });
  const salida = {};
  Object.keys(porReceta).sort((a, b) => a.localeCompare(b)).forEach((nombre) => {
    salida[nombre] = Object.entries(porReceta[nombre])
      .map(([id, gr]) => ({ ing: ingIndex[id], gr }))
      .sort((a, b) => a.ing.n.localeCompare(b.ing.n));
  });
  return salida;
}

/* La semana recortada a las tomas elegidas ahora. El menú guardado conserva
   las que tenía al generarse, y si después se quita una —la cena, por ejemplo—
   sus platos dejan de pintarse pero seguían sumando en las kcal del día y en la
   compra. Vivía dentro de la vista del menú; está aquí porque la lista de la
   compra necesita exactamente la misma semana y dos recortes distintos son dos
   compras distintas.

   `comensales` viaja aparte de `platos` (no como una toma más) para que nada
   que recorra las tomas de un día no lo confunda con un plato. */
export const menuVisibleDe = (menu, tomas) =>
  (menu || []).map((dia) => {
    const platos = dia.platos || dia;
    return {
      platos: Object.fromEntries(tomas.filter((t) => platos[t]).map((t) => [t, platos[t]])),
      comensales: dia.comensales || {},
    };
  });

export const displayAmount = (ing, gr) => {
  if (ing.cv?.ud && gr / ing.cv.ud >= 0.8) return `${fmt(Math.round((gr / ing.cv.ud) * 2) / 2, 1)} ud · ${fmt(gr)} g`;
  if (ing.cat === "especia") return "al gusto";
  return `${fmt(gr)} g`;
};

/* ============================================================
   Texto para compartir (PLAN-COMPRA.md § 2) — plano, agrupado por
   categoría/día, para pegarlo donde sea: WhatsApp, un mensaje, una nota.
   ============================================================ */
// lo marcado como «ya en casa» no se incluye: si ya lo tienes, no hace
// falta que quien compra lo lea en la lista
export function textoCompra(compra, enCasa, { porReceta = false } = {}) {
  const bloques = Object.entries(compra)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([rotulo, items]) => {
      const faltan = items.filter(({ ing }) => !enCasa.has(ing.id));
      if (!faltan.length) return null;
      const lineas = faltan.map(({ ing, gr }) => `• ${ing.n} — ${displayAmount(ing, gr)}`).join("\n");
      /* Las categorías van en mayúscula porque son rótulos de un armario;
         un nombre de receta en mayúscula se lee como si se estuviera gritando. */
      return `${porReceta ? rotulo : rotulo.toUpperCase()}\n${lineas}`;
    })
    .filter(Boolean);
  if (!bloques.length) return "Lista de la compra: no falta nada, ya está todo en casa.";
  return `Lista de la compra\n\n${bloques.join("\n\n")}`;
}

// qué se come cada día — silencia las tomas sin plato (no se come esa toma,
// o no se encontró receta): no hace falta anunciar lo que no hay
export function textoMenu(cfg, menuVisible, recipes) {
  const dias = menuVisible
    .map((dia, di) => {
      const lineas = cfg.tomas
        .map((t) => {
          const r = recipes.find((x) => x.id === dia.platos[t]);
          return r ? `  ${t}: ${r.n}` : null;
        })
        .filter(Boolean);
      return lineas.length ? `${nombreDia(cfg, di)}\n${lineas.join("\n")}` : null;
    })
    .filter(Boolean);
  if (!dias.length) return "Menú de la semana: todavía no hay ningún plato.";
  return `Menú de la semana\n\n${dias.join("\n\n")}`;
}
