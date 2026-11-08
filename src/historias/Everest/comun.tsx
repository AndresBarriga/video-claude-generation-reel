// E53 «Sharp / Everest»: piezas comunes. Noche azul fría, un cono de luz naranja de frontal, nieve cayendo, escarcha.
import React from "react";
import { random } from "remotion";
export { C, Camara, Svg, clamp, golpe, type P } from "../Pegue/comun";
export { Rotulo, Chip, ei, salida } from "../Pump/comun";

export const NOCHE = { cieloA: "#050B14", cieloB: "#13243B", nieve: "#C9D8E6", nieveS: "#8FA5BC", roca: "#1A2230", rocaS: "#0F1620", luz: "#FFB36B", escarcha: "#F4FAFF" };

/** Nieve cayendo (n copos), deriva a la derecha por el viento. */
export const Nieve: React.FC<{ f: number; n?: number; op?: number }> = ({ f, n = 70, op = 0.7 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const sp = 2.2 + random(`ns${i}`) * 3.4, x0 = random(`nx${i}`) * 1300 - 100, y0 = random(`ny${i}`) * 2100;
    const x = (x0 + f * (1.6 + random(`nw${i}`) * 2.2)) % 1300 - 100, y = (y0 + f * sp) % 2100 - 100;
    return <circle key={i} cx={x} cy={y} r={2 + random(`nr${i}`) * 4.5} fill="#fff" opacity={op * (0.35 + random(`no${i}`) * 0.65)} />;
  })}</g>
);

/** Escarcha en una zona (pestañas, mejillas, hombros): puntitos blancos sobre un círculo de radio r. */
export const Escarcha: React.FC<{ x: number; y: number; r: number; n?: number; seed?: string; op?: number }> = ({ x, y, r, n = 26, seed = "e", op = 0.9 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const a = random(`${seed}a${i}`) * Math.PI * 2, d = Math.sqrt(random(`${seed}d${i}`)) * r;
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={1.5 + random(`${seed}r${i}`) * 3.5} fill={NOCHE.escarcha} opacity={op * (0.5 + random(`${seed}o${i}`) * 0.5)} />;
  })}</g>
);

/** Foco de luz (de frontal): cono desde (x,y) hacia (tx,ty). */
export const Cono: React.FC<{ x: number; y: number; tx: number; ty: number; ancho?: number; op?: number; id: string }> = ({ x, y, tx, ty, ancho = 260, op = 0.4, id }) => {
  const dx = tx - x, dy = ty - y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  return (
    <g>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={tx} y2={ty}><stop offset="0" stopColor="#FFE9B8" stopOpacity={op} /><stop offset="1" stopColor="#FFB36B" stopOpacity={0} /></linearGradient></defs>
      <path d={`M${x} ${y} L${tx + nx * ancho} ${ty + ny * ancho} L${tx - nx * ancho} ${ty - ny * ancho} Z`} fill={`url(#${id})`} />
    </g>
  );
};
