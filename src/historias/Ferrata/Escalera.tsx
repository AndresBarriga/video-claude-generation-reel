// Escena 1 (gancho): escalera colgada en el cielo. Dani a mitad, Marta en lo alto del pilar. La cámara baja y enseña el vacío.
// Al decir «resbalas», a Dani se le va un pie y la cámara empuja hacia la bolsa del disipador (bucle abierto).
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { FE, DANI, MARTA, Cielo, Montes, Nube, Cable, Mosqueton, Elastico, anilla, Etiqueta, Svg, clamp, type P } from "./comun";

const A: [number, number] = [-60, 1400], B: [number, number] = [800, 520]; // largueros: de abajo-izq. al pilar
const k = (B[1] - A[1]) / (B[0] - A[0]);
const riel = (x: number) => A[1] + (x - A[0]) * k;
const PASA = 150; // pasamanos: cable por encima de la escalera

const Pilar: React.FC = () => (
  <g>
    <path d="M790 505 L835 468 L905 452 L985 470 L1060 438 L1220 456 L1220 2900 L760 2900 L735 2100 L772 1500 L742 980 Z" fill={FE.caliza} />
    <path d="M790 505 L742 980 L772 1500 L735 2100 L760 2900 L850 2900 L830 2100 L860 1500 L820 980 L842 520 Z" fill={FE.calizaS} />
    {Array.from({ length: 16 }).map((_, i) => { const x = 820 + random(`gx${i}`) * 360, y = 560 + random(`gy${i}`) * 2200; return <path key={i} d={`M${x} ${y} q${-14 + random(`gq${i}`) * 28} ${90} ${4} ${150 + random(`gl${i}`) * 160}`} stroke={FE.calizaSS} strokeWidth={5} fill="none" opacity={0.55} />; })}
    {[[900, 452], [1000, 466], [1120, 448]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 4} rx={40} ry={12} fill={FE.medio} />)}
    <path d="M790 505 L835 468 L905 452 L985 470 L1060 438 L1220 456" stroke="#E6E1D8" strokeWidth={6} fill="none" opacity={0.8} />
  </g>
);

const Escalera: React.FC<{ v: number }> = ({ v }) => {
  const rielD = `M${A[0]} ${A[1]} L${B[0]} ${B[1]}`, bajo = `M${A[0]} ${A[1] + 38} L${B[0]} ${B[1] + 38}`;
  const pasa = `M${A[0]} ${A[1] - PASA} L${B[0] + 10} ${B[1] - PASA}`;
  const peldanos = Array.from({ length: 22 }, (_, i) => A[0] + 30 + i * 40);
  return (
    <g transform={`rotate(${v} ${B[0]} ${B[1]})`}>
      <Cable d={pasa} w={7} />
      {peldanos.map((x) => <path key={x} d={`M${x} ${riel(x)} L${x + 8} ${riel(x) + 38}`} stroke={FE.aceroS} strokeWidth={9} strokeLinecap="round" />)}
      <Cable d={bajo} w={8} /><Cable d={rielD} w={10} />
      {peldanos.map((x) => <path key={`l${x}`} d={`M${x} ${riel(x)} L${x + 8} ${riel(x) + 38}`} stroke={FE.aceroL} strokeWidth={3} strokeLinecap="round" />)}
      {[[B[0] + 10, B[1] - PASA], [B[0], B[1]]].map(([x, y], i) => <g key={i}><rect x={x - 6} y={y - 14} width={34} height={28} rx={6} fill={FE.aceroS} /><circle cx={x + 11} cy={y} r={6} fill={FE.aceroL} /></g>)}
    </g>
  );
};

