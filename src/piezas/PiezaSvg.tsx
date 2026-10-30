// Pinta una pieza SVG de un set (tools/piezas-svg.mjs) y la anima: rota sus grupos por id (sobre su data-pivot),
// cambia de cara (cara_normal / cara_platos / cara_feliz) y oculta o muestra grupos. Varias copias conviven: el CSS va acotado a cada una.
import React, { useId } from "react";

export type PiezaProps = {
  piezas: Record<string, { viewBox: string; inner: string }>;
  nombre: string;
  /** Esquina sup. izq. y tamaño en el lienzo (1080×1920). Si solo das alto, el ancho sale de la proporción. */
  x: number; y: number; alto: number;
  /** Rotación en grados por id de grupo (p. ej. { brazo_superior_der: -150, antebrazo_der: 20 }). */
  rot?: Record<string, number>;
  /** Desplazamiento (x, y en unidades del SVG) por id de grupo. */
  mueve?: Record<string, [number, number]>;
  cara?: "normal" | "platos" | "feliz";
  ocultar?: string[];
  espejo?: boolean;
  opacidad?: number;
};

export const PiezaSvg: React.FC<PiezaProps> = ({ piezas, nombre, x, y, alto, rot = {}, mueve = {}, cara, ocultar = [], espejo, opacidad = 1 }) => {
  const k = "p" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = piezas[nombre];
  if (!p) return null;
  const [, , vw, vh] = p.viewBox.split(/\s+/).map(Number);
  const ancho = (alto * vw) / vh;
  const ids = new Set([...Object.keys(rot), ...Object.keys(mueve)]);
  let css = "";
  for (const id of ids) css += `.${k} #${id}{transform:translate(${(mueve[id] ?? [0, 0])[0]}px,${(mueve[id] ?? [0, 0])[1]}px) rotate(${rot[id] ?? 0}deg) !important}`;
  if (cara) css += `.${k} #cara_normal,.${k} #cara_platos,.${k} #cara_feliz{display:none}.${k} #cara_${cara}{display:inline}`;
  for (const id of ocultar) css += `.${k} #${id}{display:none}`;
  return (
    <g className={k} opacity={opacidad} transform={espejo ? `translate(${2 * x + ancho} 0) scale(-1 1)` : undefined}>
      <style>{css}</style>
      <svg x={x} y={y} width={ancho} height={alto} viewBox={p.viewBox} overflow="visible" dangerouslySetInnerHTML={{ __html: p.inner }} />
    </g>
  );
};
