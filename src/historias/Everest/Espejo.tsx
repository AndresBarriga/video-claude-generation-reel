// 7 · El espejo: alterna Hall (amanecer) y Sharp (noche), misma postura. «Uno volvió a casa» (lo bajan) · «El otro no» (la oscuridad se cierra).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, Etiqueta, HALL, MAZUR, Nieve, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CADERA } from "./Piezas";
import { EscenaHall } from "./Gancho";
import { EscenaSharp } from "./Cueva";

const suelo = (x: number) => CADERA.y - 0.16 * (x - CADERA.x);
export const Espejo: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tU = (pal("uno") ?? Math.round(d * 0.45)) - 3, tO = (pal("otro") ?? Math.round(d * 0.75)) - 3;
  if (f < tU) { // alterna cada ~0,4 s
    const hall = Math.floor(f / 12) % 2 === 0;
    return (
      <Camara d={tU} empuje={0.04} entrada={false}>
        <Svg>{hall ? <EscenaHall f={f} alza={0} zoom={1.0} conGrupo={false} /> : <EscenaSharp f={f} alza={0} vivo={0.4} />}</Svg>
        <Etiqueta texto="A LOS DOS LOS CREYERON MUERTOS" top={230} tam={70} desde={2} />
      </Camara>
    );
  }
  if (f < tO) { // Hall baja entre dos
    const g = f - tU, x = CADERA.x + 20 + g * 7;
    return (
      <Camara d={tO - tU} empuje={0.03} entrada={false}>
        <Svg>
          <Zoom s={1.0} cx={CADERA.x + 140} cy={CADERA.y - 220} tx={540} ty={1000}>
            <Arista luz={1} f={f} />
            <Escalador x={x - 120} y={suelo(x - 120) - 130 * 2.4} quien="joe" aspecto={MAZUR[0]} s={2.4} pose="pie" cara="serio" mira={1} angulos={{ brazoA: [80, 70], piernaA: [Math.sin(g / 3) * 16, 0], piernaB: [-Math.sin(g / 3) * 16, 0] }} />
            <Escalador x={x} y={suelo(x) - 130 * 2.4} quien="joe" aspecto={HALL} s={2.4} pose="pie" cara="cerrados" mira={1} angulos={{ torso: 10, cabeza: 18, piernaA: [Math.sin(g / 3 + 1) * 12, 0], piernaB: [-Math.sin(g / 3 + 1) * 12, 0] }} />
            <Escalador x={x + 120} y={suelo(x + 120) - 130 * 2.4} quien="simon" aspecto={MAZUR[2]} s={2.4} pose="pie" cara="serio" mira={-1} angulos={{ brazoA: [80, 70], piernaA: [Math.sin(g / 3 + 2) * 16, 0], piernaB: [-Math.sin(g / 3 + 2) * 16, 0] }} />
            <Nieve f={f} n={16} op={0.4} />
          </Zoom>
        </Svg>
        <Etiqueta texto="UNO VOLVIÓ A CASA" top={230} tam={100} desde={tU} />
      </Camara>
    );
  }
  return (
    <Camara d={d - tO} empuje={0.05} entrada={false}>
      <Svg><EscenaSharp f={f} alza={0} vivo={0} oscuro={0.4 + 0.6 * sube(f, tO, d)} /></Svg>
      <Etiqueta texto="EL OTRO NO" top={230} tam={110} desde={tO} />
    </Camara>
  );
};
