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

/* ---------- Apoyo en el suelo (nadie flota) ---------- */
const rad = (g: number) => (g * Math.PI) / 180;
type Pierna = [number, number];
/** Suela de un pie (relativa a la cadera, sin escalar) para los ángulos de una pierna. */
export const suela = (p: Pierna): [number, number] => {
  const rx = Math.sin(rad(p[0])) * 66, ry = Math.cos(rad(p[0])) * 66;
  const tx = rx + Math.sin(rad(p[1])) * 64, ty = ry + Math.cos(rad(p[1])) * 64;
  return [tx + Math.sin(rad(p[1] + 90)) * 11, ty + 11];
};
/** y de la cadera para que el pie más bajo toque la arista (base = la de <Arista>). */
export const caderaApoyada = (x: number, s: number, a: Pierna, b: Pierna, mira: 1 | -1 = 1, base = 1250) =>
  Math.min(...[a, b].map((p) => { const [fx, fy] = suela(p); return sueloY(x + fx * s * mira, base) - fy * s; }));
/** Ciclo de paso (k = fase 0–1): piernas, brazos y torso. */
export const paso = (k: number, inclina = -10) => {
  const w = Math.sin(k * 2 * Math.PI), w2 = Math.cos(k * 2 * Math.PI);
  return { torso: inclina, piernaA: [10 + 22 * w, -4 - 18 * Math.max(0, w2)] as Pierna, piernaB: [10 - 22 * w, -4 - 18 * Math.max(0, -w2)] as Pierna, brazoA: [-20 * w, -6] as Pierna, brazoB: [20 * w, -2] as Pierna };
};

/** Roca para sentarse (cima en (x, y)). */
export const Roca: React.FC<{ x: number; y: number; w?: number; nieve?: boolean }> = ({ x, y, w = 150, nieve = true }) => (
  <g>
    <path d={`M${x - w / 2 - 20} ${y + 120} L${x - w / 2} ${y + 40} L${x - w / 3} ${y + 4} Q${x - 10} ${y - 16} ${x + w / 4} ${y - 2} L${x + w / 2 + 6} ${y + 30} L${x + w / 2 + 24} ${y + 120} Z`} fill={PG.rocaL} stroke="#0B1624" strokeWidth={6} />
    <path d={`M${x - w / 4} ${y + 30} l20 40 M${x + w / 6} ${y + 20} l-10 50`} stroke={PG.roca} strokeWidth={6} fill="none" />
    {nieve && <path d={`M${x - w / 2 + 16} ${y + 8} Q${x} ${y - 16} ${x + w / 2 - 12} ${y + 4}`} stroke={PG.nieve} strokeWidth={10} fill="none" strokeLinecap="round" />}
  </g>
);

/** Vaho que sale de la boca; `fuerza` 0–1 (0 = ya no sale). */
export const Vaho: React.FC<{ x: number; y: number; fuerza: number; dir?: 1 | -1 }> = ({ x, y, fuerza, dir = 1 }) => {
  const f = useCurrentFrame(), c = (f % 40) / 40;
  if (fuerza <= 0.02) return null;
  return <g opacity={(1 - c) * 0.8 * fuerza}>{[0, 1, 2].map((i) => <ellipse key={i} cx={x + dir * (10 + c * 70 * fuerza + i * 14)} cy={y - c * 20 - i * 4} rx={(8 + i * 6) * (0.4 + c) * fuerza} ry={(6 + i * 4) * (0.4 + c) * fuerza} fill="#F4F9FF" />)}</g>;
};

