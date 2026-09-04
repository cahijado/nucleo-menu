/* ============================================================
   Grupo nutricional de un alimento (PLAN-NUTRICION.md § 4.1)

   `ing.cat` es una categoría de compra y de cocina: dice en qué pasillo está
   y cómo se cocina, no qué papel juega en la dieta. «Carne» mete en el mismo
   saco una pechuga de pollo y un chorizo, y las tablas de frecuencia de AESAN
   dicen cosas opuestas de las dos.

   Aquí se deriva un grupo más fino, con el mismo patrón que
   `features/batch-cooking/prep-metadata.ts`: una regla por categoría y una
   lista de excepciones por alimento. Así un alimento nuevo entra con un valor
   razonable sin tocar nada, y lo que hay que discutir vive en un solo sitio.

   Los valores por defecto van por el lado que no engaña. La carne sin
   clasificar cuenta como roja, el pescado como blanco y el cereal como
   refinado: si el validador se equivoca, que sea avisando de más y nunca
   apuntándose una ración de lo recomendable que no se ha comido.

   Esto NO valida nada todavía: solo pone la etiqueta. El validador y las
   tablas de frecuencia son el paso siguiente del plan.
   ============================================================ */

/** Los grupos con los que trabajan las tablas de frecuencia. */
export const GRUPOS = [
  "verdura", "fruta", "legumbre", "cereal_integral", "cereal_refinado",
  "tuberculo", "frutos_secos", "pescado_azul", "pescado_blanco", "marisco",
  "huevo", "carne_blanca", "carne_roja", "carne_procesada", "lacteo",
  "aceite", "otros",
];

/** Regla por categoría de compra. Es lo que se aplica si no hay excepción. */
export const GRUPO_POR_CATEGORIA = {
  verdura: "verdura",
  fruta: "fruta",
  legumbre: "legumbre",
  cereal: "cereal_refinado",
  carne: "carne_roja",
  pescado: "pescado_blanco",
  marisco: "marisco",
  huevos: "huevo",
  "lácteos": "lacteo",
  conserva: "verdura",
  "aceite y grasas": "aceite",
  especia: "otros",
  otros: "otros",
};

/* Excepciones por alimento. Cada bloque dice por qué la categoría de compra
   no sirve para lo que se va a hacer con ella. */
export const GRUPO_POR_ALIMENTO = {
  /* Aves y conejo: la categoría dice «carne» y la tabla de frecuencias las
     trata al revés que a la de vacuno o cerdo. */
  pollo_picada: "carne_blanca", pollo_pechuga: "carne_blanca",
  pollo_alitas: "carne_blanca", pollo_muslo: "carne_blanca",
  pollo_entero: "carne_blanca", pavo: "carne_blanca",
  conejo: "carne_blanca", codorniz: "carne_blanca",

  /* Curados, embutidos y fiambres. El jamón cocido está aquí con el chorizo
     no por grasa, sino porque es carne procesada, que es lo que miran las
     recomendaciones. */
  jamon_cocido: "carne_procesada", jamon_serrano: "carne_procesada",
  jamon_iberico: "carne_procesada", lacon: "carne_procesada",
  panceta: "carne_procesada", chorizo: "carne_procesada",
  morcilla: "carne_procesada", sobrasada: "carne_procesada",
  salchicha: "carne_procesada", butifarra: "carne_procesada",
  pastrami: "carne_procesada", foie: "carne_procesada",

  /* Pescado azul: el que las guías piden expresamente una o dos veces por
     semana, incluido el de lata. */
  salmon: "pescado_azul", salmon_ahum: "pescado_azul", sardinas: "pescado_azul",
  boquerones: "pescado_azul", atun: "pescado_azul", trucha: "pescado_azul",
  caballa_fresca: "pescado_azul", caballa: "pescado_azul", melva: "pescado_azul",
  bonito_aceite: "pescado_azul",

  /* Tubérculos: no son verdura para las tablas de frecuencia, y contarlos
     como tal daba por cubierta la verdura del día con unas patatas. */
  patata: "tuberculo", boniato: "tuberculo",

  /* Cereal integral, el único que las guías recomiendan por su nombre. */
  avena: "cereal_integral", quinoa: "cereal_integral", trigo_grano: "cereal_integral",

  /* Harina de legumbre: la categoría dice cereal porque se usa como harina,
     pero es garbanzo. */
  harina_garbanzo: "legumbre",

  /* Bollería y galletas. Son cereal en el pasillo y azúcar en el plato: no
     pueden contar como la ración de cereal del día. */
  galleta_maria: "otros", bizcocho_soletilla: "otros", magdalena: "otros",
  maiz_frito: "otros",

  /* La fruta confitada es azúcar con forma de fruta: no puede contar como
     la pieza de fruta del día. */
  fruta_confitada: "otros",

  /* Frutos secos y semillas, que comparten pasillo con los aceites. */
  nueces: "frutos_secos", almendras: "frutos_secos", cacahuetes: "frutos_secos",
  sesamo: "frutos_secos", pipas_calabaza: "frutos_secos", chia: "frutos_secos",
  lino: "frutos_secos", amapola: "frutos_secos", tahini: "frutos_secos",
  crema_cacahuete: "frutos_secos",
  /* La castaña está en la frutería y se come como fruto seco. */
  castanas: "frutos_secos",

  /* Grasas que la tienda coloca en otro sitio. La aceituna es la grasa de la
     dieta mediterránea, no una verdura de guarnición. */
  mantequilla: "aceite", acei_verde: "aceite", acei_negra: "aceite",
  mayonesa: "aceite", alioli: "aceite",

  /* Conservas vegetales: la categoría «conserva» las junta con el pescado en
     lata, y son verdura. */
  piquillo: "verdura", tomate_trit: "verdura", tomate_seco: "verdura",
  tomate_frito: "verdura", pim_choricero: "verdura", alcaparras: "verdura",
  pepinillo: "verdura",

  /* Postres lácteos: llevan leche, pero una ración de helado no es la ración
     de lácteo del día. */
  helado: "otros", leche_condensada: "otros", crema_pastelera: "otros",

  /* Bebidas vegetales: no son lácteo por mucho que se usen igual. */
  bebida_almendra: "otros", leche_coco: "otros", yogur_coco: "otros",
};

