// E56 «Vía ferrata». Excepción de paleta (decisión 10-nov): cielo azul, verdes y roca caliza; el naranja sigue siendo el hilo
// (los brazos elásticos del disipador). Piezas: cielo, montes, nubes, cable, mosquetón, escalera.
import React from "react";
import { random } from "remotion";
export { C, Camara, Etiqueta, Svg, Zoom, golpe, clamp, type P } from "../Pegue/comun";

export const FE = {
  cielo0: "#2F7FD0", cielo1: "#7DB9E8", cielo2: "#D6ECF8", lejos: "#9DB8D2", lejosS: "#86A3C1", nieve: "#F4F8FB",
  medio: "#5E8A6E", medioS: "#4A7359", valle: "#7FA867", agua: "#4FC1C8",
  caliza: "#C9C2B6", calizaS: "#A79E90", calizaSS: "#857C70", acero: "#8E99A6", aceroL: "#D7DEE6", aceroS: "#56606C",
  funda: "#262B33", fundaS: "#3A414C", cinta: "#F3F4F1", cintaS: "#C9CDC7", tinta: "#0B1624",
};

// Reparto (aspecto de Escalador). Dani: barba, mochila, casco blanco. Marta: pelo corto, gafas, casco verde botella.
export const DANI = { chaqueta: "#E0A526", chaquetaSombra: "#A97A16", pantalon: "#2E3A4E", casco: "#F2F3F5", barba: "#5A3E2B", pelo: "#5A3E2B", manos: "guante" as const };
export const MARTA = { chaqueta: "#2A8C88", chaquetaSombra: "#1C6461", pantalon: "#263040", casco: "#1F5E44", gafas: true, peinado: "corto" as const, pelo: "#2B1E16", manos: "guante" as const };

export const Cielo: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs><linearGradient id={`fc${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={FE.cielo0} /><stop offset="0.55" stopColor={FE.cielo1} /><stop offset="1" stopColor={FE.cielo2} />
    </linearGradient></defs>
    <rect x={-400} y={-600} width={1880} height={3200} fill={`url(#fc${id})`} />
  </g>
);

/** Cordillera nevada a lo lejos. */
export const Montes: React.FC<{ y: number; seed: string; color?: string; nieve?: boolean; amp?: number }> = ({ y, seed, color = FE.lejos, nieve = true, amp = 260 }) => {
  const n = 9, pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([-300 + (i * 1680) / n, y - (i % 2 ? amp * (0.55 + random(`${seed}${i}`) * 0.45) : amp * 0.15 * random(`${seed}v${i}`))]);
  const d = `M-400 ${y + 1400} L${pts.map((p) => p.join(" ")).join(" L")} L1480 ${y + 1400} Z`;
  return (
    <g>
      <path d={d} fill={color} />
      {nieve && pts.map(([x, py], i) => i % 2 ? <path key={i} d={`M${x - 62} ${py + 70} L${x} ${py} L${x + 70} ${py + 78} L${x + 30} ${py + 62} L${x + 6} ${py + 88} L${x - 24} ${py + 60} Z`} fill={FE.nieve} opacity={0.92} /> : null)}
      {pts.map(([x, py], i) => i % 2 ? <path key={`s${i}`} d={`M${x} ${py} L${x + 90} ${py + 300} L${x + 160} ${y + 40}`} stroke={FE.lejosS} strokeWidth={10} fill="none" opacity={0.6} /> : null)}
    </g>
  );
};

/** Nube esponjosa. */
export const Nube: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.95 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={20} rx={170} ry={42} fill="#fff" />
    <circle cx={-70} cy={0} r={52} fill="#fff" /><circle cx={10} cy={-24} r={70} fill="#fff" /><circle cx={90} cy={4} r={48} fill="#fff" />
    <ellipse cx={0} cy={44} rx={160} ry={14} fill="#C9DCEB" opacity={0.7} />
  </g>
);

/** Cable de acero (trenzado). */
export const Cable: React.FC<{ d: string; w?: number }> = ({ d, w = 9 }) => (
  <g>
    <path d={d} stroke={FE.aceroS} strokeWidth={w + 4} fill="none" strokeLinecap="round" />
    <path d={d} stroke={FE.acero} strokeWidth={w} fill="none" strokeLinecap="round" />
    <path d={d} stroke={FE.aceroL} strokeWidth={w * 0.35} fill="none" strokeDasharray={`${w * 0.9} ${w * 1.1}`} strokeLinecap="round" />
  </g>
);

