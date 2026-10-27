// E11 «La pierna de máquina de coser» (vía). Piezas comunes.
// Idea visual: el temblor se ve siempre (pierna, cinta exprés, cuerda naranja vibrando) y se para solo una vez: cuando baja el talón.
import React from "react";
import { interpolate, random, spring, useCurrentFrame } from "remotion";
import type { Look } from "../../piezas/Escalador";
export { C, Camara, Cuerda, Etiqueta, Svg, Zoom, golpe, clamp, W, H, type P } from "../Pegue/comun";

/* ---- reparto (nuevo en E11) ---- */
export const TU: Partial<Look> = { chaqueta: "#8E2E3B", chaquetaSombra: "#61202A", pantalon: "#2E3A4A", casco: "#5E8C6A", pelo: "#1A1210", piel: "#8A5A3B", pielSombra: "#6E452C", peinado: "trenzas" };
export const ASEG: Partial<Look> = { chaqueta: "#C9962E", chaquetaSombra: "#946C1E", pantalon: "#4A4F3C", casco: null, gorro: "#2F4A6E", pelo: "#B8BCC2", piel: "#F0C4A8", pielSombra: "#D09E84", barba: "#B8BCC2", gafas: true };
export const SUJETO: Partial<Look> = { chaqueta: "#8A96A6", chaquetaSombra: "#66717F", pantalon: "#39424F", casco: null, peinado: "rapado", piel: "#C98E62", pielSombra: "#A8714A" };
export const CIENTIFICA: Partial<Look> = { chaqueta: "#E8ECF0", chaquetaSombra: "#BCC5CF", pantalon: "#2E3A4A", casco: null, pelo: "#5A3A24", peinado: "coleta", piel: "#EBC3A0", pielSombra: "#C99B78", gafas: true };

/* ---- paleta: caliza fría y cielo de media mañana ---- */
export const P11 = { cieloA: "#5B8DB8", cieloB: "#CFE2EE", roca: "#9AA3AE", rocaS: "#7C8693", rocaL: "#B9C1CA", valle: "#6F8A78", valleL: "#9FB3A6", tinta: "#0B1624", musculo: "#E58E7E", metal: "#AEB8C4", cinta: "#3D7FD0" };

/** Temblor de máquina de coser: oscilación rápida (≈ 6 por segundo) con algo de irregularidad. k = intensidad 0–1. */
export const temblor = (f: number, k = 1, fase = 0) => k * (Math.sin(f * 1.26 + fase) * 0.8 + Math.sin(f * 2.9 + fase * 2) * 0.2);

export const Cielo: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P11.cieloA} /><stop offset="1" stopColor={P11.cieloB} /></linearGradient></defs>
    <rect x={-300} y={-500} width={1700} height={3000} fill={`url(#${id})`} />
  </>
);

/** Canto de la pared de montaña (irregular, con algún desplome). x0 = canto medio. */
export const borde = (y: number, x0: number) => x0 + 26 * Math.sin(y / 260 + 2) + 16 * Math.sin(y / 83 + 1) + 7 * Math.sin(y / 29);

/** Cordilleras al fondo (dos capas, la lejana con nieve) + neblina. */
export const Montanas: React.FC<{ y: number }> = ({ y }) => {
  const sierra = (yy: number, amp: number, sem: string, n = 7) => { const p: string[] = []; for (let i = 0; i <= n * 2; i++) p.push(`${-200 + (i * 1500) / (n * 2)} ${yy - (i % 2 ? amp * (0.6 + random(`${sem}${i}`) * 0.5) : amp * 0.15 * random(`${sem}b${i}`))}`); return p; };
  const lejos = sierra(y, 330, "ml"), medio = sierra(y + 170, 200, "mm", 5);
  return (
    <g>
      <path d={`M-300 2400 L${lejos.join(" L")} L1500 2400 Z`} fill="#8FA7BF" />
      {lejos.map((pt, i) => { if (!(i % 2)) return null; const [x, yy] = pt.split(" ").map(Number); return <path key={i} d={`M${x - 46} ${yy + 60} L${x} ${yy} L${x + 46} ${yy + 60} Q${x} ${yy + 44} ${x - 46} ${yy + 60} Z`} fill="#EEF3F7" />; })}
      <path d={`M-300 2400 L${medio.join(" L")} L1500 2400 Z`} fill="#6F8AA3" />
      <rect x={-300} y={y + 80} width={1700} height={260} fill={P11.cieloB} opacity={0.35} />
    </g>
  );
};

