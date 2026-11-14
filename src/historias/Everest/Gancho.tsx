// 1 · Gancho (amanecer): un hombre sentado al borde, inmóvil, como muerto. Los que llegan (tú) en primer plano. Levanta la cabeza: «Imagino que os sorprende verme aquí».
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Bocadillo, Camara, Etiqueta, HALL, MAZUR, Nieve, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CABEZA, CADERA, Sentado, Vaho } from "./Piezas";

export const EscenaHall: React.FC<{ f: number; alza: number; zoom: number; conGrupo?: boolean; foco?: number }> = ({ f, alza, zoom, conGrupo = true, foco = 0 }) => (
  <Zoom s={zoom} cx={CADERA.x + 20 - 120 * foco} cy={CADERA.y - 120 - 230 * foco} tx={540} ty={1000}>
    <Arista luz={1} f={f} />
    <Sentado aspecto={HALL} cabeza={34 - 44 * alza} cara={alza > 0.5 ? "normal" : "cerrados"} />
    {alza > 0.5 && <Vaho f={f} x={CABEZA.x - 30} y={CABEZA.y + 30} />}
    {conGrupo && <>
      <Escalador x={900} y={1360} quien="joe" aspecto={MAZUR[0]} s={3.0} pose="pie" cara="miedo" mira={-1} angulos={{ cabeza: 14, brazoA: [30, 20] }} />
      <Escalador x={1040} y={1430} quien="simon" aspecto={MAZUR[1]} s={3.0} pose="pie" cara="miedo" mira={-1} angulos={{ cabeza: 10 }} />
    </>}
    <Nieve f={f} n={26} op={0.5} />
  </Zoom>
);

export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tM = (pal("mira") ?? Math.round(d * 0.5)) - 2, tI = (pal("imagino") ?? Math.round(d * 0.62)) - 2;
  const alza = sube(f, tM, tM + 14);
  const foco = 1 - sube(f, tI + 30, d);
  return (
    <Camara d={d} empuje={0.07} entrada={false}>
      <Svg><EscenaHall f={f} alza={alza} zoom={1.0 + 1.0 * foco} foco={foco} /></Svg>
      <Etiqueta texto="LO DIERON POR MUERTO… Y TE HABLA" top={230} tam={78} desde={-15} />
      {f >= tI && <Bocadillo texto="Imagino que os sorprende verme aquí." x={520} y={700} ancho={640} desde={tI} tam={60} />}
    </Camara>
  );
};
