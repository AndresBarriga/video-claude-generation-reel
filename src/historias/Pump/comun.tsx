// E43 «Las cinco fases del pump»: piezas comunes. Idea visual: un antebrazo de lado agarrado a una presa; la barra PUMP (5 bloques = 5 fases) siempre a la derecha.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { fuenteTexto, fuenteTitulo } from "../../tema";
export { C, Camara, Svg, clamp, type P } from "../Pegue/comun";
export { Txt } from "../Puerta/comun";
import { clamp } from "../Pegue/comun";

export const PM = { pared: "#3F4D63", paredS: "#34415A", piel: "#D9A37A", pielS: "#B8845E", manga: "#2E7D8C", mangaS: "#1F5C69", tinta: "#0B1624", musculo: "#C4534F", musculoS: "#9E3D3B", arteria: "#E0575A", vena: "#4C6FB5", presa: "#E0A526", presaS: "#A97812", mg: "#F4F7FA", hielo: "#8EC9E8", residuo: "#C8D84A", gorro: "#B5493E" };
export const BLOQUES = ["#5FD1C5", "#E8C547", "#FF9A3C", "#FF6A1F", "#E04646"];

export const salida = Easing.bezier(0.2, 0.75, 0.2, 1);
export const suave = Easing.inOut(Easing.cubic);
/** Interpola con ease-out entre dos fotogramas. */
export const ei = (f: number, a: number, b: number, v0: number, v1: number, easing = salida) => interpolate(f, [a, b], [v0, v1], { ...clamp, easing });

/** Pared de rocódromo vista de cerca: paneles, tornillos, presas desenfocadas y viñeta. */
export const Fondo: React.FC<{ foco?: number }> = ({ foco = 1 }) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2500} fill={PM.pared} />
    {[0, 360, 720, 1080].map((x) => <path key={x} d={`M${x} -300 L${x} 2200`} stroke={PM.paredS} strokeWidth={8} />)}
    {[300, 900, 1500].map((y) => <path key={y} d={`M-300 ${y} L1380 ${y}`} stroke={PM.paredS} strokeWidth={8} />)}
    {Array.from({ length: 9 }).flatMap((_, i) => Array.from({ length: 14 }).map((__, j) => <circle key={`${i}-${j}`} cx={60 + i * 120} cy={50 + j * 140} r={5} fill={PM.paredS} />))}
    {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={random(`fx${i}`) * 1080} cy={200 + random(`fy${i}`) * 1500} rx={26 + random(`fr${i}`) * 20} ry={18 + random(`fr${i}`) * 14} fill={["#C8566B", "#2FA39A", "#4F7FC9", "#6FA34A"][i % 4]} opacity={0.16 * foco} />)}
    <defs><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.55" /></radialGradient></defs>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#vig)" />
  </g>
);

/** Rótulo superior con entrada y salida (solo datos: 1-3 palabras). */
export const Rotulo: React.FC<{ f: number; ini: number; fin?: number; t: string; y?: number; tam?: number; col?: string }> = ({ f, ini, fin = 1e9, t, y = 230, tam = 96, col = "#fff" }) => {
  const o = interpolate(f, [ini, ini + 6, fin - 6, fin], [0, 1, 1, 0], clamp), k = ei(f, ini, ini + 12, 0.85, 1);
  if (o <= 0) return null;
  return <text x={540} y={y} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={tam} fill={col} stroke="#050B14" strokeWidth={tam * 0.2} paintOrder="stroke" opacity={o} transform={`translate(540 ${y}) scale(${k}) translate(-540 ${-y})`}>{t}</text>;
};

/** Etiqueta pequeña con línea guía, para nombrar partes del dibujo. */
export const Chip: React.FC<{ x: number; y: number; t: string; o?: number; col?: string }> = ({ x, y, t, o = 1, col = "#fff" }) => (
  <g opacity={o}>
    <rect x={x - t.length * 13 - 20} y={y - 36} width={t.length * 26 + 40} height={70} rx={35} fill="#0B1624" opacity={0.88} stroke={col} strokeWidth={4} />
    <text x={x} y={y + 14} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={40} fill={col}>{t}</text>
  </g>
);

