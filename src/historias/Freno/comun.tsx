// E62 «La que frena es tu mano» (dar cuerda bien con un aparato de frenado asistido). Rocódromo. Todo sobre el KIT.
// Mecánica según Petzl («Asegurar con el GRIGRI»): mano siempre en la cuerda lado frenado; dar cuerda normal sin tocar la leva;
// dar rápido = tres dedos en la cuerda, índice apoya el aparato, pulgar en la leva un instante, y la mano vuelve a su sitio.
import React from "react";
import { AbsoluteFill } from "remotion";
import { crearVia, PERFILES, REPARTO, Plano, Svg, Agarre, formaMosq, PC, C } from "../../piezas/kit";
export { C, clamp, golpe, type P } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8, 9.1] });
export const I = 4, P0 = VIA.cadera(VIA.mos(5).y + 150), XA = 300;
export const EL = REPARTO.tu, ELLA = REPARTO.nueva;
export const VERDE = "#3FA76A", ROJO = PC.miedo;
export const Mundo: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => <Plano via={VIA} decorado="sala" {...p} />;

/* ---- primer plano del puesto de aseguramiento (vista de frente, como la técnica oficial: la cuerda del escalador sube por la izquierda,
   la de FRENO sale por arriba a la derecha, hace un arco y baja a la mano de freno) ---- */
export const AP = { x: 470, y: 1010, s: 1.25 };
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#C08F69", MANGA = "#8E7CC3", NAR = "#FF8A4C";
const cap = (x1: number, y1: number, x2: number, y2: number, w: number, fill: string, key?: React.Key) => <g key={key}><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={T} strokeWidth={w + 11} strokeLinecap="round" /><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={fill} strokeWidth={w} strokeLinecap="round" /></g>;
const cuerda = (d: string, off = 0, w = 34) => <g><path d={d} stroke={C.cuerdaS} strokeWidth={w + 10} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke="#FFD0A8" strokeWidth={6} fill="none" strokeDasharray="26 30" strokeDashoffset={off} opacity={0.8} /></g>;
const ESC = "M-34 -96 L-70 -620", FRE = "M34 -100 C60 -215 160 -215 166 -90 L170 330";
const flecha = (x: number, y: number, rot: number, o: number) => <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}><path d="M0 34 V-30 M-24 -8 L0 -34 L24 -8" stroke={T} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 34 V-30 M-24 -8 L0 -34 L24 -8" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
/** Mano de freno junto al aparato para DAR RÁPIDO: tres dedos en la cuerda de freno, índice apoyando bajo el aparato, pulgar sobre la leva (`pisa` 0–1). `marca`: 1 dedos · 2 índice · 3 pulgar. */
const ManoRapida: React.FC<{ pisa: number; marca: number }> = ({ pisa, marca }) => (
  <g>
    {cap(340, 430, 250, 190, 86, MANGA)}
    <ellipse cx={204} cy={64} rx={60} ry={84} fill={PIEL} stroke={T} strokeWidth={11} transform="rotate(-14 204 64)" />
    {cap(176, 34, 100, 78, 28, marca === 2 ? NAR : PIEL)}
    {cap(176, -2, 112 - 46 * pisa, -84 + 18 * pisa, 32, marca === 3 || pisa > 0.5 ? NAR : PIEL)}
    {[74, 108, 142].map((y, i) => cap(214, y, 146, y + 4, 28, marca === 1 ? NAR : PIEL, i))}
    <path d="M232 20 q22 40 6 100" stroke={PIELS} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);
