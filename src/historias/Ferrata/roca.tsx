// Roca caliza con volumen (luz del sol, estrías verticales, repisas con hierba) y material de ferrata a escala real.
// Escala: pm = píxeles por metro en el plano. Medidas de fabricante (Singing Rock / Decathlon, EN 958): brazos 50 cm
// en reposo y ~90 cm en tensión; mosquetón ~11 cm; funda ~15×8 cm; disipador abierto: sistema completo hasta ~190 cm.
import React from "react";
import { random } from "remotion";
import { CIELO, mix, type Hora } from "./paisaje";
import { Mosqueton, Elastico } from "./comun";

export const M = { mosq: 0.11, brazo: 0.5, brazoTenso: 0.9, fundaL: 0.15, fundaA: 0.08, cinta: 0.045, cable: 0.016, grapa: 0.3, persona: 1.7 };
/** Escala de Escalador para una persona de 1,70 m con pm píxeles por metro (Escalador ≈ 296 px de alto a s = 1). */
export const sPersona = (pm: number) => (M.persona * pm) / 296;

export const Roca: React.FC<{ d: string; id: string; h: Hora; pm: number; luzIzq?: boolean; tono?: string }> = ({ d, id, h, pm, luzIzq = true, tono = "#C8BFB0" }) => {
  const c = CIELO[h], base = mix(tono, c.luz, 0.12), som = mix(tono, "#3B3F55", 0.42), luz = mix(tono, c.luz, 0.55);
  const n = 140;
  return (
    <g>
      <clipPath id={`rc${id}`}><path d={d} /></clipPath>
      <defs><linearGradient id={`rg${id}`} x1={luzIzq ? 0 : 1} y1="0" x2={luzIzq ? 1 : 0} y2="0">
        <stop offset="0" stopColor={luz} stopOpacity="0.55" /><stop offset="0.35" stopColor={base} stopOpacity="0" /><stop offset="0.7" stopColor={som} stopOpacity="0.45" /><stop offset="1" stopColor={som} stopOpacity="0.8" />
      </linearGradient></defs>
      <path d={d} fill={base} />
      <g clipPath={`url(#rc${id})`}>
        {Array.from({ length: n }).map((_, i) => {
          const x = -600 + random(`${id}sx${i}`) * 2300, y = -600 + random(`${id}sy${i}`) * 5000, w = (0.4 + random(`${id}sw${i}`) * 1.6) * pm, l = (3 + random(`${id}sl${i}`) * 9) * pm;
          return <path key={i} d={`M${x} ${y} q${w * 0.4} ${l * 0.5} ${-w * 0.2} ${l} l${w} 0 q${w * 0.5} ${-l * 0.5} ${w * 0.1} ${-l} Z`} fill={random(`${id}st${i}`) > 0.45 ? som : luz} opacity={0.55 + random(`${id}so${i}`) * 0.4} />;
        })}
        {Array.from({ length: 18 }).map((_, i) => {
          const x = -400 + random(`${id}rx${i}`) * 2000, y = -2500 + random(`${id}ry${i}`) * 6500, w = (1.5 + random(`${id}rw${i}`) * 4) * pm;
          return <g key={`r${i}`}><path d={`M${x} ${y} l${w} ${w * 0.08}`} stroke={som} strokeWidth={Math.max(1.2, pm * 0.06)} opacity={0.6} />
            {random(`${id}rg${i}`) > 0.5 && <ellipse cx={x + w * 0.5} cy={y - pm * 0.05} rx={w * 0.22} ry={pm * 0.12} fill={mix("#5E8A4E", c.bruma, 0.15)} />}</g>;
        })}
        {Array.from({ length: 60 }).map((_, i) => { const x = -600 + random(`${id}fx${i}`) * 2300, y = -600 + random(`${id}fy${i}`) * 5000, l = (2 + random(`${id}fl${i}`) * 8) * pm;
          return <path key={`f${i}`} d={`M${x} ${y} q${pm * 0.3} ${l / 2} ${-pm * 0.1} ${l}`} stroke={som} strokeWidth={Math.max(0.8, pm * 0.05)} fill="none" opacity={0.55} />; })}
        <path d={d} fill={`url(#rg${id})`} />
        <path d={d} fill="none" stroke={luzIzq ? luz : som} strokeWidth={pm * 0.5} opacity={0.5} transform={`translate(${luzIzq ? pm * 0.25 : -pm * 0.25} 0)`} />
      </g>
      <path d={d} fill="none" stroke={mix(som, "#000", 0.3)} strokeWidth={Math.max(1, pm * 0.03)} opacity={0.5} />
    </g>
  );
};

