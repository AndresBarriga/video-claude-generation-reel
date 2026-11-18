// E62 «La que frena es tu mano» (dar cuerda bien con un aparato de frenado asistido). Rocódromo. Todo sobre el KIT.
// Mecánica según Petzl («Asegurar con el GRIGRI»): mano siempre en la cuerda lado frenado; dar cuerda normal sin tocar la leva;
// dar rápido = tres dedos en la cuerda, índice apoya el aparato, pulgar en la leva un instante, y la mano vuelve a su sitio.
import React from "react";
import { AbsoluteFill } from "remotion";
import { crearVia, PERFILES, REPARTO, Plano, Svg, PC, C } from "../../piezas/kit";
import { grigriSVG, PULGAR, DEDOS } from "./grigri";
export { C, clamp, golpe, type P } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8, 9.1] });
export const I = 4, P0 = VIA.cadera(VIA.mos(5).y + 150), XA = 300;
export const EL = REPARTO.tu, ELLA = REPARTO.nueva;
export const VERDE = "#3FA76A", ROJO = PC.miedo;
export const Mundo: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => <Plano via={VIA} decorado="sala" {...p} />;

/* ---- primer plano del puesto: el grigri DE LADO dibujado sobre la foto de Andrés (ver grigri.ts). ---- */
export const AP = { x: 0, y: 0, s: 1 };
const FS = 0.55, FX = 232, FY = 334;
const enP = (x: number, y: number) => ({ x: FX + x * FS, y: FY + y * FS });
/** Dónde aprieta el pulgar y dónde van los dedos (pantalla). */
export const TAB = enP(PULGAR.x, PULGAR.y), PEST = enP(DEDOS.x, DEDOS.y);
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#B9875F", MANGA = "#8E7CC3", MANGAS = "#6A5A9A";
const flecha = (x: number, y: number, rot: number, o: number) => <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke={T} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
const Puno: React.FC<{ x: number; y: number; lado?: 1 | -1; bx: number; by: number }> = ({ x, y, lado = 1, bx, by }) => (
  <g>
    <path d={`M${x + lado * 70} ${y} L${bx} ${by}`} stroke={T} strokeWidth={150} strokeLinecap="round" /><path d={`M${x + lado * 70} ${y} L${bx} ${by}`} stroke={MANGA} strokeWidth={134} strokeLinecap="round" />
    <path d={`M${x + lado * 80} ${y + 46} L${bx} ${by}`} stroke={MANGAS} strokeWidth={34} strokeLinecap="round" opacity={0.5} />
    <rect x={lado > 0 ? x + 6 : x - 112} y={y - 100} width={106} height={200} rx={48} fill={PIEL} stroke={T} strokeWidth={12} />
    {[-66, -22, 22, 66].map((d, i) => <g key={i}><path d={`M${x - lado * 44} ${y + d} L${x + lado * 52} ${y + d}`} stroke={T} strokeWidth={54} strokeLinecap="round" /><path d={`M${x - lado * 44} ${y + d} L${x + lado * 52} ${y + d}`} stroke={PIEL} strokeWidth={40} strokeLinecap="round" /><path d={`M${x - lado * 4} ${y + d - 12} v24`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" /></g>)}
  </g>
);
const lbl = (txt: string, x: number, y: number, tx: number, ty: number, o: number, col: string) => o <= 0 ? null : <g opacity={Math.min(1, o)}><path d={`M${x} ${y} L${tx} ${ty}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" /><circle cx={tx} cy={ty} r={11} fill="#fff" stroke={T} strokeWidth={4} /><rect x={x - 170} y={y - 42} width={340} height={84} rx={26} fill={col} stroke="#fff" strokeWidth={4} /><text x={x} y={y + 17} textAnchor="middle" fontFamily="Figtree" fontWeight={800} fontSize={50} fill="#fff">{txt}</text></g>;
/** Puesto de aseguramiento. `modo`: "mal" · "normal" (arriba tira, abajo empuja) · "rapido" · "solo". `dedos`/`etiqueta` = rótulos «DEDOS AQUÍ» / «PULGAR AQUÍ». */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number; flechas?: number; etiqueta?: number; sinArriba?: boolean; dedos?: number; giro?: number }> = ({ modo, corre = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0, flechas = 0, etiqueta = 0, sinArriba = false, dedos = 0, giro = 1 }) => {
  const svg = grigriSVG({ modo, pisa, dedosHi: marca === 1, pulgarHi: marca === 3 || pisa > 0.5, corre, cuelga: modo === "mal" ? Math.sin(f / 5) * 60 : 0, brillo: brilloFreno, leva });
  return (
    <g transform={`translate(540 960) scale(${giro} 1) translate(-540 -960)`}>
      <g transform={`translate(${FX} ${FY}) scale(${FS})`} dangerouslySetInnerHTML={{ __html: svg }} />
      {modo === "normal" && <>
        {!sinArriba && <Puno x={enP(498, 0).x - 4} y={250 - 80 * da} lado={-1} bx={-80} by={70 - 80 * da} />}
        <Puno x={enP(1006, 0).x} y={1560 - 170 * da} bx={1100} by={1900 - 170 * da} />
        {flechas > 0 && <>{flecha(300, 230, 0, flechas)}{flecha(930, 1420, 0, flechas)}</>}
      </>}
      {modo === "rapido" && !sinArriba && <Puno x={enP(498, 0).x - 4} y={250 - 70 * pisa} lado={-1} bx={-80} by={70 - 70 * pisa} />}
      {lbl("DEDOS AQUÍ", 820, 300, PEST.x, PEST.y, dedos, "#2E8B57")}
      {lbl("PULGAR AQUÍ", 250, 1230, TAB.x, TAB.y, etiqueta, "#C2603A")}
    </g>
  );
};
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte = "#3B4757", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${tinte} 0%, #1C2430 85%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
