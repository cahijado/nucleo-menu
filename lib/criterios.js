import { grupoNutricional, familiaHidrato, NOMBRE_FAMILIA } from "../data/grupos.js";
import { gramsOf } from "./gramos.js";

/* ============================================================
   Los criterios del menú: lo que el usuario le pide al generador

   Hasta aquí el generador solo sabía no repetir la misma receta y no repetir
   el mismo ingrediente proteico. Con eso, nada impedía carne roja siete días
   seguidos si era de siete animales distintos, ni pasta en todas las comidas
   si eran siete pastas diferentes — la penalización miraba el ingrediente,
   no el papel que hace en la dieta.

   Esto se apoya en los grupos nutricionales (`data/grupos.js`) y añade la
   familia de hidratos, que es el escalón que hacía falta para distinguir la
   pasta del arroz siendo los dos «cereal refinado».

   IMPORTANTE, y hay que decirlo también en pantalla: **los números los elige
   el usuario**. Aquí no hay ninguna recomendación oficial. Las frecuencias de
   AESAN y del RD 315/2025, con sus fuentes, son otra tarea del plan y llegarán
   como un juego de valores sugeridos, marcados como tales.

   Ninguno de estos criterios descarta recetas: penalizan fuerte al puntuar.
   Si se filtrase, un criterio imposible dejaría comidas vacías sin explicar
   por qué. En vez de eso el generador hace lo que puede y `evaluarCriterios`
   dice después, sobre el menú ya hecho, cuáles no ha conseguido cumplir.
   ============================================================ */

/* Gramos por ración a partir de los cuales se considera que una comida
   «lleva» ese grupo. Sirve para que un sofrito con un taco de panceta no
   cuente como una comida de carne procesada, y para que 15 g de queso rallado
   por encima no cuenten como el lácteo del día. Es un número elegido, no
   medido: se deja a la vista y en un solo sitio. */
export const UMBRAL_PRESENTE = 20;

/* Para hacer de base del plato hace falta bastante más que para estar
   presente: una ración son 70-80 g de pasta o de arroz en seco, 60 de pan,
   250 de patata. Con el umbral de presencia valdrían los 25 g de maicena de
   una crema, y esa crema pasaría a contar como «otro cereal» del día. */
export const UMBRAL_BASE = 40;

/** Gramos por ración de cada grupo nutricional presente en una receta. */
export function gramosPorGrupo(receta, ingIndex) {
  const raciones = receta?.raciones || 1;
  const total = {};
  for (const it of receta?.ing || []) {
    const ing = ingIndex[it.i];
    if (!ing) continue;
    const g = grupoNutricional(ing);
    total[g] = (total[g] || 0) + gramsOf(ing, it.q, it.u) / raciones;
  }
  return total;
}

/** Los grupos que una comida lleva de verdad, no de adorno. */
export function gruposDeReceta(receta, ingIndex) {
  const porGrupo = gramosPorGrupo(receta, ingIndex);
  return new Set(Object.keys(porGrupo).filter((g) => porGrupo[g] >= UMBRAL_PRESENTE));
}

/* La base de hidratos es la familia con más gramos, no cualquiera que
   aparezca: así la cucharada de maicena de una salsa no convierte el plato en
   «otro cereal», y el pan rallado de un rebozado no lo convierte en pan si lo
   que lleva debajo son doscientos gramos de patata. */
export function baseHidrato(receta, ingIndex) {
  const raciones = receta?.raciones || 1;
  const porFamilia = {};
  for (const it of receta?.ing || []) {
    const ing = ingIndex[it.i];
    const fam = familiaHidrato(ing);
    if (!fam) continue;
    porFamilia[fam] = (porFamilia[fam] || 0) + gramsOf(ing, it.q, it.u) / raciones;
  }
  let mejor = null, mejorG = UMBRAL_BASE;
  for (const [fam, g] of Object.entries(porFamilia)) if (g > mejorG) { mejorG = g; mejor = fam; }
  return mejor;
}

const GRUPOS_PROTEICOS = ["pescado_azul", "pescado_blanco", "marisco", "huevo",
  "carne_blanca", "carne_roja", "carne_procesada", "legumbre"];

/** El grupo proteico que manda en la receta, por gramos. */
export function grupoProteico(receta, ingIndex) {
  const porGrupo = gramosPorGrupo(receta, ingIndex);
  let mejor = null, mejorG = 0;
  for (const g of GRUPOS_PROTEICOS) if ((porGrupo[g] || 0) > mejorG) { mejorG = porGrupo[g]; mejor = g; }
  return mejorG >= UMBRAL_PRESENTE ? mejor : null;
}

