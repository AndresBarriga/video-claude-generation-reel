// Fuentes locales (en public/fuentes): renderiza igual con o sin internet.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fuenteTitulo = "Bricolage Grotesque";
export const fuenteTexto = "Figtree";
for (const [family, w, file] of [
  [fuenteTitulo, "700", "bricolage-grotesque-latin-700-normal.woff2"],
  [fuenteTitulo, "800", "bricolage-grotesque-latin-800-normal.woff2"],
  [fuenteTexto, "500", "figtree-latin-500-normal.woff2"],
  [fuenteTexto, "700", "figtree-latin-700-normal.woff2"],
] as const) {
  loadFont({ family, url: staticFile(`fuentes/${file}`), weight: w });
}

export const tema = {
  papel: "#F6EFE3",
  tinta: "#1E1B18",
  suave: "#6B6258",
  linea: "#D9CFBF",
  acento: { escalada: "#D9541E", mascotas: "#2F8F6B", otro: "#D9541E" },
  seguro: { arriba: 200, abajo: 290, lados: 70 },
};
