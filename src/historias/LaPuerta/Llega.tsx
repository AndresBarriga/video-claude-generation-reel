// 6 · «Ahora llega fácil. Y Fermín está insoportable.» Coge la presa amarilla (destello) y gira la cara a cámara
// con media sonrisa; la cámara se acerca.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Fermin, POSES_FERMIN } from "../../piezas/Fermin";
import { banderaCasi } from "./Bandera";
import { Cam, H2, Linea, OBJ, Objetivo, Pared, PRESAS_VIA, S, Svg, pop, sale, type P } from "./comun";

export const Llega: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const coge = sale(f / 8), tI = pal("insoportable.") ?? Math.round(d * 0.6);
  const des = pop(f - 6);
  const cab = { x: H2.x, y: H2.y - 250 * S };
  return (
    <Svg>
      <Cam z={1 + 0.2 * sale((f - 10) / 40)} cx={cab.x} cy={cab.y + 120}>
        <Pared presas={PRESAS_VIA} />
        <Objetivo f={f} brillo={1 - sale((f - 10) / 20)} />
        <Linea k={1} verde={1} />
        <Fermin x={H2.x} y={H2.y} s={S} pose={banderaCasi(1 - coge)} poseB={POSES_FERMIN.bandera} t={coge} cara={f < tI ? "alivio" : "normal"} mira={f < 12 ? 0 : 1} />
        {des > 0 && f < 26 && <g transform={`translate(${OBJ.x} ${OBJ.y}) scale(${des})`} opacity={1 - Math.max(0, f - 14) / 12}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M0 -60 L0 -100`} stroke="#F2C230" strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
        </g>}
      </Cam>
    </Svg>
  );
};
