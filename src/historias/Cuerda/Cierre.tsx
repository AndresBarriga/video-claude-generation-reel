// Escena 6 · Cierre: primer plano del pie con la cuerda por delante y la cara del escalador aliviada.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { GYM, Pared, Svg, Rotulo, type P } from "./comun";

export const Cierre: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: GYM.paredA }}>
      <Svg>
        <Pared f={f} />
        <Escalador x={540} y={1050} quien="joe" pose="escalando" cara="alivio" s={2.6} frontal
          aspecto={{ chaqueta: "#2FB8A8", chaquetaSombra: "#1F7F73", casco: "#F2C230", pantalon: "#2B3442", pelo: "#3B2A20" }} />
        <path d="M600 950 Q620 1100 640 1260 Q660 1420 570 1620" stroke={GYM.cuerda} strokeWidth={16} fill="none" strokeLinecap="round" />
        <Escalador x={820} y={1590} quien="simon" pose="pie" cara="alivio" s={1.2} frontal mira={-1}
          aspecto={{ chaqueta: "#7A4FA3", chaquetaSombra: "#563578", casco: null, peinado: "corto", pelo: "#2B1D14", pantalon: "#2B3442" }} />
        <Rotulo f={f} ini={4} t="MÁNDASELO A QUIEN TE ASEGURA" y={300} tam={52} col={GYM.cuerda} />
      </Svg>
    </AbsoluteFill>
  );
};
