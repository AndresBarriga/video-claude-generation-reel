// E49 «Pesa veinticuatro kilos más»: piezas comunes. Rocódromo de perfil (pared a la derecha), dos personajes unidos por la cuerda naranja.
// Idea visual: siempre el mismo encuadre; solo cambia cuánto sube quien asegura (y el OHM II en la primera cinta).
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { Escalador, type Cara, type NombrePose, type Angulos } from "../../piezas/Escalador";
import { Resina, RESINA } from "../../piezas/Rocodromo";
import { Cuerda } from "../Pegue/comun";
export { C, Camara, Svg, clamp, type P } from "../Pegue/comun";
export { Rotulo, Chip, ei, salida } from "../Pump/comun";

export const SUELO = 1330, PARED = 800;
export const CINTA1 = { x: 786, y: 800 }, CINTA2 = { x: 800, y: 520 }; // punto por donde pasa la cuerda
/** Encuadre: plano medio (suelo → primera cinta), personajes grandes. Todo lo del mundo va dentro. */
export const ENC = { s: 1.5, cx: 640, cy: 1000, tx: 560, ty: 900 };
export const aPantalla = (x: number, y: number) => [ENC.tx + (x - ENC.cx) * ENC.s, ENC.ty + (y - ENC.cy) * ENC.s] as const;
export const Encuadre: React.FC<{ children: React.ReactNode; s?: number }> = ({ children, s = ENC.s }) => (
  <g transform={`translate(${ENC.tx} ${ENC.ty}) scale(${s}) translate(${-ENC.cx} ${-ENC.cy})`}>{children}</g>
);
export const LIMA = "#C7DC2E", LIMA_S = "#93A81C";

