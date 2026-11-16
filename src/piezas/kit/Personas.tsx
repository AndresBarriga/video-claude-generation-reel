// KIT · personas: reparto de la cuenta, quien escala y quien asegura (mano de freno SIEMPRE en la cuerda).
import React from "react";
import { random } from "remotion";
import { Escalador, type Cara, type Quien } from "../Escalador";
import type { Aspecto } from "../Rasgos";
import { C, PC, type Pt } from "./base";
import { hombro, ikBrazo, type Angulos } from "./rig";
import { Soga } from "./Cuerda";
import { aparato, type Via } from "./via";
export type { Cara, Aspecto };

/** Personajes fijos de la cuenta. Usa siempre los mismos para que se reconozcan de un vídeo a otro. */
export const REPARTO = {
  /** La escaladora de E59 (chaqueta mostaza, casco azul, melena). */
  ella: { chaqueta: "#C9A23C", chaquetaSombra: "#94762A", pantalon: "#2F3B4C", casco: "#3E6FB0", pelo: "#3A2418", peinado: "melena", piel: "#D9A57C", pielSombra: "#B6835C", manos: "piel" } as Aspecto,
  /** El asegurador de E59 (gorro teja, barba). */
  el: { chaqueta: "#3F7F86", chaquetaSombra: "#2A5A60", pantalon: "#3A3530", casco: null, gorro: "#B4553C", pelo: "#3B2A20", peinado: "corto", barba: "#3B2A20", piel: "#C99068", pielSombra: "#A46F4C", manos: "piel" } as Aspecto,
  /** «Tú» de E47 (chaqueta verde azulada, casco claro, rizos). */
  tu: { chaqueta: "#3F7F86", chaquetaSombra: "#2A5A60", pantalon: "#2B2F3A", casco: "#E9E4D8", pelo: "#7A3B1E", peinado: "rizado", piel: "#B9825A", pielSombra: "#94613E", manos: "piel" } as Aspecto,
  /** La aseguradora de E47 (gorro amarillo, coleta, gafas). */
  ase: { chaqueta: "#B4553C", chaquetaSombra: "#82392A", pantalon: "#3A3F33", casco: null, gorro: "#D9B44A", pelo: "#1E1612", peinado: "coleta", piel: "#9C6845", pielSombra: "#7C4F33", manos: "piel", gafas: true } as Aspecto,
  /** Principiante de rocódromo (sudadera lila, sin casco, trenzas). */
  nueva: { chaqueta: "#8E7CC3", chaquetaSombra: "#6A5A9A", pantalon: "#2E3440", casco: null, pelo: "#201713", peinado: "trenzas", piel: "#E3B48E", pielSombra: "#C08F69", manos: "piel" } as Aspecto,
  /** Silueta roja «lo que habría pasado» (comparaciones). */
  fantasma: { chaqueta: "#E2533F", chaquetaSombra: "#B23A2A", pantalon: "#B23A2A", casco: "#E2533F", pelo: "#B23A2A", peinado: "melena", piel: "#F08A78", pielSombra: "#E2533F", manos: "piel" } as Aspecto,
};

/** Quien escala (mira a la pared). p = cadera. `sombra` = y del suelo si debe proyectarla. */
export const Persona: React.FC<{ p: Pt; ang: Angulos; aspecto?: Aspecto; quien?: Quien; cara?: Cara; rot?: number; tiembla?: number; sombra?: number; o?: number }> = ({ p, ang, aspecto = REPARTO.ella, quien = "joe", cara = "normal", rot = 0, tiembla = 0, sombra, o = 1 }) => (
  <g opacity={o}><Escalador x={p.x + tiembla} y={p.y} quien={quien} angulos={ang} cara={cara} aspecto={aspecto} rot={rot} mira={1} sombra={sombra} /></g>
);

const cu = (d: string, w = 9) => <><path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" /></>;
/** Quien asegura, de pie con la cadera en x. Dibuja también su cuerda hasta `hacia` (por defecto la 1.ª chapa) y la madeja del suelo.
 *  `comba` 0–1 = cuerda floja · `feed` 0–1 = la mano guía empuja cuerda (dar) · `paso` = fase al andar · `alza` 0–1 = mira arriba ·
 *  `dy` < 0 = la frenada la levanta (usa saltoAseg) · `vuelo` 0–1 = piernas colgando en el aire. */
