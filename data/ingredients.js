import { I } from "./alimento.js";
import { INGREDIENTES_RECETARIO } from "./ingredientes-recetario.js";

export { I };

/* la tabla de la casa: sin gluten, sin lácteos de vaca */
const PROPIOS = [
  I("piquillo", "Pimiento del piquillo", "conserva", 28, 1.2, 4, 3, 0.5, 0.3, 2, [], { ud: 25 }),
  I("cebolla", "Cebolla", "verdura", 40, 1.1, 9.3, 4.2, 0.1, 0.05, 1.7, [], { ud: 150 }),
  I("cebolla_morada", "Cebolla morada", "verdura", 40, 1.1, 9, 4.2, 0.1, 0.05, 1.7, [], { ud: 130 }),
  I("zanahoria", "Zanahoria", "verdura", 41, 0.9, 9.6, 4.7, 0.2, 0.1, 2.8, [], { ud: 80 }),
  I("tomate", "Tomate", "verdura", 18, 0.9, 3.9, 2.6, 0.2, 0.1, 1.2, [], { ud: 150 }),
  I("cherry", "Tomate cherry", "verdura", 18, 0.9, 3.9, 2.6, 0.2, 0.1, 1.2, [], { ud: 12, "puñado": 80 }),
  I("tomate_trit", "Tomate triturado", "conserva", 30, 1.3, 5.5, 4.5, 0.2, 0.1, 1.2, [], { cda: 20 }),
  I("tomate_seco", "Tomate seco", "conserva", 258, 14, 56, 38, 3, 2, 12, [], { ud: 3 }),
  I("calabacin", "Calabacín", "verdura", 17, 1.2, 3.1, 2.5, 0.3, 0.15, 1, [], { ud: 250 }),
  I("berenjena", "Berenjena", "verdura", 25, 1, 6, 3.5, 0.2, 0.1, 3, [], { ud: 300 }),
  I("pepino", "Pepino", "verdura", 15, 0.7, 3.6, 1.7, 0.1, 0.05, 0.5, [], { ud: 300 }),
  I("patata", "Patata", "verdura", 77, 2, 17, 0.8, 0.1, 0.05, 2.2, [], { ud: 150 }),
  I("boniato", "Boniato", "verdura", 86, 1.6, 20, 4.2, 0.1, 0.05, 3, [], { ud: 150 }),
  I("ajo", "Ajo", "verdura", 149, 6.4, 33, 1, 0.5, 0.2, 2.1, [], { diente: 4 }),
  I("espinacas", "Espinacas", "verdura", 23, 2.9, 3.6, 0.4, 0.4, 0.2, 2.2, [], { "puñado": 30, manojo: 300 }),
  I("rucula", "Rúcula", "verdura", 25, 2.6, 3.7, 2, 0.7, 0.4, 1.6, [], { "puñado": 20 }),
  I("canonigos", "Canónigos", "verdura", 21, 2, 3.6, 0.4, 0.4, 0.2, 1.5, [], { "puñado": 20 }),
  I("acelgas", "Acelgas", "verdura", 19, 1.8, 3.7, 1.1, 0.2, 0.1, 1.6, [], { "puñado": 60, ud: 80, manojo: 500 }),
  I("repollo", "Repollo", "verdura", 25, 1.3, 5.8, 3.2, 0.1, 0.05, 2.5, [], { ud: 1000, hoja: 40 }),
  I("brocoli", "Brócoli", "verdura", 34, 2.8, 7, 1.7, 0.4, 0.2, 2.6, [], { "puñado": 80, ud: 500 }),
  I("esparragos", "Espárragos verdes", "verdura", 20, 2.2, 3.9, 1.9, 0.1, 0.05, 2.1, [], { ud: 18, manojo: 500 }),
  I("pim_rojo", "Pimiento rojo", "verdura", 31, 1, 6, 4.2, 0.3, 0.15, 2.1, [], { ud: 150 }),
  I("pim_verde", "Pimiento verde", "verdura", 20, 0.9, 4.6, 2.4, 0.2, 0.1, 1.7, [], { ud: 130 }),
  I("champinon", "Champiñones", "verdura", 22, 3.1, 3.3, 2, 0.3, 0.15, 1, [], { ud: 20 }),
  I("puerro", "Puerro", "verdura", 61, 1.5, 14, 3.9, 0.3, 0.15, 1.8, [], { ud: 120 }),
  I("apio", "Apio", "verdura", 16, 0.7, 3, 1.3, 0.2, 0.1, 1.6, [], { ud: 40 }),
  I("guisantes", "Guisantes", "legumbre", 81, 5.4, 14, 5.7, 0.4, 0.2, 5, [], {}),
  I("brotes", "Brotes verdes", "verdura", 22, 2.2, 3.5, 1, 0.4, 0.2, 1.6, [], { "puñado": 25 }),
  I("mango", "Mango", "fruta", 60, 0.8, 15, 13.7, 0.4, 0.2, 1.6, [], { ud: 200 }),
  I("aguacate", "Aguacate", "fruta", 160, 2, 8.5, 0.7, 14.7, 13, 6.7, [], { ud: 200 }),
  I("limon", "Limón", "fruta", 29, 1.1, 9, 2.5, 0.3, 0.15, 2.8, [], { ud: 100, cda: 15 }),
  I("melocoton", "Melocotón", "fruta", 39, 0.9, 9.5, 8.4, 0.3, 0.15, 1.5, [], { ud: 150 }),
  I("platano", "Plátano", "fruta", 89, 1.1, 23, 12.2, 0.3, 0.1, 2.6, [], { ud: 120 }),
  I("manzana", "Manzana", "fruta", 52, 0.3, 14, 10.4, 0.2, 0.1, 2.4, [], { ud: 180 }),
  I("naranja", "Naranja", "fruta", 47, 0.9, 12, 9.2, 0.1, 0.05, 2.4, [], { ud: 200 }),
  I("fresa", "Fresas", "fruta", 32, 0.7, 7.7, 4.9, 0.3, 0.15, 2, [], { "puñado": 80, ud: 12 }),
  I("arandanos", "Arándanos", "fruta", 57, 0.7, 14.5, 10, 0.3, 0.15, 2.4, [], { "puñado": 40 }),
  I("datil", "Dátiles", "fruta", 282, 2.5, 75, 63, 0.4, 0.2, 8, [], { ud: 8 }),
  I("acei_negra", "Aceitunas negras", "conserva", 115, 0.8, 6, 0, 11, 9, 3.2, [], { ud: 4 }),
  I("acei_verde", "Aceitunas verdes", "conserva", 145, 1, 3.8, 0.5, 15, 13, 3.3, [], { ud: 4 }),
  I("alcaparras", "Alcaparras", "conserva", 23, 2.4, 4.9, 0.4, 0.9, 0.4, 3.2, [], { cda: 9, ud: 0.5 }),
  I("pepinillo", "Pepinillos", "conserva", 12, 0.6, 2.3, 1.3, 0.2, 0.1, 1.2, [], { ud: 15 }),
  I("pollo_picada", "Carne picada de pollo", "carne", 143, 17.4, 0, 0, 8, 5, 0, [], {}),
  I("pollo_pechuga", "Pechuga de pollo", "carne", 120, 23, 0, 0, 2.6, 1.5, 0, [], { ud: 200,}),
  I("pollo_alitas", "Alitas de pollo", "carne", 186, 19, 0, 0, 12, 7, 0, [], {}),
  I("pavo", "Pechuga de pavo", "carne", 111, 24, 0, 0, 1.5, 0.8, 0, [], { ud: 150}),
  I("cerdo_picada", "Carne picada de cerdo", "carne", 221, 17, 0, 0, 17, 10, 0, [], {}),
  I("ternera_picada", "Carne picada de ternera", "carne", 190, 20, 0, 0, 12, 6, 0, [], {}),
  I("solomillo_cerdo", "Solomillo de cerdo", "carne", 143, 21, 0, 0, 6, 3.5, 0, [], { ud: 450,}),
  I("jamon_cocido", "Jamón cocido extra", "carne", 107, 18, 1, 1, 3.5, 1.8, 0, [], { loncha: 20 }),
  I("jamon_serrano", "Jamón serrano", "carne", 241, 31, 0.5, 0.5, 13, 8, 0, [], { loncha: 15 }),
  I("bacalao", "Bacalao", "pescado", 82, 18, 0, 0, 0.7, 0.4, 0, ["pescado"], { ud: 150}),
  I("merluza", "Merluza", "pescado", 71, 17, 0, 0, 0.6, 0.3, 0, ["pescado"], { ud: 180}),
  I("salmon", "Salmón", "pescado", 208, 20, 0, 0, 13, 10, 0, ["pescado"], { ud: 150}),
  I("salmon_ahum", "Salmón ahumado", "pescado", 180, 18, 0.5, 0.5, 12, 8, 0, ["pescado"], {}),
  I("caballa", "Caballa en AOVE", "conserva", 200, 22, 0, 0, 12, 9, 0, ["pescado"], { lata: 80 }),
  I("melva", "Melva en AOVE", "conserva", 200, 23, 0, 0, 12, 9, 0, ["pescado"], { lata: 80 }),
  I("boquerones", "Boquerones", "pescado", 131, 20, 0, 0, 5, 3, 0, ["pescado"], { ud: 15}),
  I("sardinas", "Sardinas", "pescado", 208, 25, 0, 0, 11, 7, 0, ["pescado"], { ud: 60}),
  I("langostinos", "Langostinos", "marisco", 99, 20, 0.9, 0, 1.1, 0.5, 0, ["marisco"], { ud: 15 }),
  I("sepia", "Sepia", "marisco", 79, 16, 0.7, 0, 1.1, 0.5, 0, ["marisco"], { ud: 400}),
  I("calamar", "Calamar", "marisco", 92, 15.6, 3, 0, 1.4, 0.6, 0, ["marisco"], { ud: 250}),
  I("huevo", "Huevo", "huevos", 143, 12.6, 0.7, 0.4, 9.5, 7, 0, ["huevo"], { ud: 55 }),
  I("queso_cabra", "Queso de cabra en lonchas", "lácteos", 364, 22, 2.5, 2.5, 30, 10, 0, ["lácteos"], { loncha: 20 }),
  I("feta", "Queso feta", "lácteos", 264, 14, 4, 4, 21, 7, 0, ["lácteos"], {}),
  I("queso_fresco", "Queso fresco de cabra u oveja", "lácteos", 268, 18, 3, 3, 21, 7, 0, ["lácteos"], {}),
  I("burrata", "Burrata", "lácteos", 280, 15, 2, 2, 24, 8, 0, ["lácteos"], { ud: 125 }),
  I("queso_untar", "Queso de untar de cabra", "lácteos", 250, 8, 3, 3, 23, 8, 0, ["lácteos"], { cda: 15 }),
  I("yogur_oveja", "Yogur de oveja", "lácteos", 108, 5.5, 4.5, 4.5, 7.5, 3, 0, ["lácteos"], { ud: 125 }),
  I("requeson", "Requesón de oveja", "lácteos", 160, 12, 3, 3, 11, 4, 0, ["lácteos"], { cda: 25 }),
  I("yogur_coco", "Yogur de coco sin azúcar", "otros", 130, 1.5, 6, 4, 11, 1, 1, [], { ud: 125 }),
  I("leche_coco", "Leche de coco", "otros", 197, 2, 3, 2, 20, 2, 0, [], { ml: 1 }),
  I("bebida_almendra", "Bebida de almendras sin azúcar", "otros", 13, 0.5, 0.3, 0.2, 1.1, 1, 0.2, ["frutos secos"], { ml: 1, taza: 240 }),
  I("garbanzos", "Garbanzos cocidos", "legumbre", 139, 8.9, 20, 0.8, 2.6, 2, 7.6, [], {}),
  I("lentejas", "Lentejas cocidas", "legumbre", 116, 9, 20, 1.8, 0.4, 0.2, 7.9, [], {}),
  I("alubias", "Alubias cocidas", "legumbre", 127, 8.7, 22, 0.3, 0.5, 0.3, 6.4, [], {}),
  I("quinoa", "Quinoa (en seco)", "cereal", 368, 14, 64, 2, 6, 5, 7, [], {}),
  I("avena", "Copos de avena sin gluten", "cereal", 379, 13, 67, 1, 7, 5, 10, [], { cda: 10, taza: 90 }),
  I("pan_sg", "Pan sin gluten", "cereal", 250, 5, 45, 3, 5, 3, 4, [], { loncha: 30 }),
  I("tortitas_maiz", "Tortitas de maíz", "cereal", 387, 7.5, 81, 0.8, 3, 1.5, 2.6, [], { ud: 8 }),
  I("aove", "Aceite de oliva virgen extra", "aceite y grasas", 884, 0, 0, 0, 100, 86, 0, [], { cda: 10, cdta: 4, ml: 0.92 }),
  I("tahini", "Tahini", "aceite y grasas", 595, 17, 21, 0.5, 54, 46, 9, ["sésamo"], { cda: 15 }),
  I("sesamo", "Semillas de sésamo", "aceite y grasas", 573, 17, 23, 0.3, 50, 43, 11.8, ["sésamo"], { cda: 9, cdta: 3 }),
  I("pipas_calabaza", "Semillas de calabaza", "aceite y grasas", 559, 30, 11, 1.4, 49, 40, 6, [], { cda: 10 }),
  I("nueces", "Nueces", "aceite y grasas", 654, 15, 14, 2.6, 65, 58, 6.7, ["frutos secos"], { ud: 5, "puñado": 30 }),
  I("almendras", "Almendras", "aceite y grasas", 579, 21, 22, 4.4, 50, 43, 12.5, ["frutos secos"], { cda: 10, "puñado": 30 }),
  I("crema_cacahuete", "Crema de cacahuete 100 %", "aceite y grasas", 588, 25, 20, 6, 50, 40, 8, ["frutos secos"], { cda: 16, cdta: 6 }),
  I("chia", "Semillas de chía", "aceite y grasas", 486, 17, 42, 0, 31, 28, 34, [], { cda: 12, cdta: 4 }),
  I("soja_sg", "Salsa de soja sin gluten", "otros", 60, 6, 6, 1, 0, 0, 0, ["soja"], { cda: 16 }),
  I("vinagre", "Vinagre de manzana sin filtrar", "otros", 22, 0, 0.9, 0.4, 0, 0, 0, [], { cda: 15 }),
  I("mostaza", "Mostaza de Dijon", "otros", 66, 4, 6, 1, 3, 2, 3, ["mostaza"], { cdta: 5 }),
  I("miel", "Miel", "otros", 304, 0.3, 82, 82, 0, 0, 0, [], { cdta: 7 }),
  I("cacao", "Cacao puro en polvo", "otros", 228, 20, 58, 1.8, 14, 5, 33, [], { cda: 6, cdta: 2 }),
  I("sal", "Sal", "especia", 0, 0, 0, 0, 0, 0, 0, [], { pizca: 0.4, cdta: 6 }),
  I("especias", "Especias (pimienta, pimentón, comino, curry…)", "especia", 250, 10, 50, 3, 5, 3, 25, [], { cdta: 2, pizca: 0.3 }),
  I("canela", "Canela molida", "especia", 247, 4, 81, 2.2, 1.2, 0.6, 53, [], { cdta: 2, pizca: 0.3 }),
  /* La `hoja` de la tabla general son 40 g, que es una hoja de repollo. Una
     hoja de laurel o de menta pesa medio gramo, y sin decirlo aquí «1 hoja de
     laurel» se contaba como 40 g de hierbas: había sopas con 640 g. */
  I("hierbas", "Hierbas frescas (perejil, albahaca, eneldo…)", "especia", 30, 3, 5, 0.5, 0.5, 0.2, 3, [], { "puñado": 10, cda: 4, hoja: 0.5, manojo: 30 }),
  I("agua", "Agua", "otros", 0, 0, 0, 0, 0, 0, 0, [], { ml: 1, taza: 240 }),
];

