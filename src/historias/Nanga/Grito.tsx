// 6 · El clímax: silencio, primer plano de Denis gritando su nombre, negro, una luz lejana se enciende.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, CieloNoche, DENIS, Etiqueta, INV, Oscuridad, Svg, Ventisca, sube, temblor, type P } from "./comun";

export const Grito: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tN = (pal("y") ?? Math.round(d * 0.55)) - 2; // «Y alguien contestó» → negro y luz lejana
  if (f < tN) return (
    <Camara d={tN} empuje={0.1} sacudida={f > 6 ? 3 : 0} entrada={false}>
      <Svg>
        <CieloNoche id="gr" />
        <path d="M-200 1500 L1280 1250 L1280 2400 L-200 2400 Z" fill={INV.nieveSS} />
        <Escalador x={500} y={1900} quien="joe" aspecto={DENIS} s={6} pose="pie" cara="miedo" frontal mira={1} angulos={{ torso: -6, cabeza: -16 + temblor(f, 2), brazoA: [10, 5], brazoB: [-10, -5] }} />
        <Ventisca f={f} n={70} fuerza={1.3} />
        <Oscuridad x={560} y={900} r={700} id="gr" base={0.8} />
      </Svg>
      <Etiqueta texto="¡ELISABETH!" top={230} tam={140} desde={6} />
    </Camara>
  );
  const g = f - tN, luz = sube(g, 8, 20);
  return (
    <Camara d={d - tN} empuje={0.02} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#000" />
        <Ventisca f={f} n={30} fuerza={1.3} />
        <circle cx={720} cy={760} r={90 * luz} fill={INV.luz} opacity={0.18 * luz} />
        <circle cx={720} cy={760} r={12 * luz} fill="#FFF8DD" opacity={luz} />
      </Svg>
    </Camara>
  );
};
