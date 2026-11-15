// Piezas de E59: plano con cámara, vía (chapas a escala), cuerda por puntos, quien asegura (mano de freno SIEMPRE en la cuerda), polvo y diente.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Fondo, Cueva, Expres, cam } from "../Suelta/comun";
import { C, Svg, xF, SUELO, PC, PIE, HY, B1, EL, ELLA, hombro, ikBrazo, cabeza, type Angulos, type Cara } from "./comun";

const PRESAS = [1700, 1765, 1850, 1930, 2010, 2105, 2190, 2280, 2370, 2460];
export const Via: React.FC = () => (
  <g>
    {PRESAS.map((y, i) => <g key={i}><ellipse cx={xF(y) + 12} cy={y} rx={22} ry={9} fill="#585F69" /><ellipse cx={xF(y) + 12} cy={y - 4} rx={18} ry={6} fill="#F1F3F5" opacity={0.35 + random(`pm${i}`) * 0.4} /></g>)}
    {HY.map((y, i) => <Expres key={i} y={y} />)}
  </g>
);
/** La 1.ª cinta otra vez, por delante de la escaladora (su pie la taparía). */
export const Chapa1: React.FC = () => <Expres y={HY[0]} />;
export const Mundo: React.FC<{ children: React.ReactNode }> = ({ children }) => <><Cueva chapas={0} /><Via />{children}</>;
export const Plano: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = ({ cx, cy, z, sh = 0, children }) => (
  <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.7}px)` }}>
    <Svg><Fondo cx={cx} cy={cy} z={z} /><g transform={cam(cx, cy, z)}><Mundo>{children}</Mundo></g></Svg>
  </AbsoluteFill>
);

/* ---- cuerda ---- */
export type Pt = { x: number; y: number; sag?: number; sx?: number };
const dSoga = (pts: Pt[]) => pts.map((p, i) => { if (!i) return `M${p.x} ${p.y}`; const q = pts[i - 1]; return `Q${(p.x + q.x) / 2 + (p.sx ?? 0)} ${(p.y + q.y) / 2 + (p.sag ?? 0)} ${p.x} ${p.y}`; }).join(" ");
/** Cuerda por puntos; `sag`/`sx` de cada punto = comba del tramo que LLEGA a él. `brillo` ilumina desde el punto `desde`. */
export const Soga: React.FC<{ pts: Pt[]; brillo?: number; desde?: number; w?: number; fantasma?: boolean }> = ({ pts, brillo = 0, desde = 0, w = 10, fantasma }) => {
  const d = dSoga(pts);
  if (fantasma) return <path d={d} stroke={PC.miedo} strokeWidth={7} fill="none" strokeDasharray="16 14" strokeLinecap="round" opacity={0.9} />;
  return (
    <g>
      {brillo > 0 && <path d={dSoga(pts.slice(desde))} stroke="#FFE3A0" strokeWidth={34} opacity={0.5 * brillo} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#FFB27F" strokeWidth={2.5} fill="none" strokeDasharray="9 11" opacity={0.7} />
    </g>
  );
};

/* ---- quien asegura ---- */
export const apDe = (x: number, dy = 0) => ({ x: x + 22, y: PIE - 14 + dy });
/** `comba` 0–1 = cuerda floja hasta la 1.ª chapa · `feed` 0–1 = la mano guía empuja cuerda · `paso` = fase al andar · `alza` = mira arriba. */
export const Aseg: React.FC<{ x: number; dy?: number; cara?: Cara; comba?: number; feed?: number; paso?: number; alza?: number; pilaDx?: number; pilaR?: number }> = ({ x, dy = 0, cara = "normal", comba = 0.1, feed = 0, paso = 0, alza = 0, pilaDx = 120, pilaR = 1 }) => {
  const TO = -6, s = Math.sin(paso), hip = { x, y: PIE + dy - Math.abs(s) * 5 }, ap = apDe(x, hip.y - PIE), sh = hombro(TO);
  const ctrl = { x: (ap.x + B1.x) / 2, y: (ap.y + B1.y) / 2 + comba * 260 };
  const q = (t: number) => ({ x: (1 - t) ** 2 * ap.x + 2 * (1 - t) * t * ctrl.x + t * t * B1.x, y: (1 - t) ** 2 * ap.y + 2 * (1 - t) * t * ctrl.y + t * t * B1.y });
  const tg = (62 + feed * 44) / Math.max(120, Math.hypot(B1.x - ap.x, B1.y - ap.y)), guia = q(tg), freno = { x: ap.x + 10, y: ap.y + 14 };
  const brazoB = ikBrazo(TO, guia.x - hip.x, guia.y - hip.y, -1), brazoA = ikBrazo(TO, freno.x - hip.x, freno.y - hip.y, 1);
  const pl = { x: x + pilaDx, y: SUELO - 8 };
  const rizos = Array.from({ length: 7 }, (_, i) => ({ cx: pl.x + (random(`rz${i}`) - 0.5) * 50 * pilaR, cy: pl.y - i * 5, rx: (62 - i * 3 + random(`rw${i}`) * 10) * pilaR, ry: 16 + random(`rh${i}`) * 4, r: (random(`rr${i}`) - 0.5) * 16 }));
  const cu = (d: string, w = 9) => <><path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" /><path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" /></>;
  return (
    <g>
      <ellipse cx={pl.x} cy={pl.y + 8} rx={80 * pilaR} ry={16} fill="#1F2328" opacity={0.6} />
      {rizos.map((z, i) => <g key={i} transform={`rotate(${z.r} ${z.cx} ${z.cy})`}><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerdaS} strokeWidth={13} /><ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} fill="none" stroke={C.cuerda} strokeWidth={9} /></g>)}
      <Escalador x={hip.x} y={hip.y} quien="simon" angulos={{ torso: TO, cabeza: -32 - alza * 16, brazoA, brazoB, piernaA: [12 + 26 * s, -14 * Math.max(0, -s)], piernaB: [-10 - 26 * s, -14 * Math.max(0, s)] }} cara={cara} aspecto={EL} mira={1} sombra={SUELO} />
      <Soga pts={[ap, { ...B1, sag: comba * 260 }]} />
      {cu(`M${ap.x} ${ap.y} L${freno.x} ${freno.y}`)}
      {cu(`M${freno.x} ${freno.y} C${freno.x + 30} ${freno.y + 70} ${pl.x - 40} ${pl.y - 90} ${pl.x - 10} ${pl.y - 14}`)}
      <rect x={ap.x - 12} y={ap.y - 10} width={22} height={26} rx={6} fill="#B8C0C8" stroke={PC.tinta} strokeWidth={4} />
      <circle cx={freno.x} cy={freno.y} r={13} fill={EL.piel} stroke={PC.tinta} strokeWidth={4} />
      <circle cx={guia.x} cy={guia.y} r={12} fill={EL.piel} stroke={PC.tinta} strokeWidth={4} />
    </g>
  );
};

export const Ella: React.FC<{ p: { x: number; y: number }; ang: Angulos; cara?: Cara; rot?: number; tiembla?: number; sombra?: boolean }> = ({ p, ang, cara = "miedo", rot = 0, tiembla = 0, sombra }) => (
  <Escalador x={p.x + tiembla} y={p.y} quien="joe" angulos={ang} cara={cara} aspecto={ELLA} rot={rot} mira={1} sombra={sombra ? SUELO : undefined} />
);

/** Polvo del impacto. k = fotogramas desde el golpe. */
export const Polvo: React.FC<{ x: number; k: number }> = ({ x, k }) => k < 0 || k > 30 ? null : (
  <g opacity={0.75 * (1 - k / 30)}>
    {Array.from({ length: 8 }).map((_, i) => { const dir = i % 2 ? 1 : -1, v = 4 + random(`pv${i}`) * 5; return <ellipse key={i} cx={x + dir * (20 + k * v)} cy={SUELO - 6 - k * (0.6 + random(`pu${i}`) * 1.6)} rx={22 + k * 2.2} ry={14 + k * 1.3} fill={i % 3 ? "#B9B2A6" : "#8D887F"} />; })}
  </g>
);

/** Dientes apretando la cuerda (encima de la cara «esfuerzo») o boca abierta con hueco tras perder el diente. */
export const Mordida: React.FC<{ p: { x: number; y: number }; ang: Angulos; hueco?: boolean }> = ({ p, ang, hueco }) => {
  const c = cabeza(ang);
  return (
    <g transform={`translate(${p.x + c.x} ${p.y + c.y}) rotate(${c.rot})`}>
      {hueco && <ellipse cx={9} cy={20} rx={13} ry={9} fill={PC.tinta} />}
      <rect x={-3} y={hueco ? 12 : 14} width={22} height={hueco ? 7 : 9} rx={2} fill="#fff" stroke={PC.tinta} strokeWidth={2.5} />
      {[3, 9, 14].map((x) => <path key={x} d={`M${x} ${hueco ? 12 : 14} v${hueco ? 7 : 9}`} stroke={PC.tinta} strokeWidth={1.5} />)}
      {hueco && <rect x={9.5} y={12.5} width={5} height={7} fill={PC.tinta} />}
    </g>
  );
};
/** Diente que sale volando (k = fotogramas desde que salta), con destello. */
export const Diente: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  if (k < 0) return null;
  const px = x + 7 * k, py = y - 15 * k + 0.75 * k * k, s = 1.7;
  return (
    <g>
      {k < 9 && <g transform={`translate(${x + 10} ${y}) rotate(${k * 12}) scale(${1 + k * 0.35})`} opacity={1 - k / 9}><path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" fill="#fff" /></g>}
      <g transform={`translate(${px} ${py}) rotate(${k * 37}) scale(${s})`}>
        <path d="M-7 -8 Q0 -13 7 -8 L6 2 Q4 11 2 3 Q0 0 -2 3 Q-4 11 -6 2 Z" fill="#fff" stroke={PC.tinta} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M-3 -7 Q0 -9 3 -7" stroke="#C9D3DD" strokeWidth={1.6} fill="none" />
      </g>
    </g>
  );
};
