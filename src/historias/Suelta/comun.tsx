// E47 «Llevas cuerda. Tu cerebro no lo sabe». Escenario NUEVO: cueva desplomada de caliza al anochecer (tipo Rodellar):
// techo de roca encima, boca de la cueva abierta a un cañón con río, cielo azul de última hora. Las caídas van al aire (desplome).
// Idea visual: la cuerda naranja es lo único cálido; cuando el cerebro «no la ve» se vuelve gris discontinua; el medidor de MIEDO baja caída a caída.
import React from "react";
import { random } from "remotion";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
export { C, Etiqueta, Svg, clamp, golpe, W, H, type P } from "../Pegue/comun";
import { C } from "../Pegue/comun";
import { PC, cam, PERFILES, Fondo, Cueva as CuevaKit, Expres as ExpresKit, Medidor, Bocadillo } from "../../piezas/kit";
export { PC, cam, Fondo, Medidor, Bocadillo };
export const xF = PERFILES.desplome;

/* ---- reparto (nuevo) ---- */
export const TU: Aspecto = { chaqueta: "#3F7F86", chaquetaSombra: "#2A5A60", pantalon: "#2B2F3A", casco: "#E9E4D8", pelo: "#7A3B1E", peinado: "rizado", piel: "#B9825A", pielSombra: "#94613E", manos: "piel" };
export const ASEG: Aspecto = { chaqueta: "#B4553C", chaquetaSombra: "#82392A", pantalon: "#3A3F33", casco: null, gorro: "#D9B44A", pelo: "#1E1612", peinado: "coleta", piel: "#9C6845", pielSombra: "#7C4F33", manos: "piel", gafas: true };

/* ---- paleta: azul de última hora, caliza fría con chorreras ocres apagadas ---- */

/* ---- geometría del mundo (px). Pared a la derecha; desplome: arriba queda más a la izquierda ---- */
export const SUELO = 2650;
export const CHAPAS = [2330, 1990, 1650, 1310, 980];
export const CHAPA = { x: xF(980) - 6, y: 1022 }; // mosquetón de la última chapa (por donde pasa la cuerda)
export const ARRIBA = { x: xF(745) - 78, y: 745 }; // cadera del escalador agarrado (por encima de la chapa)
export const COLGADO = { x: CHAPA.x - 34, y: 1335 }; // cadera colgando tras la caída (al aire, bajo el desplome)
export const ASE = { x: 735, y: SUELO - 136 }; // cadera de quien asegura
export const APARATO = (dy = 0) => ({ x: ASE.x + 22, y: ASE.y - 14 + dy }); // aparato de freno en el arnés

/** La cueva de E47 con sus chapas. */
export const Cueva: React.FC<{ chapas?: number }> = ({ chapas = 5 }) => <CuevaKit cintas={CHAPAS.slice(0, chapas)} />;
export const Expres: React.FC<{ y: number }> = ({ y }) => <ExpresKit x={xF(y)} y={y} />;

/** Cuerda: de quien asegura, por las chapas, hasta el arnés. `idea` 0–1 = se vuelve gris discontinua. `floja` = comba (caída). */
export const CuerdaSL: React.FC<{ arnes: { x: number; y: number }; idea?: number; floja?: number; tension?: number; dy?: number }> = ({ arnes, idea = 0, floja = 0, tension = 0, dy = 0 }) => {
  const pts = [APARATO(dy), ...CHAPAS.map((y) => ({ x: xF(y) - 6, y: y + 54 }))];
  const base = pts.map((p) => `${p.x} ${p.y}`).join(" L");
  const mx = (CHAPA.x + arnes.x) / 2 - floja * 120, my = (CHAPA.y + arnes.y) / 2 + floja * 160;
  const d = `M${base} Q${mx} ${my} ${arnes.x + 18} ${arnes.y - 6}`;
  const w = 10 + tension * 3;
  return (
    <g>
      <g opacity={1 - idea}>
        <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke="#FFB27F" strokeWidth={2.5} fill="none" strokeDasharray="9 11" opacity={0.7} />
      </g>
      {idea > 0 && <path d={d} stroke="#AEB6C0" strokeWidth={6} fill="none" strokeDasharray="18 16" opacity={idea * 0.8} />}
    </g>
  );
};

