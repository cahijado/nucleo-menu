/* ============================================================
   Del texto de una receta a alimentos de la tabla

   El recetario importado escribe los ingredientes como se hablan: «400 g de
   macarrones (nº 6)», «Sal y pimienta negra recién molida», «Para la masa:
   500 g de harina de fuerza, 350 ml de agua tibia». Aquí se trocean, se les
   quita el ruido y se dejan listos para buscarlos en la tabla de alimentos.

   Nació para preparar los datos —el resultado queda escrito en
   recetario-pdf.js y el navegador no vuelve a hacer ese trabajo— y por eso
   vivía en herramientas/. Vive aquí desde que `leer-receta.js` lee con él las
   recetas que se pegan a mano: el mismo troceo para las 534 de la cadena y
   para la que escribes tú, o serían dos formas distintas de entender «2
   dientes de ajo».
   ============================================================ */

export const sinTildes = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "");

/* palabras que solo dicen en qué viene el alimento, no cuál es */
const PREPARACION = /^(?:zumo|jugo|piel|ralladura|corteza|pulpa|suprema|supremas|lomo|lomos|filete|filetes|rodaja|rodajas|taco|tacos|taquito|taquitos|trozo|trozos|paletilla|pata|muslo|carne|hebras?|puntas?|cola|colas)\s+de\s+/i;

const ENVASE = /^(?:botella|laminas?|vainas?|gotas?|chorrito|chorreon|chorro|vasos?|punado|ramitas?|rama|manojo|latas?|sobres?|bote|tarro|paquete|corteza|tiras?|hojas?|dientes?|unidades?|piezas?|rodajas?|cabeza|raciones?|copita|copa|nuez|hilo|bolsita|red|onza|puntas|base|medida|guarnicion|placas?|filetes?|supremas?|lomos?)\s+de\s+/i;

/* unidades de medida, tal y como las escribe el recetario.

   `mililitros` y compañía, escritos con todas las letras, se añadieron al
   cosechar Hogarmanía: allí no ponen «250 ml de nata», ponen «250 mililitros
   de nata». Sin esto la unidad no se reconocía y el nombre del ingrediente se
   quedaba en «mililitros de nata líquida», que no está en ninguna tabla — y
   solo eso bloqueaba 44 recetas. Van delante de `ml` por claridad; la
   comprobación de que no siga una letra ya impedía que `ml` se comiera el
   principio de `mililitros`. */
const UNIDAD = /^\s*(kg|kilos?|gramos?|gr|mililitros?|centilitros?|decilitros?|g|mg|ml|cl|dl|litros?|l|dientes?|hojas?|latas?|sobres?|cucharaditas?|cucharadas?\s+soperas?|cucharadas?|soperas?|cdas?|cdtas?|pizcas?|punados?|puñados?|lonchas?|lascas?|ramitas?|ramas?|tazas?|vasos?|unidades?|uds?|piezas?|rodajas?|manojos?|chorros?|chorrit[oa]s?|gotas?|copas?|botellas?|paquetes?|bolsas?|tarros?|botes?|rebanadas?|filetes?|medidas?|pastillas?|punadit[oa]s?|puñadit[oa]s?|ramillete?s?)(?![a-záéíóúñü])\.?\s*/i;

/* Fracciones tipográficas. Hogarmanía las usa tal cual en el texto de los
   ingredientes —«½ kilo de panceta», «¼ cucharadita de pimentón»—, y sin
   leerlas la cantidad se quedaba en cero y la unidad sin recortar: el nombre
   del alimento acababa siendo «½ kilo de panceta», que no está en ninguna
   tabla. Se admiten también con un entero delante, como en «1 ½ kg». */
