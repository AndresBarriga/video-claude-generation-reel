// E6 «El último pegue»: piezas comunes. Vía deportiva vista de perfil (pared a la derecha, cara de la roca en escorzo).
// Idea visual: el sol cae durante todo el vídeo (tu fuerza) y las presas se llenan de marcas de magnesio (lo que te sabes la vía).
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTexto, fuenteTitulo } from "../../tema";
import type { Escena } from "../../tipos";

export const W = 1080, H = 1920;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const C = {
  cuerda: "#FF6A1F", cuerdaS: "#B8460E", blanco: "#FFFFFF", tinta: "#0B1624", sol: "#FFC46B", luz: "#FFE7A8",
  magnesio: "#F4F7FA", metal: "#AEB8C4",
};
/** e: escena · d: duración en fotogramas · pal(w): fotograma relativo en que se dice w */
export type P = { e: Escena; d: number; pal: (w: string) => number | undefined };

/* ---- hora del día: 0 = mañana, 0.6 = tarde, 0.8 = puesta, 1 = noche ---- */
const HK = [0, 0.6, 0.8, 1];
const col = (h: number, cs: string[]) => interpolateColors(h, HK, cs);
export const tonos = (h: number) => ({
  cieloA: col(h, ["#4F92C6", "#3D6C9C", "#24375C", "#070F1B"]),
  cieloB: col(h, ["#CBE4F2", "#F3CB91", "#EE8549", "#162A43"]),
  lejos: col(h, ["#9DB6CC", "#B49A95", "#7B5068", "#13203A"]),
  medio: col(h, ["#6E8AA3", "#7C6D7E", "#4A3552", "#0D1729"]),
  roca: col(h, ["#77808E", "#6E6670", "#4B4150", "#1C2230"]),
  cara: col(h, ["#A6ADB8", "#B39C92", "#8A6A66", "#2C3342"]),
  caraS: col(h, ["#8D95A2", "#957F78", "#6E5254", "#232A38"]),
  suelo: col(h, ["#4D5A48", "#4D4A40", "#3A3036", "#111821"]),
});

export const Cielo: React.FC<{ h: number; id: string; sol?: boolean }> = ({ h, id, sol = true }) => {
  const t = tonos(h);
  const sy = interpolate(h, [0, 0.8, 1], [430, 1150, 1420], clamp);
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.cieloA} /><stop offset="1" stopColor={t.cieloB} /></linearGradient>
        <radialGradient id={`${id}h`}><stop offset="0" stopColor={C.luz} stopOpacity="0.8" /><stop offset="1" stopColor={C.luz} stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-300} y={-500} width={W + 600} height={H + 1000} fill={`url(#${id})`} />
      {sol && h < 0.98 && <><circle cx={250} cy={sy} r={260} fill={`url(#${id}h)`} opacity={0.6} /><circle cx={250} cy={sy} r={78} fill={interpolateColors(h, [0, 0.8], ["#FFF4D2", "#FF9A4A"])} /></>}
      <Colinas y={1190} color={t.lejos} seed="l" amp={150} />
      <Colinas y={1300} color={t.medio} seed="m" amp={110} />
    </>
  );
};

