// Plano base en la pared: tú de perfil en el reglete, chapa abajo, valle y pájaros muy por debajo.
// Lo usan el gancho, el cierre, la chapa, el «volumen» y los consejos (cambian cámara, temblor y talón).
import React from "react";
import { Chapa, Cielo, Cuerda, Montanas, Pajaros, Pared, Svg, Valle, Zoom, borde } from "./comun";
import { Tu, caderaDe } from "./Tu";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import { TU } from "./comun";

export const X0 = 800, PY = 1150;
export const PX = borde(PY, X0) - 2;

export type PropsPlano = {
  f: number; tr: number; amp: number; s?: number; cara?: Cara; cabeza?: number; talon?: number; extra?: Partial<Angulos>; aliento?: number;
  zoom?: { s: number; cx: number; cy: number; tx?: number; ty?: number }; valle?: number; tintineo?: number;
  /** chapa: "real" = justo bajo el arnés (la verdad); "lejos" = 2 m más abajo (lo que ve el miedo); omitida = fuera de plano. colgar 0–1 = la caída de 20 cm. */
  chapa?: "real" | "lejos"; colgar?: number; fantasma?: number; aro?: number;
};

export const CAIDA = 118; // 20 cm a escala 3
export const PlanoPared: React.FC<PropsPlano> = ({ f, tr, amp, s = 3, cara = "miedo", cabeza, talon = 0, extra, aliento = 0, zoom, valle = 1500, tintineo = 1, chapa, colgar = 0, fantasma = 0, aro = 0 }) => {
  const h = caderaDe(PX, PY, s, cabeza);
  const chy = chapa === "lejos" ? h.y + 700 : h.y + 20, chx = borde(chy, X0) + 4;
  const caer = Math.min(1, colgar), hy = h.y + CAIDA * caer, hx = h.x - 30 * caer;
  const cuerdaArriba = colgar > 0 && chapa
    ? `M${hx + 36} ${hy - 44} L${chx} ${chy + 66}`
    : colgar > 0 ? `M${hx + 36} ${hy - 44} Q${hx + 90} ${hy + 120} ${hx + 110} 2300`
    : chapa ? `M${h.x + 36} ${h.y - 44 + tr * 3} Q${(h.x + chx) / 2 + 10} ${(h.y + chy) / 2 + 60 + tr * 8} ${chx} ${chy + 66}` : `M${h.x + 36} ${h.y - 44 + tr * 3} Q${h.x + 30} ${h.y + 400 + tr * 8} ${h.x + 70} 2300`;
  const cuerdaAbajo = chapa ? `M${chx} ${chy + 66} Q${chx - 30 + tr * 4} ${chy + 500} ${chx - 14} 2300` : "";
  const escena = (
    <>
      <Pared x0={X0} />
      {fantasma > 0 && <g opacity={0.3 * fantasma}><Tu px={PX} py={PY} s={s} cara="miedo" cabeza={cabeza} x0={X0} /></g>}
      {chapa && <Chapa x={chx} y={chy} t={colgar > 0 ? 0 : tr * 12 * tintineo} />}
      {aro > 0 && <circle cx={chx} cy={chy + 30} r={70 + 10 * Math.sin(f / 4)} fill="none" stroke="#FFD34D" strokeWidth={10} opacity={aro} />}
      {cuerdaAbajo && <Cuerda d={cuerdaAbajo} />}
      {!(colgar > 0) && <Cuerda d={cuerdaArriba} />}
      <Tu px={PX} py={PY} s={s} tr={tr} amp={colgar > 0 ? 0 : amp} cara={cara} cabeza={cabeza} talon={talon} x0={X0} extra={extra} aliento={aliento} soloRoca={colgar > 0} />
      {colgar > 0 && <Escalador x={hx} y={hy} quien="joe" look={TU} s={s} angulos={{ torso: 4, cabeza: -6 + 26 * Math.min(1, colgar - 1 > 0 ? colgar - 1 : 0), brazoA: [150, 172], brazoB: [130, 160], piernaA: [40, -10], piernaB: [20, -6] }} cara={cara} />}
      {colgar > 0 && <Cuerda d={cuerdaArriba} />}
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
