// 5 · Antes de subir: escaladora y asegurador chocan el puño al pie de la vía y pactan la palabra.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASEG, Bocadillo, Camara, Cielo, Cuerda, Etiqueta, Montanas, Pared, Svg, TU, borde, sube, type P } from "./comun";

const SUELO = 1330, X0 = 860, s = 2.5, Y = SUELO - 136 * s;
export const Palabra: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const choque = sube(f, 6, 14) - 0.25 * sube(f, 16, 22);
  const brazo: [number, number] = [20 + 68 * choque, 30 + 62 * choque];
  const tP = (pal("pierna") ?? pal("grite") ?? Math.round(d * 0.6)) - 8;
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <Cielo id="pl" />
        <Montanas y={1060} />
        <Pared x0={X0} semilla="pl" />
        <path d={`M-300 ${SUELO} Q300 ${SUELO - 20} ${borde(SUELO, X0) + 40} ${SUELO + 4} L1500 ${SUELO + 10} L1500 2400 L-300 2400 Z`} fill="#5C6B4E" />
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={40 + random(`q${i}`) * 900} cy={SUELO + 60 + random(`r${i}`) * 300} rx={30 + random(`t${i}`) * 40} ry={12} fill="#4A5940" />)}
        <Cuerda d={`M${borde(-200, X0) + 8} -200 L${borde(900, X0) + 6} 900 Q${700} ${SUELO - 40} ${600} ${SUELO + 6} q-120 10 -60 -14 q60 -14 120 4`} w={9} />
        <Escalador x={330} y={Y} quien="joe" aspecto={ASEG} s={s} pose="pie" cara={f > tP ? "miedo" : "alivio"} sombra={SUELO + 4} angulos={{ brazoA: brazo, cabeza: -6 }} />
        <Escalador x={720} y={Y} quien="joe" aspecto={TU} s={s} pose="pie" cara="alivio" mira={-1} sombra={SUELO + 4} angulos={{ brazoA: brazo, cabeza: -6 }} />
      </Svg>
      <Etiqueta texto="PACTAD UNA PALABRA" top={230} tam={100} desde={4} />
      {f > tP && <Bocadillo texto="¡PIERNA!" x={330} y={Y - 220 * s / 2.5 - 90} ancho={400} desde={tP} tam={90} />}
    </Camara>
  );
};
