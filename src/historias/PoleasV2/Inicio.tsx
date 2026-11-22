// E68 · gancho (dedo que pasa de piel a rayos X; el tirón acaba en la A2; amago de «pop»), anillos y analogía de las grapas.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, cl, pop, COL, F, golpe, Svg, type P } from "./comun";

const G = geom(1);
export const Gancho: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fS = pal("sitio") ?? 70, fP = pal("pop") ?? 150;
  const xray = interpolate(f, [8, 30], [0, 1], cl), glow = interpolate(f, [fS - 6, fS + 10], [0, 1], cl);
  const s = interpolate(f, [0, fS, fS + 20], [1, 1.05, 1.25], cl), px = interpolate(f, [fS, fS + 20], [700, (G.mcp.x + G.pip.x) / 2], cl), py = interpolate(f, [fS, fS + 20], [860, (G.mcp.y + G.pip.y) / 2 + 60], cl);
  const tease = f >= fP && f < fP + 14 ? 0.25 : 0;
  return (
    <>
      <FondoRx />
      <Cam s={s} px={px} py={py} sx={golpe(f, fP, 18)}><Dedo k={1} xray={xray} calor={glow * 0.7 + tease * 2} glowA2={glow} roto={tease} /></Cam>
      {f >= fP && f < fP + 12 && <AbsoluteFill style={{ background: "rgba(255,240,200,.35)" }} />}
      <Grande t="DENTRO DE TU DEDO" top={1480} k={f < fS ? 12 : 0} tam={96} />
      <Grande t="¿POP?" top={1460} k={f - fP} tam={140} fondo={COL.rojo} color="#fff" />
    </>
  );
};
export const Anillos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fA = pal("anillos") ?? 40, fP = pal("poleas") ?? 70;
  const s = interpolate(f, [0, 40], [1.25, 1.1], cl);
  return (
    <>
      <FondoRx />
      <Cam s={s} px={(G.mcp.x + G.pip.x) / 2 - 40} py={(G.mcp.y + G.pip.y) / 2 + 60}><Dedo k={1} calor={0.25} etiquetas={f >= fA ? 1 : 0} glowA2={0.4} /></Cam>
      <Grande t="POLEAS" top={1480} k={f - fP} tam={120} fondo={COL.amarillo} />
    </>
  );
};
/** Analogía: cable sujeto con grapas a una pared; salta una y el cable se separa. */
export const Grapas: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fS = pal("salta") ?? 60, k = interpolate(f, [fS, fS + 14], [0, 1], cl);
  const xs = [140, 340, 540, 740, 940], y = 1000, bow = 210 * k;
  const cable = `M40 ${y} L${xs[1]} ${y} Q${xs[2]} ${y + bow * 2} ${xs[3]} ${y} L1040 ${y}`;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#F6EFE4, #E9DFCF)" }}>
      <Svg>
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M0 ${560 + i * 120} H1080`} stroke="#DDD1BE" strokeWidth={4} />)}
        <path d={cable} stroke="#FF8A2E" strokeWidth={30} fill="none" strokeLinecap="round" />
        {xs.map((x, i) => { const suelta = i === 2, dy = suelta ? -420 * k : 0, rot = suelta ? 160 * k : 0, op = suelta ? 1 - k * 0.6 : 1;
          return <g key={i} transform={`translate(${x + (suelta ? 120 * k : 0)} ${y + dy}) rotate(${rot})`} opacity={op}><path d="M-34 26 V-30 H34 V26" stroke="#5A6B85" strokeWidth={16} fill="none" strokeLinejoin="round" /><circle cx={-34} cy={30} r={9} fill="#3A4558" /><circle cx={34} cy={30} r={9} fill="#3A4558" /></g>; })}
        {k > 0.1 && <text x={540} y={y + bow * 2 + 120} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill={COL.rojo} opacity={k}>¡SE SEPARA!</text>}
      </Svg>
      <Grande t="GRAPA = POLEA" top={560} k={f - 4} tam={96} fondo={COL.amarillo} />
      {void pop}
    </AbsoluteFill>
  );
};
