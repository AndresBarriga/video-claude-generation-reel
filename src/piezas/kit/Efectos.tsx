// KIT · efectos y datos en pantalla: polvo, diente, cota de medida, medidor y bocadillo.
import React from "react";
import { random } from "remotion";
import { PC } from "./base";
import { cabeza, type Angulos } from "./rig";

/** Polvo del impacto contra el suelo. k = fotogramas desde el golpe. */
export const Polvo: React.FC<{ x: number; k: number; suelo?: number }> = ({ x, k, suelo = 2650 }) => k < 0 || k > 30 ? null : (
  <g opacity={0.75 * (1 - k / 30)}>
    {Array.from({ length: 8 }).map((_, i) => { const dir = i % 2 ? 1 : -1, v = 4 + random(`pv${i}`) * 5; return <ellipse key={i} cx={x + dir * (20 + k * v)} cy={suelo - 6 - k * (0.6 + random(`pu${i}`) * 1.6)} rx={22 + k * 2.2} ry={14 + k * 1.3} fill={i % 3 ? "#B9B2A6" : "#8D887F"} />; })}
  </g>
);
/** Dientes apretando (encima de la cara «esfuerzo») o boca abierta con hueco tras perder el diente. p = cadera. */
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
/** Destello de impacto/tirón en un punto (k = fotogramas desde el golpe). */
export const Destello: React.FC<{ x: number; y: number; k: number; r?: number; color?: string }> = ({ x, y, k, r = 60, color = "#fff" }) => k < 0 || k > 8 ? null : (
  <g transform={`translate(${x} ${y}) rotate(${k * 9})`} opacity={1 - k / 8}>
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M0 ${-r * 0.35 - k * 4} L0 ${-r - k * 9}`} stroke={color} strokeWidth={9 - k} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
  </g>
);
/** Cota vertical que mide una caída: baja `largo` px desde (x, y); lo que pasa del suelo sale en rojo discontinuo. `texto` = «3 m». */
export const Cota: React.FC<{ x: number; y: number; largo: number; suelo?: number; texto?: string; color?: string }> = ({ x, y, largo, suelo = 2650, texto, color = "#fff" }) => {
  if (largo <= 0) return null;
  const fin = y + largo, corte = Math.min(fin, suelo), pasa = fin > suelo;
  const linea = (a: number, b: number, col: string, dash?: string) => <><path d={`M${x} ${a} V${b}`} stroke="#050B14" strokeWidth={22} strokeLinecap="round" /><path d={`M${x} ${a} V${b}`} stroke={col} strokeWidth={11} strokeLinecap="round" strokeDasharray={dash} /></>;
  const punta = `M${x - 26} ${fin - 22} L${x} ${fin + 14} L${x + 26} ${fin - 22}`;
  return (
    <g>
      {linea(y, corte, color)}{pasa && linea(suelo + 8, fin, PC.miedo, "4 16")}
      <path d={punta} stroke="#050B14" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={punta} stroke={pasa ? PC.miedo : color} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {texto && <text x={x - 34} y={y + Math.min(largo, corte - y) / 2 + 18} textAnchor="end" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={64} fill={color} stroke="#050B14" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">{texto}</text>}
    </g>
  );
};
/** Medidor de 0 a 1 (dato en pantalla, arriba). */
export const Medidor: React.FC<{ v: number; o?: number; texto?: string; color?: string }> = ({ v, o = 1, texto = "MIEDO", color = PC.miedo }) => (
  <div style={{ position: "absolute", top: 228, left: 140, right: 140, opacity: o }}>
    <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 40, color: "#fff", letterSpacing: 3, marginBottom: 10, textShadow: "0 3px 8px #000" }}>{texto}</div>
    <div style={{ height: 34, borderRadius: 20, background: "rgba(5,11,20,.7)", border: "4px solid #050B14", overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: "100%", background: color, borderRadius: 20 }} />
    </div>
  </div>
);
/** Bocadillo de voz (coordenadas de PANTALLA). s 0–1 = aparición. */
export const Bocadillo: React.FC<{ x: number; y: number; texto: string; s: number; cola?: "abajo" | "arriba" }> = ({ x, y, texto, s, cola = "abajo" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 1.5) }}>
    <div style={{ position: "relative", background: "#F7F4EE", border: "7px solid #081120", borderRadius: 40, padding: "18px 34px", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 64, color: "#081120", whiteSpace: "nowrap" }}>
      {texto}
      <div style={{ position: "absolute", left: "50%", [cola === "abajo" ? "bottom" : "top"]: -34, width: 0, height: 0, marginLeft: -22, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", [cola === "abajo" ? "borderTop" : "borderBottom"]: "36px solid #081120" } as React.CSSProperties} />
    </div>
  </div>
);
