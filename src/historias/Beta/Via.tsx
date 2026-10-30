// El plano de la vía, configurable: tú en la pared (estado), el grupo al pie, tu pareja asegurando y los globos.
// Manos, pies, presas y regletes se colocan con el esqueleto (IK), igual que en E14.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador, type Cara, type Angulos } from "../../piezas/Escalador";
import { Cielo, Chapa, Cuerda, ParedNaranja, PB, REPARTO, Svg, Zoom } from "./comun";

export const S = 1.5, HX = 590, HY = 620, X0 = HX + 86 * S, SUELO = 1400, SG = 1.3;
export const GRUPO = { veterano: 150, nuevo: 330, animador: 490, pareja: 650 } as const;
export type Quien = keyof typeof GRUPO;
export const cabezaDe = (q: Quien) => ({ x: GRUPO[q] + 10, y: SUELO - 140.6 * SG - 150 * SG });
const rad = (g: number) => (g * Math.PI) / 180;
const TORSO = 14, HOMBRO: [number, number] = [Math.sin(rad(180 - TORSO)) * 88, Math.cos(rad(180 - TORSO)) * 88];
const alcanza = (t: [number, number], codo = 1): [number, number] => {
  const dx = t[0] - HOMBRO[0], dy = t[1] - HOMBRO[1], d = Math.min(101, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy), a = Math.acos((52 * 52 + d * d - 50 * 50) / (2 * 52 * d)), a1 = base + codo * a;
  const ex = HOMBRO[0] + Math.sin(a1) * 52, ey = HOMBRO[1] + Math.cos(a1) * 52;
  return [(a1 * 180) / Math.PI, (Math.atan2(t[0] - ex, t[1] - ey) * 180) / Math.PI];
};
const W = (p: [number, number], dy = 0): [number, number] => [HX + p[0] * S, HY + dy + p[1] * S];
const PIE_A: [number, number] = [84, 41], PIE_B: [number, number] = [84, 102], MANO_A: [number, number] = [86, -108], MANO_B: [number, number] = [84, -168];

export type Estado = "paso" | "cae" | "colgado" | "sube" | "arriba";
export type PoseGrupo = Partial<Record<Quien, { cara?: Cara; angulos?: Partial<Angulos>; pose?: "pie" | "senalando" | "celebrando" }>>;

export const Via: React.FC<{ estado: Estado; cara?: Cara; t?: number; grupo?: PoseGrupo; zoom?: { s: number; cx: number; cy: number; tx?: number; ty?: number } }> = ({ estado, cara = "esfuerzo", t = 0, grupo = {}, zoom }) => {
  const f = useCurrentFrame();
  const dy = estado === "arriba" ? -380 : estado === "sube" ? -interpolate(f, [0, 60], [0, 200], { extrapolateRight: "clamp" }) : 0;
  const chapaY = HY + dy - 230, reunion = { x: X0 + 26, y: HY - 380 - 240 };
  const paso = (Math.sin(f / 8) + 1) / 2;
  const cae = estado === "cae" ? Math.min(1, t) : estado === "colgado" ? 1 : 0;
  const yCae = HY + 150 * cae, xCae = HX - 30 * cae;
  const arnes: [number, number] = cae > 0 ? [xCae + 20, yCae - 30] : [HX + 26, HY + dy - 30];
  const pa = W(PIE_A, dy), pb = W(PIE_B, dy), ma = W(MANO_A, dy), mb = W(estado === "arriba" ? [70, -200] : MANO_B, dy);
  const grupoEl = (q: Quien) => {
    const g = grupo[q] ?? {}, r = REPARTO[q] as { aspecto: object; cuerpo?: object };
    const asegura = q === "pareja";
    return <Escalador key={q} x={GRUPO[q]} y={SUELO - 140.6 * SG} quien="joe" s={SG} aspecto={r.aspecto} cuerpo={r.cuerpo} pose={g.pose ?? "pie"} cara={g.cara ?? "normal"} sombra={SUELO}
      objeto={q === "nuevo" ? "movil" : undefined} mira={1} angulos={{ ...(asegura ? { brazoA: [120, 175], brazoB: [60, 100], cabeza: -24 } : { cabeza: -20 }), ...g.angulos }} />;
  };
  const escena = (
    <>
      <ParedNaranja x0={X0} />
      <rect x={-300} y={SUELO} width={1700} height={600} fill={PB.suelo} />
      {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={40 + i * 110} cy={SUELO + 50 + (i % 3) * 40} rx={36} ry={10} fill={PB.sueloS} />)}
      {/* línea de chapas */}
      {[0, 1, 2, 3].map((i) => <Chapa key={i} x={X0 + 24} y={1250 - i * 230} />)}
      <Chapa x={reunion.x} y={reunion.y} reunion />
      {/* cuerda: de la pareja a la chapa más alta chapada y de ahí a tu arnés */}
      <Cuerda d={`M${GRUPO.pareja + 40} ${SUELO - 230} Q${X0 - 10} 1100 ${X0 + 24} ${(estado === "arriba" ? reunion.y + 26 : chapaY + 54)} L${arnes[0]} ${arnes[1]}`} />
      {/* presas y regletes donde van manos y pies (si está en la pared) */}
      {cae === 0 && [ma, mb].map(([x, y], i) => <path key={i} d={`M${X0} ${y - 16} L${x + 4} ${y - 6} Q${x + 2} ${y + 14} ${X0} ${y + 16} Z`} fill={PB.rocaL} stroke={PB.rocaS} strokeWidth={3} />)}
      {cae === 0 && [pa, pb].map(([x, y], i) => <path key={i} d={`M${X0} ${y - 2} L${x - 22} ${y + 4} L${x - 18} ${y + 14} L${X0} ${y + 16} Z`} fill={PB.rocaL} stroke={PB.rocaS} strokeWidth={3} />)}
      {cae === 0
        ? <Escalador x={HX} y={HY + dy} quien="joe" s={S} aspecto={REPARTO.tu.aspecto} cara={cara}
            angulos={{ torso: TORSO, cabeza: estado === "paso" ? 30 : 0, brazoA: estado === "sube" ? alcanza([86, -108 - 30 * paso], -1) : alcanza(MANO_A, -1), brazoB: alcanza(estado === "arriba" ? [70, -200] : [84, -168 + 20 * (estado === "sube" ? 1 - paso : 0)]), piernaA: [110, 0], piernaB: [30, 30] }} />
        : <Escalador x={xCae} y={yCae} quien="joe" s={S} aspecto={REPARTO.tu.aspecto} cara={cara} pose={cae < 1 ? "cayendo" : "colgado"} rot={cae < 1 ? 10 : Math.sin(f / 6) * 4} />}
      {(Object.keys(GRUPO) as Quien[]).map(grupoEl)}
    </>
  );
  return (
    <Svg>
      <Cielo />
      <path d="M-200 1250 L120 1180 L300 1230 L520 1170 L800 1240 L1300 1200 L1300 1400 L-200 1400 Z" fill="#9FB3C4" />
      {Array.from({ length: 14 }).map((_, i) => <g key={i} transform={`translate(${i * 60} ${1330 + (i % 2) * 20})`}><path d="M-20 0 L0 -60 L20 0 Z" fill={PB.pino} /></g>)}
      {zoom ? <Zoom {...zoom}>{escena}</Zoom> : escena}
    </Svg>
  );
};
