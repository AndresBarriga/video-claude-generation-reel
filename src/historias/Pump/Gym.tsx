// Rocódromo de deportiva con desplome (otra pared y otro escalador que La puerta). Escalador de frente con la rig de Puerta/Frente.
import React from "react";
import { random } from "remotion";
import { Resina } from "../../piezas/Rocodromo";
import { Frente, type V } from "../Puerta/Frente";
export type { V };

export const GY = { pared: "#2C4A4E", paredS: "#22393D", techo: "#122024", mat: "#2C5D86", ruta: "#E8C547", chaqueta: "#46556B", chaquetaS: "#2F3B4E", gorro: "#D9A21B" };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpV = (a: V, b: V, t: number): V => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Pared con desplome: costuras que se abren hacia arriba, techo con sombra, presas de la ruta (amarillas) y de otras vías (apagadas). */
export const FondoGym: React.FC<{ fuerte?: number; mat?: boolean; ruta?: boolean }> = ({ fuerte = 0.3, mat = false, ruta = true }) => {
  const abre = 40 + 150 * fuerte, tecY = 170 + 150 * fuerte;
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2500} fill={GY.pared} />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${540 + i * 170} 1960 L${540 + i * (170 + abre)} -80`} stroke={GY.paredS} strokeWidth={8} />)}
      {[420, 860, 1300, 1740].map((y, k) => <path key={y} d={`M-200 ${y} Q540 ${y - 22 - k * 6} 1280 ${y}`} stroke={GY.paredS} strokeWidth={8} fill="none" />)}
      {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={random(`gx${i}`) * 1080} cy={300 + random(`gy${i}`) * 1400} rx={22 + random(`gr${i}`) * 14} ry={16 + random(`gr${i}`) * 10} fill={["#C8566B", "#4F7FC9", "#E8E4DA", "#6FA34A"][i % 4]} opacity={0.4} />)}
      {ruta && [[440, 700], [640, 690], [420, 1090], [660, 1010], [470, 1330], [610, 1350]].map(([x, y], i) => <Resina key={i} x={x} y={y} r={34} c={GY.ruta} seed={`gr${i}`} magnesio={0.8} />)}
      <defs><linearGradient id="sombraTecho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.62" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient></defs>
      <rect x={-100} y={tecY - 20} width={1280} height={360} fill="url(#sombraTecho)" />
      <path d={`M-100 -100 L1180 -100 L1180 ${tecY} Q540 ${tecY + 70 + fuerte * 60} -100 ${tecY} Z`} fill={GY.techo} />
      <path d={`M-100 ${tecY} Q540 ${tecY + 70 + fuerte * 60} 1180 ${tecY}`} stroke="#3C5A60" strokeWidth={10} fill="none" />
      {mat && <g><rect x={-100} y={1560} width={1280} height={500} fill={GY.mat} /><path d="M-100 1560 L1180 1560" stroke="#1B3E5C" strokeWidth={12} />{[220, 540, 860].map((x) => <path key={x} d={`M${x} 1560 L${x} 2000`} stroke="#1B3E5C" strokeWidth={6} />)}</g>}
    </g>
  );
};

/** Cuerda naranja del perno al arnés; `flojo` 0 = tensa, 1 = con mucha vuelta. */
export const Cuerda: React.FC<{ perno: V; arnes: V; flojo?: number }> = ({ perno, arnes, flojo = 0.4 }) => {
  const mx = (perno[0] + arnes[0]) / 2 + 110 * flojo, my = (perno[1] + arnes[1]) / 2;
  return (
    <g>
      <path d={`M${perno} Q${mx} ${my} ${arnes}`} stroke="#B8460E" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M${perno} Q${mx} ${my} ${arnes}`} stroke="#FF6A1F" strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={perno[0]} cy={perno[1]} r={20} fill="#AEB8C4" stroke="#141B26" strokeWidth={6} />
    </g>
  );
};

/** Posiciones de las presas de mano de la ruta (último tramo) y alturas del cuerpo para brazos doblados o estirados. */
export const MANOS: { L: V; R: V } = { L: [440, 700], R: [640, 690] };
export const ESC = 1.5;
export const cyDoblado = 993, cyEstirado = 1073;
export const Esc: React.FC<Parameters<typeof Frente>[0]> = (p) => <Frente s={ESC} trenza={false} chaqueta={GY.chaqueta} chaquetaS={GY.chaquetaS} gorro={GY.gorro} {...p} />;

/** Viñeta fija sobre la imagen (fuera de los zooms, para que no se encoja). */
export const Vig: React.FC = () => (
  <g><defs><radialGradient id="vigG" cx="50%" cy="50%" r="78%"><stop offset="58%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.5" /></radialGradient></defs><rect x={0} y={0} width={1080} height={1920} fill="url(#vigG)" /></g>
);
/** Zoom de cámara alrededor de (ox, oy). */
export const Zoom: React.FC<{ z: number; ox?: number; oy?: number; children: React.ReactNode }> = ({ z, ox = 540, oy = 1000, children }) => <g transform={`translate(${ox} ${oy}) scale(${z}) translate(${-ox} ${-oy})`}>{children}</g>;
