// E79 · plano del desplome: gancho (a punto de soltarse: brazo que tiembla, tiza, pie que resbala), suelta (cae al aire, frenada blanda),
// desplome 1/4 (Dani da un pasito hacia la pared → blanda ✓; luego seca → se estampa ✗) y cierre en bucle al plano del fotograma 0.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, POSE, porChapas, aparato, resbala, Polvo, Destello, bucle } from "../../piezas/kit";
import { Envio } from "../../piezas/kit/Montaje";
import { Pared, VD, IRENE, DANI, caer, Tiza, Contador, pasoAseg, Grande, COL, F, cl, type P } from "./comun";

export const P0 = VD.cadera(VD.mos(3).y - 110);
export const XD = 1180;
const I = 3;
/** Irene agarrada en el desplome antes de soltarse (f = fotogramas del plano). */
const Agarrada: React.FC<{ f: number; xa?: number; mira?: boolean; dy?: number }> = ({ f, xa = XD, mira, dy = 0 }) => {
  const slip = interpolate(f, [26, 31, 44, 60], [0, 1, 1, 0.5], cl), tiembla = Math.sin(f * 2.2) * (3 + 2 * slip);
  return (
    <>
      <Asegurador via={VD} x={xa} aspecto={DANI} alza={1} dy={dy} cara={mira ? "normal" : "miedo"} />
      <Soga pts={porChapas(VD, aparato(VD, xa, dy), I + 1, P0, { comba: 40 })} />
      <Persona p={P0} ang={resbala(POSE.agarreMira, slip)} aspecto={IRENE} cara={slip > 0.5 ? "miedo" : "esfuerzo"} tiembla={tiembla} />
      <Tiza x={VD.xF(P0.y - 150) - 40} y={P0.y - 150} f={f} />
    </>
  );
};
const CAM0 = { cx: P0.x + 70, cy: P0.y + 10, z: 1.85 };

export const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pared via={VD} {...CAM0}><Agarrada f={f} /></Pared>
      <Grande t={"EL PEOR SITIO\nPARA CAERTE"} top={1190} k={12} tam={100} />
    </>
  );
};
export const Suelta: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), k = f - 3, s = caer(VD, XD, k, P0, I, 1, 0.3), fM = pal("mejor") ?? 40;
  const t = interpolate(f, [0, 26], [0, 1], { ...cl, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <>
      <Pared via={VD} cx={CAM0.cx + (1010 - CAM0.cx) * t} cy={CAM0.cy + (VD.mos(I).y + 300 - CAM0.cy) * t} z={CAM0.z + (1.0 - CAM0.z) * t} sh={s.sh * 0.5}>
        <Asegurador via={VD} aspecto={DANI} {...s.aseg} alza={1} />
        <Soga pts={s.pts} />
        <Persona p={s.p} ang={k <= 0 ? POSE.agarreMira : s.ang} aspecto={IRENE} cara={k <= 0 ? "miedo" : s.cara} rot={s.rot} />
      </Pared>
      {f < fM && <Grande t={"EL PEOR SITIO\nPARA CAERTE"} top={1190} k={12} tam={100} />}
      <Grande t="…O EL MEJOR" top={1250} k={f - fM + 2} tam={110} fondo={COL.verde} color="#fff" />
    </>
  );
};
export const Desplome: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fB = pal("blanda") ?? 24, fS = (pal("seco") ?? 70) - 4;
  // Rebobinado de 9 fotogramas antes de la seca: la MISMA caída vuelve atrás y se repite frenada en seco.
  const fR = fS - 9, rew = f >= fR && f < fS ? (f - fR) / 9 : -1;
  const ps = pasoAseg(f, 2, 14, XD, XD + 70), k1 = rew >= 0 ? Math.round((fR - 12) * (1 - rew)) : f - 12, s1 = caer(VD, ps.x, k1, P0, I, 1, 0.3);
  const k2 = f - fS, seca = k2 >= 0, s2 = caer(VD, XD, k2, P0, I, 0, 0.3);
  // Frenada seca: el tirón la lanza contra la pared (péndulo) → se estampa.
  const sw = seca && s2.j >= 0 ? Math.min(1, s2.j / 7) : 0, xMuro = VD.xF(s2.p.y + 60) - 34, golpeK = seca && s2.j >= 0 ? s2.j - 7 : -1;
  const p2 = { x: s2.p.x + (xMuro - s2.p.x) * sw * sw, y: s2.p.y };
  const s = seca ? s2 : s1;
  return (
    <>
      <Pared via={VD} cx={1010} cy={VD.mos(I).y + 330} z={1.0} sh={s.sh * 0.6 + (golpeK >= 0 && golpeK < 8 ? Math.sin(golpeK * 2.6) * 12 * (1 - golpeK / 8) : 0)}>
        <Asegurador via={VD} aspecto={DANI} {...(seca ? s2.aseg : { ...s1.aseg, x: ps.x })} paso={seca ? 0 : ps.paso} alza={1} />
        <Soga pts={seca ? porChapas(VD, aparato(VD, XD, s2.aseg.dy), I + 1, p2, { comba: 6 }) : s1.pts} />
        <Persona p={seca ? p2 : s1.p} ang={seca ? s2.ang : k1 <= 0 ? POSE.agarreMira : s1.ang} aspecto={IRENE} cara={seca ? (golpeK >= 0 ? "dolor" : "miedo") : k1 <= 0 ? "miedo" : "alivio"} rot={s.rot} />
        {golpeK >= 0 && <><Destello x={xMuro + 70} y={p2.y + 10} k={golpeK} r={130} color={COL.amarillo} /><Polvo x={xMuro + 40} k={golpeK} suelo={p2.y + 30} /></>}
      </Pared>
      {rew >= 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(61,123,224,.18)" }}><div style={{ position: "absolute", right: 70, top: 380, fontFamily: F, fontWeight: 900, fontSize: 110, color: "#fff", WebkitTextStroke: `10px ${COL.tinta}`, paintOrder: "stroke fill" }}>◀◀</div></div>}
      <Contador n={1} k={f + 6} />
      {!seca && rew < 0 && <Grande t="BLANDA ✓" top={1260} k={f - fB + 2} tam={100} fondo={COL.verde} color="#fff" />}
      {seca && <Grande t="SECA ✗" top={1260} k={k2 + 2} tam={100} fondo={COL.rojo} color="#fff" />}
    </>
  );
};
export const Cta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), fM = pal("mándaselo") ?? d - 70, vuelve = bucle(f, d, 18);
  const asiente = f > 20 && f < 60 ? Math.sin((f - 20) / 40 * Math.PI * 4) * 5 : 0;
  const z = 1.05 + (CAM0.z - 1.05) * vuelve, cx = 1010 + (CAM0.cx - 1010) * vuelve, cy = VD.mos(I).y + 250 + (CAM0.cy - VD.mos(I).y - 250) * vuelve;
  return (
    <>
      <Pared via={VD} cx={cx} cy={cy} z={z}><Agarrada f={f} mira dy={asiente} /></Pared>
      {vuelve < 0.3 && <Grande t={"PARTE 2: ¿CÓMO FRENA\nBLANDO SIN DAR\nCOMBA DE MÁS?"} top={1080} k={f - 8} tam={64} fondo={COL.amarillo} />}
      {vuelve < 0.3 && <Envio a="quien te asegura" k={(f - fM + 4) / 8} top={1400} />}
      {vuelve > 0.5 && <Grande t={"EL PEOR SITIO\nPARA CAERTE"} top={1190} k={12} tam={100} />}
    </>
  );
};
