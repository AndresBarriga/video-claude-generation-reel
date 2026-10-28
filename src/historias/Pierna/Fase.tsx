// Las fases 1, 2 y 4 en la pared (la 3 es el asegurador y la 5 la caída). La chapa no se ve hasta la caída: el chiste depende de eso.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Chapa as ChapaPieza, Cielo, Cuerda, Pared, Svg, borde, temblor, type P } from "./comun";
import { PlanoPared, PX, PY, X0 } from "./Plano";
import { caderaDe } from "./Tu";
import { Marcador } from "./Fases";

/** Fase 1: plano medio, cara de póker, temblorcito. */
export const Fase1: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), h = caderaDe(PX, PY, 3, 20);
  return (
    <Camara d={d} empuje={0.06} foco="50% 50%">
      <PlanoPared f={f} tr={temblor(f, 0.35)} amp={0.35} cara="normal" cabeza={20} zoom={{ s: 1.15, cx: h.x + 40, cy: h.y - 60, tx: 540, ty: 1000 }} />
      <Marcador n={1} nombre="Temblorcito" />
    </Camara>
  );
};

/** Fase 2: plano detalle de la cinta exprés repiqueteando contra la roca (sin contexto de distancia). */
export const Fase2: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), tr = temblor(f, 1.2), x0 = 640, cy = 980, cx = borde(cy, x0) + 4, Z = 6;
  return (
    <Camara d={d} empuje={0.1} foco="55% 50%" sacudida={1}>
      <Svg>
        <Cielo id="f2" />
        <g transform={`translate(${560 - cx * Z} ${900 - (cy + 30) * Z}) scale(${Z})`}>
          <Pared x0={x0} semilla="f2" />
          <ChapaPieza x={cx} y={cy} t={tr * 22} />
          <Cuerda d={`M${cx - 40 + tr * 6} ${cy - 120} Q${cx - 12 + tr * 6} ${cy + 20} ${cx} ${cy + 66} Q${cx - 14 + tr * 4} ${cy + 140} ${cx - 30} ${cy + 220}`} w={4} />
        </g>
      </Svg>
      <Marcador n={2} nombre="La cinta hace música" />
    </Camara>
  );
};

/** Fase 4: primer plano de tu cara con los ojos cerrados, rezándole a la roca; la pierna, desatada. */
export const Fase4: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), h = caderaDe(PX, PY, 3, 30);
  return (
    <Camara d={d} empuje={0.1} foco="50% 45%" sacudida={2.5}>
      <PlanoPared f={f} tr={temblor(f, 1.8)} amp={1.8} cara="cerrados" cabeza={30} zoom={{ s: 1.7, cx: h.x + 50, cy: h.y - 200, tx: 540, ty: 980 }} />
      <Marcador n={4} nombre="Promesas a la roca" />
    </Camara>
  );
};
