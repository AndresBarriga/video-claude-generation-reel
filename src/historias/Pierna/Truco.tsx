// El truco: talón abajo y soltar aire. La pierna se para, la cinta se calla (único silencio del vídeo).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, temblor, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { fuenteTexto } from "../../tema";

export const Truco: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t = [pal("talón") ?? 12, pal("aire") ?? Math.round(d * 0.55)];
  const talon = interpolate(f, [t[0], t[0] + 8], [0, 1], cl);
  const aire = interpolate(f, [t[1], t[1] + 24], [0, 1], cl);
  const k = 1.2 * (1 - 0.5 * talon - 0.5 * interpolate(f, [t[1], t[1] + 12], [0, 1], cl));
  const h = caderaDe(PX, PY, 3);
  const pasos = ["Talón abajo", "Suelta el aire"];
  return (
    <Camara d={d} empuje={0.05} foco="50% 45%">
      <PlanoPared f={f} tr={temblor(f, k)} amp={k} tintineo={k} talon={talon} aliento={f >= t[1] ? aire : 0}
        cara={aire > 0.05 ? (aire < 0.6 ? "cerrados" : "alivio") : "esfuerzo"} zoom={{ s: 0.95, cx: h.x + 60, cy: h.y - 40, tx: 560, ty: 930 }} />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 46, letterSpacing: 4, color: "#fff", textShadow: "0 3px 8px #000a" }}>EL TRUCO</div>
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        {pasos.map((p, i) => {
          const o = interpolate(f, [t[i], t[i] + 6], [0, 1], cl);
          return (
            <div key={i} style={{ opacity: o, transform: `scale(${0.8 + 0.2 * o})`, display: "flex", alignItems: "center", gap: 18, fontFamily: fuenteTexto, fontWeight: 800, fontSize: 60, color: "#fff" }}>
              <span style={{ width: 80, height: 80, borderRadius: 40, background: "#FF6A1F", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{i + 1}</span>
              <span style={{ background: "rgba(5,11,20,.72)", borderRadius: 20, padding: "8px 24px" }}>{p}</span>
            </div>
          );
        })}
      </div>
    </Camara>
  );
};
