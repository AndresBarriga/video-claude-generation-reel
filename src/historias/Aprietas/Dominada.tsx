// E82 · «Aprietas cada presa, doblas los brazos y tiras»: Joe sube a base de dominadas (cadera que se acerca a las manos,
// codos doblados, brillo rojo en la mano). La barra del ANTEBRAZO se llena en rojo. Sello «ESTO ES UNA DOMINADA».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, aparato, Barra, suave, mano } from "../../piezas/kit";
import { Gym, VIA, XA, JOE, colgar, Aprieta, COL, F, pop, cl, type P , EtqAntebrazo } from "./comun";

const PASO = 95, Y0 = VIA.aM(4.6);
const presa = (y: number) => ({ x: VIA.xF(y) + 2, y });
/** Estado de la subida en el movimiento continuo u (1 = un movimiento completo). */
export const subida = (u: number) => {
  const n = Math.floor(u), t = u - n, L = Y0 - n * PASO, U = L - PASO;
  const sube = 1.1 * suave(t / 0.55) - 0.1 * suave((t - 0.85) / 0.15), mueve = suave((t - 0.55) / 0.3);
  const p = { x: VIA.xF(U + 150) - 70, y: U + 190 - 95 * sube };
  const fija = presa(U), lib = { x: presa(L).x + (presa(U - PASO).x - presa(L).x) * mueve - 30 * Math.sin(mueve * Math.PI), y: L + (U - PASO - L) * mueve };
  const ang = n % 2 ? colgar(p, lib, fija) : colgar(p, fija, lib);
  return { p, ang, n, sube, mueve, fija, lib };
};

export const Dominada: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fD = pal("dominada") ?? d - 30, fE = pal("eso") ?? d - 50;
  const u = interpolate(f, [0, fE], [0.2, 2.15], cl) + interpolate(f, [fE, d], [0, 0.4], cl), s = subida(u);
  const ap = 0.5 + 0.5 * s.sube, m = mano(s.ang, s.n % 2 ? "B" : "A");
  const cy = Y0 + 45 - 95 * u - 100;
  return (
    <>
      <Gym cx={s.p.x + 110} cy={cy} z={1.7}>
        <Soga pts={porChapas(VIA, aparato(VIA, XA), 2, { x: s.p.x + 10, y: s.p.y + 10 }, { comba: 30 })} />
        {[s.fija, { x: VIA.xF(Y0 - 3 * PASO) + 2, y: Y0 - 3 * PASO }, { x: VIA.xF(Y0) + 2, y: Y0 }].map((h, i) => <rect key={i} x={h.x - 8} y={h.y - 6} width={30} height={22} rx={8} fill={COL.rosa} stroke={COL.tinta} strokeWidth={4} />)}
        <Aprieta x={s.p.x + m.x} y={s.p.y + m.y} v={ap} f={f} />
        <Persona p={s.p} ang={s.ang} aspecto={JOE} cara="esfuerzo" tiembla={s.sube * Math.sin(f * 2) * 2} />
      </Gym>
      <EtqAntebrazo /><Barra valor={interpolate(f, [0, d], [0.3, 0.92], cl)} x={140} y={790} alto={420} k={1} color={COL.rojo} />
      {f >= fD - 3 && <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", transform: `rotate(-6deg) scale(${pop(f - fD + 4) * (1 + 0.6 * Math.max(0, 1 - (f - fD + 4) / 6))})` }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 78, color: COL.rojo, border: `10px solid ${COL.rojo}`, borderRadius: 24, padding: "4px 30px 10px", background: "rgba(255,253,248,.9)" }}>ESTO ES UNA DOMINADA</div>
      </div>}
    </>
  );
};
