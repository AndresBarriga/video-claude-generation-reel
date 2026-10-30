// E35 «Grossglockner – ¿Te quedas?» (Decisiones límite #2). Piezas comunes.
// Idea visual: la manta térmica dorada siempre en SU mochila (el objeto que acusa); a ella se le va el color.
import React from "react";
import { random, spring, useCurrentFrame } from "remotion";
import type { Aspecto } from "../../piezas/Rasgos";
import { fuenteTitulo, fuenteTexto } from "../../tema";
export { C, Camara, Svg, Zoom, Cuerda, Etiqueta, type P } from "../Pegue/comun";

export const PG = { noche: "#070E1C", nocheB: "#14254A", roca: "#2A3448", rocaL: "#3B4862", nieve: "#C9D6E6", nieveS: "#8FA2BC", dia: "#7FB0DA", diaB: "#DDEBF4", oro: "#E8B83A", oroL: "#FFE38A", gris: "#9AA3AD" };

/** Reparto: él (experto) y ella. Sin nombres. */
export const EL: Aspecto = { chaqueta: "#2F5F86", chaquetaSombra: "#21445F", pantalon: "#2B3442", casco: "#F2C230", pelo: "#3B2A20" };
export const ELLA: Aspecto = { chaqueta: "#8A4E9C", chaquetaSombra: "#653872", pantalon: "#39424F", casco: "#EEF1F4", pelo: "#5A3A24", peinado: "coleta", piel: "#EBC3A0", pielSombra: "#C99B78" };

/** Mezcla un color con el gris de la escarcha (t = 0 → original, 1 → gris). */
export const agris = (hex: string, t: number, g = PG.gris) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = p(hex), b = p(g);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
export const ellaGris = (t: number): Aspecto => ({ ...ELLA, chaqueta: agris(ELLA.chaqueta!, t), chaquetaSombra: agris(ELLA.chaquetaSombra!, t), piel: agris(ELLA.piel!, t, "#AEB7C1"), pielSombra: agris(ELLA.pielSombra!, t, "#8E98A4"), casco: agris(ELLA.casco!, t, "#DCE6EE") });

export const CieloNoche: React.FC<{ id?: string; estrellas?: boolean }> = ({ id = "gn", estrellas = true }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PG.noche} /><stop offset="1" stopColor={PG.nocheB} /></linearGradient></defs>
    <rect x={-400} y={-600} width={1900} height={3200} fill={`url(#${id})`} />
    {estrellas && Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={random(`ex${i}`) * 1080} cy={random(`ey${i}`) * 900} r={1 + random(`er${i}`) * 2.2} fill="#fff" opacity={0.3 + random(`eo${i}`) * 0.6} />)}
  </>
);

/** Copos con viento. */
export const Viento: React.FC<{ n?: number; fuerza?: number; op?: number }> = ({ n = 70, fuerza = 1, op = 0.7 }) => {
  const f = useCurrentFrame();
  return <g>{Array.from({ length: n }).map((_, i) => { const x = ((random(`vx${i}`) * 1400 + f * (14 + random(`vv${i}`) * 10) * fuerza) % 1400) - 200, y = (random(`vy${i}`) * 1920 + f * 3) % 1920; return <ellipse key={i} cx={x} cy={y} rx={2 + 6 * fuerza} ry={2} fill="#fff" opacity={op * (0.4 + random(`vo${i}`) * 0.6)} />; })}</g>;
};

