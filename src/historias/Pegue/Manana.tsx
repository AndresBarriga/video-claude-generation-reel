// «Por la mañana tienes fuerza, pero no te sabes la vía»: 10:00, presas sin marcas. Duda entre dos presas, coge la que no es y cae.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Cielo, Cuerda, Etiqueta, Pared, Pegues, SUELO, Suelo, Svg, Zoom, borde, cadera, clamp, enCara, enSuelo, golpe, type P } from "./comun";

export const Manana: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const tVia = pal("vía.") ?? Math.round(d * 0.7);
  const S = 1.15, hold = 1080, c0 = cadera(enCara(hold) - 6, hold + 20, S);
  // duda: la cabeza va de una presa a otra
  const duda = f < tVia ? Math.sin(f / 7) : 0;
  const caeT = interpolate(f, [tVia, tVia + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const reb = f > tVia + 8 ? Math.sin((f - tVia - 8) / 3) * 16 * Math.exp(-(f - tVia - 8) / 10) : 0;
  const cx = c0.x - caeT * 50, cy = c0.y + caeT * 210 + reb;
  // la mano libre tantea: a la izquierda (presa falsa) y arriba (la buena)
  const tantea = interpolate(f, [0, tVia * 0.5, tVia], [0, 1, 0.4], clamp);
  const ch = 1010, rx = borde(ch) + 10, ry = ch + 50;
  const bS = 1.1, bx = 330, byy = enSuelo(bS);
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%" sacudida={0}>
      <Svg>
        <Cielo h={0.05} id="man" />
        <Zoom s={1.2} cx={560} cy={1150} tx={560} ty={900}>
          <g transform={`translate(${golpe(f, tVia + 8, 8)} 0)`}>
            <Pared h={0.05} marcas={0} />
            <Suelo h={0.05} />
            {/* presa falsa a la izquierda, mal elegida */}
            <path d={`M${borde(950) - 70} ${950} q10 -14 26 -12 q14 2 14 12 Z`} fill="#8D95A2" />
            <Cuerda d={`M${bx + 70 * bS} ${byy - 150 * bS} L${rx} ${ry} L${cx} ${cy}`} />
            <Escalador x={bx} y={byy} quien="simon" pose="pie" s={bS} sombra={SUELO + 4} cara="normal"
              angulos={{ brazoA: [125, 150], brazoB: [40, 100], cabeza: -30 }} />
            <Escalador x={cx} y={cy} quien="joe" pose="escalando" poseB="cayendo" t={caeT} s={S}
              cara={caeT > 0.2 ? "miedo" : "normal"}
              angulos={caeT > 0 ? undefined : { brazoB: [140 - tantea * 90, 150 - tantea * 60], cabeza: -20 + duda * 30 }} />
          </g>
        </Zoom>
      </Svg>
      <Pegues n={1} />
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};
