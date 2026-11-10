// Viaje 2 · mediodía: cresta aérea con cable; los tres amigos avanzan en fila y detrás se abre una cordillera nevada.
// La cámara acompaña hacia la derecha (paralaje). 1 m = 110 px.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { DANI, MARTA, Svg, clamp, type P } from "./comun";
import { Cielo, Cordillera, Bosque, Bruma, NubeE, Aves, Rayos, CIELO } from "./paisaje";
import { Roca, CableE, MosqE, BrazoE, FundaE, Anclaje, pieMosq, sPersona } from "./roca";

const PM = 110, SP = sPersona(PM), h = "dia" as const;
const LUCIA = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", casco: "#3A7BD5", peinado: "coleta" as const, pelo: "#7A4A26", manos: "guante" as const };
// filo de la cresta (sube hacia la derecha) y cable 1 m por encima
const filo = (x: number) => 1360 - x * 0.42 + Math.sin(x / 70) * 14;
const cableY = (x: number) => filo(x) - 1.05 * PM;

const Persona: React.FC<{ x: number; asp: object; quien: "joe" | "simon"; cara: "alivio" | "normal" | "esfuerzo"; f: number; fase: number }> = ({ x, asp, quien, cara, f, fase }) => {
  const paso = Math.sin(f / 9 + fase), hip: [number, number] = [x, filo(x) - 0.78 * PM];
  const m1 = x + 0.35 * PM, m2 = x + 0.6 * PM, ring: [number, number] = [x + 6, hip[1] - 6];
  return (
    <g>
      <BrazoE a={ring} b={pieMosq(m1, cableY(m1), PM)} pm={PM} /><BrazoE a={ring} b={pieMosq(m2, cableY(m2), PM)} pm={PM} />
      <MosqE x={m1} y={cableY(m1)} pm={PM} /><MosqE x={m2} y={cableY(m2)} pm={PM} />
      <Escalador x={hip[0]} y={hip[1]} quien={quien} s={SP} cara={cara} aspecto={asp} mochila
        angulos={{ torso: 14, cabeza: -10, brazoA: [118, 126], brazoB: [100, 110], piernaA: [30 + paso * 18, -20 - paso * 10], piernaB: [-10 - paso * 18, -6] }} />
      <FundaE x={ring[0]} y={ring[1]} pm={PM} />
    </g>
  );
};

export const Cresta: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const avance = t * 0.35 * PM;
  const cam = (k: number) => `translate(${-t * 160 * k} ${t * 60 * k})`;
  return (
    <Svg>
      <g transform={cam(0.15)}>
        <Cielo h={h} id="cre" sol={[160, 300]} r={46} />
        <Rayos x={160} y={300} h={h} f={f} id="crr" o={0.16} />
        <Aves f={f} x={500} y={620} seed="ca" n={5} s={1.1} v={-1.6} />
        <NubeE x={620} y={330} s={1.1} h={h} o={0.9} /><NubeE x={150} y={520} s={0.7} h={h} o={0.8} />
        <Cordillera id="crA" y={1180} amp={720} color="#6E7FAE" h={h} lejos={0.5} nieve={0.35} picos={3} x1={1900} />
      </g>
      <g transform={cam(0.35)}>
        <Cordillera id="crB" y={1380} amp={420} color="#4A6680" h={h} lejos={0.28} nieve={0.2} picos={4} x1={1900} />
        <Bruma y={1300} alto={220} color={CIELO[h].bruma} id="cr1" o={0.5} />
      </g>
      <g transform={cam(0.6)}>
        <Cordillera id="crC" y={1620} amp={260} color="#3D6A4A" h={h} lejos={0.12} picos={5} x1={1900} />
        <Bosque id="crD" x0={-300} x1={1900} y={1640} t={30} color="#2B5038" n={110} />
        <path d="M-400 1660 Q400 1630 900 1680 T1900 1660 L1900 3000 L-400 3000 Z" fill="#5E8A4E" />
      </g>
      <g transform={cam(1)}>
        <Roca id="crR" h={h} pm={PM} d={`M-300 2200 L-300 ${filo(-300)} ${Array.from({ length: 30 }, (_, i) => { const x = -300 + i * 70; return `L${x} ${filo(x) + (i % 3 === 1 ? -14 : 6)}`; }).join(" ")} L1800 ${filo(1800)} L1800 2200 Z`} />
        <CableE d={`M-300 ${cableY(-300)} ${Array.from({ length: 25 }, (_, i) => { const x = -300 + i * 90; return `L${x} ${cableY(x)}`; }).join(" ")}`} pm={PM} />
        {[-100, 230, 560, 890, 1220].map((x) => <Anclaje key={x} x={x} y={cableY(x)} pm={PM} />)}
        <Persona x={240 + avance} asp={LUCIA} quien="joe" cara="normal" f={f} fase={2} />
        <Persona x={500 + avance} asp={DANI} quien="joe" cara="alivio" f={f} fase={1} />
        <Persona x={760 + avance} asp={MARTA} quien="simon" cara="alivio" f={f} fase={0} />
      </g>
    </Svg>
  );
};
