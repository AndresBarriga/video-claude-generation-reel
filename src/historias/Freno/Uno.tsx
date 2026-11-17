// Escenas 1-3: el gancho (ya está en el suelo → rebobinado → aparato agarrado y se cae), la cuerda corre hasta la colchoneta, y las dos cosas que necesita el aparato.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, Sala, Polvo, porChapas, aparato, accChapar, sogaChapar, POSE, mix, G, Lupa, Etiqueta, Chip, Foco, suave, type Angulos } from "../../piezas/kit";
import { Rebobina, N_REB } from "../Agarra/comun";
import { VIA, P0, XA, EL, ELLA, VERDE, ROJO, TAB, Mundo, PP, Puesto, golpe, type P } from "./comun";

const LEVA = TAB;
const TIRADO: Angulos = { torso: 4, cabeza: 10, brazoA: [150, 120], brazoB: [-140, -110], piernaA: [34, 10], piernaB: [-22, -34] };
const XS = VIA.hipX(VIA.pie) + 14, YS = VIA.suelo - 36;
/** Fotogramas de caída que se ven antes del golpe al abrir el vídeo. */
export const CAE = 26;
/** En la colchoneta, fuera de combate. j = fotogramas desde el golpe. */
export const Ko: React.FC<{ j: number; rotulo?: boolean }> = ({ j, rotulo }) => {
  const aire = j < 0, e = Math.min(1, Math.max(0, j) / 5), bote = aire ? 36 * j + 0.3 * j * j : j < 12 ? -26 * Math.abs(Math.sin(j / 3.8)) * (1 - j / 12) : 0, hx = XS - 150, hy = YS - 66;
  return (
    <>
      <Mundo cx={470} cy={VIA.suelo - 330 + (aire ? j * 22 : 0)} z={1.42 - (aire ? -j * 0.012 : 0)} sh={golpe(j, 0, 28)}>
        <Asegurador via={VIA} x={XA - 60} cuerda={false} aspecto={ELLA} quien="joe" cara="miedo" comba={0.5} />
        <Soga pts={porChapas(VIA, aparato(VIA, XA - 60), 5, { x: XS, y: YS - 10 + (aire ? bote : 0) }, { floja: aire ? 30 : 120, sx: aire ? 0 : 60 })} />
        <Persona p={{ x: XS + (aire ? -j * 2 : 0), y: YS + bote }} ang={aire ? POSE.cae : TIRADO} aspecto={EL} cara={aire ? "miedo" : "ko"} rot={aire ? -38 : -38 - 52 * e} />
        {aire && [0, 1, 2, 3].map((i) => <path key={i} d={`M${XS - 90 + i * 56} ${YS + bote - 250 - (i % 2) * 40} v-150`} stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.65} />)}
        <Polvo x={XS - 60} k={j} suelo={VIA.suelo} />
        {j > 6 && [0, 1, 2].map((i) => { const a = j / 5 + (i * Math.PI * 2) / 3; return <g key={i} transform={`translate(${hx + Math.cos(a) * 58} ${hy + Math.sin(a) * 18}) rotate(${j * 6}) scale(${0.8 + 0.2 * Math.sin(a)})`}><path d="M0 -20 L5 -6 L20 -6 L8 3 L12 18 L0 9 L-12 18 L-8 3 L-20 -6 L-5 -6 Z" fill="#FFD24A" stroke="#050B14" strokeWidth={4} strokeLinejoin="round" /></g>; })}
      </Mundo>
      {rotulo && <Etiqueta texto="¿QUÉ HA PASADO?" top={230} tam={104} desde={-15} />}
    </>
  );
};
/** Vista pequeña del escalador para la lupa: `cae` = fotogramas desde que se le va el pie (<0 = chapando, t 0–1). */
export const Mini: React.FC<{ t: number; cae?: number }> = ({ t, cae = -1 }) => {
  const a = accChapar(VIA, P0, 5, Math.min(0.66, t), { temblor: 0.6 }), k = Math.max(0, cae), p = { x: P0.x - 6 * Math.min(1, k / 6), y: P0.y + G * k * k };
  return (
    <g transform={`scale(1.2) translate(${-P0.x - 30} ${-P0.y + 70 - (p.y - P0.y) * 0.5})`}>
      <Sala xF={VIA.xF} suelo={VIA.suelo} cintas={VIA.chapas} />
      <Soga pts={cae < 0 ? sogaChapar(VIA, aparato(VIA, XA), 5, P0, a) : porChapas(VIA, aparato(VIA, XA), 5, p, { floja: 60, sx: -50 })} />
      <Persona p={p} ang={cae < 0 ? a.ang : mix(a.ang, POSE.cae, Math.min(1, k / 4))} aspecto={EL} cara={cae < 0 ? "esfuerzo" : "miedo"} />
    </g>
  );
};
export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fA = (pal("aparato") ?? 42) + 16, fP = pal("pulgar") ?? fA + 34, fS = pal("cae") ?? d - 12, g = f - fA, k = f - fS;
  if (f < fA) return <><Ko j={f - CAE} rotulo />{f >= fA - N_REB && <Rebobina k={f - (fA - N_REB)} />}</>;
  return (
    <>
      <PP sh={golpe(f, fS, 18) + golpe(f, fA, 10)} tinte={k > 0 ? "#5A3B3B" : "#3B4757"}>
        <Puesto modo="mal" corre={g * 9 + (k > 0 ? k * k * 5 : 0)} leva={k > 0 ? ROJO : undefined} f={f} etiqueta={(f - fP) / 5} />
        {f >= fP && <Foco x={LEVA.x} y={LEVA.y} r={70} color={k > 0 ? ROJO : "#FFE3A0"} k={(f - fP) / 5} />}
      </PP>
      <Lupa x={822} y={470} r={196} fondo="#2E3948" k={g / 5}><Mini t={0.3 + 0.36 * Math.min(1, g / Math.max(1, fS - fA))} cae={k > 0 ? k * 0.6 : -1} /></Lupa>
      <Chip texto="5 SEGUNDOS ANTES" top={150} tam={48} k={Math.min(1, g / 4) * (g < 34 ? 1 : Math.max(0, 1 - (g - 34) / 6))} />
      <Etiqueta texto="¿FRENA?" top={170} tam={128} desde={fS - 16} />
    </>
  );
};
export const Corre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fB = pal("cuerda") ?? Math.round(d * 0.4);
  if (f < fB) return (
    <>
      <PP sh={Math.sin(f * 2.3) * 7} tinte="#5A3B3B">
        <Puesto modo="mal" corre={f * 70} leva={ROJO} f={f} />
        <Foco x={LEVA.x} y={LEVA.y} r={70} color={ROJO} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${250 + i * 44} ${330 + ((f * 50 + i * 90) % 300)} v80`} stroke="#B9786A" strokeWidth={8} strokeLinecap="round" opacity={0.5} />)}
      </PP>
      <Chip texto="LEVA APRETADA: NO PUEDE CERRAR" top={170} tam={48} color={ROJO} k={Math.min(1, f / 5)} />
      <Chip texto="LA CUERDA CORRE SIN FRENO" top={262} tam={48} color={ROJO} k={(f - 26) / 5} />
    </>
  );
  // general: baja con la cuerda hasta la colchoneta (en este caso, nadie llegó a frenar)
  const k = f - fB, kF = Math.sqrt((YS - 60 - P0.y) / (0.55 * G)), j = k - kF;
  if (j >= 0) return <Ko j={j} />;
  const y = P0.y + 0.55 * G * k * k, p = { x: VIA.hipX(y) + (XS - VIA.hipX(VIA.pie)) * (k / kF), y };
  return (
    <Mundo cx={470} cy={interpolate(k, [0, kF], [P0.y + 200, VIA.suelo - 420])} z={interpolate(k, [0, kF], [0.9, 1.25])}>
      <Asegurador via={VIA} x={XA - 60} cuerda={false} aspecto={ELLA} quien="joe" alza={1} cara="miedo" comba={0.3} />
      <Soga pts={porChapas(VIA, aparato(VIA, XA - 60), 5, p, { floja: 30 })} brillo={0.5} />
      <Persona p={p} ang={POSE.cae} aspecto={EL} cara="miedo" rot={-8 - 30 * suave(k / kF)} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${p.x - 60 + i * 50} ${p.y - 230 - i * 20} v-110`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />)}
    </Mundo>
  );
};
/** Recuadro de contexto (arriba a la derecha): quien asegura de cuerpo entero, con un anillo sobre el aparato. `feed` 0–1 = da cuerda. */
export const Contexto: React.FC<{ feed?: number; k?: number }> = ({ feed = 0, k = 1 }) => {
  const via = VIA, x = 0, ap = aparato(via, x);
  return (
    <Lupa x={832} y={470} r={186} fondo="#2E3948" k={k}>
      <g transform={`scale(1.5) translate(${-x - 40} ${-via.pie + 40})`}>
        <path d={`M-400 ${via.suelo} H600 V${via.suelo + 400} H-400 Z`} fill="#27456B" />
        <Asegurador via={via} x={x} hacia={{ x: x + 190, y: via.pie - 330 }} aspecto={ELLA} quien="joe" alza={1} feed={feed} comba={0.1 + 0.2 * feed} />
        <circle cx={ap.x} cy={ap.y + 2} r={34} fill="none" stroke="#FFE3A0" strokeWidth={7} strokeDasharray="14 9" />
      </g>
    </Lupa>
  );
};
export const Dos: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fL = pal("leva") ?? 60, fM = pal("mano") ?? 100, gira = suave((f - fL) / 8), mano = f >= fM - 4;
  return (
    <>
      <PP>
        <Puesto modo={mano ? "normal" : "solo"} bloquea={gira} leva={gira > 0.5 ? VERDE : undefined} brilloFreno={mano ? 0.6 + 0.4 * Math.sin(f / 4) : 0} f={f} etiqueta={mano ? 0 : (f - fL + 10) / 5} />
        {f >= fL - 4 && !mano && <Foco x={LEVA.x} y={LEVA.y} r={70} color="#8FE0AE" k={(f - fL + 4) / 5} />}
      </PP>
      <Contexto k={f / 5} />
      <Chip texto="1 · LEVA LIBRE" top={150} tam={58} color={VERDE} k={(f - fL) / 5} />
      <Chip texto="2 · MANO EN LA CUERDA DE FRENO" top={1330} tam={46} color={VERDE} k={(f - fM) / 5} />
    </>
  );
};
