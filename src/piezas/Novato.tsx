// Novato: rig del principiante de la serie de técnica (E83+; el personaje fijo es Fermín, `Fermin.tsx`). Visto DE ESPALDAS, cara a la pared,
// para que se lean las dos mitades del cuerpo (bisagra, bandera, rock over). Mismo lenguaje que Escalador:
// extremidades gruesas de punta redonda, cabeza redonda con cara de 2 ojos + boca, sombra plana.
// Manos y pies se colocan por objetivo (IK de 2 huesos): pasas dónde está cada presa y el cuerpo se adapta.
import React, { useId } from "react";
import { Ojos, type Cara } from "./Escalador";

export type Pt = { x: number; y: number };
export type AspectoNovato = {
  camiseta: string; camisetaSombra: string; pantalon: string; piel: string; pielSombra: string;
  pelo: string; peinado: "revuelto" | "rizado" | "rapado"; gafas?: boolean; barba?: string; calcetin?: string;
};

/** Medidas en unidades locales (escala 1): ≈ 3 u = 1 cm para un novato de 1,75 m. */
export const MED = { hombroX: 62, hombroY: -178, caderaX: 30, brazo1: 124, brazo2: 120, pierna1: 140, pierna2: 134, cabezaY: -250, R: 52 };
const TINTA = "#141B26", ARNES = "#F2C230", PIE = "#2A3140", CUERDA = "#FF6A1F";

/** Codo/rodilla por IK. `fuera` = hacia qué lado se dobla (±1). Si no llega, se estira hacia el objetivo. */
export const ik = (a: Pt, t: Pt, l1: number, l2: number, fuera: number): { j: Pt; fin: Pt } => {
  const dx = t.x - a.x, dy = t.y - a.y, d0 = Math.hypot(dx, dy) || 1;
  const d = Math.min(d0, l1 + l2 - 0.5), base = Math.atan2(dy, dx);
  const al = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const ang = base + fuera * al;
  const j = { x: a.x + l1 * Math.cos(ang), y: a.y + l1 * Math.sin(ang) };
  const fin = { x: a.x + (dx / d0) * d, y: a.y + (dy / d0) * d };
  return { j, fin };
};

export type PropsNovato = {
  /** cadera (centro), en coordenadas de escena */ x: number; y: number; s?: number;
  aspecto: AspectoNovato;
  /** objetivos en coordenadas de escena */ manoI: Pt; manoD: Pt; pieI: Pt; pieD: Pt;
  /** giro del tronco (grados, + = hombros hacia la derecha) */ inclina?: number;
  /** -1 mira por encima del hombro izquierdo, 0 de espaldas, 1 por el derecho */ mira?: number;
  cara?: Cara;
  /** la pierna izquierda pasa por DELANTE (más cerca de cámara): bandera por detrás */ banderaI?: boolean;
  /** cuerda naranja al arnés desde arriba */ cuerda?: boolean;
  /** colores en rojo/verde sobre un brazo o pierna (barra de esfuerzo) */ tinteBrazoI?: string;
  /** x (escena) donde termina la cuerda por arriba; por defecto, vertical */ cuerdaX?: number;
};

