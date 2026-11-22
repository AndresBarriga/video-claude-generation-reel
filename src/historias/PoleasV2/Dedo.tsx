// E68 · el dedo en «radiografía»: huesos que brillan, tendón flexor naranja y poleas (A1–A4) como anillos.
// Pose interpolada entre ABIERTO (k=0) y ARQUEO (k=1). En arqueo el tendón se separa del hueso en la PIP (cuerda de arco)
// y la A2 carga. `roto` rompe la A2 (dos mitades que saltan y el tendón se despega).
import React from "react";

export type Pt = { x: number; y: number };
const rad = (a: number) => (a * Math.PI) / 180;
const pt = (p: Pt, a: number, l: number): Pt => ({ x: p.x + Math.cos(rad(a)) * l, y: p.y + Math.sin(rad(a)) * l });
const mixN = (a: number, b: number, t: number) => a + (b - a) * t;
const L = { meta: 430, prox: 340, med: 235, dist: 175 }, R = 42;

/** Ángulos (grados, y hacia abajo). Vista de perfil con la pared a la IZQUIERDA: la yema sobre el canto, el nudillo (PIP) arriba
 *  y la mano/antebrazo colgando hacia abajo a la derecha (el peso tira hacia abajo). */
export const pose = (k: number) => {
  const a1 = mixN(214, 236, k), a2 = a1 - mixN(38, 116, k), a3 = a2 - mixN(28, -56, k);
  return { a1, a2, a3 };
};
export const geom = (k: number, mcp: Pt = { x: 720, y: 1150 }) => {
  const { a1, a2, a3 } = pose(k), a0 = a1 + 14;
  const meta0 = pt(mcp, a0 + 180, L.meta), pip = pt(mcp, a1, L.prox), dip = pt(pip, a2, L.med), tip = pt(dip, a3, L.dist), codo = pt(meta0, a0 + 180 - 8, 520);
  return { a0, a1, a2, a3, meta0, mcp, pip, dip, tip, codo };
};
/** Normal hacia la palma (lado de flexión). */
const palma = (a: number): Pt => ({ x: Math.sin(rad(a)), y: -Math.cos(rad(a)) });
const off = (p: Pt, a: number, d: number): Pt => { const n = palma(a); return { x: p.x + n.x * d, y: p.y + n.y * d }; };
const lerp = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

const Hueso: React.FC<{ a: Pt; b: Pt; r: number; glow: number }> = ({ a, b, r, glow }) => {
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI, len = Math.hypot(b.x - a.x, b.y - a.y);
  return (
    <g transform={`translate(${a.x} ${a.y}) rotate(${ang})`}>
      <rect x={6} y={-r} width={len - 12} height={r * 2} rx={r} fill="#CFEFFF" opacity={0.18 + 0.25 * glow} />
      <rect x={6} y={-r} width={len - 12} height={r * 2} rx={r} fill="none" stroke="#9FE3FF" strokeWidth={5} />
      <rect x={14} y={-r * 0.38} width={len - 28} height={r * 0.76} rx={r * 0.38} fill="#E8FAFF" opacity={0.55} />
    </g>
  );
};
/** Anillo de polea sobre un segmento a-b, entre las fracciones t0 y t1. calor 0→1 = amarillo→rojo. */
const Anillo: React.FC<{ a: Pt; b: Pt; t0: number; t1: number; calor: number; roto?: number; fino?: boolean; label?: string; rot?: number }> = ({ a, b, t0, t1, calor, roto = 0, fino, label, rot = 0 }) => {
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI, len = Math.hypot(b.x - a.x, b.y - a.y), x0 = len * t0, w = len * (t1 - t0);
  const col = calor > 0.5 ? `rgb(255,${Math.round(200 - 150 * (calor - 0.5) * 2)},70)` : `rgb(255,${Math.round(214 - 14 * calor * 2)},${Math.round(90 - 20 * calor)})`;
  const h = R + 22, sep = roto * 260;
  const banda = (dy: number, op: number, x = x0, ww = w) => <g transform={`translate(0 ${dy})`} opacity={op}>
    <rect x={x} y={-h} width={ww} height={h * 2} rx={14} fill={col} opacity={fino ? 0.35 : 0.85} stroke="#FFF3C4" strokeWidth={fino ? 3 : 6} />
    {!fino && Array.from({ length: Math.max(2, Math.round(ww / 26)) }).map((_, i) => <path key={i} d={`M${x + 10 + i * 26} ${-h + 8} V${h - 8}`} stroke="rgba(120,40,0,.35)" strokeWidth={5} />)}
  </g>;
  return (
    <g transform={`translate(${a.x} ${a.y}) rotate(${ang})`}>
      {roto <= 0 ? banda(0, 1) : <>
        <g transform={`translate(${-sep * 0.4} ${-sep * 0.2}) rotate(${-25 * roto} ${x0} 0)`}>{banda(0, 1 - roto * 0.6, x0, w / 2 - 4)}</g>
        <g transform={`translate(${sep * 0.5} ${sep * 0.6}) rotate(${30 * roto} ${x0 + w} 0)`}>{banda(0, 1 - roto * 0.6, x0 + w / 2 + 4, w / 2 - 4)}</g>
      </>}
      {label && <g transform={`translate(${x0 + w / 2} ${h + 60}) rotate(${-ang + rot})`}><rect x={-60} y={-38} width={120} height={72} rx={18} fill="#14213A" stroke="#FFF3C4" strokeWidth={4} /><text y={17} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={900} fontSize={50} fill="#FFE07A">{label}</text></g>}
    </g>
  );
};

