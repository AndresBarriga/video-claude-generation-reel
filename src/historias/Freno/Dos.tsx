// Escenas 4-7: dar cuerda normal, dar rápido (la excepción), la misma caída bien asegurada y el cierre.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, sistemaCaida, POSE, Lupa, Chip, Etiqueta, Envio, bucle, suave } from "../../piezas/kit";
import { VIA, I, P0, XA, EL, ELLA, VERDE, PP, Puesto, Mundo, clamp, C, type P } from "./comun";
import { Mini, Ko, Contexto, CAE } from "./Uno";

export const Normal: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fE = pal("empujas") ?? 50, t = Math.max(0, f - fE), da = t > 0 ? 0.5 - 0.5 * Math.cos(t / 5.5) : 0;
  return (
    <>
      <PP><Puesto modo="normal" da={da} corre={t > 0 ? t * 9 + 40 * Math.sin(t / 5.5) : 0} f={f} flechas={t > 0 ? 0.6 + 0.4 * Math.sin(t / 2.75) : 0} /></PP>
      <Contexto feed={da} />
      <Chip texto="SIN TOCAR LA LEVA" top={150} tam={56} color={VERDE} k={(f - (pal("leva") ?? 30)) / 5} />
    </>
  );
};
export const Rapido: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fP = pal("pulgar") ?? Math.round(d * 0.45), fI = (pal("instante") ?? fP + 24) + 8, fS = pal("soltar") ?? fI + 10, fV = pal("vuelves") ?? d - 14;
  const pisa = interpolate(f, [fP, fP + 4, fI, fI + 4], [0, 1, 1, 0], clamp), rap = f >= fP - 36 && f < fV + 4, corre = interpolate(f, [fP, fI], [0, 900], clamp);
  return (
    <>
      <PP><Puesto modo={rap ? "rapido" : "normal"} pisa={pisa} marca={pisa > 0.5 ? 3 : rap && f < fP ? 1 : f >= fS - 2 ? 1 : 0} corre={corre} f={f} etiqueta={rap ? 1 : 0} /></PP>
      <Lupa x={822} y={520} r={190} fondo="#2E3948"><Mini t={interpolate(f, [0, fI + 10, d], [0.2, 0.7, 0.95], clamp)} /></Lupa>
      <Chip texto="TRES DEDOS EN LA CUERDA" top={150} tam={56} color={VERDE} k={Math.min((f - (fP - 34)) / 5, (fP - 2 - f) / 4)} />
      <Chip texto="PULGAR EN LA LEVA: UN INSTANTE" top={150} tam={52} color="#C2603A" k={Math.min((f - fP) / 5, (fV - 2 - f) / 4)} />
      <Chip texto="Y LA MANO VUELVE" top={150} tam={56} color={VERDE} k={(f - fV) / 5} />
    </>
  );
};
export const Misma: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fN = d - 32, f0 = 8, s = sistemaCaida(VIA, f - f0, P0, POSE.agarre, { i: I, xAseg: XA, dina: 0.7, comba: 0.5 });
  return (
    <>
      <Mundo cx={470} cy={interpolate(f, [0, d], [P0.y + 260, P0.y + 420], clamp)} z={0.8} sh={s.sh}>
        <Asegurador via={VIA} aspecto={ELLA} quien="joe" alza={1} {...s.aseg} />
        <Soga pts={s.pts} brillo={s.j > 4 ? 0.5 + 0.4 * Math.sin(f / 4) : 0} />
        <Persona p={s.p} ang={s.ang} aspecto={EL} cara={s.j >= 6 ? "alivio" : f > f0 ? "miedo" : "esfuerzo"} rot={s.rot} />
      </Mundo>
      <Chip texto="✓  LEVA LIBRE" top={260} tam={56} color={VERDE} k={(f - (pal("leva") ?? 30)) / 5} />
      <Chip texto="✓  MANO EN LA CUERDA" top={356} tam={56} color={VERDE} k={(f - (pal("mano") ?? 50)) / 5} />
      {f >= fN && <AbsoluteFill style={{ background: `rgba(5,11,20,${0.55 * Math.min(1, (f - fN) / 5)})` }}>
        <Lupa x={540} y={1000} r={300} fondo="#2E3948" k={(f - fN) / 5}>
          <path d="M-30 -320 L-10 40" stroke="#050B14" strokeWidth={50} strokeLinecap="round" /><path d="M-30 -320 L-10 40" stroke={C.cuerda} strokeWidth={38} strokeLinecap="round" />
          <path d="M-10 40 C-90 60 -90 130 -10 130 C70 130 70 200 -10 210 C-90 220 -90 130 -10 110 C70 90 70 40 -10 40" stroke="#050B14" strokeWidth={50} fill="none" /><path d="M-10 40 C-90 60 -90 130 -10 130 C70 130 70 200 -10 210 C-90 220 -90 130 -10 110 C70 90 70 40 -10 40" stroke="#FF9A4A" strokeWidth={38} fill="none" />
          <path d="M-10 210 Q0 250 -20 290" stroke="#050B14" strokeWidth={50} fill="none" strokeLinecap="round" /><path d="M-10 210 Q0 250 -20 290" stroke={C.cuerda} strokeWidth={38} fill="none" strokeLinecap="round" />
        </Lupa>
        <Etiqueta texto="Y NUDO EN LA PUNTA" top={470} tam={100} desde={fN + 2} />
      </AbsoluteFill>}
    </>
  );
};
export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), b = bucle(f, d, 8), fF = pal("frena") ?? 30;
  return (
    <>
      <PP><Puesto modo="normal" sinArriba brilloFreno={0.6 + 0.4 * Math.sin(f / 4)} bloquea={suave(f / 10)} leva={VERDE} f={f} /></PP>
      <div style={{ opacity: 1 - b }}><Etiqueta texto="¿DÓNDE ESTÁ LA TUYA?" top={180} tam={92} desde={fF} /></div>
      <Envio a="quien te asegura" top={1330} k={Math.min(1, Math.max(0, f - fF - 8) / 6) * (1 - b)} />
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><Ko j={-CAE} rotulo /></AbsoluteFill>}
    </>
  );
};
