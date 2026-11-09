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
        <Svg>{hall ? <EscenaHall f={f} alza={0} zoom={1.0} conGrupo={false} /> : <EscenaSharp f={f} alza={0} vivo={1} />}</Svg>
      </Camara>
    );
  }
  if (f < tO) { // Hall baja entre dos
    const g = f - tU, x = CADERA.x + 450 + g * 5, S = 2.3;
    const andar = (k: number) => { const p = Math.sin(g / 3.2 + k); return { piernaA: [p * 18, Math.max(0, p) * 16] as [number, number], piernaB: [-p * 18, Math.max(0, -p) * 16] as [number, number] }; };
    const xs = [x + 230, x, x - 230]; // guía delante, Hall en medio (encordado), otro detrás
    return (
      <Camara d={tO - tU} empuje={0.03} entrada={false}>
        <Svg>
          <Zoom s={0.95} cx={x - 20} cy={suelo(x) - 200} tx={540} ty={1000}>
            <Arista luz={1} f={f} />
            <path d={`M${xs[0] - 10} ${suelo(xs[0]) - 128 * S} Q${(xs[0] + xs[1]) / 2} ${suelo((xs[0] + xs[1]) / 2) - 70 * S} ${xs[1] + 10} ${suelo(xs[1]) - 128 * S}`} stroke="#FF6A1F" strokeWidth={7} fill="none" />
            <path d={`M${xs[2] + 10} ${suelo(xs[2]) - 128 * S} Q${(xs[1] + xs[2]) / 2} ${suelo((xs[1] + xs[2]) / 2) - 70 * S} ${xs[1] - 10} ${suelo(xs[1]) - 128 * S}`} stroke="#FF6A1F" strokeWidth={7} fill="none" />
            <Escalador x={xs[2]} y={suelo(xs[2]) - 130 * S} quien="simon" aspecto={MAZUR[2]} s={S} pose="pie" cara="serio" mira={1} angulos={{ cabeza: 10, brazoA: [40, 30], ...andar(2) }} />
            <Escalador x={xs[1]} y={suelo(xs[1]) - 130 * S} quien="joe" aspecto={HALL} s={S} pose="pie" cara="cerrados" mira={1} angulos={{ torso: 12, cabeza: 22, brazoA: [20, 10], brazoB: [-10, 0], ...andar(1) }} />
            <Escalador x={xs[0]} y={suelo(xs[0]) - 130 * S} quien="joe" aspecto={MAZUR[0]} s={S} pose="pie" cara="serio" mira={1} angulos={{ cabeza: -4, brazoB: [-50, -20], ...andar(0) }} />
            <Nieve f={f} n={16} op={0.4} />
          </Zoom>
        </Svg>
        <Etiqueta texto="UNO VOLVIÓ A CASA" top={230} tam={100} desde={tU} />
      </Camara>
    );
  }
  return (
    <Camara d={d - tO} empuje={0.05} entrada={false}>
      <Svg><EscenaSharp f={f} alza={0} vivo={1 - sube(f, tO, tO + 20)} oscuro={0.15 + 0.35 * sube(f, tO, d)} /></Svg>
      <Etiqueta texto="EL OTRO NO" top={230} tam={110} desde={tO} />
    </Camara>
  );
};
