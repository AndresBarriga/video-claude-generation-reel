// La escalada de excusas (pegues 9 → 22): cada una con su detalle de piel o de sesión. Planos variados: medio, macro, general.
import React from "react";
import { Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Mano, Polvo, Regleta } from "../../piezas/Mano";
import { AG, Alta, Barba, Camara, Etiqueta, Fondo, Pegues, Svg, TOP, TU, Tu, Zoom, clamp, colgado, dePie, golpe, sentado, type P } from "./comun";

const peg = (e: P["e"]) => (e as any).pegue as number;
const Rotulos: React.FC<{ e: P["e"] }> = ({ e }) => <><Pegues n={peg(e)} /><Etiqueta texto={e.titulo} top={300} tam={80} /></>;
const ManoTu = (p: React.ComponentProps<typeof Mano>) => <Mano piel={TU.piel} pielS={TU.pielSombra} manga={TU.chaqueta} {...p} />;

/** 9 · «El último»: se sopla los dedos (medio) → cepilla la regleta (macro) → cae al pad en el mismo paso. */
export const Cepillo: React.FC<P> = ({ e, d, pal }) => {
  const tC = pal("cepillas") ?? Math.round(d * 0.4), tM = pal("mismo") ?? Math.round(d * 0.75);
  return (<>
    <Sequence durationInFrames={tC}><Sopla d={tC} /></Sequence>
    <Sequence from={tC} durationInFrames={tM - tC}><Cepilla /></Sequence>
    <Sequence from={tM}><Cae d={d - tM} /></Sequence>
    <Rotulos e={e} />
  </>);
};
const Sopla: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  return (
    <Camara d={d} empuje={0.08} foco="40% 50%">
      <Svg><Zoom s={2.4} cx={330} cy={1000} tx={520} ty={960}>
        <Fondo h={0.15} id="sop" />
        <Tu x={330} y={dePie()} pose="soplando" cara="cerrados" />
        <Polvo x={385} y={1000} k={f % 18} seed="so" n={10} />
      </Zoom></Svg>
    </Camara>
  );
};
const Cepilla: React.FC = () => {
  const f = useCurrentFrame(), x = 440 + Math.sin(f / 2.2) * 160;
  return (
    <Svg>
      <Regleta y={1150} magnesio={0.8} />
      <g transform={`translate(${x} 1070) rotate(-8) scale(5)`}><rect x={-60} y={-6} width={60} height={12} rx={6} fill="#C9A06A" /><rect x={0} y={-12} width={26} height={24} rx={4} fill="#2B3442" />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={2 + k * 5} y={12} width={3} height={8} fill="#1B2230" />)}</g>
      <Polvo x={x + 90} y={1140} k={f % 14} seed="ce" n={12} />
    </Svg>
  );
};
const Cae: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const c = colgado(AG.medio), k = interpolate(f, [2, 11], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const y = interpolate(k, [0, 1], [c.y, sentado()]), x = interpolate(k, [0, 1], [c.x, 330]);
  return (
    <Camara d={d} empuje={0.03} sacudida={0}>
      <Svg><Zoom s={1.45} cx={380} cy={1120} tx={500} ty={1020}><g transform={`translate(${golpe(f, 11, 10)} 0)`}>
        <Fondo h={0.15} id="cae" hundido={k >= 1 ? Math.max(0, 1 - (f - 11) / 10) : 0} />
        <Barba x={720} y={sentado()} pose="sentadoSuelo" mira={-1} cara={k >= 1 ? "cerrados" : "normal"} />
        <Tu x={x} y={y} pose={k >= 1 ? "sentadoSuelo" : "escalando"} poseB={k >= 1 ? undefined : "cayendo"} t={k} cara={k > 0.2 ? "dolor" : "esfuerzo"} />
        {k >= 1 && <Polvo x={330} y={1300} k={f - 11} seed="ca" />}
      </g></Zoom></Svg>
    </Camara>
  );
};

