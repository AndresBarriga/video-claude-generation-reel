// KIT · MONTAJE: piezas de gancho, comparación y cierre que se repiten en todos los vídeos (coordenadas de PANTALLA salvo Foco).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Etiqueta, PC } from "./base";

/** Rótulo-PREGUNTA del gancho: ya está en pantalla en el fotograma 0 (decisión 16-nov: funciona). Máx. ~4 palabras. */
export const Pregunta: React.FC<{ texto: string; top?: number; tam?: number; hasta?: number }> = ({ texto, top = 300, tam = 110, hasta }) => {
  const f = useCurrentFrame();
  return hasta !== undefined && f > hasta + 6 ? null : <div style={{ opacity: hasta === undefined ? 1 : interpolate(f, [hasta, hasta + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}><Etiqueta texto={texto} top={top} tam={tam} desde={-15} /></div>;
};
/** Píldora de texto (dato, «CÁMARA LENTA», envío). `abajo` la coloca sobre los subtítulos. k 0–1 = aparición. */
export const Chip: React.FC<{ texto: string; top?: number; k?: number; color?: string; tam?: number }> = ({ texto, top = 1500, k = 1, color = "rgba(5,11,20,.82)", tam = 50 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 24}px)` }}>
    <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: tam, color: "#fff", background: color, borderRadius: 44, padding: "14px 36px", whiteSpace: "nowrap" }}>{texto}</div>
  </div>
);
/** Cierre de ENVÍO: «Mándaselo a quien te asegura» (va en rótulo, no en la voz). */
export const Envio: React.FC<{ a?: string; k?: number; top?: number }> = ({ a = "quien te asegura", k = 1, top = 1500 }) => <Chip texto={`Mándaselo a ${a}`} k={k} top={top} />;
/** Sello ✓ / ✗ (pantalla). k 0–1 = aparición con rebote. */
export const Sello: React.FC<{ x: number; y: number; ok?: boolean; k?: number; s?: number }> = ({ x, y, ok, k = 1, s = 1 }) => {
  const e = k <= 0 ? 0 : 1 + 0.35 * Math.sin(Math.min(1, k) * Math.PI) * (1 - Math.min(1, k)) + 0, col = ok ? "#3FA76A" : PC.miedo;
  return (
    <svg style={{ position: "absolute", left: x - 90 * s, top: y - 90 * s, opacity: Math.min(1, k * 3), transform: `scale(${e * Math.min(1, 0.4 + k * 2)})` }} width={180 * s} height={180 * s} viewBox="-90 -90 180 180">
      <circle r={70} fill={col} stroke="#050B14" strokeWidth={12} />
      <path d={ok ? "M-32 2 L-8 28 L34 -24" : "M-26 -26 L26 26 M26 -26 L-26 26"} stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
/** PANTALLA PARTIDA «así no / así»: cada lado es un plano completo (compuesto para x = 540) del que se ve la franja central.
 *  `corte` 0–1 = cuánto ha entrado la mitad derecha (0 = solo la izquierda a pantalla completa). */
export const Partida: React.FC<{ izq: React.ReactNode; der: React.ReactNode; rotulos?: [string, string]; sellos?: boolean; corte?: number; top?: number }> = ({ izq, der, rotulos, sellos = true, corte = 1, top = 250 }) => {
  const d = 270 * corte;
  const rot = (t: string, x: number, col: string) => <div style={{ position: "absolute", top, left: x - 270, width: 540, textAlign: "center", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 76, color: col, WebkitTextStroke: "9px #050B14", paintOrder: "stroke fill", opacity: corte }}>{t}</div>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-d}px)`, clipPath: `inset(0 ${d}px 0 ${d}px)` }}>{izq}</AbsoluteFill>
      {corte > 0 && <AbsoluteFill style={{ transform: `translateX(${810 - 540 * corte + 270 * (1 - corte) * 2}px)`, clipPath: "inset(0 270px 0 270px)" }}>{der}</AbsoluteFill>}
      {corte > 0 && <div style={{ position: "absolute", top: 0, bottom: 0, left: 540 - 7 + 540 * (1 - corte), width: 14, background: "#050B14" }} />}
      {rotulos && rot(rotulos[0], 270, "#FF8E7E")}{rotulos && rot(rotulos[1], 810, "#8FE0AE")}
      {sellos && rotulos && <><Sello x={270} y={top + 190} k={corte} s={0.8} /><Sello x={810} y={top + 190} ok k={corte} s={0.8} /></>}
    </AbsoluteFill>
  );
};
/** FOCO (coordenadas de MUNDO, dentro de <Plano>): anillo que late sobre el detalle que hay que mirar. */
export const Foco: React.FC<{ x: number; y: number; r?: number; k?: number; color?: string }> = ({ x, y, r = 70, k = 1, color = "#FFE3A0" }) => {
  const f = useCurrentFrame(), p = 1 + 0.08 * Math.sin(f / 4);
  return k <= 0 ? null : <g opacity={Math.min(1, k)}><circle cx={x} cy={y} r={r * p * (2 - Math.min(1, k))} fill="none" stroke="#050B14" strokeWidth={16} /><circle cx={x} cy={y} r={r * p * (2 - Math.min(1, k))} fill="none" stroke={color} strokeWidth={8} strokeDasharray="26 14" /></g>;
};
/** LUPA: círculo de detalle (pantalla) que amplía lo que pongas dentro (un primer plano del kit). k 0–1 = aparición. */
export const Lupa: React.FC<{ x: number; y: number; r?: number; k?: number; fondo?: string; children: React.ReactNode }> = ({ x, y, r = 300, k = 1, fondo = "#4A515C", children }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", background: fondo, border: "14px solid #050B14", boxShadow: "0 0 0 8px #FFE3A0", transform: `scale(${Math.min(1, k) * (1 + 0.12 * Math.sin(Math.min(1, k) * Math.PI))})` }}>
    <svg viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`} width={2 * r} height={2 * r}>{children}</svg>
  </div>
);
