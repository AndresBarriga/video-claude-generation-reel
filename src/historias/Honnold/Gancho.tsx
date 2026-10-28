// Primer fotograma = acción: Honnold en mitad de un paso, sin cuerda, el contador ya subiendo. La pregunta entra a los 0,5 s.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Camara, Cielo, Contador, Etiqueta, Granito, Pino, PH, Svg, type P } from "./comun";

export const PlanoGancho: React.FC<{ d: number; titulo?: string; desde?: number; hasta?: number }> = ({ d, titulo, desde, hasta }) => {
  const f = useCurrentFrame();
  const paso = (Math.sin(f / 9) + 1) / 2; // alterna de brazo
  const m = interpolate(f, [0, d], [desde ?? 3, hasta ?? 9]);
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
        <path d="M730 260 L748 380 L736 470 L760 600 L744 720 L770 860 L752 980 L776 1120 L760 1300 L790 1300 L806 1120 L782 980 L800 860 L774 720 L790 600 L766 470 L778 380 L760 260 Z" fill="#3E3A35" />
        <path d="M760 260 L778 380 L766 470 L790 600 L774 720 L800 860 L782 980 L806 1120 L790 1300" stroke={PH.granitoL} strokeWidth={5} fill="none" opacity={0.7} />
        <Escalador x={540} y={930} quien="joe" s={2.6} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="normal"
          angulos={{ torso: 12, cabeza: 4, brazoA: [100 + 14 * paso, 130 + 10 * paso], brazoB: [162 - 8 * paso, 176], piernaA: [70, 0], piernaB: [34, 14] }} />
      </Svg>
      <Contador m={m} />
      <Etiqueta texto={titulo} top={1170} tam={84} desde={15} />
    </Camara>
  );
};

export const Gancho: React.FC<P> = ({ e, d }) => <PlanoGancho d={d} titulo={e.titulo} />;
