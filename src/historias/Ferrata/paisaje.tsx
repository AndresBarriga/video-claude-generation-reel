// Kit de paisaje épico para E56: cielo por hora del día, cordilleras con nieve y luz lateral, bruma, bosques y agua.
// La luz viene del sol (izquierda o derecha según la escena): caras iluminadas y en sombra en cada pico.
import React from "react";
import { interpolateColors, random } from "remotion";

export type Hora = "alba" | "dia" | "tarde" | "ocaso";
export const CIELO: Record<Hora, { a: string; b: string; c: string; sol: string; luz: string; bruma: string }> = {
  alba: { a: "#35629C", b: "#E9A97E", c: "#FBE2BC", sol: "#FFF1CF", luz: "#FFD9A6", bruma: "#F6D9BC" },
  dia: { a: "#1F6CC0", b: "#6FB0E4", c: "#D8EEFA", sol: "#FFFBEA", luz: "#FFF6DA", bruma: "#CFE6F5" },
  tarde: { a: "#2F72B8", b: "#9CC6E6", c: "#F4E2C2", sol: "#FFF2CF", luz: "#FFE6B0", bruma: "#E9DCC8" },
  ocaso: { a: "#28356E", b: "#D9785A", c: "#FFC98A", sol: "#FFE2A0", luz: "#FFB873", bruma: "#F0A97F" },
};
export const mix = (a: string, b: string, t: number) => interpolateColors(t, [0, 1], [a, b]);

export const Cielo: React.FC<{ h: Hora; id: string; sol?: [number, number]; r?: number }> = ({ h, id, sol, r = 70 }) => {
  const c = CIELO[h];
  return (
    <g>
      <defs>
        <linearGradient id={`ci${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.a} /><stop offset="0.62" stopColor={c.b} /><stop offset="1" stopColor={c.c} /></linearGradient>
        <radialGradient id={`ha${id}`}><stop offset="0" stopColor={c.sol} stopOpacity="0.9" /><stop offset="0.25" stopColor={c.luz} stopOpacity="0.45" /><stop offset="1" stopColor={c.luz} stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-1500} y={-2500} width={4080} height={7000} fill={`url(#ci${id})`} />
      {sol && <><circle cx={sol[0]} cy={sol[1]} r={r * 9} fill={`url(#ha${id})`} /><circle cx={sol[0]} cy={sol[1]} r={r} fill={c.sol} /></>}
    </g>
  );
};

/** Ruido pequeño sobre un segmento (borde de roca, no dientes de sierra). */
const ruido = (seed: string, p: [number, number], q: [number, number], a: number, n = 7) =>
  Array.from({ length: n - 1 }, (_, i) => { const t = (i + 1) / n; return [p[0] + (q[0] - p[0]) * t + (random(`${seed}rx${i}`) - 0.5) * a * 0.6, p[1] + (q[1] - p[1]) * t + (random(`${seed}ry${i}`) - 0.5) * a] as [number, number]; });

/** Cordillera de pocos picos grandes: masa, cara en sombra (lado contrario al sol) con arista, casquete de nieve y bruma.
 *  `picos` = número de cumbres; `nieve` = fracción superior de cada pico con nieve. */
export const Cordillera: React.FC<{ id: string; y: number; amp: number; color: string; h: Hora; lejos?: number; nieve?: number; solIzq?: boolean; picos?: number; x0?: number; x1?: number }> = ({ id, y, amp, color, h, lejos = 0, nieve, solIzq = true, picos = 4, x0 = -500, x1 = 1580 }) => {
  const c = CIELO[h], base = mix(color, c.bruma, lejos), som = mix(mix(color, "#1C2340", 0.4), c.bruma, lejos * 0.75);
  const nv = mix("#F8FAFD", c.luz, 0.18), nvS = mix("#AEBBD3", c.bruma, lejos * 0.5), sx = solIzq ? 1 : -1;
  const ancho = (x1 - x0) / picos;
  const P = Array.from({ length: picos }, (_, i) => [x0 + ancho * (i + 0.2 + random(`${id}px${i}`) * 0.6), y - amp * (0.55 + random(`${id}ph${i}`) * 0.45)] as [number, number]);
  const V = Array.from({ length: picos + 1 }, (_, i) => [x0 + ancho * i, y - amp * (0.12 + random(`${id}vh${i}`) * 0.22)] as [number, number]);
  const linea: [number, number][] = [];
  for (let i = 0; i < picos; i++) linea.push(V[i], ...ruido(`${id}a${i}`, V[i], P[i], amp * 0.06), P[i], ...ruido(`${id}b${i}`, P[i], V[i + 1], amp * 0.06));
  linea.push(V[picos]);
  const masa = `M${x0} ${y + 3000} L${linea.map((p) => p.join(" ")).join(" L")} L${x1} ${y + 3000} Z`;
  return (
    <g>
      <clipPath id={`cm${id}`}><path d={masa} /></clipPath>
      <path d={masa} fill={base} />
      <g clipPath={`url(#cm${id})`}>
        {P.map(([px, py], i) => {
          const pie = y + 40, alto = pie - py, ax = px + sx * alto * 0.12;
          const arista = [[px, py], ...ruido(`${id}ar${i}`, [px, py], [ax, pie], alto * 0.05, 6), [ax, pie]] as [number, number][];
          const sombra = `M${arista.map((p) => p.join(" ")).join(" L")} L${px + sx * alto * 1.2} ${pie} L${px + sx * alto * 0.9} ${py + alto * 0.3} Z`;
          const fn = nieve ?? 0, cy = py + alto * fn;
          const casq = fn > 0 ? `M${px - alto * 0.9} ${cy + alto * 0.25} ${ruido(`${id}nv${i}`, [px - alto * 0.5, cy], [px + alto * 0.5, cy], alto * 0.12, 10).map((p) => `L${p[0]} ${p[1]}`).join(" ")} L${px + alto * 0.9} ${cy + alto * 0.25} L${px + alto} ${py - 50} L${px - alto} ${py - 50} Z` : "";
          return (
            <g key={i}>
              {fn > 0 && <path d={casq} fill={nv} />}
              <path d={sombra} fill={som} opacity={0.92} />
              {fn > 0 && <clipPath id={`cs${id}${i}`}><path d={casq} /></clipPath>}
              {fn > 0 && <path d={sombra} fill={nvS} clipPath={`url(#cs${id}${i})`} />}
              {Array.from({ length: 5 }).map((_, k) => { const t = 0.25 + k * 0.14; return <path key={k} d={`M${px - sx * alto * (0.15 + 0.1 * k)} ${py + alto * t} l${-sx * alto * 0.12} ${alto * 0.35}`} stroke={som} strokeWidth={Math.max(1, alto * 0.012)} opacity={0.45} />; })}
            </g>
          );
        })}
      </g>
      <rect x={x0} y={y - amp * 1.2} width={x1 - x0} height={3200} fill={c.bruma} opacity={0.08 + lejos * 0.2} clipPath={`url(#cm${id})`} />
    </g>
  );
};

/** Bosque de coníferas sobre una línea (y con leve ondulación). t = tamaño de árbol. */
export const Bosque: React.FC<{ id: string; x0: number; x1: number; y: number; t: number; color: string; n?: number }> = ({ id, x0, x1, y, t, color, n = 40 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const x = x0 + random(`${id}bx${i}`) * (x1 - x0), yy = y + Math.sin(x / 90) * t * 0.3 + random(`${id}by${i}`) * t * 0.5, h = t * (0.7 + random(`${id}bh${i}`) * 0.6);
    return <g key={i}><path d={`M${x} ${yy - h} L${x + h * 0.28} ${yy} L${x - h * 0.28} ${yy} Z`} fill={color} /><path d={`M${x} ${yy - h} L${x - h * 0.28} ${yy} L${x} ${yy} Z`} fill="#000" opacity={0.18} /></g>;
  })}</g>
);

