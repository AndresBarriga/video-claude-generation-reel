// E77 «Rocódromo vs roca». Reutiliza el rocódromo claro y a Lola de E72 (Miedo) y el decorado «roca» del kit.
// Hilo visual: barra de 3 RAZONES (la 3.ª con «?» hasta el final de la escena tres) + el 6b / 5+ que abre y cierra el vídeo.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Plano } from "../../piezas/kit";
import { VIA, COL, F, pop } from "../Miedo/comun";
export { Gym, VIA, LOLA, LEO, XA, cl, c01, pop, sale, COL, F, Svg, type P } from "../Miedo/comun";
export { Grande, Linea, Ficha } from "../Miedo/Ui";

export const T = COL.tinta;
/** Plano en roca (exterior de día) con la vía de E72. */
export const RocaP: React.FC<{ cx: number; cy: number; z: number; sh?: number; children?: React.ReactNode }> = (p) => <Plano via={VIA} decorado="roca" cintas {...p} />;
/** Gotas de sudor alrededor de (x, y) en pantalla. */
export const Sudor: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => {
  const f = useCurrentFrame();
  if (k <= 0) return null;
  return <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>{[0, 1, 2].map((i) => { const t = ((f + i * 9) % 27) / 27, dx = (i - 1) * 46; return <path key={i} d={`M${x + dx} ${y - 30 + t * 70} q-14 22 0 30 q14 -8 0 -30 Z`} fill="#7CC3FF" stroke={T} strokeWidth={4} opacity={1 - t} />; })}</svg>;
};
/** Barra de las 3 razones (abajo). actual 1–3; la 3.ª muestra «?» hasta `revela`. */
export const Razones: React.FC<{ actual: number; revela?: boolean; k?: number; top?: number }> = ({ actual, revela = false, k = 99, top = 1700 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26, transform: `scale(${e})` }}>
      {[1, 2, 3].map((i) => {
        const hecho = i < actual, vivo = i === actual, q = i === 3 && !revela;
        return <div key={i} style={{ width: 120, height: 120, borderRadius: 60, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: "#fff", background: hecho ? COL.verde : vivo ? COL.naranja : "rgba(20,33,58,.45)", border: `7px solid ${T}`, transform: `scale(${vivo ? 1.15 : 1})` }}>{hecho ? "✓" : q ? "?" : i}</div>;
      })}
    </div>
  );
};
/** Rótulo de grado enorme (6b, 5+…). */
export const GradoG: React.FC<{ t: string; x: number; y: number; k: number; color: string; tam?: number; rot?: number }> = ({ t, x, y, k, color, tam = 230, rot = 0 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x - 260, top: y - tam * 0.62, width: 520, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: tam, color, WebkitTextStroke: `14px ${T}`, paintOrder: "stroke fill", transform: `scale(${e}) rotate(${rot}deg)`, textShadow: "0 14px 0 rgba(20,33,58,.3)" }}>{t}</div>;
};
/** Etiqueta pequeña (pantalla). */
export const Etiq: React.FC<{ t: string; x: number; y: number; k: number; fondo?: string; color?: string; tam?: number }> = ({ t, x, y, k, fondo = COL.crema, color = T, tam = 48 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, fontFamily: F, fontWeight: 900, fontSize: tam, color, background: fondo, border: `6px solid ${T}`, borderRadius: 26, padding: "4px 22px 8px", whiteSpace: "nowrap" }}>{t}</div>;
};
export { VIA as V };
