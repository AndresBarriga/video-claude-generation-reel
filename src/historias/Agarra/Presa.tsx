// TOMA 2 · presa: la mano se queda en la presa y el cuerpo sigue: brazo de goma, gira como una puerta y va de lado contra la pared.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, Destello, porChapas, hombro, conMano, caeCuerda, mix, suave, POSE, G } from "../../piezas/kit";
import { VIA, I, M, P0, XA, AP, TU, ASE, BASE, libre, Mundo, Rebobina, Toma, N_REB, clamp, golpe, type P } from "./comun";

export const Presa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fG = pal("para") ?? 62, fNo = pal("no") ?? fG + 18, fGi = pal("giras") ?? fG + 34, fS = pal("pared") ?? fGi + 30, f0 = fG - 8;
  const kG = 8, yG = P0.y + G * kG * kG, Q = { x: VIA.xF(yG - 96) + 14, y: yG - 96 }, EST = 250;
  let p = P0 as { x: number; y: number }, ang = POSE.agarre, rot = 0, cara: "miedo" | "dolor" | "esfuerzo" | "normal" = "normal", goma = false, j = -1;
  if (f < N_REB) { const u = f / N_REB; p = { x: P0.x - 30 * (1 - u), y: P0.y + 300 * (1 - u) }; ang = POSE.colgado; }
  else if (f < fG) { const l = libre(f - f0); p = l.p; ang = f - f0 > 2 ? conMano(l.ang, Q.x - p.x, Q.y - p.y) : l.ang; cara = f > f0 ? "miedo" : "normal"; }
  else if (f < fGi) {
    // la mano se queda: primero cuelga normal, y en «no» el cuerpo sigue y el brazo se estira (menos de 1 s)
    const t = f - fG, u = suave((f - fNo) / Math.max(4, fGi - fNo - 3)), e = 50 * (1 - Math.exp(-t / 4)) + (EST - 50) * u + (f > fNo ? 10 * Math.sin((f - fNo) / 1.6) * (1 - u) : 0);
    p = { x: P0.x - 8 + 18 * Math.min(1, t / 8), y: yG + e }; rot = 4 * Math.sin(t / 2.4) * Math.exp(-t / 12); cara = f > fNo ? "miedo" : "esfuerzo"; goma = f > fNo;
    ang = conMano({ ...BASE, piernaA: [30 + 18 * Math.sin(t / 2), 0], piernaB: [-10 - 18 * Math.sin(t / 2), -10] }, Q.x - p.x, Q.y - p.y);
  } else if (f < fS) {
    // se suelta: gira como una puerta y va de lado contra la pared
    const u = suave((f - fGi) / Math.max(3, fS - fGi));
    p = { x: P0.x + 10 + 34 * u, y: yG + EST + 60 * u * u }; rot = 82 * u; cara = "miedo";
    ang = { ...BASE, brazoA: [150 - 60 * u, 120], brazoB: [-120, -100 + 40 * Math.sin(f)], piernaA: [30, 0], piernaB: [-14, -10] };
  } else {
    const c = caeCuerda(f - fS, { x: P0.x + 44, y: yG + EST + 60 }, BASE, { d: 60, ancla: M }); p = c; j = c.j; rot = 82 * Math.exp(-(f - fS) / 7);
    ang = mix(c.ang, { ...POSE.colgado, brazoB: [150, 20], cabeza: 16 }, Math.min(1, Math.max(0, j) / 8)); cara = "dolor";
  }
  const rr = (rot * Math.PI) / 180, h0 = hombro(ang.torso);
  const sh = [p.x + h0[0] * Math.cos(rr) - h0[1] * Math.sin(rr), p.y + h0[0] * Math.sin(rr) + h0[1] * Math.cos(rr)], cy = interpolate(f, [N_REB, fG, fS + 20], [P0.y - 40, P0.y + 60, P0.y + 330], clamp);
  const gd = `M${sh[0]} ${sh[1]} Q${(sh[0] + Q.x) / 2 - 16 * Math.sin(f)} ${(sh[1] + Q.y) / 2} ${Q.x - 6} ${Q.y + 6}`;
  return (
    <>
      <Mundo cx={530} cy={cy - 30} z={1.75} sh={golpe(f, fS, 22)}>
        <Asegurador via={VIA} x={XA} cuerda={false} aspecto={ASE} alza={1} comba={0.2} cara={f > fG ? "miedo" : "normal"} />
        <Soga pts={porChapas(VIA, AP, I + 1, p, { floja: j >= 0 ? 0 : 50, sx: -40 })} />
        <Persona p={p} ang={ang} aspecto={TU} cara={cara} rot={rot} />
        {goma && <g><path d={gd} stroke="#2A5A60" strokeWidth={25} fill="none" strokeLinecap="round" /><path d={gd} stroke="#3F7F86" strokeWidth={19} fill="none" strokeLinecap="round" /><circle cx={Q.x - 4} cy={Q.y + 4} r={13} fill="#B9825A" /></g>}
        <Destello x={p.x + 50} y={p.y - 50} k={f - fS} r={150} color="#E2533F" /><Destello x={sh[0]} y={sh[1]} k={f - fS - 2} r={60} />
        {f > fS + 6 && [0, 1, 2].map((i) => <path key={i} d={`M${sh[0] - 30 - i * 14} ${sh[1] - 26 - i * 10} l-16 -12`} stroke="#E2533F" strokeWidth={8} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 3 + i)} />)}
      </Mundo>
      <Rebobina k={f} /><Toma n={2} k={f - N_REB} />
      {void d}
    </>
  );
};
