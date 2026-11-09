// 2 · La noche en la grieta: los dos acurrucados; amanece por la boca; él ya no se mueve. Rótulo NANGA PARBAT · 2018 y altímetro.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cuerda, ELI, Etiqueta, Svg, TOMEK, sube, type P } from "./comun";
import { Grieta } from "./Hielo";

export const EnGrieta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tA = (pal("mañana") ?? Math.round(d * 0.7)) - 6;
  const alba = sube(f, tA, tA + 20);
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg>
        <Grieta alba={alba} />
        <path d="M150 1370 Q540 1330 930 1370 L930 1460 L150 1460 Z" fill="#E4F2FA" />
        <path d="M150 1370 Q540 1330 930 1370" stroke="#fff" strokeWidth={6} fill="none" />
        <Cuerda d="M380 1330 Q520 1440 650 1330" w={9} />
        <Escalador x={330} y={1365} quien="simon" aspecto={TOMEK} s={2.5} pose="sentadoSuelo" cara="cerrados" mira={1} angulos={{ torso: -28, cabeza: 24, piernaA: [118, 4], piernaB: [110, -4], brazoA: [50, 90] }} />
        <Escalador x={600} y={1365} quien="joe" aspecto={ELI} s={2.5} pose="sentadoSuelo" cara={alba > 0.5 ? "miedo" : "cerrados"} frontal={alba < 0.5} mira={1} angulos={{ cabeza: alba > 0.5 ? -10 : 18, torso: -8, piernaA: [118, 4], piernaB: [110, -4], brazoA: [60, 100] }} />
        <text x={980} y={560} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={64} fill="#fff" stroke="#06233D" strokeWidth={10} paintOrder="stroke">7.280 m</text>
      </Svg>
      <Etiqueta texto="NANGA PARBAT · 2018" top={230} tam={84} desde={2} />
    </Camara>
  );
};
