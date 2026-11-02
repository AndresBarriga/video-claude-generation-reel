// Escalador visto de frente. Manos y pies van a las presas por IK de dos huesos. `th` = giro de «puerta» alrededor de la línea vertical x = hx (se abre hacia la cámara).
import React from "react";
import { PU } from "./comun";

export type V = [number, number];
export type CaraF = "normal" | "esfuerzo" | "miedo" | "alivio" | "serio";
const ik = (a: V, t: V, l1: number, l2: number, s: 1 | -1): { j: V; e: V } => {
  const dx = t[0] - a[0], dy = t[1] - a[1], dist = Math.hypot(dx, dy) || 1, mx = l1 + l2 - 0.5;
  const d = Math.min(mx, Math.max(Math.abs(l1 - l2) + 0.5, dist)), b = Math.atan2(dy, dx), an = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  return { j: [a[0] + Math.cos(b + s * an) * l1, a[1] + Math.sin(b + s * an) * l1], e: dist > mx ? [a[0] + (dx / dist) * mx, a[1] + (dy / dist) * mx] : t };
};
const Miembro: React.FC<{ a: V; j: V; e: V; w: number; col: string; fin?: React.ReactNode }> = ({ a, j, e, w, col, fin }) => (
  <g strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d={`M${a} L${j} L${e}`} stroke={PU.tinta} strokeWidth={w + 9} opacity={0.55} /><path d={`M${a} L${j} L${e}`} stroke={col} strokeWidth={w} />{fin}
  </g>
);
const Rostro: React.FC<{ cara: CaraF; r: number; sh: number }> = ({ cara, r, sh }) => {
  const k = r / 30, st = { stroke: "#141B26", strokeWidth: 4 * k, strokeLinecap: "round" as const, fill: "none" };
  const ox = sh * 14 * k, ex = [-10 * k + ox, 10 * k + ox];
  return (
    <g>
      {cara === "miedo" && <>{ex.map((x, i) => <g key={i}><ellipse cx={x} cy={-3 * k} rx={6.5 * k} ry={8 * k} fill="#fff" /><circle cx={x + sh * 2 * k} cy={-3 * k} r={3 * k} fill="#141B26" /></g>)}<path d={`M${-16 * k + ox} ${-15 * k} L${-4 * k + ox} ${-12 * k} M${4 * k + ox} ${-12 * k} L${16 * k + ox} ${-15 * k}`} {...st} /><ellipse cx={ox} cy={13 * k} rx={5 * k} ry={7 * k} fill="#141B26" /></>}
      {cara === "esfuerzo" && <>{ex.map((x, i) => <circle key={i} cx={x} cy={-2 * k} r={3.4 * k} fill="#141B26" />)}<path d={`M${-17 * k + ox} ${-12 * k} L${-4 * k + ox} ${-8 * k} M${17 * k + ox} ${-12 * k} L${4 * k + ox} ${-8 * k}`} {...st} /><rect x={-9 * k + ox} y={9 * k} width={18 * k} height={7 * k} rx={2 * k} fill="#fff" stroke="#141B26" strokeWidth={3 * k} /></>}
      {cara === "alivio" && <><path d={`M${-15 * k + ox} ${-2 * k} Q${-10 * k + ox} ${-8 * k} ${-5 * k + ox} ${-2 * k} M${5 * k + ox} ${-2 * k} Q${10 * k + ox} ${-8 * k} ${15 * k + ox} ${-2 * k}`} {...st} /><path d={`M${-9 * k + ox} ${10 * k} Q${ox} ${19 * k} ${9 * k + ox} ${10 * k}`} {...st} /></>}
      {cara === "serio" && <>{ex.map((x, i) => <circle key={i} cx={x} cy={-2 * k} r={3.6 * k} fill="#141B26" />)}<path d={`M${-8 * k + ox} ${12 * k} L${8 * k + ox} ${11 * k}`} {...st} /></>}
      {cara === "normal" && <>{ex.map((x, i) => <circle key={i} cx={x} cy={-2 * k} r={3.6 * k} fill="#141B26" />)}<path d={`M${-8 * k + ox} ${11 * k} Q${ox} ${15 * k} ${8 * k + ox} ${11 * k}`} {...st} /></>}
    </g>
  );
};

