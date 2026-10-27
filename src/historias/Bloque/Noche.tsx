// Gancho (pegue 23 de noche, los colegas se van), rebobinado (≤1 s) al pegue 9, el 23 otra vez y el cierre en bucle.
import React from "react";
import { Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AG, Alta, Barba, Camara, Etiqueta, Fondo, Pegues, Svg, Tu, Zoom, clamp, colgado, dePie, sentado, type P } from "./comun";

const peg = (e: P["e"]) => (e as any).pegue as number;

/** Plano del gancho: tú sentado en la salida; Barba alumbra con el móvil y lleva el pad a la espalda; Alta se va. */
export const PlanoNoche: React.FC<{ d: number; empuje: number; tVenga?: number; vaAlta?: boolean; pegue: number; titulo?: string; desde?: number }> = ({ d, empuje, tVenga = 0, vaAlta = true, pegue, titulo, desde = 0 }) => {
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
      <Pegues n={pegue} />
      <Etiqueta texto={titulo} top={300} tam={86} desde={desde} />
    </Camara>
  );
};

export const Noche: React.FC<P> = ({ e, d, pal }) => {
  const t = pal("tú:") ?? Math.round(d * 0.55);
  return <PlanoNoche d={d} empuje={1} tVenga={t} pegue={peg(e)} titulo={useCurrentFrame() >= (pal("venga,") ?? t) ? e.titulo : undefined} desde={pal("venga,") ?? t} />;
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
    <Sequence from={corte}><PlanoNoche d={d - corte} empuje={0} vaAlta={false} pegue={peg(e)} titulo={e.titulo} /></Sequence>
  </>);
};
