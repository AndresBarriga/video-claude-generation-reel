// Bloques de información sobre fondo oscuro: reencuadre (✗ MATERIAL → ✓ CÓMO SE COLOCA + aparecen los candados) y repaso 1-2-3.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FondoInfo, Pasos, Tarjeta, Cifra, INFO } from "../../piezas/kit";
import { type P } from "./comun";

export const Reencuadre: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("coloca") ?? 34, fT = pal("tres") ?? 52;
  return (
    <AbsoluteFill>
      <FondoInfo />
      <Tarjeta ok={false} titulo="La cinta" sub="el material aguanta" x={290} y={820} k={(f - 2) / 8} ancho={440} />
      <Tarjeta ok titulo="Cómo se coloca" sub="aquí está el fallo" x={790} y={820} k={(f - fC + 4) / 8} ancho={440} />
      <Pasos actual={0} y={430} k={(f - fT + 6) / 8} />
      <Cifra texto="3" etiqueta="ERRORES AL CHAPAR" y={1260} k={(f - fT + 2) / 8} color={INFO.naranja} tam={170} />
    </AbsoluteFill>
  );
};

const Linea: React.FC<{ n: number; txt: string; sub: string; k: number; y: number }> = ({ n, txt, sub, k, y }) => k <= 0 ? null : (
  <div style={{ position: "absolute", left: 110, right: 110, top: y, display: "flex", alignItems: "center", gap: 34, opacity: Math.min(1, k * 3), transform: `translateX(${(1 - Math.min(1, k * 2)) * 80}px)` }}>
    <div style={{ width: 110, height: 110, borderRadius: 55, background: INFO.verde, color: "#fff", fontFamily: "Figtree", fontWeight: 800, fontSize: 64, textAlign: "center", lineHeight: "110px", flex: "none" }}>✓</div>
    <div><div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 64, color: "#fff" }}>{txt}</div><div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 34, color: "#C9D1DC", letterSpacing: 2 }}>{n} · {sub}</div></div>
  </div>
);
export const Repaso: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), f1 = pal("cuerda") ?? 14, f2 = pal("puerta") ?? 40, f3 = pal("goma") ?? 70;
  return (
    <AbsoluteFill>
      <FondoInfo />
      <Pasos actual={4} y={430} k={1} />
      <Linea n={1} txt="Cuerda hacia ti" sub="SIN BACK-CLIP" k={(f - f1 + 4) / 8} y={780} />
      <Linea n={2} txt="Puerta al otro lado" sub="DE HACIA DONDE VAS" k={(f - f2 + 4) / 8} y={1000} />
      <Linea n={3} txt="Goma a la cuerda" sub="SIN GOMA → CHAPA" k={(f - f3 + 4) / 8} y={1220} />
    </AbsoluteFill>
  );
};
