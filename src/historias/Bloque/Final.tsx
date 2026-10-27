// «…lo encadenas.» (top out de noche, silencio) y el giro: el colega baja el móvil, «lo tengo… el 22».
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Barba, Camara, Etiqueta, Fondo, Pegues, Svg, TOP, Tu, Zoom, clamp, dePie, type P } from "./comun";

export const TopOut: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(), k = interpolate(f, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  return (
    <Camara d={d} empuje={0.04} foco="55% 40%">
      <Svg><Zoom s={1.5} cx={520} cy={900} tx={540} ty={1060}>
        <Fondo h={1} id="top" pads={1} />
        <Barba x={300} y={dePie()} pose="pie" objeto="movilLuz" pad cara="alivio" angulos={{ brazoA: [70, 115], cabeza: -30 }} />
        <Tu x={640} y={TOP - 4 - 136 * 1.2 + (1 - k) * 60} pose="pie" poseB="celebrando" t={k} cara="alivio" sombra={TOP - 2} />
      </Zoom></Svg>
      <Pegues n={(e as any).pegue} />
    </Camara>
  );
};

export const Movil: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), tB = pal("baja") ?? 6;
  const k = interpolate(f, [tB, tB + 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Camara d={d} empuje={0.08} foco="45% 45%">
      <Svg><Zoom s={2.8} cx={200} cy={1040} tx={540} ty={1020}>
        <Fondo h={1} id="mov" pads={1} />
        <Barba x={200} y={dePie()} pose="grabando" poseB="pie" t={k} objeto="movilLuz" pad cara={k > 0.5 ? "miedo" : "alivio"} angulos={{ cabeza: k * 14 }} />
      </Zoom></Svg>
      <Etiqueta texto={f >= (pal("lo") ?? d * 0.4) ? e.titulo : undefined} top={300} tam={84} desde={pal("lo") ?? 0} />
    </Camara>
  );
};
