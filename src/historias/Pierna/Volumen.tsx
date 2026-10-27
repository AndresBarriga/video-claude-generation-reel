// Segundo gancho: miras abajo, el vacío se hace más hondo (la cámara se abre y el valle se aleja) y la pierna tiembla más.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camara, temblor, type P } from "./comun";
import { PlanoPared, PX, PY } from "./Plano";
import { caderaDe } from "./Tu";

export const Volumen: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t0 = pal("miedo") ?? Math.round(d * 0.4);
  const k = interpolate(f, [0, t0, t0 + 20], [1, 1.1, 1.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const abre = interpolate(f, [0, d], [0, 1], { extrapolateRight: "clamp" });
  const h = caderaDe(PX, PY, 3, 44);
  return (
    <Camara d={d} empuje={0.04} foco="50% 50%" sacudida={f > t0 ? 1.5 : 0}>
      <PlanoPared f={f} tr={temblor(f * (1 + 0.3 * (k - 1)), k)} amp={k} cara="miedo" cabeza={44} valle={1500 + 260 * abre}
        zoom={{ s: 1.25 - 0.3 * abre, cx: h.x + 40, cy: h.y, tx: 540, ty: 700 + 120 * abre }} />
    </Camara>
  );
};