export const Asegurador: React.FC<{ via: Via; x: number; hacia?: Pt; aspecto?: Aspecto; quien?: Quien; dy?: number; cara?: Cara; comba?: number; feed?: number; paso?: number; alza?: number; vuelo?: number; pilaDx?: number; pilaR?: number; cuerda?: boolean }> = ({ via, x, hacia = via.mos(0), aspecto = REPARTO.el, quien = "simon", dy = 0, cara = "normal", comba = 0.1, feed = 0, paso = 0, alza = 0, vuelo = 0, pilaDx = 120, pilaR = 1, cuerda = true }) => {
  const TO = -6, s = Math.sin(paso), hip = { x, y: via.pie + dy - Math.abs(s) * 5 }, ap = aparato(via, x, hip.y - via.pie);
  void hombro;
  const ctrl = { x: (ap.x + hacia.x) / 2, y: (ap.y + hacia.y) / 2 + comba * 260 };
  const q = (t: number) => ({ x: (1 - t) ** 2 * ap.x + 2 * (1 - t) * t * ctrl.x + t * t * hacia.x, y: (1 - t) ** 2 * ap.y + 2 * (1 - t) * t * ctrl.y + t * t * hacia.y });
  const tg = (62 + feed * 44) / Math.max(120, Math.hypot(hacia.x - ap.x, hacia.y - ap.y)), guia = q(tg), freno = { x: ap.x + 10, y: ap.y + 14 };
  const brazoB = ikBrazo(TO, guia.x - hip.x, guia.y - hip.y, -1), brazoA = ikBrazo(TO, freno.x - hip.x, freno.y - hip.y, 1);
  const pl = { x: x + pilaDx, y: via.suelo - 8 }, l = (a: number, b: number) => a + (b - a) * vuelo;
  const rizos = Array.from({ length: 7 }, (_, i) => ({ cx: pl.x + (random(`rz${i}`) - 0.5) * 50 * pilaR, cy: pl.y - i * 5, rx: (62 - i * 3 + random(`rw${i}`) * 10) * pilaR, ry: 16 + random(`rh${i}`) * 4, r: (random(`rr${i}`) - 0.5) * 16 }));
  return (
    <g>
      <ellipse cx={pl.x} cy={pl.y + 8} rx={80 * pilaR} ry={16} fill="#1F2328" opacity={0.6} />
      {rizos.map((z, i) => <g key={i} transform={`rotate(${z.r} ${z.cx} ${z.cy})`}><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerdaS} strokeWidth={13} /><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerda} strokeWidth={9} /></g>)}
      <Escalador x={hip.x} y={hip.y} quien={quien} angulos={{ torso: TO, cabeza: -32 - alza * 16, brazoA, brazoB, piernaA: [l(12 + 26 * s, 16), l(-14 * Math.max(0, -s), -22)], piernaB: [l(-10 - 26 * s, -4), l(-14 * Math.max(0, s), -26)] }} cara={cara} aspecto={aspecto} mira={1} sombra={via.suelo} />
      {cuerda && <Soga pts={[ap, { ...hacia, sag: comba * 260 }]} />}
      {cu(`M${ap.x} ${ap.y} L${freno.x} ${freno.y}`)}
      {cu(`M${freno.x} ${freno.y} C${freno.x + 30} ${freno.y + 70} ${pl.x - 40} ${pl.y - 90} ${pl.x - 10} ${pl.y - 14}`)}
      <rect x={ap.x - 12} y={ap.y - 10} width={22} height={26} rx={6} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={4} />
      <circle cx={freno.x} cy={freno.y} r={13} fill={aspecto.piel} stroke={PC.tinta} strokeWidth={4} />
      <circle cx={guia.x} cy={guia.y} r={12} fill={aspecto.piel} stroke={PC.tinta} strokeWidth={4} />
    </g>
  );
};
