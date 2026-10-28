// Gancho (pegue 23 de noche, los colegas se van), rebobinado (≤1 s) al pegue 9, el 23 otra vez y el cierre en bucle.
import React from "react";
import { Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Mano, Polvo } from "../../piezas/Mano";
import { AG, Alta, TU, Barba, Camara, Etiqueta, Fondo, Pegues, Svg, Tu, Zoom, clamp, colgado, dePie, sentado, type P } from "./comun";

const peg = (e: P["e"]) => (e as any).pegue as number;

/** Plano del gancho: tú sentado en la salida; Barba alumbra con el móvil y lleva el pad a la espalda; Alta se va. */
export const PlanoNoche: React.FC<{ d: number; empuje: number; tVenga?: number; vaAlta?: boolean; pegue: number; titulo?: string; desde?: number; sinRotulos?: boolean }> = ({ d, empuje, tVenga = 0, vaAlta = true, pegue, titulo, desde = 0, sinRotulos }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const z = spring({ frame: f - tVenga, fps, config: { damping: 30, stiffness: 60 } }) * empuje;
  const ax = vaAlta ? interpolate(f, [0, d], [100, -90]) : 100;
  const paso = Math.sin(f / 4) * 14;
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Zoom s={1 + z * 0.45} cx={400} cy={1180} tx={460} ty={1100 - z * 40}>
          <Fondo h={1} id={`n${pegue}`} pads={1} />
          <Alta x={ax} y={dePie(1.3)} mira={-1} pose="cargando" pad cara="cerrados" angulos={{ piernaA: [paso, 0], piernaB: [-paso, 0] }} />
          <Barba x={235} y={dePie()} pose="grabando" objeto="movilLuz" pad cara="cerrados" />
          <Tu x={364} y={sentado()} pose="sitStart" cara={f > tVenga ? "esfuerzo" : "normal"} angulos={f > tVenga ? undefined : { cabeza: 30 }} />
        </Zoom>
      </Svg>
      {!sinRotulos && <><Pegues n={pegue} /><Etiqueta texto={titulo} top={300} tam={86} desde={desde} /></>}
    </Camara>
  );
};

