// Primer plano DE FRENTE (mirando a la pared): chapa, cinta exprés con sus dos mosquetones y la cuerda. Coordenadas de pantalla (cámara opcional).
// La chapa (ojo) está en (x, y). `puerta` = hacia qué lado miran las dos puertas. `giro` < 0 = la cinta se levanta hacia la derecha.
import React from "react";
import { random } from "remotion";
import { formaMosq, PC, C } from "../../piezas/kit";

/** Caliza clara de cerca: vetas, agujeros y grano. */
export const ParedCerca: React.FC<{ seed?: string }> = ({ seed = "m" }) => (
  <g>
    <defs><linearGradient id="cf-roca" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9DCC3" /><stop offset="0.6" stopColor="#CDBB9E" /><stop offset="1" stopColor="#AE9C80" /></linearGradient></defs>
    <rect x={-2400} y={-2400} width={6000} height={7000} fill="url(#cf-roca)" />
    {Array.from({ length: 9 }).map((_, i) => { const y = -800 + i * 420 + random(seed + "y" + i) * 200; return <path key={i} d={`M-2400 ${y} q900 ${-60 - random(seed + "q" + i) * 80} 2200 40 t2600 -30`} stroke="#8E7E66" strokeWidth={6 + random(seed + "s" + i) * 8} fill="none" opacity={0.4} />; })}
    {Array.from({ length: 7 }).map((_, i) => { const x = -600 + random(seed + "vx" + i) * 2400, y = -600 + random(seed + "vy" + i) * 2600, l = 500 + random(seed + "vl" + i) * 700; return <path key={i} d={`M${x} ${y} q${-40 + random(seed + "vq" + i) * 80} ${l / 2} -20 ${l}`} stroke={i % 2 ? "#6F7A86" : "#C98B5A"} strokeWidth={50 + random(seed + "vw" + i) * 60} fill="none" opacity={0.16} strokeLinecap="round" />; })}
    {Array.from({ length: 34 }).map((_, i) => { const x = -700 + random(seed + "ax" + i) * 2500, y = -500 + random(seed + "ay" + i) * 2900, r = 14 + random(seed + "ar" + i) * 30; return <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill="#6B5D4B" opacity={0.7} /><path d={`M${x - r} ${y + 3} Q${x} ${y + r} ${x + r} ${y + 3}`} stroke="#F6EEDC" strokeWidth={5} fill="none" opacity={0.6} /></g>; })}
    {Array.from({ length: 160 }).map((_, i) => <circle key={i} cx={-700 + random(seed + "gx" + i) * 2500} cy={-500 + random(seed + "gy" + i) * 2900} r={2 + random(seed + "gr" + i) * 3} fill={i % 2 ? "#7B6C57" : "#F7F0DF"} opacity={0.5} />)}
  </g>
);

export type CintaP = { x: number; y: number; s?: number; puerta?: "izq" | "der"; giro?: number; abreArriba?: number; abreAbajo?: number; largo?: number; color?: string;
  /** 0–1: rebabas en el mosquetón de la chapa */ rebabas?: number; /** la cinta puesta del revés (el de las rebabas, abajo) */ alReves?: boolean;
  /** la cinta ya suelta de la chapa: desplazamiento y giro */ suelta?: { dx: number; dy: number; rot: number }; /** desplaza el mosquetón de arriba sobre la chapa (la puerta contra ella) */ corre?: number;
  haloArriba?: string; haloAbajo?: string; goma?: number; chapa?: boolean; sinAbajo?: boolean };
export const LARGO = 300;
/** Centro del mosquetón de la cuerda (por donde pasa) en pantalla. */
export const abajoDe = (p: CintaP) => { const s = p.s ?? 1, L = p.largo ?? LARGO, a = ((p.giro ?? 0) * Math.PI) / 180, vx = -18, vy = 260 + L; return { x: p.x + s * (vx * Math.cos(a) - vy * Math.sin(a)) + (p.suelta?.dx ?? 0), y: p.y + 20 * s + s * (vx * Math.sin(a) + vy * Math.cos(a)) + (p.suelta?.dy ?? 0) }; };
const Rebabas: React.FC<{ k: number }> = ({ k }) => <g opacity={Math.min(1, k * 1.5)}>{[-34, -18, -2, 14, 30].map((x, i) => <path key={i} d={`M${x} -74 l8 ${12 + (i % 2) * 6} l8 -${12 + (i % 2) * 6}`} fill="#3A4048" stroke={PC.tinta} strokeWidth={3} strokeLinejoin="round" transform={`scale(${0.4 + 0.6 * k})`} />)}<path d="M-40 -72 H44" stroke="#F4F6F8" strokeWidth={3} opacity={0.6} strokeDasharray="3 13" /></g>;

