// Cierre: «El miedo no se va» (tu cara, tranquila pero alerta) → «la pierna deja de bailar» (sigues escalando) → «¿En qué fase te quedas tú?»: repaso de las 5 fases.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { fuenteTitulo, fuenteTexto } from "../../tema";

const FASES = ["Temblorcito", "La cinta hace música", "«¡Confía en los pies!»", "Promesas a la roca", "¡PILLA!"];
export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sube = pal("Pero") ?? Math.round(d * 0.3), pregunta = (pal("En") ?? Math.round(d * 0.65)) - 4;
  const alcanza = interpolate(f, [sube, sube + 20], [0, 1], cl);
  const card = interpolate(f, [pregunta, pregunta + 8], [0, 1], cl);
  const h = caderaDe(PX, PY, 3, -10);
  return (
    <Camara d={d} empuje={0.05} foco="50% 45%">
      <PlanoPared f={f} tr={0} amp={0} talon={1} cara={f < sube ? "normal" : "alivio"} cabeza={-10}
        extra={{ brazoB: [160 + 12 * alcanza, 176 + 4 * alcanza], brazoA: [112 + 40 * alcanza, 150 + 20 * alcanza] }}
        zoom={{ s: 1.1, cx: h.x + 50, cy: h.y - 120, tx: 540, ty: 980 }} />
      <div style={{ position: "absolute", inset: 0, background: `rgba(5,11,20,${0.62 * card})` }} />
      <div style={{ position: "absolute", top: 230, left: 80, right: 80, opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 92, lineHeight: 1, color: "#fff", textAlign: "center", marginBottom: 36 }}>¿En qué fase<br />te quedas <span style={{ color: "#FF6A1F" }}>tú</span>?</div>
        {FASES.map((t, i) => {
          const o = interpolate(f, [pregunta + 6 + i * 4, pregunta + 12 + i * 4], [0, 1], cl);
          return (
            <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 20, margin: "14px 0", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 52, color: "#fff" }}>
              <span style={{ width: 76, height: 76, borderRadius: 38, background: i === 4 ? "#FF6A1F" : "#fff", color: i === 4 ? "#fff" : "#0B1624", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>{t}
            </div>
          );
        })}
      </div>
    </Camara>
  );
};
