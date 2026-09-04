import { DEFAULT_CONV } from "../data/constants.js";

/* Los gramos que hay de un ingrediente en una receta. Vive aparte de
   `nutrition.js` porque lo necesitan los dos lados del generador —el cálculo
   nutricional y los criterios del menú— y ponerlo en uno de ellos dejaba a
   los dos importándose el uno al otro. */
export const gramsOf = (ing, q, u) => {
  if (!ing) return 0;
  if (u === "g") return q;
  const conv = ing.cv?.[u] ?? DEFAULT_CONV[u] ?? 1;
  return q * conv;
};
