// Gancho y cierre en bucle: tu pierna temblando en el reglete, la chapa dos metros por debajo y el valle al fondo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, Camara, Chapa, Cielo, Cuerda, Etiqueta, P11, Pared, Svg, Valle, temblor, type P } from "./comun";
import { Tu, caderaDe } from "./Tu";

export const PlanoVertigo: React.FC<{ d: number; titulo?: string; k?: number }> = ({ d, titulo, k = 1 }) => {
  const f = useCurrentFrame();
  const tr = temblor(f, k);
  const s = 3, px = 790, py = 1150;
  const chx = px + 4, chy = 1310, h = caderaDe(px, py, s);
  const cuerda = `M${h.x + 36} ${h.y - 44} Q${h.x + 20} ${(py + chy) / 2 + 40 + tr * 6} ${chx} ${chy + 66} Q${chx - 30} 1700 ${chx - 10} 2100`;
  return (
    <Camara d={d} empuje={0.06} foco="55% 50%">
      <Svg>
        <Cielo id="vcielo" />
        <Valle y={1480} />
        <Pared x0={px + 2} />
        <Chapa x={chx} y={chy} t={tr * 9} />
        <Cuerda d={cuerda} />
        <Tu px={px} py={py} s={s} tr={tr} amp={k} />
      </Svg>
      <Etiqueta texto={titulo} top={230} tam={100} />
    </Camara>
  );
};

export const Vertigo: React.FC<P> = ({ e, d }) => <PlanoVertigo d={d} titulo={e.titulo} />;
