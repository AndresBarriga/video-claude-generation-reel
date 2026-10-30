// Escena 5 («22:00»): llega un helicóptero con foco. Él lo rechaza (brazos cruzándose: «no hace falta»). Ella, sentada, mira arriba.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, ELLA, Hora, Manta, Svg, Viento, sueloY, type P } from "./comun";

export const Heli: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse cx={0} cy={0} rx={90} ry={46} fill="#C8402E" stroke="#0B1624" strokeWidth={5} />
      <rect x={70} y={-12} width={150} height={20} rx={8} fill="#C8402E" stroke="#0B1624" strokeWidth={4} />
      <ellipse cx={-34} cy={-6} rx={34} ry={24} fill="#9CC9E8" stroke="#0B1624" strokeWidth={4} />
      <path d={`M${-150 + (f % 4) * 20} -58 L${150 - (f % 4) * 20} -58`} stroke="#0B1624" strokeWidth={6} />
      <rect x={-4} y={-58} width={8} height={14} fill="#0B1624" />
      <path d="M-60 46 L60 46" stroke="#0B1624" strokeWidth={6} />
    </g>
  );
};

export const Helicoptero: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const llega = interpolate(f, [0, 20], [-200, 0], { extrapolateRight: "clamp" });
  const no = Math.sin(f / 4) > 0 ? 1 : -1;
  const s = 1.6, xa = 380, xe = 650, ha = sueloY(xa) - 30 * s, he = sueloY(xe) - 140.6 * s;
  return (
    <Camara d={d} empuje={0.04} foco="50% 40%">
      <Svg>
        <CieloNoche id="he" />
        <path d={`M${720 + llega} 520 L${380} ${sueloY(380) + 40} L${900} ${sueloY(900) + 40} Z`} fill="#FFF6D0" opacity={0.22} />
        <Heli x={720 + llega} y={470} rot={-6} />
        <Arista base={1250} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} pose="sentado" cara="miedo" mira={1} angulos={{ cabeza: -40 }} frontal sombra={sueloY(xa)} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={-1}
          angulos={{ cabeza: -30, brazoA: [150 + 20 * no, 160 + 30 * no], brazoB: [150 - 20 * no, 160 - 30 * no] }} sombra={sueloY(xe)} />
        <Manta x={xe + 34 * s} y={he - 112 * s} s={1.3} />
        <Viento n={50} fuerza={1.4} op={0.5} />
      </Svg>
      <Hora t={e.titulo} />
    </Camara>
  );
};