/** Quien escala. `cae` 0–1: de agarrado (ARRIBA) a colgado (COLGADO). */
export const ANG_AGARRE: Angulos = { torso: 18, cabeza: -22, brazoA: [160, 178], brazoB: [146, 168], piernaA: [86, 30], piernaB: [64, 10] };
export const ANG_COLGADO: Angulos = { torso: 4, cabeza: -6, brazoA: [40, 20], brazoB: [-30, -10], piernaA: [40, 6], piernaB: [16, -10] };
export const ANG_CAER: Angulos = { torso: -10, cabeza: -18, brazoA: [130, 110], brazoB: [-120, -100], piernaA: [50, -10], piernaB: [10, -30] };
const mix = (a: Angulos, b: Angulos, t: number): Angulos => {
  const l = (x: number, y: number) => x + (y - x) * t;
  return { torso: l(a.torso, b.torso), cabeza: l(a.cabeza, b.cabeza), brazoA: [l(a.brazoA[0], b.brazoA[0]), l(a.brazoA[1], b.brazoA[1])], brazoB: [l(a.brazoB[0], b.brazoB[0]), l(a.brazoB[1], b.brazoB[1])], piernaA: [l(a.piernaA[0], b.piernaA[0]), l(a.piernaA[1], b.piernaA[1])], piernaB: [l(a.piernaB[0], b.piernaB[0]), l(a.piernaB[1], b.piernaB[1])] };
};
/** Posición de la cadera durante una caída (t 0–1): caída libre y frenada blanda con rebote. */
export const posCaida = (t: number) => {
  const g = Math.min(1, t / 0.55), y0 = ARRIBA.y, y1 = COLGADO.y + 40;
  if (t < 0.55) return { x: ARRIBA.x + (COLGADO.x - ARRIBA.x) * g * g * 0.6, y: y0 + (y1 - y0) * g * g, floja: 1 - g * 0.6, ang: mix(ANG_AGARRE, ANG_CAER, Math.min(1, g * 3)) };
  const k = (t - 0.55) / 0.45, reb = Math.exp(-5 * k) * Math.cos(k * 11);
  return { x: COLGADO.x + 26 * reb, y: COLGADO.y + 40 * reb, floja: 0, ang: mix(ANG_CAER, ANG_COLGADO, Math.min(1, k * 2)) };
};
export const Tu: React.FC<{ x: number; y: number; ang: Angulos; cara?: Cara; rot?: number; tiembla?: number }> = ({ x, y, ang, cara = "miedo", rot = 0, tiembla = 0 }) => (
  <Escalador x={x + tiembla} y={y} quien="joe" angulos={ang} cara={cara} aspecto={TU} rot={rot} mira={1} />
);
/** Cinemática inversa de un brazo de Escalador (s = 1, mira = 1): ángulos [hombro→codo, codo→mano] para llevar la mano a (tx, ty). */
const ik = (sh: [number, number], tx: number, ty: number, codo: 1 | -1): [number, number] => {
  const L1 = 52, L2 = 50, dx = tx - sh[0], dy = ty - sh[1], d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = base + codo * al, e = [sh[0] + Math.sin(a1) * L1, sh[1] + Math.cos(a1) * L1];
  return [(a1 * 180) / Math.PI, (Math.atan2(tx - e[0], ty - e[1]) * 180) / Math.PI];
};
const TORSO_A = -6;
/** Quien asegura: mira a la pared; mano guía (izquierda, detrás) en la cuerda que sube; mano de FRENO (derecha, delante) SIEMPRE
 *  en la cuerda por debajo del aparato; el resto de la cuerda cae a una madeja enroscada en el suelo. `dy` = la levanta la frenada. */
export const Asegura: React.FC<{ dy?: number; cara?: Cara }> = ({ dy = 0, cara = "normal" }) => {
  const hip = { x: ASE.x, y: ASE.y + dy }, ap = APARATO(dy);
  const sh: [number, number] = [Math.sin(((180 - TORSO_A) * Math.PI) / 180) * 88, Math.cos(((180 - TORSO_A) * Math.PI) / 180) * 88];
  const sube = { x: xF(CHAPAS[0]) - 6, y: CHAPAS[0] + 54 }, k = 70 / Math.hypot(sube.x - ap.x, sube.y - ap.y);
  const guia = { x: ap.x + (sube.x - ap.x) * k, y: ap.y + (sube.y - ap.y) * k };
  const freno = { x: ap.x + 10, y: ap.y + 14 };
  const brazoB = ik(sh, guia.x - hip.x, guia.y - hip.y, -1), brazoA = ik(sh, freno.x - hip.x, freno.y - hip.y, 1);
  const pila = { x: ASE.x + 120, y: SUELO - 8 };
  const sale = `M${freno.x} ${freno.y} C${freno.x + 30} ${freno.y + 70} ${pila.x - 40} ${pila.y - 90} ${pila.x - 10} ${pila.y - 14}`;
  const rizos = Array.from({ length: 7 }, (_, i) => ({ cx: pila.x + (random(`rz${i}`) - 0.5) * 50, cy: pila.y - i * 5, rx: 62 - i * 3 + random(`rw${i}`) * 10, ry: 16 + random(`rh${i}`) * 4, r: (random(`rr${i}`) - 0.5) * 16 }));
  const cuerda = (d: string, w = 10) => <><path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" /></>;
  return (
    <g>
      {/* madeja enroscada en el suelo */}
      <ellipse cx={pila.x} cy={pila.y + 8} rx={80} ry={16} fill="#1F2328" opacity={0.6} />
      {rizos.map((z, i) => <g key={i} transform={`rotate(${z.r} ${z.cx} ${z.cy})`}><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerdaS} strokeWidth={13} /><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerda} strokeWidth={9} /></g>)}
      <Escalador x={hip.x} y={hip.y} quien="simon" angulos={{ torso: TORSO_A, cabeza: -32, brazoA, brazoB, piernaA: [12, 0], piernaB: [-10, 0] }} cara={cara} aspecto={ASEG} mira={1} sombra={SUELO} />
      {/* cuerda de freno: del aparato, por dentro del puño derecho, hasta la madeja (encima del brazo para que se vea agarrada) */}
      {cuerda(`M${ap.x} ${ap.y} L${freno.x} ${freno.y}`, 9)}
      {cuerda(sale, 9)}
      <rect x={ap.x - 12} y={ap.y - 10} width={22} height={26} rx={6} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={4} />
      <circle cx={freno.x} cy={freno.y} r={13} fill={ASEG.piel} stroke={PC.tinta} strokeWidth={4} />
      <circle cx={guia.x} cy={guia.y} r={12} fill={ASEG.piel} stroke={PC.tinta} strokeWidth={4} />
    </g>
  );
};
