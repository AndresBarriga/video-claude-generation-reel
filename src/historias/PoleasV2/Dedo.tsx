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
export const geom = (k: number, mcp: Pt = { x: 720, y: 1150 }, sc = 1) => {
  const { a1, a2, a3 } = pose(k), a0 = a1 + 14;
  const meta0 = pt(mcp, a0 + 180, L.meta), pip = pt(mcp, a1, L.prox * sc), dip = pt(pip, a2, L.med * sc), tip = pt(dip, a3, L.dist * sc), codo = pt(meta0, a0 + 180 - 8, 520);
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

export type DedoProps = { k: number; xray?: number; calor?: number; roto?: number; etiquetas?: number; glowA2?: number; flechas?: number; regleta?: boolean; mano?: boolean };
/** Dibujo completo en coordenadas de pantalla (1080×1920). */
export const Dedo: React.FC<DedoProps> = ({ k, xray = 1, calor = 0, roto = 0, etiquetas = 0, glowA2 = 0, flechas = 0, regleta = true, mano = true }) => {
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
      {regleta && <g><defs><linearGradient id="pared" x1="0" x2="1"><stop offset="0" stopColor="#3F67C9" /><stop offset="1" stopColor="#2F51A8" /></linearGradient></defs>
        <rect x={-600} y={-400} width={g.tip.x - 40 + 600} height={3000} fill="url(#pared)" />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={g.tip.x - 140 - (i % 2) * 120} cy={500 + i * 260} r={16} fill="#22356E" opacity={0.6} />)}
        <path d={`M${g.tip.x - 40} ${g.tip.y + 44} h140 q16 0 16 16 v40 q0 14 -16 14 h-140 Z`} fill="#F59E0B" stroke="#B45309" strokeWidth={6} />
        <path d={`M${g.tip.x - 40} ${g.tip.y + 46} h128`} stroke="#FCD34D" strokeWidth={10} strokeLinecap="round" /></g>}
      {mano ? <Mano k={k} xray={xray} /> : <path d={`M${contorno.map((p) => `${p.x} ${p.y}`).join(" L")}`} stroke="rgba(255,214,184,.18)" strokeWidth={190} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {xray > 0 && <path d={`M${contorno.map((p) => `${p.x} ${p.y}`).join(" L")}`} stroke={`rgba(140,210,255,${0.22 * xray})`} strokeWidth={200} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      <g opacity={xray}>
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

/** Capa de piel con brillo: un dedo como tres «salchichas» con luz en el dorso y sombra en la palma, y uña. */
const PIEL = { base: "#F2B48C", luz: "#FFD9BF", sombra: "#C97F5B", una: "#FFE4E1" };
const Seg: React.FC<{ a: Pt; b: Pt; w: number; ang: number; tono?: number }> = ({ a, b, w, ang, tono = 0 }) => {
  const n = palma(ang), d = `M${a.x} ${a.y} L${b.x} ${b.y}`, oscuro = (c: string) => { if (!tono) return c; const h = (i: number) => parseInt(c.slice(i, i + 2), 16), t = [0x3a, 0x20, 0x30]; return `rgb(${[1, 3, 5].map((i, j) => Math.round(h(i) * (1 - tono) + t[j] * tono)).join(',')})`; };
  return <g>
    <path d={d} stroke={oscuro(PIEL.sombra)} strokeWidth={w} strokeLinecap="round" />
    <path d={d} stroke={oscuro(PIEL.base)} strokeWidth={w * 0.84} strokeLinecap="round" transform={`translate(${-n.x * w * 0.06} ${-n.y * w * 0.06})`} />
    <path d={d} stroke={oscuro(PIEL.luz)} strokeWidth={w * 0.22} strokeLinecap="round" opacity={0.85} transform={`translate(${-n.x * w * 0.26} ${-n.y * w * 0.26})`} />
  </g>;
};
export const DedoPiel: React.FC<{ g: ReturnType<typeof geom>; w?: number; tono?: number; una?: boolean }> = ({ g, w = 120, tono = 0, una = true }) => {
  const c = (hex: string) => { if (!tono) return hex; const h = (i: number) => parseInt(hex.slice(i, i + 2), 16), t = [0x3a, 0x20, 0x30]; return `rgb(${[1, 3, 5].map((i, j) => Math.round(h(i) * (1 - tono) + t[j] * tono)).join(",")})`; };
  const pts = [g.mcp, g.pip, g.dip, g.tip], d = `M${pts.map((p) => `${p.x} ${p.y}`).join(" L")}`;
  const nd = [g.a1, (g.a1 + g.a2) / 2, (g.a2 + g.a3) / 2, g.a3].map((a, i) => { const n = palma(a); return { x: pts[i].x - n.x * w * 0.24, y: pts[i].y - n.y * w * 0.24 }; });
  const dl = `M${nd.map((p) => `${p.x} ${p.y}`).join(" L")}`, n = palma(g.a3), u = lerp(g.dip, g.tip, 0.7);
  return (
    <g>
      <path d={d} stroke={c(PIEL.sombra)} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={c(PIEL.base)} strokeWidth={w * 0.86} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={dl} stroke={c(PIEL.luz)} strokeWidth={w * 0.2} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.8} />
      {[g.pip, g.dip].map((p, i) => <path key={i} d={`M${p.x - 14} ${p.y - 4} q14 -10 28 0`} stroke={c(PIEL.sombra)} strokeWidth={5} fill="none" opacity={0.6} />)}
      {una && <g transform={`translate(${u.x - n.x * w * 0.4} ${u.y - n.y * w * 0.4}) rotate(${g.a3})`}><rect x={-38} y={-15} width={76} height={28} rx={13} fill={PIEL.una} stroke="#E0A090" strokeWidth={4} opacity={tono ? 0.6 : 1} /></g>}
    </g>
  );
};
/** Mano de perfil (lado del pulgar) colgando de la regleta: palma + antebrazo, 3 dedos detrás, pulgar encima del índice (arqueo cerrado). */
export const Mano: React.FC<{ k: number; xray: number; pulgar?: number }> = ({ k, xray }) => {
  const g = geom(k), atras = [0.92, 0.84, 0.7].map((sc, i) => geom(k, { x: g.mcp.x + 30 * (i + 1), y: g.mcp.y - 6 * (i + 1) }, sc)).reverse();
  const op = 1 - 0.55 * xray, palmaD = (x: number) => `M${g.codo.x} ${g.codo.y} L${g.meta0.x + x} ${g.meta0.y} L${g.mcp.x + 60 + x} ${g.mcp.y - 10}`;
  return (
    <g>
      <g opacity={op}>{atras.map((gg, i) => <DedoPiel key={i} g={gg} w={112 - i * 6} tono={0.3 + i * 0.08} una={false} />)}</g>
      <g opacity={op}>
        <path d={palmaD(0)} stroke={PIEL.sombra} strokeWidth={290} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={palmaD(0)} stroke={PIEL.base} strokeWidth={258} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${g.codo.x - 80} ${g.codo.y} L${g.meta0.x - 80} ${g.meta0.y - 10} L${g.mcp.x - 10} ${g.mcp.y - 50}`} stroke={PIEL.luz} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.55} />
      </g>
      <g opacity={1 - 0.8 * xray}><DedoPiel g={g} w={124} /></g>
    </g>
  );
};
