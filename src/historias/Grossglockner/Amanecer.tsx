// Escena «Ella muere de hipotermia»: primer plano de su cara helada (gris azulada, escarcha en cejas, pestañas y casco, labios morados).
// En «A cincuenta metros de la cumbre» la cámara se aleja: ella en su roca y la cumbre, ahí mismo.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, Pico, Roca, Svg, Viento, Zoom, cabezaElla, ellaGris, sueloY, type P } from "./comun";
import { Escarcha } from "./Color";
import { rocaDe } from "./Noche";

const Fondo: React.FC = () => (
  <>
    <defs><linearGradient id="am" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A4E72" /><stop offset="0.7" stopColor="#8EA3C2" /><stop offset="1" stopColor="#D9B9A6" /></linearGradient></defs>
    <rect x={-300} y={-500} width={1700} height={3000} fill="url(#am)" />
  </>
);

export const Amanecer: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), corte = (pal("A") ?? Math.round(d * 0.45)) - 2;
  if (f < corte) {
    const helada = interpolate(f, [0, corte], [0.75, 1], { extrapolateRight: "clamp" }), G = ellaGris(1);
    const Cab = cabezaElla(helada);
    return (
      <Camara d={corte} empuje={0.06} foco="50% 42%">
        <Svg>
          <Fondo />
          <path d="M180 1700 Q200 1180 540 1150 Q880 1180 900 1700 Z" fill={G.chaqueta} />
          <path d="M380 1170 Q540 1240 700 1170" stroke={G.chaquetaSombra} strokeWidth={22} fill="none" />
          <g transform="translate(420 840) scale(8)"><Cab cara="cerrados" /></g>
          {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={200 + random(`hx${i}`) * 680} cy={360 + random(`hy${i}`) * 1100} r={2 + random(`hr${i}`) * 5} fill="#F4F9FF" opacity={random(`ho${i}`) < helada ? 0.85 : 0} />)}
          <Viento n={25} fuerza={0.5} op={0.5} />
        </Svg>
      </Camara>
    );
  }
  const g = f - corte, s = 1.6, xa = 720, ha = rocaDe(xa) - 8 * s;
  const z = interpolate(g, [0, d - corte], [2.0, 1], { extrapolateRight: "clamp" });
  return (
    <Camara d={d - corte} empuje={0} entrada={false}>
      <Svg>
        <Fondo />
        <Zoom s={z} cx={xa} cy={ha - 80} tx={600} ty={900}>
          <Pico cx={860} cimaY={360} base={1300} ancho={900} noche={false} />
          <Arista base={1250} color="#4A5878" />
          <Roca x={xa} y={rocaDe(xa)} />
          <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ellaGris(1)} Cabeza={cabezaElla(1)} pose="sentado" cara="cerrados" mira={-1} angulos={{ torso: -4, cabeza: 34, brazoA: [40, 120], brazoB: [30, 110] }} sombra={sueloY(xa)} />
          <Escarcha x={xa} y={ha} s={s} k={1} />
        </Zoom>
        <Viento n={25} fuerza={0.5} op={0.45} />
      </Svg>
    </Camara>
  );
};
