// E30 «El que da beta siempre tiene razón»: piezas comunes. Vía deportiva en caliza naranja con chorreras grises.
// Idea visual: los globos de beta se amontonan sobre ti; tu pareja asegura callada en todos los planos (el remate).
import React from "react";
import { random, spring, useCurrentFrame } from "remotion";
import type { Aspecto } from "../../piezas/Rasgos";
import { fuenteTitulo, fuenteTexto } from "../../tema";
export { C, Camara, Svg, Zoom, Cuerda, type P } from "../Pegue/comun";

export const PB = { cieloA: "#6FA3D0", cieloB: "#E4EEF4", roca: "#D98A4E", rocaS: "#B8693A", rocaL: "#EBA66C", chorrera: "#8E9398", suelo: "#9C8466", sueloS: "#86704F", pino: "#3D5A3F" };

/** Reparto (silueta y cara distintas). `col` = color de su globo. */
export const REPARTO = {
  tu: { aspecto: { chaqueta: "#5E7D4E", chaquetaSombra: "#43593A", pantalon: "#2E3A4A", casco: "#EEF1F4", piel: "#D9A37A", pielSombra: "#B8845E" } as Aspecto, col: "#5E7D4E" },
  veterano: { aspecto: { chaqueta: "#7A5638", chaquetaSombra: "#5A3F28", pantalon: "#4A4F3C", casco: null, gorro: "#2F4A6E", barba: "#C9CDD2", pelo: "#C9CDD2", gafas: true, piel: "#E9B990", pielSombra: "#C9926A", arnes: false } as Aspecto, cuerpo: { torso: 66, grosor: 1.15 }, col: "#7A5638" },
  nuevo: { aspecto: { chaqueta: "#3B7FC4", chaquetaSombra: "#2B5E92", pantalon: "#2B3442", casco: null, peinado: "corto" as const, pelo: "#C88A3A", piel: "#F0C8A8", pielSombra: "#D4A584", arnes: false } as Aspecto, cuerpo: { torso: 40, grosor: 0.8 }, col: "#3B7FC4" },
  animador: { aspecto: { chaqueta: "#E0645A", chaquetaSombra: "#B04A42", pantalon: "#39424F", casco: null, peinado: "coleta" as const, pelo: "#1A1210", piel: "#8A5A3B", pielSombra: "#6E452C", arnes: false } as Aspecto, cuerpo: { torso: 50 }, col: "#E0645A" },
  pareja: { aspecto: { chaqueta: "#C9962E", chaquetaSombra: "#946C1E", pantalon: "#2E3A4A", casco: null, peinado: "trenzas" as const, pelo: "#3B2A20", piel: "#C98E62", pielSombra: "#A8714A" } as Aspecto, col: "#C9962E" },
};

export const Cielo: React.FC = () => (
  <>
    <defs><linearGradient id="bcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PB.cieloA} /><stop offset="1" stopColor={PB.cieloB} /></linearGradient></defs>
    <rect x={-400} y={-600} width={1900} height={3200} fill="url(#bcielo)" />
  </>
);

/** Pared de caliza naranja con chorreras grises y un desplome suave arriba. x0 = canto. */
export const ParedNaranja: React.FC<{ x0: number }> = ({ x0 }) => {
  const canto = (y: number) => x0 - Math.max(0, (700 - y) * 0.12) + 6 * Math.sin(y / 70);
  const pts: string[] = []; for (let y = -600; y <= 2400; y += 20) pts.push(`${canto(y)} ${y}`);
  return (
    <g>
      <defs><linearGradient id="pn" x1="0" x2="1"><stop offset="0" stopColor={PB.rocaL} /><stop offset="0.3" stopColor={PB.roca} /><stop offset="1" stopColor={PB.rocaS} /></linearGradient></defs>
      <path d={`M${pts.join(" L")} L1600 2400 L1600 -600 Z`} fill="url(#pn)" />
      {Array.from({ length: 6 }).map((_, i) => { const x = x0 + 70 + i * 90 + random(`ch${i}`) * 40; return <path key={i} d={`M${x} -600 Q${x + 20 - random(`cq${i}`) * 40} 600 ${x + 10} 1500 L${x + 34} 1500 Q${x + 44} 600 ${x + 30} -600 Z`} fill={PB.chorrera} opacity={0.35 + random(`co${i}`) * 0.25} />; })}
      {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={x0 + 30 + random(`hx${i}`) * 500} cy={-500 + random(`hy${i}`) * 2700} rx={6 + random(`hr${i}`) * 10} ry={4 + random(`hs${i}`) * 5} fill={PB.rocaS} opacity={0.55} />)}
      <path d={`M${pts.join(" L")}`} stroke="#000" strokeOpacity={0.2} strokeWidth={8} fill="none" />
    </g>
  );
};

/** Chapa con cinta exprés (o reunión de dos chapas con cadena). */
export const Chapa: React.FC<{ x: number; y: number; reunion?: boolean }> = ({ x, y, reunion }) => (
  <g transform={`translate(${x} ${y})`}>
    {reunion ? (
      <g><circle cx={-18} r={9} fill="#AEB8C4" /><circle cx={18} r={9} fill="#AEB8C4" /><path d="M-18 6 Q0 34 18 6" stroke="#AEB8C4" strokeWidth={5} fill="none" /><circle cx={0} cy={26} r={8} fill="none" stroke="#AEB8C4" strokeWidth={5} /></g>
    ) : (
      <g><circle r={8} fill="#AEB8C4" /><rect x={-6} y={8} width={12} height={36} rx={6} fill="#E0645A" /><ellipse cx={0} cy={54} rx={11} ry={14} fill="none" stroke="#AEB8C4" strokeWidth={5} /></g>
    )}
  </g>
);

/** Globo de diálogo con el color de quien habla. (x, y) = punta del rabo (sobre su cabeza). */
export const Globo: React.FC<{ texto: string; x: number; y: number; col: string; desde?: number; ancho?: number; dy?: number; tam?: number; o?: number }> = ({ texto, x, y, col, desde = 0, ancho = 460, dy = 40, tam = 58, o = 1 }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - desde, fps: 30, config: { damping: 11, stiffness: 220 } });
  if (f < desde) return null;
  const left = Math.max(30, Math.min(1080 - 30 - ancho, x - ancho / 2));
  return (
    <div style={{ position: "absolute", left, width: ancho, bottom: 1920 - y + dy, transform: `scale(${k})`, transformOrigin: `${x - left}px 100%`, opacity: o }}>
      <div style={{ background: "#fff", border: `8px solid ${col}`, borderRadius: 38, padding: "16px 24px", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: tam, lineHeight: 1.05, color: "#0B1624", textAlign: "center", boxShadow: "0 8px 0 #0003" }}>{texto}</div>
      <div style={{ position: "absolute", left: x - left - 18, bottom: -dy + 6, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `${dy}px solid ${col}` }} />
    </div>
  );
};

export const fuentes = { fuenteTitulo, fuenteTexto };