/** Valle muy abajo: prados, río, pueblo diminuto y árboles. */
export const Valle: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M-300 ${y} Q300 ${y - 30} 1400 ${y + 10} L1400 2600 L-300 2600 Z`} fill={P11.valleL} />
    <path d={`M-300 ${y + 70} Q500 ${y + 30} 1400 ${y + 80} L1400 2600 L-300 2600 Z`} fill={P11.valle} />
    <path d={`M-200 ${y + 120} Q200 ${y + 60} 380 ${y + 150} T900 ${y + 210}`} stroke="#A9C9DA" strokeWidth={14} fill="none" opacity={0.8} />
    {Array.from({ length: 7 }).map((_, i) => { const x = 150 + i * 26 + random(`cx${i}`) * 14, yy = y + 70 + random(`cy${i}`) * 26; return <g key={i}><rect x={x} y={yy} width={16} height={12} fill="#EDE6DA" /><path d={`M${x - 2} ${yy} L${x + 8} ${yy - 8} L${x + 18} ${yy} Z`} fill="#B4614A" /></g>; })}
    {Array.from({ length: 30 }).map((_, i) => {
      const x = random(`vx${i}`) * 900 - 100, yy = y + 40 + random(`vy${i}`) * 320, r = 4 + random(`vr${i}`) * 6;
      return <circle key={i} cx={x} cy={yy} r={r} fill="#4E6B57" />;
    })}
    <rect x={-300} y={y - 110} width={1700} height={150} fill={P11.cieloB} opacity={0.5} />
  </g>
);

/** Pájaros planeando muy por debajo de ti (dan la altura). */
export const Pajaros: React.FC<{ y: number; x?: number }> = ({ y, x = 120 }) => {
  const f = useCurrentFrame();
  return <g>{[0, 1, 2].map((i) => { const px = x + i * 70 + f * 1.2, py = y + i * 26 + Math.sin(f / 8 + i) * 6, a = Math.sin(f / 4 + i * 2) * 6; return <path key={i} d={`M${px - 16} ${py - a} Q${px - 8} ${py - 8} ${px} ${py} Q${px + 8} ${py - 8} ${px + 16} ${py - a}`} stroke="#2B3A4A" strokeWidth={3.5} fill="none" strokeLinecap="round" />; })}</g>;
};

/** Pared de montaña: caliza con estratos inclinados, grietas, matojos en las repisas. */
export const Pared: React.FC<{ x0: number; y0?: number; y1?: number; semilla?: string }> = ({ x0, y0 = -400, y1 = 2400, semilla = "p" }) => {
  const pts: string[] = [];
  for (let y = y0; y <= y1; y += 16) pts.push(`${borde(y, x0)} ${y}`);
  const canto = `M${pts.join(" L")}`;
  return (
    <g>
      <defs><linearGradient id={`pl${semilla}`} x1="0" x2="1"><stop offset="0" stopColor={P11.rocaL} /><stop offset="0.25" stopColor={P11.roca} /><stop offset="1" stopColor={P11.rocaS} /></linearGradient></defs>
      <path d={`${canto} L1500 ${y1} L1500 ${y0} Z`} fill={`url(#pl${semilla})`} />
      {Array.from({ length: 22 }).map((_, i) => { const y = y0 + i * ((y1 - y0) / 22) + random(`${semilla}g${i}`) * 50; return <path key={i} d={`M${borde(y, x0)} ${y} L1500 ${y - 90 - random(`${semilla}h${i}`) * 40}`} stroke={P11.rocaS} strokeWidth={4 + random(`${semilla}w${i}`) * 6} opacity={0.45} />; })}
      {Array.from({ length: 6 }).map((_, i) => { const y = y0 + random(`${semilla}k${i}`) * (y1 - y0), x = borde(y, x0) + 60 + random(`${semilla}j${i}`) * 200; return <path key={i} d={`M${x} ${y} l12 40 l-8 36 l14 50`} stroke="#5E6874" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={borde(0, x0) + 30 + random(`${semilla}x${i}`) * 450} cy={y0 + random(`${semilla}y${i}`) * (y1 - y0)} r={3 + random(`${semilla}r${i}`) * 6} fill={random(`${semilla}l${i}`) > 0.7 ? "#C7C08A" : P11.rocaS} opacity={0.5} />)}
      {Array.from({ length: 4 }).map((_, i) => { const y = y0 + 300 + random(`${semilla}m${i}`) * (y1 - y0 - 600), x = borde(y, x0); return <g key={i}>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={x - 6 + k * 9} cy={y - 8 - (k % 2) * 6} rx={9} ry={14} fill={k % 2 ? "#5E7C55" : "#4C6A46"} transform={`rotate(${-30 + k * 18} ${x} ${y})`} />)}</g>; })}
      <path d={canto} stroke="#000" strokeOpacity={0.25} strokeWidth={6} fill="none" />
    </g>
  );
};

