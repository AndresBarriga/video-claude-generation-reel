// Gancho (pegue 23, de noche), los colegas se van, rebobinado 23→9 y la vuelta al 23.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Mano, Polvo, Regleta } from "../../piezas/Mano";
import { PantallaMovil } from "../../piezas/Movil";
import { Alta, Barba, Camara, Colegas, Fondo, Hud, Planos, Svg, TU, Tu, Zoom, clamp, colgado, AG, datosE, dePie, sentado, type P } from "./comun";

const pielTu = { piel: TU.piel, pielS: TU.pielSombra, manga: TU.chaqueta };
export const HORA: Record<number, number> = { 9: 0.15, 12: 0.3, 14: 0.42, 15: 0.5, 19: 0.68, 21: 0.76, 22: 0.86, 23: 1 };

/** Macro: tu mano estirándose al último canto, de noche, a la luz del móvil. Ya en movimiento en el fotograma 0. */
export const Alcance: React.FC<{ d: number; agarra?: number; tiembla?: number }> = ({ d, agarra = 0.75, tiembla = 0 }) => {
  const f = useCurrentFrame(), tA = Math.round(d * agarra);
  const k = interpolate(f, [0, tA], [0.35, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const t = tiembla ? Math.sin(f * 2.4) * tiembla : 0;
  return (
    <Camara d={d} empuje={0.08} entrada={false} foco="50% 35%">
      <Svg>
        <Regleta y={600} roca="#323A4A" rocaS="#1D2431" magnesio={0.9} />
        <path d="M-300 1900 L700 300 L1300 900 Z" fill="#FFF3C4" opacity={0.1} />
        <g transform={`translate(${t} 0)`}>
          <Mano {...pielTu} x={560 - (1 - k) * 80} y={interpolate(k, [0, 1], [1480, 900])} rot={-8 + (1 - k) * 14} s={1.5} cierra={f >= tA ? 0.45 : 0.1} magnesio={0.8} yemas={["esparadrapo", "lijada", "fina", "normal"]} />
        </g>
        <Polvo x={540} y={600} k={f - tA} n={22} seed="alc" escala={1.4} />
      </Svg>
    </Camara>
  );
};

export const Alcanza: React.FC<P> = ({ e, d }) => {
  const x = datosE(e);
  return (<>
    <Planos d={d} cortes={[Math.round(d * 0.6)]}>
      <Alcance d={Math.round(d * 0.6)} />
      <PrimerPlanoTu d={d - Math.round(d * 0.6)} />
    </Planos>
    <Hud pegue={x.pegue} bat={x.bat} titulo="ÚLTIMO DÍA · ALBARRACÍN" tam={54} desde={15} />
  </>);
};

/** Tu cara con el frontal, colgado del paso, de noche. */
const PrimerPlanoTu: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), c = colgado(AG.crux), t = Math.sin(f * 2.2) * 2.5;
  return (
    <Camara d={d} empuje={0.1} foco="35% 45%">
      <Svg><Zoom s={2.6} cx={c.x + 20} cy={c.y - 150} tx={540} ty={900}>
        <Fondo h={1} id="ppt" pads={1} />
        <Tu x={c.x + t} y={c.y} pose="escalando" frontal cara="esfuerzo" angulos={{ cabeza: -30 }} />
      </Zoom></Svg>
    </Camara>
  );
};

/** «Tus colegas ya lo han encadenado.» Se van con los pads; el del móvil se queda; tu batería al 1 %. */
export const SeVan: React.FC<P> = ({ e, d, pal }) => {
  const x = datosE(e), c1 = (pal("coche") ?? Math.round(d * 0.5)) - 4, c2 = Math.min(d - 30, c1 + 50);
  return (<>
    <Planos d={d} cortes={[c1, c2]}>
      <PlanoSeVan d={c1} />
      <MovilEnMano d={c2 - c1} pct={1} />
      <PrimerPlanoTu d={d - c2} />
    </Planos>
    <Hud pegue={x.pegue} bat={x.bat} />
  </>);
};
const PlanoSeVan: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.04}>
      <Svg><Zoom s={1.25} cx={420} cy={1150} tx={520} ty={1060}>
        <Fondo h={1} id="sev" pads={1} />
        <Alta x={150 - f * 4} y={dePie(1.3)} pose="cargando" pad mira={-1} cara="alivio" angulos={{ piernaA: [Math.sin(f / 4) * 14, 0], piernaB: [-Math.sin(f / 4) * 14, 0] }} />
        <Barba x={720} y={dePie()} pose="grabando" objeto="movilLuz" pad mira={-1} cara="cerrados" />
        <Tu x={364} y={sentado()} pose="sitStart" frontal cara="esfuerzo" />
      </Zoom></Svg>
    </Camara>
  );
};
/** Primer plano del móvil del colega: grabando, batería en rojo. */
export const MovilEnMano: React.FC<{ d: number; pct: number }> = ({ d, pct }) => (
  <Camara d={d} empuje={0.08}>
    <Svg>
      <rect width={1080} height={1920} fill="#0B1220" />
      <PantallaMovil id="mem" x={540} y={1080} s={1.25} rot={-6} pct={pct}>
        <g transform="scale(0.5185)"><Zoom s={2.2} cx={380} cy={1180} tx={540} ty={1150}><Fondo h={1} id="memf" pads={1} /><Tu x={364} y={sentado()} pose="sitStart" frontal cara="esfuerzo" /></Zoom></g>
      </PantallaMovil>
    </Svg>
  </Camara>
);

/** Rebobinado de 0,8 s: noche → día, 23 → 9, batería 1 → 40. Luego, de día, empiezas confiado. */
export const Rebobina: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), R = 24;
  const k = interpolate(f, [0, R], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (<>
    <Planos d={d} cortes={[R]}>
      <Camara d={R} empuje={0} entrada={false}>
        <Svg><g transform={`translate(${Math.sin(f * 3) * 6} 0)`}><Fondo h={1 - 0.85 * k} id="reb" pads={1 + Math.round(2 * k)} />
          <Tu x={364} y={sentado()} pose="sitStart" cara="esfuerzo" /></g>
          {[300, 820, 1260].map((y, i) => <rect key={i} x={0} y={(y + f * 90) % 1920} width={1080} height={6} fill="#fff" opacity={0.3} />)}
          <text x={80} y={1700} fill="#fff" fontSize={90} fontWeight={800} opacity={0.8}>◀◀</text></Svg>
      </Camara>
      <PlanoDia d={d - R} />
    </Planos>
    <Hud pegue={Math.round(23 - 14 * k)} bat={Math.round(1 + 39 * k)} />
  </>);
};
const PlanoDia: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.05} foco="40% 60%">
      <Svg><Zoom s={1.3} cx={420} cy={1150} tx={500} ty={1050}>
        <Fondo h={0.15} id="dia" pads={3} />
        <Colegas m="animan" f={f} xA={130} xB={760} />
        <Tu x={340} y={dePie()} pose="soplando" cara="alivio" />
      </Zoom></Svg>
    </Camara>
  );
};

/** El 23: vuelve el plano del gancho, más lento y con temblor (pausa antes del clímax). */
export const Alcanza23: React.FC<P> = ({ e, d }) => {
  const x = datosE(e);
  return (<>
    <Alcance d={d} agarra={0.92} tiembla={3} />
    <Hud pegue={x.pegue} bat={x.bat} />
  </>);
};
export const _r = random;
