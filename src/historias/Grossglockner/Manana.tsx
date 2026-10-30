// Escena 3: de día suben por la arista; tú (el experto) delante con la manta asomando; ella detrás. Una chova curiosea en una roca.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, Chova, EL, ELLA, Etiqueta, PG, Pico, Roca, Svg, cabezaElla, caderaApoyada, paso, sueloY, type P } from "./comun";

export const Manana: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), s = 1.5;
  const xe = interpolate(f, [0, d], [520, 700]), xa = xe - 260;
  const pe = paso((f / 26) % 1), pa = paso((f / 26 + 0.5) % 1, -14);
  const he = caderaApoyada(xe, s, pe.piernaA, pe.piernaB), ha = caderaApoyada(xa, s, pa.piernaA, pa.piernaB);
  return (
    <Camara d={d} empuje={0.05} foco="55% 50%">
      <Svg>
        <defs><linearGradient id="dia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PG.dia} /><stop offset="1" stopColor={PG.diaB} /></linearGradient></defs>
        <rect x={-300} y={-500} width={1700} height={3000} fill="url(#dia)" />
        <path d="M-100 1100 L260 760 L420 860 L640 600 L900 900 L1180 760 L1180 1500 L-100 1500 Z" fill="#B9C9D9" />
        <Pico cx={860} cimaY={300} base={1300} ancho={1000} noche={false} />
        <Arista base={1250} color="#5A6676" />
        <Roca x={940} y={sueloY(940) - 70} w={130} />
        <Chova x={930} y={sueloY(940) - 72} s={2} mira={-1} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} Cabeza={cabezaElla()} mochila cara="esfuerzo" mira={1} angulos={{ ...pa, cabeza: -10 }} sombra={sueloY(xa)} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={1} angulos={{ ...pe, cabeza: -16 }} sombra={sueloY(xe)} />
      </Svg>
      <Etiqueta texto={e.titulo} top={260} tam={96} desde={6} />
    </Camara>
  );
};
