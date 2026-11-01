// E42 «La puerta»: piezas comunes. Pared de rocódromo vista de frente; la bisagra es la línea entre mano y pie.
import React from "react";
import { random } from "remotion";
import { Resina, RESINA } from "../../piezas/Rocodromo";
import { fuenteTitulo } from "../../tema";
export { C, Camara, Svg, Etiqueta, clamp, type P } from "../Pegue/comun";

export const PU = { pared: "#4C5B73", paredS: "#3E4C60", chaqueta: "#2E7D8C", chaquetaS: "#1F5C69", chaqueta2: "#B5493E", chaqueta2S: "#8A3830", pantalon: "#2B3442", piel: "#D9A37A", pielS: "#B8845E", pelo: "#3B2A20", zapato: "#1B2230", tinta: "#0B1624" };

/** Pared de frente con paneles, tornillos y presas de resina; `marcadas` = presas usadas (grandes, con magnesio). */
export const Pared: React.FC<{ marcadas?: [number, number][] }> = ({ marcadas = [] }) => (
  <g>
    <rect x={-300} y={-500} width={1680} height={2900} fill={PU.pared} />
    {[0, 270, 540, 810, 1080].map((x) => <path key={x} d={`M${x} -500 L${x} 2400`} stroke={PU.paredS} strokeWidth={6} />)}
    {[0, 480, 960, 1440].map((y) => <path key={y} d={`M-300 ${y} L1380 ${y}`} stroke={PU.paredS} strokeWidth={6} />)}
    {Array.from({ length: 12 }).flatMap((_, i) => Array.from({ length: 22 }).map((__, j) => <circle key={`${i}-${j}`} cx={45 + i * 90} cy={40 + j * 90} r={4} fill={PU.paredS} />))}
    {Array.from({ length: 26 }).map((_, i) => <Resina key={i} x={50 + random(`px${i}`) * 980} y={160 + random(`py${i}`) * 1500} r={14 + random(`pr${i}`) * 8} c={RESINA[i % RESINA.length]} seed={`pu${i}`} magnesio={0.2} />)}
    {marcadas.map(([x, y], i) => <Resina key={`m${i}`} x={x} y={y} r={40} c="#E0A526" seed={`mu${i}`} magnesio={0.95} />)}
    <rect x={-300} y={-500} width={1680} height={2900} fill={PU.tinta} opacity={0.18} />
  </g>
);

/** Texto pequeño con contorno (para rótulos sobre la escena). */
export const Txt: React.FC<{ x: number; y: number; t: string; tam?: number; col?: string; ancla?: "start" | "middle" | "end" }> = ({ x, y, t, tam = 54, col = "#fff", ancla = "middle" }) => (
  <text x={x} y={y} textAnchor={ancla} fontFamily={fuenteTitulo} fontWeight={800} fontSize={tam} fill={col} stroke="#050B14" strokeWidth={tam * 0.2} paintOrder="stroke">{t}</text>
);
