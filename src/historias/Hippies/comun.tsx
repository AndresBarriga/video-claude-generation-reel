// E36 «Los hippies del avión de marihuana». Piezas de Claude Design (public/piezas/E36) animadas con <PiezaSvg>.
// Estética: película de los 70 (grano, colores cálidos y algo desvaídos, viñeta). Tono cute; nada de consumo.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { PIEZAS } from "../../piezas/svg/E36";
import { PiezaSvg, type PiezaProps } from "../../piezas/PiezaSvg";
import { fuenteTitulo, fuenteTexto } from "../../tema";
export { C, Camara, Svg, Zoom, Etiqueta, type P } from "../Pegue/comun";

export const Pieza: React.FC<Omit<PiezaProps, "piezas">> = (p) => <PiezaSvg piezas={PIEZAS} {...p} />;
export const T = { fuenteTitulo, fuenteTexto };

/** Personajes (vistos de frente): proporción ancho/alto de su viewBox, para colocarlos por los pies. */
export const PJ = { lider: 400 / 554.64, tu: 400 / 497.92, escaladora: 400 / 476.64, flaco: 400 / 617.36 } as const;
export type Pj = keyof typeof PJ;
/** Personaje con los pies en (cx, suelo) y una altura dada. */
export const Pj: React.FC<{ q: Pj; cx: number; suelo: number; alto: number } & Omit<PiezaProps, "piezas" | "nombre" | "x" | "y" | "alto">> = ({ q, cx, suelo, alto, ...r }) => (
  <Pieza nombre={q} x={cx - (alto * PJ[q]) / 2} y={suelo - alto} alto={alto} {...r} />
);

/** Ciclo de paso de frente: piernas y brazos alternos (grados). */
export const andar = (f: number, v = 1) => {
  const w = Math.sin((f / 7) * v);
  return { muslo_izq: 14 * w, pierna_izq: Math.max(0, -10 * w), muslo_der: -14 * w, pierna_der: Math.max(0, 10 * w), brazo_superior_izq: -14 * w, brazo_superior_der: -14 * w };
};
/** Escalar de frente: brazos arriba alternando, piernas en rana. */
export const trepar = (f: number) => {
  const w = Math.sin(f / 9);
  return { brazo_superior_izq: 150 + 20 * w, antebrazo_izq: -20, brazo_superior_der: -150 + 20 * w, antebrazo_der: 20, muslo_izq: 40 - 15 * w, pierna_izq: -50, muslo_der: -40 - 15 * w, pierna_der: 50 };
};

/** Filtro de película de los 70: tinte cálido, grano que cambia cada fotograma, viñeta y polvo. */
export const Pelicula70: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(214,150,70,0.13)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 55%, rgba(40,20,5,0.45) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={random(`p${i}${Math.floor(f / 2)}`) * 1080} cy={random(`q${i}${Math.floor(f / 2)}`) * 1920} r={1 + random(`r${i}${f}`) * 2.5} fill="#2A1A0A" opacity={0.25} />)}
        {f % 37 < 2 && <path d={`M${random(`l${f}`) * 1080} 0 L${random(`l${f}`) * 1080 + 6} 1920`} stroke="#2A1A0A" strokeWidth={2} opacity={0.25} />}
      </svg>
    </div>
  );
};

/** Copos de nieve cayendo. */
export const Nieve: React.FC<{ n?: number }> = ({ n = 40 }) => {
  const f = useCurrentFrame();
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: n }).map((_, i) => <circle key={i} cx={(random(`nx${i}`) * 1080 + Math.sin(f / 20 + i) * 20)} cy={(random(`ny${i}`) * 1920 + f * (2 + random(`nv${i}`) * 3)) % 1920} r={2 + random(`nr${i}`) * 4} fill="#fff" opacity={0.8} />)}</svg>;
};
