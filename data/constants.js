/* ---------- unidades ---------- */
export const UNITS = ["g", "ml", "ud", "cda", "cdta", "puñado", "loncha", "diente", "hoja", "lata", "pizca", "taza"];
export const DEFAULT_CONV = { g: 1, ml: 1, ud: 100, cda: 15, cdta: 5, "puñado": 30, loncha: 20, diente: 4, hoja: 40, lata: 80, pizca: 0.4, taza: 240 };

export const ALLERGENS = ["gluten", "lácteos", "huevo", "pescado", "marisco", "frutos secos", "soja", "sésamo", "mostaza"];

/* ---------- dietas ----------

   Los alérgenos de arriba NO se escriben: se calculan. `recipeAllergens()` los
   deriva de los alimentos de la receta, y por eso el filtro «sin gluten» es de
   fiar aunque nadie se haya acordado de etiquetar nada.

   Estas son otra cosa. La tabla de alimentos no sabe cuánta fructosa lleva una
   manzana ni cuánta histamina un queso curado, así que no hay de dónde
   derivarlas: las declara quien escribe la receta, y la aplicación las enseña
   diciendo que las declara una persona. Esa diferencia se mantiene a la vista
   en todas partes, porque no es lo mismo un dato calculado que una afirmación.

   La lista es cerrada a propósito. Si valiera cualquier texto, «baja en
   fructosa» y «Baja en Fructosa» serían dos etiquetas distintas y el filtro
   dejaría fuera media docena de recetas sin decir por qué. Para añadir una
   dieta nueva se escribe aquí y ya está en el taller y en el buscador. */
export const DIETAS = [
  "baja en fructosa",
  "baja en histamina",
  "baja en FODMAP",
  "baja en lactosa",
  "baja en purinas",
  "baja en sal",
];
export const CATEGORIES = ["verdura", "fruta", "carne", "pescado", "marisco", "huevos", "lácteos", "legumbre", "cereal", "conserva", "aceite y grasas", "especia", "otros"];
export const TOMAS = ["desayuno", "almuerzo", "comida", "merienda", "cena"];
export const TOMA_PESO = { desayuno: 0.2, almuerzo: 0.1, comida: 0.35, merienda: 0.1, cena: 0.25 };
export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

