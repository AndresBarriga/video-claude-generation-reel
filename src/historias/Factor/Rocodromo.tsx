// s6: «¿Y en el rocódromo?»: pared de resina, caída corta junto al primer seguro; el factor es bajo pero los pies se quedan a un palmo del suelo.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Resina, RESINA } from "../../piezas/Rocodromo";
import { Panel, Esc, Dato, Pildora, clamp, golpe, type P, xF, CHAPAS, APARATO, SUELO, Asegura, PC, CAE, CUELGA, AG, TU_CUEVA, C } from "./comun";

const Gimnasio: React.FC = () => {
  const ys = Array.from({ length: 40 }, (_, i) => 1000 + i * 50), cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      <rect x={-800} y={0} width={3000} height={4000} fill="#2E3848" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-600 + i * 260} y={1180} width={140} height={22} rx={8} fill="#F4F0E2" opacity={0.85} />)}
      <rect x={-800} y={1210} width={3000} height={400} fill="#38445A" opacity={0.6} />
      <path d={`M${cara} L2200 3400 L2200 1000 Z`} fill="#6E8FB5" />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${xF(1000 + i * 180)} ${1000 + i * 180} L2200 ${1000 + i * 180}`} stroke="#5A7AA0" strokeWidth={4} />)}
      {Array.from({ length: 120 }).map((_, i) => { const y = 1020 + (i % 12) * 140, x = xF(y) + 40 + Math.floor(i / 12) * 70; return <circle key={i} cx={x} cy={y} r={4} fill="#3E5878" />; })}
      {Array.from({ length: 22 }).map((_, i) => { const y = 1100 + i * 70 + random(`hy${i}`) * 30, x = xF(y) + 30 + random(`hx${i}`) * 260; return <Resina key={i} x={x} y={y} r={20 + random(`hr${i}`) * 14} c={RESINA[i % RESINA.length]} seed={`h${i}`} />; })}
      <path d={`M${cara}`} stroke="#141B26" strokeWidth={6} fill="none" opacity={0.5} />
      <rect x={-800} y={SUELO} width={3000} height={600} fill="#3A3F46" />
      <rect x={-800} y={SUELO} width={3000} height={16} fill="#555C66" />
      <circle cx={xF(CHAPAS[0]) + 4} cy={CHAPAS[0]} r={11} fill="#B8C0C8" stroke="#141B26" strokeWidth={4} />
      <path d={`M${xF(CHAPAS[0]) + 2} ${CHAPAS[0] + 6} L${xF(CHAPAS[0]) - 4} ${CHAPAS[0] + 40}`} stroke="#3D7FD0" strokeWidth={12} strokeLinecap="round" />
    </g>
  );
};

export const Rocodromo: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fFa = pal("factor") ?? 40, fSu = pal("suelo") ?? 110, fCae = Math.max(8, fSu - 26);
  const k = f - fCae, y0 = 2110, x0 = xF(2110) - 78, D = 330, AX = -150;
  const p = k <= 0 ? { x: x0, y: y0, ang: AG } : k < 16 ? { x: x0 + 60 * (k / 16), y: y0 + D * (k / 16) ** 2, ang: CAE } : { x: x0 + 60, y: y0 + D + 22 * Math.exp(-(k - 16) / 5) * Math.cos((k - 16) / 2.5), ang: CUELGA };
  const dy = k > 16 ? -18 * Math.exp(-(k - 16) / 7) : 0;
  const ap0 = APARATO(dy), ap = { x: ap0.x + AX, y: ap0.y }, mos = { x: xF(CHAPAS[0]) - 6, y: CHAPAS[0] + 54 };
  const rope = `M${ap.x} ${ap.y} L${mos.x} ${mos.y} Q${(mos.x + p.x) / 2 - 20} ${(mos.y + p.y) / 2 + (k > 0 && k < 16 ? 60 : 0)} ${p.x + 18} ${p.y - 6}`;
  const sh = golpe(f, fCae + 16, 10), rojo = interpolate(f, [fSu, fSu + 6], [0, 1], clamp);
  const sp = (f0: number) => spring({ frame: f - f0, fps, config: { damping: 12, stiffness: 190 } });
  return (
    <AbsoluteFill style={{ background: "#050B14" }}>
      <Panel lado={0} ancho={1080} cx={620} cy={2240} z={0.95} sh={sh}>
        <Gimnasio />
        {rojo > 0 && <rect x={-800} y={SUELO - 4} width={3000} height={30} fill={PC.miedo} opacity={0.75 * rojo * (0.7 + 0.3 * Math.sin(f / 3))} />}
        <path d={rope} stroke={C.cuerdaS} strokeWidth={14} fill="none" strokeLinecap="round" /><path d={rope} stroke={C.cuerda} strokeWidth={10} fill="none" strokeLinecap="round" />
        <g transform={`translate(${AX} 0)`}><Asegura dy={dy} cara={k > 16 ? "esfuerzo" : "normal"} /></g>
        <Esc p={p} a={TU_CUEVA} cara={k > 0 ? "miedo" : "esfuerzo"} />
      </Panel>
      <Pildora x={540} texto="ROCÓDROMO" />
      {f >= fFa && <Dato x={540} y={470} texto="FACTOR BAJO" tam={84} color="#9FD6B0" s={sp(fFa)} />}
      {f >= fSu && <Dato x={540} y={1300} texto="EL SUELO" tam={92} color={PC.miedo} s={sp(fSu)} />}
    </AbsoluteFill>
  );
};
