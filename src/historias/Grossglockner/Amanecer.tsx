// Escena 8: amanecer frío. Ella, gris y con escarcha, inmóvil donde la dejaron; su frontal casi apagado; frontales de rescate alrededor. Silencio.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CruzCumbre, Frontal, Svg, Viento, ellaGris, sueloY, type P } from "./comun";
import { Escarcha } from "./Color";

const RESCATE = { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", casco: "#EEF1F4" };
export const Amanecer: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const s = 1.6, xa = 470, ha = sueloY(xa) - 30 * s;
  return (
    <Camara d={d} empuje={0.03} foco="45% 55%">
      <Svg>
        <defs><linearGradient id="am" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A4E72" /><stop offset="0.7" stopColor="#8EA3C2" /><stop offset="1" stopColor="#D9B9A6" /></linearGradient></defs>
        <rect x={-300} y={-500} width={1700} height={3000} fill="url(#am)" />
        <path d="M760 520 L900 260 L1040 540 Z" fill="#C9D6E6" /><CruzCumbre x={900} y={262} s={0.7} color="#5A6676" />
        <Arista base={1250} color="#4A5878" />
        {[[200, -1], [760, -1], [930, -1]].map(([x], i) => (
          <Escalador key={i} x={x} y={sueloY(x) - 140.6 * 1.3} quien="joe" s={1.3} aspecto={RESCATE} cara="cerrados" mira={x < xa ? 1 : -1} angulos={{ cabeza: 24 }} sombra={sueloY(x)} />
        ))}
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ellaGris(1)} pose="sentado" cara="cerrados" mira={1} angulos={{ torso: -4, cabeza: 34, brazoA: [40, 120], brazoB: [30, 110] }} sombra={sueloY(xa)} />
        <Escarcha x={xa} y={ha} s={s} k={1} />
        <circle cx={xa + 22 * s} cy={ha - 170 * s} r={7} fill="#FFF6D0" opacity={0.35 + 0.15 * Math.sin(f / 5)} />
        <Viento n={30} fuerza={0.6} op={0.5} />
      </Svg>
    </Camara>
  );
};