/** Lo que hay que saber de una receta para juzgarla. Se calcula una vez. */
export function rasgosDeReceta(receta, ingIndex) {
  return {
    grupos: gruposDeReceta(receta, ingIndex),
    base: baseHidrato(receta, ingIndex),
    prot: grupoProteico(receta, ingIndex),
  };
}

/* ---------- el catálogo ---------- */

/* Tres formas de criterio y ya:
     `espaciar` — que no vuelva a salir lo mismo hasta pasados N días.
     `tope`     — como mucho N comidas del menú con ese grupo.
     `minimo`   — al menos N comidas del menú con ese grupo.
   Añadir uno nuevo es añadir una entrada aquí; ni el generador ni el repaso
   posterior ni la pantalla hay que tocarlos. */
export const CRITERIOS = [
  {
    id: "hidrato_dias", tipo: "espaciar", mira: "base",
    etiqueta: "No repetir la misma base de hidratos", unidad: "días",
    opciones: [2, 3, 4], porDefecto: 2,
    ayuda: "Pasta, arroz, patata, pan, masa y legumbre cuentan como familias distintas. Se mira la que más pesa en el plato.",
  },
  {
    id: "proteina_dias", tipo: "espaciar", mira: "prot",
    etiqueta: "No repetir el mismo grupo de proteína", unidad: "días",
    opciones: [2, 3, 4], porDefecto: 2,
    ayuda: "Por grupo, no por animal: el pollo y el pavo son lo mismo aquí, y la ternera y el cerdo también.",
  },
  {
    id: "carne_roja_max", tipo: "tope", grupo: "carne_roja",
    etiqueta: "Carne roja, como mucho", unidad: "comidas",
    opciones: [1, 2, 3, 4], porDefecto: 2,
    ayuda: "Ternera, cerdo, cordero y caza. Lo que no está clasificado cuenta como roja, que es el lado que no engaña.",
  },
  {
    id: "procesada_max", tipo: "tope", grupo: "carne_procesada",
    etiqueta: "Embutidos y carne procesada, como mucho", unidad: "comidas",
    opciones: [0, 1, 2, 3], porDefecto: 1,
    ayuda: "Chorizo, bacón, salchichas, jamón cocido. Cuenta el chorizo de las lentejas, no solo el plato de embutido.",
  },
  {
    id: "pescado_min", tipo: "minimo", grupos: ["pescado_azul", "pescado_blanco", "marisco"],
    etiqueta: "Pescado o marisco, al menos", unidad: "comidas",
    opciones: [2, 3, 4], porDefecto: 3,
    ayuda: "Si el recetario disponible no da para tantas, el menú se hace igual y el repaso lo dice.",
  },
  {
    id: "legumbre_min", tipo: "minimo", grupos: ["legumbre"],
    etiqueta: "Legumbre, al menos", unidad: "comidas",
    opciones: [2, 3, 4], porDefecto: 3,
  },
  {
    id: "verdura_min", tipo: "minimo", grupos: ["verdura"],
    etiqueta: "Verdura de verdad en el plato, al menos", unidad: "comidas",
    opciones: [4, 6, 8, 10], porDefecto: 6,
    ayuda: "Cuenta si la verdura llega a " + UMBRAL_PRESENTE + " g por ración: la hoja de laurel del guiso no vale.",
  },
];

/** «1 comida» y «2 comidas», «1 día» y «3 días». Las unidades se guardan en
    plural y el singular sale de quitarles la ese, que en las dos funciona. */
export function enUnidades(n, unidad) {
  return n + " " + (n === 1 ? String(unidad).replace(/s$/, "") : unidad);
}

/** Los criterios encendidos, con el valor elegido. `cfg.criterios` es
    `{ id: valor }`, y estar ahí es estar encendido. */
export function criteriosActivos(cfg) {
  const puestos = cfg?.criterios || {};
  return CRITERIOS.filter((c) => c.id in puestos).map((c) => ({ def: c, valor: puestos[c.id] }));
}

const gruposDe = (def) => def.grupos || [def.grupo];
const llevaElGrupo = (rasgos, def) => gruposDe(def).some((g) => rasgos.grupos.has(g));

/* ---------- al generar ---------- */

