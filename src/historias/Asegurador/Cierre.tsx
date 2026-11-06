// 5 · Cierre: parejas al pie de la vía hablando (reparto variado, también un chico ligero con otro grande) → corte al rocódromo congelado (bucle).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, EL, ELLA, Encuadre, Fondo, Ohm, ParedCuerda, Rotulo, SUELO, Svg, type P } from "./comun";
import { Plano } from "./Parado";

export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fAntes = pal("antes") ?? Math.round(d * 0.5);
  const bucle = f >= d - 34;
  if (bucle) return (
    <Camara d={d} entrada={false} empuje={0}>
      <Plano k={1} congelado f={f} />
      <Svg><Rotulo f={f} ini={d - 34} t="MÁNDASELO A QUIEN" y={280} tam={78} /><Rotulo f={f} ini={d - 31} t="ESCALA CONTIGO" y={370} tam={92} col="#FF6A1F" /></Svg>
    </Camara>
  );
  const hip = (s: number) => SUELO - 136 * s;
  const habla = Math.sin(f * 0.5) > 0;
  return (
    <Camara d={d} empuje={0.05} foco="50% 60%">
      <Svg><Encuadre>
        <Fondo />
        <ParedCuerda ohm={1} />
        {/* parejas del fondo */}
        <g opacity={0.85}>
          <Escalador x={250} y={hip(0.58) - 30} quien="joe" pose="senalando" cara="normal" s={0.58} aspecto={{ chaqueta: "#6FA34A", chaquetaSombra: "#4E7A33", casco: null, peinado: "corto", pelo: "#1B1410", piel: "#8D5A3B", pielSombra: "#6E4429", manos: "piel" }} sombra={SUELO - 26} />
          <Escalador x={320} y={hip(0.66) - 30} quien="joe" pose="pie" cara="alivio" s={0.66} mira={-1} cuerpo={{ torso: 72, grosor: 1.3 }} aspecto={{ chaqueta: "#4F7FC9", chaquetaSombra: "#36599A", casco: null, peinado: "rapado", pelo: "#2B1D14", barba: "#2B1D14", piel: "#F0C7A4", pielSombra: "#D3A27C", manos: "piel" }} sombra={SUELO - 26} />
          <Escalador x={400} y={hip(0.62) - 30} quien="simon" pose="pie" cara="normal" s={0.62} cuerpo={{ torso: 64, grosor: 1.18 }} aspecto={{ chaqueta: "#E0A526", chaquetaSombra: "#A97812", casco: null, peinado: "rizado", pelo: "#2B1D14", piel: "#B9805A", pielSombra: "#94603F", manos: "piel" }} sombra={SUELO - 26} />
          <Escalador x={465} y={hip(0.55) - 30} quien="simon" pose="senalando" cara="alivio" s={0.55} mira={-1} aspecto={{ chaqueta: "#C8566B", chaquetaSombra: "#963F50", casco: null, peinado: "trenzas", pelo: "#1B1410", piel: "#7A4B30", pielSombra: "#5C3621", manos: "piel" }} sombra={SUELO - 26} />
        </g>
        {/* ellos dos, hablando antes de escalar */}
        <Escalador x={560} y={hip(ELLA.s)} quien="simon" pose={f >= fAntes ? "senalando" : "pie"} cara={habla && f < fAntes ? "sopla" : "normal"} s={ELLA.s} aspecto={ELLA.aspecto} pies="#C8566B" sombra={SUELO + 6} />
        <Escalador x={700} y={hip(EL.s)} quien="joe" pose="pie" cara={f >= fAntes ? "alivio" : "normal"} s={EL.s} mira={-1} aspecto={EL.aspecto} cuerpo={EL.cuerpo} pies="#E0A526" sombra={SUELO + 6} />
        <path d={`M-300 ${SUELO + 4} L1400 ${SUELO + 4} L1400 2400 L-300 2400 Z`} fill="#2E4B7A" />
        <path d={`M-300 ${SUELO + 4} L1400 ${SUELO + 4}`} stroke="#4E6FA6" strokeWidth={10} />
        {f >= fAntes && <g transform="translate(660 1120)"><Ohm x={0} y={0} s={0.28} /></g>}
      </Encuadre></Svg>
    </Camara>
  );
};
