// E82 «No eres débil: aprietas demasiado» (réplica de estructura de @climb_at_life). Hilo visual: el ANTEBRAZO de Joe
// (barra que se llena en rojo cuando aprieta y tira, se vacía en verde cuando cuelga del hueso) y gancho · cadena · muelle.
// Rocódromo CLARO desde el fotograma 0 (arranque oscuro = skip ~40 %). Reutiliza el gimnasio claro de E72 (Miedo) y el kit.
import React from "react";
import { conMano, conManoB, POSE, mix, type Angulos } from "../../piezas/kit";
import type { Aspecto } from "../../piezas/Rasgos";
import { ICONOS } from "../Miedo/Ui";
export { Svg, type P } from "../Pegue/comun";
export { COL, F, pop, cl, c01, sale, VIA, XA, Gym, caer } from "../Miedo/comun";
export { Grande, Ficha } from "../Miedo/Ui";
import { COL } from "../Miedo/comun";

/** Joe (de E15): chaqueta roja, casco amarillo. Aquí protagonista. */
export const JOE: Aspecto = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", casco: "#F2C230", pelo: "#3B2A20", peinado: "corto", piel: "#E2AD85", pielSombra: "#BF8862", manos: "piel" } as Aspecto;
/** Quien le asegura (casi siempre fuera de plano). */
export { REPARTO } from "../../piezas/kit";

type Pt = { x: number; y: number };
/** Pose colgada con las dos manos en presas (mundo): IK de los dos brazos. `cad` 0 = cadera lejos de la pared, 1 = pegada. */
export const colgar = (p: Pt, hA: Pt, hB: Pt, base: Angulos = POSE.agarre): Angulos =>
  conManoB(conMano(base, hA.x - p.x, hA.y - p.y), hB.x - p.x, hB.y - p.y);
/** Piernas: «muelle» recogido (0) o estirado empujando (1); cadera fuera (-1) o dentro. */
export const piernas = (a: Angulos, estira: number, fuera = 0): Angulos => {
  const rec = { ...a, piernaA: [100, 20] as [number, number], piernaB: [80, 0] as [number, number], torso: a.torso - 14 * fuera };
  const est = { ...a, piernaA: [40, 12] as [number, number], piernaB: [22, 2] as [number, number], torso: a.torso - 14 * fuera };
  return mix(rec, est, estira);
};

/** Iconos nuevos para las fichas (caja 200×200): gancho, cadena, muelle. Se añaden al catálogo de iconos de E72. */
const T = COL.tinta;
export const ICONO_GANCHO = <g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M100 18 V110 Q100 168 62 168 Q28 168 28 130" stroke={T} strokeWidth={34} /><path d="M100 18 V110 Q100 168 62 168 Q28 168 28 130" stroke="#C9D3DE" strokeWidth={18} /><circle cx={100} cy={22} r={18} fill="#8796A8" stroke={T} strokeWidth={8} /></g>;
const eslabon = (x: number, y: number, r: number) => <rect x={x - 26} y={y - 42} width={52} height={84} rx={26} transform={`rotate(${r} ${x} ${y})`} fill="none" stroke="#8796A8" strokeWidth={14} />;
export const ICONO_CADENA = <g>{[[60, 150, 45], [100, 100, -45], [140, 50, 45]].map(([x, y, r], i) => <g key={i}><rect x={x - 26} y={y - 42} width={52} height={84} rx={26} transform={`rotate(${r} ${x} ${y})`} fill="none" stroke={T} strokeWidth={26} />{eslabon(x, y, r)}</g>)}</g>;
export const ICONO_MUELLE = <g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M40 30 H160 M40 170 H160" stroke={T} strokeWidth={14} /><path d="M100 30 L150 55 L50 80 L150 105 L50 130 L150 155 L100 170" stroke={T} strokeWidth={26} /><path d="M100 30 L150 55 L50 80 L150 105 L50 130 L150 155 L100 170" stroke={COL.menta} strokeWidth={12} /></g>;
Object.assign(ICONOS, { gancho: ICONO_GANCHO, cadena: ICONO_CADENA, muelle: ICONO_MUELLE });

/** Cadena dibujada a lo largo de un segmento (brazo estirado = cadena tensa). Mundo. */
export const CadenaBrazo: React.FC<{ a: Pt; b: Pt; o: number }> = ({ a, b, o }) => {
  const n = 6, ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return <g opacity={o}>{Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t; return <ellipse key={i} cx={x} cy={y} rx={13} ry={8} transform={`rotate(${ang + (i % 2 ? 0 : 0)} ${x} ${y})`} fill="none" stroke={i % 2 ? "#8796A8" : "#C9D3DE"} strokeWidth={6} />; })}</g>;
};
/** Muelle entre dos puntos (cadera → pie), comprimido o estirado. Mundo. */
export const MuelleEntre: React.FC<{ a: Pt; b: Pt; o: number }> = ({ a, b, o }) => {
  const n = 7, dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const pts = Array.from({ length: n + 1 }, (_, i) => { const t = i / n, w = i === 0 || i === n ? 0 : (i % 2 ? 22 : -22); return `${a.x + dx * t + nx * w} ${a.y + dy * t + ny * w}`; });
  return <g opacity={o} fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={`M${pts.join(" L")}`} stroke={T} strokeWidth={16} /><path d={`M${pts.join(" L")}`} stroke={COL.menta} strokeWidth={8} /></g>;
};
/** Brillo rojo de «aprieta» alrededor de una mano (mundo). */
export const Aprieta: React.FC<{ x: number; y: number; v: number; f: number }> = ({ x, y, v, f }) => v <= 0 ? null : (
  <g opacity={v}><circle cx={x} cy={y} r={34 + 4 * Math.sin(f * 0.9)} fill={COL.rojo} opacity={0.45} /><circle cx={x} cy={y} r={26} fill="none" stroke={COL.rojo} strokeWidth={5} /></g>
);
/** Etiqueta de la barra del antebrazo (la del kit está pensada para fondo oscuro). */
export const EtqAntebrazo: React.FC = () => <div style={{ position: "absolute", left: 40, width: 200, top: 740, textAlign: "center", fontFamily: "Figtree", fontWeight: 800, fontSize: 28, letterSpacing: 2, color: COL.tinta, background: "rgba(255,253,248,.85)", borderRadius: 12 }}>ANTEBRAZO</div>;
