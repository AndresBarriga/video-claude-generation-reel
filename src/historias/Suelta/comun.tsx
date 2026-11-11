// E47 «Llevas cuerda. Tu cerebro no lo sabe». Escenario NUEVO: cueva desplomada de caliza al anochecer (tipo Rodellar):
// techo de roca encima, boca de la cueva abierta a un cañón con río, cielo azul de última hora. Las caídas van al aire (desplome).
// Idea visual: la cuerda naranja es lo único cálido; cuando el cerebro «no la ve» se vuelve gris discontinua; el medidor de MIEDO baja caída a caída.
import React from "react";
import { random } from "remotion";
import { Escalador, type Angulos, type Cara } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
export { C, Etiqueta, Svg, clamp, golpe, W, H, type P } from "../Pegue/comun";
import { C } from "../Pegue/comun";

/* ---- reparto (nuevo) ---- */
export const TU: Aspecto = { chaqueta: "#3F7F86", chaquetaSombra: "#2A5A60", pantalon: "#2B2F3A", casco: "#E9E4D8", pelo: "#7A3B1E", peinado: "rizado", piel: "#B9825A", pielSombra: "#94613E", manos: "piel" };
export const ASEG: Aspecto = { chaqueta: "#B4553C", chaquetaSombra: "#82392A", pantalon: "#3A3F33", casco: null, gorro: "#D9B44A", pelo: "#1E1612", peinado: "coleta", piel: "#9C6845", pielSombra: "#7C4F33", manos: "piel", gafas: true };

/* ---- paleta: azul de última hora, caliza fría con chorreras ocres apagadas ---- */
export const PC = {
  cieloA: "#0F1F3A", cieloB: "#28507A", cieloC: "#6E95B4", horizonte: "#D9A27A",
  lejos: "#36506E", medio: "#24384F", rio: "#9FC3D8",
  roca: "#6C7480", rocaS: "#4E5560", rocaL: "#8A929C", ocre: "#9C805E", techo: "#2A303A", suelo: "#3A3F46",
  miedo: "#E2533F", cabeza: "#CFE3F2", tinta: "#081120",
};

/* ---- geometría del mundo (px). Pared a la derecha; desplome: arriba queda más a la izquierda ---- */
export const SUELO = 2650;
export const xF = (y: number) => 300 + (y - 150) * 0.24 + 10 * Math.sin(y / 97) + 6 * Math.sin(y / 31);
export const CHAPAS = [2330, 1990, 1650, 1310, 980];
export const CHAPA = { x: xF(980) - 6, y: 1022 }; // mosquetón de la última chapa (por donde pasa la cuerda)
export const ARRIBA = { x: xF(745) - 78, y: 745 }; // cadera del escalador agarrado (por encima de la chapa)
export const COLGADO = { x: CHAPA.x - 34, y: 1335 }; // cadera colgando tras la caída (al aire, bajo el desplome)
export const ASE = { x: 735, y: SUELO - 136 }; // cadera de quien asegura
export const FRENO = { x: ASE.x + 34, y: ASE.y - 10 };

/** Cámara: (cx, cy) del mundo al centro de pantalla con zoom z. Paralaje del fondo aparte. */
export const cam = (cx: number, cy: number, z: number) => `translate(540 960) scale(${z}) translate(${-cx} ${-cy})`;

