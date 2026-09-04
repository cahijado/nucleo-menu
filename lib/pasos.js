/* ---------- El tiempo de una receta, por pasos ----------
   Los pasos de una receta son texto y nada más en casi toda la aplicación
   —así los lee la cocina paso a paso, así se exportan a Cookidoo, así se le
   piden a la IA—, y ese formato no cambia aquí. El minuto de cada paso vive
   aparte, en `pasosMin`, en el mismo orden que `pasos`: si una receta no lo
   trae, `pasosMin` está vacío y todo sigue exactamente como antes.

   Solo el formulario de edición y la ficha de la receta miran este fichero. */

/**
 * Cuánto suman los pasos que sí llevan un tiempo.
 *
 * `null` si ninguno lo lleva: es la señal de que el tiempo total lo sigue
 * escribiendo a mano quien edita, como siempre. En cuanto un paso lleva
 * minutos, deja de ser una cifra suelta y pasa a ser la suma — y el
 * formulario, al verla, deja de dejarla tocar a mano.
 */
export function tiempoTotalPasos(pasosMin = []) {
  const algunoConTiempo = pasosMin.some((m) => m !== null && m !== undefined && m !== "");
  if (!algunoConTiempo) return null;
  return pasosMin.reduce((suma, m) => suma + (Number(m) || 0), 0);
}
