// Rehook tras el disipador: arriba, en una repisa con luz dorada, Marta levanta el disipador ya abierto (cinta de ~0,8 m
// colgando, funda vacía). Dani lo mira. «SE CAMBIA». Escala 1 m = 330 px.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { DANI, MARTA, Etiqueta, Svg, clamp, manoA, type P } from "./comun";
import { Cielo, Cordillera, Bruma, NubeE, CIELO } from "./paisaje";
import { Roca, sPersona, M } from "./roca";

const PM = 330, SP = sPersona(PM), h = "tarde" as const;
const CW = M.cinta * PM, FA = M.fundaA * PM, FL = M.fundaL * PM;

/** Disipador abierto colgando de una mano: brazos naranjas recogidos, cinta blanca rota, funda abierta abajo. */
const Abierto: React.FC<{ x: number; y: number; balanceo: number }> = ({ x, y, balanceo }) => {
  const largo = 0.8 * PM, bx = x + balanceo;
  return (
    <g>
      <path d={`M${x} ${y} q-18 40 -6 ${0.18 * PM}`} stroke="#FF6A1F" strokeWidth={0.028 * PM} fill="none" strokeLinecap="round" />
      <path d={`M${x + 6} ${y} q22 36 4 ${0.18 * PM}`} stroke="#E25A14" strokeWidth={0.028 * PM} fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y + 0.18 * PM} L${bx} ${y + 0.18 * PM + largo}`} stroke="#BFC4BD" strokeWidth={CW + 4} />
      <path d={`M${x} ${y + 0.18 * PM} L${bx} ${y + 0.18 * PM + largo}`} stroke="#F4F5F2" strokeWidth={CW} />
      {Array.from({ length: 18 }).map((_, i) => { const t = (i + 0.5) / 18, px = x + (bx - x) * t, py = y + 0.18 * PM + largo * t; return (
        <g key={i}><path d={`M${px - CW / 2 + 3} ${py} L${px + CW / 2 - 3} ${py}`} stroke="#1E232B" strokeWidth={i % 4 === 2 ? 5 : 2.5} />
          <path d={`M${px + CW / 2} ${py + 4} l${4 + random(`ca${i}`) * 6} 3 M${px - CW / 2} ${py + 4} l${-4 - random(`cb${i}`) * 6} 3`} stroke="#F4F5F2" strokeWidth={1.6} /></g>); })}
      <g transform={`translate(${bx} ${y + 0.18 * PM + largo})`}>
        <path d={`M${-FA / 2} 8 L${-FA / 4} 0 L0 9 L${FA / 4} -1 L${FA / 2} 7 L${FA / 2 - 3} ${FL} Q0 ${FL + 10} ${-FA / 2 + 3} ${FL} Z`} fill="#262B33" stroke="#11151B" strokeWidth={3} />
        <rect x={-12} y={FL + 2} width={24} height={30} rx={10} fill="none" stroke="#C9CDC7" strokeWidth={7} />
      </g>
    </g>
  );
};

export const Cambia: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const sube = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const fC = pal("cambia") ?? Math.round(d * 0.7);
  const torso = -6, brazo: [number, number] = [interpolate(sube, [0, 1], [60, 150]), interpolate(sube, [0, 1], [70, 168])];
  const mH: [number, number] = [430, 1330], mano = manoA(mH[0], mH[1], SP, torso, brazo);
  const z = interpolate(f, [0, d], [1, 1.06], clamp);
  return (
    <>
      <Svg>
        <Cielo h={h} id="cam" sol={[900, 760]} r={70} />
        <NubeE x={250} y={380} s={1} h={h} o={0.8} />
        <Cordillera id="cmA" y={1260} amp={560} color="#6A79A6" h={h} lejos={0.5} nieve={0.3} picos={3} />
        <Bruma y={1150} alto={300} color={CIELO[h].bruma} id="cm1" o={0.6} />
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <Roca id="cmR" h={h} pm={PM} luzIzq={false} tono="#CDBFA9" d="M-300 1480 L120 1450 L400 1470 L700 1440 L1000 1465 L1400 1450 L1400 2400 L-300 2400 Z" />
          <Escalador x={820} y={1210} quien="joe" s={SP} cara={f > fC ? "alivio" : "serio"} aspecto={DANI} mira={-1} pose="pie" angulos={{ cabeza: 14 }} />
          <Escalador x={mH[0]} y={mH[1]} quien="simon" s={SP} cara={f > fC ? "alivio" : "serio"} aspecto={MARTA} pose="sentadoSuelo" angulos={{ torso, cabeza: -16, brazoA: brazo }} />
          <Abierto x={mano[0]} y={mano[1]} balanceo={Math.sin(f / 10) * 10} />
        </g>
      </Svg>
      {f >= fC && <Etiqueta texto="SE CAMBIA" desde={fC} top={300} tam={110} />}
    </>
  );
};
