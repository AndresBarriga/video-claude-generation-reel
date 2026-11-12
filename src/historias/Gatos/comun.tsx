// E58 «180 € para sufrir» (pies de gato). Piezas comunes: reparto, cámara, luz del día, rótulos.
// Idea visual: el CORTE del gato (se ve el pie por dentro: huesos, dedos en garra, hueco en amarillo, dolor en rojo).
// Escenarios nuevos: tienda de escalada (Tienda.tsx) y placa de granito con la hora del día avanzando (Placa.tsx).
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Angulos } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { fuenteTexto, fuenteTitulo } from "../../tema";
export { C, Svg, clamp, golpe, W, H, Cuerda, type P } from "../Pegue/comun";

export const T = "#0B1624";
export const G = { gato: "#E2B93B", gatoS: "#B08A1E", goma: "#14181F", dentro: "#1A3A5F", hueco: "#F4D03F", dolor: "#E5484D", bien: "#4CC38A", piel: "#E3B089", pielS: "#C48E66", hueso: "#FBF4E6" };

/* ---- reparto (nuevo) ---- */
export const TU: Aspecto = { chaqueta: "#3F8F63", chaquetaSombra: "#2C6A48", pantalon: "#2E3440", casco: null, gorro: "#C74B3A", pelo: "#4A2F1E", peinado: "corto", barba: "#4A2F1E", piel: G.piel, pielSombra: G.pielS, manos: "piel", arnes: false };
export const TU_ROCA: Aspecto = { ...TU, casco: "#F2EFE6", gorro: undefined, arnes: true };
export const DEP: Aspecto = { chaqueta: "#2E6E86", chaquetaSombra: "#1F4E60", pantalon: "#2A2F3A", casco: null, pelo: "#241710", peinado: "melena", piel: "#B9825A", pielSombra: "#94613E", manos: "piel", arnes: false, gafas: true };
export const ELLA: Aspecto = { chaqueta: "#C8553D", chaquetaSombra: "#8F3A29", pantalon: "#33384A", casco: "#5FA8D3", pelo: "#2A1B14", peinado: "melena", piel: "#C99A72", pielSombra: "#A67A55", manos: "piel" };

/** Cámara: (cx, cy) del mundo al centro de la zona de acción con zoom z. */
export const cam = (cx: number, cy: number, z: number, py = 880) => `translate(540 ${py}) scale(${z}) translate(${-cx} ${-cy})`;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = (a: Angulos, b: Angulos, t: number): Angulos => ({
  torso: lerp(a.torso, b.torso, t), cabeza: lerp(a.cabeza, b.cabeza, t),
  brazoA: [lerp(a.brazoA[0], b.brazoA[0], t), lerp(a.brazoA[1], b.brazoA[1], t)], brazoB: [lerp(a.brazoB[0], b.brazoB[0], t), lerp(a.brazoB[1], b.brazoB[1], t)],
  piernaA: [lerp(a.piernaA[0], b.piernaA[0], t), lerp(a.piernaA[1], b.piernaA[1], t)], piernaB: [lerp(a.piernaB[0], b.piernaB[0], t), lerp(a.piernaB[1], b.piernaB[1], t)],
});
/** Cinemática inversa de dos segmentos (convención de Escalador: 0 = abajo, 90 = +x). `o` = origen relativo a la cadera. */
export const ik = (o: [number, number], tx: number, ty: number, L1: number, L2: number, codo: 1 | -1): [number, number] => {
  const dx = tx - o[0], dy = ty - o[1], d = Math.min(L1 + L2 - 0.5, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const a1 = base + codo * al, e = [o[0] + Math.sin(a1) * L1, o[1] + Math.cos(a1) * L1];
  return [(a1 * 180) / Math.PI, (Math.atan2(tx - e[0], ty - e[1]) * 180) / Math.PI];
};
export const hombro = (torso: number): [number, number] => [Math.sin(((180 - torso) * Math.PI) / 180) * 88, Math.cos(((180 - torso) * Math.PI) / 180) * 88];
export const brazo = (torso: number, tx: number, ty: number, codo: 1 | -1 = -1) => ik(hombro(torso), tx, ty, 52, 50, codo);
export const pierna = (tx: number, ty: number, rodilla: 1 | -1 = 1) => ik([0, 0], tx, ty, 66, 64, rodilla);

/** Rótulo de dato (arriba). Entra con muelle. */
export const Rotulo: React.FC<{ texto: string; desde?: number; top?: number; tam?: number; color?: string; sub?: React.ReactNode }> = ({ texto, desde = 0, top = 230, tam = 150, color = "#fff", sub }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 12, stiffness: 190 } });
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", top, left: 40, right: 40, textAlign: "center", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * -30}px) scale(${0.85 + 0.15 * s})` }}>
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: tam, lineHeight: 1, color, WebkitTextStroke: "12px #050B14", paintOrder: "stroke fill", fontVariantNumeric: "tabular-nums" }}>{texto}</div>
      {sub && <div style={{ marginTop: 14, display: "inline-block", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 46, color: "#fff", background: "rgba(5,11,20,.78)", borderRadius: 40, padding: "8px 30px", letterSpacing: 1, fontVariantNumeric: "tabular-nums" }}>{sub}</div>}
    </div>
  );
};
/** Píldora de etiqueta (en coordenadas de pantalla). */
export const Pildora: React.FC<{ x: number; y: number; texto: string; color: string; desde?: number; tam?: number; tinta?: string }> = ({ x, y, texto, color, desde = 0, tam = 50, tinta = "#06101C" }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 11, stiffness: 200 } });
  if (f < desde) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: fuenteTitulo, fontWeight: 800, fontSize: tam, color: tinta, background: color, border: "6px solid #06101C", borderRadius: 40, padding: "6px 26px", whiteSpace: "nowrap", letterSpacing: 1 }}>{texto}</div>;
};