/** Fondo: boca de la cueva abierta al cañón. Se mueve menos que la cueva (paralaje). `calido` 0–1 = luz del final. */
export const Fondo: React.FC<{ cx: number; cy: number; z: number; calido?: number }> = ({ cx, cy, z, calido = 0 }) => {
  const px = (cx - 600) * 0.25, py = (cy - 1300) * 0.18, s = 1 + (z - 1) * 0.25;
  return (
    <g>
      <defs>
        <linearGradient id="sl-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PC.cieloA} /><stop offset="0.55" stopColor={PC.cieloB} /><stop offset="0.85" stopColor={PC.cieloC} />
          <stop offset="1" stopColor={PC.horizonte} stopOpacity={0.35 + 0.5 * calido} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#sl-cielo)" />
      <g transform={`translate(540 960) scale(${s}) translate(${-540 - px} ${-960 - py})`}>
        {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={random(`es${i}`) * 1080} cy={120 + random(`ey${i}`) * 520} r={1.5 + random(`er${i}`) * 2} fill="#EAF2FA" opacity={0.25 + random(`eo${i}`) * 0.4 * (1 - calido)} />)}
        <circle cx={250} cy={1180} r={130} fill={PC.horizonte} opacity={0.12 + 0.4 * calido} />
        {/* paredes del cañón al otro lado */}
        <path d="M-200 1050 L60 980 L150 1010 L260 940 L380 1000 L470 960 L560 1030 L560 2100 L-200 2100 Z" fill={PC.lejos} />
        <path d="M-200 1250 Q100 1180 300 1230 T700 1260 L700 2100 L-200 2100 Z" fill={PC.medio} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-150 + i * 80} 1050 l14 ${180 + random(`gr${i}`) * 160}`} stroke="#2C4460" strokeWidth={6} opacity={0.5} />)}
        {/* río y árboles en el fondo del cañón */}
        <path d="M-200 1520 Q150 1470 320 1540 T700 1590" stroke={PC.rio} strokeWidth={16} fill="none" opacity={0.75} />
        {Array.from({ length: 34 }).map((_, i) => <ellipse key={i} cx={-180 + random(`tx${i}`) * 820} cy={1440 + random(`ty${i}`) * 260} rx={16 + random(`tr${i}`) * 12} ry={22} fill={i % 3 ? "#1B2D3D" : "#22384A"} />)}
      </g>
    </g>
  );
};

/** La cueva: pared desplomada (derecha), techo (arriba) y suelo con bloques. Chapas con cintas exprés. */
export const Cueva: React.FC<{ chapas?: number }> = ({ chapas = 5 }) => {
  const ys = Array.from({ length: 60 }, (_, i) => -300 + i * 52);
  const cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      {/* techo de la cueva */}
      <path d="M-400 -400 L1600 -400 L1600 260 Q1100 330 700 230 Q350 150 120 300 Q-60 420 -400 360 Z" fill={PC.techo} />
      <path d="M-400 360 Q-60 420 120 300 Q350 150 700 230" stroke="#3D4552" strokeWidth={14} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => { const x = -300 + i * 70 + random(`st${i}`) * 30, y0 = 300 + Math.sin(i) * 40, l = 40 + random(`sl${i}`) * 90; return <path key={i} d={`M${x - 12} ${y0} Q${x} ${y0 + l} ${x + 12} ${y0}`} fill={PC.techo} />; })}
      {/* pared: luz fría que entra por la boca de la cueva (izquierda) y se apaga hacia dentro */}
      <defs>
        <linearGradient id="sl-roca" x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0" stopColor="#8E98A4" /><stop offset="0.18" stopColor={PC.roca} /><stop offset="0.6" stopColor="#4A515C" /><stop offset="1" stopColor="#353B45" />
        </linearGradient>
        <linearGradient id="sl-tufa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B49A76" /><stop offset="0.5" stopColor={PC.ocre} /><stop offset="1" stopColor="#6A5A47" />
        </linearGradient>
      </defs>
      <path d={`M${cara} L1600 ${SUELO + 400} L1600 -300 Z`} fill="url(#sl-roca)" />
      {/* estratos y fisuras siguiendo el desplome */}
      {Array.from({ length: 9 }).map((_, i) => { const y = 260 + i * 290 + random(`ey${i}`) * 80; return <path key={i} d={`M${xF(y) + 10} ${y} q260 ${-30 - random(`eq${i}`) * 40} 620 ${20 + random(`ew${i}`) * 50} t520 ${-20}`} stroke="#3B414B" strokeWidth={5 + random(`es${i}`) * 5} fill="none" opacity={0.55} />; })}
      {/* chorreras (tufas): columnas colgantes con volumen */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y0 = 120 + i * 260 + random(`tu${i}`) * 90, x0 = xF(y0) + 70 + random(`tx${i}`) * 300, l = 420 + random(`tl${i}`) * 520, w = 22 + random(`tw${i}`) * 26, dx = l * 0.22;
        const d = `M${x0 - w} ${y0} C${x0 - w * 1.3} ${y0 + l * 0.35} ${x0 - w * 0.4 + dx * 0.6} ${y0 + l * 0.7} ${x0 + dx - 4} ${y0 + l} C${x0 + dx + w * 0.5} ${y0 + l * 0.9} ${x0 + w * 1.2 + dx * 0.4} ${y0 + l * 0.45} ${x0 + w} ${y0} Z`;
        return <g key={i} opacity={0.55 + random(`to${i}`) * 0.3}><path d={d} fill="url(#sl-tufa)" /><path d={`M${x0 - w * 0.6} ${y0 + 20} C${x0 - w * 0.9} ${y0 + l * 0.35} ${x0 - w * 0.2 + dx * 0.6} ${y0 + l * 0.7} ${x0 + dx - 6} ${y0 + l - 20}`} stroke="#D6C3A2" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" /></g>;
      })}
      {/* agujeros (bidedos) */}
      {Array.from({ length: 46 }).map((_, i) => { const y = random(`py${i}`) * 2700, x = xF(y) + 60 + random(`px${i}`) * 760, r = 7 + random(`pr${i}`) * 13; return <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#2B3039" opacity={0.8} /><path d={`M${x - r} ${y - 1} Q${x} ${y - r * 0.9} ${x + r} ${y - 1}`} stroke="#9AA3AD" strokeWidth={3} fill="none" opacity={0.45} /></g>; })}
      {/* borde iluminado por el cielo */}
      <path d={`M${cara}`} stroke="#A9C4D8" strokeWidth={10} fill="none" opacity={0.55} />
      <path d={`M${cara}`} stroke={PC.tinta} strokeWidth={4} fill="none" opacity={0.6} />
      {/* presas con magnesio cerca del escalador */}
      {[[700, 0.6], [640, 0.5], [600, 0.8], [830, 0.5], [900, 0.4], [1080, 0.5]].map(([y, o], i) => <g key={i}><ellipse cx={xF(y) + 12} cy={y} rx={22} ry={9} fill="#585F69" /><ellipse cx={xF(y) + 12} cy={y - 4} rx={18} ry={6} fill="#F1F3F5" opacity={o} /></g>)}
      {/* suelo de la cueva */}
      <path d={`M-400 ${SUELO + 20} Q300 ${SUELO - 10} 900 ${SUELO} L1600 ${SUELO} L1600 3200 L-400 3200 Z`} fill={PC.suelo} />
      {[[-120, 40, 90], [140, 25, 60], [420, 30, 50], [980, 10, 120]].map(([x, dy, r], i) => <ellipse key={i} cx={x} cy={SUELO + dy} rx={r} ry={r * 0.45} fill="#2C3137" />)}
      {CHAPAS.slice(0, chapas).map((y, i) => <Expres key={i} y={y} />)}
    </g>
  );
};

/** Chapa en la pared + cinta exprés colgando (mosquetón de abajo = por donde pasa la cuerda). */
export const Expres: React.FC<{ y: number }> = ({ y }) => {
  const x = xF(y);
  return (
    <g>
      <circle cx={x + 4} cy={y} r={11} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={4} />
      <path d={`M${x + 2} ${y + 6} L${x - 4} ${y + 40}`} stroke="#3D7FD0" strokeWidth={12} strokeLinecap="round" />
      <ellipse cx={x - 6} cy={y + 46} rx={9} ry={15} fill="none" stroke="#C9D1D8" strokeWidth={5} />
    </g>
  );
};

/** Cuerda: de quien asegura, por las chapas, hasta el arnés. `idea` 0–1 = se vuelve gris discontinua. `floja` = comba (caída). */
export const CuerdaSL: React.FC<{ arnes: { x: number; y: number }; idea?: number; floja?: number; tension?: number }> = ({ arnes, idea = 0, floja = 0, tension = 0 }) => {
  const pts = [FRENO, ...CHAPAS.map((y) => ({ x: xF(y) - 6, y: y + 54 }))];
  const base = pts.map((p) => `${p.x} ${p.y}`).join(" L");
  const mx = (CHAPA.x + arnes.x) / 2 - floja * 120, my = (CHAPA.y + arnes.y) / 2 + floja * 160;
  const d = `M${base} Q${mx} ${my} ${arnes.x + 18} ${arnes.y - 6}`;
  const w = 10 + tension * 3;
  return (
    <g>
      <g opacity={1 - idea}>
        <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke="#FFB27F" strokeWidth={2.5} fill="none" strokeDasharray="9 11" opacity={0.7} />
      </g>
      {idea > 0 && <path d={d} stroke="#AEB6C0" strokeWidth={6} fill="none" strokeDasharray="18 16" opacity={idea * 0.8} />}
    </g>
  );
};

/** Quien escala. `cae` 0–1: de agarrado (ARRIBA) a colgado (COLGADO). */
export const ANG_AGARRE: Angulos = { torso: 18, cabeza: -22, brazoA: [160, 178], brazoB: [146, 168], piernaA: [86, 30], piernaB: [64, 10] };
export const ANG_COLGADO: Angulos = { torso: 4, cabeza: -6, brazoA: [40, 20], brazoB: [-30, -10], piernaA: [40, 6], piernaB: [16, -10] };
export const ANG_CAER: Angulos = { torso: -10, cabeza: -18, brazoA: [130, 110], brazoB: [-120, -100], piernaA: [50, -10], piernaB: [10, -30] };
const mix = (a: Angulos, b: Angulos, t: number): Angulos => {
  const l = (x: number, y: number) => x + (y - x) * t;
  return { torso: l(a.torso, b.torso), cabeza: l(a.cabeza, b.cabeza), brazoA: [l(a.brazoA[0], b.brazoA[0]), l(a.brazoA[1], b.brazoA[1])], brazoB: [l(a.brazoB[0], b.brazoB[0]), l(a.brazoB[1], b.brazoB[1])], piernaA: [l(a.piernaA[0], b.piernaA[0]), l(a.piernaA[1], b.piernaA[1])], piernaB: [l(a.piernaB[0], b.piernaB[0]), l(a.piernaB[1], b.piernaB[1])] };
};
/** Posición de la cadera durante una caída (t 0–1): caída libre y frenada blanda con rebote. */
export const posCaida = (t: number) => {
  const g = Math.min(1, t / 0.55), y0 = ARRIBA.y, y1 = COLGADO.y + 40;
  if (t < 0.55) return { x: ARRIBA.x + (COLGADO.x - ARRIBA.x) * g * g * 0.6, y: y0 + (y1 - y0) * g * g, floja: 1 - g * 0.6, ang: mix(ANG_AGARRE, ANG_CAER, Math.min(1, g * 3)) };
  const k = (t - 0.55) / 0.45, reb = Math.exp(-5 * k) * Math.cos(k * 11);
  return { x: COLGADO.x + 26 * reb, y: COLGADO.y + 40 * reb, floja: 0, ang: mix(ANG_CAER, ANG_COLGADO, Math.min(1, k * 2)) };
};
export const Tu: React.FC<{ x: number; y: number; ang: Angulos; cara?: Cara; rot?: number; tiembla?: number }> = ({ x, y, ang, cara = "miedo", rot = 0, tiembla = 0 }) => (
  <Escalador x={x + tiembla} y={y} quien="joe" angulos={ang} cara={cara} aspecto={TU} rot={rot} mira={1} />
);
export const Asegura: React.FC<{ dy?: number; cara?: Cara; brazo?: number }> = ({ dy = 0, cara = "normal", brazo = 0 }) => (
  <Escalador x={ASE.x} y={ASE.y + dy} quien="simon" angulos={{ torso: -6, cabeza: -30, brazoA: [150 - brazo * 20, 172], brazoB: [40, 100], piernaA: [10, 0], piernaB: [-12, 0] }} cara={cara} aspecto={ASEG} mira={-1} sombra={SUELO} />
);

/** Medidor de MIEDO (dato en pantalla, arriba). v 0–1. */
export const Medidor: React.FC<{ v: number; o?: number }> = ({ v, o = 1 }) => (
  <div style={{ position: "absolute", top: 228, left: 140, right: 140, opacity: o }}>
    <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 40, color: "#fff", letterSpacing: 3, marginBottom: 10, textShadow: "0 3px 8px #000" }}>MIEDO</div>
    <div style={{ height: 34, borderRadius: 20, background: "rgba(5,11,20,.7)", border: "4px solid #050B14", overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: "100%", background: PC.miedo, borderRadius: 20 }} />
    </div>
  </div>
);

/** Bocadillo de voz en pantalla (coordenadas de pantalla). */
export const Bocadillo: React.FC<{ x: number; y: number; texto: string; s: number; cola?: "abajo" | "arriba" }> = ({ x, y, texto, s, cola = "abajo" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 1.5) }}>
    <div style={{ position: "relative", background: "#F7F4EE", border: "7px solid #081120", borderRadius: 40, padding: "18px 34px", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 64, color: "#081120", whiteSpace: "nowrap" }}>
      {texto}
      <div style={{ position: "absolute", left: "50%", [cola === "abajo" ? "bottom" : "top"]: -34, width: 0, height: 0, marginLeft: -22, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", [cola === "abajo" ? "borderTop" : "borderBottom"]: "36px solid #081120" } as React.CSSProperties} />
    </div>
  </div>
);
