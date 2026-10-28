// Fase 5 y el chiste: «¡PILLA!» → te sueltas → caes 20 cm. La cámara se abre y aparece la chapa justo bajo tu arnés.
import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, temblor, type P } from "./comun";
import { fuenteTexto } from "../../tema";
import { CAIDA, PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";
import { Marcador } from "./Fases";

/** Fase 5: grito y suelta, todavía en plano cerrado (la chapa sigue fuera de plano). */
export const Fase5: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t = (pal("pilla") ?? Math.round(d * 0.5)) + 4;
  const caer = spring({ frame: f - t, fps: 30, config: { damping: 9, stiffness: 260 } });
  const h = caderaDe(PX, PY, 3, 10);
  return (
    <Camara d={d} empuje={0.05} foco="50% 45%" sacudida={f > t && f < t + 10 ? 9 : f < t ? 2 : 0}>
      <PlanoPared f={f} tr={f < t ? temblor(f, 2) : 0} amp={f < t ? 2 : 0} cara="miedo" cabeza={10} colgar={f >= t ? caer : 0}
        zoom={{ s: 1.5, cx: h.x + 40, cy: h.y - 160, tx: 540, ty: 940 }} />
      <Marcador n={5} nombre={f >= t - 4 ? "¡PILLA!" : undefined} rojo />
    </Camara>
  );
};

/** «Caída total: veinte centímetros.» Se abre el plano: la chapa estaba ahí mismo. Cota de 20 cm. */
export const Caida: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const abre = spring({ frame: f - 2, fps: 30, config: { damping: 16, stiffness: 90 } });
  const h = caderaDe(PX, PY, 3, 10);
  const cx = h.x - 150, y0 = h.y - 30, y1 = h.y - 30 + CAIDA;
  const z = { s: interpolate(abre, [0, 1], [1.5, 1.25]), cx: h.x + 40, cy: interpolate(abre, [0, 1], [h.y - 160, h.y - 60]), tx: 540, ty: interpolate(abre, [0, 1], [940, 1000]) };
  const sx = (x: number) => z.tx + (x - z.cx) * z.s, sy = (y: number) => z.ty + (y - z.cy) * z.s;
  const k = interpolate(f, [10, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camara d={d} empuje={0.03}>
      <PlanoPared f={f} tr={0} amp={0} cara="normal" cabeza={10} chapa="real" colgar={1 + Math.min(1, f / 20)} zoom={z} fantasma={k} aro={k} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={k} stroke="#fff" strokeWidth={8} strokeLinecap="round">
          <path d={`M${sx(cx)} ${sy(y0)} L${sx(cx)} ${sy(y1)}`} />
          <path d={`M${sx(cx) - 25} ${sy(y0)} L${sx(cx) + 25} ${sy(y0)} M${sx(cx) - 25} ${sy(y1)} L${sx(cx) + 25} ${sy(y1)}`} />
        </g>
      </svg>
      <Etiqueta texto={e.titulo} top={240} tam={190} desde={10} />
      <div style={{ position: "absolute", left: sx(cx) - 20, top: sy((y0 + y1) / 2) - 40, opacity: k, transform: "translateX(-100%)", fontFamily: fuenteTexto, fontWeight: 800, fontSize: 56, color: "#fff", textShadow: "0 3px 8px #000c" }}>caída</div>
      <div style={{ position: "absolute", left: 640, top: 1290, opacity: k, fontFamily: fuenteTexto, fontWeight: 800, fontSize: 52, color: "#0B1624", background: "#FFD34D", borderRadius: 16, padding: "4px 18px" }}>la chapa</div>
    </Camara>
  );
};
