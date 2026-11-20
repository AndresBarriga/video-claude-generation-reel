// El gato en CORTE, de perfil (punta a la derecha), dibujado en centímetros reales: úsalo dentro de <g transform="translate(x y) scale(pxPorCm)">.
// Origen = talón, a ras de la plantilla (y negativa = arriba). Pie de la talla 43 ≈ 27 cm; gato del 40 ≈ 25 cm por dentro.
import React, { useId } from "react";
import { G, T } from "./comun";

const rad = (g: number) => (g * Math.PI) / 180;
const MTP = { x: 19.4, y: -1.7 };
/** Dedo gordo: `g` 0 = estirado, 1 = en garra (nudillo arriba, punta abajo). Devuelve nudillo K, yema Y y hasta dónde llega (punta). */
export const dedo = (g: number) => {
  const th = rad(38 * g), K = { x: MTP.x + 3.5 * Math.cos(th), y: MTP.y - 3.5 * Math.sin(th) };
  const ph = Math.asin(Math.min(0.985, (3.5 * Math.sin(th) + 0.5) / 3.2)), Y = { x: K.x + 3.2 * Math.cos(ph), y: K.y + 3.2 * Math.sin(ph) };
  return { K, Y, punta: Y.x + 1 };
};
/** Garra necesaria para que un pie de 27 cm quepa en un gato de `L` cm por dentro. */
export const garraPara = (L: number) => { let a = 0, b = 1.25; for (let i = 0; i < 24; i++) { const m = (a + b) / 2; if (dedo(m).punta > L - 0.1) a = m; else b = m; } return Math.max(0, Math.min(1.25, b)); };

/** Pie en corte: piel + huesos. `dolor` 0–1 = rojo palpitando en nudillo y yema. `pierna` = largo de pierna visible (cm). */
export const Pie: React.FC<{ g: number; dolor?: number; pulso?: number; pierna?: number; pantalon?: string }> = ({ g, dolor = 0, pulso = 1, pierna = 40, pantalon = "#2E3440" }) => {
  const d = dedo(g), id = "pd" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const cuerpo = `M0.6 -0.3 C-0.7 -0.7 -1 -3.4 0.3 -5.4 L1.5 -9.5 L1.5 ${-pierna} L8.7 ${-pierna} L8.5 -11.5 C8.7 -9 10.6 -7.6 13 -6.5 L19.3 -3.3 L20.2 -0.25 C17 0.25 15 -0.2 13 -0.9 C10 -1.7 7 -1.25 5 -0.2 C3 0.25 1.6 0.1 0.6 -0.3 Z`;
  const falange = (w: number, col: string, extra = 0) => (<>
    <path d={`M${MTP.x} ${MTP.y} L${d.K.x} ${d.K.y}`} stroke={col} strokeWidth={w + 0.5 + extra} strokeLinecap="round" />
    <path d={`M${d.K.x} ${d.K.y} L${d.Y.x} ${d.Y.y}`} stroke={col} strokeWidth={w + extra} strokeLinecap="round" />
  </>);
  const hueso = (x1: number, y1: number, x2: number, y2: number, w: number) => (<g>
    <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={G.hueso} strokeWidth={w} strokeLinecap="round" />
    <circle cx={x1} cy={y1} r={w * 0.72} fill={G.hueso} /><circle cx={x2} cy={y2} r={w * 0.66} fill={G.hueso} />
  </g>);
  const u = (p: { x: number; y: number }, q: { x: number; y: number }, t: number) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
  const p1 = u(MTP, d.K, 0.14), p2 = u(MTP, d.K, 0.86), q1 = u(d.K, d.Y, 0.16), q2 = u(d.K, d.Y, 0.92);
  return (
    <g>
      <defs><radialGradient id={id}><stop offset="0" stopColor={G.dolor} stopOpacity="0.95" /><stop offset="1" stopColor={G.dolor} stopOpacity="0" /></radialGradient></defs>
      {/* contorno */}
      <path d={cuerpo} fill={T} stroke={T} strokeWidth={0.34} strokeLinejoin="round" />{falange(2.3, T, 0.34)}
      {/* piel */}
      <path d={cuerpo} fill={G.piel} />{falange(2.3, G.piel)}
      <path d={`M1.5 ${-pierna} L1.5 -9.5 L0.3 -5.4 C-0.7 -3.4 -0.6 -0.9 0.6 -0.3 C1.6 0.1 3 0.25 5 -0.2 C3.4 -1.2 2.6 -4 3 -9 L3 ${-pierna} Z`} fill={G.pielS} opacity={0.55} />
      {/* uña */}
      <path d={`M${d.Y.x + 0.2} ${d.Y.y - 0.98} q0.75 0.1 0.8 0.75`} stroke="#F6DCC6" strokeWidth={0.32} fill="none" strokeLinecap="round" />
      {/* huesos */}
      <g opacity={0.92}>
        <rect x={3.7} y={-pierna} width={2.7} height={pierna - 8.2} rx={1.2} fill={G.hueso} />
        <ellipse cx={5.9} cy={-6.7} rx={2.35} ry={1.6} fill={G.hueso} /><ellipse cx={3} cy={-3.3} rx={3} ry={1.9} fill={G.hueso} transform="rotate(-14 3 -3.3)" />
        <ellipse cx={9.7} cy={-5.2} rx={2} ry={1.45} fill={G.hueso} transform="rotate(18 9.7 -5.2)" />
        {hueso(11.6, -4.5, 18.6, -2.05, 1.05)}{hueso(p1.x, p1.y, p2.x, p2.y, 0.86)}{hueso(q1.x, q1.y, q2.x, q2.y, 0.72)}
      </g>
      {dolor > 0 && <g opacity={dolor * (0.55 + 0.45 * pulso)}>
        <circle cx={d.K.x} cy={d.K.y - 0.4} r={3 + 0.8 * pulso} fill={`url(#${id})`} /><circle cx={d.Y.x + 0.3} cy={d.Y.y} r={2.5 + 0.6 * pulso} fill={`url(#${id})`} />
        <circle cx={1} cy={-3.2} r={2.6 + 0.5 * pulso} fill={`url(#${id})`} opacity={0.7} />
      </g>}
      {/* bajo del pantalón */}
      <path d={`M0.4 ${-pierna} L0.6 -14.2 Q5 -12.6 9.7 -14.4 L9.8 ${-pierna} Z`} fill={pantalon} stroke={T} strokeWidth={0.3} />
      <path d="M0.6 -14.2 Q5 -12.6 9.7 -14.4" stroke="#fff" strokeOpacity={0.18} strokeWidth={0.5} fill="none" />
    </g>
  );
};