/* y detrás, lo que pide el recetario personal importado */
export const BASE_INGREDIENTS = [...PROPIOS, ...INGREDIENTES_RECETARIO];

/* ============================================================
   Fundir la tabla guardada en el navegador con la del código

   El mismo problema que tenían las recetas, y la misma solución. Ver el
   comentario largo de `fundirRecetario()` en `App.jsx`: lo que hay en
   `localStorage` es una foto fija del día en que se abrió la aplicación por
   primera vez, así que sin fundir nada, quien la abriera una vez no recibe
   nunca un alimento nuevo de esta tabla, ni una corrección de kcal, ni una
   conversión `cv` nueva. Y las conversiones importan más de lo que parece:
   la hoja de laurel de 0,5 g de aquí abajo es exactamente eso —una
   corrección que arreglaba sopas con 640 g de hierbas— y no le llegaba a
   nadie que ya tuviera la tabla guardada.

   Criterio, el de siempre: manda el código, salvo en lo que es del usuario.

   Lo del usuario, que no se pisa nunca:
     - `precioKg`, el precio que ha escrito en la tabla de ingredientes
   Y sus propios alimentos —los que no están en esta tabla: los que dio de
   alta a mano y los que entraron al importar una receta— se quedan enteros.

   `precioKg` es el único campo de la lista porque es el único que no existe
   en el código: que esté puesto significa que lo escribió alguien. En la
   tabla no hay nada más que sea suyo por definición.

   Lo que esto sí se lleva por delante, a sabiendas: si editó un alimento del
   código con el botón «Editar» de la tabla —cambiarle las kcal, el
   nombre, la categoría—, ese cambio vuelve al valor del código al recargar.
   No hay forma de distinguirlo: un alimento cuyas kcal no coinciden con el
   código puede ser una corrección suya o una foto vieja de antes de que el
   código se corrigiera, y son la misma cosa vista desde aquí. Conservar la
   diferencia sería quedarse con la foto vieja siempre, que es justo lo que
   esta función viene a arreglar. Con el vídeo de una receta se apostó al
   revés, y allí es lo correcto: un vídeo puesto a mano vale más que el del
   recetario, y el del recetario casi nunca cambia. Aquí las kcal del código
   se corrigen y el precio, que es lo que de verdad escribe el usuario, tiene
   su propio campo y no necesita adivinarse.

   Vive aquí y no en `App.jsx` —donde está su gemela— porque las pruebas de
   `pruebas/` son Node a secas y no saben leer JSX.
   ============================================================ */
const DEL_CODIGO = new Map(BASE_INGREDIENTS.map((i) => [i.id, i]));

export function fundirTabla(guardados) {
  const vistos = new Set();
  const fundidos = (guardados || []).map((suyo) => {
    const del = DEL_CODIGO.get(suyo.id);
    if (!del) return suyo;              // alimento propio: no se toca
    vistos.add(suyo.id);
    /* con `> 0` y no con un `if (suyo.precioKg)`: así se conserva el precio
       exactamente cuando `precioDe()` lo daría por bueno. Un 0, un vacío o
       algo que no es número no son un precio —son la forma que tiene
       la tabla de decir «vuelve a la media»— y el campo no se copia. */
    const suyoElPrecio = Number(suyo.precioKg) > 0;
    return { ...del, ...(suyoElPrecio ? { precioKg: Number(suyo.precioKg) } : {}) };
  });
  // y los que el código trae y esta instalación todavía no tenía
  const nuevos = BASE_INGREDIENTS.filter((i) => !vistos.has(i.id));
  return [...fundidos, ...nuevos];
}
