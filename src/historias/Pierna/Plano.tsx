// Plano base en la pared: tú de perfil en el reglete, chapa abajo, valle y pájaros muy por debajo.
// Lo usan el gancho, el cierre, la chapa, el «volumen» y los consejos (cambian cámara, temblor y talón).
import React from "react";
import { Chapa, Cielo, Cuerda, Montanas, Pajaros, Pared, Svg, Valle, Zoom, borde } from "./comun";
import { Tu, caderaDe } from "./Tu";
import type { Angulos, Cara } from "../../piezas/Escalador";

export const X0 = 800, PY = 1150;
export const PX = borde(PY, X0) - 2;

export type PropsPlano = {
  f: number; tr: number; amp: number; s?: number; cara?: Cara; cabeza?: number; talon?: number; extra?: Partial<Angulos>; aliento?: number;
  zoom?: { s: number; cx: number; cy: number; tx?: number; ty?: number }; valle?: number; tintineo?: number;
};

export const PlanoPared: React.FC<PropsPlano> = ({ f, tr, amp, s = 3, cara = "miedo", cabeza, talon = 0, extra, aliento = 0, zoom, valle = 1500, tintineo = 1 }) => {
  const h = caderaDe(PX, PY, s, cabeza);
  const chy = 1330, chx = borde(chy, X0) + 4;
  const cuerda = `M${h.x + 36} ${h.y - 44 + tr * 3} Q${h.x + 30} ${(PY + chy) / 2 + 60 + tr * 8} ${chx} ${chy + 66} Q${chx - 30 + tr * 4} 1720 ${chx - 14} 2200`;
  const escena = (
    <>
      <Pared x0={X0} />
      <Chapa x={chx} y={chy} t={tr * 12 * tintineo} />
      <Cuerda d={cuerda} />
      <Tu px={PX} py={PY} s={s} tr={tr} amp={amp} cara={cara} cabeza={cabeza} talon={talon} x0={X0} extra={extra} aliento={aliento} />
    </>
  );
  return (
    <Svg>
      <Cielo id="pcielo" />
      <Montanas y={valle - 260} />
      <Valle y={valle} />
      <Pajaros y={valle - 140 + f * 0.1} x={60} />
      {zoom ? <Zoom {...zoom}>{escena}</Zoom> : escena}
    </Svg>
  );
};
