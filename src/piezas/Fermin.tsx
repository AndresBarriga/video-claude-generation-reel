// FERMÍN · personaje fijo de la serie de técnica (E83 «La puerta», E84 «Rock over»…).
// Principiante de rocódromo torpe y entrañable: camiseta azul, gafas redondas, pelo revuelto, arnés amarillo, sin casco.
// Va DE ESPALDAS (se leen las dos mitades del cuerpo) y gira la cara por encima del hombro para reaccionar.
//
// Uso:  <Fermin x={cx} y={cy} s={1.15} pose="puerta" poseB="bandera" t={0.4} abre={0.5} cara="miedo" />
//   x, y = cadera en la escena. Las poses dan manos y pies RELATIVOS a la cadera (unidades locales, ≈3,3 u = 1 cm).
//   enEscena(pose, x, y, s) devuelve dónde caen manos y pies en la escena (para colocar las presas debajo).
//   abre 0–1 = la puerta: el cuerpo gira sobre la línea mano derecha–pie derecho (0 = pegado, 1 ≈ 80°).
import React from "react";
import { MED, Novato, ik, type AspectoNovato, type Pt } from "./Novato";
import type { Cara } from "./Escalador";

export const FERMIN: AspectoNovato = { camiseta: "#3E6FB0", camisetaSombra: "#2C5288", pantalon: "#4B4F57", piel: "#E9B990", pielSombra: "#C9926A", pelo: "#5A3A22", peinado: "revuelto", gafas: true, calcetin: "#E2533F" };

export type PoseFermin = { manoI: Pt; manoD: Pt; pieI: Pt; pieD: Pt; inclina: number; mira: number; banderaI?: boolean };

/** Poses (relativas a la cadera). Las presas de la vía de E83 cuadran con «puerta» en H y con «bandera» en H + (-50, -45) (s = 1). */
type Nombres = "colgado" | "agarre" | "puerta" | "bandera" | "rockOver" | "rockOverArriba";
export const POSES_FERMIN: Record<Nombres, PoseFermin> = {
  /** Colgado de la cuerda tras caer: manos a la cuerda sobre la cabeza, piernas sueltas. */
  colgado: { manoI: { x: -16, y: -430 }, manoD: { x: 16, y: -480 }, pieI: { x: -60, y: 262 }, pieD: { x: 52, y: 250 }, inclina: 0, mira: -1 },
  /** Dos manos y dos pies en la pared, equilibrado. */
  agarre: { manoI: { x: -120, y: -380 }, manoD: { x: 120, y: -380 }, pieI: { x: -80, y: 240 }, pieD: { x: 80, y: 240 }, inclina: 0, mira: 0 },
  /** La puerta: mano y pie derechos puestos (bisagra), el brazo izquierdo estirado sin llegar, el pie izquierdo sin apoyo. */
  puerta: { manoI: { x: -260, y: -420 }, manoD: { x: 190, y: -360 }, pieI: { x: -40, y: 262 }, pieD: { x: 110, y: 200 }, inclina: -4, mira: 0 },
  /** La bandera: la pierna izquierda cruza estirada al otro lado de la bisagra; ya llega a la presa. */
  bandera: { manoI: { x: -210, y: -375 }, manoD: { x: 240, y: -315 }, pieI: { x: 300, y: 60 }, pieD: { x: 160, y: 245 }, inclina: -8, mira: 0, banderaI: true },
  /** Rock over (inicio): pie derecho alto, a la altura de la cadera, rodilla arriba; manos bajas. */
  rockOver: { manoI: { x: -150, y: -330 }, manoD: { x: 110, y: -300 }, pieI: { x: -50, y: 262 }, pieD: { x: 170, y: -10 }, inclina: 4, mira: 0 },
  /** Rock over (final): de pie sobre el pie alto, cadera encima. */
  rockOverArriba: { manoI: { x: -130, y: -420 }, manoD: { x: 90, y: -460 }, pieI: { x: -110, y: 230 }, pieD: { x: 40, y: 250 }, inclina: 2, mira: 0 },
};
export type NombrePoseFermin = Nombres;