/* ---- reparto ---- */
export const ELLA = { aspecto: { chaqueta: "#2FA39A", chaquetaSombra: "#1F7770", pantalon: "#2B3442", casco: null, peinado: "coleta" as const, pelo: "#3B2418", piel: "#E2B08A", pielSombra: "#C08E68", manos: "piel" as const }, s: 0.84 };
export const EL = { aspecto: { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", pantalon: "#2B3442", casco: null, peinado: "corto" as const, pelo: "#2B1D14", barba: "#2B1D14", piel: "#C98E67", pielSombra: "#A8714E", manos: "piel" as const }, s: 0.96, cuerpo: { torso: 70, grosor: 1.28, manos: 15 } };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cl = (v: number) => Math.max(0, Math.min(1, v));

/** Estado de la caída. k: 0 (antes de caer) → 1 (parado). ohm: con freno en la primera cinta. */
export const estado = (k: number, ohm = false) => {
  const caida = Easing.in(Easing.quad)(cl(k / 0.62));
  const asienta = cl((k - 0.62) / 0.38);
  const rebote = asienta > 0 ? Math.sin(asienta * Math.PI * 2.2) * 26 * (1 - asienta) : 0;
  const yFin = ohm ? 1010 : 1172;
  const hy = k < 0.62 ? lerp(430, yFin, caida) : yFin + rebote;
  const hx = lerp(752, ohm ? 720 : 690, cl(k * 1.4));
  const u = Easing.out(Easing.cubic)(cl((k - 0.42) / 0.5));
  const my = lerp(1216, ohm ? 1168 : 928, u) + (ohm ? 0 : -rebote * 0.6);
  const mx = lerp(470, ohm ? 492 : 628, u);
  return { hx, hy, mx, my, u, caida: cl(k / 0.62) };
};

/* ---- fondo ---- */
export const Fondo: React.FC<{ apagado?: number }> = ({ apagado = 0 }) => (
  <g>
    <rect x={-300} y={-500} width={1700} height={2900} fill="#26313F" />
    {[160, 540, 920].map((x, i) => <g key={i}><rect x={x - 90} y={70} width={180} height={16} rx={8} fill="#F4F2EE" /><path d={`M${x - 90} 86 L${x - 260} 760 L${x + 260} 760 L${x + 90} 86 Z`} fill="#FFF3C4" opacity={0.05} /></g>)}
    {/* pared de bloque del fondo (izquierda) */}
    <path d={`M120 ${SUELO} L120 330 L360 300 L440 ${SUELO} Z`} fill="#3A4859" />
    <path d={`M360 300 L440 ${SUELO}`} stroke="#2A3544" strokeWidth={10} />
    {Array.from({ length: 16 }).map((_, i) => <Resina key={i} x={140 + random(`bx${i}`) * 230} y={360 + random(`by${i}`) * 860} r={11 + random(`br${i}`) * 8} c={RESINA[i % RESINA.length]} seed={`b${i}`} magnesio={0.25} />)}
    <rect x={-300} y={-500} width={1700} height={2900} fill="#0B1624" opacity={0.25 + apagado * 0.25} />
  </g>
);

/** Pared de cuerda (derecha), con presas, chapas y cintas. `ohm`: 0..1 aparece el OHM II en la primera cinta. */
export const ParedCuerda: React.FC<{ ohm?: number }> = ({ ohm = 0 }) => (
  <g>
    <rect x={PARED} y={-200} width={500} height={SUELO + 200} fill="#5C6E86" />
    <rect x={PARED} y={-200} width={26} height={SUELO + 200} fill="#4A5A70" />
    {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={PARED + 70 + (i % 4) * 70} cy={120 + Math.floor(i / 4) * 210} r={5} fill="#3E4C60" />)}
    {[1220, 1090, 960, 700, 610, 430, 300].map((y, i) => <Resina key={i} x={PARED + 6} y={y} r={22} c={["#E0A526", "#C8566B", "#2FA39A"][i % 3]} seed={`h${i}`} magnesio={0.8} />)}
    <Cinta x={CINTA2.x} y={CINTA2.y} />
    {ohm < 1 && <g opacity={1 - ohm}><Cinta x={CINTA1.x} y={CINTA1.y} /></g>}
    {ohm > 0 && <g opacity={ohm}><Ohm x={CINTA1.x} y={CINTA1.y} s={0.42} /></g>}
  </g>
);

/** Cinta exprés: (x, y) = punto por donde pasa la cuerda (mosquetón de abajo). */
export const Cinta: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={PARED + 4} cy={y - 60} r={8} fill="#AEB8C4" />
    <ellipse cx={PARED - 4} cy={y - 50} rx={9} ry={15} fill="none" stroke="#AEB8C4" strokeWidth={5} />
    <path d={`M${PARED - 6} ${y - 36} L${x} ${y - 14}`} stroke="#3D7FD0" strokeWidth={11} strokeLinecap="round" />
    <ellipse cx={x} cy={y} rx={10} ry={16} fill="none" stroke="#AEB8C4" strokeWidth={5} />
  </g>
);

/** Edelrid OHM II, dibujado reconocible: mosquetón gris, cinta lima con etiqueta, giratorio y cuerpo lima con leva plateada.
 *  (x, y) = punto por donde pasa la cuerda (centro del cuerpo); s = escala (1 = primer plano ~ 330 px de alto). */