export type CaraM = "normal" | "calor" | "esfuerzo" | "dolor" | "alivio";
/** Cabeza del escalador en un círculo (la «cara» de la cuenta): reacciona a cada fase. */
export const Cabeza: React.FC<{ x: number; y: number; r?: number; cara: CaraM; aro?: string; o?: number }> = ({ x, y, r = 100, cara, aro = "#fff", o = 1 }) => {
  const k = r / 100, st = { stroke: "#141B26", strokeWidth: 6 * k, strokeLinecap: "round" as const, fill: "none" };
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r + 10} fill={aro} /><circle r={r} fill="#2A3548" />
      <clipPath id="cabC"><circle r={r} /></clipPath>
      <g clipPath="url(#cabC)">
        <ellipse cx={0} cy={r * 0.95} rx={r * 0.95} ry={r * 0.55} fill={PM.manga} />
        <circle cx={0} cy={6 * k} r={r * 0.62} fill={PM.piel} stroke="#141B26" strokeWidth={6 * k} />
        <path d={`M${-r * 0.66} ${-4 * k} Q0 ${-r * 1.05} ${r * 0.66} ${-4 * k} L${r * 0.66} ${-r * 0.22} Q0 ${-r * 0.8} ${-r * 0.66} ${-r * 0.22} Z`} fill={PM.gorro} stroke="#141B26" strokeWidth={6 * k} strokeLinejoin="round" />
        <path d={`M${-r * 0.3} ${r * 0.28} Q0 ${r * 0.72} ${r * 0.3} ${r * 0.28}`} fill="#4A3426" opacity={0.0} />
        {cara === "alivio" ? <><path d={`M${-28 * k} ${8 * k} q${9 * k} ${-11 * k} ${18 * k} 0 M${10 * k} ${8 * k} q${9 * k} ${-11 * k} ${18 * k} 0`} {...st} /><path d={`M${-14 * k} ${34 * k} Q0 ${50 * k} ${14 * k} ${34 * k}`} {...st} /></>
          : cara === "dolor" ? <><path d={`M${-30 * k} ${0} l${16 * k} ${8 * k} l${-16 * k} ${8 * k} M${30 * k} ${0} l${-16 * k} ${8 * k} l${16 * k} ${8 * k}`} {...st} /><path d={`M${-16 * k} ${40 * k} q${8 * k} ${-10 * k} ${16 * k} 0 q${8 * k} ${10 * k} ${16 * k} 0`} {...st} /></>
          : cara === "esfuerzo" ? <><circle cx={-18 * k} cy={8 * k} r={5 * k} fill="#141B26" /><circle cx={18 * k} cy={8 * k} r={5 * k} fill="#141B26" /><path d={`M${-30 * k} ${-6 * k} L${-8 * k} ${0} M${30 * k} ${-6 * k} L${8 * k} ${0}`} {...st} /><rect x={-16 * k} y={30 * k} width={32 * k} height={14 * k} rx={4 * k} fill="#fff" stroke="#141B26" strokeWidth={5 * k} /></>
          : <><circle cx={-18 * k} cy={8 * k} r={5 * k} fill="#141B26" /><circle cx={18 * k} cy={8 * k} r={5 * k} fill="#141B26" /><path d={`M${-12 * k} ${34 * k} Q0 ${42 * k} ${12 * k} ${34 * k}`} {...st} /></>}
        {cara === "calor" && <path d={`M${r * 0.52} ${-r * 0.1} q${8 * k} ${16 * k} 0 ${22 * k} q${-8 * k} ${-6 * k} 0 ${-22 * k}`} fill="#9ED8F2" stroke="#141B26" strokeWidth={3 * k} />}
      </g>
    </g>
  );
};

