/* ============================================================
   Precio de referencia por categoría — generado, no se edita a mano
   (PLAN-PRECIOS.md § 4)

   TODA la tabla va en €/kg — precio de destino, el que se paga en la compra.
   `recipeCost()` multiplica gramos/1000 por este número, y la tabla enseña
   la cifra en pantalla rotulada «€/kg», así que una entrada en otra unidad
   (€/docena, €/litro, €/unidad) no es una anotación: es un precio equivocado
   que se lee como un dato. Lo que se compra por otra unidad se convierte a
   €/kg aquí, y la cuenta se deja escrita en el comentario — ver `huevos`.

   PROVISIONAL — pendiente de contrastar con el informe del MAPA.

   La tabla del Panel de Consumo Alimentario (la mejor fuente encontrada,
   § 1) no se ha podido leer todavía: es un PDF maquetado como revista, sin
   texto extraíble, y leerla es una tarea manual de una sola vez. Mientras
   tanto, esta tabla combina:

   - Cifras REALES citadas por fuentes de prensa/sector sobre ese mismo
     informe o sobre observatorios oficiales — quedan anotadas abajo, con
     su cifra y de dónde salen.
   - Para el resto de categorías, una estimación de bulto a partir de
     precios de supermercado conocidos en España — NO viene del informe,
     y se nota explícitamente por lo que es: una aproximación de arranque
     para poder construir y probar el motor de cálculo, no un dato fiable
     para presupuestar de verdad. `PRECIOS_META.confirmado` lo marca.

   Cifras con cita real, agosto de 2026:
   - Media general 2024: 3,12 €/kg-l «dentro del hogar» (informe MAPA 2024).
   - Fruta fresca 2024: 2,07-2,15 €/kg (informe MAPA 2024) → `fruta`.
   - Chocolate y derivados 2024: 10,11 €/kg (informe MAPA 2024) — referencia
     de bulto para `otros`, no un valor propio.
   - Galletas, cierre 2024: 4,80 €/kg (informe MAPA 2024) — referencia de
     bulto para `otros`, tampoco un valor propio (son un dulce, no un
     cereal base).
   - AOVE: pasó de ~9 €/l (abril 2024) a ~4,25-4,35 €/l (sept-dic 2025) —
     caída del 51 %, según observatorios del sector. Se usa el dato más
     reciente para `aceite y grasas`, con la nota de que es la categoría
     con el precio más volátil de las trece: aquí el corrector de IPC
     (§ 6) importa más que en ninguna otra.

   El resto son estimaciones de bulto, sin cita: se marcan para que quien
   lea el código sepa que no vienen del informe.
   ============================================================ */
export const PRECIO_CATEGORIA = {
  'verdura': 2.0,            // estimación de bulto
  'fruta': 2.1,               // MAPA 2024, citado (2,07-2,15 €/kg)
  'carne': 8.0,                // estimación de bulto — categoría ancha, ver § 11
  'pescado': 10.0,            // estimación de bulto
  'marisco': 15.0,            // estimación de bulto
  'lácteos': 6.0,             // estimación de bulto
  'cereal': 1.8,               // estimación de bulto
  'legumbre': 2.4,            // estimación de bulto
  'conserva': 3.0,             // estimación de bulto (fuera de las excepciones de pescado)
  'aceite y grasas': 5.0,     // observatorio del sector, sept-dic 2025 — muy volátil, ver nota arriba
  'especia': 12.0,             // estimación de bulto, irrelevante: se usa en gramos
  'huevos': 4.2,               // estimación de bulto: 2,80 €/docena ÷ 0,66 kg (12 × 55 g, el `ud` del propio huevo)
  'otros': 4.0,                 // estimación de bulto, bajo impacto: cantidades pequeñas por receta
};

/* Categorías demasiado heterogéneas para un precio único (PLAN-PRECIOS.md
   § 2): conserva de pescado (mucho más cara que la vegetal) y frutos
   secos/aceites baratos dentro de «aceite y grasas». Todas estimación de
   bulto, sin cita — mismo aviso que arriba. */
export const PRECIO_EXCEPCION = {
  'caballa': 11, 'melva': 11, 'bonito_aceite': 13,       // conserva de pescado
  'nueces': 9, 'almendras': 8, 'crema_cacahuete': 9,      // frutos secos, en «aceite y grasas»
  'aceite_girasol': 2,                                     // mucho más barato que el AOVE de su categoría
  // encontrado probando en el navegador: «especia» asume gramos por
  // receta (§ 3 del plan), pero la sal a veces se usa en kilos — costra de
  // sal para pescado al horno, por ejemplo (2 kg reales en una receta del
  // recetario). Con el precio de `especia` esos 2 kg salían por 24 €, un
  // disparate; con precio propio, real y barato, deja de distorsionar.
  'sal': 0.6,
};

export const PRECIOS_META = {
  confirmado: false,   // false mientras no se contraste con la lectura manual del informe (Fase 1.1)
  fuente: 'Provisional — mezcla de cifras citadas de MAPA/observatorios y estimación de bulto; pendiente de leer el Panel de Consumo Alimentario del MAPA a mano',
  fechaBase: '2026-08',
  fechaActualizacion: '2026-08',
};

/* ============================================================
   El precio de un alimento, y de dónde sale

   Tres escalones, de lo más tuyo a lo más general. El primero es nuevo: la
   tabla de arriba es una media de categoría para toda España, y el aceite de
   tu supermercado no es la media de nada. Quien quiera afinar el suyo puede
   escribirlo en la tabla de ingredientes, alimento por alimento, y manda sobre todo lo
   demás.

   `origen` sale con el precio a propósito. Un número sin procedencia se lee
   como un dato comprobado, y de estos tres solo uno lo es —el que ha puesto
   quien usa la aplicación—: los otros dos son una media, y la interfaz tiene
   que poder decirlo.
   ============================================================ */
export function precioDe(ing) {
  if (!ing) return { eurosKg: 0, origen: "" };
  if (Number(ing.precioKg) > 0) return { eurosKg: Number(ing.precioKg), origen: "tuyo" };
  if (PRECIO_EXCEPCION[ing.id] != null) return { eurosKg: PRECIO_EXCEPCION[ing.id], origen: "excepcion" };
  if (PRECIO_CATEGORIA[ing.cat] != null) return { eurosKg: PRECIO_CATEGORIA[ing.cat], origen: "categoria" };
  return { eurosKg: 0, origen: "" };
}
