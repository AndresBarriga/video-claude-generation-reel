// E62 «La que frena es tu mano» (dar cuerda bien con un aparato de frenado asistido). Rocódromo. Todo sobre el KIT.
// Mecánica según Petzl («Asegurar con el GRIGRI»): mano siempre en la cuerda lado frenado; dar cuerda normal sin tocar la leva;
// dar rápido = tres dedos en la cuerda, índice apoya el aparato, pulgar en la leva un instante, y la mano vuelve a su sitio.
import React from "react";
import { AbsoluteFill } from "remotion";
import { crearVia, PERFILES, REPARTO, Plano, Svg, PC, C } from "../../piezas/kit";
export { C, clamp, golpe, type P } from "../../piezas/kit";

export const VIA = crearVia({ perfil: PERFILES.panel, metros: [2.6, 3.9, 5.2, 6.5, 7.8, 9.1] });
export const I = 4, P0 = VIA.cadera(VIA.mos(5).y + 150), XA = 300;
export const EL = REPARTO.tu, ELLA = REPARTO.nueva;
export const VERDE = "#3FA76A", ROJO = PC.miedo;
export const Mundo: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = (p) => <Plano via={VIA} decorado="sala" {...p} />;

/* ---- primer plano del puesto: el GRIGRI de cara (placa en gota, remaches, agujero abajo), como en las fotos de la técnica oficial.
   La cuerda del escalador sale por arriba; la de freno hace el bucle por encima y baja por la derecha.
   Gesto rápido (Petzl): tres dedos cerrados en la cuerda de freno, índice bajo el grigri, pulgar cruzando la cara hasta la leva. ---- */
