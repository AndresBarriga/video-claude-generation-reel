// E79 · portada propia (formato §9): tres paredes en miniatura con Irene cayendo, titular ≥60 px y «CAER Y ASEGURAR · 1/3», todo en el 3:4 central.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Mini, VIÑ } from "./Cuatro";
import { COL, F, Svg } from "./comun";
import { PuestoG } from "./G3comun";

const W = 310, H = 560, S = 0.42;
const E79: React.FC = () => (
  <AbsoluteFill style={{ background: "#E8F2FC" }}>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#fff", background: COL.tinta, borderRadius: 30, padding: "8px 30px 12px" }}>CAER Y ASEGURAR · 1/3</span>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 112, lineHeight: 0.98, color: COL.tinta }}>¿CÓMO TE TIENEN<br />QUE FRENAR?</div>
    {[0, 2, 3].map((i, j) => {
      const v = VIÑ[i];
      return (
        <div key={v.t} style={{ position: "absolute", left: 45 + j * (W + 20), top: 690, width: W, height: H, borderRadius: 30, overflow: "hidden", border: `8px solid ${COL.tinta}` }}>
          <div style={{ position: "absolute", left: -(1080 * S - W) / 2, top: -(1920 * S - H) / 2, width: 1080, height: 1920, transform: `scale(${S})`, transformOrigin: "0 0" }}><Mini v={v} k={9} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center" }}><span style={{ fontFamily: F, fontWeight: 900, fontSize: 40, color: COL.tinta, background: COL.crema, border: `5px solid ${COL.tinta}`, borderRadius: 20, padding: "2px 14px" }}>{v.t}</span></div>
        </div>
      );
    })}
    <div style={{ position: "absolute", top: 1300, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64, color: COL.tinta }}>BLANDA · CORTA · JUSTA</div>
  </AbsoluteFill>
);

/** E81 (3/3): el grigri de Dani con índice y pulgar rotulados + titular. */
const E81: React.FC = () => (
  <AbsoluteFill style={{ background: "#E8F2FC" }}>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#fff", background: COL.tinta, borderRadius: 30, padding: "8px 30px 12px" }}>CAER Y ASEGURAR · 3/3</span>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 104, lineHeight: 0.98, color: COL.tinta }}>DAR CUERDA RÁPIDO<br />CON EL GRIGRI</div>
    <div style={{ position: "absolute", left: 170, top: 760, width: 740, height: 740, borderRadius: 370, overflow: "hidden", border: `10px solid ${COL.tinta}`, background: "#F4F8FC" }}>
      <Svg><g transform="translate(370 370) scale(0.58) translate(-640 -880)"><PuestoG modo="rapido" pisa={1} hiPulgar /></g></Svg>
    </div>
    <div style={{ position: "absolute", top: 1530, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 62, color: COL.tinta }}>SIN QUITARLE EL FRENO</div>
  </AbsoluteFill>
);
export const FrenadaPortada: React.FC<{ datos?: { id?: string } }> = ({ datos }) => (datos?.id?.startsWith("E81") ? <E81 /> : <E79 />);
