// 5 · Segundo gancho (28,9–35,2 s): «sueltas y a los pocos minutos te sientes bien. Pero la fuerza tarda más en volver.»
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { BLOQUES, BR, Cabeza, Camara, Chip, Cronometro, Fondo, P, PM, Rotulo, Svg, ei } from "./comun";

export const Rehook: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fSuel = pal("sueltas") ?? 25, fBien = pal("bien") ?? 80, fPero = pal("Pero") ?? 108, fVolver = pal("volver") ?? 170;
  const abre = ei(f, fSuel, fSuel + 10, 0.5, 1), bomba = ei(f, fSuel, fBien, 0.96, 0.1), calor = ei(f, fSuel, fBien + 10, 0.8, 0);
  const min = ei(f, fSuel + 10, fBien + 30, 0, 5);
  const alivio = f > fSuel + 20 && f < fPero;
  return (
    <Camara d={d} empuje={0.03} foco="52% 50%">
      <Svg>
        <Fondo />
        <Brazo {...BR} f={f} bomba={bomba} calor={calor} abre={abre} dx={ei(f, fSuel, fSuel + 16, 0, -70)} dy={ei(f, fSuel, fSuel + 18, 0, 90)} giro={ei(f, fSuel, fSuel + 18, 0, 8)} polvo={0.4} />
        <Cabeza x={170} y={470} cara={alivio ? "alivio" : f < fSuel ? "dolor" : "normal"} aro={alivio ? BLOQUES[0] : BLOQUES[3]} />
        <g opacity={ei(f, fSuel + 6, fSuel + 18, 0, 1)}><Cronometro x={800} y={1170} r={86} min={min} col={BLOQUES[1]} /></g>
        <Chip x={800} y={1318} t="5 MIN" o={ei(f, fBien - 16, fBien - 6, 0, 1)} />
        {f > fPero - 6 && <Rotulo f={f} ini={fPero - 6} t="¿Y LA FUERZA?" y={250} tam={104} col={PM.hielo} />}
      </Svg>
    </Camara>
  );
};
