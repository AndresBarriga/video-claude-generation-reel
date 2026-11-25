// E82 · estudio (Fuss y Niegl 2008, Copa del Mundo 2002): presa con sensores en un panel de competición → gráfico fuerza × tiempo
// con DOS BARRAS sin cifras: novato alta y larga, experto baja y corta. Rótulo de seguridad: «no sueltes hasta tener la siguiente».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip } from "../../piezas/kit";
import { Svg, COL, F, pop, cl, sale, type P } from "./comun";

const T = COL.tinta;
const Panel: React.FC<{ f: number; z: number }> = ({ f, z }) => (
  <Svg>
    <g transform={`translate(540 1060) scale(${z}) translate(-540 -1060)`}>
      <rect x={-300} y={500} width={1700} height={1300} fill="#DDE8F3" />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-300 + i * 300} 500 V1800 M-300 ${560 + i * 260} H1400`} stroke="#C2D2E2" strokeWidth={6} />)}
      {[[150, 760, COL.lila], [880, 700, COL.menta], [260, 1380, COL.azul], [900, 1420, COL.rosa]].map(([x, y, c], i) => <ellipse key={i} cx={x as number} cy={y as number} rx={46} ry={30} fill={c as string} stroke={T} strokeWidth={6} />)}
      <path d="M440 1000 Q540 930 640 1000 Q660 1060 600 1080 H480 Q420 1060 440 1000 Z" fill={COL.amarillo} stroke={T} strokeWidth={9} />
      <rect x={470} y={1090} width={140} height={70} rx={12} fill="#3A4A63" stroke={T} strokeWidth={7} />
      {[0, 1, 2].map((i) => <circle key={i} cx={505 + i * 35} cy={1125} r={9} fill={(Math.floor(f / 5) + i) % 3 ? "#5CE38E" : "#1E3A2A"} />)}
      <path d={`M610 1130 C760 1130 760 1300 980 1320`} stroke={T} strokeWidth={10} fill="none" />
      {[0, 1, 2].map((i) => { const a = ((f * 0.03 + i / 3) % 1); return <circle key={i} cx={610 + 370 * a} cy={1130 + 190 * a * a} r={10} fill={COL.amarillo} stroke={T} strokeWidth={4} />; })}
    </g>
  </Svg>
);
/** Gráfico fuerza (alto) × tiempo (ancho), sin cifras. k = fotogramas desde que entra cada barra. */
const Grafico: React.FC<{ kN: number; kE: number; kS: number }> = ({ kN, kE, kS }) => {
  const X0 = 190, Y0 = 1350, n = sale(kN / 14), e = sale(kE / 14);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <rect x={90} y={700} width={900} height={730} rx={40} fill={COL.crema} stroke={T} strokeWidth={9} />
      <path d={`M${X0} 780 V${Y0} H930`} stroke={T} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={`M${X0 - 16} 800 l16 -24 l16 24 M910 ${Y0 - 16} l24 16 l-24 16`} stroke={T} strokeWidth={8} fill="none" />
      <text x={X0 + 20} y={800} fontFamily={F} fontWeight={900} fontSize={40} fill={T}>FUERZA</text>
      <text x={920} y={Y0 + 52} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={40} fill={T}>TIEMPO</text>
      <rect x={X0 + 6} y={Y0 - 480 * n} width={640 * n} height={480 * n} rx={18} fill={COL.rojo} opacity={0.85} stroke={T} strokeWidth={6} />
      {kN > 8 && <text x={X0 + 30} y={Y0 - 430} fontFamily={F} fontWeight={900} fontSize={50} fill="#fff" opacity={sale((kN - 8) / 8)}>NOVATO</text>}
      <rect x={X0 + 6} y={Y0 - 230 * e} width={300 * e} height={230 * e} rx={18} fill={COL.verde} stroke={T} strokeWidth={6} />
      {kE > 8 && <text x={X0 + 30} y={Y0 - 175} fontFamily={F} fontWeight={900} fontSize={46} fill="#fff" opacity={sale((kE - 8) / 8)}>EXPERTO</text>}
      {kS > 0 && <g opacity={sale(kS / 8)}><path d={`M${X0 + 320} ${Y0 - 120} h120`} stroke={T} strokeWidth={10} strokeLinecap="round" /><path d={`M${X0 + 420} ${Y0 - 140} l26 20 l-26 20`} stroke={T} strokeWidth={10} fill="none" strokeLinecap="round" /><text x={X0 + 470} y={Y0 - 105} fontFamily={F} fontWeight={900} fontSize={38} fill={T}>SIGUIENTE</text></g>}
    </svg>
  );
};

export const Estudio: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fC = pal("cuanto") ?? Math.round(d * 0.45), fM = pal("menos") ?? fC + 30, fS = pal("siguiente") ?? d - 30;
  const g = interpolate(f, [fC - 6, fC + 4], [0, 1], cl);
  return (
    <>
      <Panel f={f} z={interpolate(f, [0, fC], [1, 1.25], cl)} />
      {f < fC && <Chip texto="PRESA CON SENSORES DE FUERZA" top={1460} k={(f - 8) / 8} tam={40} />}
      {g > 0 && <div style={{ position: "absolute", inset: 0, opacity: g, transform: `translateY(${(1 - g) * 60}px)` }}><Grafico kN={f - fC} kE={f - fM + 4} kS={f - fS + 6} /></div>}
      {f > fM && <Chip texto="Ojo: no sueltes hasta tener la siguiente" top={1460} k={(f - fM - 10) / 8} tam={40} color="rgba(200,45,45,.92)" />}
    </>
  );
};