export type DedoProps = { k: number; xray?: number; calor?: number; roto?: number; etiquetas?: number; glowA2?: number; flechas?: number; regleta?: boolean };
/** Dibujo completo en coordenadas de pantalla (1080×1920). */
export const Dedo: React.FC<DedoProps> = ({ k, xray = 1, calor = 0, roto = 0, etiquetas = 0, glowA2 = 0, flechas = 0, regleta = true }) => {
  const g = geom(k), piel = 1 - xray;
  // tendón: por el lado palmar; en arqueo hace cuerda entre el final de la A2 y el inicio de la A4
  const d0 = R + 12;
  const a2fin = lerp(g.mcp, g.pip, 0.68), a4ini = lerp(g.pip, g.dip, 0.3), cuerda = k * (1 + roto * 1.6);
  const pA = off(lerp(g.meta0, g.mcp, 0.2), g.a0, d0), pB = off(g.mcp, (g.a0 + g.a1) / 2, d0 + 4), pC = off(a2fin, g.a1, d0);
  const pip2 = off(g.pip, (g.a1 + g.a2) / 2, d0 + 6), cuerdaPt = lerp(pip2, off(g.pip, (g.a1 + g.a2) / 2, d0 + 60), cuerda);
  const pD = off(a4ini, g.a2, d0), pE = off(lerp(g.pip, g.dip, 0.95), g.a2, d0 - 4), pF = off(lerp(g.dip, g.tip, 0.4), g.a3, R * 0.6);
  const tend = `M${pA.x} ${pA.y} L${pB.x} ${pB.y} L${pC.x} ${pC.y} Q${cuerdaPt.x} ${cuerdaPt.y} ${pD.x} ${pD.y} L${pE.x} ${pE.y} L${pF.x} ${pF.y}`;
  const n2 = palma(g.a1), fA2 = lerp(g.mcp, g.pip, 0.5);
  const contorno = [g.meta0, g.mcp, g.pip, g.dip, g.tip];
  return (
    <g>
      {regleta && <g><rect x={-400} y={-200} width={g.tip.x - 26 + 400} height={2600} fill="#22356E" /><rect x={g.tip.x - 26} y={-200} width={10} height={2600} fill="#5B7BD0" opacity={0.6} /><path d={`M${g.tip.x - 26} ${g.tip.y + 40} h96 q14 0 14 14 v40 q0 10 -10 12 L${g.tip.x - 26} ${g.tip.y + 150} Z`} fill="#F2A65A" /><path d={`M${g.tip.x - 26} ${g.tip.y + 40} h96`} stroke="#FFD3A1" strokeWidth={10} /></g>}
      {/* piel: trazo grueso redondeado */}
      <path d={`M${g.codo.x} ${g.codo.y} L${g.meta0.x} ${g.meta0.y} L${g.mcp.x} ${g.mcp.y}`} stroke={`rgba(255,214,184,${0.95 * piel + 0.13 * xray})`} strokeWidth={250} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${contorno.map((p) => `${p.x} ${p.y}`).join(" L")}`} stroke={`rgba(255,214,184,${0.95 * piel + 0.16 * xray})`} strokeWidth={190} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${contorno.map((p) => `${p.x} ${p.y}`).join(" L")}`} stroke={`rgba(150,220,255,${0.5 * xray})`} strokeWidth={210} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ mixBlendMode: "screen" }} opacity={0.25} />
      <g opacity={0.15 + 0.85 * xray}>
        <Hueso a={g.meta0} b={g.mcp} r={R + 4} glow={xray} />
        <Hueso a={g.mcp} b={g.pip} r={R} glow={xray} />
        <Hueso a={g.pip} b={g.dip} r={R - 4} glow={xray} />
        <Hueso a={g.dip} b={g.tip} r={R - 7} glow={xray} />
        <path d={tend} stroke="#FF8A2E" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={tend} stroke="#FFD08A" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
        <Anillo a={g.meta0} b={g.mcp} t0={0.86} t1={0.98} calor={0} fino label={etiquetas > 0.5 ? undefined : undefined} />
        <Anillo a={g.mcp} b={g.pip} t0={0.3} t1={0.68} calor={calor} roto={roto} label={etiquetas > 0 ? "A2" : undefined} />
        <Anillo a={g.pip} b={g.dip} t0={0.02} t1={0.14} calor={0} fino />
        <Anillo a={g.pip} b={g.dip} t0={0.3} t1={0.62} calor={calor * 0.5} label={etiquetas > 0 ? "A4" : undefined} rot={0} />
        {glowA2 > 0 && <circle cx={fA2.x + n2.x * 40} cy={fA2.y + n2.y * 40} r={90 + 30 * glowA2} fill="#FFB347" opacity={0.35 * glowA2} style={{ filter: "blur(18px)" }} />}
        {flechas > 0 && [0, 1, 2].map((i) => { const b = lerp(g.mcp, g.pip, 0.36 + i * 0.13), s = off(b, g.a1, R + 40), e2 = off(b, g.a1, R + 40 + 120 * flechas); return <g key={i} opacity={flechas}><path d={`M${s.x} ${s.y} L${e2.x} ${e2.y}`} stroke="#FF4D3D" strokeWidth={22} strokeLinecap="round" /><circle cx={e2.x} cy={e2.y} r={18} fill="#FF4D3D" /></g>; })}
      </g>
    </g>
  );
};
