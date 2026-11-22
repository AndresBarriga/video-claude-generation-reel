// E68 · gancho (brazo colgando de la regleta → zoom a la A2; amago de «pop»), anillos y analogía (cable grapado a una viga doblada).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Dedo, geom } from "./Dedo";
import { FondoRx, Cam, Grande, cl, COL, F, golpe, Svg, type P } from "./comun";

const G = geom(1), A2 = { x: (G.mcp.x + G.pip.x) / 2, y: (G.mcp.y + G.pip.y) / 2 };
const Peso: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o}><path d="M960 1560 V1800" stroke={COL.rojo} strokeWidth={30} strokeLinecap="round" /><path d="M900 1760 L960 1840 L1020 1760 Z" fill={COL.rojo} />
    <text x={940} y={1520} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff" stroke="#14213A" strokeWidth={10} paintOrder="stroke">TU PESO</text></g>
);
export const Gancho: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fS = pal("sitio") ?? 70, fP = pal("pop") ?? 150;
  const xray = interpolate(f, [4, 24], [0.45, 1], cl), glow = interpolate(f, [fS - 6, fS + 10], [0, 1], cl), z = interpolate(f, [fS - 10, fS + 16], [0, 1], cl);
  const s = 0.78 + 0.6 * z, px = 600 + (A2.x - 600) * z, py = 1320 + (A2.y + 40 - 1320) * z;
  const tease = f >= fP && f < fP + 14 ? 0.25 : 0;
  return (
    <>
      <FondoRx />
      <Cam s={s} px={px} py={py} sx={golpe(f, fP, 18)}><Dedo k={1} xray={xray} calor={glow * 0.7 + tease * 2} glowA2={glow} roto={tease} /><Peso o={1 - z} /></Cam>
      {f >= fP && f < fP + 12 && <AbsoluteFill style={{ background: "rgba(255,240,200,.35)" }} />}
      <Grande t="DENTRO DE TU DEDO" top={1560} k={f < fS ? 12 : 0} tam={92} />
      <Grande t="¿POP?" top={1500} k={f - fP} tam={140} fondo={COL.rojo} color="#fff" />
    </>
  );
};
export const Anillos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fA = pal("anillos") ?? 40, fP = pal("poleas") ?? 70;
  const s = interpolate(f, [0, 60], [1.4, 1.15], cl), px = interpolate(f, [0, 60], [A2.x, 560], cl), py = interpolate(f, [0, 60], [A2.y + 40, 1060], cl);
  return (
    <>
      <FondoRx />
      <Cam s={s} px={px} py={py}><Dedo k={1} calor={0.25} etiquetas={f >= fA ? 1 : 0} glowA2={0.4} /></Cam>
      <Grande t="POLEAS" top={1560} k={f - fP} tam={120} fondo={COL.amarillo} />
    </>
  );
};
/** Analogía: cable grapado por dentro de una viga doblada (como el tendón en el dedo). Al tirar, salta la grapa del codo y el cable corta la esquina. */
export const Grapas: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fS = pal("salta") ?? 60, tira = interpolate(f, [8, 30], [0, 1], cl), k = interpolate(f, [fS, fS + 10], [0, 1], cl);
  const A = { x: 150, y: 760 }, C = { x: 560, y: 1160 }, B = { x: 930, y: 760 }; // viga en V invertida: A→C→B (esquina abajo)
  const off = 46, Ai = { x: A.x + 10, y: A.y - off }, Ci = { x: C.x, y: C.y - off * 1.4 }, Bi = { x: B.x - 10, y: B.y - off };
  const mid = { x: (Ai.x + Bi.x) / 2, y: (Ai.y + Bi.y) / 2 }, cuerda = { x: Ci.x + (mid.x - Ci.x) * 0.92 * k, y: Ci.y + (mid.y - Ci.y) * 0.92 * k };
  const grapas = [0.25, 0.6, 1, 1.4, 1.75];
  const enV = (t: number) => (t <= 1 ? { x: Ai.x + (Ci.x - Ai.x) * t, y: Ai.y + (Ci.y - Ai.y) * t } : { x: Ci.x + (Bi.x - Ci.x) * (t - 1), y: Ci.y + (Bi.y - Ci.y) * (t - 1) });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#FFF6E8, #F1E3CC)" }}>
      <Svg>
        <path d={`M${A.x} ${A.y} L${C.x} ${C.y} L${B.x} ${B.y}`} stroke="#B9875A" strokeWidth={70} strokeLinejoin="round" strokeLinecap="round" fill="none" />
        <path d={`M${A.x} ${A.y} L${C.x} ${C.y} L${B.x} ${B.y}`} stroke="#D9A877" strokeWidth={40} strokeLinejoin="round" strokeLinecap="round" fill="none" />
        <path d={`M${Ai.x - 120} ${Ai.y - 10} L${Ai.x} ${Ai.y} L${cuerda.x} ${cuerda.y} L${Bi.x} ${Bi.y} L${Bi.x + 60 + 60 * tira} ${Bi.y - 200 * tira}`} stroke="#FF8A2E" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {grapas.map((t, i) => { const p = enV(t), suelta = i === 2, dy = suelta ? -380 * k : 0, rot = suelta ? 200 * k : 0;
          return <g key={i} transform={`translate(${p.x + (suelta ? 160 * k : 0)} ${p.y + dy}) rotate(${rot})`} opacity={suelta ? 1 - 0.5 * k : 1}><path d="M-30 30 V-26 H30 V30" stroke="#475569" strokeWidth={15} fill="none" strokeLinejoin="round" /></g>; })}
        <g opacity={tira}><path d={`M${Bi.x + 80} ${Bi.y - 220} l80 -110`} stroke={COL.rojo} strokeWidth={24} strokeLinecap="round" /><path d={`M${Bi.x + 140} ${Bi.y - 300} l40 -50 l-62 4 Z`} fill={COL.rojo} /><text x={Bi.x + 20} y={Bi.y - 340} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={54} fill="#14213A">TIRAS</text></g>
        {k > 0.2 && <text x={540} y={1330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill={COL.rojo} opacity={k}>¡SE SEPARA!</text>}
      </Svg>
      <Grande t="GRAPA = POLEA" top={430} k={f - 4} tam={90} fondo={COL.amarillo} />
    </AbsoluteFill>
  );
};
