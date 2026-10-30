// Escena 6 («02:00»): él se va (con la manta en la mochila); a ella se le va el color y le sube la escarcha.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, Frontal, Hora, Manta, Svg, Viento, ellaGris, sueloY, type P } from "./comun";

export const Escarcha: React.FC<{ x: number; y: number; s: number; k: number }> = ({ x, y, s, k }) => (
  <g opacity={k}>{Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={x + (random(`fx${i}`) - 0.5) * 90 * s} cy={y - random(`fy${i}`) * 200 * s} r={(1.5 + random(`fr${i}`) * 3) * s} fill="#F4F9FF" opacity={random(`fo${i}`) < k ? 0.9 : 0} />)}</g>
);

export const Color: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const gris = interpolate(f, [0, d], [0, 0.85], { extrapolateRight: "clamp" });
  const se = interpolate(f, [0, d], [650, 980], { extrapolateRight: "clamp" });
  const s = 1.6, xa = 380, ha = sueloY(xa) - 30 * s, he = sueloY(se) - 140.6 * s;
  return (
    <Camara d={d} empuje={0.06} foco="35% 55%">
      <Svg>
        <CieloNoche id="co" />
        <Arista base={1250} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ellaGris(gris)} pose="sentado" cara="cerrados" mira={1} angulos={{ cabeza: 26, brazoA: [40, 120], brazoB: [30, 110] }} frontal sombra={sueloY(xa)} />
        <Escarcha x={xa} y={ha} s={s} k={gris} />
        <Escalador x={se} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={1} angulos={{ cabeza: 10, piernaA: [14 * Math.sin(f / 6), -6], piernaB: [-14 * Math.sin(f / 6), 4] }} frontal sombra={sueloY(se)} />
        <Manta x={se - 34 * s} y={he - 112 * s} s={1.3} />
        <Viento n={70} fuerza={1.5} op={0.6} />
      </Svg>
      <Hora t={e.titulo} />
    </Camara>
  );
};
