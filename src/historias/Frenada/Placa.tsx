// E79 · 4/4 placa tumbada: Irene resbala de cara a la pared rozando; Dani da dos pasos atrás → la caída se acorta. «JUSTA ✓».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, resbala } from "../../piezas/kit";
import { Pared, VP, IRENE, DANI, caer, Contador, pasoAseg, Grande, COL, cl, type P } from "./comun";

const I = 3, PP = VP.cadera(VP.mos(I).y - 90), XP = 360;
export const Placa: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fJ = pal("justa") ?? 40, k = f - 14;
  const ps = pasoAseg(f, 10, 34, XP, XP - 170, 2), s = caer(VP, ps.x, k, PP, I, 0.5, 0);
  const t = interpolate(k, [0, 14], [0, 1], cl), p = k <= 0 ? PP : { x: VP.xF(s.p.y) - 74, y: s.p.y };
  const rastro = k > 0 ? Math.min(s.p.y, PP.y + 400) : PP.y;
  return (
    <>
      <Pared via={VP} cx={620} cy={PP.y + 330} z={1.0} sh={s.sh * 0.3}>
        {k > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${VP.xF(PP.y + 60) - 4 + i * 4} ${PP.y + 60 + i * 10} L${VP.xF(rastro + 60) - 4 + i * 4} ${rastro + 60}`} stroke="#8E8173" strokeWidth={4} opacity={0.55} strokeLinecap="round" />)}
        <Asegurador via={VP} aspecto={DANI} {...s.aseg} x={ps.x} paso={ps.paso} alza={1} />
        <Soga pts={k <= 0 ? porChapas(VP, aparato(VP, ps.x, 0), I + 1, PP, { comba: 20 }) : porChapas(VP, aparato(VP, ps.x, s.aseg.dy), I + 1, p, { comba: 6 })} />
        <Persona p={p} ang={k <= 0 ? POSE.agarreMira : resbala(POSE.agarre, t)} aspecto={IRENE} cara={k <= 0 ? "esfuerzo" : "miedo"} />
      </Pared>
      <Contador n={4} k={f + 6} />
      <Grande t="JUSTA ✓" top={1260} k={f - fJ + 2} tam={100} fondo={COL.verde} color="#fff" />
    </>
  );
};
