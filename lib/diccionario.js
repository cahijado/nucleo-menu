/* ============================================================
   Diccionario: del nombre que usa la receta al alimento de la tabla

   Es una lista ordenada y gana la PRIMERA que casa. El orden no es cosmético:
   «caldo de carne» tiene que resolverse antes que «carne», y «aceite de sésamo»
   antes que «sésamo», o el guiso acabaría contando ternera donde solo hay caldo.
   De ahí que lo compuesto vaya siempre delante de lo simple.

   Se busca por subcadena sobre el nombre ya canónico (sin tildes, sin adjetivos),
   lo que resuelve la cola larga sin una entrada por variante: «lomos de bacalao
   desalado con su piel» casa con /bacalao/ igual que «kokotxas de bacalao».
   ============================================================ */

export const DICCIONARIO = [
  /* ---------- preparados y fondos: primero, o se los come lo simple ---------- */
  [/extracto de (?:buey|carne|ternera)|concentrado de carne/, "extracto_carne"],
  [/caldo.*(carne|ternera|res)|caldo de cocido/, "caldo_carne"],
  [/caldo.*(ave|pollo|gallina)/, "caldo_ave"],
  [/fumet|caldo.*pescado|caldo.*marisco/, "fumet"],
  [/caldo.*(verdura|vegetal)|caldo$/, "caldo_verduras"],
  [/bechamel/, "bechamel"],
  [/crema pastelera/, "crema_pastelera"],
  [/leche condensada/, "leche_condensada"],
  [/leche evaporada|leche ideal/, "leche_evaporada"],
  [/leche de oveja|leche de cabra/, "leche_oveja"],
  [/tomate frito|salsa de tomate|tomate en salsa/, "tomate_frito"],
  [/tomate triturado|tomate en conserva|pulpa de tomate/, "tomate_trit"],
  [/salsa barbacoa|barbacoa/, "salsa_barbacoa"],
  [/salsa picante|sriracha|salsa de chile|harissa/, "salsa_picante"],
  [/worcestershire|perrins|salsa inglesa/, "worcestershire"],
  [/alioli|allioli|ajoaceite/, "alioli"],
  [/ketchup|catchup/, "ketchup"],
  [/mayonesa|salsa rosa/, "mayonesa"],
  [/soja texturizada|proteina (?:de )?soja texturizada|carne de soja/, "soja_texturizada"],
  [/salsa de soja|soja$/, "soja_sg"],
  [/mostaza/, "mostaza"],
  [/tinta de (calamar|sepia)|tinta$/, "tinta_calamar"],
  [/pimiento choricero|carne de pimiento|pulpa de pimiento|choricero|\bnoras?\b/, "pim_choricero"],
  [/mermelada|compota de fruta/, "mermelada"],
  // el panko es pan rallado japonés: más grueso, pero pan rallado
  // «pan rayado» es la falta de siempre, y paraba la receta entera
  [/miga de pan|pan rallado|pan rayado|panko/, "pan_rallado"],

  /* ---------- aceites, vinagres y grasas ---------- */
  /* «Aceite vegetal» y «aceite en aerosol» no dicen de qué son. El de girasol
     es el neutro de referencia y el que más se vende para eso. */
  [/aceite de girasol|aceite de semillas|aceite suave|aceite vegetal|aceite en (?:aerosol|spray)/, "aceite_girasol"],
  [/aceite de sesamo/, "aceite_sesamo"],
  [/aceite de coco/, "aceite_coco"],
  [/aceite de trufa/, "aove"],
  [/aove|aceite de oliva|aceite$|aceite del sofrito/, "aove"],
  [/vinagre de manzana|vinagre de sidra/, "vinagre"],
  [/vinagre/, "vinagre_vino"],
  [/mantequilla|manteca/, "mantequilla"],
  [/tahini|pasta de sesamo/, "tahini"],
  [/crema de cacahuete/, "crema_cacahuete"],

  /* ---------- bebidas de cocina ---------- */
  [/vino tinto|tinto de/, "vino_tinto"],
  [/vino blanco|vino fino|vino de jerez seco|txakoli|albarino|\bcava\b|champan|espumoso|vino$/, "vino_blanco"],
  // el alimento de la tabla es «Vino de Oporto, Pedro Ximénez o Jerez dulce»,
  // así que el jerez a secas cae aquí igual que el jerez dulce
  [/oporto|pedro ximenez|px|moscatel|vino dulce|jerez|vino rancio|marsala|mistela|mirin/, "vino_dulce"],
  [/brandy|conac|cognac|whisky|\bron\b|orujo|licor/, "brandy"],
  [/cerveza/, "cerveza"],
  [/sidra/, "vino_blanco"],

  /* ---------- lácteos ---------- */
  [/helado/, "helado"],
  [/nata montada|nata.*montar|nata.*35|nata para postres/, "nata_montar"],
  // la crema agria mexicana es nata de la misma grasa, 18 % — no es un alimento aparte
  [/nata|crema de leche|crema acida|crema agria|nata agria/, "nata_cocinar"],
  [/leche entera|leche desnatada|leche semi|leche de vaca|leche tibia|leche templada|leche caliente|leche fria|leche$/, "leche_entera"],
  [/leche de coco/, "leche_coco"],
  /* `canonico()` se lleva por delante «tostado» y «seco», que son adjetivos
     en todas partes menos aquí, así que el coco llega solo. Cuando lo hace en
     una lista de la compra es coco rallado: el fresco se compraría por piezas
     y lo diría. */
  [/coco (?:rallado|deshidratado|tostado|seco)|ralladura de coco|^coco$/, "coco_rallado"],
  [/leche de almendra|bebida de almendra/, "bebida_almendra"],
  [/queso parmesano|parmesano|grana padano|pecorino/, "queso_parmesano"],
  [/queso manchego|manchego/, "queso_manchego"],
  [/queso emmental|emmental|gruyer|queso fundente|queso para fundir|queso en lonchas/, "queso_emmental"],
  [/queso crema|philadelphia|queso de untar/, "queso_crema"],
  [/quesito|queso en porciones/, "quesito"],
  [/queso rallado|queso para gratinar/, "queso_rallado"],
  [/queso feta|feta/, "feta"],
  [/queso de cabra/, "queso_cabra"],
  [/burrata|mozzarella/, "burrata"],
  [/requeson|ricotta/, "requeson"],
  [/queso fresco/, "queso_fresco"],
  [/yogur de oveja|yogur griego/, "yogur_oveja"],
  [/yogur de coco/, "yogur_coco"],
  [/yogur/, "yogur_natural"],
  [/queso/, "queso_rallado"],

  /* ---------- huevos ---------- */
  [/huevo de codorniz/, "huevo"],
  [/yema|clara|huevo/, "huevo"],

  /* ---------- carnes ---------- */
  [/jamon iberico|jamon de bellota/, "jamon_iberico"],
  [/jamon serrano|jamon curado|taco de jamon|taquito de jamon|jamon$/, "jamon_serrano"],
  [/jamon cocido|jamon (?:de )?york|fiambre/, "jamon_cocido"],
  [/chorizo/, "chorizo"],
  [/morcilla/, "morcilla"],
  [/sobrasada/, "sobrasada"],
  [/panceta|guanciale|bacon|beicon|tocino/, "panceta"],
  [/salchicha|frankfurt/, "salchicha"],
  [/butifarra/, "butifarra"],
  [/pastrami/, "pastrami"],
  [/secreto|\blagarto\b|presa iberica|presa de cerdo|pluma iberica/, "secreto_iberico"],
  [/carrillera|carrillada/, "carrillera"],
  [/costilla|costillar/, "costilla_cerdo"],
  [/solomillo de cerdo/, "solomillo_cerdo"],
  [/solomillo|medallon.*ternera|entrecot|chuleton|cadera|redondo de ternera/, "ternera"],
  [/carne picada.*(pollo|pavo)|(?:pollo|pavo) picad/, "pollo_picada"],
  [/carne picada.*(cerdo)|cerdo picad/, "cerdo_picada"],
  [/carne picada|carne mixta|carne mezcla|ternera picad|^carne$/, "ternera_picada"],
  [/cinta de lomo|lomo de cerdo|magro de cerdo|cerdo$/, "cerdo_magro"],
  [/carne de ternera|ternera|vacuno|morcillo|rabo de toro/, "ternera"],
  [/pechuga de pollo|pechuga$/, "pollo_pechuga"],
  [/pechuga de pavo|pavo/, "pavo"],
  [/muslo|contramuslo|jamoncito/, "pollo_muslo"],
  [/alita|alas de pollo/, "pollo_alitas"],
  [/pollo entero|pollo troceado|pollo en pedazos|pollo de corral|gallina|pollo$/, "pollo_entero"],
  [/conejo/, "conejo"],
  [/mousse de foie|\bfoie\b|higado de pato/, "foie"],
  [/confit de pato|magret|\bpato\b|\banade\b/, "pato"],
  [/cordero|paletilla|cabrito/, "cordero"],
  [/codorniz|codornices|perdiz/, "codorniz"],
  [/lacon|\bunto\b/, "lacon"],
  [/pollo/, "pollo_pechuga"],

  /* ---------- pescados y mariscos ---------- */
  [/bacalao/, "bacalao"],
  /* «Pescado blanco» a secas: la merluza es el blanco de referencia aquí, y
     lo que de verdad importa —el alérgeno— sale igual con cualquiera. */
  [/merluza|pescadilla|pescado blanco/, "merluza"],
  [/salmon ahumado/, "salmon_ahum"],
  [/salmon/, "salmon"],
  [/bonito.*aceite|atun.*aceite|atun en conserva|ventresca/, "bonito_aceite"],
  [/\bbonito\b|\batun\b/, "atun"],
  // el alimento "caballa" de la tabla es la lata en aceite; la caballa que
  // pide una receta de pescado fresco es otra cosa, y ahora tiene la suya
  [/caballa en (?:aceite|oliva|conserva|escabeche)|lata de caballa/, "caballa"],
  [/caballa|verdel|chicharro|jurel/, "caballa_fresca"],
  [/melva/, "melva"],
  [/\brape\b/, "rape"],
  [/lubina/, "lubina"],
  [/dorada|mojarra|pargo|besugo|sargo/, "dorada"],
  [/trucha/, "trucha"],
  [/boqueron|anchoa/, "boquerones"],
  [/sardina/, "sardinas"],
  [/langostino|gamba|gambon|carabinero|quisquilla|camaron/, "gambas"],
  [/almeja|berberecho|coquina/, "almejas"],
  [/mejillon/, "mejillones"],
  [/bogavante|cigala|langosta/, "bogavante"],
  [/chipiron|txipiron|calamar/, "chipirones"],
  [/sepia|jibia/, "sepia"],
  [/pulpo/, "pulpo"],
  [/vieira|zamburina/, "vieiras"],
  [/buey de mar|centollo|centolla|necora/, "buey_mar"],
  [/rodaballo/, "rodaballo"],
  [/lenguado|gallo$|acedia/, "lenguado"],
  [/caracol/, "caracoles"],
  [/morralla/, "fumet"],
  [/gula/, "gambas"],

  /* ---------- verduras y setas ---------- */
  [/cebolla morada|cebolla roja/, "cebolla_morada"],
  [/cebolleta|cebolla tierna|cebollita/, "cebolleta"],
  [/chalota|escalonia/, "chalota"],
  [/cebolla/, "cebolla"],
  [/\bajos?\b|ajete/, "ajo"],
  [/puerro/, "puerro"],
  [/chirivia|pastinaca/, "chirivia"],
  [/hinojo/, "hinojo"],
  [/pimiento del piquillo|piquillo/, "piquillo"],
  [/pimiento rojo|pimiento morron/, "pim_rojo"],
  [/flor de calabacin|flores de calabacin/, "flor_calabacin"],
  [/pimiento de gernika|pimientos de gernika|gernika|guernica|pimiento del padron|padron/, "pim_pequeno"],
  [/pimiento verde|pimiento italiano/, "pim_verde"],
  [/pimiento amarillo|amarillos morron|pimiento naranja/, "pim_amarillo"],
  [/^pimientos?$/, "pim_verde"],
  [/tomate seco/, "tomate_seco"],
  [/tomate cherry|cherry/, "cherry"],
  [/tomate/, "tomate"],
  [/zanahoria/, "zanahoria"],
  [/patata|cachelo/, "patata"],
  // antes que el boniato a secas, o «fideos de boniato» acabaría siendo boniato
  [/fideos? de boniato|noodles? de boniato|fideos? de batata|dangmyeon/, "fideos_boniato"],
  [/boniato|batata/, "boniato"],
  [/calabacin/, "calabacin"],
  [/berenjena/, "berenjena"],
  [/aceituna negra/, "acei_negra"],
  [/aceituna|oliva rellena/, "acei_verde"],
  [/^negras sin hueso$/, "acei_negra"],
  [/alcaparra/, "alcaparras"],
  [/pepinillo/, "pepinillo"],
  [/pepino/, "pepino"],
  [/pipa de calabaza|semilla de calabaza|pipa de girasol|semilla de girasol/, "pipas_calabaza"],
  [/calabaza/, "calabaza"],
  [/alcachofa/, "alcachofa"],
  [/esparrago/, "esparragos"],
  [/judia verd|judias verd|alubia verd|alubias verd|judia plana|vaina$|ejote/, "judias_verdes"],
  [/\bhabas?\b|habita/, "habas"],
  [/guisante/, "guisantes"],
  [/espinaca/, "espinacas"],
  [/acelga/, "acelgas"],
  [/rucula/, "rucula"],
  [/canonigo/, "canonigos"],
  [/lechuga|escarola/, "lechuga"],
  [/brotes/, "brotes"],
  /* La hoja primero y la raíz después, que es el orden de siempre: de lo
     específico a lo general. Los grelos y el nabo se cuentan aparte porque no
     son la misma comida —verdura de hoja contra hortaliza de raíz— y hasta
     ahora todo «nabo» caía en los grelos. */
  [/grelo|nabiza|hojas? de nabo/, "grelos"],
  [/\bnabo\b/, "nabo"],
  [/col de bruselas|coles de bruselas|bruselas/, "col_bruselas"],
  [/borraja/, "borraja"],
  [/\bcardo\b/, "cardo"],
  [/remolacha/, "remolacha"],
  [/rabanito|\brabano\b/, "rabano"],
  [/endivia|endibia/, "endivia"],
  [/tirabeque/, "tirabeques"],
  [/repollo|col$|lombarda|coliflor/, "repollo"],
  // el bimi es un brócoli cruzado con col china; cuenta como brócoli
  [/brocoli|bimi|broccolini/, "brocoli"],
  [/apio/, "apio"],
  [/portobello/, "portobello"],
  [/champinon/, "champinon"],
  [/seta|boletus|rebozuelo|niscalo|shiitake|trufa/, "setas"],

  /* ---------- legumbres, cereales y masas ---------- */
  [/harina de garbanzo/, "harina_garbanzo"],
  [/garbanzo/, "garbanzos"],
  [/lenteja/, "lentejas_secas"],
  [/alubia|judia blanca|judion|faba|fabe|pocha|frijol|caraota|poroto/, "alubias"],
  [/tofu/, "tofu"],
  [/edamame|soja verde/, "edamame"],
  [/nopal|nopalito/, "nopal"],
  [/\bpina\b|ananas/, "pina"],
  [/harina de fuerza/, "harina_fuerza"],
  [/masa madre/, "masa_madre"],
  // «maicena» con c es como lo escribe Hogarmanía, y como lo escribe casi todo
  // el mundo: es la marca, no el almidón
  [/harina de maiz|maizena|maicena|almidon de maiz/, "maizena"],
  [/harina/, "harina_trigo"],
  [/hojaldre/, "hojaldre"],
  [/masa quebrada|masa brisa/, "masa_quebrada"],
  [/masa de empanada|lamina de masa|masa$/, "hojaldre"],
  [/oblea|empanadilla/, "oblea"],
  [/pan de molde|pan asentado|pan duro|pan candeal|pan de telera|barra de pan|rebanada de pan|pan frito|pan del dia|slice de pan|sopako|hogaza|pan$|picatoste/, "pan_trigo"],
  [/pan sin gluten/, "pan_sg"],
  [/soletilla/, "bizcocho_soletilla"],
  [/magdalena|muffin/, "magdalena"],
  [/galleta/, "galleta_maria"],
  // antes que el arroz a secas, o «fideos de arroz» acabaría siendo arroz
  [/fideos? de arroz|noodles? de arroz|vermicelli de arroz/, "fideos_arroz"],
  [/arroz/, "arroz"],
  [/quinoa/, "quinoa"],
  [/avena/, "avena"],
  [/tortita de maiz/, "tortitas_maiz"],
  [/maiz frito|maices fritos|granos de maiz frito|kikos/, "maiz_frito"],
  [/mazorca|maiz dulce|maiz en grano|maiz cocido|\bmaiz\b/, "maiz"],
  [/cuscus|couscous/, "cuscus"],
  [/semola/, "semola"],
  [/polenta/, "polenta"],
  [/trigo sarraceno|alforfon|\bsarraceno\b/, "trigo_sarraceno"],
  [/tortilla de trigo|tortilla de harina|tortilla mexicana|tortilla integral|\bwrap\b/, "tortilla_trigo"],
  [/trigo en grano|^trigo$/, "trigo_grano"],
  [/macarron|espagueti|tallarin|penne|fusilli|espiral|canelon|lasana|raviol|noqui|pasta/, "pasta_trigo"],
  [/fideo/, "fideos"],
  [/caramelo liquido|caramelo/, "caramelo"],
  [/levadura quimica|impulsor|royal|gasificante/, "levadura_quimica"],
  [/levadura/, "levadura_fresca"],
  [/gelatina|cola de pescado|agar/, "gelatina"],

  /* ---------- fruta ---------- */
  [/limon|lima/, "limon"],
  [/naranja/, "naranja"],
  [/manzana/, "manzana"],
  [/\bperas?\b/, "pera"],
  [/platano/, "platano"],
  [/melocoton|nectarina/, "melocoton"],
  [/melon/, "melon"],
  [/kiwi/, "kiwi"],
  [/granada/, "granada"],
  [/castana/, "castanas"],
  [/higo seco|higos secos/, "higo_seco"],
  [/\bhigos?\b|breva/, "higo"],
  [/dulce de membrillo|carne de membrillo|cabello de angel/, "mermelada"],
  [/membrillo/, "membrillo"],
  [/confitada|confitado|escarchada|escarchado/, "fruta_confitada"],
  [/albaricoque|orejon/, "albaricoque"],
  [/frambuesa|mora$|grosella/, "frambuesa"],
  [/fresa|freson/, "fresa"],
  [/arandano|frutos rojos/, "arandanos"],
  [/mango/, "mango"],
  [/aguacate/, "aguacate"],
  [/datil/, "datil"],
  [/\bpasas?\b|ciruela|\buvas?\b/, "pasas"],

  /* ---------- frutos secos y semillas ---------- */
  [/nuez moscada/, "especias"],
  [/almendra/, "almendras"],
  [/cacahuete/, "cacahuetes"],
  [/semilla de lino|\blino\b|linaza/, "lino"],
  [/semilla de amapola|amapola/, "amapola"],
  [/nuez|nueces/, "nueces"],
  [/pinon|avellana|pistacho|anacardo|fruto seco/, "nueces"],
  [/pipa de calabaza|semilla de calabaza/, "pipas_calabaza"],
  [/pipa de girasol|semilla de girasol/, "pipas_calabaza"],
  [/sesamo/, "sesamo"],
  [/chia/, "chia"],

  /* ---------- dulces ---------- */
  [/azucar glass|azucar glas|azucar lustre/, "azucar_glass"],
  [/azucar|panela/, "azucar"],
  [/\bmiel\b/, "miel"],
  [/chocolate|cacao/, "chocolate_negro"],
  [/vainilla/, "vainilla"],
  [/turron/, "turron_jijona"],
  [/canela/, "canela"],

  /* ---------- especias, hierbas y fondo de armario ---------- */
  [/guindilla|cayena|chile|tabasco/, "guindilla"],
  [/aji molido|\baji\b|alegria riojana|espelette/, "guindilla"],
  [/wasabi/, "especias"],
  [/perejil|cilantro|albahaca|eneldo|cebollino|menta|hierbabuena|estragon|salvia|hierbas/, "hierbas"],
  [/laurel|tomillo|romero|oregano/, "hierbas"],
  [/bicarbonato|nigela|nigella/, "especias"],
  [/condimento (?:mexicano|para fajitas|cajun)|sazonador|mezcla de especias|hierbas provenzales|finas hierbas|garam masala|ras el hanout/, "especias"],
  [/pimenton|pimienta|comino|azafran|curry|curcuma|\bclavos?\b|jengibre|nuez moscada|\bespecias?\b|colorante|\banis\b|cayena|pimenta/, "especias"],
  [/\bsal\b|\bsal(?:es|ada|adas)\b/, "sal"],
  [/cafe soluble|cafe instantaneo/, "cafe_soluble"],
  [/\bcafes?\b/, "cafe"],
  [/refresco de cola|coca cola|cocacola/, "refresco_cola"],
  [/horchata/, "horchata"],
  [/\baguas?\b|hielo/, "agua"],
];

