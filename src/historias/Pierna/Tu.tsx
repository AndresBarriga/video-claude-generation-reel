// Tú en la pared, de perfil (mira a la derecha), con la punta del pie delantero en un reglete.
// La geometría replica la de Escalador.tsx para colocar presas y reglete justo bajo manos y pie.
import React from "react";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import { P11, Reglete, TU } from "./comun";

const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, a: number, l: number): [number, number] => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
export const POSE_PARED: Angulos = { torso: 10, cabeza: 34, brazoA: [112, 150], brazoB: [160, 176], piernaA: [64, -6], piernaB: [24, -2] };

/** Puntos clave (relativos a la cadera, ya escalados). */
export const puntos = (a: Angulos, s: number) => {
  const hombro = ext(0, 0, 180 - a.torso, 88);
  const mano = (b: [number, number]) => { const e = ext(hombro[0], hombro[1], b[0], 52); return ext(e[0], e[1], b[1], 50); };
  const rod = ext(0, 0, a.piernaA[0], 66), tobillo = ext(rod[0], rod[1], a.piernaA[1], 64), punta = ext(tobillo[0], tobillo[1], a.piernaA[1] + 90, 22);
  const k = (p: [number, number]) => [p[0] * s, p[1] * s] as [number, number];
  return { manoA: k(mano(a.brazoA)), manoB: k(mano(a.brazoB)), rodilla: k(rod), tobillo: k(tobillo), punta: k(punta) };
};

/** `tr` = temblor actual (−1…1 × intensidad); `amp` = rastro de movimiento (fantasmas). Coloca a la escaladora con la punta del pie (sin temblor) en (px, py). Devuelve también dónde está la pared. */
export const Tu: React.FC<{ px: number; py: number; s: number; cara?: Cara; tr?: number; amp?: number; cabeza?: number; talon?: number }> = ({ px, py, s, cara = "miedo", tr = 0, amp = 0, cabeza, talon = 0 }) => {
  const base = { ...POSE_PARED, ...(cabeza !== undefined ? { cabeza } : {}) };
  const p0 = puntos(base, s);
  const hx = px - p0.punta[0], hy = py - p0.punta[1];
  // temblor: el talón sube y baja alrededor de la punta; `talon` (0–1) lo baja y lo deja quieto
  const pierna = (t: number): Partial<Angulos> => ({ piernaA: [64 - 8 * t - 6 * talon, -6 - 20 * t + 14 * talon] });
  const muro = px + 2;
  const presa = (m: [number, number], k: string) => (
    <path key={k} d={`M${muro} ${hy + m[1] - 18 * s} L${hx + m[0] - 6 * s} ${hy + m[1] - 4 * s} Q${hx + m[0] - 10 * s} ${hy + m[1] + 14 * s} ${muro} ${hy + m[1] + 16 * s} Z`} fill={P11.rocaL} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />
  );
  return (
    <g>
      {presa(p0.manoA, "a")}{presa(p0.manoB, "b")}
      <Reglete x={muro} y={py + 2} ancho={20 * s} />
      {amp > 0.05 && [-1, 1].map((sg) => (
        <g key={sg} opacity={0.38} clipPath="url(#piernaClip)"><Escalador x={hx} y={hy} quien="joe" look={TU} s={s} angulos={{ ...base, ...pierna(sg * amp) }} cara={cara} /></g>
      ))}
      <defs><clipPath id="piernaClip"><rect x={hx - 20 * s} y={hy + 20 * s} width={200 * s} height={160 * s} /></clipPath></defs>
      <Escalador x={hx} y={hy} quien="joe" look={TU} s={s} angulos={{ ...base, ...pierna(tr) }} cara={cara} />
    </g>
  );
};

/** Cadera (arnés) para un pie en (px, py). */
export const caderaDe = (px: number, py: number, s: number, cabeza?: number) => {
  const p0 = puntos({ ...POSE_PARED, ...(cabeza !== undefined ? { cabeza } : {}) }, s);
  return { x: px - p0.punta[0], y: py - p0.punta[1], p: p0 };
};