/** Acción primero (docs/viralidad.md): macro de tus manos dando la palmada de magnesio, la nube ya estallando en el fotograma 0. */
export const Palmada: React.FC<{ d: number; desdeK?: number }> = ({ d, desdeK = 5 }) => {
  const f = useCurrentFrame();
  const k = f + desdeK; // fotogramas desde la palmada (negativo = aún no)
  const sep = k < 0 ? interpolate(k, [-12, 0], [1, 0], clamp) : interpolate(k, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tiembla = k >= 0 && k < 6 ? Math.sin(k * 3) * 8 : 0;
  const mano = { piel: TU.piel, pielS: TU.pielSombra, manga: TU.chaqueta, magnesio: 0.9 };
  return (
    <Camara d={d} empuje={0.1} entrada={false}>
      <Svg>
        <rect width={1080} height={1920} fill="#0D1729" />
        <path d="M-200 300 L1300 1300 L1300 -200 Z" fill="#FFF3C4" opacity={0.07} />
        <g transform={`translate(${tiembla} 0)`}>
          <Mano {...mano} x={540 - 150 - sep * 170} y={1230} s={0.95} rot={22 - sep * 12} yemas={["esparadrapo", "fina", "fina", "normal"]} />
          <g transform="translate(1080 0) scale(-1 1)"><Mano {...mano} x={540 - 150 - sep * 170} y={1230} s={0.95} rot={22 - sep * 12} yemas={["fina", "fina", "normal", "normal"]} /></g>
          <Polvo x={540} y={1000} k={k} n={30} seed="palm" />
          <Polvo x={540} y={1060} k={k - 2} n={20} seed="palm2" />
        </g>
      </Svg>
    </Camara>
  );
};
const MACRO = 20, ROTULO = 15; // macro 0,66 s; rótulos a los 0,5 s

export const Noche: React.FC<P> = ({ e, d, pal }) => {
  const t = pal("tú:") ?? Math.round(d * 0.55);
  return (<>
    <Sequence durationInFrames={MACRO}><Palmada d={MACRO} /></Sequence>
    <Sequence from={MACRO}><PlanoNoche d={d - MACRO} empuje={1} tVenga={t - MACRO} pegue={peg(e)} sinRotulos /></Sequence>
    <Sequence from={ROTULO}><Pegues n={peg(e)} /><Etiqueta texto={e.titulo} top={300} tam={86} /></Sequence>
  </>);
};

/** Rebobinado de 0,8 s (la noche se vuelve día, el contador baja de 23 a 9) y, ya de día, tú confiado al pie del bloque. */
export const Rebobina: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const R = 24, k = interpolate(f, [0, R], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const n = Math.round(23 - 14 * k);
  if (f < R) return (
    <Camara d={R} empuje={0} entrada={false}>
      <Svg><g transform={`translate(${Math.sin(f * 3) * 6} 0)`}><Fondo h={1 - 0.85 * k} id="reb" pads={1 + Math.round(2 * k)} /></g>
        {[300, 820, 1260].map((y, i) => <rect key={i} x={0} y={y + ((f * 90) % 400)} width={1080} height={6} fill="#fff" opacity={0.25} />)}</Svg>
      <Pegues n={n} />
    </Camara>
  );
  return (
    <Sequence from={R}>
      <Camara d={d - R} empuje={0.05} foco="40% 60%">
        <Svg>
          <Zoom s={1.3} cx={420} cy={1150} tx={500} ty={1050}>
            <Fondo h={0.15} id="dia" pads={3} />
            <Alta x={120} y={dePie(1.3)} pose="pie" cara="normal" mira={1} />
            <Barba x={720} y={sentado()} pose="sentadoSuelo" mira={-1} cara="normal" />
            <Tu x={330} y={dePie()} pose="soplando" cara="esfuerzo" />
          </Zoom>
        </Svg>
        <Pegues n={9} />
      </Camara>
    </Sequence>
  );
};

/** El 23 otra vez: ahora colgado del paso clave, alumbrado por el móvil. */
export const Noche23: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const c = colgado(AG.crux), tiembla = Math.sin(f * 2.2) * 3;
  return (
    <Camara d={d} empuje={0.1} foco="35% 55%">
      <Svg>
        <Zoom s={1.5} cx={400} cy={1050} tx={480} ty={980}>
          <Fondo h={1} id="n23" pads={1} />
          <Barba x={250} y={dePie()} pose="pie" objeto="movilLuz" pad cara="normal" angulos={{ brazoA: [70, 115], cabeza: -24 }} />
          <Tu x={c.x + tiembla} y={c.y} pose="escalando" cara="esfuerzo" angulos={{ cabeza: -30, piernaA: [70 + tiembla, -20] }} />
        </Zoom>
      </Svg>
      <Pegues n={peg(e)} />
    </Camara>
  );
};

/** Cierre: «¿Otro, para el vídeo?» y vuelta al plano del gancho con el pegue 24. */
export const Cierre: React.FC<P> = ({ e, d }) => {
  const corte = Math.round(d * 0.4);
  return (<>
    <Sequence durationInFrames={corte}>
      <Camara d={corte} empuje={0.06}>
        <Svg><Zoom s={2.3} cx={260} cy={1050} tx={540} ty={1000}>
          <Fondo h={1} id="cie" pads={1} />
          <Barba x={260} y={dePie()} pose="senalando" pad cara="normal" angulos={{ brazoA: [110, 120], cabeza: -6 }} />
        </Zoom></Svg>
        <Etiqueta texto="«¿Otro, para el vídeo?»" top={300} tam={80} />
      </Camara>
    </Sequence>
    <Sequence from={corte} durationInFrames={d - corte - 12}><PlanoNoche d={d - corte - 12} empuje={0} vaAlta={false} pegue={peg(e)} titulo={e.titulo} /></Sequence>
    <Sequence from={d - 12}><Palmada d={12} desdeK={-12} /></Sequence>
  </>);
};
