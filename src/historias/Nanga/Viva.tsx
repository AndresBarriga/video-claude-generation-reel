// 8 · Estaba viva: los tres con frontales; arriba, la tormenta baja y se traga la montaña donde sigue Tomek.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ADAM, Camara, CieloNoche, DENIS, ELI, INV, Svg, Ventisca, type P } from "./comun";

export const Viva: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tT = (pal("tomek") ?? Math.round(d * 0.3)) - 4;
  const nube = interpolate(f, [tT, d], [-300, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.06} entrada={false}>
      <Svg>
        <CieloNoche id="vi" />
        <path d="M-200 900 L300 520 L520 380 L760 560 L1280 820 L1280 2400 L-200 2400 Z" fill={INV.nieveSS} />
        {/* la luz de la grieta de Tomek, arriba */}
        <circle cx={500} cy={520} r={18} fill={INV.luz} opacity={0.18 + 0.12 * Math.sin(f / 5)} /><circle cx={500} cy={520} r={6} fill="#FFF8DD" opacity={0.7} />
        <text x={540} y={500} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={40} fill="#fff" stroke="#05040C" strokeWidth={8} paintOrder="stroke">TOMEK · 7.280 m</text>
        {/* tormenta: bancos de nube que bajan */}
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-100 + i * 160} cy={nube + random(`n${i}`) * 120 - 150} rx={240} ry={150} fill="#2A2748" opacity={0.92} />)}
        <path d="M-200 1500 Q540 1430 1280 1500 L1280 2400 L-200 2400 Z" fill={INV.nieve} opacity={0.85} />
        <Escalador x={250} y={1520 - 130 * 2.7} quien="joe" aspecto={DENIS} s={2.7} pose="pie" cara="serio" frontal mira={1} angulos={{ cabeza: -20 }} />
        <Escalador x={520} y={1520 - 40 * 2.7} quien="joe" aspecto={ELI} s={2.7} pose="sentadoSuelo" cara="cerrados" mira={1} angulos={{ piernaA: [100, 10], piernaB: [94, 4], cabeza: 10 }} />
        <Escalador x={830} y={1520 - 130 * 2.7} quien="simon" aspecto={ADAM} s={2.7} pose="pie" cara="serio" frontal mira={-1} angulos={{ cabeza: -24 }} />
        <Ventisca f={f} n={90} fuerza={1.5} />
      </Svg>
    </Camara>
  );
};