export const Ohm: React.FC<{ x: number; y: number; s?: number; muerde?: number }> = ({ x, y, s = 1, muerde = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* mosquetón en la chapa */}
    <circle cx={44} cy={-300} r={16} fill="#AEB8C4" stroke="#5E6A78" strokeWidth={4} />
    <path d="M18 -318 Q44 -332 56 -300 L46 -214 Q40 -196 22 -200 Q6 -204 8 -224 Z" fill="none" stroke="#8D97A4" strokeWidth={13} strokeLinejoin="round" />
    <path d="M18 -318 Q44 -332 56 -300 L46 -214" fill="none" stroke="#C9D1DA" strokeWidth={4} />
    {/* cinta lima con etiqueta */}
    <rect x={2} y={-214} width={34} height={124} rx={8} fill={LIMA} stroke={LIMA_S} strokeWidth={4} />
    <path d="M10 -200 L10 -104 M28 -200 L28 -104" stroke="#E5F08A" strokeWidth={3} strokeDasharray="8 6" />
    <rect x={-24} y={-176} width={30} height={64} rx={3} fill="#F4F2EE" stroke="#B9BDC2" strokeWidth={2} />
    <text x={-9} y={-144} transform="rotate(90 -9 -144)" textAnchor="middle" fontFamily="Figtree" fontWeight={700} fontSize={13} fill="#141B26" letterSpacing={1}>EDELRID</text>
    {/* giratorio */}
    <rect x={4} y={-96} width={30} height={22} rx={6} fill="#1E2530" />
    <circle cx={19} cy={-70} r={14} fill="#2A323E" stroke="#141B26" strokeWidth={4} /><circle cx={19} cy={-70} r={5} fill="#AEB8C4" />
    {/* cuerpo */}
    <g transform={`rotate(${-muerde * 8} 0 0)`}>
      <path d="M-46 -52 Q-10 -70 34 -58 Q58 -50 54 -20 L44 70 Q38 104 6 100 Q-18 96 -30 70 L-62 -10 Q-70 -40 -46 -52 Z" fill={LIMA} stroke={LIMA_S} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-40 -40 Q-8 -54 30 -44" stroke="#E9F49A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* leva plateada */}
      <path d="M10 20 L44 4 L40 74 Q34 90 18 86 L14 50 Z" fill="#B9C2CC" stroke="#6B7684" strokeWidth={5} strokeLinejoin="round" />
      <path d="M20 30 L38 22" stroke="#6B7684" strokeWidth={4} />
      <circle cx={-34} cy={-24} r={9} fill="#AEB8C4" stroke="#6B7684" strokeWidth={3} />
      <circle cx={2} cy={74} r={9} fill="#AEB8C4" stroke="#6B7684" strokeWidth={3} />
      <text x={-24} y={40} transform="rotate(-72 -24 40)" textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={20} fill="#3F4A12">OHM II</text>
    </g>
  </g>
);

/* ---- personajes ---- */
const ANG_ASEGURA: Partial<Angulos> = { brazoA: [118, 165], brazoB: [70, 120] };

export const Ella: React.FC<{ x: number; y: number; u: number; cara: Cara }> = ({ x, y, u, cara }) => {
  const vuela: Partial<Angulos> = { torso: 16 * u, cabeza: -24 * u, brazoA: [lerp(118, 168, u), lerp(165, 178, u)], brazoB: [lerp(70, 150, u), lerp(120, 170, u)], piernaA: [lerp(6, 34, u), lerp(0, -8, u)], piernaB: [lerp(-6, -4, u), lerp(0, -34, u)] };
  return <Escalador x={x} y={y} quien="simon" pose="pie" angulos={vuela} cara={cara} s={ELLA.s} aspecto={ELLA.aspecto} pies="#C8566B" sombra={SUELO + 6} />;
};
export const El: React.FC<{ x: number; y: number; pose: NombrePose; poseB?: NombrePose; t?: number; cara: Cara; rot?: number }> = ({ x, y, pose, poseB, t, cara, rot = 0 }) => (
  <Escalador x={x} y={y} quien="joe" pose={pose} poseB={poseB} t={t} cara={cara} s={EL.s} aspecto={EL.aspecto} cuerpo={EL.cuerpo} pies="#E0A526" bolsa="#3A4656" rot={rot} sombra={y > 1100 ? SUELO + 6 : undefined} />
);

/** Punto del arnés (anilla) a partir de la cadera. */
export const arnes = (x: number, y: number, s: number) => [x + 16 * s, y - 20 * s] as const;

