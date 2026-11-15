// s4: se pone la cuerda en la boca para sacar otro brazo de cuerda → «¿Y TUS DIENTES?» → se le va el pie, cae, la cuerda se tensa
// entre los dientes y un diente sale volando (dibujo, sin sangre); ella sale de plano y la cámara se queda con el diente.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Etiqueta, clamp, golpe, type P, ALTO, B1, AG, G, CAE, nudo, mano, boca, cabeza, conMano, mix, resbala, suave, type Angulos } from "./comun";
import { Plano, Soga, Aseg, Ella, Mordida, Diente, type Pt } from "./piezas";

const bq = boca(AG);
export const P_BOCA = conMano(AG, bq.x + 12, bq.y + 8, false), P_PECHO = conMano(AG, 44, -64, false), P_BAJO = conMano(AG, 56, -30, false);

export const Boca: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const fBoca = pal("boca") ?? 33, fSacar = pal("sacar") ?? 47, fYa = pal("ya") ?? 69, fCaer = pal("caer") ?? 123, fT = (pal("tensa") ?? 143) + 5, fM = fBoca - 4;
  // brazo: pecho → boca (muerde) → baja a por más cuerda → la sube → vuelve a la presa
  const t1 = interpolate(f, [2, fM], [0, 1], io), t2 = interpolate(f, [fBoca + 2, fSacar + 4], [0, 1], io), t3 = interpolate(f, [fSacar + 6, fSacar + 20], [0, 1], io), t4 = interpolate(f, [fYa - 4, fYa + 10], [0, 1], io);
  let ang: Angulos = f < fBoca + 2 ? mix(P_PECHO, P_BOCA, t1) : f < fSacar + 6 ? mix(P_BOCA, P_BAJO, t2) : f < fYa - 4 ? mix(P_BAJO, P_BOCA, t3) : mix(P_BOCA, AG, t4);
  const bt = interpolate(f, [fYa + 22, fCaer], [0, 1], clamp), k = Math.max(0, f - fCaer) * 0.62, tiron = interpolate(f, [fT - 1, fT + 2, fT + 9], [0, 1, 0.5], clamp);
  ang = resbala(ang, bt);
  if (k > 0) ang = mix(ang, { ...CAE, brazoA: [150, 140], brazoB: [160, 150], cabeza: -24 }, Math.min(1, k / 6));
  ang = { ...ang, cabeza: ang.cabeza + 34 * tiron };
  const p = { x: ALTO.x - 6 * bt, y: ALTO.y + 22 * bt * bt + G * k * k }, muerde = f >= fM && f < fT, n = nudo(p);
  const h = mano(ang), H = { x: p.x + h.x, y: p.y + h.y }, b = boca(ang), M = { x: p.x + b.x + 5, y: p.y + b.y + 3 };
  const tenso = interpolate(f, [fCaer, fT - 1], [0, 1], clamp), lazo = (70 + 90 * t3) * (1 - tenso);
  const pts: Pt[] = f < fM ? [B1, H, { ...n, sag: 50, sx: -24 }] : muerde ? [B1, { ...M, sx: 14 * (1 - tenso) }, { ...n, sag: lazo, sx: 30 + lazo * 0.5 }] : [B1, { ...n, sag: 120, sx: -90 }];
  const c = cabeza(ang), zf = interpolate(f, [0, fBoca, fYa, fYa + 14], [2.3, 2.7, 2.9, 3.5], io) - 1.2 * suave((f - fCaer) / (fT - fCaer));
  const yCam = Math.min(p.y, ALTO.y + 22 + G * ((fT - fCaer) * 0.62) ** 2);
  const cx = p.x + c.x + 16, cy = yCam + c.y + 26 + 40 * suave((f - fCaer) / 20);
  const M0y = ALTO.y + 22 + G * ((fT - fCaer) * 0.62) ** 2 + b.y;
  return (
    <>
      <Plano cx={cx} cy={cy} z={zf} sh={golpe(f, fT, 12)}>
        <Aseg x={470} comba={0.3} />
        <Ella p={p} ang={ang} cara={f >= fT ? "dolor" : muerde ? "esfuerzo" : "miedo"} tiembla={k > 0 ? 0 : Math.sin(f * 1.9) * 1.5} />
        <Soga pts={pts} />
        {(muerde || f >= fT) && <Mordida p={p} ang={ang} hueco={f >= fT} />}
        <Diente x={ALTO.x - 6 + b.x + 8} y={M0y} k={f - fT} />
      </Plano>
      {f >= fYa + 2 && <Etiqueta texto="¿Y TUS DIENTES?" desde={fYa + 2} top={300} tam={100} />}
    </>
  );
};