/**
 * Cuánto sube o baja la puntuación de una candidata por los criterios.
 * `historial` son las comidas ya colocadas: `[{ d, rasgos }]`.
 * `huecos`, cuántas comidas quedan por colocar, esta incluida.
 */
export function puntuarCriterios(rasgos, cfg, historial, d, huecos) {
  let s = 0;
  for (const { def, valor } of criteriosActivos(cfg)) {
    if (def.tipo === "espaciar") {
      const suyo = rasgos[def.mira];
      if (!suyo) continue;
      if (historial.some((h) => h.rasgos[def.mira] === suyo && d - h.d < valor)) s -= 130;
      continue;
    }
    const loLleva = llevaElGrupo(rasgos, def);
    if (!loLleva && def.tipo === "minimo") continue;
    const veces = historial.filter((h) => llevaElGrupo(h.rasgos, def)).length;
    if (def.tipo === "tope") {
      if (loLleva && veces >= valor) s -= 160;
      continue;
    }
    /* Cuanto menos margen queda, más manda: al principio es un empujón y en
       las últimas comidas es casi una obligación. Sin esto, un generador que
       va de lunes a domingo llega al viernes sin haber puesto pescado y ya no
       le da tiempo de arreglarlo. */
    const faltan = valor - veces;
    if (faltan > 0) s += 30 + 150 * Math.min(1, faltan / Math.max(huecos, 1));
  }
  return s;
}

/* ---------- el repaso, sobre el menú ya hecho ---------- */

/**
 * Qué ha salido de cada criterio encendido. Por criterio devuelve
 * `{ id, etiqueta, valor, cumplido, resumen, dias }`; `dias` son los índices
 * de día donde está el problema, para que la vista pueda nombrarlos.
 */
export function evaluarCriterios(menu, cfg, recipes, ingIndex) {
  const porId = Object.fromEntries(recipes.map((r) => [r.id, r]));
  const comidas = [];
  (menu || []).forEach((dia, d) => {
    const platos = dia.platos || dia;
    for (const rid of Object.values(platos)) {
      const r = rid && porId[rid];
      if (r) comidas.push({ d, rasgos: rasgosDeReceta(r, ingIndex) });
    }
  });

  return criteriosActivos(cfg).map(({ def, valor }) => {
    const base = { id: def.id, etiqueta: def.etiqueta, unidad: def.unidad, valor };

    if (def.tipo === "espaciar") {
      const choques = [];
      for (let i = 0; i < comidas.length; i++) {
        for (let j = i + 1; j < comidas.length; j++) {
          const a = comidas[i].rasgos[def.mira], b = comidas[j].rasgos[def.mira];
          if (a && a === b && comidas[j].d - comidas[i].d < valor) {
            choques.push({ que: a, dias: [comidas[i].d, comidas[j].d] });
          }
        }
      }
      const comoSeLlama = (x) => (def.mira === "base" ? NOMBRE_FAMILIA[x] || x : nombreGrupo(x));
      return {
        ...base,
        cumplido: choques.length === 0,
        resumen: choques.length === 0
          ? "sin repeticiones"
          : "se repite " + [...new Set(choques.map((c) => comoSeLlama(c.que)))].join(", "),
        dias: [...new Set(choques.flatMap((c) => c.dias))].sort((a, b) => a - b),
      };
    }

    const conElGrupo = comidas.filter((c) => llevaElGrupo(c.rasgos, def));
    const veces = conElGrupo.length;
    if (def.tipo === "tope") {
      return {
        ...base,
        cumplido: veces <= valor,
        resumen: veces + " en el menú",
        dias: veces > valor ? [...new Set(conElGrupo.map((c) => c.d))].sort((a, b) => a - b) : [],
      };
    }
    return {
      ...base,
      cumplido: veces >= valor,
      resumen: veces + " en el menú",
      dias: [],
    };
  });
}

/** Cómo se llama un grupo cuando hay que escribirlo dentro de una frase. */
export function nombreGrupo(g) {
  return {
    verdura: "verdura", fruta: "fruta", legumbre: "legumbre",
    cereal_integral: "cereal integral", cereal_refinado: "cereal refinado",
    tuberculo: "patata", frutos_secos: "frutos secos", pescado_azul: "pescado azul",
    pescado_blanco: "pescado blanco", marisco: "marisco", huevo: "huevo",
    carne_blanca: "carne blanca", carne_roja: "carne roja",
    carne_procesada: "carne procesada", lacteo: "lácteos", aceite: "aceite",
    otros: "otros",
  }[g] || g;
}