const lp = (a: number, b: number, t: number) => a + (b - a) * t;
const lpt = (a: Pt, b: Pt, t: number): Pt => ({ x: lp(a.x, b.x, t), y: lp(a.y, b.y, t) });
/** Mezcla dos poses (t 0–1). La bandera cambia de capa a mitad de camino. */
export const mezclaPose = (a: PoseFermin, b: PoseFermin, t: number): PoseFermin => ({
  manoI: lpt(a.manoI, b.manoI, t), manoD: lpt(a.manoD, b.manoD, t), pieI: lpt(a.pieI, b.pieI, t), pieD: lpt(a.pieD, b.pieD, t),
  inclina: lp(a.inclina, b.inclina, t), mira: lp(a.mira, b.mira, t), banderaI: t < 0.5 ? a.banderaI : b.banderaI,
});
/** Manos y pies de una pose, en coordenadas de escena. */
export const enEscena = (p: PoseFermin, x: number, y: number, s: number) => {
  const e = (q: Pt): Pt => ({ x: x + q.x * s, y: y + q.y * s });
  return { manoI: e(p.manoI), manoD: e(p.manoD), pieI: e(p.pieI), pieD: e(p.pieD) };
};

/** Dónde quedan DE VERDAD manos y pies (si un objetivo no se alcanza, el miembro se estira hacia él y se queda corto). */
export const apoyos = (p: PoseFermin, x: number, y: number, s: number) => {
  const r = (p.inclina * Math.PI) / 180, rot = (q: Pt): Pt => ({ x: q.x * Math.cos(r) - q.y * Math.sin(r), y: q.x * Math.sin(r) + q.y * Math.cos(r) });
  const e = (q: Pt): Pt => ({ x: x + q.x * s, y: y + q.y * s });
  const hI = rot({ x: -MED.hombroX, y: MED.hombroY }), hD = rot({ x: MED.hombroX, y: MED.hombroY });
  const b = MED.brazo1, b2 = MED.brazo2, l = MED.pierna1, l2 = MED.pierna2;
  return {
    manoI: e(ik(hI, p.manoI, b, b2, -1).fin), manoD: e(ik(hD, p.manoD, b, b2, 1).fin),
    pieI: e(ik({ x: -MED.caderaX, y: 4 }, p.pieI, l, l2, 1).fin), pieD: e(ik({ x: MED.caderaX, y: 4 }, p.pieD, l, l2, -1).fin),
  };
};

export const Fermin: React.FC<{
  x: number; y: number; s?: number;
  pose?: NombrePoseFermin | PoseFermin; poseB?: NombrePoseFermin | PoseFermin; t?: number;
  /** puerta 0–1 */ abre?: number; cara?: Cara; mira?: number; cuerda?: boolean; cuerdaX?: number;
  /** sombra del cuerpo sobre la pared (se separa al abrirse) */ sombra?: boolean;
}> = ({ x, y, s = 1, pose = "agarre", poseB, t = 0, abre = 0, cara = "normal", mira, cuerda = true, cuerdaX, sombra = true }) => {
  const A = typeof pose === "string" ? POSES_FERMIN[pose] : pose;
  const P = poseB ? mezclaPose(A, typeof poseB === "string" ? POSES_FERMIN[poseB] : poseB, t) : A;
  const w = enEscena(P, x, y, s);
  const hx = (w.manoD.x + w.pieD.x) / 2, c = Math.cos(Math.min(1, Math.max(0, abre)) * 1.4);
  return (
    <g>
      {sombra && <g transform={`translate(${hx} 0) scale(${c} 1) translate(${-hx} 0) translate(${-(14 + abre * 90) * s} ${16 * s})`} style={{ filter: "brightness(0)" }} opacity={0.1}>
        <Novato x={x} y={y} s={s} aspecto={FERMIN} manoI={w.manoI} manoD={w.manoD} pieI={w.pieI} pieD={w.pieD} inclina={P.inclina} mira={0} banderaI={P.banderaI} cuerda={false} />
      </g>}
      <g transform={`translate(${hx} 0) scale(${c} 1) translate(${-hx} 0)`}>
        <Novato x={x} y={y} s={s} aspecto={FERMIN} manoI={w.manoI} manoD={w.manoD} pieI={w.pieI} pieD={w.pieD} inclina={P.inclina} mira={mira ?? P.mira} cara={cara} banderaI={P.banderaI} cuerda={cuerda} cuerdaX={cuerdaX} />
      </g>
    </g>
  );
};
