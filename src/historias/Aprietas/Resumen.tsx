// E82 · «Gancho, cadena, muelle»: las tres fichas en fila (cada una en su palabra) sobre Joe ya colgado del hueso.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, aparato } from "../../piezas/kit";
import { Gym, VIA, XA, JOE, Ficha, type P } from "./comun";
import { joe } from "./Lista";

export const Resumen: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), j = joe(1, 0, 1);
  const k = [pal("gancho") ?? 0, pal("cadena") ?? 12, pal("muelle") ?? 24];
  return (
    <>
      <Gym cx={j.p.x + 120} cy={j.p.y - 60} z={1.3 + f * 0.002}>
        <Soga pts={porChapas(VIA, aparato(VIA, XA), 3, { x: j.p.x + 10, y: j.p.y + 10 }, { comba: 30 })} />
        <Persona p={j.p} ang={j.ang} aspecto={JOE} cara="normal" />
      </Gym>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, height: 560, background: "rgba(255,253,248,.72)" }} />
      {["gancho", "cadena", "muelle"].map((ic, i) => <Ficha key={ic} icono={ic} texto={ic.toUpperCase()} x={200 + i * 340} y={1180} k={f - k[i] + 3} ok s={0.95} />)}
    </>
  );
};