const FRACCIONES = {
  "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};
const VULGAR = "½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞";
const CANTIDAD = /^\s*(?:unos?\s+|unas?\s+)?(\d+(?:[.,]\d+)?\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?)\s*(?:[-–/aoy]\s*\d+(?:[.,]\d+)?)?\s*/;

/* «Media cebolla», «Un vaso de leche», «Medio kilo de panceta».

   La cantidad escrita con letra en vez de con cifra, que es como se escribe
   media receta de casa. Antes se caía por dos sitios a la vez: «media» no era
   nada, y «un» se quitaba como artículo —junto a «el» y «la»— después de haber
   buscado la unidad, así que «Un vaso de leche» perdía el uno Y el vaso: para
   cuando se volvía a mirar, `ENVASE` ya se había comido el vaso por su cuenta.

   Solo cuentan al principio del trozo. En medio de un nombre no son cantidad
   —«queso de media curación»— y por eso van ancladas. */
const CANTIDAD_LETRA = /^\s*(medi[ao]|un|una)(?![a-záéíóúñü])\s*/i;

const COLA = /\s+(?:de\s+(?:buena\s+)?calidad|de\s+sabor\s+\w+|del\s+dia\s+anterior|de\s+la\s+vera|al\s+gusto|para\s+(?:servir|decorar|acompanar|acompañar|freir|freír|guarnicion|guarnición|espolvorear|rebozar|empanar|pintar|montar|el\s+molde|la\s+masa|caramelizar|gratinar|hornear|adornar)\b[^,]*|bien\s+\w+|recien\s+\w+|muy\s+\w+|en\s+su\s+punto|abiertas?\s+\w+(?:\s+\w+)*|ligeramente\s+\w+|preferiblemente\s+\w+|sobrante|adicional|aprox\.?)\b.*$/i;

/* Las formas de corte no son alimentos, y la coma que las precede sí separa:
   «200 g de calabacín, en medias rodajas» se troceaba en dos, y la segunda
   mitad se paraba en el taller pidiendo saber qué alimento es «en medias
   rodajas». Cuantas más recetas entran de golpe, más caro sale: una sola de
   estas colas bloquea la receta entera. Lo mismo con «sin piel ni espinas» y
   con «redondas», que en las judías verdes es la variedad, no la comida. */
const RUIDO = /\b(?:grandes?|medianos?|medianas?|pequenos?|pequenas?|hermosos?|hermosas?|maduros?|maduras?|frescos?|frescas?|tiern[ao]s?|troceados?|troceadas?|laminad[ao]s?|cortados?|cortadas?|limpios?|limpias?|pelados?|peladas?|batidos?|batidas?|(?<!\bde\s)cocidos?|(?<!\bde\s)cocidas?|crudos?|crudas?|molidos?|molidas?|escurridos?|escurridas?|desmigados?|desmigadas?|tostados?|tostadas?|enteros?|enteras?|finos?|finas?|gruesos?|gruesas?|abundantes?|abundate|en\s+(?:medias\s+)?rodajas|en\s+juliana|en\s+tiras|en\s+dados|en\s+cubos|en\s+laminas|en\s+trozos|en\s+aros|en\s+cuartos|en\s+mitades|en\s+filetes|en\s+lonchas|en\s+lonjas|en\s+ramilletes|en\s+anillas|en\s+gajos|en\s+bastones|redond[ao]s?|en\s+polvo|en\s+rama|en\s+grano|en\s+una\s+pieza|en\s+libro|en\s+medallones|en\s+migas|en\s+tacos|en\s+porciones|en\s+rebanadas|en\s+salmuera|naturales?|opcional|extra|caseros?|caseras?|sin\s+pelar|sin\s+semillas|sin\s+piel(?:\s+ni\s+espinas?)?|sin\s+espinas?|con\s+piel|sin\s+hueso|con\s+hueso|de\s+guiso)\b/gi;

/** Cuántos gramos (o mililitros) vale una unidad de medida directa. */
export const A_GRAMOS = {
  kg: 1000, kilo: 1000, kilos: 1000, g: 1, gr: 1, gramo: 1, gramos: 1, mg: 0.001,
  ml: 1, cl: 10, dl: 100, l: 1000, litro: 1000, litros: 1000,
};

/** Nombre de la unidad ya normalizado a singular y sin tildes. */
export function unidadBase(u) {
  const n = sinTildes(String(u ?? "")).toLowerCase().replace(/\.$/, "").replace(/\s+/g, " ").trim();
  /* «cucharada sopera» son dos palabras y una sola medida. Va antes que el
     mapa porque el mapa es de una palabra: sin esto, la unidad se quedaba
     valiendo la frase entera y después no había con qué pesarla. */
  if (/^cucharadas? soperas?$/.test(n)) return "cda";
  const mapa = {
    kilos: "kg", kilo: "kg", gramos: "g", gramo: "g", gr: "g", litros: "l", litro: "l",
    mililitros: "ml", mililitro: "ml", centilitros: "cl", centilitro: "cl",
    decilitros: "dl", decilitro: "dl",
    dientes: "diente", hojas: "hoja", latas: "lata", sobres: "sobre",
    cucharaditas: "cdta", cucharadita: "cdta", cdtas: "cdta",
    cucharadas: "cda", cucharada: "cda", cdas: "cda", soperas: "cda", sopera: "cda",
    pizcas: "pizca", punados: "punado", punado: "punado", lonchas: "loncha", lascas: "loncha",
    ramitas: "rama", ramita: "rama", ramas: "rama", tazas: "taza", vasos: "vaso",
    unidades: "ud", unidad: "ud", uds: "ud", piezas: "ud", pieza: "ud",
    rodajas: "rodaja", manojos: "manojo", chorros: "chorro", gotas: "gota",
    chorrito: "chorro", chorritos: "chorro", chorrita: "chorro",
    punadito: "punado", punaditos: "punado", ramillete: "manojo", ramilletes: "manojo",
    copas: "copa", botellas: "botella", paquetes: "paquete", bolsas: "bolsa",
    tarros: "tarro", botes: "bote", rebanadas: "rebanada", filetes: "filete", medidas: "medida",
    pastillas: "pastilla",
  };
  return mapa[n] || n;
}

/** Trocea una línea de ingredientes en alimentos sueltos. */
export function trocear(linea) {
  let l = String(linea ?? "").trim().replace(/\.$/, "");
  // rótulos de grupo: "Para la masa:", "Relleno:", "Guarnición:"…
  l = l.replace(/^\s*(?:para|relleno|salsa|masa|guarnicion|guarnición|marinada|adobo|glaseado|cobertura|acompanamiento|acompañamiento|base|crema|majado|sofrito|caldo corto)[^:]{0,45}:\s*/i, "");
  // lo que va entre paréntesis siempre aclara al ingrediente anterior, nunca es
  // uno nuevo: se quita aquí, antes de partir por comas, o "(mezcla de ternera
  // y cerdo)" acabaría contando como dos alimentos más
  l = l.replace(/\s*\([^)]*\)?/g, " ");
  return l.split(/\s*\+\s*/)
    .flatMap((a) => a.split(/,(?!\d)\s*/))   // la coma decimal de «1,5 kg» no separa
    .flatMap((b) => b.split(/\s+y\s+(?!\w+\s+(?:de|del)\b)/i))
    .map((c) => c.trim())
    .filter(Boolean);
}