export const EscaleraCielo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fR = pal("resbalas") ?? Math.round(d * 0.62);
  const pan = 0;
  const emp = interpolate(f, [fR, fR + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const resb = interpolate(f, [fR - 2, fR + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const v = Math.sin(f / 22) * 0.25 + resb * Math.sin((f - fR) / 3) * 0.4 * Math.max(0, 1 - (f - fR) / 30);
  const hx = 360, hy = 856 + resb * 26; // cadera de Dani
  const giro = 35 + resb * 8, ring = anilla(hx, hy, 1.25, giro);
  const m1: [number, number] = [470, riel(470) - PASA], m2: [number, number] = [545, riel(545) - PASA];
  const bolsa: [number, number] = [ring[0] + 6, ring[1] - 10];
  // de cerca (cara de Dani y el vacío debajo) → se abre hasta ver la escalera entera → empuje a la bolsa al «resbalas»
  const abre = interpolate(f, [0, Math.max(20, fR - 12)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(abre, [0, 1], [2.2, 1]) + emp * 1.2;
  const cx = interpolate(emp, [0, 1], [hx + 40, bolsa[0]]), cy = interpolate(emp, [0, 1], [hy - 110, bolsa[1]]);
  const tx = interpolate(abre, [0, 1], [540, cx]) , ty = interpolate(abre, [0, 1], [900, cy + 170]) - emp * 170;
  const capa = (par: number) => `translate(0 ${-pan * par})`;
  return (
    <>
      <Svg>
        <g transform={`translate(${tx} ${ty}) scale(${z}) translate(${-cx} ${-cy})`}>
          <Cielo id="esc" />
          <g transform={capa(0.15)}>{[[160, 260, 1], [760, 160, 0.8], [520, 420, 0.6]].map(([x, y, s], i) => <Nube key={i} x={x + f * (0.4 + i * 0.2)} y={y} s={s} o={0.9} />)}</g>
          <g transform={capa(0.3)}><Montes y={1500} seed="esca" /></g>
          <g transform={capa(0.45)}>
            <Montes y={1820} seed="escm" color={FE.medio} nieve={false} amp={180} />
            <path d="M-300 1930 Q300 1880 700 1940 T1400 1920 L1400 2700 L-300 2700 Z" fill={FE.valle} />
            <path d="M120 2010 Q420 1975 640 2030 Q560 2080 260 2070 Z" fill={FE.agua} />
            {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={640 + random(`cx${i}`) * 260} y={1990 + random(`cy${i}`) * 70} width={10} height={8} fill={i % 3 ? "#F4EFE6" : "#C8573C"} />)}
          </g>
          <g transform={capa(0.75)}><Nube x={300 - f * 0.9} y={1700} s={1.6} o={0.85} /><Nube x={900 - f * 0.6} y={1820} s={1.2} o={0.75} /></g>
          <g transform={capa(1)}>
            <Pilar />
            <Escalador x={905} y={378} quien="simon" pose="senalando" mira={-1} s={0.95} cara={emp > 0.3 ? "miedo" : "alivio"} aspecto={MARTA} />
            <Escalera v={v} />
            <g transform={`rotate(${v} ${B[0]} ${B[1]})`}>
              <Elastico a={bolsa} b={[m1[0], m1[1] + 104]} w={12} tension={resb} />
              <Elastico a={bolsa} b={[m2[0], m2[1] + 104]} w={12} tension={resb} />
              <Mosqueton x={m1[0]} y={m1[1]} s={0.85} ang={8} /><Mosqueton x={m2[0]} y={m2[1]} s={0.85} ang={8} />
              <Escalador x={hx} y={hy} quien="joe" mochila s={1.25} cara="miedo" aspecto={DANI} angulos={{ torso: giro, cabeza: 40 - resb * 20, brazoA: [140, 150], brazoB: [120, 140], piernaA: [80, -30], piernaB: [-10 - resb * 60, -20 - resb * 40] }} />
              <rect x={bolsa[0] - 14} y={bolsa[1] - 6} width={28} height={40} rx={9} fill={FE.funda} stroke={emp > 0 ? "#FFE7A8" : FE.fundaS} strokeWidth={2 + emp * 3} />
            </g>
          </g>
        </g>
      </Svg>
      <Etiqueta texto={f < fR ? "¿TE ATREVES?" : "¿Y SI RESBALAS?"} desde={f < fR ? 15 : fR} top={300} tam={104} />
    </>
  );
};
