// KIT · PRIMEROS PLANOS (coordenadas propias, origen en el centro de la pieza; se colocan con x, y, s, rot):
// mano que agarra, aparato de asegurar, nudo de ocho y mosquetón de seguro. Mismo estilo: forma gruesa, contorno oscuro, color plano.
import React from "react";
import { C, PC } from "./base";
import { formaMosq } from "./Cuerda";

const T = PC.tinta;
const barra = (x1: number, y1: number, x2: number, y2: number, w: number, fill: string, key?: React.Key) => (
  <g key={key}><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={T} strokeWidth={w + 14} strokeLinecap="round" /><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={fill} strokeWidth={w} strokeLinecap="round" /></g>
);
/** Trozo de cuerda gruesa de primer plano entre dos puntos (o una curva `d`). */
export const CuerdaGrande: React.FC<{ d: string; w?: number; tensa?: number }> = ({ d, w = 40, tensa = 0 }) => (
  <g>
    <path d={d} stroke={C.cuerdaS} strokeWidth={w + 12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke="#FFB27F" strokeWidth={w * 0.18} fill="none" strokeDasharray={`${w * 0.7} ${w * 0.8}`} opacity={0.7} />
    {tensa > 0 && <path d={d} stroke="#fff" strokeWidth={w * 0.3} fill="none" opacity={0.5 * tensa} strokeLinecap="round" />}
  </g>
);
/** MANO de perfil que agarra lo que pase por su centro (cuerda, cinta, mosquetón): pásalo como hijo y queda ENTRE la palma y los dedos.
 *  `cierra` 0 = abierta (dedos estirados hacia +x) · 1 = puño cerrado. El antebrazo entra desde la izquierda-abajo; gira con `rot`, espeja con `espejo`. */
export const Agarre: React.FC<{ x: number; y: number; s?: number; rot?: number; espejo?: boolean; cierra?: number; piel?: string; pielS?: string; manga?: string; tiembla?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, espejo, cierra = 1, piel = "#D9A57C", pielS = "#B6835C", manga = "#C9A23C", tiembla = 0, children }) => {
  const l = (a: number, b: number) => a + (b - a) * cierra;
  return (
    <g transform={`translate(${x + tiembla} ${y}) rotate(${rot}) scale(${espejo ? -s : s} ${s})`}>
      {barra(-330, 150, -120, 40, 96, manga)}
      {barra(-150, 56, -70, 14, 78, piel)}
      <rect x={-84} y={-76} width={128} height={152} rx={44} fill={piel} stroke={T} strokeWidth={14} />
      <path d="M-60 40 Q-20 66 20 44" stroke={pielS} strokeWidth={8} fill="none" strokeLinecap="round" />
      {children && <g transform={`scale(${espejo ? -1 / s : 1 / s} ${1 / s}) rotate(${-rot})`}>{children}</g>}
      {[-54, -18, 18, 52].map((yy, i) => barra(l(30, -34), yy, l(150 - Math.abs(i - 1.2) * 16, 44), yy + l(0, i * 2 - 3), 30, piel, i))}
      {[-54, -18, 18, 52].map((yy, i) => <path key={i} d={`M${l(96, 20)} ${yy - 10} v20`} stroke={pielS} strokeWidth={5} strokeLinecap="round" opacity={0.8} />)}
      {barra(l(-50, -48), l(-70, -64), l(-10, 34), l(-140, -86), 34, piel)}
    </g>
  );
};
/** APARATO de asegurar de frenado asistido en primer plano, colgado del anillo del arnés con su mosquetón de seguro.
 *  La cuerda entra por arriba (hacia quien escala) y sale abajo a la izquierda (lado de FRENO: ahí va la mano). `bloquea` 0–1 = la leva gira y pellizca · `leva` = color de la leva (verde frena / rojo retenida) · `corre` = desplazamiento de la cuerda (px). */
