// CTA: vuelve el primer plano, ahora la mano aguanta. Guardar + hoja de enviar; «¿Cuál de las tres no haces?» con las tres opciones para comentar.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Guardar, HojaEnviar } from "../../piezas/kit";
import { Macro } from "./Macro";
import { ei, type P } from "./comun";

const Op: React.FC<{ n: number; t: string; k: number }> = ({ n, t, k }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(11,22,36,.9)", border: "4px solid #fff", borderRadius: 60, padding: "16px 40px", opacity: Math.min(1, k * 2), transform: `translateX(${(1 - Math.min(1, k)) * 60}px)` }}>
    <span style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 60, color: "#F5A524" }}>{n}</span>
    <span style={{ fontFamily: "Figtree", fontWeight: 800, fontSize: 48, color: "#fff" }}>{t}</span>
  </div>
);
export const Cta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fM = pal("mándaselo") ?? 30, fC = pal("cuál") ?? 160;
  return (
    <AbsoluteFill>
      <Macro bomba={0.4} abre={0} calor={0} z={1.05} />
      <div style={{ opacity: 1 - ei(f, fM - 4, fM + 2, 0, 1) }}><Guardar k={f / 8} y={560} /></div>
      <div style={{ opacity: 1 - ei(f, fC - 8, fC, 0, 1) }}><HojaEnviar k={(f - fM) / 40} para="Al que llega reventado a la cadena" /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Op n={1} t="Brazos estirados" k={(f - fC) / 8} />
        <Op n={2} t="Brazo abajo y sacude" k={(f - fC - 5) / 8} />
        <Op n={3} t="Escala suave" k={(f - fC - 10) / 8} />
        <div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 70, color: "#fff", opacity: ei(f, fC + 14, fC + 22, 0, 1), WebkitTextStroke: "8px #050B14", paintOrder: "stroke fill" }}>👇 ¿Cuál no haces?</div>
      </div>
    </AbsoluteFill>
  );
};
