// E77 · gancho (6b en el rocódromo → 5+ en roca, sudando) y «no has empeorado: tres razones, la última casi nadie la sabe».
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, Asegurador, Partida, POSE, accEscalar, porChapas, aparato } from "../../piezas/kit";
import { Gym, RocaP, VIA, LOLA, LEO, XA, cl, COL, Sudor, Razones, GradoG, Grande, Etiq, type P } from "./comun";

const Y0 = VIA.mos(3).y + 160, Y1 = VIA.mos(3).y - 80;
/** Lola trepando en el rocódromo (t 0–1, bucle). */
const RUTA = Array.from({ length: 34 }).map((_, i) => { const y = VIA.suelo - 150 - i * 84 - (i % 3) * 10; return { x: VIA.xF(y) + 36 + (i % 2) * 14, y }; });
export const EnGym: React.FC<{ t: number; z?: number; luz?: number }> = ({ t, z = 1.5, luz = 0 }) => {
  const a = accEscalar(VIA, Y0, Y1, t % 1, 4), cerca = RUTA.filter((h) => h.y > a.p.y - 520 && h.y < a.p.y + 120);
  return (
    <Gym cx={a.p.x + 40} cy={a.p.y - 220} z={z}>
      {luz > 0 && <g opacity={luz}><path d={`M${cerca.map((h) => `${h.x} ${h.y}`).join(" L")}`} stroke={COL.amarillo} strokeWidth={12} strokeDasharray="6 18" strokeLinecap="round" fill="none" />{cerca.map((h, i) => <ellipse key={i} cx={h.x} cy={h.y} rx={38} ry={26} fill="none" stroke={COL.amarillo} strokeWidth={10} />)}</g>}
      <Asegurador via={VIA} x={XA} aspecto={LEO} />
      <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 3, a.p)} />
      <Persona p={a.p} ang={a.ang} aspecto={LOLA} cara="esfuerzo" />
    </Gym>
  );
};
/** Lola parada en roca (dudando, sudando). */
export const EnRoca: React.FC<{ z?: number; cara?: "miedo" | "esfuerzo" | "alivio" | "normal"; tiembla?: number }> = ({ z = 1.5, cara = "miedo", tiembla = 3 }) => {
  const f = useCurrentFrame(), p = VIA.cadera(Y0 - 40);
  return (
    <RocaP cx={p.x + 40} cy={Y0 - 260} z={z}>
      <Soga pts={porChapas(VIA, aparato(VIA, XA, 0), 3, p)} />
      <Persona p={p} ang={POSE.agarreMira} aspecto={LOLA} cara={cara} tiembla={Math.sin(f * 2.2) * tiembla} />
    </RocaP>
  );
};
export const Gancho: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fR = pal("roca") ?? 50, fC = pal("cinco") ?? 62;
  const corte = interpolate(f, [fR - 4, fR + 8], [0, 1], cl);
  return (
    <>
      <Partida izq={<EnGym t={f / 70} />} der={<EnRoca />} corte={corte} sellos={false} />
      <GradoG t="6b" x={corte > 0 ? 540 - 270 * corte : 540} y={1580} k={f + 12} color={COL.verde} />
      <GradoG t="5+" x={810} y={1580} k={f - fC + 2} color={COL.rojo} rot={Math.sin(f / 2) * 4} />
      <Sudor x={820} y={600} k={f - fC} />
      {corte > 0.3 && <><Etiq t="ROCÓDROMO" x={270} y={500} k={(corte - 0.3) * 30} /><Etiq t="ROCA" x={810} y={500} k={(corte - 0.3) * 30} /></>}
    </>
  );
};
export const Razones3: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fE = pal("empeorado") ?? 10, fT = pal("tres") ?? 50, fN = pal("nadie") ?? 80;
  return (
    <>
      <EnRoca z={interpolate(f, [0, 110], [1.5, 1.25], cl)} cara={f > fE ? "alivio" : "miedo"} tiembla={f > fE ? 0 : 3} />
      <AbsoluteFill style={{ background: "rgba(255,248,238,.35)" }} />
      {f < fT && <Grande t={"NO HAS\nEMPEORADO"} top={1180} k={f - fE + 4} tam={110} fondo={COL.verde} color="#fff" />}
      {f >= fT - 2 && <Grande t="3 RAZONES" top={1180} k={f - fT + 2} tam={110} />}
      <Razones actual={0} k={f - fT} top={1420} />
      {f >= fN && <Grande t="LA 3.ª, CASI NADIE" top={1590} k={f - fN} tam={58} fondo={COL.rosa} color="#fff" />}
    </>
  );
};
