// 1 · «Siguieron a 140.000 personas de 17 países»: gente que llena la pantalla → zoom out a dos estadios llenos → mapa con 17 países.
// 2 · «…mejor que la tensión arterial»: pantalla partida tensiómetro / «?» que late; el tensiómetro se encoge.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COL, F, Grande, Dato, Papel, Svg, T, cl, pop, sale, type P } from "./comun";

const GENTE = ["#2F6FD6", "#EE4B4B", "#FFC93C", "#3CC9B0", "#FF6A1F", "#9B7BEA", "#14213A", "#E0AE86"];
/** Patrón de personitas (cabeza + hombros) para rellenar gradas. */
const Patron: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <pattern id={id} width={t * 4} height={t * 4} patternUnits="userSpaceOnUse">
    {Array.from({ length: 16 }).map((_, i) => { const x = (i % 4) * t + t / 2 + ((Math.floor(i / 4) % 2) * t) / 2, y = Math.floor(i / 4) * t + t / 2, c = GENTE[(i * 5 + Math.floor(i / 4)) % 8];
      return <g key={i}><path d={`M${x - t * 0.36} ${y + t * 0.46} Q${x} ${y - t * 0.02} ${x + t * 0.36} ${y + t * 0.46} Z`} fill={c} /><circle cx={x} cy={y - t * 0.12} r={t * 0.2} fill={i % 3 ? "#E0AE86" : "#B97F57"} /></g>; })}
  </pattern>
);
/** Estadio visto desde arriba: gradas llenas (patrón) y campo verde. */
const Estadio: React.FC<{ x: number; y: number; lleno: number }> = ({ x, y, lleno }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={300} ry={190} fill="#C9C2B4" stroke={T} strokeWidth={10} />
    <ellipse rx={300} ry={190} fill="url(#ap-gente)" opacity={lleno} />
    <ellipse rx={170} ry={92} fill="#3FA76A" stroke={T} strokeWidth={8} />
    <path d="M0 -92 V92 M-170 0 H170" stroke="#fff" strokeWidth={4} opacity={0.7} /><circle r={26} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
  </g>
);
// Mapa (equirectangular, 2,78 px/grado, lat 85 → -58): continentes simplificados y los 17 países de PURE.
const G = 2.78, px = (lo: number, la: number) => `${((lo + 180) * G).toFixed(0)} ${((85 - la) * G).toFixed(0)}`;
const CONT = [
  [[-168, 66], [-140, 70], [-95, 72], [-80, 63], [-60, 58], [-55, 50], [-67, 45], [-75, 38], [-81, 31], [-81, 25], [-97, 26], [-97, 20], [-87, 21], [-83, 10], [-78, 8], [-90, 14], [-105, 20], [-117, 32], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
  [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-60, 82], [-70, 77]],
  [[-78, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-65, -55], [-73, -50], [-73, -40], [-71, -18], [-81, -5], [-80, 2]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 69], [28, 71], [40, 67], [30, 60], [40, 55], [30, 45], [28, 41], [20, 40], [15, 38], [12, 44], [8, 44], [3, 42]],
  [[-6, 50], [1, 51], [-2, 56], [-5, 58], [-6, 55]],
  [[-17, 21], [-16, 13], [-8, 4], [8, 4], [10, -2], [13, -12], [12, -18], [18, -34], [26, -34], [33, -26], [40, -15], [40, -5], [51, 11], [43, 12], [35, 24], [32, 31], [20, 32], [10, 37], [-6, 36], [-10, 30]],
  [[28, 41], [36, 36], [35, 32], [43, 13], [52, 15], [57, 22], [60, 25], [67, 25], [73, 20], [77, 8], [80, 15], [88, 22], [92, 22], [98, 16], [103, 1], [105, 10], [109, 12], [108, 21], [118, 24], [122, 30], [122, 40], [128, 35], [130, 43], [140, 47], [141, 53], [156, 59], [165, 62], [180, 66], [180, 72], [140, 73], [110, 77], [80, 73], [70, 67], [60, 70], [50, 67], [40, 67], [30, 60], [40, 55], [30, 45]],
  [[95, 5], [105, -6], [115, -8], [120, -5], [110, 2], [100, 4]],
  [[114, -22], [122, -18], [131, -12], [137, -12], [143, -11], [146, -19], [153, -26], [150, -37], [141, -38], [131, -31], [117, -35], [114, -27]],
];
// Canadá, Suecia, Polonia, Turquía, EAU, Irán, Pakistán, India, Bangladés, China, Malasia, Sudáfrica, Zimbabue, Colombia, Brasil, Chile, Argentina
const PAISES = [[-79, 46], [15, 60], [19, 52], [35, 39], [54, 24], [53, 33], [69, 30], [78, 22], [90, 24], [110, 33], [102, 4], [25, -29], [30, -19], [-74, 5], [-47, -15], [-71, -33], [-62, -34]];
const Mapa: React.FC<{ k: number }> = ({ k }) => (
  <g transform="translate(40 690) scale(0.9)">
    <rect x={-20} y={-20} width={1040} height={440} rx={40} fill="#DCEBFA" stroke={T} strokeWidth={10} />
    {CONT.map((c, i) => <path key={i} d={`M${c.map(([lo, la]) => px(lo, la)).join(" L")} Z`} fill="#CFC6B6" stroke={T} strokeWidth={5} strokeLinejoin="round" />)}
    {PAISES.map(([lo, la], i) => { const e = pop(k - i * 2); const [x, y] = px(lo, la).split(" ").map(Number);
      return e > 0 && <g key={i} transform={`translate(${x} ${y}) scale(${e})`}><circle r={34} fill={COL.naranja} opacity={0.25} /><circle r={17} fill={COL.naranja} stroke={T} strokeWidth={6} /></g>; })}
  </g>
);

