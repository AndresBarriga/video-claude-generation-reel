// KIT · INFO (2): pasos con candados, tarjetas ✓/✗, cronómetros, rayos X y el cierre (guardar + hoja de enviar).
import React from "react";
import { useCurrentFrame } from "remotion";
import { INFO } from "./Info";

const cl = (v: number) => Math.max(0, Math.min(1, v));
const sale = (k: number) => 1 - Math.pow(1 - cl(k), 3);
const fuente: React.CSSProperties = { fontFamily: "Figtree", fontWeight: 800, color: "#fff" };

/** Progreso 1-2-3: `hechos` con ✓, `actual` encendido, el resto con candado. */
export const Pasos: React.FC<{ n?: number; actual: number; y?: number; k?: number }> = ({ n = 3, actual, y = 380, k = 1 }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 0, opacity: cl(k * 3) }}>
    {Array.from({ length: n }, (_, i) => {
      const hecho = i + 1 < actual, vivo = i + 1 === actual;
      return (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: 90, height: 6, background: hecho || vivo ? INFO.verde : "#3A4660" }} />}
          <div style={{ ...fuente, width: 76, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: hecho ? INFO.verde : vivo ? INFO.naranja : "#1A2236", border: `4px solid ${vivo ? "#fff" : "#3A4660"}`, transform: `scale(${vivo ? 1.15 : 1})` }}>{hecho ? "✓" : vivo ? i + 1 : "🔒"}</div>
        </React.Fragment>
      );
    })}
  </div>
);

/** Tarjeta ✓ (bien) o ✗ (mal) con título y subtítulo. */
export const Tarjeta: React.FC<{ ok: boolean; titulo: string; sub?: string; x: number; y: number; k: number; ancho?: number }> = ({ ok, titulo, sub, x, y, k, ancho = 400 }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: x - ancho / 2, top: y, width: ancho, padding: "34px 20px", borderRadius: 34, background: ok ? "#123524" : "#3A1518", border: `5px solid ${ok ? INFO.verde : INFO.rojo}`, textAlign: "center", opacity: cl(k * 3), transform: `scale(${0.6 + 0.4 * sale(k * 2)})` }}>
    <div style={{ ...fuente, width: 120, height: 120, margin: "0 auto 18px", borderRadius: 60, background: ok ? INFO.verde : INFO.rojo, fontSize: 80, lineHeight: "120px" }}>{ok ? "✓" : "✕"}</div>
    <div style={{ ...fuente, fontSize: 48, letterSpacing: 2 }}>{titulo.toUpperCase()}</div>
    {sub && <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 30, color: "#C9D1DC", marginTop: 6 }}>{sub}</div>}
  </div>
);

/** Dos cronómetros que corren hasta su tiempo (segundos): «tú» frente a «escalador». */
export const Cronos: React.FC<{ a: number; b: number; etA?: string; etB?: string; y: number; k: number }> = ({ a, b, etA = "TÚ", etB = "ESCALADOR", y, k }) => {
  if (k <= 0) return null;
  const mm = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`, t = sale(k);
  const caja = (s: number, et: string, col: string) => (
    <div style={{ width: 400, textAlign: "center" }}>
      <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#C9D1DC", marginBottom: 10 }}>{et}</div>
      <div style={{ ...fuente, fontSize: 110, background: "#0D1424", border: `5px solid ${col}`, borderRadius: 28, padding: "8px 0", color: col }}>{mm(s * t)}</div>
    </div>
  );
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 60, opacity: cl(k * 3) }}>{caja(a, etA, INFO.naranja)}{caja(b, etB, INFO.verde)}</div>;
};

/** Rayos X: envuelve un dibujo (HTML o SVG a pantalla completa) y lo vuelve «radiografía» azul brillante. */
export const RayosX: React.FC<{ k?: number; children: React.ReactNode }> = ({ k = 1, children }) => (
  <div style={{ position: "absolute", inset: 0, filter: k > 0 ? `grayscale(${k}) invert(${0.92 * k}) sepia(${0.3 * k}) hue-rotate(${170 * k}deg) brightness(${1 + 0.25 * k}) drop-shadow(0 0 ${14 * k}px #7FD3FF)` : undefined }}>{children}</div>
);

/** Cierre: icono de guardar que late + texto «GUÁRDALO». */
export const Guardar: React.FC<{ k: number; y?: number; texto?: string }> = ({ k, y = 700, texto = "GUÁRDALO" }) => {
  const f = useCurrentFrame();
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: cl(k * 3), transform: `scale(${0.7 + 0.3 * sale(k * 2) + 0.03 * Math.sin(f / 4)})` }}>
      <svg width={220} height={260} viewBox="0 0 220 260"><path d="M30 20 H190 V240 L110 180 L30 240 Z" fill={sale(k * 1.5) > 0.9 ? INFO.naranja : "none"} stroke="#fff" strokeWidth={18} strokeLinejoin="round" /></svg>
      <div style={{ ...fuente, fontSize: 56, letterSpacing: 4, marginTop: 10 }}>{texto}</div>
    </div>
  );
};

/** Hoja de enviar (genérica, no la de IG): avatares, uno se marca y se pulsa «Enviar». `para` = a quién (rótulo encima). */
export const HojaEnviar: React.FC<{ k: number; para?: string }> = ({ k, para }) => {
  if (k <= 0) return null;
  const e = sale(k * 1.5), sel = k > 0.45, env = k > 0.8, cols = ["#E57373", "#64B5F6", "#81C784", "#FFB74D", "#BA68C8", "#4DB6AC"];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 260 - 400 * (1 - e), padding: "40px 40px 46px", borderRadius: 48, background: "#1C2333", boxShadow: "0 -20px 60px rgba(0,0,0,.5)" }}>
      {para && <div style={{ ...fuente, fontSize: 40, textAlign: "center", marginBottom: 30 }}>{para}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 36 }}>
        {cols.map((c, i) => (
          <div key={i} style={{ position: "relative", width: 140, height: 140, borderRadius: 70, background: c, border: sel && i === 1 ? "8px solid #fff" : "8px solid transparent", transform: `scale(${sel && i === 1 ? 1.1 : 1})` }}>
            <div style={{ position: "absolute", left: 45, top: 22, width: 50, height: 50, borderRadius: 25, background: "rgba(255,255,255,.75)" }} />
            <div style={{ position: "absolute", left: 28, top: 80, width: 84, height: 44, borderRadius: "42px 42px 10px 10px", background: "rgba(255,255,255,.75)" }} />
            {sel && i === 1 && <div style={{ ...fuente, position: "absolute", right: -8, bottom: -8, width: 52, height: 52, borderRadius: 26, background: INFO.azul, fontSize: 32, textAlign: "center", lineHeight: "52px" }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ ...fuente, marginTop: 40, borderRadius: 24, padding: "22px 0", textAlign: "center", fontSize: 44, background: env ? INFO.verde : INFO.azul, transform: `scale(${env ? 0.96 : 1})` }}>{env ? "✓ Enviado" : "Enviar"}</div>
    </div>
  );
};
