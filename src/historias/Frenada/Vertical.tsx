// E79 · pared vertical: 2/4 caída blanda limpia arriba ✓ → «ojo con esto»: bajamos a la repisa → 3/4 la MISMA caída blanda
// acaba con los pies en la repisa ✗ (2.º gancho) → corta: Dani cerca de la pared, poca cuerda fuera, recoge SIN tirón; para antes ✓.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, Destello, CADERA } from "../../piezas/kit";
import { Pared, VV, IRENE, DANI, caer, Repisa, Contador, pasoAseg, Grande, COL, cl, type P } from "./comun";

const XV = 330, PA = VV.cadera(VV.mos(3).y - 110);
/** Repisa bajo la chapa 1: la blanda llega a los pies; la corta para antes. */
export const PR = VV.cadera(VV.mos(2).y - 110), REP = 2150;
const CAMR = { cx: 520, cy: 2100, z: 1.05 };

/** Caída en la repisa: la cadera no baja de lo que permiten los pies sobre la repisa (golpe). */
const enRepisa = (xa: number, k: number, dina: number, comba: number) => {
  const s = caer(VV, xa, k, PR, 2, dina, comba), tope = REP - CADERA + 22, toca = s.p.y > tope;
  return { s, p: toca ? { x: s.p.x, y: tope } : s.p, toca };
};
export const Vertical: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fB = pal("blanda") ?? 40, fO = (pal("ojo") ?? d - 30) - 2, k = f - 8, s = caer(VV, XV, k, PA, 3, 1, 0.3);
  const baja = interpolate(f, [fO, fO + 10], [0, 1], { ...cl, easing: (x) => x * x * (3 - 2 * x) });
  if (baja >= 1) {
    const av = 0.5 + 0.5 * Math.sin((f - fO) / 2.2);
    return (
      <>
        <Pared via={VV} {...CAMR}>
          <Repisa via={VV} y={REP} aviso={av} />
          <Asegurador via={VV} x={XV} aspecto={DANI} alza={1} />
          <Soga pts={porChapas(VV, aparato(VV, XV, 0), 3, PR, { comba: 40 })} />
          <Persona p={PR} ang={POSE.agarreMira} aspecto={IRENE} cara="normal" />
        </Pared>
        <Contador n={2} k={20} />
        <Grande t="¿Y AQUÍ?" top={1250} k={f - fO - 6} tam={90} fondo={COL.amarillo} />
      </>
    );
  }
  return (
    <>
      <Pared via={VV} cx={560} cy={PA.y + 260 + (CAMR.cy - PA.y - 260) * baja} z={1.05 + 0.1 * baja} sh={s.sh * 0.5}>
        <Asegurador via={VV} aspecto={DANI} {...s.aseg} alza={1} />
        <Soga pts={s.pts} />
        <Persona p={s.p} ang={k <= 0 ? POSE.agarreMira : s.ang} aspecto={IRENE} cara={k <= 0 ? "miedo" : "alivio"} rot={s.rot} />
      </Pared>
      <Contador n={2} k={f + 6} />
      <Grande t="BLANDA ✓" top={1260} k={f - fB + 2} tam={100} fondo={COL.verde} color="#fff" />
    </>
  );
};
export const RepisaE: React.FC<P> = () => {
  const f = useCurrentFrame(), k = f - 2, r = enRepisa(XV, k, 1, 0.3);
  const [f0] = [Array.from({ length: 80 }, (_, i) => i).find((i) => enRepisa(XV, i - 2, 1, 0.3).toca) ?? 30];
  const g = f - f0, sh = g >= 0 && g < 8 ? Math.sin(g * 2.6) * 16 * (1 - g / 8) : 0;
  return (
    <>
      <Pared via={VV} {...CAMR} sh={sh + r.s.sh * 0.4}>
        <Repisa via={VV} y={REP} />
        <Asegurador via={VV} aspecto={DANI} {...r.s.aseg} alza={1} cara={g >= 0 ? "miedo" : "esfuerzo"} />
        <Soga pts={porChapas(VV, aparato(VV, XV, r.s.aseg.dy), 3, r.p, { comba: 6, floja: r.toca ? 30 : 0 })} />
        <Persona p={r.p} ang={r.toca ? POSE.recibe : k <= 0 ? POSE.agarreMira : r.s.ang} aspecto={IRENE} cara={g >= 0 ? "dolor" : k <= 0 ? "normal" : "miedo"} rot={r.s.rot} />
        {g >= 0 && <Destello x={r.p.x + 10} y={REP} k={g} r={110} color={COL.amarillo} />}
      </Pared>
      <Contador n={3} k={f + 6} />
      <Grande t={"LA BLANDA\nALARGA LA CAÍDA"} top={1190} k={f - 2} tam={84} fondo={COL.rojo} color="#fff" />
      {g >= 2 && <div style={{ position: "absolute", left: 110, top: 520, fontFamily: "Bricolage Grotesque", fontWeight: 900, fontSize: 200, color: COL.rojo, WebkitTextStroke: `12px ${COL.tinta}`, paintOrder: "stroke fill", transform: `scale(${Math.min(1, 0.5 + g / 8)})` }}>✗</div>}
    </>
  );
};
export const Corta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fC = pal("corta") ?? 60, fB = pal("brusca") ?? 110, fP = pal("poca") ?? 140;
  const ps = pasoAseg(f, 4, 22, XV, 470), k = f - (fC - 14), r = enRepisa(ps.x, k, 0.4, 0.05);
  const z = interpolate(f, [fB - 4, fB + 10], [CAMR.z, 1.0], cl), cy = interpolate(f, [fB - 4, fB + 10], [CAMR.cy, 2200], cl);
  return (
    <>
      <Pared via={VV} cx={CAMR.cx} cy={cy} z={z} sh={r.s.sh * 0.3}>
        <Repisa via={VV} y={REP} />
        <Asegurador via={VV} aspecto={DANI} {...r.s.aseg} x={ps.x} paso={ps.paso} alza={1} comba={k < 0 ? 0.03 : r.s.aseg.comba} />
        <Soga pts={k <= 0 ? porChapas(VV, aparato(VV, ps.x, 0), 3, PR, { comba: 12 }) : r.s.pts} />
        <Persona p={r.p} ang={k <= 0 ? POSE.agarreMira : r.s.ang} aspecto={IRENE} cara={k <= 0 ? "normal" : "alivio"} rot={r.s.rot} />
      </Pared>
      <Contador n={3} k={30} />
      {f < fB - 2 && <Grande t="CORTA ✓" top={1260} k={f - fC - 4} tam={100} fondo={COL.verde} color="#fff" />}
      {f >= fB - 2 && <Grande t="CORTA ≠ BRUSCA" top={1150} k={f - fB + 2} tam={84} fondo={COL.amarillo} />}
      {f >= fB - 2 && <Grande t="POCA CUERDA FUERA ✓" top={1300} k={f - fP + 2} tam={64} fondo={COL.verde} color="#fff" />}
      {void d}
    </>
  );
};
