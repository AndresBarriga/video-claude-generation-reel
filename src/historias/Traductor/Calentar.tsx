// 1 · «Esto es para calentar.» → Traducción: tu máximo del año. También el plano del bucle (cierre y pantalla del móvil).
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Polvo } from "../../piezas/Mano";
import { AG, Camara, Etiqueta, Fondo, LuciaColgada, Nico, Paco, Partida, Svg, Zoom, colgado, dePie, type P } from "./comun";

const H = colgado(AG.crux);

/** El plano de Lucía colgada. real = tiembla, polvo y colegas gritando. id único por uso (gradientes). */
export const PlanoCalentar: React.FC<{ f: number; real?: boolean; id: string; s?: number }> = ({ f, real, id, s = 1.55 }) => {
  const tiembla = real ? Math.sin(f * 2.2) * 5 + (random(`t${f}`) - 0.5) * 4 : 0;
  const bote = real ? Math.abs(Math.sin(f / 3.5)) * 16 : 0;
  return (
    <Zoom s={s} cx={H.x + 40} cy={H.y - 60} tx={540} ty={real ? 860 : 900}>
      <Fondo h={0.3} id={id} />
      {real && <>
        <Paco x={130} y={dePie(1.25) - bote} pose="celebrando" cara="miedo" />
        <Nico x={760} y={dePie() - bote * 0.7} pose="celebrando" mira={-1} cara="esfuerzo" />
      </>}
      <LuciaColgada hx={H.x} hy={H.y} cara={real ? "esfuerzo" : "normal"} tiembla={tiembla} cabeza={real ? -34 : -10} />
      {real && <Polvo x={AG.crux[0]} y={AG.crux[1]} k={f % 24} n={14} seed="cal" />}
    </Zoom>
  );
};

export const Calentar: React.FC<P> = (p) => (
  <Partida p={p} pildora={false}
    dice={(d) => <Dice d={d} />}
    significa={(d) => <Sig d={d} />} />
);
const Dice: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.04} entrada={false}><Svg><PlanoCalentar f={f} id="cal0" /></Svg>
    <Etiqueta texto="Escalador → Español" top={300} tam={84} desde={15} /></Camara>);
};
const Sig: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (<Camara d={d} empuje={0.06} entrada={false}><Svg><PlanoCalentar f={f} real s={1.15} id="cal1" /></Svg>
    <Etiqueta texto="Escalador → Español" top={300} tam={84} /></Camara>);
};
