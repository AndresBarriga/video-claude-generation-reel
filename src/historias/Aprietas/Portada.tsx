// E82 · portada propia (formato §9): Joe apretando en la vía + lupa de la mano agarrotada, titular ≥60 px y las 3 reglas, todo en el 3:4 central.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lupa } from "../../piezas/kit";
import { Gym, COL, F } from "./comun";
import { JoeMuro, ManoRegleta, cadera } from "./Gancho";

export const AprietasPortada: React.FC = () => {
  const p = cadera(0);
  return (
    <AbsoluteFill style={{ background: "#E8F2FC" }}>
      <Gym cx={p.x + 110} cy={p.y - 210} z={1.9}><JoeMuro r={0} ap={1} f={6} /></Gym>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, height: 470, background: "linear-gradient(rgba(255,253,248,.95) 80%, rgba(255,253,248,0))" }} />
      <div style={{ position: "absolute", top: 300, left: 50, right: 50, textAlign: "center", fontFamily: F, fontWeight: 900, color: COL.tinta, lineHeight: 1.02 }}>
        <div style={{ fontSize: 118 }}>NO ERES DÉBIL.</div>
        <div style={{ display: "inline-block", fontSize: 104, background: COL.amarillo, borderRadius: 18, padding: "0 22px 10px", marginTop: 10, border: `8px solid ${COL.tinta}` }}>APRIETAS DEMASIADO</div>
      </div>
      <Lupa x={760} y={1230} r={250} k={1} fondo="#FFFDF8"><ManoRegleta cierra={1} ap={1} f={6} /></Lupa>
      <div style={{ position: "absolute", top: 1530, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: F, fontWeight: 900, fontSize: 60, color: "#fff", background: COL.tinta, borderRadius: 34, padding: "8px 34px 14px" }}>GANCHO · CADENA · MUELLE</span>
      </div>
    </AbsoluteFill>
  );
};
