// Gancho y cierre: el avión estrellado en el lago nevado con fardos; un hippie asoma por abajo con los ojos como platos.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Nieve, Pieza, Pj, Svg, type P } from "./comun";

export const PlanoAvion: React.FC<{ d: number; titulo?: string }> = ({ d, titulo }) => {
  const f = useCurrentFrame();
  const asoma = interpolate(f, [4, 18], [260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.06} foco="55% 45%">
      <Svg>
        <rect width={1080} height={1920} fill="#BFD6E4" />
        <Pieza nombre="avion" x={-250} y={560} alto={900} />
        <rect y={1480} width={1080} height={440} fill="#EEF2F2" />
        <Pj q="flaco" cx={230} suelo={2000 + asoma} alto={820} cara="platos" rot={{ cabeza: 8, brazo_superior_der: -40, antebrazo_der: -60 }} />
      </Svg>
      <Nieve />
      <Etiqueta texto={titulo} top={260} tam={110} desde={6} />
    </Camara>
  );
};
export const Avion: React.FC<P> = ({ d }) => <PlanoAvion d={d} />;
export const Cierre: React.FC<P> = ({ d, e }) => <PlanoAvion d={d} titulo={e.titulo} />;
