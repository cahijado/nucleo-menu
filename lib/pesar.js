/* ============================================================
   De una cantidad y una unidad, a gramos

   Vivía dentro de `mapear.mjs`, donde solo servía para preparar los datos.
   Sale aquí porque ahora también lo usa el navegador al leer una receta
   pegada, y dos copias de esta tabla acabarían diciendo cosas distintas.

   Devuelve además DE DÓNDE sale el peso, que no es un adorno: no es lo mismo
   «250 ml» —que son 250 g y no hay más que hablar— que «1 taza de queso
   rallado», donde 240 g es el peso de una taza de agua y del queso rallado no
   se sabe nada. Quien lee una receta pegada tiene que poder distinguirlas para
   preguntar solo por la segunda.
   ============================================================ */
import { DEFAULT_CONV } from "../data/constants.js";
import { A_GRAMOS } from "./vocabulario.js";
import { A_OJO } from "./diccionario.js";

/* medidas caseras que la tabla general no recoge, en gramos */
export const CASERAS = {
  vaso: 200, copa: 100, botella: 750, rebanada: 30, rodaja: 30, rama: 3,
  /* El manojo genérico es el de una hierba, que es el manojo que más se
     escribe. Los que pesan otra cosa lo dicen en su `cv`: un manojo de
     espárragos son 500 g y no 30, y con un solo número para todos la receta
     entraba con medio kilo de menos sin que nadie se enterara. Lo que caiga
     aquí sale marcado como «genérica», que es lo que es. */
  manojo: 30, chorro: 15, gota: 1, paquete: 250, bolsa: 250, tarro: 200,
  bote: 200, sobre: 8, filete: 120, medida: 200, punado: 30,
  /* `pastilla` no lleva número general a propósito. Los cuatro caldos la
     tienen en su `cv` valiendo 500 —una pastilla hace medio litro— y ahí es
     donde el número significa algo. Suelta no significa nada: una pastilla de
     caldo pesa 10 g y una de chocolate, cinco, y no son la misma cosa ni de
     lejos. Sin número general, lo que no sea un caldo se pregunta. */
};

/**
 * Gramos que suponen una cantidad y una unidad para un alimento concreto.
 *
 * `origen` dice con cuánta confianza:
 *   "medida"   — la receta daba peso o volumen: exacto.
 *   "propia"   — lo dice la tabla para ESE alimento (`cv`): fiable.
 *   "cuenta"   — piezas por el peso medio de una: «2 calabacines».
 *   "generica" — una medida de cocina aplicada a todos por igual: aproximado.
 *   "a ojo"    — la receta no daba cantidad y es de las que se echan a ojo.
 *
 * `g` es null cuando no hay forma honrada de saberlo, y entonces la receta se
 * queda incompleta en lugar de inventarse una cifra.
 */
export function pesar({ cantidad, unidad }, ing) {
  if (!cantidad) {
    const aOjo = A_OJO[ing.id];
    return aOjo == null ? { g: null, origen: "" } : { g: aOjo, origen: "a ojo" };
  }
  if (A_GRAMOS[unidad]) return { g: cantidad * A_GRAMOS[unidad], origen: "medida" };
  if (!unidad) {
    // contar sin unidad solo vale si la tabla sabe lo que pesa una pieza de ese
    // alimento; si no, «16 placas de canelones» se convertía en 1,6 kg de pasta
    if (ing.cv?.ud) return { g: cantidad * ing.cv.ud, origen: "cuenta" };
    // los condimentos se cuentan por cucharadas aunque no lo digan
    return A_OJO[ing.id] ? { g: cantidad * A_OJO[ing.id], origen: "a ojo" } : { g: null, origen: "" };
  }
  const clave = unidad === "punado" ? "puñado" : unidad;
  const propia = ing.cv?.[clave] ?? ing.cv?.[unidad];
  if (propia) return { g: cantidad * propia, origen: "propia" };
  const generica = DEFAULT_CONV[clave] ?? CASERAS[unidad];
  return generica ? { g: cantidad * generica, origen: "generica" } : { g: null, origen: "" };
}

/** Solo los gramos, para quien no necesite saber de dónde salen. */
export const aGramos = (item, ing) => pesar(item, ing).g;