export const AP = { x: 0, y: 0, s: 1 };
/** Punto donde aprieta el pulgar (borde de la leva, abajo a la izquierda), en pantalla. */
const ZS = 1.22, ZX = 520, ZY = 1040, TAB0 = { x: 414, y: 1032 };
export const TAB = { x: 540 + (TAB0.x - ZX) * ZS, y: 1000 + (TAB0.y - ZY) * ZS };
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#B9875F", NAR = "#FF7A45", MANGA = "#8E7CC3", MANGAS = "#6A5A9A";
const PLACA = "#E57A2E", PLACAS = "#B85A1C";
const cuerda = (d: string, off = 0, w = 34) => <g><path d={d} stroke={T} strokeWidth={w + 12} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke="#FFD0A8" strokeWidth={6} fill="none" strokeDasharray="24 28" strokeDashoffset={off} opacity={0.85} /></g>;
const ESC = "M472 836 L430 120", FRE = "M528 836 C540 752 650 752 656 860 L660 1900";
const xEsc = (y: number) => 472 - 42 * (836 - y) / 716;
const cap = (x1: number, y1: number, x2: number, y2: number, w: number, fill: string, key?: React.Key) => <g key={key}><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={T} strokeWidth={w + 12} strokeLinecap="round" /><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={fill} strokeWidth={w} strokeLinecap="round" /></g>;
const flecha = (x: number, y: number, rot: number, o: number) => <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke={T} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
/** Puño cerrado sobre una cuerda vertical en x (los dedos por delante de la cuerda, el dorso hacia `lado`). El antebrazo sale hacia (bx, by). */
const Puno: React.FC<{ x: number; y: number; lado?: 1 | -1; bx: number; by: number; dedos?: string }> = ({ x, y, lado = 1, bx, by, dedos = PIEL }) => (
  <g>
    <path d={`M${x + lado * 60} ${y} L${bx} ${by}`} stroke={T} strokeWidth={128} strokeLinecap="round" /><path d={`M${x + lado * 60} ${y} L${bx} ${by}`} stroke={MANGA} strokeWidth={112} strokeLinecap="round" />
    <path d={`M${x + lado * 70} ${y + 40} L${bx} ${by}`} stroke={MANGAS} strokeWidth={30} strokeLinecap="round" opacity={0.5} />
    <rect x={lado > 0 ? x + 6 : x - 96} y={y - 84} width={90} height={168} rx={40} fill={PIEL} stroke={T} strokeWidth={11} />
    {[-54, -18, 18, 54].map((d, i) => cap(x - lado * 36, y + d, x + lado * 44, y + d, 34, i === 0 ? PIEL : dedos, i))}
    {[-54, -18, 18, 54].map((d, i) => <path key={i} d={`M${x - lado * 4} ${y + d - 10} v20`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" />)}
    {cap(x + lado * 30, y - 84, x - lado * 26, y - 104, 32, PIEL)}
  </g>
);
/** El GRIGRI de cara. `leva` = color del borde de la leva (donde aprieta el pulgar); `pisa` lo hunde. */
const Grigri: React.FC<{ leva?: string; pisa?: number }> = ({ leva, pisa = 0 }) => (
  <g>
    {/* arnés y anillo */}
    <path d="M-60 1270 Q300 1240 700 1330 L690 1390 Q300 1300 -60 1330 Z" fill="#3A4556" stroke="#6B7787" strokeWidth={5} />
    <path d="M470 1262 Q500 1340 540 1262" fill="none" stroke={T} strokeWidth={30} /><path d="M470 1262 Q500 1340 540 1262" fill="none" stroke="#C9A23C" strokeWidth={18} />
    {/* mosquetón de seguro */}
    <path d="M500 1058 Q546 1066 540 1140 L528 1258 Q522 1290 496 1286 Q470 1282 472 1250 L476 1112 Q480 1060 500 1058 Z" fill="none" stroke={T} strokeWidth={20} /><path d="M500 1058 Q546 1066 540 1140 L528 1258 Q522 1290 496 1286 Q470 1282 472 1250 L476 1112 Q480 1060 500 1058 Z" fill="none" stroke="#C7CDD4" strokeWidth={9} />
    <rect x={526} y={1150} width={26} height={60} rx={8} fill="#7E8A97" stroke={T} strokeWidth={6} />
    {/* empuñadura plegada (gris) a lo largo del borde izquierdo */}
    <path d="M410 860 Q368 950 400 1060" fill="none" stroke={T} strokeWidth={40} strokeLinecap="round" /><path d="M410 860 Q368 950 400 1060" fill="none" stroke="#9AA4AF" strokeWidth={26} strokeLinecap="round" />
    {/* placa en gota */}
    <path d="M500 828 C594 828 620 896 612 962 C604 1032 566 1086 532 1106 C516 1115 484 1115 468 1106 C434 1086 398 1032 390 962 C384 896 408 828 500 828 Z" fill={PLACA} stroke={T} strokeWidth={12} strokeLinejoin="round" />
    <path d="M440 870 Q500 846 566 872" stroke="#fff" strokeWidth={9} fill="none" opacity={0.35} strokeLinecap="round" />
    <path d="M410 990 Q440 1060 500 1080" stroke={PLACAS} strokeWidth={8} fill="none" opacity={0.6} strokeLinecap="round" />
    <circle cx={536} cy={900} r={17} fill="#D5DBE1" stroke={T} strokeWidth={7} /><circle cx={470} cy={985} r={13} fill="#D5DBE1" stroke={T} strokeWidth={6} />
    <circle cx={500} cy={1070} r={24} fill="#1C2430" stroke={T} strokeWidth={7} />
    {/* borde de la LEVA: donde aprieta el pulgar */}
    <g transform={`translate(${-5 * pisa} 0)`}><path d="M404 1000 Q394 1034 410 1066 L426 1060 Q414 1032 422 1004 Z" fill={leva ?? (pisa > 0.5 ? NAR : "#3B4250")} stroke={T} strokeWidth={6} strokeLinejoin="round" /></g>
  </g>
);
/** Puesto de aseguramiento. `modo`: "mal" (la mano envuelve el grigri, nadie en la cuerda de freno) · "normal" (arriba tira, abajo empuja) · "rapido" · "solo".
 *  `corre` = cuerda que pasa (px) · `bloquea` (sin uso visual, se mantiene la firma) · `leva` color · `da` 0–1 bombeo · `flechas` · `brilloFreno` · `etiqueta` rótulo «LEVA». */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number; flechas?: number; etiqueta?: number; sinArriba?: boolean }> = ({ modo, corre = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0, flechas = 0, etiqueta = 0, sinArriba = false }) => {
  const cuelga = modo === "mal" ? Math.sin(f / 5) * 26 : 0, fre = modo === "mal" ? `M528 836 C540 752 650 752 656 860 Q${680 + cuelga} 1350 ${640 + cuelga * 2} 1900` : FRE;
  const tx = 520 - (520 - (TAB0.x + 18)) * pisa, ty = 1062 - (1062 - TAB0.y - 4) * pisa;
  return (
    <g transform={`translate(540 1000) scale(${ZS}) translate(${-ZX} ${-ZY})`}>
      {brilloFreno > 0 && <path d={FRE} stroke="#FFD24A" strokeWidth={100} fill="none" strokeLinecap="round" opacity={0.5 * brilloFreno} />}
      {cuerda(ESC, corre)}{cuerda(fre, -corre)}
      <Grigri leva={leva} pisa={modo === "mal" ? 1 : pisa} />
      {modo === "normal" && <>
        {!sinArriba && <Puno x={xEsc(470 - 80 * da)} y={470 - 80 * da} lado={-1} bx={-60} by={260 - 80 * da} />}
        <Puno x={656} y={1420 - 170 * da} bx={1060} by={1760 - 170 * da} />
        {flechas > 0 && <>{flecha(300, 400, 0, flechas)}{flecha(780, 1300, 0, flechas)}</>}
      </>}
      {modo === "rapido" && <>
        <Puno x={xEsc(450 - 50 * pisa)} y={450 - 50 * pisa} lado={-1} bx={-60} by={240 - 50 * pisa} />
        {/* mano de freno junto al grigri */}
        <path d="M700 1180 L1060 1640" stroke={T} strokeWidth={128} strokeLinecap="round" /><path d="M700 1180 L1060 1640" stroke={MANGA} strokeWidth={112} strokeLinecap="round" />
        <rect x={662} y={1080} width={96} height={190} rx={44} fill={PIEL} stroke={T} strokeWidth={11} />
        {[1170, 1206, 1242].map((y, i) => cap(620, y, 712, y, 34, marca === 1 ? NAR : PIEL, i))}
        {[1170, 1206, 1242].map((y, i) => <path key={i} d={`M664 ${y - 10} v20`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" />)}
        {cap(700, 1128, 474, 1124, 32, marca === 2 ? NAR : PIEL)}
        {cap(690, 1088, tx, ty, 36, marca === 3 || pisa > 0.5 ? NAR : PIEL)}
        <ellipse cx={tx + 20} cy={ty - 2} rx={12} ry={9} fill="none" stroke={T} strokeWidth={4} />
      </>}
      {modo === "mal" && <>
        <path d="M720 980 L1060 1300" stroke={T} strokeWidth={128} strokeLinecap="round" /><path d="M720 980 L1060 1300" stroke={MANGA} strokeWidth={112} strokeLinecap="round" />
        <rect x={610} y={862} width={110} height={220} rx={48} fill={PIEL} stroke={T} strokeWidth={11} />
        {[892, 940, 988, 1036].map((y, i) => cap(660, y, 418, y + 4, 40, PIEL, i))}
        {[892, 940, 988, 1036].map((y, i) => <path key={i} d={`M520 ${y - 12} v24`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" />)}
        {cap(640, 1080, TAB0.x + 16, TAB0.y + 22, 38, NAR)}
        <g opacity={0.6 + 0.4 * Math.sin(f / 4)}><ellipse cx={666} cy={1420} rx={96} ry={110} fill="none" stroke={ROJO} strokeWidth={11} strokeDasharray="22 16" /></g>
      </>}
      {etiqueta > 0 && <g opacity={Math.min(1, etiqueta)}><path d={`M250 1034 L${TAB0.x - 8} ${TAB0.y}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" /><rect x={70} y={998} width={186} height={74} rx={22} fill={T} stroke="#fff" strokeWidth={4} /><text x={163} y={1050} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={48} fill="#fff">LEVA</text></g>}
    </g>
  );
};
/** Fondo de los primeros planos (sala desenfocada). */
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte = "#3B4757", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${tinte} 0%, #1C2430 85%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
