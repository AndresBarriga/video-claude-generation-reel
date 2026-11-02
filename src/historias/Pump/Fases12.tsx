// 2 · Fases 1 y 2 (6,7–12,1 s): «ni lo notas» y «el antebrazo se calienta».
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { BR, Cabeza, Camara, Fondo, P, Rotulo, Svg, BLOQUES, ei, mundo } from "./comun";

export const Fases12: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fDos = pal("dos") ?? 78, fCal = pal("calienta") ?? 118;
  const caliente = ei(f, fDos + 4, fCal + 10, 0, 1);
  const bomba = ei(f, fDos + 4, fCal + 10, 0.02, 0.32);
  const [hx, hy] = mundo(-20, -150);
  return (
    <Camara d={d} empuje={0.03} foco="55% 50%">
      <Svg>
        <Fondo />
        <Brazo {...BR} f={f} bomba={bomba} calor={caliente * 0.7} dy={Math.sin(f * 0.12) * 3} polvo={0.5} />
        {caliente > 0.05 && [0, 1, 2].map((i) => (
          <path key={i} d={`M${hx + 40 + i * 120} ${hy - 20 - i * 28} q18 -26 0 -52 q-18 -26 0 -52`} stroke="#FF8A4A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={caliente * (0.55 + 0.25 * Math.sin(f * 0.3 + i))} transform={`translate(0 ${-Math.abs(Math.sin(f * 0.1 + i)) * 12})`} />
        ))}
        <Cabeza x={170} y={470} cara={f < fDos ? "normal" : "calor"} aro={BLOQUES[f < fDos ? 0 : 1]} />
        <Rotulo f={f} ini={0} fin={fDos - 3} t="FASE 1" y={250} tam={128} col={BLOQUES[0]} />
        <Rotulo f={f} ini={fDos - 2} t="FASE 2" y={250} tam={128} col={BLOQUES[1]} />
      </Svg>
    </Camara>
  );
};
