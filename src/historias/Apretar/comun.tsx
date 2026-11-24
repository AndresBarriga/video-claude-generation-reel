// E78 «Agarre». Estilo propio: fondo claro de «hoja de estudio» (papel con cuadrícula) y el DINAMÓMETRO como hilo:
// su aguja marca cada dato (apretar, −5 kg, 51/31, ¿?? kg). Reparto nuevo: Nora (protagonista) y Dani.
import React from "react";
import { Easing, interpolate } from "remotion";
import type { Aspecto } from "../../piezas/Rasgos";
export { Svg, golpe, type P } from "../Pegue/comun";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const sale = (k: number) => 1 - Math.pow(1 - c01(k), 3);
/** Aparición con rebote (k en fotogramas: 0 → 1 en ~12). */
export const pop = (k: number) => (k <= 0 ? 0 : k >= 12 ? 1 : interpolate(k, [0, 7, 12], [0, 1.12, 1], { ...cl, easing: Easing.out(Easing.quad) }));
export const F = "Bricolage Grotesque";
export const COL = { tinta: "#14213A", papel: "#F6F1E7", cuadri: "#E3DACB", azul: "#2F6FD6", rojo: "#EE4B4B", verde: "#2FB36B", naranja: "#FF6A1F", amarillo: "#FFC93C", menta: "#3CC9B0", gris: "#8E97A6", crema: "#FFFDF8" };
export const T = COL.tinta;

/** Nora: protagonista (chaqueta azul, rizos castaños). Dani: el de la tarjeta de referencia (barba, gorro mostaza). */
export const NORA: Aspecto = { chaqueta: "#2F6FD6", chaquetaSombra: "#1F4FA3", pantalon: "#2A2F3A", casco: null, pelo: "#6B3A1E", peinado: "rizado", piel: "#E0AE86", pielSombra: "#BE8A63", manos: "piel" } as Aspecto;
export const DANI: Aspecto = { chaqueta: "#3CC9B0", chaquetaSombra: "#279483", pantalon: "#33302C", casco: null, gorro: "#E8A33C", pelo: "#2A1E16", peinado: "corto", barba: "#2A1E16", piel: "#B97F57", pielSombra: "#94613E", manos: "piel" } as Aspecto;
export const PIEL = { piel: "#E0AE86", pielS: "#BE8A63" };

/** Fondo «hoja de estudio»: papel claro con cuadrícula y viñeta suave. */
export const Papel: React.FC<{ tono?: string }> = ({ tono = COL.papel }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2320} fill={tono} />
    {Array.from({ length: 30 }).map((_, i) => <path key={`v${i}`} d={`M${-60 + i * 60} -200 V2120`} stroke={COL.cuadri} strokeWidth={i % 5 ? 2 : 4} />)}
    {Array.from({ length: 40 }).map((_, i) => <path key={`h${i}`} d={`M-200 ${-60 + i * 60} H1280`} stroke={COL.cuadri} strokeWidth={i % 5 ? 2 : 4} />)}
    <defs><radialGradient id="ap-vi" cx="540" cy="900" r="1200" gradientUnits="userSpaceOnUse"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#3B2A10" stopOpacity="0.18" /></radialGradient></defs>
    <rect x={-200} y={-200} width={1480} height={2320} fill="url(#ap-vi)" />
  </g>
);

/** DINAMÓMETRO de mano (coordenadas propias: centro de la esfera en 0,0; el mango baja hasta y≈560).
 *  kg = lo que marca la aguja (0–90) · texto = sustituye a la cifra de la ventana («¿??») · aprieta 0–1 = el mango móvil se cierra. */
