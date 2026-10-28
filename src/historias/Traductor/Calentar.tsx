// 1 · «Esto es para calentar.» (macro: la mano cae en la regleta, suelta, fácil) → Traducción: tu máximo del año
// (arqueo cerrado con el pulgar encima, temblando → antebrazo reventado → la cara de Lucía). PlanoCalentar(f=0) es también el último fotograma (bucle).
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Antebrazo, Polvo } from "../../piezas/Mano";
import { ManoRegleta, REGLETA } from "../../piezas/ManoRegleta";
import { RESINA, Rocodromo } from "../../piezas/Rocodromo";
import { AG, Camara, Cerca, Etiqueta, LuciaColgada, LUCIA, colgado, Partida, Planos, Svg, clamp, golpe, type P } from "./comun";

const pielL = { piel: LUCIA.piel, pielS: LUCIA.pielSombra, manga: LUCIA.chaqueta };

/** Fondo desenfocado de rocódromo para los macros. */
export const Bokeh: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#2C3748" />
    {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={random(`bk${i}`) * 1080} cy={random(`bq${i}`) * 1920} r={30 + random(`br${i}`) * 50} fill={RESINA[i % RESINA.length]} opacity={0.22} />)}
  </g>
);

/** El macro de la mano. Mano cae en la regleta (k 0.05 → 0.5) con nube de magnesio. Con f = 0 es el primer fotograma. */
export const PlanoCalentar: React.FC<{ f: number }> = ({ f }) => {
  const k = interpolate(f, [0, 5], [0.05, 0.5], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  return (
    <g transform={`translate(${golpe(f, 5, 10)} 0)`}>
      <Bokeh />
      <g transform="translate(640 880) scale(1.75) translate(-712 -912)"><ManoRegleta k={k} {...pielL} /></g>
      <Polvo x={640 + 35} y={880 - 30} k={f - 5} n={18} seed="cal" escala={1.3} />
    </g>
  );
};

export const Calentar: React.FC<P> = (p) => <Partida p={p} pildora={false} dice={(d) => <Dice d={d} />} significa={(d) => <Sig d={d} />} />;

const Dice: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.05} entrada={false} foco="66% 47%"><Svg><PlanoCalentar f={f} /></Svg>
    <Etiqueta texto="Escalador → Español" top={300} tam={84} desde={15} /></Camara>);
};

const Sig: React.FC<{ d: number }> = ({ d }) => {
  const c1 = Math.round(d * 0.42), c2 = Math.round(d * 0.7);
  return (<>
    <Planos d={d} cortes={[c1, c2]}>
      <Arqueo d={c1} />
      <Bomba d={c2 - c1} />
      <CaraLucia d={d - c2} />
    </Planos>
    <Etiqueta texto="Escalador → Español" top={300} tam={84} />
  </>);
};

const Arqueo: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 8], [0.5, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (<Camara d={d} empuje={0.12} entrada={false} foco="64% 47%"><Svg><Bokeh />
    <g transform="translate(640 880) scale(1.75) translate(-712 -912)"><ManoRegleta k={k} tiembla={Math.sin(f * 2.7) * 4 + (random(`a${f}`) - 0.5) * 3} blancos={k} {...pielL} /></g></Svg></Camara>);
};

const Bomba: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.1} entrada={false}><Svg><Bokeh />
    <g transform={`translate(${Math.sin(f * 2.4) * 3} 0)`}><Antebrazo {...pielL} x={430} y={940} s={0.95} bomba={interpolate(f, [0, 6], [0.4, 1], clamp)} latido={Math.abs(Math.sin(f / 2.5))} /></g></Svg></Camara>);
};

const CaraLucia: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), H = colgado(AG.crux);
  return (<Camara d={d} empuje={0.08} entrada={false}><Svg>
    <Cerca cx={H.x + 10} cy={H.y - 160} s={3.6}>
      <Rocodromo reloj={false} />
      <LuciaColgada hx={H.x} hy={H.y} cara="esfuerzo" cabeza={-30} tiembla={Math.sin(f * 2.6) * 2} />
    </Cerca></Svg></Camara>);
};
