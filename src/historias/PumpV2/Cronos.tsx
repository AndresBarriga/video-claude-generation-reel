// Rehook con cifra comparada: dos cronómetros de recuperación de la mitad del oxígeno: ÉLITE se para en 8 s, INTERMEDIO sigue hasta 47 s (Fryer 2015).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FondoInfo, INFO } from "../../piezas/kit";
import { ei, type P, cl } from "./comun";
import { Macro } from "./Macro";

const Caja: React.FC<{ s: number; et: string; col: string; parado: boolean; k: number }> = ({ s, et, col, parado, k }) => (
  <div style={{ width: 420, textAlign: "center", opacity: Math.min(1, k * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, k)})` }}>
    <div style={{ fontFamily: "Figtree", fontWeight: 800, fontSize: 34, letterSpacing: 4, color: "#C9D1DC", marginBottom: 10 }}>{et}</div>
    <div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 130, background: "#0D1424", border: `6px solid ${col}`, borderRadius: 30, padding: "6px 0", color: col, boxShadow: parado ? `0 0 40px ${col}` : "none" }}>{Math.floor(s)} s</div>
  </div>
);

export const Cronos: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fE = pal("estudio") ?? 50, fO = pal("ocho") ?? 110, fS7 = pal("siete") ?? 200, fP = pal("aguantan") ?? 20;
  const fondo = ei(f, fE - 10, fE, 0, 1);
  const a = interpolate(f, [fE + 6, fO + 6], [0, 8], cl), b = interpolate(f, [fE + 6, fS7 + 6], [0, 47], cl);
  return (
    <AbsoluteFill>
      {fondo < 1 && <Macro bomba={1.3} aprieta={0.7} flujo={0.3} residuos={0.4} />}
      <div style={{ position: "absolute", inset: 0, opacity: fondo }}><FondoInfo /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: fondo, fontFamily: "Figtree", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#fff" }}>RECUPERAR LA MITAD DEL OXÍGENO</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 50 }}>
        <Caja s={a} et="ÉLITE" col={INFO.verde} parado={f > fO + 6} k={(f - fE) / 8} />
        <Caja s={b} et="INTERMEDIO" col={INFO.naranja} parado={f > fS7 + 6} k={(f - fE - 4) / 8} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", opacity: ei(f, fS7 + 8, fS7 + 16, 0, 1), fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 90, color: INFO.naranja }}>×6</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", opacity: fondo * 0.8, fontFamily: "Figtree", fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#C9D1DC" }}>ESTUDIO CON 44 ESCALADORES</div>
      {f < fE && <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 100, color: "#fff", opacity: ei(f, fP - 4, fP + 4, 0, 1), WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill" }}>¿Y LOS OTROS?</div>}
    </AbsoluteFill>
  );
};