export const Chapa: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={18} rx={64} ry={66} fill="#000" opacity={0.18} />
    <path d="M-50 -92 H40 Q58 -92 58 -74 V30 Q58 62 26 66 H-22 Q-52 62 -52 30 Z" fill="#B8C0C8" stroke={PC.tinta} strokeWidth={10} strokeLinejoin="round" />
    <circle cx={2} cy={-52} r={24} fill="#7A838E" stroke={PC.tinta} strokeWidth={8} /><path d="M-10 -52 h24 M2 -64 v24" stroke={PC.tinta} strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={2} cy={20} rx={22} ry={26} fill="#2B3039" stroke={PC.tinta} strokeWidth={6} />
    <path d="M-40 -80 V20" stroke="#F4F6F8" strokeWidth={6} opacity={0.6} strokeLinecap="round" />
  </g>
);
/** Cinta exprés de frente. El ojo de la chapa queda en (x, y + 20·s). */
export const CintaF: React.FC<CintaP> = (p) => {
  const { x, y, s = 1, puerta = "der", giro = 0, abreArriba = 0, abreAbajo = 0, largo: L = LARGO, color = "#D4533F", rebabas = 0, alReves, suelta, corre = 0, haloArriba, haloAbajo, goma = 0, chapa = true, sinAbajo } = p;
  const sg = puerta === "der" ? 1 : -1, yT = -(L - 300) - 470, halo = (c: string) => <ellipse rx={92} ry={130} fill="none" stroke={c} strokeWidth={14} opacity={0.9} strokeDasharray="30 16" />;
  return (
    <g>
      {chapa && <Chapa x={x} y={y} s={s} />}
      <g transform={`translate(${x + (suelta?.dx ?? 0)} ${y + (suelta?.dy ?? 0)}) scale(${s}) rotate(${giro + (suelta?.rot ?? 0)} 0 20) translate(${-18 - sg * corre * 46} ${580 + (L - 300)})`}>
        <g transform={`translate(8 ${yT}) scale(0.9)`}>{haloArriba && halo(haloArriba)}{formaMosq(abreArriba, puerta)}{(rebabas > 0 && !alReves) && <Rebabas k={rebabas} />}{alReves && <g><rect x={-34} y={62} width={68} height={40} rx={8} fill="#15181E" stroke={PC.tinta} strokeWidth={6} /></g>}</g>
        <path d={`M2 ${yT + 78} L-2 -92`} stroke={PC.tinta} strokeWidth={74} strokeLinecap="round" /><path d={`M2 ${yT + 78} L-2 -92`} stroke={color} strokeWidth={56} strokeLinecap="round" />
        {[yT + 110, yT + 140, -150, -120].map((yy) => <path key={yy} d={`M-22 ${yy} L22 ${yy}`} stroke="#fff" strokeWidth={5} strokeDasharray="7 7" opacity={0.6} />)}
        {haloAbajo && halo(haloAbajo)}
        {!sinAbajo && <g transform="scale(1 -1)">{formaMosq(abreAbajo, puerta)}</g>}
        {alReves ? <g transform="rotate(180)"><Rebabas k={Math.max(rebabas, 0.01)} /></g> : <g><rect x={-36} y={-128} width={72} height={46} rx={9} fill="#15181E" stroke={PC.tinta} strokeWidth={6} />{goma > 0 && <rect x={-48} y={-140} width={96} height={70} rx={16} fill="none" stroke="#FFE3A0" strokeWidth={10} opacity={goma} />}</g>}
      </g>
    </g>
  );
};
/** Cuerda gruesa de primer plano por puntos (curva suave). `roto` 0–1 = funda deshilachada en el punto `en`. */
export const CuerdaM: React.FC<{ d: string; w?: number; corre?: number }> = ({ d, w = 38, corre = 0 }) => (
  <g>
    <path d={d} stroke={C.cuerdaS} strokeWidth={w + 12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke="#FFB27F" strokeWidth={w * 0.18} fill="none" strokeDasharray={`${w * 0.7} ${w * 0.8}`} strokeDashoffset={-corre} opacity={0.75} />
  </g>
);
