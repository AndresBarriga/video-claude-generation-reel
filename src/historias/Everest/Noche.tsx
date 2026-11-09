// 2 · La noche antes: sus sherpas intentan reanimarlo; lo dan por muerto y se van (sus frontales se alejan). Luego, solo toda la noche: reloj de 12 horas.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Etiqueta, HALL, Nieve, SHERPAS, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CABEZA, CADERA, Hueco, Sentado, Vaho } from "./Piezas";

export const Noche: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tM = (pal("muerto") ?? Math.round(d * 0.45)) - 4, tS = (pal("paso") ?? Math.round(d * 0.75)) - 4;
  const va = sube(f, tM + 6, tS);
  const horas = interpolate(f, [tS, d], [19.5, 31.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hh = Math.floor(horas) % 24, mm = Math.floor((horas % 1) * 60);
  const sherpa = (i: number) => {
    const kneel = f < tM;
    const x = CADERA.x + 250 + i * 170 + va * (420 + i * 80), y = CADERA.y - 0.16 * (x - CADERA.x - 40);
    return <Escalador key={i} x={x} y={kneel ? y - 60 * 2.2 : y - 130 * 2.2} quien="joe" aspecto={SHERPAS[i]} s={2.2} pose={kneel ? "agachado" : "pie"} cara="serio" frontal mira={-1} angulos={kneel ? { brazoA: [70, 100] } : { cabeza: va > 0.1 ? -6 : 12 }} />;
  };
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <Zoom s={1.0} cx={CADERA.x + 100} cy={CADERA.y - 180} tx={540} ty={1000}>
          <Arista luz={0} f={f} />
          <Sentado aspecto={HALL} cabeza={34} cara="cerrados" />
          {f >= tS && <Vaho f={f} x={CABEZA.x - 30} y={CABEZA.y + 30} on={0.6} />}
          {va < 0.98 && [0, 1].map(sherpa)}
          <Nieve f={f} n={40} op={0.6} />
        </Zoom>
        <Hueco x={480} y={900} r={900 - 300 * sube(f, tS, d)} id="no" base={0.75} />
        {f >= tS && <g>
          <text x={540} y={560} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={150} fill="#fff" stroke="#05040C" strokeWidth={20} paintOrder="stroke">{`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`}</text>
          <text x={540} y={630} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={48} fill="#FFB36B" stroke="#05040C" strokeWidth={10} paintOrder="stroke">SOLO · SIN OXÍGENO</text>
        </g>}
      </Svg>
      {f < tM && <Etiqueta texto="MAYO 2006 · LA NOCHE ANTES" top={230} tam={70} desde={2} />}
      {f >= tM && f < tS && <Etiqueta texto="DADO POR MUERTO" top={230} tam={100} desde={tM} />}
    </Camara>
  );
};