/** 12 · «Solo para mirar los pies»: macro, el esparadrapo se enrolla en el índice. */
export const Cinta: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [4, d * 0.8], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <Camara d={d} empuje={0.06} foco="45% 45%">
      <Svg>
        <rect width={1080} height={1920} fill="#3A4656" />
        <ManoTu x={560} y={1060} s={1.45} rot={-6} yemas={["esparadrapo", "fina", "normal", "normal"]} cinta={k} magnesio={0.5} />
        <path d={`M${560 - 111 * 1.45 + 60} ${1060 - 330 + k * 40} L1200 ${600 - k * 80}`} stroke="#F4F6F8" strokeWidth={34} strokeLinecap="round" opacity={k < 1 ? 1 : 0} />
      </Svg>
      <Rotulos e={e} />
    </Camara>
  );
};

/** 15 · «Desde el paso, que no cuenta»: sale desde el paso clave, sale arriba; los colegas lo celebran. */
export const DesdePaso: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), tS = pal("sale.") ?? Math.round(d * 0.5);
  const k = interpolate(f, [tS - 14, tS], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const a = colgado(AG.crux), b = colgado(AG.labio), arriba = f > tS + 4;
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg><Zoom s={0.95} cx={540} cy={1100} tx={540} ty={1250}>
        <Fondo h={0.45} id="dpa" />
        <Barba x={760} y={sentado()} pose={arriba ? "celebrando" : "sentadoSuelo"} mira={-1} cara={arriba ? "alivio" : "normal"} />
        <Alta x={140} y={dePie(1.3)} pose={arriba ? "celebrando" : "pie"} cara={arriba ? "alivio" : "normal"} />
        {arriba ? <Tu x={640} y={TOP - 4 - 136 * 1.2} pose="celebrando" cara="alivio" sombra={TOP - 2} />
          : <Tu x={a.x + (b.x - a.x) * k} y={a.y + (b.y - a.y) * k} pose="escalando" cara="esfuerzo" />}
      </Zoom></Svg>
      <Rotulos e={e} />
    </Camara>
  );
};

/** 19 · «Ya estoy caliente»: sit start, primer movimiento… y macro: se abre el flapper. */
export const Flapper: React.FC<P> = ({ e, d, pal }) => {
  const tA = (pal("abre") ?? Math.round(d * 0.55)) - 6;
  return (<>
    <Sequence durationInFrames={tA}><SitStart d={tA} /></Sequence>
    <Sequence from={tA}><AbreFlapper d={d - tA} /></Sequence>
    <Rotulos e={e} />
  </>);
};
const SitStart: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [d * 0.5, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const c = colgado(AG.medio);
  return (
    <Camara d={d} empuje={0.08} foco="35% 60%">
      <Svg><Zoom s={1.9} cx={380} cy={1150} tx={540} ty={1000}>
        <Fondo h={0.6} id="sit" />
        <Tu x={364 + (c.x - 364) * k} y={sentado() + (c.y - sentado()) * k} pose="sitStart" poseB="escalando" t={k} cara="esfuerzo" />
      </Zoom></Svg>
    </Camara>
  );
};
const AbreFlapper: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [3, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <Camara d={d} empuje={0.1} sacudida={f < 10 ? 3 : 0} foco="40% 40%">
      <Svg>
        <rect width={1080} height={1920} fill="#4A3E46" />
        <ManoTu x={560} y={1080} s={1.5} rot={4} yemas={["flapper", "fina", "fina", "normal"]} abre={k} magnesio={0.6} />
      </Svg>
    </Camara>
  );
};

/** 22: lija, crema y el colega grabando «por si acaso». */
export const Lija: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const tCr = pal("crema,") ?? Math.round(d * 0.35), tG = pal("grabando") ?? Math.round(d * 0.6);
  const frota = Math.sin(f / 2) * 12;
  return (
    <Camara d={d} empuje={0.05} foco="45% 55%">
      <Svg><Zoom s={1.7} cx={420} cy={1150} tx={520} ty={1000}>
        <Fondo h={0.75} id="lij" />
        <Alta x={110} y={dePie(1.3)} pose="cargando" pad cara="cerrados" />
        <Barba x={560} y={dePie()} pose={f >= tG ? "grabando" : "pie"} objeto={f >= tG ? "movil" : undefined} mira={-1} cara="normal" />
        <Tu x={330} y={sentado()} pose="lijando" objeto={f >= tCr ? "crema" : "lija"} cara="esfuerzo" angulos={{ brazoA: [70 + frota * 0.4, 118] }} />
      </Zoom></Svg>
      <Pegues n={peg(e)} />
    </Camara>
  );
};
