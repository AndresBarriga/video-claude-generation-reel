// 11 · «No te va a hacer inmortal»: Nora en la reunión con capa de superhéroe; la capa se suelta y cae (guiño).
// 12 · «Pero estás entrenando algo que dice mucho de tu salud»: ya abajo, se sacude el magnesio; la mano y luego el cuerpo se encienden (eco del «chivato»).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Plano, Persona, Reunion, Soga, crearVia, PERFILES, POSE, conMano, hombro, type Angulos } from "../../piezas/kit";
import { mano } from "../../piezas/kit/rig";
import { COL, NORA, T, cl, sale, type P } from "./comun";

const VIA = crearVia({ perfil: PERFILES.vertical, metros: [3, 4.6, 6.2, 7.8] });
const TOP = VIA.chapas[3] - 60;

export const Capa: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const tS = Math.round(d * 0.45), cae = Math.max(0, f - tS);
  const p = VIA.cadera(TOP + 170);
  const R = { x: VIA.xF(TOP) - 4, y: TOP };
  const ang: Angulos = { ...conMano({ ...POSE.agarre, cabeza: f < tS ? -10 : 8 }, R.x - p.x - 4, R.y - p.y + 10), brazoB: [-30, -10] };
  const h = hombro(ang.torso), sx = p.x + h[0] - 6, sy = p.y + h[1] + 6, ond = Math.sin(f / 3) * 14;
  // capa: atada a los hombros; al soltarse cae girando
  const caps = `translate(${-cae * 3} ${cae * cae * 0.9}) rotate(${-cae * 4} ${sx} ${sy})`;
  return (
    <Plano via={VIA} cx={560} cy={TOP + 230} z={1.9} decorado="roca">
      <Reunion x={R.x} y={R.y} />
      <Soga pts={[{ x: R.x, y: R.y + 8 }, { x: p.x + 18, y: p.y - 6, sag: 10 }, { x: p.x - 40, y: p.y + 700, sag: 30 }]} />
      <g transform={caps} opacity={interpolate(cae, [14, 24], [1, 0], cl)}>
        <path d={`M${sx} ${sy} Q${sx - 90} ${sy + 20 + ond} ${sx - 170} ${sy + 150 + ond} L${sx - 60} ${sy + 210} Q${sx - 30} ${sy + 100} ${sx + 6} ${sy + 12} Z`} fill={COL.rojo} stroke={T} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M${sx - 8} ${sy - 4} l22 10`} stroke={COL.amarillo} strokeWidth={10} strokeLinecap="round" />
      </g>
      <Persona p={p} ang={ang} aspecto={NORA} cara={f < tS ? "normal" : "serio"} />
    </Plano>
  );
};

export const Salud: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tS = (pal("salud.") ?? pal("salud") ?? Math.round(d * 0.8)) - 3;
  const p = { x: VIA.xF(VIA.pie) - 190, y: VIA.pie };
  const sacude = f < tS ? Math.sin(f * 1.6) * 26 : 0;
  const ang: Angulos = { ...POSE.pie, cabeza: 10, brazoA: [24 + sacude, 40 + sacude * 1.3], brazoB: [-12, -4] };
  const m = mano(ang, "A"), hx = p.x + m.x, hy = p.y + m.y;
  const luz = sale((f - tS) / 10);
  return (
    <Plano via={VIA} cx={p.x + 120} cy={p.y - 60} z={2.3} decorado="roca">
      {f < tS && [0, 1, 2, 3, 4].map((i) => { const t = ((f + i * 5) % 25) / 25; return <circle key={i} cx={hx + (i - 2) * 14 + t * 30} cy={hy + t * 70} r={10 + t * 18} fill="#fff" opacity={0.75 * (1 - t)} />; })}
      <circle cx={hx} cy={hy} r={40 + 60 * luz} fill="#FFB347" opacity={0.45 * luz} />
      <Persona p={p} ang={ang} aspecto={NORA} cara="alivio" sombra={VIA.suelo} />
      {luz > 0 && <g opacity={luz}><rect x={hx + 40} y={hy - 200} width={210} height={64} rx={20} fill="#FFC93C" stroke={T} strokeWidth={6} /><text x={hx + 145} y={hy - 155} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={38} fill={T}>AGARRE</text></g>}
    </Plano>
  );
};
