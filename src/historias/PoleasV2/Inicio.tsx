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
  const xray = interpolate(f, [22, 40], [0, 1], cl), glow = interpolate(f, [fS - 6, fS + 10], [0, 1], cl), z = interpolate(f, [fS - 10, fS + 16], [0, 1], cl);
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
/** Analogía reconocible: el cable de la tele sujeto con abrazaderas blancas de clavo, rodeando el marco de una puerta.
 *  Alguien tropieza (tira del cable), salta la abrazadera de la esquina y el cable se despega y corta la esquina. */
const Abrazadera: React.FC<{ x: number; y: number; rot?: number; o?: number }> = ({ x, y, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <path d="M-44 18 Q-44 -40 0 -40 Q44 -40 44 18 L30 18 Q30 -24 0 -24 Q-30 -24 -30 18 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth={4} />
    <rect x={-52} y={14} width={104} height={14} rx={6} fill="#F1F5F9" stroke="#94A3B8" strokeWidth={4} />
    <circle cx={0} cy={-32} r={7} fill="#475569" />
  </g>
);
export const Grapas: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fS = pal("salta") ?? 60, tira = interpolate(f, [10, 34], [0, 1], cl), k = interpolate(f, [fS, fS + 9], [0, 1], cl);
  // marco de puerta: esquina en (620, 980); el cable baja por el marco y sigue por el rodapié (esquina interior)
  const E = { x: 640, y: 1000 }, top = { x: 640, y: 560 }, der = { x: 1000, y: 1000 };
  const ctrl = { x: E.x + (top.x + der.x - 2 * E.x) * 0.48 * k, y: E.y + (top.y + der.y - 2 * E.y) * 0.48 * k };
  const pie = { x: 1100 + 40 * tira, y: 1000 - 60 * tira };
  const cable = `M${top.x} 300 L${top.x} ${top.y} Q${ctrl.x} ${ctrl.y} ${der.x} ${der.y} L${pie.x} ${pie.y}`;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#FBF4EA, #EFE3D0)" }}>
      <Svg>
        <rect x={0} y={1040} width={1080} height={880} fill="#C9A27C" /><rect x={0} y={1040} width={1080} height={30} fill="#FFFFFF" />
        <rect x={520} y={200} width={60} height={840} fill="#FFFFFF" stroke="#D6C7B3" strokeWidth={4} /><rect x={300} y={200} width={220} height={840} fill="#8B6B4E" opacity={0.35} />
        <path d={cable} stroke="#1F2937" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Abrazadera x={top.x} y={420} rot={90} /><Abrazadera x={top.x} y={760} rot={90} />
        <Abrazadera x={730 + 200 * k} y={890 - 420 * k} rot={45 + 320 * k} o={1 - 0.4 * k} />
        <Abrazadera x={830} y={der.y} /><Abrazadera x={960} y={der.y} />
        {k > 0 && k < 1 && <g stroke="#F59E0B" strokeWidth={8}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M730 890 l${Math.cos(i * 1.3) * 90 * k} ${Math.sin(i * 1.3) * 90 * k}`} />)}</g>}
        <g opacity={tira}><text x={1040} y={700} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={58} fill="#14213A">¡TROPIEZAS!</text><path d="M960 1080 l110 -90" stroke={COL.rojo} strokeWidth={22} strokeLinecap="round" /></g>
        {k > 0.3 && <text x={540} y={1300} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={COL.rojo} opacity={k}>EL CABLE SE DESPEGA</text>}
      </Svg>
      <Grande t="GRAPA = POLEA" top={1520} k={f - 4} tam={76} fondo={COL.amarillo} />
    </AbsoluteFill>
  );
};