/** Banda de bruma. */
export const Bruma: React.FC<{ y: number; alto: number; color: string; o?: number; id: string }> = ({ y, alto, color, o = 0.6, id }) => (
  <g><defs><linearGradient id={`br${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0" /><stop offset="0.5" stopColor={color} stopOpacity={o} /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
    <rect x={-1500} y={y} width={4080} height={alto} fill={`url(#br${id})`} /></g>
);

/** Nube con volumen (base sombreada por debajo). */
export const NubeE: React.FC<{ x: number; y: number; s?: number; h: Hora; o?: number }> = ({ x, y, s = 1, h, o = 0.95 }) => {
  const c = CIELO[h], cuerpo = mix("#FFFFFF", c.luz, 0.25), base = mix("#C9D6E6", c.b, 0.35);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={26} rx={190} ry={40} fill={base} />
      {[[-110, 6, 50], [-50, -22, 70], [30, -40, 86], [110, -8, 62], [170, 14, 40]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={cuerpo} />)}
      <ellipse cx={10} cy={30} rx={185} ry={22} fill={base} opacity={0.8} />
    </g>
  );
};

/** Bandada de aves (siluetas que aletean) cruzando el cielo. f = fotograma; v = px por fotograma. */
export const Aves: React.FC<{ f: number; x: number; y: number; n?: number; s?: number; v?: number; seed: string }> = ({ f, x, y, n = 7, s = 1, v = 1.4, seed }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const ox = x + f * v + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 34 * s + random(`${seed}ax${i}`) * 10, oy = y + Math.ceil(i / 2) * 18 * s + Math.sin(f / 12 + i) * 4 * s;
    const a = Math.sin(f / 3 + i * 1.7) * 9 * s, w = 14 * s;
    return <path key={i} d={`M${ox - w} ${oy - a} Q${ox - w / 2} ${oy - a * 0.3 - 3 * s} ${ox} ${oy} Q${ox + w / 2} ${oy - a * 0.3 - 3 * s} ${ox + w} ${oy - a}`} stroke="#2A2F3E" strokeWidth={2.4 * s} fill="none" strokeLinecap="round" opacity={0.75} />;
  })}</g>
);

/** Rayos de sol que salen del disco (haces suaves que giran muy despacio). */
export const Rayos: React.FC<{ x: number; y: number; h: Hora; f: number; id: string; o?: number }> = ({ x, y, h, f, id, o = 0.22 }) => {
  const c = CIELO[h];
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs><radialGradient id={`ry${id}`} cx={x} cy={y} r={1600} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={c.luz} stopOpacity={o} /><stop offset="1" stopColor={c.luz} stopOpacity="0" /></radialGradient></defs>
      {Array.from({ length: 9 }).map((_, i) => { const a = ((i * 40 + f * 0.05 + random(`${id}r${i}`) * 14) * Math.PI) / 180, w = 0.05 + random(`${id}w${i}`) * 0.05;
        return <path key={i} d={`M${x} ${y} L${x + Math.cos(a - w) * 2200} ${y + Math.sin(a - w) * 2200} L${x + Math.cos(a + w) * 2200} ${y + Math.sin(a + w) * 2200} Z`} fill={`url(#ry${id})`} />; })}
    </g>
  );
};
