// 5 · «¿Apretar más te alarga la vida? No.»: Nora aprieta una pinza de mano como loca; ✗ grande.
// 6 · «Tu agarre es un chivato de tu fuerza en general»: silueta; se ilumina la mano y luego todo el cuerpo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { mano, type Angulos } from "../../piezas/kit/rig";
import { Sello } from "../../piezas/kit";
import { COL, Dato, NORA, Papel, Svg, T, cl, pop, sale, type P } from "./comun";

const S = 3.1, HIP = { x: 430, y: 1230 };
/** Pinza de mano (gripper): muelle arriba y dos mangos; `cierra` 0–1 junta los mangos. Origen = donde la agarra la mano. */
const Pinza: React.FC<{ x: number; y: number; s: number; cierra: number }> = ({ x, y, s, cierra }) => {
  const a = 22 - 16 * cierra;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((l) => <g key={l} transform={`rotate(${l * a} 0 -60)`}><rect x={-12} y={-60} width={24} height={110} rx={12} fill={l < 0 ? "#3A4557" : COL.rojo} stroke={T} strokeWidth={5} /></g>)}
      <circle cx={0} cy={-70} r={18} fill="none" stroke="#9AA6B8" strokeWidth={8} /><circle cx={0} cy={-70} r={18} fill="none" stroke={T} strokeWidth={3} />
    </g>
  );
};
const Gotas: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>{[0, 1, 2].map((i) => { const t = ((f + i * 7) % 21) / 21; return <path key={i} d={`M${x + (i - 1) * 70} ${y + t * 80} q-16 24 0 34 q16 -10 0 -34 Z`} fill="#7CC3FF" stroke={T} strokeWidth={4} opacity={1 - t} />; })}</g>
);

export const No: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tN = (pal("No.") ?? Math.round(d * 0.75)) - 2, para = f >= tN;
  const c = para ? 0.2 : 0.5 + 0.5 * Math.sin(f * 1.3);
  const ang: Angulos = { torso: para ? 0 : 6, cabeza: para ? 4 : -6 + 4 * Math.sin(f * 1.3), brazoA: [40, 130], brazoB: [-14, -6], piernaA: [8, 0], piernaB: [-8, 0] };
  const m = mano(ang), tb = para ? 0 : Math.sin(f * 2.1) * 6;
  return (
    <>
      <Svg>
        <Papel />
        <ellipse cx={HIP.x} cy={HIP.y + 132 * S} rx={170} ry={26} fill={T} opacity={0.15} />
        <Escalador x={HIP.x + tb} y={HIP.y} quien="joe" s={S} angulos={ang} aspecto={NORA} cara={para ? "serio" : "esfuerzo"} mira={1} />
        <Pinza x={HIP.x + tb + m.x * S + 6} y={HIP.y + m.y * S + 92} s={1.5} cierra={c} />
        {!para && <Gotas x={HIP.x + 40} y={HIP.y - 150 * S} f={f} />}
        {<text x={800} y={700} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={96} fill={COL.naranja} stroke={T} strokeWidth={12} paintOrder="stroke" transform={`rotate(-10 800 700)`} opacity={para ? 0.55 : sale(f / 6)}>¿+ VIDA?</text>}
        {para && <path d="M640 740 L960 650" stroke={COL.rojo} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${sale((f - tN) / 5)} 1`} />}
      </Svg>
      <Sello x={760} y={980} k={(f - tN) / 10} s={2.4} />
    </>
  );
};

/** Filtro que pinta todo de un color (silueta). */
const Solido: React.FC<{ id: string; color: string; brillo?: number }> = ({ id, color, brillo = 0 }) => (
  <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
    <feFlood floodColor={color} result="c" /><feComposite in="c" in2="SourceAlpha" operator="in" result="s" />
    {brillo > 0 ? <><feGaussianBlur in="s" stdDeviation={brillo} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="s" /></feMerge></> : <feMerge><feMergeNode in="s" /></feMerge>}
  </filter>
);
export const Chivato: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tA = (pal("agarre") ?? 2) - 2, tF = (pal("fuerza") ?? Math.round(d * 0.6)) - 3;
  const ang: Angulos = { torso: 0, cabeza: 0, brazoA: [24, 40], brazoB: [-14, -6], piernaA: [8, 0], piernaB: [-8, 0] };
  const m = mano(ang), hx = 540 + m.x * S, hy = 1180 + m.y * S;
  const r = f < tF ? 150 * sale((f - tA) / 8) : interpolate(f, [tF, tF + 22], [150, 1300], cl);
  const cuerpo = <Escalador x={540} y={1180} quien="joe" s={S} angulos={ang} aspecto={NORA} cara="normal" mira={1} />;
  return (
    <>
      <Svg>
        <Papel tono="#EFE8DA" />
        <defs>
          <Solido id="ap-sil" color="#26324A" /><Solido id="ap-luz" color="#FFB347" brillo={14} />
          <mask id="ap-m" maskUnits="userSpaceOnUse" x={-200} y={-200} width={1480} height={2320}><rect x={-200} y={-200} width={1480} height={2320} fill="#000" /><circle cx={hx} cy={hy} r={Math.max(0.1, r)} fill="#fff" /></mask>
        </defs>
        <g filter="url(#ap-sil)">{cuerpo}</g>
        <g mask="url(#ap-m)"><g filter="url(#ap-luz)" opacity={0.85}>{cuerpo}</g>{cuerpo}</g>
        {r > 1 && f < tF + 6 && <circle cx={hx} cy={hy} r={r * 0.9} fill="none" stroke={COL.naranja} strokeWidth={8} strokeDasharray="18 14" opacity={0.8} />}
      </Svg>
      <Dato t="AGARRE" x={hx + 150} y={hy + 40} k={f - tA - 4} tam={52} fondo={COL.amarillo} />
      <Dato t="FUERZA GENERAL" x={540} y={1530} k={f - tF - 10} tam={60} fondo={COL.naranja} color="#fff" />
    </>
  );
};