/** Contorno del gato para un interior de `L` cm y una garra `g` (el empeine se abulta sobre el nudillo). */
const forma = (L: number, g: number) => {
  const d = dedo(g), yT = Math.min(-3.5, d.K.y - 1.95), xT = Math.min(L - 2.3, d.K.x);
  return { d, yT, xT, camino: `M-0.9 0.55 L${L - 0.9} 0.55 Q${L + 0.95} 0.55 ${L + 0.9} -0.95 Q${L + 0.75} -2.7 ${L - 1.1} ${Math.max(yT, -3.3) + 0.25} Q${(xT + L - 1.1) / 2} ${yT - 0.25} ${xT} ${yT} L10.5 -8.7 Q7 -9.5 3.3 -8.5 L0.5 -8.1 Q-1.7 -6 -1.35 -3 Q-1.45 0.3 -0.9 0.55 Z` };
};

/** Gato en corte: carcasa (se ve el interior oscuro), goma negra en suela, puntera y talón, dos velcros, tiradores. El pie va como `children`. */
export const Gato: React.FC<{ L: number; g: number; children?: React.ReactNode; aplasta?: number; hueco?: boolean; dobla?: number; halo?: string; haloO?: number; precio?: number | null }> = ({ L, g, children, aplasta = 0, hueco, dobla = 0, halo, haloO = 0, precio = null }) => {
  const { camino, yT, xT, d } = forma(L, g), id = "gt" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const xc = L - 1.7; // por dónde se dobla la punta vacía
  const emp = (t: number) => ({ x: 10.5 + (xT - 10.5) * t, y: -8.7 + (yT + 8.7) * t });
  const velcro = (a: number, b: number) => { const p = emp(a), q = emp(b); return <g><path d={`M${p.x} ${p.y} L${q.x} ${q.y}`} stroke={G.goma} strokeWidth={1.25} strokeLinecap="round" /><path d={`M${p.x} ${p.y} L${q.x} ${q.y}`} stroke="#3A4250" strokeWidth={0.5} strokeLinecap="round" strokeDasharray="0.3 0.5" /></g>; };
  const cuerpo = (
    <g transform={`scale(${1 + 0.04 * aplasta} ${1 - 0.07 * aplasta})`}>
      {halo && haloO > 0 && <path d={camino} fill="none" stroke={halo} strokeWidth={2.6} opacity={0.35 * haloO} strokeLinejoin="round" />}
      {/* tiradores del talón */}
      <path d="M0.3 -8 q-2 -3.2 0.5 -3.9 q1.6 0.1 0.9 3.6" stroke={T} strokeWidth={1} fill="none" /><path d="M0.3 -8 q-2 -3.2 0.5 -3.9 q1.6 0.1 0.9 3.6" stroke={G.gatoS} strokeWidth={0.55} fill="none" />
      {/* carcasa: interior oscuro + pared de la zapatilla */}
      <path d={camino} fill={G.dentro} stroke={T} strokeWidth={1.45} strokeLinejoin="round" />
      {hueco && <path d={`M27.15 -2.5 L${L - 0.9} -2.6 Q${L + 0.55} -2.2 ${L + 0.5} -0.9 Q${L + 0.5} 0.1 ${L - 0.6} 0.15 L27.15 0.1 Q28.3 -1.2 27.15 -2.5 Z`} fill={G.hueco} opacity={0.85} />}
      {children}
      <path d={camino} fill="none" stroke={G.gato} strokeWidth={0.92} strokeLinejoin="round" />
      <path d={camino} fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={0.16} strokeLinejoin="round" transform="translate(0 -0.16)" />
      {velcro(0.2, 0.44)}{velcro(0.54, 0.8)}
      {/* goma: suela, puntera y talonera */}
      <path d={`M-0.9 0.62 L${L - 0.9} 0.62 Q${L + 1} 0.62 ${L + 0.95} -0.95`} stroke={G.goma} strokeWidth={0.95} fill="none" strokeLinecap="round" />
      <path d={`M${L - 5.2} 0.5 L${L - 0.9} 0.5 Q${L + 0.9} 0.5 ${L + 0.85} -0.95 Q${L + 0.7} -2.6 ${L - 1.1} ${Math.max(yT, -3.3) + 0.25}`} stroke={G.goma} strokeWidth={1.05} fill="none" strokeLinecap="round" />
      <path d="M2.6 0.5 L-0.9 0.5 Q-1.45 0.3 -1.35 -3 Q-1.6 -5 -0.6 -6.6" stroke={G.goma} strokeWidth={1.05} fill="none" strokeLinecap="round" />
      <path d={`M${L - 4.6} 0.1 L${L - 1} 0.1`} stroke="#fff" strokeOpacity={0.18} strokeWidth={0.14} strokeLinecap="round" />
      {precio !== null && <g transform={`translate(0.9 -11.7) rotate(${precio + 10})`}>
        <path d="M0 0 L0.3 3.2" stroke="#E9E2D0" strokeWidth={0.14} />
        <g transform="translate(0.3 3.2)"><rect x={-3.3} y={0} width={6.6} height={4} rx={0.5} fill="#F3ECDA" stroke={T} strokeWidth={0.3} /><circle cx={0} cy={0.6} r={0.3} fill={T} />
          <text x={0} y={3.2} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={2.3} fill={T}>150 €</text></g>
      </g>}
    </g>
  );
  if (dobla <= 0) return cuerpo;
  return (
    <g>
      <defs><clipPath id={id + "a"}><rect x={-10} y={-60} width={xc + 10} height={80} /></clipPath><clipPath id={id + "b"}><rect x={xc} y={-60} width={20} height={80} /></clipPath></defs>
      <g clipPath={`url(#${id}a)`}>{cuerpo}</g>
      <g transform={`rotate(${-34 * dobla} ${xc} 0.6)`}><g clipPath={`url(#${id}b)`}>{cuerpo}</g></g>
    </g>
  );
};