/**
 * Grupo nutricional de un alimento de la tabla.
 * Devuelve "otros" si no se sabe: es el grupo que no cuenta para nada, y
 * eso es lo correcto cuando no hay dato.
 */
export function grupoNutricional(ing) {
  if (!ing?.id) return "otros";
  return GRUPO_POR_ALIMENTO[ing.id] ?? GRUPO_POR_CATEGORIA[ing.cat] ?? "otros";
}

/* ============================================================
   La familia de hidratos de un alimento

   El grupo no basta para «no repetir hidratos»: la pasta y el arroz son los
   dos `cereal_refinado`, y quien pide no repetir hidratos se refiere justo a
   la diferencia entre esos dos. Aquí se baja un escalón, y solo para lo que
   hace de base del plato — la maicena de una salsa no es la base de nada, y
   se queda fuera sola porque nunca es el alimento con más gramos.
   ============================================================ */

/** Familias con las que se cuenta la base del plato. */
export const FAMILIAS_HIDRATO = ["pasta", "arroz", "patata", "pan", "masa", "legumbre", "otro_cereal"];

/** Cómo se llama cada familia cuando hay que escribirla en pantalla. */
export const NOMBRE_FAMILIA = {
  pasta: "pasta", arroz: "arroz", patata: "patata", pan: "pan o masa de pan",
  masa: "masa (hojaldre, quebrada, obleas)", legumbre: "legumbre", otro_cereal: "otro cereal",
};

/* Solo lo que la regla por grupo no acierta. Un cereal refinado nuevo cae en
   «otro cereal», que es lo honesto: no se parece a la pasta ni al arroz
   mientras nadie diga lo contrario. */
export const FAMILIA_POR_ALIMENTO = {
  pasta_trigo: "pasta", fideos: "pasta",
  arroz: "arroz",
  // las harinas cuentan como pan porque es lo que se hace con ellas en este
  // recetario: masa de pan, de pizza y de empanada
  pan_trigo: "pan", pan_sg: "pan", pan_rallado: "pan", masa_madre: "pan",
  harina_trigo: "pan", harina_fuerza: "pan",
  hojaldre: "masa", masa_quebrada: "masa", oblea: "masa",
  // la soja hace de proteína, no de base de hidratos
  tofu: null, edamame: null,
};

/** Regla por grupo, para lo que no está en la lista de arriba. */
export const FAMILIA_POR_GRUPO = {
  cereal_refinado: "otro_cereal", cereal_integral: "otro_cereal",
  tuberculo: "patata", legumbre: "legumbre",
};

/**
 * La familia de hidratos de un alimento, o `null` si no hace de base.
 * `null` explícito en la lista de excepciones también significa «no es base».
 */
export function familiaHidrato(ing) {
  if (!ing?.id) return null;
  if (ing.id in FAMILIA_POR_ALIMENTO) return FAMILIA_POR_ALIMENTO[ing.id];
  return FAMILIA_POR_GRUPO[grupoNutricional(ing)] ?? null;
}
