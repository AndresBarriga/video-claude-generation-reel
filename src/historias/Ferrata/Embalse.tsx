// Viaje 1 · amanecer: pared de caliza sobre un embalse turquesa con un pueblo blanco (estilo Andalucía).
// Marta, en las grapas, se asoma y señala el paisaje; Dani, más abajo, mira hacia arriba y sonríe. 1 m = 170 px.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { DANI, MARTA, Svg, clamp, type P } from "./comun";
import { Cielo, Cordillera, Bruma, NubeE, Aves, Rayos, CIELO, mix } from "./paisaje";
import { Roca, CableE, MosqE, BrazoE, FundaE, Grapa, Anclaje, pieMosq, sPersona } from "./roca";

const PM = 170, SP = sPersona(PM), h = "alba" as const;
const CX = 250; // cable vertical junto a la cara de la pared

const Valle: React.FC<{ f: number }> = ({ f }) => {
  const c = CIELO[h];
  return (
    <g>
      <Cielo h={h} id="emb" sol={[880, 420]} r={52} />
      <Rayos x={880} y={420} h={h} f={f} id="emr" o={0.2} />
      <Aves f={f} x={420} y={560} seed="eb" n={6} s={0.8} v={1.2} />
      <NubeE x={260} y={300} s={0.9} h={h} o={0.7} /><NubeE x={760} y={230} s={0.6} h={h} o={0.6} />
      <Cordillera id="emA" y={760} amp={260} color="#7C86A8" h={h} lejos={0.7} picos={5} solIzq={false} />
      <Cordillera id="emB" y={880} amp={210} color="#6B7F78" h={h} lejos={0.45} picos={4} solIzq={false} />
      <Bruma y={760} alto={200} color={c.bruma} id="emb1" o={0.6} />
      <path d="M-200 900 Q300 860 700 905 T1400 890 L1400 2400 L-200 2400 Z" fill={mix("#7E9A5C", c.bruma, 0.25)} />
      {/* embalse visto desde arriba: se estrecha hacia el horizonte */}
      <path d="M380 930 C520 925 640 945 760 940 C900 935 1000 950 1400 950 L1400 1700 C1200 1640 1050 1520 900 1420 C760 1330 620 1220 520 1120 C450 1050 400 990 380 930 Z" fill="#3FB7C1" />
      <path d="M520 1120 C620 1220 760 1330 900 1420 C1050 1520 1200 1640 1400 1700" stroke="#2C8E98" strokeWidth={14} fill="none" opacity={0.6} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${640 + i * 70} ${1000 + i * 70} l${40 + i * 6} ${8}`} stroke="#BFF1F2" strokeWidth={3} opacity={0.55} />)}
      {/* pueblo blanco en la ladera de la derecha */}
      {Array.from({ length: 34 }).map((_, i) => { const x = 430 + random(`px${i}`) * 220, y = 990 + random(`py${i}`) * 90; return (
        <g key={i}><rect x={x} y={y} width={13} height={9} fill="#F6F1E7" /><path d={`M${x - 1} ${y} L${x + 6.5} ${y - 4} L${x + 14} ${y} Z`} fill="#C66A44" /></g>); })}
      {/* olivos en bancales */}
      {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={random(`ox${i}`) * 1400 - 200} cy={1250 + random(`oy${i}`) * 500} r={6 + random(`or${i}`) * 5} fill={mix("#4E6E3A", c.bruma, 0.1)} />)}
      <Bruma y={1180} alto={160} color={c.bruma} id="emb2" o={0.35} />
    </g>
  );
};

export const Embalse: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const brazo = interpolate(f, [8, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const mH: [number, number] = [CX + 60, 760], dH: [number, number] = [CX + 40, 1330];
  const cam = (z: number, k: number) => `translate(${-t * 30 * k} ${-t * 90 * k}) scale(${z})`;
  return (
    <Svg>
      <g transform={cam(1 + t * 0.03, 0.3)}><Valle f={f} /></g>
      <g transform={cam(1.02 + t * 0.06, 1)}>
        <Roca id="embR" h={h} pm={PM} luzIzq={false} tono="#D3C6B2" d="M-300 -200 L330 -200 L360 300 L330 700 L380 1100 L350 1500 L400 2000 L-300 2000 Z" />
        <CableE d={`M${CX} -200 L${CX} 2000`} pm={PM} />
        <Anclaje x={CX} y={480} pm={PM} /><Anclaje x={CX} y={1240} pm={PM} />
        {Array.from({ length: 22 }).map((_, i) => <Grapa key={i} x={CX + 30} y={200 + i * 0.36 * PM} pm={PM} />)}
        {/* Marta: un mosquetón en el cable, se asoma con el brazo estirado */}
        <BrazoE a={[mH[0] - 8, mH[1] - 30]} b={pieMosq(CX + 4, 560, PM)} pm={PM} />
        <BrazoE a={[mH[0] - 8, mH[1] - 30]} b={pieMosq(CX + 4, 610, PM)} pm={PM} />
        <MosqE x={CX + 4} y={560} pm={PM} /><MosqE x={CX + 4} y={610} pm={PM} />
        <Escalador x={mH[0]} y={mH[1]} quien="simon" s={SP} cara="alivio" aspecto={MARTA} mochila
          angulos={{ torso: -12, cabeza: -6, brazoA: [interpolate(brazo, [0, 1], [60, 100]), interpolate(brazo, [0, 1], [70, 96])], brazoB: [-150, -170], piernaA: [-20, -8], piernaB: [-36, -10] }} />
        <FundaE x={mH[0] - 6} y={mH[1] - 34} pm={PM} />
        {/* Dani: más abajo, mira hacia arriba y sonríe */}
        <BrazoE a={[dH[0] - 6, dH[1] - 30]} b={pieMosq(CX + 4, 1130, PM)} pm={PM} />
        <BrazoE a={[dH[0] - 6, dH[1] - 30]} b={pieMosq(CX + 4, 1180, PM)} pm={PM} />
        <MosqE x={CX + 4} y={1130} pm={PM} /><MosqE x={CX + 4} y={1180} pm={PM} />
        <Escalador x={dH[0]} y={dH[1]} quien="joe" s={SP} cara="alivio" aspecto={DANI} mochila mira={1}
          angulos={{ torso: -6, cabeza: -34, brazoA: [170, 175], brazoB: [140, 170], piernaA: [40, -20], piernaB: [-10, -6] }} />
        <FundaE x={dH[0] - 4} y={dH[1] - 34} pm={PM} />
      </g>
    </Svg>
  );
};
