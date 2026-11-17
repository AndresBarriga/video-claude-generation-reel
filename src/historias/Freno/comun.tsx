// E62 «La que frena es tu mano» (dar cuerda bien con un aparato de frenado asistido). Rocódromo. Todo sobre el KIT.
// Mecánica según Petzl («Asegurar con el GRIGRI»): mano siempre en la cuerda lado frenado; dar cuerda normal sin tocar la leva;
// dar rápido = tres dedos en la cuerda, índice apoya el aparato, pulgar en la leva un instante, y la mano vuelve a su sitio.
import React from "react";
import { AbsoluteFill } from "remotion";
import { crearVia, PERFILES, REPARTO, Plano, Svg, AparatoGrande, Agarre, PC, C, type Pt } from "../../piezas/kit";
export { C, clamp, golpe, type P } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8, 9.1] });
export const I = 4, P0 = VIA.cadera(VIA.mos(5).y + 150), XA = 300;
export const EL = REPARTO.tu, ELLA = REPARTO.nueva;
export const VERDE = "#3FA76A", ROJO = PC.miedo;
export const Mundo: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => <Plano via={VIA} decorado="sala" {...p} />;

/* ---- primer plano del puesto de aseguramiento ---- */
export const AP = { x: 600, y: 930, s: 1.2 };
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#C08F69", MANGA = "#8E7CC3";
/** Punto de la cuerda de FRENO (0 = sale del aparato, 1 = abajo), en coordenadas del aparato. */
export const freno = (t: number): Pt => ({ x: (1 - t) ** 2 * -40 + 2 * (1 - t) * t * -150 + t * t * -260, y: (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 60 + t * t * 250 });
const barra = (a: Pt, b: Pt, w: number, fill: string, key?: React.Key) => <g key={key}><path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={T} strokeWidth={w + 12} strokeLinecap="round" /><path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={fill} strokeWidth={w} strokeLinecap="round" /></g>;
/** Mano de freno en posición de DAR RÁPIDO: tres dedos en la cuerda, índice apoyando el aparato y pulgar que pisa la leva (`pisa` 0–1). `marca` resalta: 1 dedos, 2 índice, 3 pulgar. */
export const ManoRapida: React.FC<{ pisa?: number; marca?: number }> = ({ pisa = 0, marca = 0 }) => {
  const n = { x: 0.82, y: 0.57 }, palma = { x: -86, y: 150 }, pul = { x: -70 + 66 * pisa, y: 20 - 48 * pisa };
  return (
    <g>
      {barra({ x: 150, y: 470 }, { x: -40, y: 210 }, 84, MANGA)}
      {[0.5, 0.64, 0.78].map((t, i) => { const b = freno(t); return barra({ x: b.x + n.x * 50, y: b.y + n.y * 50 }, { x: b.x - n.x * 26, y: b.y - n.y * 26 }, 30, marca === 1 ? "#FF9A6B" : PIEL, i); })}
      <ellipse cx={palma.x} cy={palma.y + 20} rx={74} ry={84} fill={PIEL} stroke={T} strokeWidth={12} transform={`rotate(-30 ${palma.x} ${palma.y})`} />
      <path d={`M${palma.x - 30} ${palma.y + 50} q30 26 66 6`} stroke={PIELS} strokeWidth={7} fill="none" strokeLinecap="round" />
      {barra({ x: -60, y: 118 }, { x: -6, y: 98 }, 30, marca === 2 ? "#FF9A6B" : PIEL)}
      {barra({ x: -112, y: 92 }, pul, 34, marca === 3 || pisa > 0.5 ? "#FF9A6B" : PIEL)}
    </g>
  );
};
/** Puesto de aseguramiento en primer plano. `modo`: "mal" (aparato agarrado entero, freno suelto) · "normal" (una mano arriba, otra en el freno) · "rapido" (ManoRapida) · "solo" (sin manos).
 *  `corre` = cuerda que pasa (px) · `bloquea` 0–1 · `leva` color · `da` 0–1 = la mano de freno empuja cuerda hacia el aparato. */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number }> = ({ modo, corre = 0, bloquea = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0 }) => {
  const b = freno(0.8 - 0.3 * da), cuelga = modo === "mal" ? Math.sin(f / 5) * 26 : 0;
  return (
    <g transform={`translate(${AP.x} ${AP.y}) scale(${AP.s})`}>
      {brilloFreno > 0 && <path d="M-40 20 Q-150 60 -260 250" stroke="#FFE3A0" strokeWidth={110} fill="none" strokeLinecap="round" opacity={0.55 * brilloFreno} />}
      <AparatoGrande x={0} y={0} bloquea={bloquea} corre={corre} leva={leva} />
      <g>{/* cola de la cuerda de freno hasta el suelo */}
        <path d={`M-260 250 Q${-300 + cuelga} 420 ${-250 + cuelga * 2} 640`} stroke={C.cuerdaS} strokeWidth={52} fill="none" strokeLinecap="round" /><path d={`M-260 250 Q${-300 + cuelga} 420 ${-250 + cuelga * 2} 640`} stroke={C.cuerda} strokeWidth={40} fill="none" strokeLinecap="round" />
      </g>
      {modo === "normal" && <><Agarre x={b.x} y={b.y} s={0.8} rot={35} cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} /><Agarre x={92} y={-300 - 50 * da} s={0.8} rot={-10} espejo cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} /></>}
      {modo === "rapido" && <><ManoRapida pisa={pisa} marca={marca} /><Agarre x={92} y={-300 - 40 * pisa} s={0.8} rot={-10} espejo cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} /></>}
      {modo === "mal" && <>
        <Agarre x={-6} y={-16} s={1.32} rot={12} cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} tiembla={Math.sin(f * 1.3) * 2} />
        <g opacity={0.6 + 0.4 * Math.sin(f / 4)}><ellipse cx={-205} cy={170} rx={70} ry={80} fill="none" stroke={ROJO} strokeWidth={10} strokeDasharray="22 16" /></g>
      </>}
    </g>
  );
};
/** Fondo de los primeros planos (sala desenfocada). */
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte = "#3B4757", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 55% 48%, ${tinte} 0%, #1C2430 85%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