/** Arista (cresta) de primer plano: perfil dentado; devuelve el y del suelo en x. */
export const sueloY = (x: number, base = 1250) => base - 0.22 * (x - 540) + 18 * Math.sin(x / 40) + 10 * Math.sin(x / 13);
export const Arista: React.FC<{ base?: number; color?: string; nieve?: boolean }> = ({ base = 1250, color = PG.roca, nieve = true }) => {
  const pts: string[] = []; for (let x = -100; x <= 1180; x += 20) pts.push(`${x} ${sueloY(x, base)}`);
  return (
    <g>
      <path d={`M-100 2200 L${pts.join(" L")} L1180 2200 Z`} fill={color} />
      {nieve && <path d={`M${pts.join(" L")}`} stroke={PG.nieve} strokeWidth={14} fill="none" strokeLinejoin="round" opacity={0.85} />}
      {Array.from({ length: 12 }).map((_, i) => { const x = 40 + i * 90; return <path key={i} d={`M${x} ${sueloY(x, base) + 40} l30 60 l-20 50`} stroke={PG.rocaL} strokeWidth={6} fill="none" />; })}
    </g>
  );
};

/** Cruz de la cumbre (dibujo genérico) en (x, y). */
export const CruzCumbre: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#C9D6E6" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}><rect x={-5} y={-90} width={10} height={90} /><rect x={-28} y={-70} width={56} height={9} /></g>
);

/** Cono de luz de un frontal: desde (x, y) hacia el ángulo `ang` (grados, 0 = derecha). */
export const Frontal: React.FC<{ x: number; y: number; ang?: number; largo?: number; op?: number }> = ({ x, y, ang = 20, largo = 420, op = 1 }) => (
  <g opacity={op}>
    <defs><radialGradient id={`fr${Math.round(x)}${Math.round(y)}`} cx="0" cy="0.5" r="1"><stop offset="0" stopColor="#FFF6D0" stopOpacity={0.55} /><stop offset="1" stopColor="#FFF6D0" stopOpacity={0} /></radialGradient></defs>
    <g transform={`translate(${x} ${y}) rotate(${ang})`}><path d={`M0 -6 L${largo} ${-largo * 0.32} L${largo} ${largo * 0.32} L0 6 Z`} fill={`url(#fr${Math.round(x)}${Math.round(y)})`} /></g>
    <circle cx={x} cy={y} r={9} fill="#FFF6D0" /><circle cx={x} cy={y} r={20} fill="#FFF6D0" opacity={0.3} />
  </g>
);

/** Manta térmica plegada (dorada, con brillo) — va en SU mochila. */
export const Manta: React.FC<{ x: number; y: number; s?: number; desplegada?: boolean }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame(), brillo = (Math.sin(f / 6) + 1) / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 -18 L22 -24 L28 16 L-22 22 Z" fill={PG.oro} stroke="#7A5A10" strokeWidth={3} />
      <path d="M-14 -16 L-10 18 M2 -20 L6 20" stroke="#B8891E" strokeWidth={2} />
      <path d="M-20 -10 L16 -16" stroke={PG.oroL} strokeWidth={5} strokeLinecap="round" opacity={0.4 + 0.6 * brillo} />
    </g>
  );
};

/** Sello de webcam: REC parpadeando + lugar + hora. */
export const SelloWebcam: React.FC<{ hora: string }> = ({ hora }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 1330, left: 60, right: 60, display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontWeight: 700, fontSize: 40, color: "#E8F0E8", textShadow: "0 0 6px #000" }}>
      <span><span style={{ color: "#FF3B30", opacity: Math.floor(f / 15) % 2 ? 1 : 0.2 }}>●</span> REC · GROSSGLOCKNER</span><span>{hora}</span>
    </div>
  );
};

/** Hora grande arriba (22:00, 02:00, 03:30). */
export const Hora: React.FC<{ t?: string }> = ({ t }) => {
  const f = useCurrentFrame(), k = spring({ frame: f, fps: 30, config: { damping: 12, stiffness: 200 } });
  if (!t) return null;
  return <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontWeight: 800, fontSize: 120, color: "#fff", transform: `scale(${0.7 + 0.3 * k})`, textShadow: "0 4px 18px #000c", letterSpacing: 6 }}>{t}</div>;
};

/** Grano de webcam + tinte verdoso + líneas. */
export const Webcamizar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(80,140,90,0.16)", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)", transform: `translateY(${f % 5}px)` }} />
    </div>
  );
};
export const T = { fuenteTitulo, fuenteTexto };