/** Granito en macro: pared a la derecha con un canto de 2,3 mm (el grosor de una moneda de 1 €). `x` = donde toca la puntera, `y` = altura del canto. */
export const Canto: React.FC<{ x: number; y?: number; seed?: string }> = ({ x, y = 0.6, seed = "c" }) => {
  const r = (i: number, k: string) => { const v = Math.sin((i + 1) * 12.9898 + k.length * 78.233 + seed.length) * 43758.5453; return v - Math.floor(v); };
  const cara = `M${x} -30 L${x + 0.05} ${y - 2.2} L${x - 0.02} ${y - 0.05} L${x - 0.25} ${y} L${x - 0.17} ${y + 0.22} L${x + 0.06} ${y + 0.75} L${x + 0.3} ${y + 6} L${x + 0.9} 30 L${x + 30} 30 L${x + 30} -30 Z`;
  return (
    <g>
      <path d={cara} fill="#8D97A3" />
      {Array.from({ length: 90 }).map((_, i) => { const px = x + 0.3 + r(i, "x") * 9, py = -9 + r(i, "yy") * 18, s = 0.06 + r(i, "sss") * 0.2; return <ellipse key={i} cx={px} cy={py} rx={s * 1.4} ry={s} fill={i % 3 === 0 ? "#2B323C" : i % 3 === 1 ? "#D9DEE4" : "#C4A99B"} opacity={0.55} transform={`rotate(${r(i, "rrrr") * 180} ${px} ${py})`} />; })}
      <path d={`M${x + 1.4} -9 q0.5 4 -0.2 8 t0.5 9`} stroke="#5E6772" strokeWidth={0.12} fill="none" opacity={0.7} />
      <path d={cara} fill="none" stroke={T} strokeWidth={0.16} strokeLinejoin="round" />
      <path d={`M${x + 0.05} ${y - 2.2} L${x - 0.02} ${y - 0.05} L${x - 0.25} ${y}`} stroke="#E6EDF3" strokeWidth={0.1} fill="none" opacity={0.9} />
    </g>
  );
};
