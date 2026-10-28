// Engaño 1: desde arriba, el miedo agranda las distancias. Pantalla partida: «En tu cabeza» (chapa lejísimos) / «En realidad» (ahí mismo).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, Fuente, temblor, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { fuenteTexto } from "../../tema";

const Rotulo: React.FC<{ texto: string; x: number; o: number; color: string }> = ({ texto, x, o, color }) => (
  <div style={{ position: "absolute", top: 370, left: x, width: 540, textAlign: "center", opacity: o }}>
    <span style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 50, color: "#fff", background: color, borderRadius: 18, padding: "8px 24px" }}>{texto}</span>
  </div>
);

export const Engano: React.FC<P> = ({ d, e, pal }) => {
  const f = useCurrentFrame();
  const tr = temblor(f, 1);
  const h = caderaDe(PX, PY, 3);
  const t2 = pal("distancias") ?? Math.round(d * 0.5);
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const panel = (lado: 0 | 1) => (
    <div style={{ position: "absolute", left: lado * 540, top: 0, width: 540, height: 1920, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -lado * 540, top: 0, width: 1080, height: 1920 }}>
        <PlanoPared f={f} tr={tr} amp={0.8} chapa={lado ? "real" : "lejos"} cara={lado ? "esfuerzo" : "miedo"} aro={lado ? interpolate(f, [t2, t2 + 8], [0, 1], cl) : 1}
          valle={lado ? 1500 : 1850} zoom={lado ? { s: 0.85, cx: h.x + 80, cy: h.y - 40, tx: 810, ty: 940 } : { s: 0.5, cx: h.x + 80, cy: h.y + 300, tx: 270, ty: 980 }} />
      </div>
    </div>
  );
  return (
    <Camara d={d} empuje={0.03}>
      {panel(0)}{panel(1)}
      <div style={{ position: "absolute", left: 535, top: 0, width: 10, height: 1920, background: "#fff" }} />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 46, letterSpacing: 4, color: "#fff", textShadow: "0 3px 8px #000a" }}>ENGAÑO 1 · LA DISTANCIA</div>
      <Rotulo texto="En tu cabeza" x={0} o={interpolate(f, [4, 10], [0, 1], cl)} color="#B4614A" />
      <Rotulo texto="En realidad" x={540} o={interpolate(f, [t2 - 4, t2 + 4], [0, 1], cl)} color="#3E7A5A" />
      <Fuente texto={e.fuente ?? ""} />
    </Camara>
  );
};
