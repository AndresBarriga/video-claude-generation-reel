// Escena 9: amanecer. La cámara se aleja despacio desde ella (gris, escarcha, inmóvil en su roca) hasta que se ve que la cruz estaba ahí mismo.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CruzCumbre, Roca, Svg, Viento, Zoom, ellaGris, sueloY, type P } from "./comun";
import { Escarcha } from "./Color";
import { rocaDe } from "./Noche";

export const Amanecer: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), s = 1.6, xa = 720, ha = rocaDe(xa) - 8 * s;
  const z = interpolate(f, [0, d], [2.2, 1], { extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0} entrada={false}>
      <Svg>
        <defs><linearGradient id="am" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A4E72" /><stop offset="0.7" stopColor="#8EA3C2" /><stop offset="1" stopColor="#D9B9A6" /></linearGradient></defs>
        <rect x={-300} y={-500} width={1700} height={3000} fill="url(#am)" />
        <Zoom s={z} cx={xa} cy={ha - 80} tx={600} ty={900}>
          <path d="M760 520 L900 260 L1040 540 Z" fill="#C9D6E6" /><CruzCumbre x={900} y={262} s={0.7} color="#5A6676" />
          <Arista base={1250} color="#4A5878" />
          <Roca x={xa} y={rocaDe(xa)} />
          <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ellaGris(1)} pose="sentado" cara="cerrados" mira={-1} angulos={{ torso: -4, cabeza: 36, brazoA: [40, 120], brazoB: [30, 110] }} sombra={sueloY(xa)} />
          <Escarcha x={xa} y={ha} s={s} k={1} />
        </Zoom>
        <Viento n={25} fuerza={0.5} op={0.45} />
      </Svg>
    </Camara>
  );
};