/** Chova piquigualda (detalle secundario): curiosea dando saltitos. */
export const Chova: React.FC<{ x: number; y: number; s?: number; mira?: 1 | -1 }> = ({ x, y, s = 1, mira = 1 }) => {
  const f = useCurrentFrame(), salto = Math.max(0, Math.sin(f / 5)) * 10, pico = Math.sin(f / 3) > 0.6 ? 6 : 0;
  return (
    <g transform={`translate(${x} ${y - salto}) scale(${s * mira} ${s})`}>
      <ellipse cx={0} cy={-20} rx={26} ry={16} fill="#141B26" />
      <circle cx={20} cy={-36} r={12} fill="#141B26" />
      <path d={`M30 ${-38 + pico / 2} L46 ${-34 + pico} L30 -31 Z`} fill="#F2C230" />
      <circle cx={23} cy={-39} r={3} fill="#fff" />
      <path d="M-26 -20 L-44 -10 L-26 -12 Z" fill="#141B26" />
      <path d="M-4 -6 L-6 4 M6 -6 L8 4" stroke="#E0645A" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** Macizo con la cumbre: pico nevado con masa que nace del suelo (no flota), aristas, sombra y la cruz arriba. (cx, cimaY) = cumbre. */
export const Pico: React.FC<{ cx: number; cimaY: number; base?: number; ancho?: number; noche?: boolean }> = ({ cx, cimaY, base = 1500, ancho = 900, noche = true }) => {
  const roca = noche ? "#27324A" : "#7E8B9E", rocaS = noche ? "#1B2438" : "#62708A", nieve = noche ? "#B9C8DC" : "#F2F6FA";
  const izq = cx - ancho / 2, der = cx + ancho / 2;
  return (
    <g>
      <path d={`M${izq} ${base} L${cx - 150} ${cimaY + 260} L${cx - 60} ${cimaY + 110} L${cx} ${cimaY} L${cx + 70} ${cimaY + 120} L${cx + 190} ${cimaY + 300} L${der} ${base} Z`} fill={roca} />
      <path d={`M${cx} ${cimaY} L${cx + 70} ${cimaY + 120} L${cx + 190} ${cimaY + 300} L${der} ${base} L${cx + 40} ${base} L${cx + 20} ${cimaY + 200} Z`} fill={rocaS} />
      <path d={`M${cx - 60} ${cimaY + 110} L${cx} ${cimaY} L${cx + 70} ${cimaY + 120} L${cx + 40} ${cimaY + 150} L${cx + 10} ${cimaY + 90} L${cx - 20} ${cimaY + 160} Z`} fill={nieve} />
      <path d={`M${cx - 150} ${cimaY + 260} L${cx - 110} ${cimaY + 230} L${cx - 90} ${cimaY + 290} M${cx + 120} ${cimaY + 200} L${cx + 150} ${cimaY + 240}`} stroke={nieve} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      <CruzCumbre x={cx} y={cimaY + 2} s={0.55} color={noche ? "#DCE6EE" : "#3A4656"} />
    </g>
  );
};

/** Cabeza de ella (para Escalador `Cabeza`): melena larga en coleta que cae por la espalda, pestañas, labios; casco blanco.
 *  `helada` 0–1: piel gris azulada, labios morados, escarcha en cejas, pestañas y casco. */
export const cabezaElla = (helada = 0) => {
  const C: React.FC<{ cara: import("../../piezas/Escalador").Cara }> = ({ cara }) => {
    const piel = agris("#EBC3A0", helada, "#A9B6C4"), pielS = agris("#C99B78", helada, "#8794A4"), pelo = agris("#5A3A24", helada * 0.6, "#8C96A2");
    const labio = agris("#C46A6A", helada, "#6E6A9C"), T = "#141B26", cerrados = cara === "cerrados" || helada > 0.5;
    return (
      <g>
        {/* melena larga: coleta gruesa que cae por la espalda */}
        <path d="M-24 -6 C-46 10 -50 46 -40 84 C-34 104 -22 112 -16 100 C-24 70 -20 36 -6 14 Z" fill={pelo} stroke={T} strokeWidth={3} />
        <circle r={30} fill={piel} />
        <path d="M-30 2 A30 30 0 0 0 -6 30" fill={pielS} opacity={0.6} />
        {/* flequillo bajo el casco */}
        <path d="M-26 -8 Q-8 -2 6 -12 Q14 -4 26 -10 L26 -18 L-26 -18 Z" fill={pelo} />
        {/* casco */}
        <path d="M-35 -8 A35 35 0 0 1 35 -8 L42 -4 L-35 -2 Z" transform="translate(0 -6)" fill={agris("#EEF1F4", helada * 0.3, "#DCE6EE")} />
        {/* ojos con pestañas */}
        {cerrados
          ? <path d="M-1 6 Q6 10 13 6 M17 6 Q23 10 29 6" stroke={T} strokeWidth={3} fill="none" strokeLinecap="round" />
          : <g><ellipse cx={6} cy={4} rx={5} ry={7} fill="#fff" /><ellipse cx={22} cy={4} rx={5} ry={7} fill="#fff" /><circle cx={7} cy={5} r={3} fill={T} /><circle cx={23} cy={5} r={3} fill={T} /></g>}
        <path d="M1 1 L-2 -2 M17 1 L14 -2" stroke={T} strokeWidth={1.6} strokeLinecap="round" />
        {/* boca */}
        <path d={cara === "miedo" ? "M12 18 Q16 24 20 18 Z" : "M10 19 Q16 22 22 19"} fill={cara === "miedo" ? T : "none"} stroke={labio} strokeWidth={3.5} strokeLinecap="round" />
        {/* escarcha */}
        {helada > 0.05 && <g opacity={helada} fill="#F4F9FF">{Array.from({ length: 26 }).map((_, i) => { const a = i / 26; const [x, y] = i < 8 ? [-1 + a * 3.4 * 13, -1 + Math.sin(i) * 1.2] : i < 18 ? [-28 + (i - 8) * 6.4, -16 + Math.sin(i * 1.7) * 2] : [-10 + (i - 18) * 4.6, 24 + Math.cos(i) * 2]; return <circle key={i} cx={x} cy={y} r={0.9 + (i % 3) * 0.5} />; })}</g>}
      </g>
    );
  };
  return C;
};
