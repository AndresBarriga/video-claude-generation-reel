// Primer fotograma = acción: Honnold en mitad de un paso, sin cuerda, el contador ya subiendo. La pregunta entra a los 0,5 s.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Etiqueta, Granito, Pino, PH, Svg, type P } from "./comun";

export const Gancho: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const paso = (Math.sin(f / 9) + 1) / 2; // alterna de brazo
  const m = 12 + f * 0.6;
  return (
    <Camara d={d} empuje={0.06} foco="55% 50%">
      <Svg>
        <Cielo />
        {/* valle muy abajo: prado, río y pinos diminutos */}
        <rect x={-300} y={1500} width={1700} height={900} fill={PH.prado} />
        <path d="M-200 1640 Q300 1580 500 1700 T1200 1760" stroke="#A9C9DA" strokeWidth={16} fill="none" />
        {Array.from({ length: 22 }).map((_, i) => <Pino key={i} x={-40 + i * 40} y={1520 + (i % 3) * 30} s={0.35} />)}
        <rect x={-300} y={1380} width={1700} height={200} fill={PH.cieloB} opacity={0.5} />
        <Granito x0={700} />
        {/* fisura en la que mete la mano */}
        <path d="M712 300 Q700 700 706 1300" stroke={PH.veta} strokeWidth={10} fill="none" />
        <Escalador x={540} y={930} quien="joe" s={2.6} aspecto={ASPECTO_H} Cabeza={CabezaHonnold} cara="normal"
          angulos={{ torso: 12, cabeza: 4, brazoA: [100 + 14 * paso, 130 + 10 * paso], brazoB: [162 - 8 * paso, 176], piernaA: [70, 0], piernaB: [34, 14] }} />
      </Svg>
      <Contador m={m} />
      <Etiqueta texto={e.titulo} top={420} tam={90} desde={15} />
    </Camara>
  );
};
