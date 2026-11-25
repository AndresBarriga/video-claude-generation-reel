// E81 · escenas 8-9. Tarjeta para guardar (fija ≥2,5 s; técnica de Petzl, «otro aparato: su manual») y cierre:
// Irene sigue subiendo con la chapa hecha, Dani atento, «Mándaselo a quien te asegura» + «CAER Y ASEGURAR · 3/3», y bucle al fotograma 0.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, accEscalar, porChapas, aparato, bucle } from "../../piezas/kit";
import { Envio } from "../../piezas/kit/Montaje";
import { Gym, VS, XA, I, P0, IRENE, DANI, COL, F, pop, Grande, ROJO, type P } from "./G3comun";
import { PlanoChapa } from "./G3Gancho";

const FILAS: [string, boolean][] = [
  ["Mano de freno siempre en la cuerda", true],
  ["Pulgar en la leva solo mientras das", true],
  ["Chapa hecha: pulgar fuera", true],
  ["Agarrar el grigri entero", false],
];
export const GTarjeta: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#E8F2FC" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 420, bottom: 420, background: COL.crema, border: `9px solid ${COL.tinta}`, borderRadius: 48, boxShadow: "0 18px 0 rgba(20,33,58,.25)", transform: `scale(${pop(f)})`, padding: "40px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 80, color: COL.tinta, textAlign: "center", lineHeight: 1 }}>DAR CUERDA RÁPIDO<div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 38, color: "#5A6478", marginTop: 14 }}>Técnica de Petzl para el grigri · otro aparato: su manual</div></div>
        {FILAS.map(([t, ok], i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, borderTop: "4px dashed #D8CFC1", paddingTop: 26, opacity: pop(f - 3 - i * 3) > 0 ? 1 : 0 }}>
            <div style={{ flex: "0 0 auto", width: 92, height: 92, borderRadius: 46, background: ok ? COL.verde : ROJO, border: `6px solid ${COL.tinta}`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✗"}</div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 54, color: COL.tinta, lineHeight: 1.05 }}>{t}</div>
          </div>
        ))}
      </div>
    </>
  );
};
export const GCta: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fM = pal("mándaselo") ?? 4, b = bucle(f, d, 12);
  const sube = accEscalar(VS, P0.y, P0.y - 140, Math.min(1, f / 60));
  return (
    <>
      <Gym cx={P0.x - 20} cy={P0.y + 190} z={1.3}>
        <Asegurador via={VS} x={XA} aspecto={DANI} alza={1} feed={0.5 + 0.5 * Math.sin(f / 5)} comba={0.12} cara="normal" />
        <Soga pts={porChapas(VS, aparato(VS, XA), I + 1, sube.p)} />
        <Persona p={sube.p} ang={sube.ang} aspecto={IRENE} cara="alivio" />
      </Gym>
      {b < 0.5 && <Grande t="CAER Y ASEGURAR · 3/3" top={1080} k={f - 2} tam={60} fondo={COL.amarillo} />}
      {b < 0.5 && <Envio a="quien te asegura" k={(f - fM + 4) / 8} top={1240} />}
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><PlanoChapa f={0} /><Grande t="¡CUERDA!" top={930} k={12} tam={140} /></AbsoluteFill>}
    </>
  );
};
