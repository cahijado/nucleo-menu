/* ============================================================
   Limpieza de texto de archivo: la parte sin dependencias de
   src/lib/archivos.js (la app). Lo demás —leer PDF, pdfjs-dist— es
   cosa del navegador y se queda allí; esto lo usan tanto la app como
   el taller, para limpiar el markdown antes de trocearlo.
   ============================================================ */

/** Deja el markdown en texto legible, pero conserva los títulos: sirven para trocear. */
export function limpiarMarkdown(texto) {
  return String(texto ?? "")
    /* Los comentarios de HTML se van enteros, y no es un adorno: es la forma
       de escribir una nota dentro de un archivo de receta —una plantilla con
       instrucciones, un recordatorio a medias— sin que el lector cuente esas
       líneas como ingredientes o como pasos. */
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^```[^\n]*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")          // imágenes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")       // enlaces: se queda el texto
    .replace(/^\s{0,3}>\s?/gm, "")                 // citas
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|\s)\*(\S(?:.*?\S)?)\*(?=\s|$)/g, "$1$2")
    .replace(/^\s{0,3}[-*_]{3,}\s*$/gm, "")        // separadores
    .replace(/[ \t]+$/gm, "");
}
