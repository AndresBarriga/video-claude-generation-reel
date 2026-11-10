// Viaje 3 · tarde: tramo vertical sobre un valle enorme (pared de perfil a la derecha). Marta resbala: los mosquetones
// deslizan por el cable 2 m hasta el anclaje de abajo y los brazos se tensan → CONGELADO («¿QUÉ TE FRENA?»). 1 m = 150 px.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { MARTA, Etiqueta, Svg, clamp, golpe, anilla, type P } from "./comun";
import { Cielo, Cordillera, Bosque, Bruma, NubeE, CIELO } from "./paisaje";
import { Roca, CableE, MosqE, BrazoE, FundaE, Grapa, Anclaje, pieMosq, sPersona, M } from "./roca";

const PM = 150, SP = sPersona(PM), h = "tarde" as const;
const CX = 728, ANC = 1240, ARR = ANC - 2.5 * PM; // cable vertical; anclaje de abajo y de arriba
const CAIDA = 2 * PM; // los mosquetones estaban 2 m por encima del anclaje

export const Caida: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fI = pal("ahi") ?? Math.round(d * 0.8), fS = Math.max(6, fI - 16); // resbalón → tirón (≈0,55 s de caída libre)
  const g = interpolate(f, [fS, fI], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const dm = Math.min(1, g * 1.15) * CAIDA, dc = g * (CAIDA + 0.35 * PM); // mosquetones · cuerpo (sigue hasta tensar)
  const congela = f >= fI, sube = interpolate(f, [0, fS], [0, 12], clamp);
  const c1y = ANC - CAIDA + dm - 0.13 * PM - sube, c2y = c1y - 0.13 * PM;
  const ring: [number, number] = [CX - 0.22 * PM - g * 0.1 * PM, ANC - CAIDA + 0.32 * PM + dc - sube];
  const tor = f < fS ? -8 : -14, o = anilla(0, 0, SP, tor), hip: [number, number] = [ring[0] - o[0], ring[1] - o[1]];
  const cara = f < fS ? "esfuerzo" : "miedo";
  const sy = golpe(f, fI, 16);
  const z = interpolate(f, [0, fI, fI + 20], [1.05, 1.25, 1.32], { ...clamp, easing: Easing.out(Easing.cubic) });
  const foco: [number, number] = [CX - 120, interpolate(f, [0, fI], [ANC - 200, ANC + 40], clamp)];
  const cam = (k: number) => `translate(540 ${960 + sy}) scale(${1 + (z - 1) * k}) translate(${-(540 + (foco[0] - 540) * k)} ${-(960 + (foco[1] - 960) * k)})`;
  return (
    <>
      <Svg>
        <g transform={cam(0.12)}>
          <Cielo h={h} id="cai" sol={[260, 520]} r={50} />
          <NubeE x={300} y={300} s={1} h={h} o={0.8} />
          <Cordillera id="caA" y={1300} amp={800} color="#6A79A6" h={h} lejos={0.5} nieve={0.33} picos={3} x1={1200} />
          <Bruma y={1240} alto={260} color={CIELO[h].bruma} id="ca1" o={0.55} />
          <Cordillera id="caB" y={1560} amp={300} color="#3F6650" h={h} lejos={0.2} picos={4} x1={1200} />
          <Bosque id="caC" x0={-400} x1={1200} y={1580} t={24} color="#2A4E36" n={80} />
          <path d="M-400 1600 Q200 1580 600 1620 T1400 1600 L1400 3000 L-400 3000 Z" fill="#5E8A4E" />
        </g>
        <g transform={cam(1)}>
          <Roca id="caR" h={h} pm={PM} tono="#CDBFA9" d={`M${CX + 30} -400 L${CX + 50} 300 L${CX + 18} 700 L${CX + 22} 1700 L${CX - 10} 2300 L${CX + 60} 3200 L1800 3200 L1800 -400 Z`} />
          <CableE d={`M${CX} -400 L${CX} 3200`} pm={PM} />
          <Anclaje x={CX} y={ARR} pm={PM} /><Anclaje x={CX} y={ANC} pm={PM} /><Anclaje x={CX} y={ANC + 2.5 * PM} pm={PM} />
          {Array.from({ length: 16 }).map((_, i) => <Grapa key={i} x={CX + 4} y={ARR - 120 + i * 0.34 * PM} pm={PM * 0.8} />)}
          <BrazoE a={[ring[0], ring[1] + 4]} b={pieMosq(CX, c1y, PM)} pm={PM} tension={g} />
          <BrazoE a={[ring[0], ring[1] + 4]} b={pieMosq(CX, c2y, PM)} pm={PM} tension={g} />
          <MosqE x={CX} y={c1y} pm={PM} ang={-8} /><MosqE x={CX} y={c2y} pm={PM} ang={6} />
          {f >= fS && f < fI && <path d={`M${CX - 6} ${c1y - 40} L${CX - 6} ${c1y - 40 - 70 * g}`} stroke="#fff" strokeWidth={3} opacity={0.6} />}
          <Escalador x={hip[0]} y={hip[1]} quien="simon" s={SP} cara={cara} aspecto={MARTA} mochila
            angulos={f < fS ? { torso: -8, cabeza: -4, brazoA: [160, 172], brazoB: [120, 150], piernaA: [80, -10], piernaB: [40, -30] } : { torso: -14, cabeza: -18, brazoA: [150 - g * 20, 160], brazoB: [-150, -120], piernaA: [40 - g * 30, -20], piernaB: [-20, 10] }} />
          <FundaE x={ring[0] - 1} y={ring[1] + 2} pm={PM} />
          {(() => { const o = interpolate(f, [fS - 20, fS - 8, fI, fI + 10], [0, 1, 1, 0.6], clamp), y0 = ANC - CAIDA - 0.13 * PM; return o > 0 && <g opacity={o}>
            <circle cx={CX} cy={ANC} r={0.16 * PM} fill="none" stroke="#FFE7A8" strokeWidth={5} />
            <path d={`M${CX + 0.32 * PM} ${y0} L${CX + 0.32 * PM} ${ANC - 0.2 * PM}`} stroke="#fff" strokeWidth={6} strokeDasharray="14 10" />
            <path d={`M${CX + 0.32 * PM - 16} ${ANC - 0.3 * PM} l16 22 l16 -22`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>; })()}
          {congela && <circle cx={ring[0]} cy={ring[1] + M.fundaL * PM * 0.6} r={0.17 * PM} fill="none" stroke="#FFE7A8" strokeWidth={4} />}
        </g>
        {congela && <rect x={0} y={0} width={1080} height={1920} fill="#14233A" opacity={0.32} />}
      </Svg>
      {congela && <Etiqueta texto="¿QUÉ TE FRENA?" desde={fI} top={300} tam={104} />}
    </>
  );
};
