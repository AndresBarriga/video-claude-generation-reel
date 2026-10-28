// Pantalla partida: arriba El Capitán con una Torre Eiffel al lado (escala real), Honnold diminuto; abajo, tú en el prado con prismáticos, sudando.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Eiffel, Granito, Pino, PH, Svg, type P } from "./comun";

const TU = { chaqueta: "#2F7F8A", chaquetaSombra: "#215C64", pantalon: "#39424F", casco: null, peinado: "rizado" as const, pelo: "#2B1D14", arnes: false, manos: "piel" as const };
const BASE = 860, CIMA = 230; // El Capitán en la mitad de arriba: 884 m = 630 px
const px = (m: number) => BASE - (m / 884) * (BASE - CIMA);

export const Prado: React.FC<P> = ({ d, e }) => {
  const f = useCurrentFrame();
  const m = interpolate(f, [0, d], [300, 360], { extrapolateRight: "clamp" });
  const sudor = (f % 24) / 24;
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <Cielo />
        {/* mitad de arriba: la pared entera */}
        <path d={`M420 ${BASE} Q470 ${CIMA + 40} 560 ${CIMA} Q760 ${CIMA - 20} 1100 ${CIMA + 60} L1100 ${BASE} Z`} fill={PH.granito} />
        <path d={`M560 ${CIMA} Q560 500 600 ${BASE}`} stroke={PH.veta} strokeWidth={4} fill="none" opacity={0.5} />
        <Eiffel x={250} y={BASE} h={BASE - px(330)} />
        <path d={`M120 ${px(330)} L560 ${px(330)}`} stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />
        <rect x={-300} y={BASE} width={1700} height={80} fill={PH.pino} />
        {Array.from({ length: 30 }).map((_, i) => <Pino key={i} x={-20 + i * 38} y={BASE + 20} s={0.5} />)}
        {/* Honnold, un punto rojo en la pared */}
        <g transform={`translate(${520 + (m - 300) * 0.05} ${px(m)})`}><circle r={7} fill={ASPECTO_H.chaqueta} stroke="#fff" strokeWidth={2} /></g>
        {/* mitad de abajo: tú en el prado */}
        <rect x={-300} y={940} width={1700} height={1200} fill={PH.prado} />
        <rect x={0} y={936} width={1080} height={8} fill="#fff" />
        {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={(i * 97) % 1080} cy={1500 + (i % 4) * 60} rx={40} ry={8} fill={PH.pradoS} />)}
        <Escalador x={520} y={1330} quien="joe" s={2.4} aspecto={TU} cara="miedo" sombra={1470}
          angulos={{ torso: -16, cabeza: -30, brazoA: [125, 205], brazoB: [118, 200] }} />
        {/* prismáticos delante de los ojos */}
        <g transform="translate(600 1000) rotate(-34)"><rect x={-10} y={-34} width={64} height={30} rx={12} fill="#1B2230" /><rect x={-10} y={4} width={64} height={30} rx={12} fill="#1B2230" /><circle cx={56} cy={-19} r={10} fill="#7FB3D9" /><circle cx={56} cy={19} r={10} fill="#7FB3D9" /></g>
        {/* gota de sudor */}
        <path d={`M500 ${980 + sudor * 60} q-10 18 0 26 q10 -8 0 -26 Z`} fill="#BFE3F7" opacity={1 - sudor} />
      </Svg>
      <Contador m={m} nota={e.titulo} />
    </Camara>
  );
};