/** Barra vertical en bloques. `v` = 0..n bloques llenos (fraccionario). */
export const BarraBloques: React.FC<{ x: number; y0: number; y1: number; v: number; n?: number; ancho?: number; cols: string[]; etiqueta: string; nota?: string; o?: number; numeros?: boolean; pulso?: number }> = ({ x, y0, y1, v, n = 5, ancho = 58, cols, etiqueta, nota, o = 1, numeros, pulso = 0 }) => {
  if (o <= 0) return null;
  const H = (y1 - y0) / n, g = 8;
  return (
    <g opacity={o} transform={`translate(${pulso * (Math.sin(v * 80) > 0 ? 2 : -2)} 0)`}>
      <text x={x} y={y0 - 26} textAnchor="middle" fontFamily={fuenteTitulo} fontWeight={800} fontSize={etiqueta.length > 5 ? 30 : 40} fill="#fff" stroke="#050B14" strokeWidth={8} paintOrder="stroke">{etiqueta}</text>
      {Array.from({ length: n }).map((_, i) => {
        const yb = y1 - (i + 1) * H, ll = Math.max(0, Math.min(1, v - i));
        return (
          <g key={i}>
            <rect x={x - ancho / 2} y={yb + g / 2} width={ancho} height={H - g} rx={12} fill="#0B1624" opacity={0.85} stroke="#fff" strokeWidth={3} />
            {ll > 0 && <rect x={x - ancho / 2 + 5} y={yb + g / 2 + 5 + (H - g - 10) * (1 - ll)} width={ancho - 10} height={(H - g - 10) * ll} rx={8} fill={cols[i % cols.length]} />}
            {numeros && <text x={x - ancho / 2 - 22} y={yb + H / 2 + 12} textAnchor="end" fontFamily={fuenteTitulo} fontWeight={800} fontSize={36} fill="#fff" stroke="#050B14" strokeWidth={7} paintOrder="stroke">{i + 1}</text>}
          </g>
        );
      })}
      {nota && <text x={x} y={y1 + 40} textAnchor="middle" fontFamily={fuenteTexto} fontWeight={700} fontSize={22} fill="#C9D3DE" opacity={0.85}>{nota}</text>}
    </g>
  );
};

/** Posición del antebrazo en pantalla: sube en diagonal hacia la presa de arriba a la derecha. */
export const BR = { x: 150, y: 990, s: 0.8, rot: -20 };
/** Punto del mundo (px) para una coordenada local del brazo. */
export const mundo = (lx: number, ly: number): [number, number] => {
  const a = (BR.rot * Math.PI) / 180, X = lx * BR.s, Y = ly * BR.s;
  return [BR.x + X * Math.cos(a) - Y * Math.sin(a), BR.y + X * Math.sin(a) + Y * Math.cos(a)];
};

/** Cronómetro: la cuña se llena en el sentido del reloj desde las 12 (60 min = vuelta completa). Se lee «cuánto ha pasado», no la hora. */
export const Cronometro: React.FC<{ x: number; y: number; r?: number; min: number; col: string }> = ({ x, y, r = 90, min, col }) => {
  const a = (Math.min(60, Math.max(0.01, min)) / 60) * Math.PI * 2, px = x + Math.sin(a) * (r - 8), py = y - Math.cos(a) * (r - 8);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 10} fill="#1E2733" /><circle cx={x} cy={y} r={r} fill="#F4F2EE" />
      <path d={`M${x} ${y} L${x} ${y - (r - 8)} A${r - 8} ${r - 8} 0 ${a > Math.PI ? 1 : 0} 1 ${px} ${py} Z`} fill={col} opacity={0.9} />
      {Array.from({ length: 12 }).map((_, i) => { const t = (i / 12) * Math.PI * 2; return <circle key={i} cx={x + Math.sin(t) * (r - 4)} cy={y - Math.cos(t) * (r - 4)} r={i % 3 ? 3 : 6} fill="#141B26" />; })}
      <path d={`M${x} ${y} L${px} ${py}`} stroke="#141B26" strokeWidth={8} strokeLinecap="round" /><circle cx={x} cy={y} r={9} fill="#C9384A" />
    </g>
  );
};
