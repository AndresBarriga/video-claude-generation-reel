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

/* ---- primer plano del puesto: el GRIGRI DE LADO, dibujado sobre las fotos de Andrés (17-nov).
   Izquierda: la pieza NEGRA redondeada (la leva, donde aprieta el pulgar). Centro: las placas plateadas. Derecha: la PESTAÑA plateada curva
   (reborde de la placa: ahí se enganchan índice y medio; no se aprieta). Las dos cuerdas salen por arriba; la de freno pasa por encima de la
   pestaña y baja por dentro de la mano. Se dibuja en coordenadas de la foto (1500 × 2000) y se lleva a pantalla con FOTO. ---- */
export const AP = { x: 0, y: 0, s: 1 };
const FS = 0.62, FX = 139, FY = 261;
const FOTO = `translate(${FX} ${FY}) scale(${FS})`;
const enP = (x: number, y: number) => ({ x: FX + x * FS, y: FY + y * FS });
/** Dónde aprieta el pulgar (la pieza negra), en pantalla. */
export const TAB = enP(330, 1150);
/** Dónde se enganchan los dedos (la pestaña), en pantalla. */
export const PEST = enP(820, 640);
const T = "#050B14", PIEL = "#E3B48E", PIELS = "#B9875F", NAR = "#FF7A45", MANGA = "#8E7CC3", MANGAS = "#6A5A9A";
const PLATA = "#C9D1D8", PLATAS = "#8C96A3", NEGRO = "#2A2F38";
const cuerda = (d: string, off = 0, w = 70) => <g><path d={d} stroke={T} strokeWidth={w + 20} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke="#FFD0A8" strokeWidth={10} fill="none" strokeDasharray="40 46" strokeDashoffset={off} opacity={0.85} /></g>;
const ESC = "M585 400 L520 -700", FRE = "M640 400 C690 210 930 210 930 430 L940 2400";
const tubo = (d: string, w: number, fill: string, key?: React.Key) => <g key={key}><path d={d} stroke={T} strokeWidth={w + 18} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={fill} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
const flecha = (x: number, y: number, rot: number, o: number) => <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke={T} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
/** Puño (coordenadas de pantalla) cerrado sobre una cuerda vertical en x; antebrazo hacia (bx, by). */
const Puno: React.FC<{ x: number; y: number; lado?: 1 | -1; bx: number; by: number }> = ({ x, y, lado = 1, bx, by }) => (
  <g>
    <path d={`M${x + lado * 60} ${y} L${bx} ${by}`} stroke={T} strokeWidth={128} strokeLinecap="round" /><path d={`M${x + lado * 60} ${y} L${bx} ${by}`} stroke={MANGA} strokeWidth={112} strokeLinecap="round" />
    <path d={`M${x + lado * 70} ${y + 40} L${bx} ${by}`} stroke={MANGAS} strokeWidth={30} strokeLinecap="round" opacity={0.5} />
    <rect x={lado > 0 ? x + 6 : x - 96} y={y - 84} width={90} height={168} rx={40} fill={PIEL} stroke={T} strokeWidth={11} />
    {[-54, -18, 18, 54].map((d, i) => <g key={i}><path d={`M${x - lado * 36} ${y + d} L${x + lado * 44} ${y + d}`} stroke={T} strokeWidth={46} strokeLinecap="round" /><path d={`M${x - lado * 36} ${y + d} L${x + lado * 44} ${y + d}`} stroke={PIEL} strokeWidth={34} strokeLinecap="round" /><path d={`M${x - lado * 4} ${y + d - 10} v20`} stroke={PIELS} strokeWidth={5} strokeLinecap="round" /></g>)}
  </g>
);
/** El grigri de lado (coordenadas de foto). `leva` = resalta la pieza negra; `pisa` 0–1 la hunde un poco. */
const Grigri: React.FC<{ leva?: string; pisa?: number }> = ({ leva, pisa = 0 }) => (
  <g>
    {/* mosquetones colgando */}
    {tubo("M560 1660 Q520 1900 560 2200", 80, PLATAS)}{tubo("M760 1600 L1100 2150", 90, PLATA)}
    <rect x={930} y={1820} width={110} height={190} rx={22} transform="rotate(-32 985 1915)" fill="#A9B1BA" stroke={T} strokeWidth={14} />
    {/* placas plateadas (centro) */}
    <rect x={455} y={370} width={250} height={1320} rx={60} fill={PLATA} stroke={T} strokeWidth={16} />
    <path d="M480 470 L690 470" stroke={PLATAS} strokeWidth={14} />
    <path d="M500 560 L660 540 L660 900 Q600 860 510 880 Z" fill="#3B4250" stroke={T} strokeWidth={12} strokeLinejoin="round" />
    <path d="M500 1000 Q600 960 660 1010 L660 1300 Q580 1260 500 1290 Z" fill={PLATAS} stroke={T} strokeWidth={10} strokeLinejoin="round" opacity={0.8} />
    <path d="M490 1100 L490 1600" stroke="#fff" strokeWidth={14} opacity={0.35} strokeLinecap="round" />
    {/* pieza NEGRA redondeada (izquierda): la leva */}
    <g transform={`translate(${-12 * pisa} 0)`}>
      {leva && <path d="M480 360 Q250 420 250 1020 Q250 1600 480 1710" stroke={leva} strokeWidth={70} fill="none" opacity={0.55} strokeLinecap="round" />}
      <path d="M490 372 Q285 420 275 1020 Q270 1590 490 1700 L505 1640 Q400 1520 400 1020 Q402 520 515 430 Z" fill={NEGRO} stroke={T} strokeWidth={16} strokeLinejoin="round" />
      <path d="M440 500 Q330 700 330 1020" stroke="#5A616C" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
    {/* PESTAÑA plateada curva (derecha) */}
    {tubo("M690 385 Q835 390 835 540 L835 1600 Q835 1690 750 1700", 80, PLATA)}
    <path d="M708 400 Q815 410 815 540 L815 1560" stroke="#fff" strokeWidth={14} fill="none" opacity={0.45} strokeLinecap="round" />
  </g>
);
/** Mano de freno haciendo el gesto rápido (coordenadas de foto): índice y medio enganchados en la pestaña; el pulgar va a la pieza negra. */
const ManoRapida: React.FC<{ pisa: number; marca: number; dedosEn: boolean }> = ({ pisa, marca, dedosEn }) => {
  const dc = marca === 1 ? NAR : PIEL, tc = marca === 3 || pisa > 0.5 ? NAR : PIEL, tx = 360 + 150 * (1 - pisa), ty = 1170 + 40 * (1 - pisa);
  return (
    <g>
      {/* dedos por detrás de la pestaña (las yemas quedan ocultas tras ella) */}
      {dedosEn && <><rect x={760} y={500} width={450} height={190} rx={95} fill={dc} stroke={T} strokeWidth={16} /><rect x={770} y={705} width={430} height={185} rx={92} fill={dc} stroke={T} strokeWidth={16} /></>}
      {/* antebrazo y dorso */}
      <path d="M1180 900 L1700 1700" stroke={T} strokeWidth={560} strokeLinecap="round" /><path d="M1180 900 L1700 1700" stroke={MANGA} strokeWidth={530} strokeLinecap="round" />
      <path d="M980 470 Q1250 420 1500 560 L1520 1520 Q1180 1480 1020 1380 Q900 1260 880 1100 Q870 900 980 470 Z" fill={PIEL} stroke={T} strokeWidth={16} strokeLinejoin="round" />
      {dedosEn && <><path d="M1010 520 q30 70 0 150 M1000 730 q30 70 0 140" stroke={PIELS} strokeWidth={9} fill="none" strokeLinecap="round" /></>}
      {/* pulgar: de la base de la mano hacia la pieza negra */}
      <path d={`M1400 1080 Q900 1010 ${tx + 90} ${ty - 110} Q${tx - 70} ${ty - 90} ${tx - 70} ${ty} Q${tx - 60} ${ty + 100} ${tx + 90} ${ty + 110} Q900 1310 1400 1420 Z`} fill={tc} stroke={T} strokeWidth={16} strokeLinejoin="round" />
      <ellipse cx={tx + 20} cy={ty} rx={74} ry={70} fill="none" stroke={T} strokeWidth={8} />
      <path d={`M${tx + 280} ${ty - 70} q-20 70 0 140`} stroke={PIELS} strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** MAL: la mano agarra el grigri entero desde abajo (los dedos rodean la pieza negra y la mantienen apretada). */
const ManoMal: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(${Math.sin(f * 1.3) * 4} 0)`}>
    <path d="M1100 1250 L1700 1900" stroke={T} strokeWidth={560} strokeLinecap="round" /><path d="M1100 1250 L1700 1900" stroke={MANGA} strokeWidth={530} strokeLinecap="round" />
    <path d="M900 900 Q1250 860 1400 1100 L1420 1700 Q1100 1720 940 1600 Z" fill={PIEL} stroke={T} strokeWidth={16} strokeLinejoin="round" />
    {[900, 1080, 1260, 1440].map((y, i) => <g key={i}><rect x={230} y={y} width={760} height={170} rx={85} fill={i === 1 ? NAR : PIEL} stroke={T} strokeWidth={16} /><path d={`M560 ${y + 30} v110`} stroke={PIELS} strokeWidth={9} strokeLinecap="round" /></g>)}
  </g>
);
/** Puesto de aseguramiento. `modo`: "mal" · "normal" (arriba tira, abajo empuja) · "rapido" · "solo". `etiqueta` muestra «PULGAR AQUÍ»; `marca` 1 = dedos. */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number; flechas?: number; etiqueta?: number; sinArriba?: boolean; dedos?: number }> = ({ modo, corre = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0, flechas = 0, etiqueta = 0, sinArriba = false, dedos = 0 }) => {
  const cuelga = modo === "mal" ? Math.sin(f / 5) * 50 : 0, fre = modo === "mal" ? `M640 400 C690 210 930 210 930 430 Q${980 + cuelga} 1500 ${900 + cuelga * 2} 2400` : FRE;
  const lbl = (txt: string, x: number, y: number, tx: number, ty: number, o: number, col = T) => o <= 0 ? null : <g opacity={Math.min(1, o)}><path d={`M${x} ${y} L${tx} ${ty}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" /><circle cx={tx} cy={ty} r={10} fill="#fff" /><rect x={x - 150} y={y - 40} width={300} height={80} rx={24} fill={col} stroke="#fff" strokeWidth={4} /><text x={x} y={y + 16} textAnchor="middle" fontFamily="Figtree" fontWeight={800} fontSize={46} fill="#fff">{txt}</text></g>;
  return (
    <g>
      <g transform={FOTO}>
        {brilloFreno > 0 && <path d={FRE} stroke="#FFD24A" strokeWidth={170} fill="none" strokeLinecap="round" opacity={0.5 * brilloFreno} />}
        {cuerda(ESC, corre)}
        <Grigri leva={leva} pisa={modo === "mal" ? 1 : pisa} />
        {cuerda(fre, -corre)}
        {modo === "rapido" && <ManoRapida pisa={pisa} marca={marca} dedosEn />}
        {modo === "mal" && <><ManoMal f={f} /><g opacity={0.6 + 0.4 * Math.sin(f / 4)}><ellipse cx={940} cy={2050} rx={150} ry={170} fill="none" stroke={ROJO} strokeWidth={18} strokeDasharray="34 24" /></g></>}
      </g>
      {modo === "normal" && <>
        {!sinArriba && <Puno x={enP(520 + 65 * (80 * da) / 1100, 0).x - 8} y={330 - 80 * da} lado={-1} bx={-60} by={140 - 80 * da} />}
        <Puno x={enP(940, 0).x} y={1500 - 160 * da} bx={1060} by={1840 - 160 * da} />
        {flechas > 0 && <>{flecha(300, 300, 0, flechas)}{flecha(840, 1380, 0, flechas)}</>}
      </>}
      {modo === "rapido" && !sinArriba && <Puno x={enP(520, 0).x - 6} y={330 - 70 * pisa} lado={-1} bx={-60} by={140 - 70 * pisa} />}
      {lbl("DEDOS AQUÍ", 790, 420, PEST.x + 70, PEST.y - 20, dedos, "#2E8B57")}
      {lbl("PULGAR AQUÍ", 240, 1240, TAB.x, TAB.y + 10, etiqueta, "#C2603A")}
    </g>
  );
};
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte = "#3B4757", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${tinte} 0%, #1C2430 85%)`, transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