export const Novato: React.FC<PropsNovato> = ({ x, y, s = 1, aspecto: a, manoI, manoD, pieI, pieD, inclina = 0, mira = 0, cara = "normal", banderaI, cuerda = true, tinteBrazoI, cuerdaX }) => {
  const id = "nv" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const loc = (p: Pt): Pt => ({ x: (p.x - x) / s, y: (p.y - y) / s });
  const r = (inclina * Math.PI) / 180;
  const rot = (p: Pt): Pt => ({ x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) });
  const hI = rot({ x: -MED.hombroX, y: MED.hombroY }), hD = rot({ x: MED.hombroX, y: MED.hombroY });
  const cab = rot({ x: 0, y: MED.cabezaY });
  const cI = { x: -MED.caderaX, y: 4 }, cD = { x: MED.caderaX, y: 4 };
  const bI = ik(hI, loc(manoI), MED.brazo1, MED.brazo2, -1), bD = ik(hD, loc(manoD), MED.brazo1, MED.brazo2, 1);
  const pI = ik(cI, loc(pieI), MED.pierna1, MED.pierna2, banderaI ? -1 : 1), pD = ik(cD, loc(pieD), MED.pierna1, MED.pierna2, -1);
  const st = (w: number, col: string) => ({ stroke: col, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" });
  const L = (...p: Pt[]) => "M" + p.map((q) => `${q.x} ${q.y}`).join(" L");
  const mid = (p: Pt, q: Pt, t: number) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

  const pierna = (c: Pt, k: { j: Pt; fin: Pt }, lado: number) => (
    <g>
      <path d={L(c, k.j, k.fin)} {...st(50, a.pantalon)} />
      {/* talón del pie de gato visto desde atrás + calcetín */}
      <circle cx={k.fin.x} cy={k.fin.y - 6} r={20} fill={a.calcetin ?? "#E9E4D8"} />
      <ellipse cx={k.fin.x + lado * 4} cy={k.fin.y + 14} rx={26} ry={20} fill={PIE} />
      <ellipse cx={k.fin.x + lado * 4} cy={k.fin.y + 22} rx={22} ry={8} fill="#B4553C" opacity={0.9} />
    </g>
  );
  const brazo = (h: Pt, k: { j: Pt; fin: Pt }, tinte?: string) => (
    <g>
      <path d={L(h, k.j, k.fin)} {...st(38, a.piel)} />
      {tinte && <path d={L(k.j, k.fin)} {...st(38, tinte)} opacity={0.75} />}
      <path d={L(h, mid(h, k.j, 0.55))} {...st(46, a.camiseta)} />
      <circle cx={k.fin.x} cy={k.fin.y} r={24} fill={a.piel} />
      <path d={`M${k.fin.x - 16} ${k.fin.y - 10} q16 -14 32 0`} {...st(5, a.pielSombra)} />
    </g>
  );

  // Cabeza: de espaldas el pelo tapa casi todo; al mirar por un hombro asoma la cara en 3/4.
  const m = Math.max(-1, Math.min(1, mira)), R = MED.R;
  const cabeza = (
    <g transform={`translate(${cab.x} ${cab.y}) rotate(${inclina * 0.5})`}>
      <rect x={-20} y={30} width={40} height={40} rx={14} fill={a.pielSombra} />
      <ellipse cx={-R + 2} cy={6} rx={11} ry={15} fill={a.pielSombra} opacity={m > 0.3 ? 1 : 0.9} />
      <ellipse cx={R - 2} cy={6} rx={11} ry={15} fill={a.pielSombra} opacity={m < -0.3 ? 1 : 0.9} />
      <circle r={R} fill={a.piel} />
      <clipPath id={id}><circle r={R - 1} /></clipPath>
      <g clipPath={`url(#${id})`}>
        {a.barba && <circle cx={m * R * 0.5} cy={R * 0.75} r={R * 0.7} fill={a.barba} />}
        {/* pelo: un casquete que se desplaza al lado contrario de la cara */}
        {a.peinado !== "rapado"
          ? <circle cx={-m * R * 0.72} cy={-R * (Math.abs(m) > 0.2 ? 0.22 : 0.05) - 6} r={R * (Math.abs(m) > 0.2 ? 1.02 : 1.0)} fill={a.pelo} />
          : <circle cx={-m * R * 0.72} cy={-R * 0.3} r={R * 0.95} fill={a.pelo} opacity={0.45} />}
        {Math.abs(m) > 0.2 && <g transform={`translate(${m * R * 0.3} ${R * 0.12}) scale(${m * 1.45} 1.45) translate(-15 4)`}><Ojos cara={cara} /></g>}
        {Math.abs(m) > 0.2 && a.gafas && <g transform={`translate(${m * R * 0.3} ${R * 0.12}) scale(${m * 1.45} 1.45) translate(-15 4)`} stroke={TINTA} strokeWidth={3.2} fill="#fff" fillOpacity={0.2}>
          <circle cx={7} cy={-3} r={10.5} /><circle cx={24} cy={-3} r={10.5} /><path d="M17.5 -3 L13.5 -3 M-3 -3 L-14 -6" fill="none" /></g>}
      </g>
      {/* mechones que sobresalen */}
      {a.peinado === "revuelto" && <g fill={a.pelo}>
        {[[-34, -40, -30], [-12, -54, -8], [12, -54, 14], [32, -42, 34]].map(([px, py, rr], i) => <path key={i} d={`M${px - 12} ${py + 16} L${px + rr * 0.25} ${py - 16} L${px + 14} ${py + 14} Z`} />)}
      </g>}
      {a.peinado === "rizado" && <g fill={a.pelo}>{[[-40, -30], [-22, -48], [0, -54], [22, -48], [40, -30], [-m * 50, 4]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={17} />)}</g>}
      {a.gafas && Math.abs(m) <= 0.2 && <path d={`M${-R + 2} -2 L${-R + 14} 0 M${R - 2} -2 L${R - 14} 0`} {...st(4, TINTA)} />}
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {cuerda && <path d={L({ x: cuerdaX === undefined ? 4 : (cuerdaX - x) / s, y: -2400 }, { x: 4, y: -10 })} {...st(14, CUERDA)} />}
      {brazo(hI, bI, tinteBrazoI)}
      {brazo(hD, bD)}
      {!banderaI && pierna(cI, pI, -1)}
      {pierna(cD, pD, 1)}
      {/* tronco */}
      <g transform={`rotate(${inclina})`}>
        <path d={`M-74 -206 Q0 -226 74 -206 L66 -40 Q62 12 0 14 Q-62 12 -66 -40 Z`} fill={a.camiseta} />
        <path d="M-40 -150 Q-6 -120 -24 -60 M30 -140 Q46 -100 34 -70" {...st(6, a.camisetaSombra)} />
        <rect x={-26} y={-214} width={52} height={14} rx={7} fill={a.camisetaSombra} />
      </g>
      <rect x={-62} y={-30} width={124} height={54} rx={24} fill={a.pantalon} />
      <rect x={-64} y={-38} width={128} height={18} rx={8} fill={ARNES} />
      <path d="M-58 -26 Q-30 30 -6 4 M58 -26 Q30 30 6 4" {...st(9, ARNES)} />
      {banderaI && pierna(cI, pI, -1)}
      {cabeza}
    </g>
  );
};

/** Aspectos candidatos del protagonista (boceto E83). */
export const NOVATOS: Record<string, AspectoNovato> = {
  fermin: { camiseta: "#3E6FB0", camisetaSombra: "#2C5288", pantalon: "#4B4F57", piel: "#E9B990", pielSombra: "#C9926A", pelo: "#5A3A22", peinado: "revuelto", gafas: true, calcetin: "#E2533F" },
  quique: { camiseta: "#3F8A5C", camisetaSombra: "#2C6743", pantalon: "#C7B08A", piel: "#D9A57C", pielSombra: "#B6835C", pelo: "#B4552A", peinado: "rizado", calcetin: "#F2C230" },
  tono: { camiseta: "#8A3B4A", camisetaSombra: "#662A36", pantalon: "#2F3B4C", piel: "#B9825A", pielSombra: "#94613E", pelo: "#2B1D14", peinado: "rapado", barba: "#2B1D14", calcetin: "#E9E4D8" },
};
