// KIT de cuerda · base: paleta, cámara y utilidades comunes. Ver docs/kit.md.
export { C, Etiqueta, Svg, clamp, golpe, W, H, type P } from "../../historias/Pegue/comun";

/** Paleta «cueva al anochecer»: azul frío, caliza gris, la cuerda naranja es lo único cálido. */
export const PC = {
  cieloA: "#0F1F3A", cieloB: "#28507A", cieloC: "#6E95B4", horizonte: "#D9A27A",
  lejos: "#36506E", medio: "#24384F", rio: "#9FC3D8",
  roca: "#6C7480", rocaS: "#4E5560", rocaL: "#8A929C", ocre: "#9C805E", techo: "#2A303A", suelo: "#3A3F46",
  miedo: "#E2533F", cabeza: "#CFE3F2", tinta: "#081120",
};
/** Punto del mundo. En una cuerda, `sag`/`sx` = comba (px) del tramo que LLEGA a este punto. */
export type Pt = { x: number; y: number; sag?: number; sx?: number };
/** Cámara: (cx, cy) del mundo al centro de pantalla con zoom z. */
export const cam = (cx: number, cy: number, z: number) => `translate(540 960) scale(${z}) translate(${-cx} ${-cy})`;
export const suave = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
