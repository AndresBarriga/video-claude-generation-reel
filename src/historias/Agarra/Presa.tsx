// TOMA 2 · presa: la mano se queda en la presa y el cuerpo sigue: brazo de goma, gira como una puerta y va de lado contra la pared.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, Destello, porChapas, hombro, conMano, caeCuerda, mix, suave, POSE, G } from "../../piezas/kit";
import { VIA, I, M, P0, XA, AP, TU, ASE, BASE, libre, Mundo, Rebobina, Toma, N_REB, clamp, golpe, type P } from "./comun";

export const Presa: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fG = pal("para") ?? 62, fGi = pal("giras") ?? fG + 30, fS = pal("pared") ?? fGi + 30, f0 = fG - 8, gira = suave((f - fGi) / Math.max(4, fS - fGi - 2));
  const kG = 8, yG = P0.y + G * kG * kG, Q = { x: VIA.xF(yG - 96) + 14, y: yG - 96 }, EST = 250;
  let p = P0 as { x: number; y: number }, ang = POSE.agarre, rot = 0, cara: "miedo" | "dolor" | "esfuerzo" | "normal" = "normal", goma = false, j = -1;
  if (f < N_REB) { const u = f / N_REB; p = { x: P0.x - 30 * (1 - u), y: P0.y + 300 * (1 - u) }; ang = POSE.colgado; }
  else if (f < fG) { const l = libre(f - f0); p = l.p; ang = f - f0 > 2 ? conMano(l.ang, Q.x - p.x, Q.y - p.y) : l.ang; cara = f > f0 ? "miedo" : "normal"; }
  else if (f < fS) {
    const t = f - fG, e = EST * (1 - Math.exp(-t / 4.5)) + 16 * Math.sin(t / 1.8) * Math.exp(-t / 9);
    p = { x: P0.x - 8 + 22 * Math.min(1, t / 8) + 30 * gira, y: yG + e - 40 * gira }; ang = conMano({ ...BASE, piernaA: [30 + 20 * Math.sin(t / 2), 0], piernaB: [-10 - 20 * Math.sin(t / 2), -10] }, Q.x - p.x, Q.y - p.y); rot = 5 * Math.sin(t / 2.2) * Math.exp(-t / 10) + 80 * gira; cara = "esfuerzo"; goma = true;
  } else {
    const c = caeCuerda(f - fS, { x: P0.x + 44, y: yG + EST - 40 }, BASE, { d: 110, ancla: M }); p = c; j = c.j; rot = 80 * Math.exp(-(f - fS) / 7);
    ang = mix(c.ang, { ...POSE.colgado, brazoB: [150, 20], cabeza: 16 }, Math.min(1, Math.max(0, j) / 8)); cara = "dolor";
  }
  const sh = [p.x + hombro(ang.torso)[0], p.y + hombro(ang.torso)[1]], cy = interpolate(f, [N_REB, fG, fS + 20], [P0.y - 40, P0.y + 60, P0.y + 300], clamp);
  const gd = `M${sh[0]} ${sh[1]} Q${(sh[0] + Q.x) / 2 - 16 * Math.sin(f)} ${(sh[1] + Q.y) / 2} ${Q.x - 6} ${Q.y + 6}`;
  return (
    <>
      <Mundo cx={530} cy={cy - 30} z={1.75} sh={golpe(f, fS, 20)}>
        <Asegurador via={VIA} x={XA} cuerda={false} aspecto={ASE} alza={1} comba={0.2} cara={f > fG ? "miedo" : "normal"} />
        <Soga pts={porChapas(VIA, AP, I + 1, p, { floja: j >= 0 ? 0 : 50, sx: -40 })} />
        <Persona p={p} ang={ang} aspecto={TU} cara={cara} rot={rot} />
        {goma && <g><path d={gd} stroke="#050B14" strokeWidth={34} fill="none" strokeLinecap="round" /><path d={gd} stroke="#3F7F86" strokeWidth={22} fill="none" strokeLinecap="round" /><circle cx={Q.x - 6} cy={Q.y + 6} r={17} fill="#B9825A" stroke="#050B14" strokeWidth={6} /></g>}
        <Destello x={p.x + 50} y={p.y - 50} k={f - fS} r={150} color="#E2533F" /><Destello x={sh[0]} y={sh[1]} k={f - fS - 2} r={60} />
        {f > fS + 6 && [0, 1, 2].map((i) => <path key={i} d={`M${sh[0] - 30 - i * 14} ${sh[1] - 26 - i * 10} l-16 -12`} stroke="#E2533F" strokeWidth={8} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 3 + i)} />)}
      </Mundo>
      <Rebobina k={f} /><Toma n={2} k={f - N_REB} />
      {void d}
    </>
  );
};
