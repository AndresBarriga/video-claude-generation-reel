// E46 «¿Llega tu cuerda?»: piezas comunes. Idea visual: la cuerda naranja y el hueco entre su extremo y el suelo.
import React from "react";
import { random } from "remotion";
import { Cuerda, tonos } from "../Pegue/comun";
export { Cuerda, tonos };
export { C, Camara, Svg, clamp, type P } from "../Pegue/comun";
export { Rotulo, Chip, ei, salida } from "../Pump/comun";

export const H_DIA = 0.8; // hora del día (atardecer)
export const ASP = { chaqueta: "#3E6E8E", chaquetaSombra: "#2C506A", casco: "#E8C547", pelo: "#2B2118", piel: "#C98E67", pielSombra: "#A8714E", peinado: "corto" as const };
export const bordeX = (y: number, x0 = 690) => x0 + 22 * Math.sin(y / 170) + 14 * Math.sin(y / 53);

/** Pared de roca a la derecha, en coordenadas de mundo. */
export const Roca: React.FC<{ y0: number; y1: number; x0?: number }> = ({ y0, y1, x0 = 690 }) => {
  const t = tonos(H_DIA), pts: string[] = [];
  for (let y = y0; y <= y1; y += 40) pts.push(`${bordeX(y, x0).toFixed(1)} ${y}`);
  return (
    <g>
      <defs><linearGradient id="rocaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6A7B93" /><stop offset="0.45" stopColor="#4C5B73" /><stop offset="1" stopColor="#37445A" /></linearGradient></defs>
      <path d={`M${pts.join(" L")} L1300 ${y1} L1300 ${y0} Z`} fill="url(#rocaG)" />
      <path d={`M${pts.join(" L")}`} fill="none" stroke="#0B1624" strokeOpacity={0.35} strokeWidth={10} /><path d={`M${pts.join(" L")}`} fill="none" stroke="#F0B27A" strokeOpacity={0.5} strokeWidth={5} transform="translate(-5 0)" />
      {Array.from({ length: Math.ceil((y1 - y0) / 90) }).map((_, i) => {
        const y = y0 + i * 90 + random(`g${i}`) * 60, x = bordeX(y, x0) + 40 + random(`gx${i}`) * 260;
        return <path key={i} d={`M${x} ${y} l${20 + random(`gl${i}`) * 50} ${40 + random(`gh${i}`) * 70}`} stroke="#0B1624" strokeOpacity={0.22} strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Suelo del valle con árboles oscuros, en y de mundo. */
export const Suelo: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-200} y={y} width={1500} height={900} fill={tonos(H_DIA).suelo} />
    {Array.from({ length: 14 }).map((_, i) => { const x = -60 + i * 95 + random(`t${i}`) * 30, h = 90 + random(`th${i}`) * 90; return <path key={i} d={`M${x - 34} ${y + 8} L${x} ${y - h} L${x + 34} ${y + 8} Z`} fill="#0F1C20" opacity={0.92} />; })}
  </g>
);

/** Extremo de la cuerda: puntera oscura y fibras sueltas. */
export const Extremo: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-8} y={-4} width={16} height={22} rx={4} fill="#3A1A0A" />
    {[-5, 0, 5].map((dx) => <path key={dx} d={`M${dx} 16 q${dx * 0.8} 10 ${dx * 1.6} 18`} stroke="#FF8A4A" strokeWidth={3} strokeLinecap="round" fill="none" />)}
  </g>
);

/** Reunión: placa con anilla. */
export const Anclaje: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-30} width={40} height={60} rx={10} fill="#8C97A6" stroke="#0B1624" strokeWidth={5} />
    <circle cx={0} cy={0} r={20} fill="none" stroke="#C9D2DC" strokeWidth={9} /><circle cx={0} cy={-18} r={5} fill="#0B1624" />
  </g>
);

/** Silueta sin cara (planos generales del caso real): colgada de la cuerda, mira a la derecha. (x, y) = cadera. */
export const Silueta: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 2.4, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <g stroke="#0A121C" strokeLinecap="round" fill="none">
      <path d="M0 2 L-7 38 M2 2 L12 36" strokeWidth={9} /><path d="M2 -36 L12 -78" strokeWidth={7} /><path d="M0 -36 L-8 -4" strokeWidth={7} />
    </g>
    <rect x={-10} y={-46} width={20} height={50} rx={8} fill="#0A121C" /><circle cx={3} cy={-58} r={11} fill="#0A121C" />
    <path d="M-7 -64 A13 13 0 0 1 14 -66 Z" fill="#1B2A3C" />
  </g>
);

