// Escenas 5 y 6 («22:00»): llega el helicóptero, su foco barre la arista; tú lo rechazas con los brazos y se va.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador, POSES } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, ELLA, Hora, Manta, Roca, Svg, Vaho, Viento, caderaApoyada, sueloY, type P } from "./comun";
import { PAREJA, rocaDe } from "./Noche";

export const Heli: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={-58} rx={170} ry={10} fill="#0B1624" opacity={0.35 + 0.25 * Math.sin(f * 2.4)} />
      <rect x={-4} y={-58} width={8} height={14} fill="#0B1624" />
      <ellipse cx={0} cy={0} rx={90} ry={46} fill="#C8402E" stroke="#0B1624" strokeWidth={5} />
      <rect x={70} y={-12} width={150} height={20} rx={8} fill="#C8402E" stroke="#0B1624" strokeWidth={4} />
      <circle cx={222} cy={-2} r={22} fill="none" stroke="#0B1624" strokeWidth={3} opacity={0.5} />
      <ellipse cx={-34} cy={-6} rx={34} ry={24} fill="#9CC9E8" stroke="#0B1624" strokeWidth={4} />
      <path d="M-60 46 L60 46" stroke="#0B1624" strokeWidth={6} />
    </g>
  );
};

const PlanoHeli: React.FC<{ d: number; fase: "llega" | "rechaza"; hora?: string }> = ({ d, fase, hora }) => {
  const f = useCurrentFrame(), { s, xa, xe } = PAREJA;
  const hx = fase === "llega" ? interpolate(f, [0, d], [-180, 640]) : interpolate(f, [0, d], [640, 1300]);
  const hy = 430 + Math.sin(f / 7) * 12, barrido = fase === "llega" ? interpolate(f, [0, d], [-30, 12]) : 12 + Math.sin(f / 3) * 4;
  const no = fase === "rechaza" ? Math.sin(f / 3) : 0;
  const pie = POSES.pie as { piernaA: [number, number]; piernaB: [number, number] };
  const he = caderaApoyada(xe, s, pie.piernaA, pie.piernaB, -1), ha = rocaDe(xa) - 8 * s;
  return (
    <Camara d={d} empuje={0.04} foco="50% 40%" sacudida={1.2}>
      <Svg>
        <CieloNoche id="he" />
        <g transform={`rotate(${barrido} ${hx} ${hy})`}><path d={`M${hx} ${hy + 30} L${hx - 260} ${1400} L${hx + 260} ${1400} Z`} fill="#FFF6D0" opacity={0.2} /></g>
        <Heli x={hx} y={hy} rot={fase === "llega" ? -8 : 8} />
        <Arista base={1250} />
        <Roca x={xa} y={rocaDe(xa)} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} pose="sentado" cara={fase === "llega" ? "alivio" : "miedo"} mira={1} angulos={{ cabeza: fase === "llega" ? -40 : -10 }} frontal sombra={sueloY(xa)} />
        <Vaho x={xa + 30 * s} y={ha - 150 * s} fuerza={0.9} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={-1}
          angulos={fase === "rechaza" ? { cabeza: -30, brazoA: [150 + 25 * no, 160 + 40 * no], brazoB: [150 - 25 * no, 160 - 40 * no] } : { cabeza: -30 }} sombra={sueloY(xe)} />
        <Manta x={xe + 34 * s} y={he - 112 * s} s={1.3} />
        <Viento n={60} fuerza={1.6} op={0.55} />
      </Svg>
      <Hora t={hora} />
    </Camara>
  );
};
export const Helicoptero: React.FC<P> = ({ e, d }) => <PlanoHeli d={d} fase="llega" hora={e.titulo} />;
export const Rechazo: React.FC<P> = ({ d }) => <PlanoHeli d={d} fase="rechaza" hora="22:00" />;
