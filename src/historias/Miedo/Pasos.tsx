// E72 · los tres pasos: 1) caídas por niveles (top rope → chapa a la cintura → por encima), 2) cómo caer (lista ✓/✗), 3) conoce la vía en top rope.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, accEscalar, Bocadillo } from "../../piezas/kit";
import { Gym, VIA, LOLA, LEO, XA, caer, cl, pop, COL, F, Svg, type P } from "./comun";
import { Ficha, Linea, Grande } from "./Ui";

const NIV = [VIA.cadera(VIA.mos(3).y + 210), VIA.cadera(VIA.mos(3).y + 60), VIA.cadera(VIA.mos(3).y - 110)];
export const Uno: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fAv = pal("avisando") ?? 20, fLi = pal("libre") ?? 60, fPr = pal("primero") ?? 110;
  const fs = [pal("top") ?? fPr + 15, pal("cintura") ?? fPr + 60, pal("encima") ?? fPr + 110];
  const n = f >= fs[2] ? 2 : f >= fs[1] ? 1 : 0, k = f - fs[n], s = caer(k, NIV[n], 3, 0.3);
  const libre = interpolate(f, [fLi, fLi + 8], [0, 1], cl) * interpolate(f, [fPr + 10, fPr + 20], [1, 0], cl);
  return (
    <>
      <Gym cx={560} cy={2020} z={0.92} sh={s.sh * 0.4} libre={libre}>
        <Asegurador via={VIA} aspecto={LEO} {...s.aseg} alza={1} cara={f > fAv + 14 ? "normal" : s.aseg.cara} />
        <Soga pts={k < 0 ? porChapas(VIA, aparato(VIA, XA, 0), 4, NIV[n]) : s.pts} />
        <Persona p={k < 0 ? NIV[n] : s.p} ang={k < 0 ? POSE.agarreMira : s.ang} aspecto={LOLA} cara={k < 0 ? "miedo" : "alivio"} rot={k < 0 ? 0 : s.rot} />
      </Gym>
      {f >= fAv && f < fPr && <><Bocadillo x={560} y={640} texto="¡VOY A CAER!" s={pop(f - fAv)} /><Bocadillo x={330} y={1240} texto="¡VALE!" s={pop(f - fAv - 14)} cola="arriba" /></>}
      {f >= fPr - 2 && ["cuerdaArriba", "cintura", "encima"].map((ic, i) => <Ficha key={ic} icono={ic} texto={["TOP ROPE", "A LA CINTURA", "POR ENCIMA"][i]} x={170 + i * 270} y={1590} k={f - fPr + 2 - i * 3} s={0.74} ok={f >= fs[i] + 6 ? true : undefined} activa={f >= fs[i] - 2} />)}
    </>
  );
};
export const Dos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), k = (f * 0.5) % 44 - 4, s = caer(k, NIV[2], 3, 0.3);
  const L: [string, boolean, string, string][] = [["PIES DELANTE", true, "pies", "pies"], ["RODILLAS FLOJAS", true, "rodilla", "rodillas"], ["CUERDA DETRÁS", false, "pierna", "cuerda"], ["MANO A LA CINTA", false, "cinta", "manos"]];
  return (
    <>
      <Gym cx={NIV[2].x + 120} cy={NIV[2].y + 260} z={1.25} sh={s.sh * 0.3}>
        <Asegurador via={VIA} aspecto={LEO} {...s.aseg} alza={1} />
        <Soga pts={k < 0 ? porChapas(VIA, aparato(VIA, XA, 0), 4, NIV[2]) : s.pts} />
        <Persona p={k < 0 ? NIV[2] : s.p} ang={k < 0 ? POSE.agarre : s.ang} aspecto={LOLA} cara={k < 0 ? "normal" : "alivio"} rot={k < 0 ? 0 : s.rot} />
      </Gym>
      <Grande t="ASÍ SE CAE" top={1700} k={f} tam={84} fondo={COL.menta} color="#fff" />
      {L.map(([t, ok, ic, w], i) => <Linea key={t} t={t} ok={ok} icono={ic} top={1080 + i * 150} k={f - (pal(w) ?? 40 + i * 40)} />)}
    </>
  );
};
export const Tres: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fPa = pal("pasos") ?? 40, fCh = pal("chapas") ?? 80, fPr = pal("primero") ?? d - 40;
  const lead = f >= fPr - 2, t = interpolate(f, [0, d], [0, 1], cl), e = accEscalar(VIA, VIA.mos(1).y + 160, VIA.mos(3).y - 40, t, 8);
  const top = { x: VIA.xF(VIA.mos(5).y) - 10, y: VIA.mos(5).y };
  const soga = lead ? porChapas(VIA, aparato(VIA, XA, 0), e.p.y < VIA.mos(2).y ? 3 : 2, e.p) : [{ x: XA + 40, y: VIA.pie - 40 }, top, { x: e.p.x + 20, y: e.p.y + 10 }];
  const presas = Array.from({ length: 6 }, (_, i) => VIA.mos(1).y + 40 - i * 150);
  return (
    <>
      <Gym cx={560} cy={VIA.mos(2).y + 120} z={0.95}>
        <Asegurador via={VIA} x={XA} aspecto={LEO} hacia={lead ? VIA.mos(0) : top} />
        <Soga pts={soga} />
        <Persona p={e.p} ang={e.ang} aspecto={LOLA} cara={lead ? "normal" : "esfuerzo"} />
      </Gym>
      <Svg>
        <g transform={`translate(540 960) scale(0.95) translate(-560 ${-(VIA.mos(2).y + 120)})`}>
          {presas.map((y, i) => { const kk = pop(f - fPa - i * 5); return kk > 0 && <g key={i} transform={`translate(${VIA.xF(y) + 130} ${y}) scale(${kk})`}><circle r={40} fill={COL.amarillo} stroke={COL.tinta} strokeWidth={8} /><text y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill={COL.tinta}>{i + 1}</text></g>; })}
          {[1, 2, 3, 4].map((i) => { const kk = pop(f - fCh - (i - 1) * 5); return kk > 0 && <g key={i} transform={`translate(${VIA.mos(i).x + 120} ${VIA.mos(i).y - 30}) scale(${kk})`}><rect x={-40} y={-40} width={80} height={80} rx={20} fill={COL.verde} stroke={COL.tinta} strokeWidth={8} /><text y={22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">✓</text></g>; })}
        </g>
      </Svg>
      <Grande t={lead ? "DE PRIMERO ✓" : "1.º EN TOP ROPE"} top={1500} k={lead ? f - fPr + 2 : f - 4} tam={84} fondo={lead ? COL.verde : COL.amarillo} color={lead ? "#fff" : COL.tinta} />
      {void AbsoluteFill}
    </>
  );
};