/** MAL: la mano envuelve el aparato entero con el pulgar fijo en la leva. */
const ManoMal: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(${Math.sin(f * 1.3) * 2} 0)`}>
    {cap(360, 400, 250, 150, 86, MANGA)}
    <ellipse cx={150} cy={10} rx={66} ry={104} fill={PIEL} stroke={T} strokeWidth={11} />
    {[-36, 4, 44, 82].map((y, i) => cap(150, y, -72 + i * 6, y + 6, 34, PIEL, i))}
    {cap(150, -66, 8, -82, 36, NAR)}
    {[-36, 4, 44, 82].map((y, i) => <path key={i} d={`M30 ${y - 12} v24`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" />)}
  </g>
);
/** Puesto de aseguramiento en primer plano. `modo`: "mal" · "normal" (una mano tira arriba, la de freno abajo) · "rapido" · "solo".
 *  `corre` = cuerda que pasa (px) · `bloquea` 0–1 = la leva gira y pellizca · `leva` = color · `da` 0–1 = bombeo al dar cuerda · `flechas` · `brilloFreno`. */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number; flechas?: number; etiqueta?: number }> = ({ modo, corre = 0, bloquea = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0, flechas = 0, etiqueta = 0 }) => {
  const cuelga = modo === "mal" ? Math.sin(f / 5) * 22 : 0, cola = `M170 330 Q${190 + cuelga} 520 ${150 + cuelga * 2} 760`;
  return (
    <g transform={`translate(${AP.x} ${AP.y}) scale(${AP.s})`}>
      {brilloFreno > 0 && <path d={FRE} stroke="#FFE3A0" strokeWidth={96} fill="none" strokeLinecap="round" opacity={0.5 * brilloFreno} />}
      <path d="M-6 330 Q0 260 0 214" stroke={T} strokeWidth={66} strokeLinecap="round" /><path d="M-6 330 Q0 260 0 214" stroke="#B4553C" strokeWidth={50} strokeLinecap="round" />
      <g transform="translate(0 168) scale(0.8)">{formaMosq(0, "der", 1)}</g>
      {cuerda(ESC, corre)}{cuerda(FRE, -corre)}{cuerda(cola, -corre)}
      {/* cuerpo del aparato, con su pestaña (donde apoya el índice) y la empuñadura plegada */}
      {cap(-84, -10, -112, 74, 20, "#2B3039")}
      <path d="M-66 -104 Q-92 -110 -84 -40 L-70 70 Q-64 102 -22 102 L52 102 Q104 104 96 64 L84 52 L88 -52 Q90 -112 30 -114 Z" fill="#5C7FA8" stroke={T} strokeWidth={12} strokeLinejoin="round" />
      <path d="M-56 -78 Q-20 -92 20 -90" stroke="#fff" strokeWidth={7} fill="none" opacity={0.35} strokeLinecap="round" />
      <circle cx={0} cy={66} r={15} fill="#2B3039" />
      {/* LEVA: gira y pellizca la cuerda contra el cuerpo */}
      <g transform={`translate(24 -56) rotate(${-30 * bloquea + 14 * pisa})`}>
        <path d="M-52 4 Q-50 -34 0 -34 Q50 -34 44 4 Q36 34 -10 30 Q-50 28 -52 4 Z" fill={leva ?? (pisa > 0.5 ? NAR : "#2B3039")} stroke={T} strokeWidth={10} strokeLinejoin="round" />
        <circle cx={14} cy={0} r={9} fill="#C9D1D8" />
      </g>
      {etiqueta > 0 && <g opacity={Math.min(1, etiqueta)}><path d="M-60 -150 L-4 -84" stroke="#fff" strokeWidth={7} strokeLinecap="round" /><rect x={-230} y={-212} width={178} height={66} rx={20} fill={T} /><text x={-141} y={-165} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={44} fill="#fff">LEVA</text></g>}
      {modo === "normal" && <>
        <Agarre x={171} y={250 - 150 * da} s={0.78} espejo cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} />
        <Agarre x={-56} y={-400 - 90 * (1 - da)} s={0.78} rot={-4} cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} />
        {flechas > 0 && <>{flecha(-150, -470, -4, flechas)}{flecha(262, 130, 0, flechas)}</>}
      </>}
      {modo === "rapido" && <><ManoRapida pisa={pisa} marca={marca} /><Agarre x={-56} y={-400 - 60 * pisa} s={0.78} rot={-4} cierra={1} piel={PIEL} pielS={PIELS} manga={MANGA} /></>}
      {modo === "mal" && <><ManoMal f={f} /><g opacity={0.6 + 0.4 * Math.sin(f / 4)}><ellipse cx={172} cy={280} rx={74} ry={84} fill="none" stroke={ROJO} strokeWidth={11} strokeDasharray="22 16" /></g></>}
    </g>
  );
};
/** Fondo de los primeros planos (sala desenfocada). */
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte = "#3B4757", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 55% 48%, ${tinte} 0%, #1C2430 85%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