export const Estudio: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const t17 = (pal("17") ?? Math.round(d * 0.65)) - 3;
  // 0 → 1,1 s: muy cerca de la grada (personitas grandes) · luego zoom out hasta ver los dos estadios
  const z = interpolate(f, [0, 8, 34], [5.2, 4.6, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const mapa = sale((f - t17) / 8);
  return (
    <>
      <Svg>
        <defs><Patron id="ap-gente" t={22} /></defs>
        <Papel />
        <g opacity={1 - mapa} transform={`translate(540 1060) scale(${z}) translate(-540 -1060) translate(0 ${-30 * mapa})`}>
          <Estadio x={540} y={830} lleno={1} />
          <Estadio x={540} y={1290} lleno={interpolate(f, [16, 40], [0.35, 0.9], cl)} />
        </g>
        {f < 22 && <g opacity={interpolate(f, [8, 20], [1, 0], cl)}><rect x={-200} y={-200} width={1480} height={2320} fill="#D8D0C2" /><g transform={`scale(${z / 1.6})`} transform-origin="540 960"><rect x={-2000} y={-2000} width={5000} height={6000} fill="url(#ap-gente)" /></g></g>}
        {mapa > 0 && <g opacity={mapa} transform={`translate(0 ${40 * (1 - mapa)})`}><Mapa k={f - t17 - 4} /></g>}
      </Svg>
      <Grande t={f < t17 ? "140.000" : "17 PAÍSES"} x={540} y={f < t17 ? 560 : 1250} k={f < t17 ? f + 12 : f - t17 - 6} color={f < t17 ? COL.naranja : COL.azul} tam={f < t17 ? 210 : 150} />
      {f < t17 && <Dato t="PERSONAS" x={540} y={1540} k={f - 14} tam={56} />}
    </>
  );
};

/** Tensiómetro: brazalete + reloj en mmHg + pera. */
const Tensiometro: React.FC<{ x: number; y: number; s: number; gris: number }> = ({ x, y, s, gris }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} style={{ filter: `grayscale(${gris})` }} opacity={1 - 0.35 * gris}>
    <rect x={-150} y={60} width={300} height={170} rx={40} fill="#2F6FD6" stroke={T} strokeWidth={12} />
    <path d="M-150 120 H150" stroke="#1F4FA3" strokeWidth={10} />
    <path d="M80 230 Q120 330 40 380 Q-40 420 -60 470" stroke={T} strokeWidth={16} fill="none" />
    <ellipse cx={-70} cy={510} rx={50} ry={66} fill="#3A4557" stroke={T} strokeWidth={10} />
    <circle cx={0} cy={-80} r={120} fill="#3A4557" stroke={T} strokeWidth={12} /><circle cx={0} cy={-80} r={98} fill="#F4F6F9" />
    {Array.from({ length: 13 }).map((_, i) => { const a = (-220 + i * 22) * (Math.PI / 180); return <path key={i} d={`M${86 * Math.cos(a)} ${-80 + 86 * Math.sin(a)} L${70 * Math.cos(a)} ${-80 + 70 * Math.sin(a)}`} stroke={T} strokeWidth={6} />; })}
    <path d="M0 -80 L50 -130" stroke={COL.rojo} strokeWidth={10} strokeLinecap="round" /><circle cx={0} cy={-80} r={12} fill={T} />
    <text x={0} y={-30} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={26} fill={T}>mmHg</text>
    <path d="M0 40 V60" stroke={T} strokeWidth={14} />
  </g>
);
export const Tension: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tM = (pal("mejor") ?? Math.round(d * 0.55)) - 2, tT = (pal("tensión") ?? Math.round(d * 0.75)) - 2;
  const enc = sale((f - tM) / 12), late = 1 + 0.07 * Math.sin(f / 3.2) + 0.25 * enc;
  return (
    <>
      <Svg>
        <Papel />
        <rect x={0} y={0} width={540} height={1920} fill="#E7EEF7" opacity={0.7} />
        <path d="M540 470 V1440" stroke={T} strokeWidth={8} strokeDasharray="20 18" />
        <Tensiometro x={270} y={860} s={interpolate(enc, [0, 1], [1.15, 0.62])} gris={enc} />
        <g transform={`translate(810 900) scale(${late * pop(f + 10)})`}>
          <circle r={210} fill={COL.amarillo} stroke={T} strokeWidth={14} />
          <text y={120} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={340} fill={T}>?</text>
        </g>
      </Svg>
      <Dato t="TENSIÓN ARTERIAL" x={270} y={1340} k={f - 4} tam={40} />
      <Dato t="PREDICE MEJOR" x={810} y={1240} k={f - tT} tam={48} fondo={COL.verde} color="#fff" />
    </>
  );
};
