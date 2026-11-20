// Paso 1, analogía propia: las bolsas de la compra. Izquierda: brazos doblados (tiembla, barra PUMP sube) ✗. Derecha: estirados, sin esfuerzo ✓.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Frente, type V } from "../Puerta/Frente";
import { GY } from "../Pump/Gym";
import { BLOQUES, BarraBloques, Camara, Chip, Svg, Vig, ei, type P } from "./comun";

const S = 1.5, CY = 1130;
const Bolsa: React.FC<{ m: V; col: string }> = ({ m, col }) => (
  <g transform={`translate(${m[0]} ${m[1]})`}>
    <path d="M-34 6 Q-30 -26 0 -26 Q30 -26 34 6" stroke="#E9E2D3" strokeWidth={9} fill="none" />
    <path d="M-62 6 L62 6 L52 150 L-52 150 Z" fill={col} stroke="#141B26" strokeWidth={6} strokeLinejoin="round" />
    <path d="M-24 6 L-30 -40 M-6 6 L4 -54 M20 6 L30 -34" stroke="#6FA34A" strokeWidth={12} strokeLinecap="round" />
  </g>
);
const Persona: React.FC<{ cx: number; doblado: boolean; f: number; temb: number }> = ({ cx, doblado, f, temb }) => {
  const sy = CY - 132 * S, tr = doblado ? Math.sin(f * 2.1) * 6 * temb : 0;
  const mL: V = doblado ? [cx - 44 * S + tr, sy + 62 * S] : [cx - 58 * S, sy + 118 * S];
  const mR: V = doblado ? [cx + 44 * S - tr, sy + 62 * S] : [cx + 58 * S, sy + 118 * S];
  return (
    <g>
      <Frente cx={cx} cy={CY} s={S} hx={cx} manoL={mL} manoR={mR} cara={doblado ? (temb > 0.5 ? "esfuerzo" : "serio") : "alivio"} trenza={false} chaqueta={GY.chaqueta} chaquetaS={GY.chaquetaS} gorro={GY.gorro} f={f} codos={doblado ? { col: "#FF4A3A", o: 0.5 + 0.5 * temb } : undefined} />
      <Bolsa m={[mL[0], mL[1] + 8]} col="#D9A21B" /><Bolsa m={[mR[0], mR[1] + 8]} col="#C8566B" />
    </g>
  );
};
export const Bolsas: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fC = pal("como") ?? 36, fD = pal("dobladas") ?? 75, fE = pal("estiradas") ?? 120;
  const sp = ei(f, fC - 4, fC + 10, 0, 1), temb = ei(f, fD, fD + 30, 0, 1);
  return (
    <Camara d={d} empuje={0.02} foco="50% 55%">
      <Svg>
        <rect width={1080} height={1920} fill="#1B2A44" />
        <rect y={CY + 300} width={1080} height={700} fill="#14213A" />
        <g opacity={1 - sp}><g transform="translate(540 1100) scale(1.25) translate(-540 -1100)"><Persona cx={540} doblado={false} f={f} temb={0} /></g></g>
        <g opacity={sp}>
          <Persona cx={290} doblado f={f} temb={temb} />
          <Persona cx={800} doblado={false} f={f} temb={0} />
          <rect x={534} y={560} width={12} height={1300} fill="#fff" opacity={0.6} />
          <BarraBloques x={70} y0={700} y1={1300} v={0.5 + 4.3 * ei(f, fD, d, 0, 1, (x) => x)} cols={BLOQUES} etiqueta="PUMP" ancho={46} o={ei(f, fD - 6, fD, 0, 1)} />
          <BarraBloques x={1010} y0={700} y1={1300} v={0.5 + 0.6 * ei(f, fE, d, 0, 1, (x) => x)} cols={BLOQUES} etiqueta="PUMP" ancho={46} o={ei(f, fE - 6, fE, 0, 1)} />
        </g>
        <Vig />
        <Chip x={540} y={700} t="BRAZOS ESTIRADOS" col={BLOQUES[0]} o={1 - sp} />
        <Chip x={290} y={1640} t="✗ DOBLADOS" col="#FF8E7E" o={ei(f, fD - 4, fD + 4, 0, 1)} />
        <Chip x={800} y={1640} t="✓ ESTIRADOS" col="#8FE0AE" o={ei(f, fE - 4, fE + 4, 0, 1)} />
      </Svg>
    </Camara>
  );
};
