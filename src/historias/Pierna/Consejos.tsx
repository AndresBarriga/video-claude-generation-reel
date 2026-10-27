// Una cosa más: los tres gestos que la paran. Talón abajo → peso a la pierna estirada → soltar aire. La pierna se para y la cinta se calla.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, temblor, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { fuenteTexto } from "../../tema";

const PASOS = ["Talón abajo", "Peso a la pierna estirada", "Suelta el aire"];
export const Consejos: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t = [pal("talón") ?? pal("talon") ?? 10, pal("peso") ?? Math.round(d * 0.35), pal("aire") ?? Math.round(d * 0.7)];
  const talon = interpolate(f, [t[0], t[0] + 8], [0, 1], cl);
  const peso = interpolate(f, [t[1], t[1] + 10], [0, 1], cl);
  const aire = interpolate(f, [t[2], t[2] + 24], [0, 1], cl);
  const k = 1 - 0.35 * talon - 0.3 * peso - 0.35 * interpolate(f, [t[2], t[2] + 14], [0, 1], cl);
  const h = caderaDe(PX, PY, 3);
  return (
    <Camara d={d} empuje={0.05} foco="50% 45%">
      <PlanoPared f={f} tr={temblor(f, k)} amp={k} tintineo={k} talon={talon} aliento={f >= t[2] ? aire : 0}
        cara={aire > 0.05 ? (aire < 0.6 ? "cerrados" : "alivio") : "esfuerzo"}
        extra={{ piernaB: [24 - 18 * peso, -2 + 6 * peso], torso: 10 - 4 * peso }}
        zoom={{ s: 0.95, cx: h.x + 60, cy: h.y - 40, tx: 560, ty: 930 }} />
      <div style={{ position: "absolute", top: 230, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 16 }}>
        {PASOS.map((p, i) => {
          const o = interpolate(f, [t[i], t[i] + 6], [0, 1], cl);
          return (
            <div key={i} style={{ opacity: o, transform: `translateX(${(1 - o) * -40}px)`, display: "flex", alignItems: "center", gap: 18, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 50, color: "#fff" }}>
              <span style={{ width: 70, height: 70, borderRadius: 35, background: "#FF6A1F", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{i + 1}</span>
              <span style={{ background: "rgba(5,11,20,.72)", borderRadius: 18, padding: "6px 20px" }}>{p}</span>
            </div>
          );
        })}
      </div>
    </Camara>
  );
};
