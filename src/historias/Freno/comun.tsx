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

/* ---- primer plano del puesto: lámina de MANUAL (dibujo de línea sobre fondo claro, aparato visto de canto, mano a su derecha),
   con la misma composición que la técnica oficial de Petzl: la cuerda del escalador entra por arriba; la de freno sale por arriba,
   hace un arco y baja entre los dedos; índice bajo el aparato; el pulgar aprieta la leva en su esquina superior izquierda. ---- */
export const AP = { x: 0, y: 0, s: 1 };
/** Punto donde aprieta el pulgar (esquina de la leva), en coordenadas de pantalla. */
const TAB0 = { x: 446, y: 912 }, ZX = 520, ZY = 1000, ZS = 1.32;
export const TAB = { x: 540 + (TAB0.x - ZX) * ZS, y: 990 + (TAB0.y - ZY) * ZS };
const T = "#14181F", PIEL = "#FFF8F1", NAR = "#FF7A45", GR = "#9AA3AD", GRO = "#5E6670";
const ln = { stroke: T, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const cuerda = (d: string, off = 0, w = 30) => <g><path d={d} stroke={T} strokeWidth={w + 10} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke="#FFD0A8" strokeWidth={5} fill="none" strokeDasharray="24 28" strokeDashoffset={off} opacity={0.85} /></g>;
const ESC = "M380 120 L452 905", FRE = "M488 905 C500 812 572 806 578 900 L590 1700";
/** Dedo de línea (cápsula con uña opcional). */
const dedo = (x1: number, y1: number, x2: number, y2: number, w: number, fill: string, una = false, key?: React.Key) => {
  const a = Math.atan2(y2 - y1, x2 - x1), ux = Math.cos(a), uy = Math.sin(a);
  return (
    <g key={key}>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={T} strokeWidth={w + 12} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={fill} strokeWidth={w} strokeLinecap="round" />
      {una && <ellipse cx={x2 - ux * w * 0.32} cy={y2 - uy * w * 0.32} rx={w * 0.32} ry={w * 0.24} transform={`rotate(${(a * 180) / Math.PI} ${x2 - ux * w * 0.32} ${y2 - uy * w * 0.32})`} fill="none" stroke={T} strokeWidth={3.5} />}
    </g>
  );
};
const flecha = (x: number, y: number, rot: number, o: number, col = NAR) => <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke={T} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 40 V-30 M-26 -6 L0 -34 L26 -6" stroke={col} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
/** Aparato de frenado asistido visto de canto (estrecho), con su mosquetón al anillo del arnés. La LEVA es la pieza gris del lado izquierdo:
 *  `pisa` la hunde (naranja), `bloquea` la gira para pellizcar la cuerda, `leva` fuerza su color. */
const Aparato: React.FC<{ pisa: number; bloquea: number; leva?: string }> = ({ pisa, bloquea, leva }) => (
  <g>
    {/* arnés: cinturón y anillo de aseguramiento (como en la lámina oficial) */}
    <path d="M-60 1160 Q260 1150 520 1250" fill="none" {...ln} strokeWidth={5} /><path d="M-60 1200 Q240 1196 470 1290" fill="none" {...ln} strokeWidth={5} />
    <path d="M430 1180 Q470 1230 440 1290 Q420 1320 404 1288" fill="#D9DDE2" {...ln} />
    {/* mosquetón de seguro */}
    <path d="M452 1048 Q490 1060 488 1110 L470 1196 Q462 1222 438 1214 Q418 1206 420 1180 L438 1080 Q442 1050 452 1048 Z" fill="none" stroke={T} strokeWidth={16} /><path d="M452 1048 Q490 1060 488 1110 L470 1196 Q462 1222 438 1214 Q418 1206 420 1180 L438 1080 Q442 1050 452 1048 Z" fill="none" stroke="#C7CDD4" strokeWidth={7} />
    <rect x={474} y={1112} width={20} height={44} rx={6} fill="#7E8A97" {...ln} strokeWidth={4} />
    {/* cuerpo (placa) */}
    <path d="M462 880 Q500 884 504 930 L500 1036 Q496 1066 470 1066 Q446 1064 446 1036 L448 930 Q450 884 462 880 Z" fill={GR} {...ln} />
    <path d="M470 900 Q490 904 492 930 L490 1020" stroke="#fff" strokeWidth={6} fill="none" opacity={0.5} strokeLinecap="round" />
    <circle cx={474} cy={1030} r={9} fill={GRO} {...ln} strokeWidth={4} />
    {/* leva (pieza lateral izquierda) */}
    <g transform={`rotate(${-7 * bloquea + 6 * pisa} 470 1010) translate(${-6 * pisa} ${4 * pisa})`}>
      <path d="M448 896 Q430 900 432 930 L436 1000 Q440 1016 452 1012 L456 930 Q458 906 448 896 Z" fill={leva ?? (pisa > 0.5 ? NAR : GRO)} {...ln} strokeWidth={5} />
    </g>
  </g>
);
/** Mano de freno de línea. `modo` "rapido": tres dedos en la cuerda, índice bajo el aparato, pulgar sobre la leva (`pisa`) ·
 *  "freno": puño en la cuerda de freno, más abajo (`dy` = sube al empujar cuerda) · `marca`: 1 dedos · 2 índice · 3 pulgar. */
const ManoFreno: React.FC<{ modo: "rapido" | "freno"; pisa?: number; marca?: number; dy?: number }> = ({ modo, pisa = 0, marca = 0, dy = 0 }) => {
  if (modo === "freno") {
    const y = 1330 - dy;
    return (
      <g>
        <path d={`M640 ${y + 40} L900 ${y + 360} L800 ${y + 430} L600 ${y + 110} Z`} fill={PIEL} {...ln} />
        <rect x={588} y={y - 70} width={110} height={150} rx={46} fill={PIEL} {...ln} />
        {[-38, -4, 30].map((d, i) => dedo(640, y + d, 562, y + d + 4, 30, PIEL, false, i))}
        {dedo(612, y - 60, 578, y - 112, 30, PIEL, true)}
      </g>
    );
  }
  const tx = 600 - (600 - (TAB0.x + 6)) * pisa, ty = 870 + (TAB0.y - 6 - 870) * pisa;
  return (
    <g>
      <path d="M680 1110 L960 1500 L860 1580 L620 1190 Z" fill={PIEL} {...ln} />
      <path d="M600 980 Q700 960 720 1060 Q736 1170 650 1190 Q590 1196 580 1120 Z" fill={PIEL} {...ln} />
      {dedo(626, 1010, 506, 1032, 30, marca === 2 ? NAR : PIEL, true)}
      {[1072, 1110, 1148].map((y, i) => dedo(640, y, 560, y + 4, 31, marca === 1 ? NAR : PIEL, false, i))}
      {dedo(616, 990, (616 + tx) / 2 + 14, (990 + ty) / 2 - 8, 36, marca === 3 || pisa > 0.5 ? NAR : PIEL)}
      {dedo((616 + tx) / 2 + 14, (990 + ty) / 2 - 8, tx, ty, 32, marca === 3 || pisa > 0.5 ? NAR : PIEL, true)}
      <path d="M676 1060 q14 40 0 96" stroke={T} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** Mano MAL: el puño envuelve el aparato entero (pulgar fijo sobre la leva) y nadie sujeta la cuerda de freno. */
const ManoMal: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(${Math.sin(f * 1.3) * 2} 0)`}>
    <path d="M700 1060 L980 1440 L880 1520 L640 1140 Z" fill={PIEL} {...ln} />
    <path d="M540 900 Q700 880 720 1000 Q736 1120 630 1140 Q540 1146 530 1060 Z" fill={PIEL} {...ln} />
    {[930, 972, 1014, 1056].map((y, i) => dedo(600, y, 430, y + 6, 32, PIEL, false, i))}
    {dedo(560, 900, TAB0.x + 8, TAB0.y - 8, 34, NAR, true)}
  </g>
);
/** Mano que sujeta la cuerda del escalador por encima del aparato (dar cuerda: tira hacia arriba). */
const ManoArriba: React.FC<{ dy?: number }> = ({ dy = 0 }) => {
  const y = 560 - dy, x = 380 + (452 - 380) * ((y - 120) / 785);
  return (
    <g>
      <path d={`M${x - 40} ${y - 30} L${x - 380} ${y - 280} L${x - 440} ${y - 180} L${x - 70} ${y + 50} Z`} fill={PIEL} {...ln} />
      <rect x={x - 70} y={y - 70} width={110} height={140} rx={44} fill={PIEL} {...ln} />
      {[-36, -2, 32].map((d, i) => dedo(x - 20, y + d, x + 58, y + d + 2, 30, PIEL, false, i))}
      {dedo(x - 30, y - 60, x + 30, y - 92, 30, PIEL, true)}
    </g>
  );
};
/** Puesto de aseguramiento en lámina de manual. `modo`: "mal" · "normal" (arriba tira, abajo empuja) · "rapido" · "solo".
 *  `corre` = cuerda que pasa (px) · `bloquea` 0–1 · `leva` color · `da` 0–1 = bombeo · `flechas` · `brilloFreno` · `etiqueta` = rótulo «LEVA». */
export const Puesto: React.FC<{ modo: "mal" | "normal" | "rapido" | "solo"; corre?: number; bloquea?: number; leva?: string; pisa?: number; marca?: number; da?: number; f?: number; brilloFreno?: number; flechas?: number; etiqueta?: number; sinArriba?: boolean }> = ({ sinArriba = false, modo, corre = 0, bloquea = 0, leva, pisa = 0, marca = 0, da = 0, f = 0, brilloFreno = 0, flechas = 0, etiqueta = 0 }) => {
  const cuelga = modo === "mal" ? Math.sin(f / 5) * 22 : 0, fre = modo === "mal" ? `M488 905 C500 812 572 806 578 900 Q${600 + cuelga} 1250 ${560 + cuelga * 2} 1700` : FRE;
  return (
    <g transform={`translate(540 990) scale(${ZS}) translate(${-ZX} ${-ZY})`}>
      {brilloFreno > 0 && <path d={FRE} stroke="#FFD24A" strokeWidth={90} fill="none" strokeLinecap="round" opacity={0.55 * brilloFreno} />}
      {cuerda(ESC, corre)}{cuerda(fre, -corre)}
      <Aparato pisa={modo === "mal" ? 1 : pisa} bloquea={bloquea} leva={leva} />
      {modo === "normal" && <>{!sinArriba && <ManoArriba dy={80 * da} />}<ManoFreno modo="freno" dy={160 * da} />{flechas > 0 && <>{flecha(240, 470, 0, flechas)}{flecha(700, 1170, 0, flechas)}</>}</>}
      {modo === "rapido" && <><ManoArriba dy={50 * pisa} /><ManoFreno modo="rapido" pisa={pisa} marca={marca} /></>}
      {modo === "mal" && <><ManoMal f={f} /><g opacity={0.6 + 0.4 * Math.sin(f / 4)}><ellipse cx={590} cy={1330} rx={86} ry={96} fill="none" stroke={ROJO} strokeWidth={11} strokeDasharray="22 16" /></g></>}
      {etiqueta > 0 && <g opacity={Math.min(1, etiqueta)}><path d={`M300 860 L${TAB0.x - 14} ${TAB0.y - 6}`} stroke={T} strokeWidth={6} strokeLinecap="round" /><rect x={130} y={812} width={180} height={70} rx={20} fill={T} /><text x={220} y={862} textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={46} fill="#fff">LEVA</text></g>}
    </g>
  );
};
/** Fondo de los primeros planos (sala desenfocada). */
export const PP: React.FC<{ sh?: number; tinte?: string; children: React.ReactNode }> = ({ sh = 0, tinte, children }) => (
  <AbsoluteFill style={{ background: tinte === "#5A3B3B" ? "#F6DDD5" : "#F3EFE8", transform: `translate(${sh}px, ${Math.abs(sh) * 0.6}px)` }}><Svg>{children}</Svg></AbsoluteFill>
);