/** Bocadillo del asegurador (su color). La punta señala (x, y). */
export const Bocadillo: React.FC<{ texto?: string; x: number; y: number; ancho?: number; desde?: number; arriba?: boolean; tam?: number }> = ({ texto, x, y, ancho = 620, desde = 0, arriba = true, tam = 66 }) => {
  const f = useCurrentFrame();
  if (!texto) return null;
  const k = spring({ frame: f - desde, fps: 30, config: { damping: 12, stiffness: 200 } });
  const left = Math.max(40, Math.min(1080 - 40 - ancho, x - ancho * 0.35));
  return (
    <div style={{ position: "absolute", left, width: ancho, ...(arriba ? { bottom: 1920 - y + 34 } : { top: y + 34 }), transform: `scale(${k})`, transformOrigin: `${x - left}px ${arriba ? "100%" : "0%"}`, opacity: k > 0.01 ? 1 : 0 }}>
      <div style={{ background: "#fff", border: "7px solid #C9962E", borderRadius: 40, padding: "22px 30px", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: tam, lineHeight: 1.05, color: "#0B1624", textAlign: "center", boxShadow: "0 10px 0 #0003" }}>{texto}</div>
      <div style={{ position: "absolute", left: x - left - 22, [arriba ? "bottom" : "top"]: -30, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", [arriba ? "borderTop" : "borderBottom"]: "36px solid #C9962E" } as React.CSSProperties} />
    </div>
  );
};

/** Etiqueta anatómica pequeña con línea al punto. */
export const Marca: React.FC<{ texto: string; x: number; y: number; tx: number; ty: number; o?: number }> = ({ texto, x, y, tx, ty, o = 1 }) => (
  <g opacity={o}>
    <path d={`M${x} ${y} L${tx} ${ty}`} stroke="#fff" strokeWidth={5} />
    <circle cx={x} cy={y} r={9} fill="#fff" />
    <rect x={tx - 10} y={ty - 40} width={texto.length * 30 + 40} height={74} rx={37} fill="#0B1624" />
    <text x={tx + 10} y={ty + 12} fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={50} fill="#fff">{texto}</text>
  </g>
);

/** Reglete: repisa mínima donde apoya la punta del pie. */
export const Reglete: React.FC<{ x: number; y: number; ancho?: number }> = ({ x, y, ancho = 26 }) => (
  <g>
    <path d={`M${x} ${y} L${x - ancho} ${y + 2} L${x - ancho + 4} ${y + 9} L${x} ${y + 12} Z`} fill={P11.rocaL} stroke="#000" strokeOpacity={0.25} strokeWidth={2} />
    <ellipse cx={x - ancho / 2} cy={y + 14} rx={ancho / 2} ry={4} fill="#000" opacity={0.2} />
  </g>
);

/** Chapa con cinta exprés que tintinea con el temblor y la cuerda pasando. `t` = tintineo (grados). */
export const Chapa: React.FC<{ x: number; y: number; t?: number; s?: number }> = ({ x, y, t = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={9} fill={P11.metal} stroke="#000" strokeOpacity={0.3} strokeWidth={2} />
    <g transform={`rotate(${t})`}>
      <path d="M-5 6 Q-12 4 -10 -4 Q-6 -12 0 -10 L4 4 Z" fill="none" stroke={P11.metal} strokeWidth={4} />
      <rect x={-7} y={8} width={14} height={44} rx={7} fill={P11.cinta} />
      <ellipse cx={0} cy={66} rx={13} ry={17} fill="none" stroke={P11.metal} strokeWidth={5} />
    </g>
  </g>
);

/** Rótulo pequeño de fuente (dato científico). */
export const Fuente: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", fontFamily: "Figtree", fontWeight: 700, fontSize: 30, color: "#fff", opacity: 0.8, textShadow: "0 2px 6px #0008" }}>{texto}</div>
);

export const usaTemblor = (k: number) => { const f = useCurrentFrame(); return { f, tr: (fase = 0) => temblor(f, k, fase) }; };
export const sube = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