/** Mosquetón de ferrata (asimétrico grande con gatillo). (x,y) = punto de apoyo arriba; ang = giro; s = escala. */
export const Mosqueton: React.FC<{ x: number; y: number; ang?: number; s?: number }> = ({ x, y, ang = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
    <path d="M-6 -6 Q-30 -8 -34 22 L-26 96 Q-22 118 0 118 L14 118 Q30 116 30 96 L26 10 Q22 -8 -6 -6 Z" fill="none" stroke={FE.aceroS} strokeWidth={15} />
    <path d="M-6 -6 Q-30 -8 -34 22 L-26 96 Q-22 118 0 118 L14 118 Q30 116 30 96 L26 10 Q22 -8 -6 -6 Z" fill="none" stroke="#C3CCD6" strokeWidth={10} />
    <path d="M-28 30 L-22 92" stroke="#fff" strokeWidth={3} opacity={0.6} />
    <rect x={20} y={20} width={20} height={58} rx={6} fill="#5B6573" />
    <rect x={24} y={26} width={8} height={40} rx={3} fill="#9AA6B2" />
  </g>
);

/** Muelle elástico naranja entre dos puntos (brazos del disipador): una onda con pliegues. */
export const Elastico: React.FC<{ a: [number, number]; b: [number, number]; w?: number; tension?: number }> = ({ a, b, w = 22, tension = 0 }) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), n = Math.max(6, Math.round(L / (w * 0.7)));
  const nx = -dy / L, ny = dx / L, amp = w * 0.28 * (1 - tension * 0.85);
  const pts = Array.from({ length: n + 1 }, (_, i) => { const t = i / n, o = (i % 2 ? 1 : -1) * amp; return `${a[0] + dx * t + nx * o} ${a[1] + dy * t + ny * o}`; });
  return (
    <g>
      <path d={`M${pts.join(" L")}`} stroke="#B8460E" strokeWidth={w * 1.25} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M${pts.join(" L")}`} stroke="#FF6A1F" strokeWidth={w} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {Array.from({ length: n }).map((_, i) => { const t = (i + 0.5) / n; return <path key={i} d={`M${a[0] + dx * t - nx * w * 0.45} ${a[1] + dy * t - ny * w * 0.45} L${a[0] + dx * t + nx * w * 0.45} ${a[1] + dy * t + ny * w * 0.45}`} stroke="#C9500F" strokeWidth={w * 0.12} opacity={0.8} />; })}
    </g>
  );
};

/** Anilla del arnés en coordenadas de mundo. Escalador: translate(x,y) · rotate(rot) · scale(s·mira, s) · rotate(torso) · (20,-22). */
export const anilla = (x: number, y: number, s: number, torso: number, rot = 0, mira: 1 | -1 = 1): [number, number] => {
  const t = (torso * Math.PI) / 180, r = (rot * Math.PI) / 180;
  const ax = (20 * Math.cos(t) + 22 * Math.sin(t)) * s * mira, ay = (20 * Math.sin(t) - 22 * Math.cos(t)) * s;
  return [x + ax * Math.cos(r) - ay * Math.sin(r), y + ax * Math.sin(r) + ay * Math.cos(r)];
};

/** Mano delantera (brazoA) en coordenadas de mundo, con la misma geometría que Escalador (sin `rot`). */
export const manoA = (x: number, y: number, s: number, torso: number, brazoA: [number, number], mira: 1 | -1 = 1, kb = 1): [number, number] => {
  const e = (px: number, py: number, ang: number, L: number): [number, number] => [px + Math.sin((ang * Math.PI) / 180) * L, py + Math.cos((ang * Math.PI) / 180) * L];
  const hombro = e(0, 0, 180 - torso, 104 - 16), codo = e(hombro[0], hombro[1], brazoA[0], 52 * kb), m = e(codo[0], codo[1], brazoA[1], 50 * kb);
  return [x + m[0] * s * mira, y + m[1] * s];
};
