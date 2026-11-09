// 4 · La renuncia: los cuatro llegan, uno se arrodilla y le pone oxígeno; la ruta a la cima (línea naranja) se apaga y la cima sale del encuadre.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Etiqueta, HALL, MAZUR, Nieve, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CABEZA, CADERA, Sentado } from "./Piezas";

const suelo = (x: number) => CADERA.y - 0.16 * (x - CADERA.x);
export const Renuncia: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tQ = (pal("quedaron") ?? Math.round(d * 0.35)) - 4, tC = (pal("seguira") ?? Math.round(d * 0.6)) - 4;
  const ruta = 1 - sube(f, tQ, tQ + 16), cima = 1 - 0.85 * sube(f, tQ + 6, d);
  const pie = (i: number, x: number) => <Escalador key={i} x={x} y={suelo(x) - 130 * 2.5} quien="joe" aspecto={MAZUR[i]} s={2.5} pose="pie" cara="serio" mira={-1} angulos={{ cabeza: 10 + i * 4 }} />;
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <Zoom s={0.95} cx={CADERA.x + 200} cy={CADERA.y - 260} tx={540} ty={1000}>
          <Arista luz={1} f={f} cima={cima} />
          <path d={`M${CADERA.x + 200} ${suelo(CADERA.x + 200) - 10} Q900 900 760 ${300 - 700 * (1 - cima)}`} stroke="#FF6A1F" strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" fill="none" opacity={ruta} />
          {/* uno arrodillado le pone la mascarilla de oxígeno */}
          <Escalador x={CADERA.x + 300} y={suelo(CADERA.x + 300) - 60 * 2.5} quien="joe" aspecto={MAZUR[0]} s={2.5} pose="agachado" cara="serio" mira={-1} angulos={{ torso: 20, brazoA: [80, 88] }} />
          <path d={`M${CABEZA.x - 10} ${CABEZA.y + 40} Q${CADERA.x + 120} ${CADERA.y - 60} ${CADERA.x + 140} ${CADERA.y - 40}`} stroke="#3A4556" strokeWidth={8} fill="none" /><ellipse cx={CABEZA.x - 18} cy={CABEZA.y + 38} rx={22} ry={18} fill="#9AA6B2" />
          <rect x={CADERA.x + 120} y={suelo(CADERA.x + 120) - 80} width={36} height={80} rx={14} fill="#E58A1F" />
          <Sentado aspecto={HALL} cabeza={0} cara="normal" />
          {pie(1, CADERA.x + 480)}{pie(2, CADERA.x + 590)}{pie(3, CADERA.x + 700)}
          <Nieve f={f} n={20} op={0.4} />
        </Zoom>
      </Svg>
      {f < tC && <Etiqueta texto={f < tQ ? "A 2 HORAS DE LA CUMBRE" : "SE QUEDARON"} top={230} tam={84} desde={f < tQ ? 2 : tQ} />}
      {f >= tC && <Etiqueta texto="«ÉL SOLO TIENE UNA VIDA»" top={230} tam={76} desde={tC} />}
    </Camara>
  );
};
