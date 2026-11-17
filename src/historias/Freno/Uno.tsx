// Escenas 1-3: el gancho (aparato agarrado y se cae), la cuerda corre, y las dos cosas que necesita el aparato.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, Sala, porChapas, aparato, accChapar, sogaChapar, POSE, mix, G, PM, Lupa, Pregunta, Chip, Foco, Destello, suave } from "../../piezas/kit";
import { VIA, I, P0, XA, EL, ELLA, VERDE, ROJO, AP, Mundo, PP, Puesto, clamp, golpe, type P } from "./comun";

/** Vista pequeña del escalador para la lupa: `cae` = fotogramas desde que se le va el pie (<0 = chapando, t 0–1). */
export const Mini: React.FC<{ t: number; cae?: number }> = ({ t, cae = -1 }) => {
  const a = accChapar(VIA, P0, 5, Math.min(0.66, t), { temblor: 0.6 }), k = Math.max(0, cae), p = { x: P0.x - 6 * Math.min(1, k / 6), y: P0.y + G * k * k };
  return (
    <g transform={`scale(1.25) translate(${-P0.x - 30} ${-P0.y + 70 - (p.y - P0.y) * 0.5})`}>
      <Sala xF={VIA.xF} suelo={VIA.suelo} cintas={VIA.chapas} />
      <Soga pts={cae < 0 ? sogaChapar(VIA, aparato(VIA, XA), 5, P0, a) : porChapas(VIA, aparato(VIA, XA), 5, p, { floja: 60, sx: -50 })} />
      <Persona p={p} ang={cae < 0 ? a.ang : mix(a.ang, POSE.cae, Math.min(1, k / 4))} aspecto={EL} cara={cae < 0 ? "esfuerzo" : "miedo"} />
    </g>
  );
};
/** Estado del gancho en el fotograma f (se reutiliza para cerrar el bucle). fS = fotograma en que se le va el pie. */
export const Inicio: React.FC<{ f: number; fS: number }> = ({ f, fS }) => {
  const k = f - fS, corre = Math.min(f, fS) * 9 + (k > 0 ? k * k * 4 : 0);
  return (
    <>
      <PP sh={golpe(f, fS, 16)} tinte={k > 0 ? "#5A3B3B" : "#3B4757"}>
        <Puesto modo="mal" corre={corre} leva={k > 0 ? ROJO : undefined} f={f} />
        {k > 0 && <Foco x={AP.x - 8} y={AP.y - 30} r={150} color={ROJO} />}
      </PP>
      <Lupa x={270} y={590} r={215} fondo="#2E3948"><Mini t={0.3 + 0.36 * Math.min(1, f / Math.max(1, fS))} cae={k > 0 ? k * 0.55 : -1} /></Lupa>
      <Pregunta texto="¿FRENA?" top={180} tam={130} />
    </>
  );
};
export const Gancho: React.FC<P> = ({ d, pal }) => <Inicio f={useCurrentFrame()} fS={pal("cae") ?? d - 12} />;

export const Corre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fB = pal("cuerda") ?? Math.round(d * 0.4);
  if (f < fB) return (
    <>
      <PP sh={Math.sin(f * 2.3) * 7} tinte="#5A3B3B">
        <Puesto modo="mal" corre={f * 70} leva={ROJO} f={f} />
        <Foco x={AP.x - 8} y={AP.y - 30} r={150} color={ROJO} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${700 + i * 40} ${330 + ((f * 50 + i * 90) % 260)} v70`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.5} />)}
      </PP>
      <Chip texto="LEVA APRETADA" top={300} tam={56} color={ROJO} k={Math.min(1, f / 5)} />
    </>
  );
  // general: baja con la cuerda hasta que ella agarra la cuerda de freno, a un metro de la colchoneta
  const k = f - fB, yFin = VIA.pie - 1.1 * PM, kF = Math.sqrt((yFin - P0.y) / (0.55 * G)), j = k - kF;
  const y = k < kF ? P0.y + 0.55 * G * k * k : yFin + 46 * Math.exp(-j / 7) * Math.sin(j / 2.6), p = { x: VIA.hipX(y) - 30 * Math.min(1, k / 10), y };
  const dy = j > 0 ? -70 * Math.exp(-j / 9) * Math.abs(Math.sin(j / 4)) : 0;
  return (
    <>
      <Mundo cx={470} cy={interpolate(k, [0, kF], [P0.y + 200, VIA.pie - 420], clamp)} z={0.92} sh={golpe(k, Math.round(kF), 24)}>
        <Asegurador via={VIA} x={XA} cuerda={false} aspecto={ELLA} quien="joe" alza={1} cara="miedo" dy={dy} vuelo={Math.min(1, -dy / 40)} comba={j > 0 ? 0 : 0.3} />
        <Soga pts={porChapas(VIA, aparato(VIA, XA, dy), 5, p, { floja: j > 0 ? 0 : 30 })} brillo={j > 0 ? 0 : 0.5} />
        <Persona p={p} ang={j > 0 ? mix(POSE.cae, POSE.colgado, Math.min(1, j / 6)) : POSE.cae} aspecto={EL} cara="miedo" rot={j > 0 ? 0 : -6} />
        <Destello x={aparato(VIA, XA).x} y={aparato(VIA, XA).y} k={j} r={90} />
        {j < 0 && [0, 1, 2].map((i) => <path key={i} d={`M${p.x - 60 + i * 50} ${p.y - 230 - i * 20} v-90`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />)}
      </Mundo>
    </>
  );
};
export const Dos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fL = pal("leva") ?? 60, fM = pal("mano") ?? 100, gira = suave((f - fL) / 8), mano = f >= fM - 4;
  return (
    <>
      <PP>
        <Puesto modo={mano ? "normal" : "solo"} bloquea={gira} leva={gira > 0.5 ? VERDE : undefined} brilloFreno={mano ? 0.6 + 0.4 * Math.sin(f / 4) : 0} f={f} />
        {f >= fL - 4 && !mano && <Foco x={AP.x + 16} y={AP.y - 30} r={110} color="#8FE0AE" k={(f - fL + 4) / 5} />}
      </PP>
      <Chip texto="1 · LEVA LIBRE" top={250} tam={58} color={VERDE} k={(f - fL) / 5} />
      <Chip texto="2 · MANO EN LA CUERDA DE FRENO" top={350} tam={50} color={VERDE} k={(f - fM) / 5} />
    </>
  );
};