/** Escena completa de la caída. */
export const Caida: React.FC<{ k: number; ohm?: boolean; ohmVisible?: number; caraElla?: Cara; caraEl?: Cara; brillo?: number; publico?: React.ReactNode }> = ({ k, ohm = false, ohmVisible, caraElla, caraEl, brillo = 0, publico }) => {
  const st = estado(k, ohm);
  const [ax, ay] = arnes(st.mx, st.my, ELLA.s), [bx, by] = arnes(st.hx, st.hy, EL.s);
  const holgura = (1 - st.u) * 40;
  const dCuerda = `M${ax} ${ay} Q${(ax + CINTA1.x) / 2 - 20} ${(ay + CINTA1.y) / 2 + holgura} ${CINTA1.x} ${CINTA1.y} L${CINTA2.x} ${CINTA2.y} L${bx} ${by}`;
  const poseEl: NombrePose = k < 0.05 ? "escalando" : "cayendo";
  return (
    <g>
      {publico}
      <ParedCuerda ohm={ohmVisible ?? (ohm ? 1 : 0)} />
      <Ella x={st.mx} y={st.my} u={st.u} cara={caraElla ?? (st.u > 0.3 ? "miedo" : "serio")} />
      {k < 0.62
        ? <El x={st.hx} y={st.hy} pose="escalando" poseB={poseEl} t={Math.min(1, k * 3)} cara={caraEl ?? (k > 0.05 ? "miedo" : "esfuerzo")} />
        : <El x={st.hx} y={st.hy} pose="colgado" cara={caraEl ?? (ohm ? "alivio" : "miedo")} />}
      <Cuerda d={dCuerda} w={9} />
      {brillo > 0 && <path d={dCuerda} stroke="#FFE2C8" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="90 2400" strokeDashoffset={-brillo * 1500} opacity={0.85} />}
      {/* suelo (colchoneta) */}
      <path d={`M-300 ${SUELO + 4} L1400 ${SUELO + 4} L1400 2400 L-300 2400 Z`} fill="#2E4B7A" />
      <path d={`M-300 ${SUELO + 4} L1400 ${SUELO + 4}`} stroke="#4E6FA6" strokeWidth={10} />
      {[120, 480, 840].map((x, i) => <path key={i} d={`M${x} ${SUELO + 10} L${x - 40} 1920`} stroke="#22385E" strokeWidth={6} />)}
    </g>
  );
};

/* ---- público (fondo): todos de pie en el plano de atrás, más pequeños y apagados ---- */
export type Reaccion = "nada" | "miedo" | "alivio";
export const Publico: React.FC<{ r: Reaccion; giro?: number }> = ({ r, giro = 1 }) => {
  const cara: Cara = r === "miedo" ? "miedo" : r === "alivio" ? "alivio" : "normal";
  const yS = SUELO - 30, s = 0.74, hip = yS - 136 * s;
  const m = (giro > 0.5 ? 1 : -1) as 1 | -1;
  return (
    <g opacity={0.9}>
      <Escalador x={385} y={700} quien="joe" pose="escalando" angulos={{ cabeza: r === "nada" ? -20 : 30 }} cara={cara} s={s} mira={m} aspecto={{ chaqueta: "#6FA34A", chaquetaSombra: "#4E7A33", casco: null, peinado: "rapado", pelo: "#1B1410", piel: "#8D5A3B", pielSombra: "#6E4429", manos: "piel" }} pies="#2FA39A" />
      <Escalador x={300} y={hip} quien="simon" pose={r === "alivio" ? "celebrando" : "pie"} cara={cara} s={s} mira={m} aspecto={{ chaqueta: "#E0A526", chaquetaSombra: "#A97812", casco: null, peinado: "rizado", pelo: "#2B1D14", piel: "#B9805A", pielSombra: "#94603F", manos: "piel" }} bolsa="#C8566B" sombra={yS + 4} />
      <Escalador x={372} y={hip} quien="joe" pose={r === "miedo" ? "soplando" : "pie"} cara={r === "miedo" ? "cerrados" : cara} s={s * 1.05} mira={m} aspecto={{ chaqueta: "#4F7FC9", chaquetaSombra: "#36599A", casco: null, peinado: "corto", pelo: "#C9B48A", piel: "#F0C7A4", pielSombra: "#D3A27C", gafas: true, manos: "piel" }} sombra={yS + 4} />
      <Escalador x={430} y={hip + 4} quien="simon" pose={r === "alivio" ? "celebrando" : "pie"} cara={cara} s={s * 0.96} mira={m} aspecto={{ chaqueta: "#C8566B", chaquetaSombra: "#963F50", casco: null, peinado: "trenzas", pelo: "#1B1410", piel: "#7A4B30", pielSombra: "#5C3621", manos: "piel" }} sombra={yS + 4} />
      <rect x={-300} y={0} width={760} height={SUELO} fill="#0B1624" opacity={0.12} />
    </g>
  );
};