export const AparatoGrande: React.FC<{ x: number; y: number; s?: number; bloquea?: number; rosca?: number; corre?: number; color?: string; leva?: string }> = ({ x, y, s = 1, bloquea = 0, rosca = 1, corre = 0, color = "#5C7FA8", leva }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 330 Q0 250 0 200" stroke={T} strokeWidth={70} strokeLinecap="round" /><path d="M-10 330 Q0 250 0 200" stroke="#B4553C" strokeWidth={54} strokeLinecap="round" />
    <g transform="translate(0 150) scale(0.95)">{formaMosq(0, "der", rosca)}</g>
    <g>
      <path d={`M120 -420 Q70 -200 34 -70 Q10 0 -40 20 Q-150 60 -260 250`} stroke={C.cuerdaS} strokeWidth={52} fill="none" strokeLinecap="round" />
      <path d={`M120 -420 Q70 -200 34 -70 Q10 0 -40 20 Q-150 60 -260 250`} stroke={C.cuerda} strokeWidth={40} fill="none" strokeLinecap="round" />
      <path d={`M120 -420 Q70 -200 34 -70 Q10 0 -40 20 Q-150 60 -260 250`} stroke="#FFB27F" strokeWidth={7} fill="none" strokeDasharray="28 32" strokeDashoffset={-corre} opacity={0.7} />
    </g>
    <rect x={-92} y={-120} width={184} height={200} rx={46} fill={color} stroke={T} strokeWidth={14} />
    <path d="M-60 -84 Q0 -104 60 -84" stroke="#fff" strokeWidth={8} fill="none" opacity={0.35} strokeLinecap="round" />
    <g transform={`translate(22 -24) rotate(${-34 * bloquea})`}><ellipse cx={-14} cy={0} rx={50} ry={34} fill={leva ?? (bloquea > 0.5 ? PC.miedo : "#2B3039")} stroke={T} strokeWidth={10} /><circle cx={10} cy={0} r={10} fill="#C9D1D8" /></g>
    {barra(-70, 60, -150 - 20 * bloquea, 20 - 60 * bloquea, 22, "#2B3039")}
    <circle cx={0} cy={62} r={16} fill="#2B3039" />
  </g>
);
const OCHO = "M0 -170 C84 -170 84 -62 0 -62 C-84 -62 -84 46 0 46 C84 46 84 -62 0 -62 C-84 -62 -84 -170 0 -170";
/** NUDO DE OCHO en el arnés, en primer plano. `repaso` 0–1 = cuánto del ocho está repasado (1 = nudo terminado, con su cabo sobrante).
 *  Con `repaso` < 1 es el error clásico: nudo a medias. `aprieta` 0–1 lo estira (carga). */
export const OchoGrande: React.FC<{ x: number; y: number; s?: number; repaso?: number; aprieta?: number; arnes?: string }> = ({ x, y, s = 1, repaso = 1, aprieta = 0, arnes = "#B4553C" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-46, 250], [46, 250]].map(([dx, dy], i) => <g key={i}><path d={`M${dx} ${dy + 90} Q${dx * 1.6} ${dy} ${dx * 0.3} ${dy - 60}`} stroke={T} strokeWidth={60} fill="none" strokeLinecap="round" /><path d={`M${dx} ${dy + 90} Q${dx * 1.6} ${dy} ${dx * 0.3} ${dy - 60}`} stroke={arnes} strokeWidth={44} fill="none" strokeLinecap="round" /></g>)}
    <CuerdaGrande d="M90 -470 Q40 -300 0 -170" w={34} tensa={aprieta} />
    <CuerdaGrande d="M0 46 Q-40 120 0 200 Q40 260 0 300" w={34} />
    <g transform={`scale(${1 - aprieta * 0.12} ${1 + aprieta * 0.1})`}>
      <path d={OCHO} stroke={C.cuerdaS} strokeWidth={46} fill="none" /><path d={OCHO} stroke={C.cuerda} strokeWidth={34} fill="none" />
      <g transform="translate(13 9)">
        <path d={OCHO} pathLength={1} strokeDasharray={`${repaso} 1`} stroke={C.cuerdaS} strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d={OCHO} pathLength={1} strokeDasharray={`${repaso} 1`} stroke="#FF9A4A" strokeWidth={34} fill="none" strokeLinecap="round" />
      </g>
      <path d={OCHO} stroke="#FFB27F" strokeWidth={6} fill="none" strokeDasharray="24 26" opacity={0.6} />
    </g>
    {repaso > 0.97 && <CuerdaGrande d="M-10 -176 Q-70 -230 -110 -300" w={34} />}
  </g>
);
/** MOSQUETÓN DE SEGURO en primer plano. `rosca` 0 = abierto (rojo) · 1 = cerrado (azul). `abre` 0–1 = gatillo cediendo. */
export const MosquetonGrande: React.FC<{ x: number; y: number; s?: number; rot?: number; abre?: number; rosca?: number; gatillo?: "izq" | "der" }> = ({ x, y, s = 1, rot = 0, abre = 0, rosca, gatillo = "der" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>{formaMosq(abre, gatillo, rosca)}</g>
);