/* Cuando la receta no dice cantidad, lo que se cuenta. Son las cifras de
   quien cocina a ojo: un chorro de aceite, una pizca de sal. Solo se aplica a
   lo que de verdad se usa así; para lo demás, sin cantidad no hay cálculo. */
export const A_OJO = {
  /* aliños y condimentos: un chorro, una pizca */
  aove: 15, aceite_girasol: 15, sal: 1, especias: 0.5, hierbas: 2, canela: 1,
  vainilla: 1, guindilla: 2, vinagre: 10, vinagre_vino: 10, mostaza: 5,
  soja_sg: 10, miel: 10, limon: 30, agua: 100, vino_blanco: 10,
  /* lo que se usa para rebozar, espolvorear o ligar */
  azucar: 10, azucar_glass: 5, mantequilla: 15, harina_trigo: 15, maizena: 8,
  pan_rallado: 20, queso_rallado: 25, huevo: 60, sesamo: 5, pim_choricero: 15,
  /* acompañamientos: pan para mojar, una salsa al lado, unos frutos secos */
  pan_trigo: 60, alioli: 20, mayonesa: 20, mermelada: 20, crema_pastelera: 30,
  chocolate_negro: 20, nata_montar: 30, tahini: 15, harina_garbanzo: 15, rucula: 20,
  helado: 60, salsa_picante: 5, semola: 20,
  nueces: 15, almendras: 15, calabaza: 10, pipas_calabaza: 10, ajo: 4,
  jamon_serrano: 20, canonigos: 30, lechuga: 40, cherry: 60, arandanos: 30,
  arroz: 150, fumet: 200, acei_verde: 20, acei_negra: 20, gambas: 100,
  brandy: 20, vino_tinto: 100, vino_dulce: 30, lacon: 30, tomate_frito: 30,
};

