/* «1 receta» y «2 recetas». Lo dice la interfaz en muchos sitios y conviene
   que lo diga igual en todos. */
export const plural = (n, singular, pluralForma) => `${n} ${n === 1 ? singular : pluralForma}`;
