// E80 · escenas 6-7. Idea3: la cámara baja y descubre una repisa natural bajo Irene («BLANDA SIEMPRE, ¿NO?»).
// Repisa: la blanda alarga la caída y los pies golpean la repisa ✗ → ◀◀ → corta (Dani un paso a la pared, poca cuerda) para antes ✓.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, Destello, CADERA } from "../../piezas/kit";
import { pasoAseg } from "./comun";
import { Mar, VA, XA, caerA, aPantalla, cabezaAseg, Creencia, ContadorX, Pildora, IRENE, DANI, COL, F, cl, type P } from "./G2comun";

/** Irene sobre la 2.ª chapa; la repisa se coloca entre donde acaba la corta y donde acabaría la blanda. */
const I1 = 1, P1 = VA.cadera(VA.mos(I1).y - 110), XC = XA + 150;
const maxY = (dina: number, comba: number, xa: number) => Math.max(...Array.from({ length: 70 }, (_, k) => caerA(k, dina, comba, xa, P1, I1).p.y));
const YB = maxY(1, 0.3, XA), YC = maxY(0.4, 0.05, XC);
export const REP = Math.round((YB + YC) / 2 + CADERA - 22);
const enRepisa = (k: number, dina: number, comba: number, xa: number) => {
  const s = caerA(k, dina, comba, xa, P1, I1), tope = REP - CADERA + 22, toca = s.p.y > tope;
  return { s, p: toca ? { x: s.p.x, y: tope } : s.p, toca };
};
const C = { cx: XA + 330, cy: REP - 140, z: 1.05 };

export const BIdea3: React.FC<P> = () => {
  const f = useCurrentFrame(), t = interpolate(f, [0, 16], [0, 1], { ...cl, easing: (x) => x * x * (3 - 2 * x) });
  const c = { cx: C.cx, cy: P1.y + 200 + (C.cy - P1.y - 200) * t, z: C.z }, cab = aPantalla(cabezaAseg(XA).x, cabezaAseg(XA).y, c);
  return (
    <>
      <Mar {...c} f={f} repisa={REP} aviso={t > 0.8 ? 0.5 + 0.5 * Math.sin(f / 2.2) : 0}>
        <Asegurador via={VA} x={XA} aspecto={DANI} alza={1} comba={0.15} cara="normal" />
        <Soga pts={porChapas(VA, aparato(VA, XA), I1 + 1, P1, { comba: 40 })} />
        <Persona p={P1} ang={POSE.agarreMira} aspecto={IRENE} cara="esfuerzo" />
      </Mar>
      <Creencia t="¡BLANDA SIEMPRE, ¿NO?!" x={Math.min(700, cab.x + 260)} y={Math.min(1250, cab.y - 40)} s={(f + 2) / 8} />
      <ContadorX n={3} k={f - 8} />
    </>
  );
};
export const BRepisa: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fC = (pal("frenada") ?? Math.round(d * 0.6)) - 10, fR = fC - 9, fP = (pal("primeras") ?? fC - 20) - 2;
  const chapas = <Pildora t="TAMBIÉN EN LAS PRIMERAS CHAPAS" neutro top={1160} k={f - fP} tam={44} />;
  if (f < fR) {
    const k = f - 2, r = enRepisa(k, 1, 0.3, XA), f0 = Array.from({ length: 80 }, (_, i) => i).find((i) => enRepisa(i - 2, 1, 0.3, XA).toca) ?? 30, g = f - f0;
    return (
      <>
        <Mar {...C} f={f} repisa={REP} sh={g >= 0 && g < 8 ? Math.sin(g * 2.6) * 16 * (1 - g / 8) : 0}>
          <Asegurador via={VA} aspecto={DANI} {...r.s.aseg} alza={1} cara={g >= 0 ? "miedo" : "esfuerzo"} />
          <Soga pts={porChapas(VA, aparato(VA, XA, r.s.aseg.dy), I1 + 1, r.p, { comba: 6, floja: r.toca ? 30 : 0 })} />
          <Persona p={r.p} ang={r.toca ? POSE.recibe : k <= 0 ? POSE.agarreMira : r.s.ang} aspecto={IRENE} cara={g >= 0 ? "dolor" : k <= 0 ? "normal" : "miedo"} rot={r.s.rot} />
          {g >= 0 && <Destello x={r.p.x + 10} y={REP} k={g} r={110} color={COL.amarillo} />}
        </Mar>
        <Pildora t="BLANDA CON REPISA DEBAJO" top={1290} k={f - 2} tam={50} />
        {chapas}
        <ContadorX n={3} k={20} />
      </>
    );
  }
  const rew = f < fC, ps = pasoAseg(f, fC - 4, fC + 10, XA, XC), k = rew ? -1 : f - fC - 4, r = enRepisa(k, 0.4, 0.05, ps.x);
  return (
    <>
      <Mar {...C} f={f} repisa={REP}>
        <Asegurador via={VA} aspecto={DANI} {...(k > 0 ? r.s.aseg : {})} x={ps.x} paso={ps.paso} alza={1} comba={0.03} cara={k > 0 ? "esfuerzo" : "serio"} />
        <Soga pts={k <= 0 ? porChapas(VA, aparato(VA, ps.x), I1 + 1, P1, { comba: 10 }) : r.s.pts} />
        <Persona p={r.p} ang={k <= 0 ? POSE.agarreMira : r.s.ang} aspecto={IRENE} cara={k <= 0 ? "normal" : "alivio"} rot={k > 0 ? r.s.rot : 0} />
      </Mar>
      {rew && <div style={{ position: "absolute", inset: 0, background: "rgba(61,123,224,.18)" }}><div style={{ position: "absolute", right: 70, top: 380, fontFamily: F, fontWeight: 900, fontSize: 110, color: "#fff", WebkitTextStroke: `10px ${COL.tinta}`, paintOrder: "stroke fill" }}>◀◀</div></div>}
      <Pildora t="FRENADA CORTA" ok top={1290} k={f - fC} />
      {chapas}
      <ContadorX n={3} k={20} />
    </>
  );
};
