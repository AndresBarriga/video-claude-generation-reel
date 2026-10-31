// Escena 7 («02:00»): te giras, dudas medio segundo y bajas. A ella se le apaga el vaho, se le va el color y le sube la escarcha.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, Hora, Roca, Svg, Vaho, Viento, cabezaElla, caderaApoyada, ellaGris, paso, sueloY, type P } from "./comun";
import { MantaInserto } from "./MantaPrimer";
import { rocaDe } from "./Noche";

export const Escarcha: React.FC<{ x: number; y: number; s: number; k: number }> = ({ x, y, s, k }) => (
  <g>{Array.from({ length: 46 }).map((_, i) => <circle key={i} cx={x + (random(`fx${i}`) - 0.5) * 90 * s} cy={y - random(`fy${i}`) * 190 * s} r={(1.5 + random(`fr${i}`) * 3) * s} fill="#F4F9FF" opacity={random(`fo${i}`) < k ? 0.9 : 0} />)}</g>
);

export const Color: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), i0 = pal("Llevas") ?? Math.round(d * 0.5), i1 = (pal("usaste") ?? Math.round(d * 0.85)) + 14, s = 1.6, xa = 720, cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const gira = d * 0.18, duda = d * 0.3, va = d * 0.38;
  const xe = f < va ? 520 : interpolate(f, [va, d], [520, -160], cl);
  const anda = f >= va ? paso((f / 22) % 1, -6) : { piernaA: [6, 0] as [number, number], piernaB: [-6, 0] as [number, number] };
  const mira: 1 | -1 = f < gira ? 1 : -1;
  const he = caderaApoyada(xe, s, anda.piernaA, anda.piernaB, mira);
  const gris = interpolate(f, [va, d], [0, 0.85], cl), aliento = interpolate(f, [va, d * 0.9], [1, 0], cl);
  const ha = rocaDe(xa) - 8 * s;
  return (
    <Camara d={d} empuje={0.05} foco="60% 55%">
      <Svg>
        <CieloNoche id="co" />
        <Arista base={1250} />
        <Roca x={xa} y={rocaDe(xa)} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ellaGris(gris)} Cabeza={cabezaElla(gris * 0.6)} pose="sentado" cara="cerrados" mira={-1} angulos={{ cabeza: 22 + 10 * gris, brazoA: [40, 120], brazoB: [30, 110] }} frontal={gris < 0.7} sombra={sueloY(xa)} />
        <Vaho x={xa - 30 * s} y={ha - 150 * s} fuerza={aliento} dir={-1} />
        <Escarcha x={xa} y={ha} s={s} k={gris} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara={f > gira && f < va ? "miedo" : "normal"} mira={mira}
          angulos={{ ...anda, cabeza: f > gira && f < va ? 30 : 4 }} frontal sombra={sueloY(xe)} />
        <Viento n={70} fuerza={1.6} op={0.6} />
      </Svg>
      <Hora t={e.titulo} />
      {/manta/i.test(e.texto) && f >= i0 && f < i1 && <MantaInserto f0={i0} />}
    </Camara>
  );
};
