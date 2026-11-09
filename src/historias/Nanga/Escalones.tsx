// 4 · Lo ancla en la grieta, talla escalones hasta la entrada y sale; mira atrás. Luego: otra noche sola, en otra grieta, a oscuras.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cuerda, ELI, Etiqueta, INV, Oscuridad, Svg, TOMEK, Ventisca, sube, golpe, type P } from "./comun";
import { Grieta } from "./Hielo";

export const Escalones: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tN = (pal("paso") ?? Math.round(d * 0.62)) - 4; // «Pasó otra noche sola»
  if (f >= tN) { // segunda noche: sola, acurrucada, solo su frontal
    const g = f - tN;
    return (
      <Camara d={d - tN} empuje={0.05} entrada={false}>
        <Svg>
          <Grieta alba={0} />
          <path d="M150 1370 Q540 1330 930 1370 L930 1460 L150 1460 Z" fill="#E4F2FA" />
          <Escalador x={540} y={1365} quien="joe" aspecto={ELI} s={2.5} pose="sentadoSuelo" cara="cerrados" frontal mira={1} angulos={{ torso: 10, cabeza: 30, piernaA: [118, 4], piernaB: [110, -4], brazoA: [70, 130] }} />
          <Ventisca f={f} n={50} fuerza={0.7} />
          <Oscuridad x={600} y={1000} r={520 - g * 2} id="es2" base={0.95} />
        </Svg>
        <Etiqueta texto="OTRA NOCHE · SOLA" top={230} tam={92} desde={tN + 2} />
      </Camara>
    );
  }
  const golpes = [10, 22, 34, 46].filter((t) => f >= t).length; // escalones tallados
  const sale = sube(f, 58, tN - 12);
  const mira = f > tN - 22 ? 1 : 0;
  return (
    <Camara d={tN} empuje={0.04} sacudida={[10, 22, 34, 46].reduce((a, t) => a + Math.abs(golpe(f, t, 6)), 0)} entrada={false}>
      <Svg>
        <Grieta alba={1} />
        <path d="M150 1370 Q540 1330 930 1370 L930 1460 L150 1460 Z" fill="#E4F2FA" />
        {/* tornillo de hielo y cuerda que lo ancla */}
        <rect x={200} y={1150} width={40} height={14} rx={4} fill="#B8C2CC" transform="rotate(-10 220 1157)" />
        <Cuerda d="M220 1160 Q260 1260 330 1300" w={9} />
        <Escalador x={330} y={1365} quien="simon" aspecto={TOMEK} s={2.5} pose="sentadoSuelo" cara="cerrados" mira={1} angulos={{ torso: -28, cabeza: 24, piernaA: [118, 4], piernaB: [110, -4], brazoA: [50, 90] }} />
        {/* escalones en la pared derecha, de la repisa a la boca */}
        {Array.from({ length: golpes }).map((_, i) => <path key={i} d={`M${700 + i * 50} ${1260 - i * 220} l90 0 l-10 26 l-80 0 Z`} fill="#F4FBFF" stroke="#7FC4E2" strokeWidth={4} />)}
        {f >= 10 && f < 50 && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={760 + golpes * 50 + random(`h${i}${golpes}`) * 60} cy={1240 - golpes * 220 + random(`v${i}`) * 50} r={5} fill="#fff" opacity={0.8} />)}
        <Escalador x={720 + 180 * sale} y={1365 - 140 - 820 * sale} quien="joe" aspecto={ELI} s={2.3} pose="escalando" cara={mira ? "miedo" : "esfuerzo"} mira={mira ? -1 : 1} frontal={false} />
        <text x={980} y={560} textAnchor="end" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={60} fill="#fff" stroke="#06233D" strokeWidth={10} paintOrder="stroke">{INV && "7.280 m"}</text>
      </Svg>
      <Etiqueta texto="LO ANCLA Y BAJA A POR AYUDA" top={230} tam={74} desde={4} />
    </Camara>
  );
};
