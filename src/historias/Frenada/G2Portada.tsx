// E80 · portada propia (formato §9): «CAER Y ASEGURAR · 2/3» + titular + el plano del gancho (Dani con su creencia) con ✗. Todo en el 3:4.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PlanoComba } from "./G2Uno";
import { COL, F } from "./comun";

const W = 860, H = 760, S = 0.62;
export const FrenadaPortadaE80: React.FC = () => (
  <AbsoluteFill style={{ background: "#DDEFF5" }}>
    <div style={{ position: "absolute", top: 290, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#fff", background: COL.tinta, borderRadius: 30, padding: "8px 30px 12px" }}>CAER Y ASEGURAR · 2/3</span>
    </div>
    <div style={{ position: "absolute", top: 400, left: 30, right: 30, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 100, lineHeight: 0.98, color: COL.tinta }}>LO QUE NO ES UNA<br />FRENADA BLANDA</div>
    <div style={{ position: "absolute", left: (1080 - W) / 2, top: 640, width: W, height: H, borderRadius: 40, overflow: "hidden", border: `10px solid ${COL.tinta}` }}>
      <div style={{ position: "absolute", left: -(1080 * S - W) / 2 - 40, top: -(1920 * S - H) / 2 + 40, width: 1080, height: 1920, transform: `scale(${S})`, transformOrigin: "0 0" }}><PlanoComba f={8} /></div>
      <div style={{ position: "absolute", right: 24, top: 24, width: 120, height: 120, borderRadius: 60, background: COL.rojo, border: `8px solid ${COL.tinta}`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>✗</div>
    </div>
    <div style={{ position: "absolute", top: 1440, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 58, color: COL.tinta }}>3 CREENCIAS ✗ · LO QUE SÍ ✓</div>
  </AbsoluteFill>
);
