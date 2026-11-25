// 2 · «Es lo que llamamos el efecto puerta. Mano y pie del mismo lado hacen de bisagra.»
// Rebobina a la pared; en «puerta» se entreabre (chirrido); anillos en la mano y el pie derechos; la línea roja une los dos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN, mezclaPose } from "../../piezas/Fermin";
import { COLGADO } from "./Abre";
import { Anillo, BarraGiro, COL, Cam, Etiqueta, H, L1, Linea, MD, Objetivo, PD, Pared, PRESAS_VIA, Svg, sale, type P } from "./comun";

export const Bisagra: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame();
  const vuelve = sale(f / 18);
  const pose = mezclaPose(POSES_FERMIN.colgado, POSES_FERMIN.puerta, vuelve);
  const y = COLGADO.y + (H.y - COLGADO.y) * vuelve;
  const tP = pal("puerta.") ?? 40, tM = pal("Mano") ?? 80, tPie = pal("pie") ?? 90, tB = pal("bisagra.") ?? 130;
  const entreabre = f > tP - 4 && f < tP + 26 ? Math.sin(((f - tP + 4) / 30) * Math.PI) * 0.4 : 0;
  const abre = (1 - vuelve) * COLGADO.abre + entreabre;
  const anillos = f < tB + 10;
  return (
    <>
      <Svg>
        <Cam z={1.04 - 0.04 * vuelve + 0.03 * (f / 160)}>
          <Pared presas={PRESAS_VIA} />
          <Objetivo f={f} />
          <Fermin x={H.x} y={y} s={1.15} pose={pose} abre={abre} cara={entreabre > 0.1 ? "miedo" : "normal"} mira={f < 24 || entreabre > 0.1 ? -1 : 0} cuerdaX={H.x + 4} sombra />
          <Linea k={(f - tB + 6) / 16} />
          {anillos && <Anillo p={MD} k={f - tM} />}
          {anillos && <Anillo p={PD} k={f - tPie} />}
        </Cam>
        <BarraGiro v={0.35 + entreabre} />
      </Svg>
      <Etiqueta x={540} y={480} t="◀◀ REBOBINA" k={f < 30 ? f + 1 : 0} />
      {f < tB + 8 && <Etiqueta x={880} y={1160} t="MISMO LADO" k={f - tM} c={COL.rojo} tam={32} />}
      <Etiqueta x={L1.x + 40} y={L1.y - 40} t="BISAGRA" k={f - tB} c={COL.rojo} tam={38} />
    </>
  );
};