export type PropsFrente = { cx: number; cy: number; s?: number; hx?: number; th?: number; manoR?: V; manoL?: V; pieR?: V; pieL?: V; cara?: CaraF; chaqueta?: string; chaquetaS?: string; gorro?: string; trenza?: boolean; f?: number; tension?: boolean; nud?: number; halo?: number; huesos?: number; codos?: { col: string; o: number } };
export const Frente: React.FC<PropsFrente> = ({ cx, cy, s = 1.6, hx = 700, th = 0, manoR, manoL, pieR, pieL, cara = "normal", chaqueta = PU.chaqueta, chaquetaS = PU.chaquetaS, gorro, trenza = true, f = 0, tension, nud = 0, halo = 0, huesos = 0, codos }) => {
  const t = (th * Math.PI) / 180, c = Math.cos(t), sn = Math.sin(t);
  const w = (p: V) => { const r = hx - p[0]; return { p: [hx - r * c, p[1]] as V, z: r * sn }; };
  const LS = w([cx - 40 * s, cy - 132 * s]), RS = w([cx + 40 * s, cy - 132 * s]), LH = w([cx - 26 * s, cy + 6 * s]), RH = w([cx + 26 * s, cy + 6 * s]), HD = w([cx, cy - 172 * s]);
  const zs = 1 + HD.z * 0.0022, br = Math.sin(f / 7) * 10 * (th > 1 ? 1 : 0.3);
  const colgar = (a: V, lado: -1 | 1, largo: number): V => [a[0] + lado * 18 * s + br * lado, a[1] + largo * s];
  const aR = ik(RS.p, manoR ?? colgar(RS.p, 1, 112), 62 * s, 58 * s, -1), aL = ik(LS.p, manoL ?? colgar(LS.p, -1, 112), 62 * s, 58 * s, 1);
  const lR = ik(RH.p, pieR ?? [RH.p[0] + 10 * s - br, RH.p[1] + 150 * s], 80 * s, 78 * s, -1), lL = ik(LH.p, pieL ?? [LH.p[0] - 20 * s + br, LH.p[1] + 150 * s], 80 * s, 78 * s, 1);
  const torso = `M${LS.p} L${RS.p} L${RH.p} L${LH.p} Z`, sombra = HD.z * 0.8;
  const mano = (e: V, i: number) => <g key={i}><circle cx={e[0]} cy={e[1]} r={17 * s * zs} fill={PU.piel} stroke={PU.tinta} strokeOpacity={0.5} strokeWidth={4} />{nud > 0 && <circle cx={e[0]} cy={e[1] - 5 * s} r={8 * s} fill="#fff" opacity={0.9 * nud} />}</g>;
  const pie = (e: V, i: number) => <ellipse key={i} cx={e[0]} cy={e[1] + 6 * s} rx={22 * s} ry={13 * s} fill={PU.zapato} stroke="#fff" strokeOpacity={0.35} strokeWidth={3} />;
  return (
    <g>
      <defs><filter id="sombraF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter></defs>
      <g opacity={Math.min(0.5, 0.12 + sombra * 0.004)} transform={`translate(${-sombra} ${sombra * 0.45})`} fill="#000" filter="url(#sombraF)"><path d={torso} stroke="#000" strokeWidth={30 * s} strokeLinejoin="round" /><circle cx={HD.p[0]} cy={HD.p[1]} r={34 * s * zs} /><path d={`M${LH.p} L${lL.j} L${lL.e} M${RH.p} L${lR.j} L${lR.e}`} stroke="#000" strokeWidth={26 * s} fill="none" strokeLinecap="round" /></g>
      <Miembro a={LH.p} j={lL.j} e={lL.e} w={30 * s} col={PU.pantalon} fin={pie(lL.e, 1)} /><Miembro a={RH.p} j={lR.j} e={lR.e} w={30 * s} col={PU.pantalon} fin={pie(lR.e, 2)} />
      <path d={`M${HD.p[0]} ${HD.p[1] + 20 * s} L${(LS.p[0] + RS.p[0]) / 2} ${(LS.p[1] + RS.p[1]) / 2 + 6 * s}`} stroke={PU.pielS} strokeWidth={24 * s} strokeLinecap="round" />
      <path d={torso} fill={chaqueta} stroke={chaqueta} strokeWidth={30 * s} strokeLinejoin="round" />
      <path d={torso} fill="none" stroke={chaquetaS} strokeWidth={6} strokeLinejoin="round" opacity={0.6} />
      {tension && <g stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.85}>{[0.35, 0.55, 0.75].map((k) => <path key={k} d={`M${LS.p[0] + (LH.p[0] - LS.p[0]) * k + 10 * s} ${LS.p[1] + (LH.p[1] - LS.p[1]) * k} L${RS.p[0] + (RH.p[0] - RS.p[0]) * k - 10 * s} ${RS.p[1] + (RH.p[1] - RS.p[1]) * k}`} />)}</g>}
      {halo > 0 && [[LS.p, aL], [RS.p, aR]].map(([o, a], i) => <path key={`h${i}`} d={`M${(o as V)} L${(a as typeof aL).j} L${(a as typeof aL).e}`} stroke="#FF5A4A" strokeWidth={50 * s} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.3 * halo} />)}
      <Miembro a={LS.p} j={aL.j} e={aL.e} w={22 * s} col={chaqueta} fin={mano(aL.e, 3)} /><Miembro a={RS.p} j={aR.j} e={aR.e} w={22 * s} col={chaqueta} fin={mano(aR.e, 4)} />
      {huesos > 0 && [[LS.p, aL], [RS.p, aR]].map(([o, a], i) => <g key={`b${i}`} opacity={huesos} stroke="#F4F7FA" strokeLinecap="round" strokeLinejoin="round" fill="none"><path d={`M${(o as V)} L${(a as typeof aL).j} L${(a as typeof aL).e}`} strokeWidth={9 * s} /><circle cx={(a as typeof aL).j[0]} cy={(a as typeof aL).j[1]} r={9 * s} fill="#F4F7FA" /></g>)}
      {codos && [aL.j, aR.j].map((j, i) => <circle key={`c${i}`} cx={j[0]} cy={j[1]} r={26 * s + 4 * Math.sin(f * 0.45)} fill="none" stroke={codos.col} strokeWidth={8} opacity={codos.o} />)}
      {trenza && <path d={`M${HD.p[0] - 30 * s * zs} ${HD.p[1] + 4 * s} Q${HD.p[0] - 58 * s} ${HD.p[1] + 60 * s} ${HD.p[0] - 44 * s} ${HD.p[1] + 120 * s}`} stroke={PU.pelo} strokeWidth={17 * s} strokeLinecap="round" fill="none" />}
      <circle cx={HD.p[0]} cy={HD.p[1]} r={34 * s * zs} fill={PU.piel} stroke={PU.tinta} strokeOpacity={0.45} strokeWidth={4} />
      <path d={`M${HD.p[0] - 34 * s * zs} ${HD.p[1] - 2 * s} A${34 * s * zs} ${34 * s * zs} 0 0 1 ${HD.p[0] + 34 * s * zs} ${HD.p[1] - 2 * s} Q${HD.p[0]} ${HD.p[1] - 18 * s} ${HD.p[0] - 34 * s * zs} ${HD.p[1] - 2 * s} Z`} fill={gorro ?? PU.pelo} />
      <g transform={`translate(${HD.p[0]} ${HD.p[1] + 4 * s})`}><Rostro cara={cara} r={30 * s * zs} sh={-sn} /></g>
    </g>
  );
};
