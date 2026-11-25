// E80 · escenas 4-5. Idea2: Dani se agacha listo para saltar («SI SALTO, AMORTIGUO»).
// Antes: cámara lenta; Dani salta pronto (trayectoria en puntos), cuando la cuerda se tensa YA VA BAJANDO → frenada dura (medidor en rojo).
// Después ◀◀ la misma caída acompañada a tiempo ✓. Nunca se dice el momento exacto: solo «se acompaña, no se adelanta».
import React from "react";
import { useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato } from "../../piezas/kit";
import { Mar, VA, XA, I, P0, caerA, kTensa, aPantalla, cabezaAseg, Creencia, ContadorX, Tiron, Pildora, IRENE, DANI, COL, F, type P } from "./G2comun";

const C = { cx: XA + 280, cy: VA.pie - 520, z: 0.82 };
export const BIdea2: React.FC<P> = () => {
  const f = useCurrentFrame(), agacha = 18 + 10 * Math.sin(f / 5), cab = aPantalla(cabezaAseg(XA, agacha).x, cabezaAseg(XA, agacha).y, C);
  return (
    <>
      <Mar {...C} f={f}>
        <Asegurador via={VA} x={XA} aspecto={DANI} dy={agacha} alza={1} comba={0.15} cara="esfuerzo" />
        <Soga pts={porChapas(VA, aparato(VA, XA, agacha), I + 1, P0, { comba: 40 })} />
        <Persona p={P0} ang={POSE.agarreMira} aspecto={IRENE} cara="esfuerzo" tiembla={Math.sin(f * 2) * 3} />
      </Mar>
      <Creencia t="¡SI SALTO, AMORTIGUO!" x={cab.x + 230} y={cab.y - 30} s={(f + 2) / 8} />
      <ContadorX n={2} k={f - 10} />
    </>
  );
};
/** Salto de Dani (dy < 0 = arriba) que empieza en kJ y tiene su punto más alto en kA. */
const salto = (k: number, kJ: number, kA: number, H = 130) => { const D = 2 * (kA - kJ), t = (k - kJ) / D; return t <= 0 || t >= 1 ? 0 : -H * 4 * t * (1 - t); };
export const BAntes: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fD = pal("duro") ?? Math.round(d * 0.4), fT = (pal("tirón") ?? Math.round(d * 0.65)) - 4, fR = fT - 9;
  const kT = kTensa(0, 0.3), kA = kT - 7, kJ = 1;
  if (f < fR) {
    // A · cámara lenta (0,55): salta pronto; al tensarse la cuerda ya va bajando → seca
    const k = (f - 6) * 0.55, s = caerA(k, 0, 0.3), dy = salto(k, kJ, kA), baja = k > kA && k < kJ + 2 * (kA - kJ);
    const tir = s.j >= 0 ? 0.9 * Math.min(1, s.j / 2) * Math.exp(-Math.max(0, s.j - 6) / 18) + 0.05 : 0.05;
    const tray = Array.from({ length: 12 }, (_, i) => { const kk = kJ + (i / 11) * 2 * (kA - kJ); return aPantalla(XA + 10, VA.pie + salto(kk, kJ, kA) - 260, C); });
    return (
      <>
        <Mar {...C} sh={s.sh * 0.7} f={f}>
          <Asegurador via={VA} aspecto={DANI} x={XA} dy={dy} alza={1} comba={k < kT ? 0.25 : 0.05} cara={s.j >= 0 ? "dolor" : "esfuerzo"} />
          <Soga pts={k > 0 ? porChapas(VA, aparato(VA, XA, dy), I + 1, s.p, { comba: s.j < 0 ? 50 : 4, floja: s.j < 0 ? 40 : 0 }) : porChapas(VA, aparato(VA, XA), I + 1, P0, { comba: 40 })} />
          <Persona p={k > 0 ? s.p : P0} ang={k > 0 ? s.ang : POSE.agarreMira} aspecto={IRENE} cara={s.j >= 0 ? "dolor" : k > 0 ? "miedo" : "esfuerzo"} rot={k > 0 ? s.rot : 0} />
        </Mar>
        <svg style={{ position: "absolute", inset: 0 }} width={1080} height={1920}>{tray.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={9} fill={COL.amarillo} stroke={COL.tinta} strokeWidth={4} opacity={k > kJ + i * (2 * (kA - kJ)) / 11 ? 1 : 0.25} />)}</svg>
        <div style={{ position: "absolute", left: 40, top: 300, fontFamily: "Figtree", fontWeight: 700, fontSize: 34, color: "#fff", background: "rgba(20,33,58,.75)", borderRadius: 20, padding: "6px 18px" }}>CÁMARA LENTA</div>
        <Tiron v={tir} />
        {f < fD - 4 && <Pildora t="SALTA ANTES DE TIEMPO" top={1290} k={f - 4} tam={50} />}
        {(baja || s.j >= 0) && f < fD - 4 && <Pildora t="…Y YA VA BAJANDO" neutro top={1400} k={8} tam={46} />}
        {f >= fD - 4 && <Pildora t="MÁS DURO QUE NO SALTAR" top={1290} k={f - fD + 6} tam={50} />}
        <ContadorX n={2} k={20} />
      </>
    );
  }
  // B · ◀◀ y la misma caída, acompañada a tiempo
  const rew = f < fT, k2 = rew ? 0 : (f - fT) * 0.8 + kT - 8, s = caerA(k2, 1, 0.3), tir = s.j >= 0 ? 0.3 * Math.min(1, s.j / 4) + 0.04 : 0.04;
  return (
    <>
      <Mar {...C} sh={s.sh * 0.3} f={f}>
        <Asegurador via={VA} aspecto={DANI} {...s.aseg} alza={1} cara={s.j >= 0 ? "esfuerzo" : "serio"} />
        <Soga pts={k2 > 0 ? s.pts : porChapas(VA, aparato(VA, XA), I + 1, P0, { comba: 40 })} />
        <Persona p={k2 > 0 ? s.p : P0} ang={k2 > 0 ? s.ang : POSE.agarreMira} aspecto={IRENE} cara={s.j >= 2 ? "alivio" : "miedo"} rot={k2 > 0 ? s.rot : 0} />
      </Mar>
      {rew && <div style={{ position: "absolute", inset: 0, background: "rgba(61,123,224,.18)" }}><div style={{ position: "absolute", right: 70, top: 380, fontFamily: F, fontWeight: 900, fontSize: 110, color: "#fff", WebkitTextStroke: `10px ${COL.tinta}`, paintOrder: "stroke fill" }}>◀◀</div></div>}
      <Tiron v={tir} />
      <Pildora t="SE ACOMPAÑA, NO SE ADELANTA" ok top={1290} k={f - fT + 2} tam={46} />
      <ContadorX n={2} k={20} />
    </>
  );
};
