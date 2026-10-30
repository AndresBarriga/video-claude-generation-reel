// Escena 3: por la mañana suben; él delante (el experto), con la manta dorada asomando de su mochila.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CruzCumbre, EL, ELLA, Etiqueta, Manta, PG, Svg, sueloY, type P } from "./comun";

export const Manana: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), paso = Math.sin(f / 6);
  const s = 1.6, xe = 640, xa = 330;
  const he = sueloY(xe) - 140.6 * s, ha = sueloY(xa) - 140.6 * s;
  const andar = (k: number) => ({ piernaA: [14 * k, -6] as [number, number], piernaB: [-14 * k, 4] as [number, number], torso: -14, brazoA: [24 * k, 10] as [number, number], brazoB: [-24 * k, -6] as [number, number] });
  return (
    <Camara d={d} empuje={0.05} foco="55% 50%">
      <Svg>
        <defs><linearGradient id="dia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PG.dia} /><stop offset="1" stopColor={PG.diaB} /></linearGradient></defs>
        <rect x={-300} y={-500} width={1700} height={3000} fill="url(#dia)" />
        <path d="M-100 1100 L260 760 L420 860 L640 600 L900 900 L1180 760 L1180 1500 L-100 1500 Z" fill="#B9C9D9" />
        <path d="M760 500 L900 250 L1040 520 Z" fill="#E9F0F6" /><CruzCumbre x={900} y={252} s={0.7} color="#5A6676" />
        <Arista base={1250} color="#5A6676" />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} mochila cara="esfuerzo" mira={1} rot={-8} angulos={{ ...andar(-paso), cabeza: -10 }} sombra={sueloY(xa)} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={1} rot={-8} angulos={{ ...andar(paso), cabeza: -20 }} sombra={sueloY(xe)} />
        <Manta x={xe - 34 * s} y={he - 112 * s} s={1.3} />
      </Svg>
      <Etiqueta texto={e.titulo} top={260} tam={96} desde={6} />
    </Camara>
  );
};
