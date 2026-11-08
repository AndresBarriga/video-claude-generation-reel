// Escena 6 · Cierre: primer plano del pie con la cuerda por delante y la cara del escalador aliviada.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Trepador } from "./Trepador";
import { GYM, Pared, Svg, Rotulo, type P } from "./comun";

export const Cierre: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: GYM.paredA }}>
      <Svg>
        <Pared f={f} />
        <g transform="translate(54 70) scale(0.9)"><Trepador f={f} detras={false} /></g>
        <Escalador x={820} y={1580} quien="simon" pose="tirando" cara="alivio" s={1.1} mira={-1}
          aspecto={{ chaqueta: "#7A4FA3", chaquetaSombra: "#563578", casco: null, peinado: "corto", pelo: "#2B1D14", pantalon: "#2B3442" }} />
        <Rotulo f={f} ini={4} t="MÁNDASELO A QUIEN TE ASEGURA" y={300} tam={52} col={GYM.cuerda} />
      </Svg>
    </AbsoluteFill>
  );
};