export const Colinas: React.FC<{ y: number; color: string; seed: string; amp: number }> = ({ y, color, seed, amp }) => {
  const n = 8, pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${-200 + (i * (W + 400)) / n} ${y - amp * (0.3 + random(`${seed}${i}`) * 0.7)}`);
  return <path d={`M-300 ${H + 600} L${pts.join(" L")} L${W + 300} ${H + 600} Z`} fill={color} />;
};

/* ---- la pared ---- */
export const SUELO = 1720;
export const borde = (y: number) => 600 + 90 * (y / H); // canto de la pared (ligero desplome)
export const PRESAS = [1500, 1360, 1220, 1080, 940, 800, 670, 545]; // 670 = paso clave
export const CRUX = 670, CADENA = 430;
export const CHAPAS = [1290, 1010, 740];
export const enCara = (y: number) => borde(y) + 34; // x de una presa sobre la cara

/** Pared con presas. `marcas`: cuántas presas tienen marca de magnesio (puede ser fracción). */
export const Pared: React.FC<{ h: number; marcas?: number; chapas?: boolean }> = ({ h, marcas = 0, chapas = true }) => {
  const t = tonos(h);
  const canto = `M${borde(-400)} -400 L${borde(H + 200)} ${H + 200}`;
  return (
    <g>
      <path d={`${canto} L${W + 300} ${H + 200} L${W + 300} -400 Z`} fill={t.roca} />
      <path d={`${canto} L${borde(H + 200) + 150} ${H + 200} L${borde(-400) + 150} -400 Z`} fill={t.cara} />
      {Array.from({ length: 14 }).map((_, i) => {
        const y = -200 + i * 160 + random(`es${i}`) * 60;
        return <path key={i} d={`M${borde(y) + 4} ${y} q${60 + random(`ex${i}`) * 50} ${18} ${150} ${6 + random(`ey${i}`) * 20} L${W + 300} ${y + 30}`} stroke={t.caraS} strokeWidth={5} fill="none" opacity={0.7} />;
      })}
      <path d={canto} stroke="#000" strokeOpacity={0.25} strokeWidth={8} />
      {PRESAS.map((y, i) => {
        const x = enCara(y), m = Math.max(0, Math.min(1, marcas - i));
        return (
          <g key={i}>
            <ellipse cx={x + 2} cy={y + 9} rx={30} ry={11} fill="#000" opacity={0.28} />
            <path d={`M${x - 30} ${y + 4} q4 -18 30 -18 q28 0 30 16 q-30 8 -60 2 Z`} fill={t.caraS} stroke="#000" strokeOpacity={0.2} strokeWidth={3} />
            {m > 0 && <g opacity={m}>
              <path d={`M${x - 22} ${y - 6} q22 -12 44 0`} stroke={C.magnesio} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85} />
              <path d={`M${x + 52} ${y - 20} l0 ${34 * m}`} stroke={C.magnesio} strokeWidth={8} strokeLinecap="round" />
            </g>}
          </g>
        );
      })}
      {chapas && CHAPAS.map((y, i) => <Cinta key={i} y={y} />)}
      <Reunion />
    </g>
  );
};

export const Cinta: React.FC<{ y: number }> = ({ y }) => {
  const x = borde(y) + 10;
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={C.metal} />
      <rect x={x - 6} y={y + 6} width={12} height={34} rx={6} fill="#3D7FD0" />
      <circle cx={x} cy={y + 50} r={11} fill="none" stroke={C.metal} strokeWidth={5} />
    </g>
  );
};
export const Reunion: React.FC = () => {
  const x = borde(CADENA) + 14;
  return (
    <g>
      <circle cx={x} cy={CADENA} r={8} fill={C.metal} /><circle cx={x + 40} cy={CADENA + 6} r={8} fill={C.metal} />
      {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={x + 4 + i * 8} cy={CADENA + 14 + Math.sin((i / 4) * Math.PI) * 26} rx={6} ry={9} fill="none" stroke={C.metal} strokeWidth={4} />)}
      <circle cx={x + 20} cy={CADENA + 56} r={13} fill="none" stroke={C.metal} strokeWidth={6} />
    </g>
  );
};

export const Suelo: React.FC<{ h: number }> = ({ h }) => (
  <g>
    <path d={`M-300 ${SUELO} Q300 ${SUELO - 20} ${borde(SUELO) + 40} ${SUELO + 6} L${W + 300} ${SUELO + 10} L${W + 300} ${H + 400} L-300 ${H + 400} Z`} fill={tonos(h).suelo} />
    {[60, 170, 420, 520].map((x, i) => <path key={i} d={`M${x} ${SUELO + 4} q8 -40 16 0 q6 -30 14 0 q8 -34 16 0`} fill={interpolateColors(h, [0, 1], ["#5F7253", "#121A1F"])} />)}
  </g>
);

/** Cadera del escalador para que su mano delantera (pose "escalando") quede en la presa (x, y). */
export const cadera = (x: number, y: number, s: number) => ({ x: x - 36 * s, y: y + 182 * s });
/** Cadera de alguien de pie en el suelo. */
export const enSuelo = (s: number) => SUELO - 136 * s;

/** Cuerda con sombra y trenzado. */
export const Cuerda: React.FC<{ d: string; w?: number }> = ({ d, w = 10 }) => (
  <g>
    <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke="#FFB27F" strokeWidth={Math.max(2, w * 0.22)} fill="none" strokeDasharray={`${w * 0.9} ${w * 1.1}`} opacity={0.7} />
  </g>
);

/* ---- textos ---- */
export const Etiqueta: React.FC<{ texto?: string; top?: number; tam?: number; desde?: number }> = ({ texto, top = 300, tam = 110, desde = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!texto) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 190 } });
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: tam, lineHeight: 1,
      color: C.blanco, fontVariantNumeric: "tabular-nums", opacity: s, transform: `translateY(${(1 - s) * -30}px) scale(${0.9 + 0.1 * s})`,
      WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill" }}>{texto}</div>
  );
};
/** Píldora pequeña con el número de pegue (dato). */
export const Pegues: React.FC<{ n: number | string; top?: number; color?: string }> = ({ n, top = 214, color = C.cuerda }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 44, color: C.blanco, background: "rgba(5,11,20,.72)", borderRadius: 40, padding: "6px 28px", letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>
      PEGUE <span style={{ color }}>{n}</span>
    </div>
  </div>
);

/* ---- cámara ---- */
export const Camara: React.FC<{ d: number; children: React.ReactNode; empuje?: number; sacudida?: number; foco?: string; entrada?: boolean }> = ({ d, children, empuje = 0.05, sacudida = 0, foco = "50% 50%", entrada = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const e = entrada ? spring({ frame: f, fps, config: { damping: 20, stiffness: 160 } }) : 1;
  const sc = 1 + 0.05 * (1 - e) + empuje * (f / Math.max(1, d));
  const sx = sacudida ? Math.sin(f * 2.3) * sacudida : 0, sy = sacudida ? Math.cos(f * 1.7) * sacudida : 0;
  return <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${sc})`, transformOrigin: foco }}>{children}</AbsoluteFill>;
};
/** Acerca la escena (no el cielo) alrededor de (cx, cy) y la coloca en (tx, ty). */
export const Zoom: React.FC<{ s: number; cx: number; cy: number; tx?: number; ty?: number; children: React.ReactNode }> = ({ s, cx, cy, tx = cx, ty = cy, children }) => (
  <g transform={`translate(${tx} ${ty}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>
);
export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
/** Sacudida corta tras un impacto (< 10 fotogramas). */
export const golpe = (f: number, t0: number, a = 14) => (f >= t0 && f < t0 + 9 ? Math.sin((f - t0) * 2.6) * a * (1 - (f - t0) / 9) : 0);