export const Dinamometro: React.FC<{ x: number; y: number; s?: number; kg: number; texto?: string; aprieta?: number; color?: string; rojo?: number; mango?: boolean }> = ({ x, y, s = 1, kg, texto, aprieta = 0, color = "#E9EDF2", rojo = 0, mango = true }) => {
  const R = 190, a = (v: number) => (-225 + (c01(v / 90) * 270)) * (Math.PI / 180);
  const ag = a(kg), dx = 26 * aprieta;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {mango && <g>
        {/* cuerpo y mango: barra fija (izq.) y barra móvil (der.) que se acerca al apretar */}
        <rect x={-60} y={R - 30} width={120} height={110} rx={20} fill="#3A4557" stroke={T} strokeWidth={12} />
        <rect x={-110} y={R + 60} width={70} height={420} rx={34} fill="#4C5A70" stroke={T} strokeWidth={12} />
        <rect x={60 - dx} y={R + 60} width={64} height={420} rx={30} fill={COL.rojo} stroke={T} strokeWidth={12} />
        <path d={`M-40 ${R + 90} H${60 - dx} M-40 ${R + 450} H${60 - dx}`} stroke="#9AA6B8" strokeWidth={14} />
      </g>}
      <circle r={R + 22} fill="#3A4557" stroke={T} strokeWidth={14} />
      <circle r={R} fill={color} />
      <path d={`M${R * Math.cos(a(60))} ${R * Math.sin(a(60))} A${R} ${R} 0 0 1 ${R * Math.cos(a(90))} ${R * Math.sin(a(90))} L0 0 Z`} fill={COL.rojo} opacity={0.15 + 0.6 * rojo} />
      {Array.from({ length: 19 }).map((_, i) => { const an = a(i * 5), l = i % 2 ? 18 : 34; return <path key={i} d={`M${(R - 8) * Math.cos(an)} ${(R - 8) * Math.sin(an)} L${(R - 8 - l) * Math.cos(an)} ${(R - 8 - l) * Math.sin(an)}`} stroke={T} strokeWidth={i % 2 ? 5 : 8} strokeLinecap="round" />; })}
      {[30, 60].map((v) => <text key={v} x={(R - 74) * Math.cos(a(v))} y={(R - 74) * Math.sin(a(v)) + 14} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={38} fill={T}>{v}</text>)}
      <rect x={-92} y={56} width={184} height={74} rx={14} fill={T} />
      <text x={0} y={113} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={58} fill={texto ? COL.amarillo : "#fff"}>{texto ?? `${Math.round(kg)} kg`}</text>
      <path d={`M${-16 * Math.sin(ag)} ${16 * Math.cos(ag)} L${(R - 30) * Math.cos(ag)} ${(R - 30) * Math.sin(ag)} L${16 * Math.sin(ag)} ${-16 * Math.cos(ag)} Z`} fill={COL.naranja} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      <circle r={26} fill={T} /><circle r={10} fill={COL.naranja} />
    </g>
  );
};

/** Rótulo de dato con fondo (pantalla, HTML). */
export const Dato: React.FC<{ t: string; x: number; y: number; k: number; fondo?: string; color?: string; tam?: number; rot?: number }> = ({ t, x, y, k, fondo = COL.crema, color = T, tam = 64, rot = 0 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e}) rotate(${rot}deg)`, fontFamily: F, fontWeight: 800, fontSize: tam, color, background: fondo, border: `7px solid ${T}`, borderRadius: 28, padding: "6px 26px 10px", whiteSpace: "nowrap", boxShadow: `0 10px 0 ${T}33` }}>{t}</div>;
};
/** Cifra enorme con contorno (pantalla). */
export const Grande: React.FC<{ t: string; x: number; y: number; k: number; color?: string; tam?: number }> = ({ t, x, y, k, color = COL.naranja, tam = 230 }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x - 520, top: y - tam * 0.62, width: 1040, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: tam, color, WebkitTextStroke: `16px ${T}`, paintOrder: "stroke fill", transform: `scale(${e})`, textShadow: `0 14px 0 ${T}33`, lineHeight: 1 }}>{t}</div>;
};
