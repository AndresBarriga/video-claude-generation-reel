// Escenas 4-7: dar cuerda normal, dar rápido (la excepción), la misma caída bien asegurada y el cierre.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, sistemaCaida, POSE, Lupa, Chip, Etiqueta, Envio, bucle, suave } from "../../piezas/kit";
import { VIA, I, P0, XA, EL, ELLA, VERDE, PP, Puesto, Mundo, clamp, type P } from "./comun";
import { Mini, Ko } from "./Uno";

export const Normal: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fE = pal("empujas") ?? 50, t = Math.max(0, f - fE), da = t > 0 ? 0.5 - 0.5 * Math.cos(t / 5.5) : 0;
  return (
    <>
      <PP><Puesto modo="normal" da={da} corre={t > 0 ? t * 9 + 40 * Math.sin(t / 5.5) : 0} f={f} flechas={t > 0 ? 0.6 + 0.4 * Math.sin(t / 2.75) : 0} /></PP>
      <Chip texto="SIN TOCAR LA LEVA" top={190} tam={60} color={VERDE} k={(f - (pal("leva") ?? 30)) / 5} />
    </>
  );
};
export const Rapido: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fP = pal("pulgar") ?? Math.round(d * 0.45), fI = (pal("instante") ?? fP + 24) + 8, fS = pal("soltar") ?? fI + 10, fV = pal("vuelves") ?? d - 14;
  const pisa = interpolate(f, [fP, fP + 4, fI, fI + 4], [0, 1, 1, 0], clamp), rap = f >= fP - 8 && f < fV, corre = interpolate(f, [fP, fI], [0, 900], clamp);
  return (
    <>
      <PP><Puesto modo={rap ? "rapido" : "normal"} pisa={pisa} marca={pisa > 0.5 ? 3 : f >= fS - 2 && f < fV ? 1 : rap && f < fP ? 2 : 0} corre={corre} f={f} etiqueta={rap ? 1 : 0} /></PP>
      <Lupa x={822} y={520} r={190} fondo="#2E3948"><Mini t={interpolate(f, [0, fI + 10, d], [0.2, 0.7, 0.95], clamp)} /></Lupa>
      <Chip texto="PULGAR: SOLO UN INSTANTE" top={130} tam={46} color="#C2603A" k={(f - fP) / 5} />
      <Chip texto="TRES DEDOS EN LA CUERDA" top={212} tam={46} color={VERDE} k={(f - fS) / 5} />
      <Chip texto="Y LA MANO VUELVE" top={294} tam={46} color={VERDE} k={(f - fV) / 5} />
    </>
  );
};
export const Misma: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), f0 = 8, s = sistemaCaida(VIA, f - f0, P0, POSE.agarre, { i: I, xAseg: XA, dina: 0.7, comba: 0.5 });
  return (
    <>
      <Mundo cx={470} cy={interpolate(f, [0, d], [P0.y + 260, P0.y + 420], clamp)} z={0.8} sh={s.sh}>
        <Asegurador via={VIA} aspecto={ELLA} quien="joe" alza={1} {...s.aseg} />
        <Soga pts={s.pts} brillo={s.j > 4 ? 0.5 + 0.4 * Math.sin(f / 4) : 0} />
        <Persona p={s.p} ang={s.ang} aspecto={EL} cara={s.j >= 6 ? "alivio" : f > f0 ? "miedo" : "esfuerzo"} rot={s.rot} />
      </Mundo>
      <Chip texto="✓  LEVA LIBRE" top={260} tam={56} color={VERDE} k={(f - (pal("leva") ?? 30)) / 5} />
      <Chip texto="✓  MANO EN LA CUERDA" top={356} tam={56} color={VERDE} k={(f - (pal("mano") ?? 50)) / 5} />
      <Chip texto="✓  Y NUDO EN LA PUNTA" top={452} tam={56} color={VERDE} k={(f - (pal("cuerda") ?? 70)) / 5} />
    </>
  );
};
export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), b = bucle(f, d, 8), fF = pal("frena") ?? 30;
  return (
    <>
      <PP><Puesto modo="normal" brilloFreno={0.6 + 0.4 * Math.sin(f / 4)} bloquea={suave(f / 10)} leva={VERDE} f={f} /></PP>
      <div style={{ opacity: 1 - b }}><Etiqueta texto="¿DÓNDE ESTÁ LA TUYA?" top={180} tam={92} desde={fF} /></div>
      <Envio a="quien te asegura" top={1330} k={Math.min(1, Math.max(0, f - fF - 8) / 6) * (1 - b)} />
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><Ko j={1} rotulo /></AbsoluteFill>}
    </>
  );
};
