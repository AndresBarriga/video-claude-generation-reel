// E82 · plano corto de Joe en la vía del rocódromo claro + LUPA sobre la mano. Gancho (aprieta, tiembla), pregunta (lupa grande con «?»)
// y cierre (la misma mano, ya relajada, brazo largo; bucle al fotograma 0).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Persona, Soga, porChapas, aparato, Agarre, Lupa, Barra, Chip, Guardar, bucle, suave, mano as manoRel } from "../../piezas/kit";
import { Gym, VIA, XA, JOE, colgar, Aprieta, COL, F, pop, cl, type P , EtqAntebrazo } from "./comun";

const HY = VIA.aM(6.1), XH = VIA.xF(HY) + 2;
export const HA = { x: XH, y: HY }, HB = { x: VIA.xF(HY + 34) + 2, y: HY + 34 };
/** Cadera: r 0 = tirando (brazos doblados, cerca de las presas) · 1 = colgado del hueso (brazos estirados). */
export const cadera = (r: number) => ({ x: VIA.xF(HY + 120) - 70 - 6 * r, y: HY + 118 + 72 * r });
export const CAM = (r: number) => ({ cx: cadera(r).x + 90, cy: cadera(r).y - 100, z: 1.85 });

/** Joe colgado de las dos presas. r = relajación 0–1; ap = cuánto aprieta (brillo rojo); tiembla en px. */
export const JoeMuro: React.FC<{ r: number; ap: number; f: number; tiembla?: number }> = ({ r, ap, f, tiembla = 0 }) => {
  const p = cadera(r), ang = colgar(p, HA, HB), m = manoRel(ang);
  return (
    <>
      <Soga pts={porChapas(VIA, aparato(VIA, XA), 3, { x: p.x + 10, y: p.y + 10 }, { comba: 30 })} />
      <rect x={XH - 8} y={HY - 6} width={30} height={22} rx={8} fill={COL.rosa} stroke={COL.tinta} strokeWidth={4} />
      <Aprieta x={p.x + m.x} y={p.y + m.y} v={ap} f={f} />
      <Persona p={p} ang={ang} aspecto={JOE} cara={ap > 0.5 ? "esfuerzo" : "normal"} tiembla={tiembla} />
    </>
  );
};
/** Lo que se ve dentro de la lupa: mano de Joe en la regleta (cierra 1 = agarrotada, con nudillos blancos). */
export const ManoRegleta: React.FC<{ cierra: number; ap: number; f: number; s?: number }> = ({ cierra, ap, f, s = 1.25 }) => (
  <g>
    <rect x={-400} y={-400} width={800} height={800} fill="#FFFDF8" />
    <path d="M200 -400 L200 400" stroke={COL.tinta} strokeWidth={6} opacity={0.4} /><rect x={200} y={-400} width={300} height={800} fill="#F1EADF" />
    {ap > 0 && <circle cx={-40} cy={60} r={170 + 8 * Math.sin(f)} fill={COL.rojo} opacity={0.18 * ap} />}
    <Agarre x={-10} y={0} s={s} rot={-12} cierra={cierra} manga={JOE.chaqueta} piel="#E2AD85" pielS="#BF8862" tiembla={ap * Math.sin(f * 2.3) * 4}>
      <path d="M220 -22 L-30 -18 Q-52 -4 -30 16 L220 22 Z" fill={COL.rosa} stroke={COL.tinta} strokeWidth={8} strokeLinejoin="round" />
    </Agarre>
    {ap > 0.3 && [0, 1].map((i) => <path key={i} d={`M${-130 + i * 250} ${-90 + ((f * 2 + i * 20) % 40)} q8 14 0 20 q-8 -6 0 -20`} fill="#9FD3FF" stroke={COL.tinta} strokeWidth={3} />)}
  </g>
);

export const Gancho: React.FC<P> = () => {
  const f = useCurrentFrame(), c = CAM(0), push = interpolate(f, [0, 90], [0, 0.12], cl);
  const ap = 1, tiem = Math.sin(f * 2.2) * 3;
  return (
    <>
      <Gym cx={c.cx} cy={c.cy} z={c.z + push}><JoeMuro r={0} ap={ap} f={f} tiembla={tiem} /></Gym>
      <Lupa x={790} y={1320} r={230} k={1} fondo="#FFFDF8"><ManoRegleta cierra={1} ap={ap} f={f} /></Lupa>
      <EtqAntebrazo /><Barra valor={0.9} desde={0.75} x={140} y={790} alto={420} k={1} color={COL.rojo} />
    </>
  );
};

export const Pregunta: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(), c = CAM(0), e = suave(f / 10);
  return (
    <>
      <Gym cx={c.cx} cy={c.cy} z={c.z + 0.12}><JoeMuro r={0} ap={1} f={f} tiembla={Math.sin(f * 2.2) * 3} /></Gym>
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,253,248,${0.55 * e})` }} />
      <Lupa x={540 + (790 - 540) * (1 - e)} y={1320 - 200 * e} r={230 + 140 * e} k={1} fondo="#FFFDF8"><ManoRegleta cierra={1} ap={1} f={f} s={1.25 + 0.25 * e} /></Lupa>
      {[[200, 960, -14], [880, 1000, 12], [860, 1430, -8]].map(([x, y, r], i) => {
        const k = pop(f - 6 - i * 3);
        return k > 0 && <div key={i} style={{ position: "absolute", left: x - 60, top: y - 80 + Math.sin((f + i * 9) / 5) * 8, fontFamily: F, fontWeight: 900, fontSize: 160, color: COL.amarillo, WebkitTextStroke: `10px ${COL.tinta}`, paintOrder: "stroke fill", transform: `rotate(${r}deg) scale(${k})` }}>?</div>;
      })}
    </>
  );
};

export const Cta: React.FC<P> = ({ pal, d }) => {
  const f = useCurrentFrame(), v = bucle(f, d, 12), r = 1 - v, ap = v, fM = pal("mándaselo") ?? Math.round(d * 0.45);
  const c = CAM(r);
  const nada = f < 14 ? interpolate(f, [0, 14], [0.75, 0.25], cl) : 0.25 + 0.65 * v;
  return (
    <>
      <Gym cx={c.cx} cy={c.cy} z={c.z}><JoeMuro r={r} ap={ap} f={f} tiembla={v * Math.sin(f * 2.2) * 3} /></Gym>
      <Lupa x={790} y={1320} r={230} k={1} fondo="#FFFDF8"><ManoRegleta cierra={1 - 0.45 * r} ap={ap} f={f} /></Lupa>
      <EtqAntebrazo /><Barra valor={nada} x={140} y={790} alto={420} k={1} color={v > 0.5 ? COL.rojo : COL.verde} />
      {v < 0.2 && f < fM && <Guardar k={(f - 4) / 10} y={1120} />}
      {v < 0.2 && <Chip texto="Mándaselo a ese que dice «me fallan los antebrazos»" tam={38} top={1500} k={(f - fM + 4) / 8} />}
    </>
  );
};