/** Nudo de tope (bola con vueltas) en el extremo. */
export const Nudo: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => k <= 0 ? null : (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <ellipse cx={0} cy={0} rx={22} ry={18} fill="#FF6A1F" stroke="#B8460E" strokeWidth={5} />
    <path d="M-16 -4 Q0 8 16 -4 M-14 6 Q0 -6 14 6" stroke="#B8460E" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** Puño enguantado agarrando una cuerda vertical (vista frontal). (x, y) = centro; `manga` = hacia dónde sale el antebrazo. */
export const Puno: React.FC<{ x: number; y: number; s?: number; manga?: [number, number] }> = ({ x, y, s = 1, manga = [150, -420] }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M20 -10 L${manga[0]} ${manga[1]}`} stroke="#2C506A" strokeWidth={150} strokeLinecap="round" />
    <path d={`M20 -10 L${manga[0]} ${manga[1]}`} stroke="#3E6E8E" strokeWidth={128} strokeLinecap="round" />
    <rect x={-100} y={-82} width={200} height={164} rx={58} fill="#1B2230" stroke="#0B1624" strokeWidth={8} />
    {[-48, -16, 16, 48].map((dy) => <path key={dy} d={`M-92 ${dy} Q-20 ${dy - 10} 92 ${dy}`} stroke="#34425A" strokeWidth={6} fill="none" strokeLinecap="round" />)}
    <ellipse cx={70} cy={-70} rx={52} ry={32} fill="#1B2230" stroke="#0B1624" strokeWidth={8} transform="rotate(-24 70 -70)" />
    <rect x={-56} y={60} width={150} height={26} rx={13} fill="#34425A" opacity={0.7} />
  </g>
);

/** Cielo de hora azul con peñones lejanos y brillo cálido en el horizonte (fijo, no se desplaza con la cámara). */
export const CieloNubes: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="cnS" gradientUnits="userSpaceOnUse" x1="0" y1={-300} x2="0" y2={1700}><stop offset="0" stopColor="#0F1B38" /><stop offset="0.5" stopColor="#2E4676" /><stop offset="0.85" stopColor="#E59A6A" /><stop offset="1" stopColor="#F7D3A0" /></linearGradient>
      <radialGradient id="cnG"><stop offset="0" stopColor="#FFE2B0" stopOpacity="0.9" /><stop offset="1" stopColor="#FFE2B0" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={-300} y={-500} width={1680} height={2800} fill="url(#cnS)" />
    <circle cx={200} cy={1420} r={420} fill="url(#cnG)" />
    {[[40, 1500, 180], [330, 1500, 120], [560, 1500, 230], [860, 1500, 150], [1060, 1500, 200]].map(([x, y, h], i) => <path key={i} d={`M${x - 190} ${y} L${x - 20 + random(`pk${i}`) * 40} ${y - h} L${x + 190} ${y} Z`} fill="#2A3558" opacity={0.85} />)}
  </g>
);

/** Mar de nubes: tres capas en y de mundo. */
export const MarNubes: React.FC<{ y: number }> = ({ y }) => {
  const capa = (y0: number, amp: number, seed: string, fill: string) => {
    const pts: [number, number][] = [];
    for (let x = -240; x <= 1320; x += 130) pts.push([x, y0 - amp * random(`${seed}${x}`)]);
    let d = `M-300 ${y0 + 1400} L${pts[0][0]} ${pts[0][1]}`;
    pts.forEach((p, i) => { const q = pts[i + 1] ?? p; d += ` Q${p[0]} ${p[1] - 26} ${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2}`; });
    return <path d={d + ` L1400 ${y0 + 1400} Z`} fill={fill} />;
  };
  return <g>{capa(y - 40, 60, "na", "#9AA9C6")}{capa(y + 40, 70, "nb", "#CFD8EA")}{capa(y + 150, 80, "nc", "#EEF2F9")}</g>;
};

/** Pilar de roca visto de frente (el cielo se ve a los lados), en y de mundo. */
export const xIzq = (y: number) => 170 + 18 * Math.sin(y / 140) + 10 * Math.sin(y / 47), xDer = (y: number) => 930 + 20 * Math.sin(y / 170 + 1) + 9 * Math.sin(y / 53);
export const Muro: React.FC<{ y0: number; y1: number }> = ({ y0, y1 }) => {
  const L: string[] = [], R: string[] = [];
  for (let y = y0; y <= y1; y += 40) { L.push(`${xIzq(y).toFixed(1)} ${y}`); R.unshift(`${xDer(y).toFixed(1)} ${y}`); }
  const d = `M${L.join(" L")} L${R.join(" L")} Z`;
  return (
    <g>
      <defs>
        <linearGradient id="muroG" gradientUnits="userSpaceOnUse" x1="0" y1={y0} x2="0" y2={y1}><stop offset="0" stopColor="#74869E" /><stop offset="0.6" stopColor="#52627A" /><stop offset="1" stopColor="#38455B" /></linearGradient>
        <linearGradient id="muroL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F0B27A" stopOpacity="0.34" /><stop offset="0.3" stopColor="#F0B27A" stopOpacity="0" /><stop offset="0.75" stopColor="#0B1624" stopOpacity="0" /><stop offset="1" stopColor="#0B1624" stopOpacity="0.5" /></linearGradient>
        <clipPath id="pilar"><path d={d} /></clipPath>
      </defs>
      <path d={d} fill="url(#muroG)" />
      <g clipPath="url(#pilar)">
        {Array.from({ length: 16 }).map((_, i) => { let x = 200 + random(`cx${i}`) * 720, y = y0 + random(`cy${i}`) * (y1 - y0) * 0.85, p = `M${x} ${y}`; for (let k = 0; k < 6; k++) { x += -30 + random(`ck${i}${k}`) * 60; y += 70 + random(`cd${i}${k}`) * 70; p += ` L${x} ${y}`; } return <path key={i} d={p} stroke="#202A3A" strokeOpacity={0.5} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />; })}
        {Array.from({ length: 26 }).map((_, i) => { const x = 220 + random(`fx${i}`) * 680, y = y0 + random(`fy${i}`) * (y1 - y0), w = 50 + random(`fw${i}`) * 110; return <path key={i} d={`M${x} ${y} l${w} ${-12} l${w * 0.4} ${34} l${-w * 0.7} ${26} Z`} fill="#8EA0B8" opacity={0.2} />; })}
        <rect x={100} y={y0} width={900} height={y1 - y0} fill="url(#muroL)" />
      </g>
      <path d={`M${L.join(" L")}`} fill="none" stroke="#F0B27A" strokeOpacity={0.6} strokeWidth={6} />
    </g>
  );
};
