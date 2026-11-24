// 9 · «Y escalar es justo eso: apretar»: primer plano de la mano cerrándose de verdad sobre una regleta (por detrás, cuelga de ella).
// 10 · «Presa tras presa, vía tras vía»: romo → pinza → plano abierto de Nora en la vía (manos y pies en sus presas).
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Plano, Persona, crearVia, PERFILES, accEscalar } from "../../piezas/kit";
import { mano, type Angulos } from "../../piezas/kit/rig";
import { COL, Dato, NORA, Svg, T, cl, golpe, sale, type P } from "./comun";
import { ManoPresa } from "./Mano";

/** Panel de rocódromo en primer plano: tablero gris azulado con agujeros y marcas de magnesio. */
const Panel: React.FC<{ dy?: number }> = ({ dy = 0 }) => (
  <g transform={`translate(0 ${dy})`}>
    <rect x={-200} y={-400} width={1480} height={2900} fill="#A9B7C6" />
    {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M-200 ${-300 + i * 260} H1280`} stroke="#8E9DAE" strokeWidth={6} />)}
    {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={-60 + (i % 9) * 150 + (Math.floor(i / 9) % 2) * 75} cy={-300 + Math.floor(i / 9) * 210} r={9} fill="#6D7B8C" />)}
    {Array.from({ length: 9 }).map((_, i) => <ellipse key={`m${i}`} cx={random(`pm${i}`) * 1080} cy={random(`pn${i}`) * 1900} rx={60} ry={26} fill="#fff" opacity={0.35} />)}
  </g>
);
const Polvo: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => k < 0 || k > 18 ? null : (
  <g opacity={1 - k / 18}>{Array.from({ length: 9 }).map((_, i) => { const a = (i / 9) * Math.PI * 2; return <circle key={i} cx={x + Math.cos(a) * (40 + k * 9)} cy={y + Math.sin(a) * (20 + k * 4) - k * 3} r={22 + k * 1.5} fill="#fff" opacity={0.75} />; })}</g>
);

export const Pared: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tA = (pal("justo") ?? Math.round(d * 0.3)) - 2;
  const c = sale((f - tA) / 7), llega = sale(f / 10);
  return (
    <>
      <Svg>
        <g transform={`translate(0 ${golpe(f, tA + 6, 8)})`}>
          <Panel dy={-20 * c} />
          <ManoPresa x={540} y={interpolate(llega, [0, 1], [1250, 1020]) + 26 * c} s={1.45} tipo="regleta" cierra={c} color={COL.amarillo} tiembla={c > 0.9 ? Math.sin(f * 2.3) * 2 : 0} />
          <Polvo x={540} y={830} k={f - tA - 3} />
        </g>
      </Svg>
      <Dato t="REGLETA" x={850} y={560} k={f - 6} tam={46} />
    </>
  );
};

const VIA = crearVia({ perfil: PERFILES.vertical, metros: [3, 4.6, 6.2, 7.8] });
/** Presa de roca justo donde está la mano/pie (pared a la derecha del canto). */
const Saliente: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 24 }) => <g><path d={`M${x - r} ${y + 4} Q${x - r} ${y - r * 0.7} ${x + r * 0.6} ${y - r * 0.6} L${Math.max(x + r, VIA.xF(y) + 10)} ${y - r * 0.6} L${Math.max(x + r, VIA.xF(y) + 10)} ${y + r * 0.6} Q${x} ${y + r * 0.8} ${x - r} ${y + 4} Z`} fill="#8C6A44" stroke={T} strokeWidth={5} /><path d={`M${x - r * 0.6} ${y - r * 0.4} h${r}`} stroke="#fff" strokeWidth={5} opacity={0.6} strokeLinecap="round" /></g>;
const pie = (a: Angulos, cual: "A" | "B") => { const g = cual === "A" ? a.piernaA : a.piernaB, r = (v: number) => (v * Math.PI) / 180; const kx = Math.sin(r(g[0])) * 66, ky = Math.cos(r(g[0])) * 66; return { x: kx + Math.sin(r(g[1])) * 64 + 14, y: ky + Math.cos(r(g[1])) * 64 }; };

export const Presas: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tV = (pal("vía") ?? Math.round(d * 0.5)) - 3, tP = Math.round(tV * 0.5);
  if (f < tV) {
    const romo = f < tP, k = romo ? f : f - tP, c = sale((k - 2) / 6);
    return (
      <>
      <Svg>
        <Panel dy={-10 * c} />
        <ManoPresa x={540} y={romo ? 1060 + 20 * c : 1060} s={1.35} tipo={romo ? "romo" : "pinza"} cierra={c} color={romo ? COL.menta : "#9B7BEA"} />
        <Polvo x={540} y={romo ? 760 : 820} k={k - 6} />
      </Svg>
      <Dato t={romo ? "ROMO" : "PINZA"} x={850} y={560} k={k} tam={46} />
      </>
    );
  }
  const k = f - tV, t = interpolate(k, [0, d - tV], [0, 0.6], cl);
  const { p, ang } = accEscalar(VIA, VIA.cadera(1900).y, VIA.cadera(1700).y, t, 2);
  const mA = mano(ang, "A"), mB = mano(ang, "B"), pA = pie(ang, "A"), pB = pie(ang, "B");
  return (
    <>
      <Plano via={VIA} cx={560} cy={1640 - 60 * t} z={interpolate(k, [0, 14], [2.6, 1.9], cl)} decorado="roca" cintas>
        {[mA, mB].map((m, i) => <Saliente key={i} x={p.x + m.x} y={p.y + m.y + 8} />)}
        {[pA, pB].map((m, i) => <Saliente key={`p${i}`} x={p.x + m.x} y={p.y + m.y + 10} r={18} />)}
        <Persona p={p} ang={ang} aspecto={NORA} cara="esfuerzo" />
      </Plano>
    </>
  );
};