/** Cantidad, unidad y nombre de un trozo ya suelto. */
const aNumero = (t) => {
  const x = String(t).trim();
  const v = x.match(/^(\d+(?:[.,]\d+)?)?\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/);   // "½ kilo", "1 ½ kg"
  if (v) return (v[1] ? Number(v[1].replace(",", ".")) : 0) + FRACCIONES[v[2]];
  const f = x.match(/^(\d+)\s*\/\s*(\d+)$/);          // "1/2 limón"
  return f ? Number(f[1]) / Number(f[2]) : Number(x.replace(",", "."));
};

export function alimento(trozo) {
  let resto = String(trozo ?? "").trim();
  let cantidad = 0, unidad = "";

  // se pela por capas: "Zumo de 2 naranjas" lleva la cantidad en medio, así que
  // hay que quitar el envoltorio antes de poder leerla
  for (let vuelta = 0; vuelta < 4; vuelta++) {
    const antes = resto;
    const mc = resto.match(CANTIDAD);
    if (mc && !cantidad) { cantidad = aNumero(mc[1]); resto = resto.slice(mc[0].length); }
    // la cantidad escrita con letra, y solo si no vino ya con cifra
    const ml = !cantidad && resto.match(CANTIDAD_LETRA);
    if (ml) {
      cantidad = /^medi/i.test(ml[1]) ? 0.5 : 1;
      resto = resto.slice(ml[0].length);
    }
    const mu = resto.match(UNIDAD);
    if (mu && !unidad) { unidad = unidadBase(mu[1]); resto = resto.slice(mu[0].length); }
    resto = resto.replace(/^(?:de|del|la|el|los|las|un|una|unos|unas)\s+/i, "").trim();
    resto = resto.replace(PREPARACION, "").replace(ENVASE, "").trim();
    if (resto === antes) break;
  }

  /* Una medida sin número es una medida: «Manojo de espárragos» es un manojo,
     no cero manojos. Se leía la unidad y se tiraba el uno implícito, y con la
     cantidad en cero `pesar()` daba el brazo a torcer y preguntaba. */
  if (!cantidad && unidad) cantidad = 1;

  // "1 dorada entera de 1 kg": el peso real va dentro del nombre, no delante
  const mp = resto.match(/\bde\s+(\d+(?:[.,]\d+)?)\s*(kg|g|gr|ml|l)\b/i);
  if (mp) { cantidad = aNumero(mp[1]); unidad = unidadBase(mp[2]); resto = resto.replace(mp[0], " "); }

  resto = resto.replace(COLA, "");
  const limpiar = (x) => x.replace(/\s+/g, " ").replace(/^[\s.,;:-]+|[\s.,;:-]+$/g, "");
  const opciones = resto.split(/\s+o\s+|\s*\/\s*/i).map(limpiar).filter(Boolean);
  return { cantidad, unidad, nombre: opciones[0] || "", opciones };
}

/** Formas del nombre a probar contra el diccionario, con y sin plural. */
export function variantes(canon) {
  if (!canon) return [];
  const quitarS = canon.replace(/(\w{3,})s\b/g, "$1");
  const quitarEs = canon.replace(/(\w{3,})es\b/g, "$1");
  const quitarCes = canon.replace(/(\w{2,})ces\b/g, "$1z");
  return [...new Set([canon, quitarS, quitarEs, quitarCes])];
}

/** Forma canónica de un nombre: sin tildes, sin adjetivos, sin cifras. */
export function canonico(nombre) {
  let n = sinTildes(nombre).toLowerCase();
  n = n.replace(/\s*\([^)]*\)/g, " ").replace(/[^a-z0-9%\s/-]/g, " ");
  n = n.replace(RUIDO, " ").replace(/\b\d+\s*%?\b/g, " ");
  n = n.replace(/\s+/g, " ").trim().replace(/^[\s\-/]+|[\s\-/]+$/g, "");
  return n.replace(/^(?:de|del|la|el|los|las)\s+/, "").trim();
}
