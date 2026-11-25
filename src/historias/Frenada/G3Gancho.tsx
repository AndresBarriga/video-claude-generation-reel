// E81 · escenas 1-2. Gancho: Irene en la chapa tira de la cuerda, el grigri de Dani se bloquea (lupa) y «¡CUERDA!» desde el fotograma 0.
// Arregla: la cámara baja a Dani; en la lupa su mano agarra el aparato entero (la de freno sigue abajo, en la cuerda).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Asegurador, Soga, accChapar, sogaChapar, aparato, Lupa, Sello, suave } from "../../piezas/kit";
import { Gym, PuestoG, VS, XA, I, P0, IRENE, DANI, ROJO, TAB, Grande, COL, golpe, cl, type P } from "./G3comun";

/** Fotograma en que se bloquea el grigri en el gancho. */
export const FB = 15;
/** Tirón de Irene: sube la cuerda hasta FB y ahí se queda clavada (rebote corto). */
export const tiron = (f: number) => (f < FB ? 0.1 + 0.26 * suave(f / FB) : 0.36 - 0.05 * Math.exp(-(f - FB) / 5) * Math.cos((f - FB) * 1.4));
/** Plano del gancho (también se usa para cerrar el bucle). */
export const PlanoChapa: React.FC<{ f: number; lupa?: number }> = ({ f, lupa = 1 }) => {
  const a = accChapar(VS, P0, I, tiron(f), { temblor: 0.4 }), bloq = f >= FB;
  const corre = bloq ? FB * 40 : f * 40, rojo = bloq ? Math.min(1, (f - FB) / 3) : 0;
  return (
    <>
      <Gym cx={P0.x - 20} cy={P0.y + 190} z={1.3} sh={golpe(f, FB, 9)}>
        <Asegurador via={VS} x={XA} aspecto={DANI} alza={1} feed={bloq ? 0 : 0.6} comba={0.05} cara={bloq ? "miedo" : "serio"} />
        <Soga pts={sogaChapar(VS, aparato(VS, XA), I, P0, a)} />
        <Persona p={P0} ang={a.ang} aspecto={IRENE} cara="esfuerzo" tiembla={bloq ? Math.sin(f * 2) * 2 : 0} />
      </Gym>
      <Lupa x={540} y={1330} r={200} fondo="#F4F8FC" k={lupa}>
        <g transform={`translate(${golpe(f, FB, 10)} 0) scale(0.36) translate(-600 -1000)`}>
          <PuestoG modo="normal" corre={corre} da={bloq ? 0 : 0.5 + 0.5 * Math.sin(f / 2)} leva={rojo > 0.5 ? ROJO : undefined} />
          {rojo > 0 && <circle cx={TAB.x + 60} cy={TAB.y - 80} r={330} fill="none" stroke={ROJO} strokeWidth={22} strokeDasharray="40 22" opacity={rojo} />}
        </g>
      </Lupa>
    </>
  );
};
export const GGancho: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <>
      <PlanoChapa f={f} />
      <Grande t="¡CUERDA!" top={930} k={12} tam={140} />
      <Sello x={700} y={1190} k={(f - FB - 1) / 6} s={0.8} />
    </>
  );
};
export const GArregla: React.FC<P> = ({ pal }) => {
  // la cámara cae de Irene a Dani (motivada: miramos su mano); en la lupa la mano agarra el grigri entero y da deprisa
  const f = useCurrentFrame(), fA = pal("arreglarlo") ?? 14, fF = pal("freno.") ?? 70, t = suave(f / 12);
  const agarra = suave((f - fA - 2) / 6), corre = f > fA + 8 ? (f - fA - 8) * 55 : 0;
  const cy = interpolate(t, [0, 1], [P0.y + 190, VS.pie - 230]), cx = interpolate(t, [0, 1], [P0.x - 20, XA + 240]);
  return (
    <>
      <Gym cx={cx} cy={cy} z={1.3 + 0.35 * t}>
        <Asegurador via={VS} x={XA} aspecto={DANI} alza={1} feed={f > fA ? 0.5 + 0.5 * Math.sin(f / 1.6) : 0} comba={0.05 + 0.25 * Math.min(1, Math.max(0, f - fA) / 30)} cara={f > fA ? "esfuerzo" : "miedo"} />
        <Soga pts={sogaChapar(VS, aparato(VS, XA), I, P0, accChapar(VS, P0, I, 0.36 + 0.2 * suave((f - fA) / 30)))} />
        <Persona p={P0} ang={accChapar(VS, P0, I, 0.36 + 0.2 * suave((f - fA) / 30)).ang} aspecto={IRENE} cara="esfuerzo" />
      </Gym>
      <Lupa x={700} y={1130} r={250} fondo="#F4F8FC" k={(f - 4) / 6}>
        <g transform="scale(0.42) translate(-610 -1000)">
          <PuestoG modo={agarra > 0.5 ? "mal" : "normal"} corre={corre} otra={agarra <= 0.5} />
        </g>
        {agarra > 0 && agarra < 1 && <circle cx={0} cy={0} r={240 * (1 - agarra) + 20} fill="none" stroke={COL.amarillo} strokeWidth={10} />}
      </Lupa>
      <Grande t="¿Y EL FRENO?" top={1430} k={f - fF + 3} tam={72} fondo={COL.amarillo} />
      {void cl}
    </>
  );
};
