// E72 · capa de información: MEDIDOR DE MIEDO (hilo de todo el vídeo), iconos dibujados y fichas ✓/✗. Coordenadas de pantalla.
import React from "react";
import { useCurrentFrame } from "remotion";
import { COL, F, c01, pop } from "./comun";

const T = COL.tinta;
/** Iconos simples de trazo grueso (caja 200×200, centro 100,100). */
export const ICONOS: Record<string, React.ReactNode> = {
  mosqueton: <g fill="none" stroke={T} strokeWidth={14} strokeLinecap="round"><path d="M70 30 Q40 30 40 70 V130 Q40 170 80 170 H110 Q160 170 160 120 V80 Q160 30 120 30 Z" fill="#C9D3DE" /><path d="M150 60 L120 120" stroke="#8796A8" strokeWidth={12} /></g>,
  cabeza: <g stroke={T} strokeWidth={12} strokeLinejoin="round"><path d="M100 20 Q160 20 165 85 L180 115 L160 120 V150 Q160 170 135 168 L125 168 V190 H60 V160 Q35 140 35 95 Q38 20 100 20 Z" fill="#FFD9B8" /><path d="M65 70 Q80 45 105 55 Q125 40 140 65 Q155 85 135 100 Q120 115 100 105 Q80 115 68 100 Q55 85 65 70 Z" fill={COL.rosa} strokeWidth={8} /></g>,
  puno: <g stroke={T} strokeWidth={12} strokeLinejoin="round" fill="#FFD9B8"><rect x={45} y={60} width={110} height={90} rx={26} /><path d="M70 60 V95 M100 60 V95 M128 60 V95" fill="none" /><path d="M45 110 Q20 105 25 80 Q30 62 55 70" /><rect x={65} y={148} width={70} height={36} rx={8} fill={COL.rosa} /></g>,
  bateria: <g stroke={T} strokeWidth={12} strokeLinejoin="round"><rect x={30} y={60} width={130} height={80} rx={14} fill="#fff" /><rect x={160} y={85} width={16} height={30} rx={4} fill={T} /><rect x={44} y={74} width={30} height={52} rx={6} fill={COL.rojo} stroke="none" /></g>,
  mano: <g stroke={T} strokeWidth={12} strokeLinejoin="round" fill="#FFD9B8"><path d="M60 180 V90 Q60 75 72 75 Q84 75 84 90 V40 Q84 26 96 26 Q108 26 108 40 V80 V34 Q108 20 120 20 Q132 20 132 34 V84 V50 Q132 38 144 38 Q156 38 156 50 V130 Q156 180 110 182 Z" /></g>,
  dedos: <g stroke={T} strokeWidth={12} strokeLinejoin="round"><rect x={20} y={60} width={160} height={50} rx={10} fill="#C89B6A" /><path d="M30 85 H170" stroke="#8E6A44" strokeWidth={8} /><g fill="#FFD9B8">{[55, 85, 115, 145].map((x) => <rect key={x} x={x - 13} y={80} width={26} height={90} rx={13} />)}</g></g>,
  pies: <g stroke={T} strokeWidth={12} strokeLinejoin="round"><path d="M30 120 Q30 80 80 80 H130 Q175 80 178 120 Q180 150 140 150 H55 Q30 150 30 120 Z" fill={COL.lila} /><path d="M30 130 H178" stroke={T} strokeWidth={10} /></g>,
  rodilla: <g fill="none" stroke={T} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round"><path d="M60 30 L100 105 L65 175" /><circle cx={100} cy={105} r={16} fill={COL.amarillo} /></g>,
  pierna: <g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M80 20 L95 100 L70 180" stroke="#24324F" strokeWidth={34} /><path d="M20 60 Q140 70 120 120 Q100 160 180 160" stroke={COL.rojo} strokeWidth={12} /></g>,
  cinta: <g stroke={T} strokeWidth={12} strokeLinecap="round" fill="none"><rect x={80} y={50} width={40} height={90} rx={12} fill={COL.menta} /><path d="M100 20 Q75 20 75 45 M100 160 Q75 160 75 185 Q75 195 100 195" /></g>,
  cuerdaArriba: <g fill="none" strokeLinecap="round"><path d="M40 20 H160" stroke={T} strokeWidth={14} /><path d="M100 20 V150" stroke={COL.naranja} strokeWidth={12} /><circle cx={100} cy={165} r={22} fill={COL.rosa} stroke={T} strokeWidth={10} /></g>,
  cintura: <g fill="none" strokeLinecap="round"><path d="M20 100 H70" stroke={T} strokeWidth={14} /><circle cx={110} cy={100} r={26} fill={COL.rosa} stroke={T} strokeWidth={10} /><path d="M45 100 V190" stroke={COL.naranja} strokeWidth={12} /></g>,
  encima: <g fill="none" strokeLinecap="round"><circle cx={110} cy={55} r={26} fill={COL.rosa} stroke={T} strokeWidth={10} /><path d="M20 150 H70" stroke={T} strokeWidth={14} /><path d="M45 150 V195 M45 150 Q90 120 110 80" stroke={COL.naranja} strokeWidth={12} /></g>,
  roca: <g stroke={T} strokeWidth={12} strokeLinejoin="round"><path d="M20 170 L60 50 L100 90 L130 30 L180 170 Z" fill="#9AA3AE" /><text x={110} y={140} fontFamily={F} fontWeight={900} fontSize={70} fill="#fff" stroke={T} strokeWidth={8} paintOrder="stroke">?</text></g>,
};
/** Ficha con icono y texto; ok true ✓ / false ✗ / undefined sin sello. k = fotogramas desde que aparece. tachar 0–1. */
export const Ficha: React.FC<{ icono: string; texto: string; x: number; y: number; k: number; ok?: boolean; s?: number; tachar?: number; activa?: boolean }> = ({ icono, texto, x, y, k, ok, s = 1, tachar = 0, activa = true }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${e * s})`, opacity: activa ? 1 : 0.45 }}>
      <div style={{ width: 300, padding: "18px 0 20px", borderRadius: 40, background: COL.crema, border: `8px solid ${T}`, boxShadow: "0 14px 0 rgba(20,33,58,.25)", textAlign: "center", position: "relative" }}>
        <svg width={180} height={180} viewBox="0 0 200 200">{ICONOS[icono]}</svg>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: texto.length > 9 ? 40 : 52, color: T, lineHeight: 1.05, padding: "0 12px" }}>{texto}</div>
        {ok !== undefined && <div style={{ position: "absolute", right: -26, top: -26, width: 96, height: 96, borderRadius: 48, background: ok ? COL.verde : COL.rojo, border: `7px solid ${T}`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 60, lineHeight: "84px" }}>{ok ? "✓" : "✕"}</div>}
        {tachar > 0 && <div style={{ position: "absolute", left: 20, top: "48%", width: `${tachar * 86}%`, height: 16, borderRadius: 8, background: COL.rojo, transform: "rotate(-14deg)" }} />}
      </div>
    </div>
  );
};
/** Texto grande con caja (frase del gancho, cifras, preguntas). */
export const Grande: React.FC<{ t: string; top: number; k: number; tam?: number; fondo?: string; color?: string }> = ({ t, top, k, tam = 120, fondo = COL.amarillo, color = T }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: tam, color, background: fondo, border: `9px solid ${T}`, borderRadius: 36, padding: "6px 40px 12px", lineHeight: 1.02, textAlign: "center", boxShadow: "0 16px 0 rgba(20,33,58,.3)", whiteSpace: "pre" }}>{t}</div>
    </div>
  );
};
/** Píldora ✓/✗ con texto (lista de la caída). */
export const Linea: React.FC<{ t: string; ok: boolean; top: number; k: number; icono?: string }> = ({ t, ok, top, k, icono }) => {
  const e = pop(k);
  if (e <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 60, display: "flex", alignItems: "center", gap: 16, transform: `translateX(${(1 - e) * -200}px)`, opacity: c01(e) }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: ok ? COL.verde : COL.rojo, border: `7px solid ${T}`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "80px" }}>{ok ? "✓" : "✕"}</div>
      {icono && <div style={{ width: 104, height: 104, borderRadius: 26, background: COL.crema, border: `6px solid ${T}` }}><svg width={92} height={92} viewBox="0 0 200 200">{ICONOS[icono]}</svg></div>}
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 54, color: T, background: COL.crema, border: `6px solid ${T}`, borderRadius: 28, padding: "6px 22px 10px", whiteSpace: "nowrap" }}>{t}</div>
    </div>
  );
};
/** MEDIDOR DE MIEDO: termómetro vertical a la derecha con cara que cambia. v 0 (calma) – 1 (pánico). */
export const MedidorMiedo: React.FC<{ v: number; o?: number }> = ({ v, o = 1 }) => {
  const f = useCurrentFrame(), x = 958, top = 640, H = 640, vv = c01(v) + (v > 0.7 ? 0.015 * Math.sin(f * 1.3) : 0);
  const col = vv > 0.66 ? COL.rojo : vv > 0.36 ? COL.naranja : COL.verde, boca = 30 - 60 * vv;
  if (o <= 0) return null;
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: o }}>
      <rect x={x - 44} y={top} width={88} height={H} rx={44} fill={COL.crema} stroke={T} strokeWidth={8} />
      <rect x={x - 28} y={top + 16 + (H - 32) * (1 - vv)} width={56} height={(H - 32) * vv} rx={28} fill={col} />
      {[0.33, 0.66].map((t) => <path key={t} d={`M${x - 44} ${top + H * t} h22`} stroke={T} strokeWidth={6} />)}
      <g transform={`translate(${x} ${top - 74})`}>
        <circle r={66} fill={col} stroke={T} strokeWidth={8} />
        <circle cx={-22} cy={-14} r={9} fill={T} /><circle cx={22} cy={-14} r={9} fill={T} />
        {vv > 0.66 && <path d="M-36 -40 L-12 -30 M36 -40 L12 -30" stroke={T} strokeWidth={7} strokeLinecap="round" />}
        <path d={`M-26 ${24 - boca / 3} Q0 ${24 + boca / 2} 26 ${24 - boca / 3}`} stroke={T} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      <text x={x} y={top + H + 62} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={T} stroke={COL.crema} strokeWidth={10} paintOrder="stroke">MIEDO</text>
    </svg>
  );
};
/** Progreso 1-2-3 en columna, pequeño y translúcido, bajo el medidor (no tapa la acción). */
export const PasosV: React.FC<{ actual: number }> = ({ actual }) => (
  <div style={{ position: "absolute", left: 958 - 46, top: 1420, width: 92, padding: "12px 0", borderRadius: 46, background: "rgba(20,33,58,.55)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    {[1, 2, 3].map((i) => {
      const hecho = i < actual, vivo = i === actual;
      return <div key={i} style={{ width: 64, height: 64, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 36, color: "#fff", background: hecho ? COL.verde : vivo ? COL.naranja : "rgba(255,255,255,.18)", border: `4px solid ${vivo ? "#fff" : "transparent"}`, transform: `scale(${vivo ? 1.12 : 1})` }}>{hecho ? "✓" : vivo ? i : "🔒"}</div>;
    })}
  </div>
);