/** Cable de acero a escala; `z` = zoom de cámara, para que nunca quede por debajo de ~1,4 px en pantalla. */
export const CableE: React.FC<{ d: string; pm: number; z?: number }> = ({ d, pm, z = 1 }) => {
  const w = Math.max(M.cable * pm, 1.4 / z);
  return <g><path d={d} stroke="#4E5864" strokeWidth={w * 1.5} fill="none" strokeLinecap="round" /><path d={d} stroke="#AEB8C4" strokeWidth={w} fill="none" strokeLinecap="round" />
    <path d={d} stroke="#E8EEF3" strokeWidth={w * 0.35} fill="none" strokeDasharray={`${w} ${w * 1.2}`} /></g>;
};

/** Mosquetón de ferrata a escala real: (x,y) = punto de apoyo en el cable. */
export const MosqE: React.FC<{ x: number; y: number; pm: number; ang?: number }> = ({ x, y, pm, ang = 0 }) => <Mosqueton x={x} y={y} ang={ang} s={(M.mosq * pm) / 124} />;
/** Brazo elástico a escala (ancho de cinta ~2,5 cm). */
export const BrazoE: React.FC<{ a: [number, number]; b: [number, number]; pm: number; tension?: number }> = ({ a, b, pm, tension = 0 }) => <Elastico a={a} b={b} w={Math.max(2, 0.028 * pm)} tension={tension} />;
/** Punta de abajo del mosquetón (donde se cose el brazo). */
export const pieMosq = (x: number, y: number, pm: number): [number, number] => [x, y + M.mosq * pm * 0.92];

/** Funda cerrada del disipador colgada del arnés (de lado, a escala). */
export const FundaE: React.FC<{ x: number; y: number; pm: number }> = ({ x, y, pm }) => {
  const l = M.fundaL * pm, a = M.fundaA * pm;
  return <g><rect x={x - a / 2} y={y} width={a} height={l} rx={a * 0.35} fill="#262B33" stroke="#11151B" strokeWidth={Math.max(0.6, pm * 0.006)} />
    <rect x={x - a / 2 + a * 0.18} y={y + l * 0.15} width={a * 0.64} height={l * 0.7} rx={a * 0.2} fill="none" stroke="#4A525E" strokeWidth={Math.max(0.5, pm * 0.004)} strokeDasharray={`${pm * 0.012} ${pm * 0.01}`} /></g>;
};

/** Grapa de hierro (peldaño en U) vista de frente: 30 cm de ancho, sale ~15 cm de la roca. */
export const Grapa: React.FC<{ x: number; y: number; pm: number }> = ({ x, y, pm }) => {
  const w = M.grapa * pm, g = Math.max(1.2, 0.02 * pm);
  return <g><path d={`M${x - w / 2} ${y - pm * 0.06} L${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2} ${y - pm * 0.06}`} stroke="#3A414B" strokeWidth={g * 1.4} fill="none" strokeLinecap="round" />
    <path d={`M${x - w / 2} ${y - g * 0.3} L${x + w / 2} ${y - g * 0.3}`} stroke="#9AA6B2" strokeWidth={g * 0.5} /></g>;
};

/** Anclaje del cable (placa con ojal). */
export const Anclaje: React.FC<{ x: number; y: number; pm: number }> = ({ x, y, pm }) => {
  const r = 0.05 * pm;
  return <g><rect x={x - r * 1.4} y={y - r * 1.6} width={r * 2.8} height={r * 3.4} rx={r * 0.6} fill="#5B6573" /><circle cx={x} cy={y} r={r * 0.75} fill="#C3CCD6" stroke="#4E5864" strokeWidth={r * 0.3} /></g>;
};
