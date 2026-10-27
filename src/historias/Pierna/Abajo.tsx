// El asegurador al pie de la vía: sentado en la mochila, la cuerda naranja sube por la pared. Se ríe, grita, pone música…
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import { ASEG, Cielo, Cuerda, Montanas, P11, Pared, Svg, borde } from "./comun";

export const SUELO_A = 1330;
/** gesto: "bocina" (mano a la boca), "movil" (móvil en alto), "quieto". */
export const PlanoAbajo: React.FC<{ cara: Cara; gesto: "bocina" | "movil" | "quieto"; baile?: number }> = ({ cara, gesto, baile = 0 }) => {
  const f = useCurrentFrame();
  const x0 = 820, s = 2.4, hx = 430, hy = SUELO_A - 136 * s;
  const ba = baile * Math.sin(f / 3.2) * 9;
  const brazos: Partial<Angulos> =
    gesto === "bocina" ? { brazoA: [150, 205], brazoB: [60, 100], cabeza: -22 + Math.sin(f / 5) * 4 } :
    gesto === "movil" ? { brazoA: [165, 178], brazoB: [70, 110], cabeza: -14 } :
    { brazoA: [60, 120], brazoB: [50, 100], cabeza: -24 };
  const mano = gesto === "movil" ? { x: hx + 16 * s, y: hy - 196 * s } : null;
  return (
    <Svg>
      <Cielo id="acielo" />
      <Montanas y={1060} />
      <Pared x0={x0} semilla="a" />
      <path d={`M-300 ${SUELO_A} Q300 ${SUELO_A - 20} ${borde(SUELO_A, x0) + 40} ${SUELO_A + 4} L1500 ${SUELO_A + 10} L1500 2400 L-300 2400 Z`} fill="#5C6B4E" />
      {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={40 + random(`pi${i}`) * 900} cy={SUELO_A + 60 + random(`pj${i}`) * 300} rx={30 + random(`pk${i}`) * 40} ry={12} fill="#4A5940" />)}
      
      <rect x={hx - 230} y={SUELO_A - 90} width={120} height={96} rx={26} fill="#3A4656" /><rect x={hx - 220} y={SUELO_A - 110} width={100} height={30} rx={12} fill="#2E3A4A" />
      {/* cuerda: del grigri sube a la pared y desaparece arriba; un montón en el suelo */}
      <Cuerda d={`M${hx + 22} ${hy - 30} Q${hx + 200} ${hy - 160} ${borde(600, x0) + 6} 600 L${borde(-200, x0) + 10} -200`} />
      <Cuerda d={`M${hx + 22} ${hy - 30} Q${hx + 90} ${SUELO_A - 30} ${hx + 230} ${SUELO_A + 8} q60 10 40 -14 q-40 -14 -90 4`} w={9} />
      <Escalador x={hx} y={hy} quien="joe" look={ASEG} s={s} pose="pie" cara={cara} sombra={SUELO_A + 4}
        angulos={{ torso: -6 + ba, piernaA: [10 - ba * 0.6, -ba * 0.3], piernaB: [-8 - ba * 0.6, ba * 0.3], ...brazos }} />
      {mano && <g transform={`translate(${mano.x} ${mano.y}) rotate(${ba})`}><rect x={-26} y={-46} width={52} height={92} rx={10} fill="#1B2230" /><rect x={-20} y={-38} width={40} height={68} rx={6} fill="#7FB3D9" /></g>}
      <rect x={-300} y={-300} width={1700} height={2600} fill={P11.cieloB} opacity={interpolate(f, [0, 6], [0.25, 0], { extrapolateRight: "clamp" })} />
    </Svg>
  );
};
