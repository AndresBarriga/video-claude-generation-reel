// E82 · lista 1-2-3 sobre Joe en la vía: GANCHO (dedos: aprieta lo justo), CADENA (cuando no te mueves, brazo estirado: cuelga el hueso),
// MUELLE (cadera a la pared y empuja). Cada regla entra ✗ y pasa a ✓ en su palabra; el cuerpo de Joe cambia a la vez.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, aparato, Pasos, POSE, mano, hombro, suave } from "../../piezas/kit";
import { Gym, VIA, XA, JOE, colgar, piernas, Aprieta, CadenaBrazo, MuelleEntre, Ficha, ICONO_GANCHO, COL, cl, type P } from "./comun";
import { HA, HB, cadera } from "./Gancho";

const rad = (g: number) => (g * Math.PI) / 180;
const ext = (x: number, y: number, a: number, L: number) => ({ x: x + Math.sin(rad(a)) * L, y: y + Math.cos(rad(a)) * L });

/** Estado de Joe: r 0 doblado → 1 colgado del hueso; fuera 1 cadera lejos → 0 pegada; estira 0 → 1 piernas que empujan. */
export const joe = (r: number, fuera: number, estira: number) => {
  const base = cadera(r), p = { x: base.x - 46 * fuera + 10 * (1 - fuera), y: base.y - 60 * estira };
  const ang = colgar(p, HA, HB, piernas(POSE.agarre, estira, fuera));
  const rod = ext(p.x, p.y, ang.piernaA[0], 66), pie = ext(rod.x, rod.y, ang.piernaA[1], 64);
  const h = hombro(ang.torso), m = mano(ang, "A");
  return { p, ang, pie, hom: { x: p.x + h[0], y: p.y + h[1] }, man: { x: p.x + m.x, y: p.y + m.y } };
};

export const Lista: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame();
  const f2 = pal("dos") ?? Math.round(d / 3), f3 = pal("tres") ?? Math.round((2 * d) / 3);
  const ok1 = pal("resbalar") ?? f2 - 40, ok2 = pal("estirados") ?? f3 - 40, ok3 = pal("cadera") ?? d - 50, fE = pal("empuja") ?? d - 20;
  const n = f < f2 ? 1 : f < f3 ? 2 : 3;
  const r = n === 1 ? 0 : n === 2 ? suave((f - ok2 + 4) / 10) : 1;
  const fuera = n < 3 ? 0 : 1 - suave((f - ok3 + 2) / 10), estira = n < 3 ? 0.3 : 0.3 + 0.7 * suave((f - fE + 2) / 10);
  const j = joe(r, fuera, estira);
  const ap = n === 1 ? 1 - suave((f - ok1) / 8) : n === 2 ? 0.6 * (1 - r) : 0;
  const ok = n === 1 ? f >= ok1 : n === 2 ? f >= ok2 : f >= ok3;
  const ini = n === 1 ? 0 : n === 2 ? f2 : f3, okF = n === 1 ? ok1 : n === 2 ? ok2 : ok3;
  const fichas = [["gancho", "LO JUSTO", "A TOPE"], ["cadena", "QUIETO: ESTIRADO", "DOBLADO"], ["muelle", "CADERA DENTRO", "CADERA FUERA"]][n - 1];
  return (
    <>
      <Gym cx={j.p.x + 110} cy={j.p.y - 100} z={1.75}>
        <Soga pts={porChapas(VIA, aparato(VIA, XA), 3, { x: j.p.x + 10, y: j.p.y + 10 }, { comba: 30 })} />
        <rect x={HA.x - 8} y={HA.y - 6} width={30} height={22} rx={8} fill={COL.rosa} stroke={COL.tinta} strokeWidth={4} />
        <ellipse cx={VIA.xF(j.pie.y) + 10} cy={j.pie.y + 14} rx={22} ry={12} fill={COL.menta} stroke={COL.tinta} strokeWidth={4} />
        {n === 3 && <MuelleEntre a={{ x: j.p.x + 6, y: j.p.y + 8 }} b={j.pie} o={interpolate(f, [f3, f3 + 8], [0, 0.9], cl)} />}
        {n === 2 && <CadenaBrazo a={j.hom} b={j.man} o={interpolate(f, [ok2, ok2 + 8], [0, 1], cl)} />}
        <Aprieta x={j.man.x} y={j.man.y} v={ap} f={f} />
        <Persona p={j.p} ang={j.ang} aspecto={JOE} cara={ok ? "normal" : "esfuerzo"} />
        {n === 1 && f >= ok1 && <g transform={`translate(${j.man.x + 6} ${j.man.y - 30}) scale(${0.32 * interpolate(f, [ok1, ok1 + 6], [0, 1], cl)}) translate(-100 -100)`}>{ICONO_GANCHO}</g>}
      </Gym>
      <Ficha icono={fichas[0]} texto={ok ? fichas[1] : fichas[2]} x={830} y={960} k={f - ini - 2} ok={ok} s={0.85} />
      <Pasos actual={n} y={1470} k={1} />
    </>
  );
};
