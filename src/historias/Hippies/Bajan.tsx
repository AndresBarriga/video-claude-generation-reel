// «Ellos bajaron»: los cuatro cruzan el prado cargando fardos al hombro; el guardabosques los «vigila» con los prismáticos al revés.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Pieza, Pj, Svg, andar, type P, type Pj as Q } from "./comun";

const FILA: Q[] = ["lider", "tu", "escaladora", "flaco"];
export const Bajan: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const x0 = interpolate(f, [0, d], [-420, 420]);
  return (
    <Camara d={d} empuje={0.04} foco="50% 60%">
      <Svg>
        <Pieza nombre="fondo_yosemite" x={0} y={0} alto={1920} />
        {FILA.map((q, i) => {
          const cx = x0 + i * 230, suelo = 1650 + (i % 2) * 40, alto = 620, a = andar(f + i * 5);
          return (
            <g key={q}>
              <Pj q={q} cx={cx} suelo={suelo} alto={alto} cara="feliz" rot={{ ...a, brazo_superior_izq: 160, antebrazo_izq: 10, brazo_superior_der: -160, antebrazo_der: -10 }} />
              <Pieza nombre="fardo" x={cx - 105} y={suelo - alto - 120 + Math.abs(Math.sin(f / 7)) * -8} alto={150} />
            </g>
          );
        })}
        <Pieza nombre="guardabosques_prismaticos_al_reves" x={700} y={1130} alto={720} rot={{ prismaticos: Math.sin(f / 6) * 4 }} />
      </Svg>
    </Camara>
  );
};
