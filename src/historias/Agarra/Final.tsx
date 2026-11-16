// «Pasa pocas veces. Con una basta.» (negro + contador de dedos) · TOMA buena · «deja que la cuerda haga su trabajo» · cierre con bucle al fotograma 0.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, sistemaCaida, POSE, Chip, Lupa, Agarre, Envio, Pregunta, bucle, suave } from "../../piezas/kit";
import { VIA, I, P0, XA, TU, ASE, Mundo, Rebobina, Toma, N_REB, clamp, type P } from "./comun";
import { Lenta } from "./Gancho";

export const Dedo: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fB = pal("basta") ?? 50, cuatro = f >= 16, punch = cuatro ? 1 + 0.5 * Math.exp(-(f - 16) / 4) : 1;
  return (
    <AbsoluteFill style={{ background: "#050B14", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 560, fontFamily: "Figtree", fontWeight: 700, fontSize: 90, letterSpacing: 10, color: "#C9D1D8" }}>DEDOS</div>
      <div style={{ position: "absolute", top: 660, fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 420, lineHeight: 1, color: cuatro ? "#E2533F" : "#fff", transform: `scale(${punch}) rotate(${cuatro ? -4 * Math.exp(-(f - 16) / 6) : 0}deg)` }}>{cuatro ? 4 : 5}</div>
      {f >= fB - 2 && <div style={{ position: "absolute", top: 1120, width: 360, height: 12, borderRadius: 6, background: "#E2533F", transform: `scaleX(${Math.min(1, (f - fB + 2) / 6)})` }} />}
    </AbsoluteFill>
  );
};
const estado = (k: number) => sistemaCaida(VIA, k, P0, POSE.agarre, { i: I, xAseg: XA, dina: 1, aire: POSE.caeBien, comba: 0.5 });
const OK: React.FC<{ t: string; top: number; k: number }> = ({ t, top, k }) => <Chip texto={`✓  ${t}`} top={top} tam={52} k={Math.min(1, Math.max(0, k) / 5)} color="#2E8B57" />;
export const Bien: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), f0 = pal("agarres") ?? 34, fP = (pal("pies") ?? d - 60) + 2, fL = fP + 20;
  const k = f < f0 ? 0 : f < fP ? (f - f0) * (11 / Math.max(1, fP - f0)) : 11 + (f - fP), s = estado(k), reb = f < N_REB ? 1 - f / N_REB : 0;
  const p = reb ? { x: P0.x - 30 * reb, y: P0.y + 300 * reb } : s.p, saluda = interpolate(f, [fL, fL + 6], [0, 1], clamp);
  return (
    <>
      <Mundo cx={500} cy={p.y + 30} z={1.6} sh={s.sh * 0.5}>
        <Asegurador via={VIA} aspecto={ASE} alza={1} {...s.aseg} />
        <Soga pts={s.pts} />
        <Persona p={p} ang={reb ? POSE.colgado : s.ang} aspecto={TU} cara={s.j >= 0 ? "alivio" : f > f0 ? "esfuerzo" : "normal"} rot={s.rot} />
      </Mundo>
      <Rebobina k={f} /><Toma n="ÚLTIMA TOMA" k={f - N_REB} />
      <OK t="MANOS DELANTE" top={300} k={f - (pal("manos") ?? 60)} /><OK t="BRAZOS BLANDOS" top={396} k={f - (pal("brazos") ?? 80)} /><OK t="PIES A LA PARED" top={492} k={f - (pal("pies") ?? 100)} />
      <Lupa x={290} y={1010} r={210} k={saluda} fondo="#7FB7D9">
        <Agarre x={-20} y={60} s={0.62} rot={-90 + Math.sin(f / 3) * 12} cierra={0} piel="#B9825A" pielS="#94613E" manga="#3F7F86" />
        <text x={120} y={-70} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={150} fill="#fff" stroke="#050B14" strokeWidth={16} paintOrder="stroke">5</text>
      </Lupa>
    </>
  );
};
export const Confia: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), s = estado(70 + f), z = 1.25 - 0.3 * suave(f / d);
  return (
    <Mundo cx={450} cy={s.p.y + 330 * suave(f / d)} z={z}>
      <Asegurador via={VIA} aspecto={ASE} alza={1} {...s.aseg} cara="alivio" />
      <Soga pts={s.pts} brillo={0.55 + 0.45 * Math.sin(f / 4)} />
      <Persona p={s.p} ang={{ ...s.ang, brazoA: [150, 170] }} aspecto={TU} cara="alivio" />
    </Mundo>
  );
};
export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fN = pal("no") ?? 44, va = interpolate(f, [0, fN], [0.35, 0.92], clamp), ret = suave((f - fN) / 9), b = bucle(f, d, 8);
  return (
    <>
      <Lenta f={f} va={va} retira={ret} />
      <Envio a="quien siempre agarra la cinta" top={300} k={Math.min(1, Math.max(0, f - (pal("salvarte") ?? 24)) / 6) * (1 - b)} />
      {b > 0 && <AbsoluteFill style={{ opacity: b }}><Lenta f={0} va={0.35} /><Pregunta texto="¿LA AGARRAS?" top={300} tam={104} /></AbsoluteFill>}
    </>
  );
};
