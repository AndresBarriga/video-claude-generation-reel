// s6: el mosquetón de la cuerda apoyado en un canto. De frente: bajo la chapa la roca hace un escalón (canto); con la cinta corta el mosquetón
// queda cruzado sobre él. Cinta larga → cuelga libre por debajo y aguanta (✓). Vuelta a la corta: tirón de caída, hace palanca y PARTE.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Destello, Foco, Sello } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO, VERDE } from "./comun";
import { CintaF, ParedCerca, CuerdaM, abajoDe } from "./Macro";
import { Rot } from "./Bien";

const YC = 880; // altura del canto
const Escalon: React.FC = () => (
  <g>
    <path d={`M-900 ${YC} Q200 ${YC - 26} 560 ${YC - 6} T2000 ${YC + 10} L2000 3000 L-900 3000 Z`} fill="#000" opacity={0.42} />
    <path d={`M-900 ${YC + 46} Q200 ${YC + 20} 560 ${YC + 40} T2000 ${YC + 56} L2000 3000 L-900 3000 Z`} fill="#8F7F68" />
    <path d={`M-900 ${YC} Q200 ${YC - 26} 560 ${YC - 6} T2000 ${YC + 10}`} stroke="#FFF8E6" strokeWidth={12} fill="none" />
    <path d={`M-900 ${YC + 8} Q200 ${YC - 18} 560 ${YC + 2} T2000 ${YC + 18}`} stroke="#081120" strokeWidth={5} fill="none" opacity={0.6} />
  </g>
);
export const Canto: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fCa = pal("canto") ?? 57, fPon = pal("pon") ?? 71, fAhi = pal("ahí") ?? 115, fMe = (pal("mucho") ?? 140) - 2;
  const larga = f >= fPon && f < fAhi, e = spring({ frame: f - fPon, fps, config: { damping: 12, stiffness: 150 } }), L = larga ? 150 + 330 * e : 150;
  const tir = larga ? f - (fPon + 22) : f - fMe, jerk = tir >= 0 ? Math.sin(tir * 0.9) * 6 * Math.exp(-tir / 7) : 0, roto = !larga && f >= fMe;
  const cinta = { x: 540, y: 370, puerta: "izq" as const, largo: L, giro: jerk + Math.sin(f / 10) * 1.5, haloAbajo: larga && e > 0.8 ? VERDE : f >= fCa - 6 ? ROJO : undefined };
  const ab = abajoDe({ ...cinta, giro: 0 }), k = roto ? f - fMe : -1, pre = !larga && f > fMe - 14 && !roto ? suave((f - (fMe - 14)) / 14) : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${golpe(f, fMe, 20) + golpe(f, fPon + 22, 6)}px, ${roto ? Math.abs(golpe(f, fMe, 14)) : 0}px)` }}>
      <Svg><g transform={`translate(540 880) scale(${interpolate(f, [0, fPon, fPon + 10, fAhi, fAhi + 8], [1.25, 1.35, 1.0, 1.0, 1.35], clamp)}) translate(-540 ${-(larga ? 900 : 800)})`}>
        <ParedCerca seed="cn" /><Escalon />
        {!roto && <CuerdaM d={`M250 2300 Q330 ${ab.y + 500} ${ab.x - 6} ${ab.y + 46} Q${ab.x + 120} ${ab.y + 40} 880 2300`} />}
        {roto ? <g>
          <CintaF {...cinta} sinAbajo haloAbajo={undefined} />
          {[["M6 -92 Q62 -96 58 -30 L56 0 M6 -92 Q-34 -92 -48 -62", -1], ["M52 30 L50 62 Q44 98 4 94 Q-44 90 -46 56 L-45 10", 1]].map(([dd, sg], i) => <g key={i} transform={`translate(${ab.x + (sg as number) * k * 7} ${ab.y + (sg as number) * 10 + k * k * (sg === 1 ? 2.4 : 0.5) - (sg === -1 ? Math.min(k, 6) * 5 : 0)}) rotate(${(sg as number) * k * 9})`}><path d={dd as string} stroke="#081120" strokeWidth={34} fill="none" strokeLinecap="round" /><path d={dd as string} stroke="#C9D1D8" strokeWidth={22} fill="none" strokeLinecap="round" /></g>)}
          <CuerdaM d={`M250 2300 Q${330 + k * 4} ${ab.y + 600 + k * 30} ${ab.x + 40 + k * 10} ${ab.y + 140 + k * k * 2.6} Q${ab.x + 200} ${ab.y + 300 + k * k * 2.6} 880 2300`} />
          <Destello x={ab.x} y={YC} k={k} r={150} /><Destello x={ab.x + 20} y={YC + 20} k={k - 2} r={90} color="#FFE3A0" />
        </g> : <g transform={`rotate(${pre * 9} ${ab.x} ${YC})`}><CintaF {...cinta} /></g>}
        <Foco x={ab.x} y={YC} r={120} k={!larga && !roto ? interpolate(f, [fCa - 8, fCa], [0, 1], clamp) : 0} color="#FF8E7E" />
      </g></Svg>
      <Rot x={540} y={1250} texto="HACE PALANCA" color="#FF8E7E" k={!larga && !roto ? interpolate(f, [fCa, fCa + 6], [0, 1], clamp) : 0} tam={84} />
      <Rot x={540} y={470} texto="CINTA LARGA" color="#8FE0AE" k={larga ? e : 0} tam={90} />
      <Sello x={790} y={1150} ok k={larga ? suave((f - fPon - 22) / 8) : 0} />
      <Rot x={540} y={1250} texto="¡CRAC!" color="#FF8E7E" k={roto ? Math.min(1, k / 4) : 0} tam={150} />
    </AbsoluteFill>
  );
};
