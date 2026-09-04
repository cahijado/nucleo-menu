/* ============================================================
   Alimentos que pide el recetario personal importado

   La tabla original de ingredients.js está pensada para la cocina de casa:
   sin gluten, sin lácteos de vaca, con quesos de cabra y oveja. El recetario
   importado es cocina española clásica, y usa harina de trigo, mantequilla,
   nata y leche entera con toda naturalidad. Estos alimentos se dan de alta
   aquí, con sus alérgenos declarados: así el filtro de «sin gluten» o «sin
   lácteos» empieza a funcionar de verdad sobre esas recetas, en lugar de
   dejarlas pasar por no saber qué llevan.

   Valores por 100 g de alimento crudo salvo que el nombre diga otra cosa,
   tomados de las tablas de composición de uso corriente (BEDCA y equivalentes).
   `gs` son las grasas insaturadas, como en el resto de la aplicación.

   Los preparados compuestos —bechamel, crema pastelera, alioli, caldos— llevan
   el valor del preparado terminado, que es como se usan en la receta.
   ============================================================ */
import { I } from "./alimento.js";

export const INGREDIENTES_RECETARIO = [
  /* ---------- cereales, harinas y masas ---------- */
  I("harina_trigo", "Harina de trigo", "cereal", 341, 9.8, 71, 1.5, 1.2, 0.9, 3.5, ["gluten"], { cda: 10, cdta: 3, taza: 120 }),
  I("harina_fuerza", "Harina de fuerza", "cereal", 345, 12.5, 69, 1.5, 1.3, 1, 3.4, ["gluten"], { cda: 10, taza: 120 }),
  I("maizena", "Maicena (almidón de maíz)", "cereal", 358, 0.3, 88, 0, 0.1, 0.05, 0.9, [], { cda: 8, cdta: 2.5 }),
  I("pan_trigo", "Pan de trigo", "cereal", 258, 8.5, 49, 2.5, 1.6, 1.1, 2.7, ["gluten"], { ud: 250, rebanada: 30 }),
  I("pan_rallado", "Pan rallado", "cereal", 350, 12, 66, 3, 4, 2.8, 4, ["gluten"], { cda: 12, taza: 110 }),
  I("hojaldre", "Masa de hojaldre", "cereal", 397, 5.7, 36, 1, 25, 14, 1.4, ["gluten", "lácteos"], { ud: 275 }),
  I("masa_quebrada", "Masa quebrada", "cereal", 448, 6, 44, 2, 27, 16, 1.8, ["gluten", "lácteos"], { ud: 250 }),
  I("oblea", "Obleas de empanadilla", "cereal", 300, 8, 50, 1.5, 7.5, 5, 2, ["gluten"], { ud: 15 }),
  I("arroz", "Arroz redondo (en seco)", "cereal", 354, 7, 78, 0.2, 0.9, 0.6, 1.3, [], { taza: 200, ud: 80 }),
  I("pasta_trigo", "Pasta de trigo (en seco)", "cereal", 359, 12.5, 71, 3, 1.5, 1.1, 3, ["gluten"], { taza: 100, ud: 10 }),
  I("fideos", "Fideos finos (en seco)", "cereal", 359, 12, 72, 2.8, 1.4, 1, 3, ["gluten"], { taza: 90 }),
  I("galleta_maria", "Galletas María", "cereal", 436, 7, 74, 22, 12, 8, 2.4, ["gluten", "lácteos", "huevo"], { ud: 7 }),
  I("levadura_fresca", "Levadura fresca de panadero", "otros", 105, 12, 12, 0, 1.5, 1, 6, [], { ud: 25, cdta: 5 }),
  I("levadura_quimica", "Levadura química (impulsor)", "otros", 97, 0.1, 23, 0, 0, 0, 0.2, [], { sobre: 16, cdta: 4 }),

  /* ---------- lácteos de vaca ---------- */
  I("leche_entera", "Leche entera de vaca", "lácteos", 63, 3.2, 4.7, 4.7, 3.6, 1.2, 0, ["lácteos"], { taza: 245, vaso: 200 }),
  I("nata_cocinar", "Nata líquida para cocinar (18 %)", "lácteos", 195, 2.6, 3.6, 3.6, 18, 6, 0, ["lácteos"], { cda: 15, taza: 240 }),
  I("nata_montar", "Nata para montar (35 %)", "lácteos", 345, 2.1, 3, 3, 35, 11.5, 0, ["lácteos"], { taza: 240 }),
  I("mantequilla", "Mantequilla", "lácteos", 750, 0.6, 0.6, 0.6, 83, 27, 0, ["lácteos"], { cda: 14, cdta: 5, nuez: 12 }),
  I("leche_condensada", "Leche condensada azucarada", "lácteos", 321, 7.9, 55, 55, 8.7, 2.9, 0, ["lácteos"], { cda: 20, lata: 370 }),
  I("queso_rallado", "Queso rallado para gratinar", "lácteos", 380, 26, 2.5, 1, 30, 10, 0, ["lácteos"], { cda: 8, "puñado": 25 }),
  I("queso_parmesano", "Queso parmesano", "lácteos", 402, 33, 3.2, 0.8, 29, 9.5, 0, ["lácteos"], { cda: 6 }),
  I("queso_manchego", "Queso manchego semicurado", "lácteos", 376, 25, 0.5, 0.5, 30, 11, 0, ["lácteos"], { loncha: 22 }),
  I("queso_emmental", "Queso emmental", "lácteos", 380, 28, 1.4, 1.4, 29, 9.5, 0, ["lácteos"], { loncha: 20 }),
  I("queso_crema", "Queso crema", "lácteos", 253, 6, 4.1, 3.8, 24, 7.5, 0, ["lácteos"], { cda: 15 }),
  I("quesito", "Queso en porciones", "lácteos", 240, 11, 6, 5.5, 19, 6, 0, ["lácteos"], { ud: 17 }),
  I("yogur_natural", "Yogur natural", "lácteos", 61, 3.5, 4.7, 4.7, 3.3, 1.1, 0, ["lácteos"], { ud: 125 }),
  I("bechamel", "Bechamel", "lácteos", 145, 3.8, 8.5, 4, 10.5, 4.5, 0.3, ["lácteos", "gluten"], { cda: 20, taza: 240 }),
  I("crema_pastelera", "Crema pastelera", "lácteos", 175, 4.3, 22, 17, 7.6, 2.8, 0, ["lácteos", "huevo", "gluten"], { cda: 20 }),

  /* ---------- carnes ---------- */
  I("ternera", "Ternera (filete o carne de guiso)", "carne", 131, 21, 0, 0, 5, 2.6, 0, [], { ud: 150 }),
  I("cerdo_magro", "Cerdo magro (cinta de lomo)", "carne", 143, 21.5, 0, 0, 6.2, 3.6, 0, [], { ud: 120, loncha: 60 }),
  I("costilla_cerdo", "Costilla de cerdo", "carne", 277, 17, 0, 0, 23, 13.5, 0, [], { ud: 90 }),
  I("carrillera", "Carrillera de cerdo o ternera", "carne", 165, 19, 0, 0, 9.8, 5.5, 0, [], { ud: 120 }),
  I("secreto_iberico", "Secreto o lagarto ibérico", "carne", 290, 17, 0, 0, 25, 15, 0, [], { ud: 200 }),
  I("panceta", "Panceta o guanciale", "carne", 393, 14, 0.5, 0, 37, 21, 0, [], { loncha: 25, ud: 25 }),
  I("pollo_muslo", "Muslo o contramuslo de pollo", "carne", 175, 18.5, 0, 0, 11, 7, 0, [], { ud: 130 }),
  I("pollo_entero", "Pollo entero", "carne", 167, 19, 0, 0, 10, 6.4, 0, [], { ud: 1400 }),
  I("conejo", "Conejo", "carne", 133, 21.5, 0, 0, 5.3, 3, 0, [], { ud: 1200 }),
  I("chorizo", "Chorizo", "carne", 400, 22, 2, 1, 33, 18, 0, [], { ud: 70, loncha: 10 }),
  I("morcilla", "Morcilla de arroz", "carne", 345, 12, 12, 0.5, 28, 14, 1, [], { ud: 90 }),
  I("sobrasada", "Sobrasada ibérica", "carne", 465, 14, 1.5, 0.8, 44, 26, 0, [], { cda: 20 }),
  I("jamon_iberico", "Jamón ibérico", "carne", 375, 30, 0, 0, 28, 19, 0, [], { loncha: 12 }),

  /* ---------- pescados y mariscos ---------- */
  I("atun", "Atún o bonito fresco", "pescado", 144, 23, 0, 0, 5.5, 3.9, 0, ["pescado"], { ud: 150 }),
  I("bonito_aceite", "Bonito o atún en aceite de oliva", "conserva", 200, 25, 0, 0, 11, 8.5, 0, ["pescado"], { lata: 80 }),
  I("rape", "Rape", "pescado", 82, 17.5, 0, 0, 1, 0.6, 0, ["pescado"], { ud: 200 }),
  I("lubina", "Lubina", "pescado", 97, 19, 0, 0, 2.2, 1.5, 0, ["pescado"], { ud: 400 }),
  I("dorada", "Dorada", "pescado", 100, 19.5, 0, 0, 2.4, 1.6, 0, ["pescado"], { ud: 400 }),
  I("trucha", "Trucha", "pescado", 119, 19.5, 0, 0, 4.3, 3, 0, ["pescado"], { ud: 250 }),
  I("gambas", "Gambas o langostinos pelados", "marisco", 87, 18.5, 0.5, 0, 1, 0.6, 0, ["marisco"], { ud: 12 }),
  I("almejas", "Almejas", "marisco", 78, 12.8, 2.5, 0, 1.6, 0.9, 0, ["marisco"], { ud: 10 }),
  I("mejillones", "Mejillones", "marisco", 86, 12, 3.7, 0, 2.2, 1.4, 0, ["marisco"], { ud: 12 }),
  I("bogavante", "Bogavante o cigalas", "marisco", 90, 19, 0.5, 0, 0.9, 0.5, 0, ["marisco"], { ud: 500 }),
  I("chipirones", "Chipirones", "marisco", 82, 16, 1.4, 0, 1.4, 0.8, 0, ["marisco"], { ud: 40 }),
  I("pulpo", "Pulpo", "marisco", 82, 15, 2.2, 0, 1, 0.6, 0, ["marisco"], { ud: 1500 }),
  I("tinta_calamar", "Tinta de calamar", "marisco", 60, 9, 2, 0, 1.5, 0.9, 0, ["marisco"], { ud: 4, bolsita: 4 }),

  /* ---------- verduras y setas ---------- */
  I("cebolleta", "Cebolleta", "verdura", 32, 1.8, 4.7, 2.3, 0.2, 0.1, 1.8, [], { ud: 90 }),
  I("chalota", "Chalota", "verdura", 72, 2.5, 16, 7.9, 0.1, 0.05, 3.2, [], { ud: 30 }),
  I("alcachofa", "Alcachofa", "verdura", 47, 3.3, 10.5, 1, 0.2, 0.1, 5.4, [], { ud: 120 }),
  I("calabaza", "Calabaza", "verdura", 26, 1, 6.5, 2.8, 0.1, 0.05, 0.5, [], { ud: 1000 }),
  I("judias_verdes", "Judías verdes", "verdura", 31, 1.8, 7, 3.3, 0.1, 0.05, 2.7, [], { "puñado": 60, ud: 8 }),
  I("habas", "Habas frescas", "verdura", 88, 7.9, 12, 1.6, 0.7, 0.4, 5.4, [], { "puñado": 70 }),
  I("lechuga", "Lechuga", "verdura", 15, 1.4, 2.2, 0.8, 0.2, 0.1, 1.3, [], { ud: 300, "puñado": 25, hoja: 15 }),
  I("setas", "Setas variadas o boletus", "verdura", 26, 2.5, 3.3, 1.1, 0.4, 0.2, 1.6, [], { "puñado": 30, ud: 20 }),
  I("portobello", "Champiñón portobello", "verdura", 26, 2.5, 3.9, 2.2, 0.2, 0.1, 1.3, [], { ud: 45 }),
  I("pim_choricero", "Pimiento choricero (pulpa)", "conserva", 90, 3, 15, 8, 1.5, 1, 8, [], { ud: 8, cda: 15 }),
  I("guindilla", "Guindilla o cayena", "especia", 40, 1.9, 8.8, 5.3, 0.4, 0.2, 1.5, [], { ud: 2 }),
  I("lentejas_secas", "Lentejas pardinas (en seco)", "legumbre", 336, 24, 52, 2, 1.7, 1.1, 11, [], { taza: 190 }),

  /* ---------- fruta ---------- */
  I("frambuesa", "Frambuesas", "fruta", 52, 1.2, 11.9, 4.4, 0.7, 0.4, 6.5, [], { "puñado": 60, ud: 5 }),
  I("pera", "Pera", "fruta", 57, 0.4, 12.5, 9.8, 0.1, 0.05, 3.1, [], { ud: 170 }),
  I("albaricoque", "Albaricoque u orejones", "fruta", 48, 1.4, 9.1, 9.1, 0.4, 0.2, 2, [], { ud: 35 }),
  I("mermelada", "Mermelada de fruta", "otros", 250, 0.4, 60, 55, 0.1, 0.05, 1, [], { cda: 20 }),

  /* ---------- caldos, salsas y fondos ----------
     `pastilla` no son los gramos del cubito, son los del caldo que sale de
     él: medio litro, que es lo que pone el envase y lo que acaba habiendo
     en la cazuela. Contar los 10 g del cubito daría un guiso sin líquido. */
  I("caldo_carne", "Caldo de carne", "otros", 12, 1.5, 0.8, 0.3, 0.4, 0.2, 0, [], { taza: 240, vaso: 200, pastilla: 500 }),
  I("caldo_ave", "Caldo de pollo", "otros", 11, 1.4, 0.7, 0.3, 0.4, 0.2, 0, [], { taza: 240, vaso: 200, pastilla: 500 }),
  I("fumet", "Fumet o caldo de pescado", "otros", 10, 1.3, 0.6, 0.2, 0.3, 0.2, 0, ["pescado"], { taza: 240, vaso: 200, pastilla: 500 }),
  I("caldo_verduras", "Caldo de verduras", "otros", 7, 0.4, 1.2, 0.5, 0.1, 0.05, 0, [], { taza: 240, vaso: 200, pastilla: 500 }),
  I("tomate_frito", "Tomate frito", "conserva", 82, 1.5, 9.5, 7.5, 3.9, 3.1, 1.5, [], { cda: 20, taza: 240 }),
  I("mayonesa", "Mayonesa", "otros", 680, 1.1, 1.3, 1, 75, 63, 0, ["huevo"], { cda: 14 }),
  I("alioli", "Alioli", "otros", 640, 1.5, 2.5, 0.7, 69, 58, 0.3, ["huevo"], { cda: 15 }),
  I("salsa_barbacoa", "Salsa barbacoa", "otros", 172, 0.8, 41, 33, 0.6, 0.4, 0.9, [], { cda: 17 }),

  /* ---------- grasas, vinagres y bebidas de cocina ---------- */
  I("aceite_girasol", "Aceite de girasol", "aceite y grasas", 900, 0, 0, 0, 100, 89, 0, [], { cda: 14, cdta: 5, vaso: 200 }),
  I("aceite_sesamo", "Aceite de sésamo", "aceite y grasas", 900, 0, 0, 0, 100, 84, 0, ["sésamo"], { cdta: 5 }),
  I("vinagre_vino", "Vinagre de vino o de Jerez", "otros", 19, 0.1, 0.4, 0.4, 0, 0, 0, [], { cda: 15, cdta: 5 }),
  I("vino_blanco", "Vino blanco", "otros", 82, 0.1, 2.6, 1, 0, 0, 0, [], { vaso: 150, taza: 240 }),
  I("vino_tinto", "Vino tinto", "otros", 85, 0.1, 2.6, 0.6, 0, 0, 0, [], { vaso: 150, taza: 240, botella: 750 }),
  I("vino_dulce", "Vino de Oporto, Pedro Ximénez o Jerez dulce", "otros", 160, 0.1, 12, 10, 0, 0, 0, [], { vaso: 100, cda: 15 }),
  I("brandy", "Brandy, coñac o whisky", "otros", 231, 0, 0.1, 0.1, 0, 0, 0, [], { cda: 15, vaso: 40 }),
  I("cerveza", "Cerveza", "otros", 43, 0.5, 3.6, 0.1, 0, 0, 0, ["gluten"], { vaso: 200, lata: 330 }),

  /* ---------- dulces y reposteria ---------- */
  I("azucar", "Azúcar", "otros", 400, 0, 100, 100, 0, 0, 0, [], { cda: 12, cdta: 4, taza: 200, vaso: 200 }),
  I("azucar_glass", "Azúcar glas", "otros", 400, 0, 100, 100, 0, 0, 0, [], { cda: 8, cdta: 3 }),
  I("chocolate_negro", "Chocolate negro (70 %)", "otros", 570, 7.8, 33, 24, 42, 15, 11, [], { ud: 5, onza: 5 }),
  I("gelatina", "Gelatina neutra en hojas", "otros", 340, 84, 0, 0, 0.1, 0.05, 0, [], { hoja: 1.7, ud: 1.7 }),
  I("vainilla", "Vainilla", "especia", 288, 0.1, 12.6, 12.6, 0.1, 0.05, 0, [], { ud: 3, cdta: 4 }),

  /* ---------- lo que pedía la cola larga del recetario ---------- */
  I("cordero", "Cordero (paletilla o pierna)", "carne", 234, 17, 0, 0, 18, 10, 0, [], { ud: 900 }),
  I("codorniz", "Codorniz", "carne", 134, 22, 0, 0, 4.5, 3, 0, [], { ud: 150 }),
  I("lacon", "Lacón curado", "carne", 235, 22, 0.5, 0, 16, 9, 0, [], { loncha: 25 }),
  I("rodaballo", "Rodaballo", "pescado", 95, 16.5, 0, 0, 3, 2, 0, ["pescado"], { ud: 1000 }),
  I("lenguado", "Lenguado", "pescado", 83, 16.9, 0, 0, 1.7, 1.1, 0, ["pescado"], { ud: 250 }),
  I("caracoles", "Caracoles", "marisco", 90, 16.1, 2, 0, 1.4, 0.9, 0, ["marisco"], { "puñado": 50, ud: 8 }),
  I("grelos", "Grelos o nabizas", "verdura", 32, 3, 3.5, 1, 0.4, 0.2, 3.2, [], { manojo: 250 }),
  I("pasas", "Pasas y ciruelas pasas", "fruta", 240, 2.5, 57, 55, 0.5, 0.3, 5, [], { "puñado": 30, ud: 8 }),
  I("ketchup", "Kétchup", "otros", 102, 1.3, 24, 21, 0.2, 0.1, 0.4, [], { cda: 17 }),

  /* ---------- altas de la revisión de la cuarentena ----------
     Dos alimentos que el recetario pide y la tabla no tenía, y que se estaban
     resolviendo con el pariente más cercano: la harina de garbanzo contaba
     como garbanzo cocido (tres veces menos calorías por cada 100 g) y la
     caballa fresca como caballa en conserva. */
  I("harina_garbanzo", "Harina de garbanzo", "cereal", 387, 22.4, 58, 10.8, 6.7, 5.8, 10.8, [], { cda: 10, cdta: 3, taza: 90 }),
  I("caballa_fresca", "Caballa o verdel fresco", "pescado", 205, 19, 0, 0, 13.9, 10.5, 0, ["pescado"], { ud: 250 }),
  I("helado", "Helado de nata o vainilla", "lácteos", 207, 3.5, 24, 21, 11, 3.5, 0.7, ["lácteos"], { bola: 60, ud: 60 }),

  /* ---------- altas de la revisión de la cuarentena, 2.ª tanda ----------

     105 nombres del recetario importado no estaban en ninguna tabla, y
     bloqueaban 107 recetas. Lo que sigue son los alimentos corrientes de esa
     lista: verduras y frutas de temporada que la tabla de casa nunca pidió,
     y unos cuantos preparados que la cocina española usa a diario.

     Valores por 100 g, misma convención que el resto del fichero: alimento
     crudo salvo que el nombre diga otra cosa, hidratos con la fibra dentro,
     `gs` las grasas insaturadas, y las cifras de las tablas de composición de
     uso corriente (BEDCA y equivalentes). Lo que no se ha encontrado con esa
     garantía no se ha dado de alta: sus recetas siguen en cuarentena, que es
     mejor que una cifra a ojo. */

  /* verduras */
  I("col_bruselas", "Coles de Bruselas", "verdura", 43, 3.4, 9, 2.2, 0.3, 0.15, 3.8, [], { ud: 20, "puñado": 80 }),
  I("borraja", "Borraja", "verdura", 21, 1.8, 3.1, 0.5, 0.7, 0.4, 1.5, [], { manojo: 250, ud: 40 }),
  I("cardo", "Cardo", "verdura", 17, 0.7, 4.1, 1, 0.1, 0.05, 1.6, [], { manojo: 400, ud: 800 }),
  I("remolacha", "Remolacha cocida", "verdura", 44, 1.7, 10, 8, 0.2, 0.1, 2, [], { ud: 100 }),
  I("rabano", "Rabanitos", "verdura", 16, 0.7, 3.4, 1.9, 0.1, 0.05, 1.6, [], { ud: 15, manojo: 150 }),
  I("endivia", "Endivias", "verdura", 17, 1.3, 3.4, 0.3, 0.2, 0.1, 3.1, [], { ud: 100, hoja: 10 }),
  I("tirabeques", "Tirabeques", "verdura", 42, 2.8, 7.6, 4, 0.2, 0.1, 2.6, [], { "puñado": 60 }),
  I("maiz", "Maíz dulce en grano", "verdura", 86, 3.3, 19, 3.2, 1.4, 0.9, 2, [], { mazorca: 150, ud: 150, lata: 140 }),
  I("pim_amarillo", "Pimiento amarillo", "verdura", 27, 1, 6.3, 4.2, 0.2, 0.1, 0.9, [], { ud: 150 }),
  /* Los de Gernika y los de Padrón se cuentan de veinte en veinte y pesan
     quince gramos; contarlos como pimientos verdes normales ponía 2,6 kg de
     pimiento en una fuente de sardinas. */
  I("pim_pequeno", "Pimiento verde pequeño (Gernika o Padrón)", "verdura", 20, 0.9, 4.6, 2.4, 0.2, 0.1, 1.7, [], { ud: 15, "puñado": 100 }),
  I("flor_calabacin", "Flores de calabacín", "verdura", 15, 1, 3.3, 2, 0.2, 0.1, 1.1, [], { ud: 10 }),

  /* frutas */
  I("granada", "Granada", "fruta", 83, 1.7, 18.7, 13.7, 1.2, 0.9, 4, [], { ud: 280 }),
  I("castanas", "Castañas", "fruta", 196, 1.6, 44.2, 11, 1.25, 0.9, 8.1, [], { ud: 10, "puñado": 50 }),
  I("melon", "Melón", "fruta", 34, 0.8, 8.2, 7.9, 0.2, 0.1, 0.9, [], { ud: 1200, rodaja: 200 }),
  I("kiwi", "Kiwi", "fruta", 61, 1.1, 14.7, 9, 0.5, 0.3, 3, [], { ud: 90 }),
  I("higo", "Higos frescos", "fruta", 74, 0.8, 19.2, 16.3, 0.3, 0.15, 2.9, [], { ud: 50 }),
  I("higo_seco", "Higos secos", "fruta", 249, 3.3, 63.9, 47.9, 0.9, 0.5, 9.8, [], { ud: 20, "puñado": 40 }),
  I("membrillo", "Membrillo", "fruta", 57, 0.4, 15.3, 12, 0.1, 0.05, 1.9, [], { ud: 200 }),
  I("fruta_confitada", "Fruta confitada", "fruta", 320, 0.3, 80, 75, 0.1, 0.05, 1.5, [], { ud: 8, cda: 20 }),

  /* legumbres y cereales */
  I("tofu", "Tofu firme", "legumbre", 76, 8.1, 1.9, 0.6, 4.8, 3.9, 0.3, ["soja"], { ud: 250 }),
  I("edamame", "Edamame (soja verde)", "legumbre", 121, 11.9, 8.9, 2.2, 5.2, 3.6, 5.2, ["soja"], { "puñado": 80 }),
  I("cuscus", "Cuscús (en seco)", "cereal", 376, 12.8, 77.4, 0.6, 0.6, 0.4, 5, ["gluten"], { taza: 175 }),
  I("semola", "Sémola de trigo", "cereal", 360, 12.7, 73, 0.7, 1.1, 0.7, 3.9, ["gluten"], { cda: 12, taza: 165 }),
  I("polenta", "Polenta o harina de maíz", "cereal", 362, 8.1, 76.9, 0.6, 3.6, 2.4, 7.3, [], { cda: 10, taza: 160 }),
  I("trigo_grano", "Trigo en grano", "cereal", 327, 12.6, 71.2, 0.4, 1.5, 1.1, 12.2, ["gluten"], { taza: 190 }),
  I("maiz_frito", "Maíz frito", "cereal", 430, 7, 62, 1, 17, 12, 4, [], { "puñado": 25, ud: 0.5 }),
  I("bizcocho_soletilla", "Bizcochos de soletilla", "cereal", 395, 8.8, 73, 30, 7, 4, 1.5, ["gluten", "huevo"], { ud: 10 }),
  I("magdalena", "Magdalenas", "cereal", 420, 6, 50, 25, 21, 13, 1.5, ["gluten", "huevo"], { ud: 40 }),
  /* Un prefermento es harina y agua a partes iguales, fermentados; sus cifras
     son las de la harina a la mitad, que es exactamente lo que lleva dentro.
     Es la misma licencia que ya se toman la bechamel o la crema pastelera. */
  I("masa_madre", "Masa madre o prefermento", "cereal", 170, 4.9, 35.5, 0.8, 0.6, 0.45, 1.8, ["gluten"], { ud: 200, cda: 20 }),

  /* pescado y marisco */
  I("vieiras", "Vieiras", "marisco", 88, 16.8, 2.4, 0, 0.8, 0.4, 0, ["marisco"], { ud: 30 }),
  I("buey_mar", "Buey de mar o centollo", "marisco", 83, 18, 0, 0, 1.1, 0.6, 0, ["marisco"], { ud: 800 }),

  /* carnes y embutidos */
  I("pato", "Pato (magret, muslo o confit)", "carne", 201, 18.3, 0, 0, 13.9, 10, 0, [], { ud: 300 }),
  I("foie", "Foie o mousse de pato", "carne", 462, 11, 4.7, 1, 44, 26, 0, [], { cda: 20, ud: 100 }),
  I("salchicha", "Salchichas frescas o ahumadas", "carne", 290, 12, 3, 1, 26, 14, 0, [], { ud: 50 }),
  I("butifarra", "Butifarra fresca", "carne", 326, 14, 1, 0.5, 30, 16, 0, [], { ud: 120 }),
  I("pastrami", "Pastrami", "carne", 133, 22, 1, 0.5, 4.5, 2.5, 0, [], { loncha: 20 }),

  /* lácteos */
  I("leche_evaporada", "Leche evaporada", "lácteos", 134, 6.8, 10, 10, 7.6, 2.5, 0, ["lácteos"], { taza: 240, lata: 410 }),
  I("leche_oveja", "Leche de oveja", "lácteos", 108, 6, 5.4, 5.4, 7, 2.5, 0, ["lácteos"], { taza: 245, vaso: 200 }),

  /* despensa y bebidas */
  I("aceite_coco", "Aceite de coco", "aceite y grasas", 892, 0, 0, 0, 99, 9, 0, [], { cda: 14, cdta: 5 }),
  I("cacahuetes", "Cacahuetes", "aceite y grasas", 567, 25.8, 16.1, 4.7, 49.2, 43, 8.5, ["frutos secos"], { "puñado": 30, cda: 12 }),
  I("lino", "Semillas de lino", "aceite y grasas", 534, 18.3, 28.9, 1.5, 42.2, 38, 27.3, [], { cda: 10, cdta: 3 }),
  I("amapola", "Semillas de amapola", "aceite y grasas", 525, 18, 28.1, 3, 41.6, 36, 19.5, [], { cda: 9, cdta: 3 }),
  I("cafe", "Café hecho", "otros", 2, 0.1, 0.3, 0, 0, 0, 0, [], { taza: 125, vaso: 100 }),
  I("cafe_soluble", "Café soluble", "otros", 353, 12.2, 75.4, 0, 0.5, 0.3, 0, [], { cdta: 2, cda: 6 }),
  I("salsa_picante", "Salsa picante (sriracha, tabasco)", "otros", 93, 1.9, 19, 15, 0.9, 0.6, 2.2, [], { cda: 15, cdta: 5 }),
  /* La Worcestershire lleva anchoa: es pescado, y eso el filtro tiene que
     saberlo aunque en la etiqueta ponga «salsa inglesa». */
  I("worcestershire", "Salsa Worcestershire o Perrins", "otros", 78, 0, 19.5, 10, 0, 0, 0, ["pescado"], { cda: 17, cdta: 6 }),
  I("turron_jijona", "Turrón de Jijona", "otros", 540, 14, 40, 36, 35, 28, 5, ["frutos secos"], { ud: 200 }),
  I("refresco_cola", "Refresco de cola", "otros", 42, 0, 10.6, 10.6, 0, 0, 0, [], { vaso: 200, ud: 330 }),
  I("horchata", "Horchata de chufa", "otros", 66, 0.5, 12, 11, 1.5, 1.2, 0.6, [], { vaso: 200, taza: 240 }),
  /* ---------- altas de la primera tanda de Thermomix ----------

     Siete nombres que paró el taller al meter 38 recetas de golpe. Misma
     convención que arriba: por 100 g de alimento crudo, hidratos con la fibra
     dentro, `gs` las grasas insaturadas, cifras de las tablas de composición
     de uso corriente. */
  I("chirivia", "Chirivía", "verdura", 75, 1.2, 18, 4.8, 0.3, 0.15, 4.9, [], { ud: 130 }),
  I("hinojo", "Hinojo (bulbo)", "verdura", 31, 1.2, 7.3, 3.9, 0.2, 0.1, 3.1, [], { ud: 250 }),
  I("nabo", "Nabo", "verdura", 28, 0.9, 6.4, 3.8, 0.1, 0.05, 1.8, [], { ud: 200 }),
  I("trigo_sarraceno", "Trigo sarraceno (en seco)", "cereal", 343, 13.3, 71.5, 0, 3.4, 2.9, 10, [], { taza: 170 }),
  I("tortilla_trigo", "Tortilla de trigo", "cereal", 310, 8.2, 51, 2.5, 7.8, 5.4, 3, ["gluten"], { ud: 45 }),
  /* El extracto de buey y el caramelo líquido se usan a cucharadas, no a
     platos: van con sus conversiones porque así es como los pesa la receta. */
  I("extracto_carne", "Extracto de carne", "otros", 180, 25, 18, 3, 0.5, 0.2, 0, [], { cda: 15, cdta: 5 }),
  I("caramelo", "Caramelo líquido", "otros", 290, 0, 72, 70, 0, 0, 0, [], { cda: 20, cdta: 7 }),

  /* ---------- altas de la auditoría del cuaderno ----------

     Cinco nombres que paraban recetas y que sí son un alimento con una
     composición que se puede citar. Los que se quedaron fuera —«crema de
     semillas», «salsa tandoori», «crema vegana de chipotle», el alga nori en
     polvo— son preparaciones o cifras que cambian tanto entre versiones que
     ponerles un número sería inventarlo: esos se siguen preguntando. */
  I("pina", "Piña", "fruta", 50, 0.5, 13, 9.9, 0.1, 0.05, 1.4, [], { ud: 900, rodaja: 84 }),
  I("nopal", "Nopal (chumbera)", "verdura", 16, 1.3, 3.3, 1.1, 0.1, 0.05, 2.2, [], { ud: 85 }),
  /* Los fideos de arroz van aparte de los de trigo por el alérgeno, que es lo
     que de verdad los distingue: mandar «fideos de arroz» a los fideos de
     siempre le habría puesto gluten a un plato que no lo lleva. */
  I("fideos_arroz", "Fideos de arroz (en seco)", "cereal", 364, 3.4, 83, 0.1, 0.6, 0.2, 1.6, [], { taza: 100 }),
  I("soja_texturizada", "Soja texturizada (en seco)", "legumbre", 336, 52, 30, 9, 1.2, 0.9, 18, ["soja"], { taza: 60 }),
  /* El coco rallado va con los frutos secos y no con la fruta: son 65 g de
     grasa por cada 100, y contarlo como ración de fruta sería mentir en el
     único sitio donde eso se nota. */
  I("coco_rallado", "Coco rallado (deshidratado)", "aceite y grasas", 660, 6.9, 24, 7.4, 65, 5.5, 16, [], { cda: 6, taza: 80 }),
];