/* Restos del troceo que no nombran ningún alimento: adjetivos sueltos, formas
   de corte, trozos de frase que quedaron colgando. No cuentan como ingrediente
   sin reconocer, porque no hay nada que reconocer. */
/* Un trozo que empieza por «con el/la…» aclara al ingrediente de al lado
   —«1000 g de conejo en trozos, con el hígado»— y no nombra una compra
   aparte. «con su …» ya estaba; faltaba el artículo suelto. */
export const RESTOS = /^(?:picad[ao]s?|medio|prefermento|poolish|verdes?|secos?|picante|dulce|entera?s?|abiert[ao]s?.*|en (?:anillas|dos|cuartos|mitades|su punto|abanico)|con (?:piel|hueso|escamas)|con (?:el|la|los|las) .*|sin (?:piel|hueso|espinas)|ralladura|zumo|caldo de|de|espinas?|piel|hueso|desalad[ao]s?|con su .*|para .*|variad[ao]s?|frutas variadas)$/;

/** ¿Este trozo es un resto del troceo y no un alimento? */
export const esResto = (canon) => !canon || RESTOS.test(canon);

/**
 * Alimento de la tabla para un nombre canónico, o "" si ninguno.
 * Se prueban las formas singulares del nombre, y después las alternativas que
 * la receta ofrecía tras un «o», por si la primera no está en la tabla.
 */
export function buscar(canon, variantes = (x) => [x]) {
  const formas = variantes(canon).filter(Boolean);
  // El diccionario va por fuera: manda su orden, no el de las variantes. Al
  // revés, «pechugas de pollo» agotaba la lista con el plural y caía en la
  // regla genérica /pollo$/ antes de llegar a probar «pechuga de pollo».
  for (const [patron, id] of DICCIONARIO) {
    for (const forma of formas) if (patron.test(forma)) return id;
  }
  return "";
}
