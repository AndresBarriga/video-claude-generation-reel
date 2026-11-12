// s8: «Así que justos, sí.» el gato ajustado en corte (verde, ✓) · «Y para vías largas, cómodos.» la pared entera a la luz dorada de la tarde;
// la cámara vuela hasta la repisa de la reunión: él, con unos gatos cómodos, mueve el pie a gusto; ella, sentada con los pies colgando.
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Svg, clamp, cam, Cuerda, C, TU_ROCA, ELLA, G, T, Pildora, Rotulo, type P } from "./comun";
import { FondoP, Placa, REP_Y, xP } from "./Placa";
import { Corte } from "./Machacado";

export const Largas: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fSi = pal("sí") ?? 40, fY = pal("y") ?? 53, fC = pal("cómodos") ?? 89;
  if (f < fY) {
    const ok = spring({ frame: f - fSi, fps, config: { damping: 10, stiffness: 200 } });
    return (
      <AbsoluteFill>
        <Corte L={26} halo={G.bien} z={interpolate(f, [0, fY], [1, 1.06], clamp)} />
        <Pildora x={540} y={560} texto="JUSTOS" color={G.bien} desde={Math.max(2, (pal("justos") ?? 19) - 2)} tam={84} />
        <Svg><g transform={`translate(800 560) scale(${ok})`}><circle r={62} fill={G.bien} stroke="#06101C" strokeWidth={8} /><path d="M-28 2 L-8 24 L30 -22" stroke="#06101C" strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g></Svg>
      </AbsoluteFill>
    );
  }
  const t = interpolate(f, [fY, fY + 38], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = 0.4 + t * 1.2 + interpolate(f, [fY + 38, d], [0, 0.08], clamp), cx = 720 + t * 10, cy = -200 + t * (REP_Y - 100 + 200);
  const xr = xP(REP_Y), ancla = { x: xP(REP_Y - 250) + 34, y: REP_Y - 188 }, tu = { x: xr - 74, y: REP_Y - 138 }, ella = { x: xr - 300, y: REP_Y - 12 };
  const mueve = Math.sin(f / 4.5), estira = spring({ frame: f - fC, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Svg>
        <FondoP h={0.62} cx={cx} cy={cy + 1500} z={z} />
        {[0, 1, 2].map((i) => <path key={i} d={`M230 1010 L${-200 + i * 260} 2200 L${-40 + i * 260} 2200 Z`} fill="#FFE2A8" opacity={0.07} />)}
        <g transform={cam(cx, cy, z)}>
          <Placa h={0.62} cintas={99999} repisa suelo={false} />
          {/* cuerda recogida en la repisa y cabos de anclaje */}
          {Array.from({ length: 5 }).map((_, i) => <g key={i}><ellipse cx={xr - 190 + (random(`mr${i}`) - 0.5) * 16} cy={REP_Y - 10 - i * 5} rx={40 - i * 2} ry={11} fill="none" stroke={C.cuerdaS} strokeWidth={12} /><ellipse cx={xr - 190 + (random(`mr${i}`) - 0.5) * 16} cy={REP_Y - 10 - i * 5} rx={40 - i * 2} ry={11} fill="none" stroke={C.cuerda} strokeWidth={8} /></g>)}
          <Cuerda d={`M${xr - 160} ${REP_Y - 24} Q${xr - 40} ${REP_Y - 60} ${xr - 10} ${REP_Y + 40} L${xP(REP_Y + 700) - 8} ${REP_Y + 700} L${xP(REP_Y + 2600) - 8} ${REP_Y + 2600}`} w={9} />
          <path d={`M${ella.x + 10} ${ella.y - 30} Q${ella.x + 60} ${ancla.y + 60} ${ancla.x} ${ancla.y}`} stroke="#3D7FD0" strokeWidth={8} fill="none" strokeLinecap="round" />
          <Escalador x={ella.x} y={ella.y} quien="simon" angulos={{ torso: -8, cabeza: -6, brazoA: [30, 70], brazoB: [-40, -20], piernaA: [82, 4 + mueve * 5], piernaB: [76, -4 - mueve * 5] }} cara="alivio" aspecto={ELLA} pies="#8FB05A" mira={-1} />
          <path d={`M${tu.x - 14} ${tu.y - 30} Q${tu.x + 30} ${ancla.y + 80} ${ancla.x} ${ancla.y}`} stroke="#3D7FD0" strokeWidth={8} fill="none" strokeLinecap="round" />
          <Escalador x={tu.x} y={tu.y} quien="joe" angulos={{ torso: -4 - estira * 4, cabeza: -10 - estira * 10, brazoA: [20 + estira * 128, 60 + estira * 104], brazoB: [-16 + estira * 190, -30 + estira * 222], piernaA: [16 + mueve * 6, 4 + mueve * 10], piernaB: [-6, 0] }} cara="alivio" aspecto={TU_ROCA} pies="#7FB3D9" bolsa="#D9614A" mira={-1} />
          <rect x={0} y={0} width={0} height={0} fill={T} />
        </g>
        {[0, 1, 2].map((i) => { const bx = 120 + i * 70 + (f - fY) * 2.2, by = 520 + i * 46 + Math.sin(f / 6 + i) * 8, a = Math.sin(f / 2.2 + i) * 9; return <path key={i} d={`M${bx - 20} ${by - a} Q${bx - 8} ${by - 10} ${bx} ${by} Q${bx + 8} ${by - 10} ${bx + 20} ${by - a}`} stroke="#1A2433" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.75} />; })}
      </Svg>
      <Rotulo texto="VÍAS LARGAS" desde={fY + 6} top={240} tam={112} />
      <Pildora x={540} y={1290} texto="CÓMODOS" color={G.bien} desde={fC} tam={84} />
    </AbsoluteFill>
  );
};
