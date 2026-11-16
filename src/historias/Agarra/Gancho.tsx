// s0: cámara lenta, YA cayendo; la mano abierta va sola hacia la cinta. Pregunta en pantalla desde el fotograma 0.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, pAgarra, mano, mix, suave, Foco, Pregunta, G } from "../../piezas/kit";
import { VIA, I, AP, CINTA, K0, BASE, TU, libre, Mundo, clamp, type P } from "./comun";

/** Estado de la toma a cámara lenta. f = fotograma local; `va` 0–1 = cuánto se ha acercado la mano; `retira` 0–1 = la mano se aparta. */
export const Lenta: React.FC<{ f: number; va: number; retira?: number; foco?: boolean }> = ({ f, va, retira = 0, foco = true }) => {
  const k = K0 + f * 0.022, l = libre(k), p = { x: l.p.x - 22, y: l.p.y };
  const h0 = mano({ ...BASE, brazoA: [150, 120] }), ini = { x: p.x + h0.x - 10, y: p.y + h0.y }, fin = { x: CINTA.x - 30, y: CINTA.y + (p.y - libre(K0).p.y) * 0.4 };
  const H = { x: ini.x + (fin.x - ini.x) * va, y: ini.y + (fin.y - ini.y) * va };
  const ang = mix(pAgarra(p, H, BASE), { ...BASE, brazoA: [62, 104] }, retira);
  return (
    <Mundo cx={p.x + 46 + 10 * va} cy={p.y - 78} z={2.05 + 0.25 * suave(f / 90)}>
      <Soga pts={porChapas(VIA, AP, I + 1, p, { floja: 46, sx: -44 })} />
      <Persona p={p} ang={ang} aspecto={TU} cara={retira > 0.5 ? "esfuerzo" : "miedo"} rot={-9} tiembla={Math.sin(f * 1.7) * 1.5} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${p.x - 70 + i * 34} ${p.y - 250 - ((f * 5 + i * 37) % 60)} v-70`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.55} />)}
      {foco && <Foco x={CINTA.x} y={CINTA.y} r={46} k={1 - retira} />}
      {void G}
    </Mundo>
  );
};
export const Gancho: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fM = pal("mano") ?? 30, fC = pal("cinta") ?? d - 14;
  const va = interpolate(f, [0, fM, fC + 4], [0.35, 0.6, 1], clamp);
  return <><Lenta f={f} va={va} /><Pregunta texto="¿LA AGARRAS?" top={300} tam={104} /></>;
};
