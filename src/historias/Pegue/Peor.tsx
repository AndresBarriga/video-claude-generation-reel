// «Pero si sigues buscándolo, cada pegue sale peor»: pegues 15→18, cada caída desde más abajo; en el último ni despega. Anochece.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cielo, Cuerda, Pared, Pegues, SUELO, Suelo, Svg, Zoom, borde, cadera, clamp, enCara, enSuelo, golpe, type P } from "./comun";

const ALTURAS = [940, 1220, 1500];
export const Peor: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const fase = Math.min(3, Math.floor((f / d) * 4)), t0 = Math.round((fase * d) / 4), fl = f - t0, df = d / 4;
  const h = interpolate(f, [0, d], [0.84, 0.97], clamp);
  const S = 1.1, bS = 1.05, bx = 300, by = enSuelo(bS);
  const tCae = Math.round(df * 0.35);
  const caeT = interpolate(fl, [tCae, tCae + 7], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  let x: number, y: number, cuerpo: React.ReactNode;
  if (fase < 3) {
    const hy = ALTURAS[fase], c = cadera(enCara(hy) - 6, hy + 20, S);
    x = c.x - caeT * 40; y = c.y + caeT * (fase === 2 ? 70 : 200);
    cuerpo = <Escalador x={x} y={y} quien="joe" pose="escalando" poseB="cayendo" t={caeT} s={S} cara={caeT > 0.2 ? "dolor" : "esfuerzo"} frontal={fase > 0} />;
  } else {
    x = 520; y = SUELO - 70 * S;
    cuerpo = <Escalador x={x} y={y} quien="joe" pose="sentadoSuelo" s={S} cara="cerrados" frontal sombra={SUELO + 4} />;
  }
  const ch = fase === 0 ? 1010 : 1290, rx = borde(ch) + 10, ry = ch + 50;
  return (
    <Camara d={d} empuje={0.03} foco="50% 60%">
      <Svg>
        <Cielo h={h} id="peo" />
        <Zoom s={1.15} cx={560} cy={1200} tx={540} ty={900}>
          <g transform={`translate(${fase < 3 ? golpe(fl, tCae + 7, 8) : 0} 0)`}>
            <Pared h={h} marcas={8} />
            <Suelo h={h} />
            <Cuerda d={fase < 3 ? `M${bx + 70 * bS} ${by - 150 * bS} L${rx} ${ry} L${x} ${y}` : `M${bx + 70 * bS} ${by - 150 * bS} Q${(bx + x) / 2} ${SUELO} ${x} ${y}`} />
            <Escalador x={bx} y={by} quien="simon" pose="pie" s={bS} sombra={SUELO + 4} cara={fase >= 2 ? "cerrados" : "normal"} frontal={fase > 1}
              angulos={{ brazoA: [125, 150], brazoB: [40, 100], cabeza: fase >= 2 ? 10 : -30 }} />
            {cuerpo}
          </g>
        </Zoom>
      </Svg>
      <Pegues n={15 + fase} />
    </Camara>
  );
};
