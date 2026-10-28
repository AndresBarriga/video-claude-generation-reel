// 19 → 22: el cuerpo se rompe mientras tú estás cada vez más seguro. Flapper, la bomba, lija + crema con los colegas recogiendo.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Antebrazo } from "../../piezas/Mano";
import { POSES } from "../../piezas/Escalador";
import { AG, PresaPie, trepa, Camara, Colegas, Fondo, Hud, Planos, Svg, TU, Tu, Zoom, clamp, colgado, datosE, sentado, type P } from "./comun";
import { HORA } from "./Gancho";
import { YemaPlano } from "./Excusas";

/** 19 · «Ya estoy caliente»: sit start → la yema se abre (flapper). */
export const Flapper: React.FC<P> = ({ e, d }) => {
  const x = datosE(e), c1 = Math.round(d * 0.42);
  return (<>
    <Planos d={d} cortes={[c1]}>
      <SitStart d={c1} h={HORA[19]} />
      <YemaPlano d={d - c1} estado="flapper" fondo="#4A3E46" anim />
    </Planos>
    <Hud {...x} />
  </>);
};
const SitStart: React.FC<{ d: number; h: number }> = ({ d, h }) => {
  const f = useCurrentFrame(), k = interpolate(f, [d * 0.3, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const c = colgado(AG.medio);
  return (
    <Camara d={d} empuje={0.08} foco="35% 60%">
      <Svg><Zoom s={2} cx={380} cy={1150} tx={540} ty={1000}>
        <Fondo h={h} id="sit" />
        {(() => {
          // las piernas pasan de la postura sentada a los pies en la pared (sin quedarse colgando en el aire)
          const hx = 364 + (c.x - 364) * k, hy = sentado() + (c.y - sentado()) * k, tr = trepa(c.x, c.y).angulos, sp = POSES.sitStart;
          const L = (a: [number, number], b: [number, number]): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
          return <>{k > 0.6 && trepa(c.x, c.y).pies.map((p, i) => <PresaPie key={i} x={p.x} y={p.y + 8} />)}
            <Tu x={hx} y={hy} pose="sitStart" poseB="escalando" t={k} cara="esfuerzo" angulos={{ piernaA: L(sp.piernaA as [number, number], tr.piernaA), piernaB: L(sp.piernaB as [number, number], tr.piernaB) }} /></>;
        })()}
      </Zoom></Svg>
    </Camara>
  );
};

/** 21 · «Mejor con la bomba»: antebrazo hinchado con venas → sacudes el brazo; los colegas, tumbados en el pad. */
export const BombaPlano: React.FC<P> = ({ e, d }) => {
  const x = datosE(e), c1 = Math.round(d * 0.5);
  return (<>
    <Planos d={d} cortes={[c1]}>
      <Bomba d={c1} />
      <Sacude d={d - c1} h={HORA[21]} />
    </Planos>
    <Hud {...x} />
  </>);
};
const Bomba: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), b = interpolate(f, [0, d * 0.6], [0.3, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <Camara d={d} empuje={0.08} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#5A4A52" />
        <Antebrazo piel={TU.piel} pielS={TU.pielSombra} manga={TU.chaqueta} x={330} y={960} s={0.8} bomba={b} latido={Math.max(0, Math.sin(f / 3))} />
      </Svg>
    </Camara>
  );
};
const Sacude: React.FC<{ d: number; h: number }> = ({ d, h }) => {
  const f = useCurrentFrame(), sac = Math.sin(f * 1.6) * 30;
  return (
    <Camara d={d} empuje={0.05} foco="45% 60%">
      <Svg><Zoom s={1.45} cx={440} cy={1180} tx={520} ty={1060}>
        <Fondo h={h} id="sac" />
        <Colegas m="sentados" f={f} />
        <Tu x={420} y={sentado()} pose="sentadoSuelo" cara="esfuerzo" angulos={{ brazoA: [40 + sac, 20 + sac], cabeza: -10 }} />
      </Zoom></Svg>
    </Camara>
  );
};

/** 22 · «El de despedida»: lija y crema en un solo plano; detrás, los colegas recogiendo los pads. */
export const Recogen: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), x = datosE(e), tC = Math.round(d * 0.5);
  const frota = Math.sin(f / 2) * 12;
  return (<>
    <Camara d={d} empuje={0.06} foco="40% 55%">
      <Svg><Zoom s={1.7} cx={420} cy={1150} tx={520} ty={1000}>
        <Fondo h={HORA[22]} id="rec" pads={1} />
        <Colegas m="recogen" f={f} movil="movil" xA={110} xB={700} />
        <Tu x={330} y={sentado()} pose="lijando" objeto={f >= tC ? "crema" : "lija"} cara="esfuerzo" angulos={{ brazoA: [70 + frota * 0.4, 118] }} />
      </Zoom></Svg>
    </Camara>
    <Hud {...x} />
  </>);
};
export const _pal = (p: P) => p;
