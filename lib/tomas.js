/* ============================================================
   Coherencia de tomas: que «cena» siga queriendo decir cena

   Quien escribe la receta dice a grandes rasgos en qué comidas encaja
   («Comida o cena.», «Cena.»...), pero esa declaración no sabe de kcal,
   de grasa saturada ni de cuántos pasos lleva el plato. Estas reglas
   afinan esa declaración con lo que sí se puede calcular, y las aplica
   el taller (`aReceta`, en `herramientas/taller.mjs`) cada vez que una
   receta entra o se corrige — así la regla vive en un solo sitio y no
   hace falta acordarse de repetirla a mano cada vez que cambia una
   receta o entra una nueva.

   Los números salen de un repaso del recetario real (241 recetas de
   casa), no de una tabla nutricional, y quedan fijados como constantes:
   no se recalculan en cada pasada, porque una cena no debería dejar de
   serlo solo porque alguien añadió al otro lado del recetario una
   receta nueva y muy grasienta que desplaza el percentil.
   ============================================================ */

// cena: tope de aporte. Es lo más alto que puede dar, no un mínimo.
export const CENA_KCAL_MAX = 500;

// proxy de dificultad digestiva: no hay etiqueta de «frito» ni «rebozado»
// en el recetario (solo el método de cocinado), así que se usa la grasa
// saturada por ración. Este número es el percentil 85 del recetario real:
// por encima caen las croquetas, el cordon bleu, las milanesas...
export const CENA_GS_MAX = 29.1;

// proxy de elaboración sencilla: pasos a mano, o instrucciones de
// Thermomix si la receta no los tiene. No se usa el campo `dificultad`:
// es autodeclarado, y casi todas las recetas dicen «fácil» sin que nadie
// lo haya comprobado de verdad.
export const CENA_PASOS_MAX = 8;

// comida generosa: a partir de aquí, una cena también sirve de comida.
// Son la mediana de kcal y de proteína del recetario real.
export const COMIDA_KCAL_MIN = 474;
export const COMIDA_PROT_MIN = 28;

/** Pasos de una receta ya leída: los de a mano, o los de Thermomix si no hay otros. */
export const pasosDe = (receta) => Math.max(receta.pasos?.length || 0, receta.tmx?.length || 0);

/**
 * Las tomas de una receta, corregidas con lo que se puede calcular.
 *
 * `tomasDeclaradas` es la base —lo que dice el texto o ha contestado
 * quien escribe—; `n` es su nutrición por ración (`recipeNutrition`) y
 * `pasos`, su número de pasos (`pasosDe`).
 *
 * Nunca AÑADE cena a lo que no la llevaba ya declarada: eso sigue siendo
 * cosa de quien escribe, no algo que se adivine por el aporte. Sí hace
 * dos cosas solas: sumar comida a una cena generosa en kcal o proteína,
 * y quitar cena a lo que se pase de aporte, de grasa saturada o de
 * pasos. Si al quitar cena no queda ninguna toma, se deja al menos
 * «comida»: ninguna receta se queda sin sitio donde entrar.
 */
export function tomasCoherentes(tomasDeclaradas, n, pasos) {
  const tomas = new Set(tomasDeclaradas || []);

  if (tomas.has("cena") && !tomas.has("comida") && (n.kcal >= COMIDA_KCAL_MIN || n.p >= COMIDA_PROT_MIN)) {
    tomas.add("comida");
  }
  if (tomas.has("cena") && (n.kcal > CENA_KCAL_MAX || n.gs >= CENA_GS_MAX || pasos > CENA_PASOS_MAX)) {
    tomas.delete("cena");
  }
  if (tomas.size === 0) tomas.add("comida");

  return [...tomas];
}
