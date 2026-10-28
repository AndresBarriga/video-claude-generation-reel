// 4 · «Está regalado.» (Lucía en el pad, a media tarde, tranquila) → llevas cuarenta minutos en el pad (mismo plano: cae el sol, 40 MIN, sigue ahí).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Dato, Fondo, Lucia, Partida, Svg, Zoom, clamp, sentado, type P } from "./comun";

export const Regalado: React.FC<P> = (p) => <Partida p={p} dice={(d) => <Plano d={d} />} significa={(d) => <Plano d={d} real />} />;

const Plano: React.FC<{ d: number; real?: boolean }> = ({ d, real }) => {
  const f = useCurrentFrame();
  const h = real ? interpolate(f, [0, 10], [0.35, 0.82], clamp) : 0.3;
  const min = real ? Math.round(interpolate(f, [0, 10], [0, 40], clamp)) : 0;
  return (
    <Camara d={d} empuje={0.04} entrada={!real}>
      <Svg><Zoom s={1.7} cx={420} cy={1180} tx={540} ty={1050}>
        <Fondo h={h} id={real ? "reg1" : "reg0"} hundido={real ? 0.6 : 0} />
        <Lucia x={360} y={sentado()} pose={real ? "lijando" : "sentadoSuelo"} cara={real ? "cerrados" : "alivio"} angulos={real ? undefined : { brazoA: [150, 160], cabeza: -16 }} />
      </Zoom></Svg>
      {real && <Dato texto={`${min} MIN`} />}
    </Camara>
  );
};
