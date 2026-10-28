// 3 · «En mi roco esto es un seis A.» (Nico, plano medio, chulo) → aquí, otro deporte (la cámara se aleja: un techo enorme y él diminuto).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Cielo } from "../Pegue/comun";
import { CrashPad } from "../../piezas/CrashPad";
import { Camara, Fondo, Nico, Partida, Svg, Zoom, clamp, dePie, type P } from "./comun";

export const Roco: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Dice d={d} />} significa={(d) => <Techo d={d} />} />;

const Dice: React.FC<{ d: number }> = ({ d }) => (
  <Camara d={d} empuje={0.05}>
    <Svg><Zoom s={2.1} cx={240} cy={1130} tx={540} ty={1000}>
      <Fondo h={0.4} id="roc" />
      <Nico x={240} y={dePie()} pose="senalando" cara="alivio" angulos={{ brazoA: [120, 130], cabeza: -8 }} />
    </Zoom></Svg>
  </Camara>
);

const SU = 1500;
const Techo: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 10], [1.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg><g transform={`translate(540 1300) scale(${s}) translate(-540 -1300)`}>
        <Cielo h={0.4} id="techo" sol={false} />
        <path d={`M-300 ${SU} L1400 ${SU} L1400 2400 L-300 2400 Z`} fill="#4D4A40" />
        {/* desplome gigante: entra por la derecha y se tumba por encima de la cabeza */}
        <path d={`M1400 ${SU} L980 ${SU} Q900 1100 700 700 Q520 420 160 330 Q40 300 -40 360 L-60 140 L1400 -100 Z`} fill="#6E6670" stroke="#141B26" strokeOpacity={0.3} strokeWidth={8} />
        <path d={`M-60 360 Q140 300 360 380 Q600 480 760 760 Q860 960 900 1300`} stroke="#957F78" strokeWidth={30} fill="none" opacity={0.6} />
        {[[90, 380], [330, 440], [560, 580], [730, 820], [850, 1080], [930, 1330]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={10} fill="#4B4150" /><path d={`M${x - 8} ${y - 6} q8 -6 16 0`} stroke="#F4F7FA" strokeWidth={4} opacity={0.8} /></g>)}
        <CrashPad x={620} y={SU - 26} w={240} grosor={26} />
        <Nico x={740} y={SU - 26 - 136 * 0.8} s={0.8} pose="pie" mira={-1} cara="miedo" angulos={{ cabeza: -40 }} />
      </g></Svg>
    </Camara>
  );
};
