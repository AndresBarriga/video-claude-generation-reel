// Escenario nuevo: tienda de escalada al anochecer. Pared de lamas con filas de gatos expuestos, ventanal a la montaña, lámparas, banco probador,
// cajas apiladas y espejo bajo. Escala: 170 px = 1 m (el banco mide 47 cm de alto). SUELO_T = y del suelo.
import React from "react";
import { random } from "remotion";
import { G, T } from "./comun";

export const SUELO_T = 1560, BANCO = { x1: 150, x2: 640, y: SUELO_T - 80 };
const COLORES = ["#E2B93B", "#3FA7A0", "#D9614A", "#E8E4DA", "#5B86C9", "#8FB05A", "#C9704A"];

/** Gato pequeño de exposición (perfil, punta a la derecha), ~130 px. */
const Mini: React.FC<{ x: number; y: number; c: string; s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 L104 0 Q128 -2 124 -16 Q116 -34 92 -36 L52 -64 Q30 -72 10 -62 Q-6 -40 -4 -14 Z" fill={c} stroke={T} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-2 0 L104 0 Q128 -2 124 -16" stroke={G.goma} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M58 -58 L72 -30 M74 -48 L86 -26" stroke={G.goma} strokeWidth={9} strokeLinecap="round" />
    <path d="M10 -62 q-10 -18 2 -24" stroke={c} strokeWidth={6} fill="none" />
  </g>
);

export const Tienda: React.FC<{ caja?: boolean }> = ({ caja = true }) => (
  <g>
    <defs>
      <linearGradient id="td-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#132235" /><stop offset="1" stopColor="#213449" /></linearGradient>
      <linearGradient id="td-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B3558" /><stop offset="0.7" stopColor="#5C87A8" /><stop offset="1" stopColor="#E0A77C" /></linearGradient>
      <linearGradient id="td-suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A4A40" /><stop offset="1" stopColor="#33292A" /></linearGradient>
      <radialGradient id="td-luz"><stop offset="0" stopColor="#FFE7B0" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE7B0" stopOpacity="0" /></radialGradient>
    </defs>
    <rect x={-1200} y={-900} width={3600} height={SUELO_T + 900} fill="url(#td-pared)" />
    {/* lamas */}
    {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M-1200 ${-200 + i * 46} H2400`} stroke="#0C1826" strokeWidth={4} opacity={0.55} />)}
    {/* ventanal */}
    <g>
      <rect x={-60} y={470} width={400} height={700} rx={10} fill="url(#td-cielo)" stroke="#0B1420" strokeWidth={18} />
      <path d="M-50 980 L20 860 L70 910 L150 780 L220 880 L270 840 L330 930 L330 1160 L-50 1160 Z" fill="#2B4664" />
      <path d="M150 780 L172 818 L150 830 L128 812 Z" fill="#DCE8F2" opacity={0.9} />
      <path d="M-50 1060 Q120 1000 330 1050 L330 1160 L-50 1160 Z" fill="#1C2F45" />
      <path d="M140 474 V1166 M-56 800 H336" stroke="#0B1420" strokeWidth={12} />
      <path d="M-30 500 L60 500 L-30 640 Z" fill="#fff" opacity={0.08} />
    </g>
    {/* estanterías con gatos */}
    {[640, 830, 1020, 1210].map((y, r) => (
      <g key={r}>
        <rect x={400} y={y} width={760} height={18} rx={6} fill="#6B5647" /><rect x={400} y={y + 18} width={760} height={10} fill="#000" opacity={0.25} />
        {Array.from({ length: 5 }).map((_, i) => { const x = 420 + i * 150 + (r % 2) * 30; return <g key={i}><Mini x={x} y={y - 4} c={COLORES[(i + r * 2) % COLORES.length]} s={0.95} /><rect x={x + 30} y={y + 22} width={54} height={26} rx={4} fill="#F3ECDA" opacity={0.85} /></g>; })}
      </g>
    ))}
    {/* cartel */}
    <g><rect x={470} y={380} width={470} height={120} rx={16} fill="#0B1420" stroke="#31465E" strokeWidth={6} />
      <text x={705} y={464} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={76} fill="#E8EEF4" letterSpacing={6}>PIES DE GATO</text></g>
    {/* lámparas */}
    {[250, 760].map((x, i) => (<g key={i}>
      <path d={`M${x} -900 V250`} stroke="#0B1420" strokeWidth={6} /><path d={`M${x - 70} 310 Q${x} 220 ${x + 70} 310 Z`} fill="#D9B44A" stroke={T} strokeWidth={5} />
      <ellipse cx={x} cy={312} rx={54} ry={12} fill="#FFF1C9" /><path d={`M${x - 60} 316 L${x - 330} ${SUELO_T} L${x + 330} ${SUELO_T} L${x + 60} 316 Z`} fill="#FFE7B0" opacity={0.06} />
      <ellipse cx={x} cy={SUELO_T + 30} rx={360} ry={60} fill="url(#td-luz)" opacity={0.5} />
    </g>))}
    {/* suelo de tarima */}
    <rect x={-1200} y={SUELO_T} width={3600} height={900} fill="url(#td-suelo)" />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M-1200 ${SUELO_T + 40 + i * i * 9 + i * 30} H2400`} stroke="#241C1E" strokeWidth={4} opacity={0.5} />)}
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${-900 + i * 190 + random(`tp${i}`) * 60} ${SUELO_T + 4} l${-30 + i * 6} 300`} stroke="#241C1E" strokeWidth={3} opacity={0.35} />)}
    <rect x={-1200} y={SUELO_T - 14} width={3600} height={18} fill="#0E1826" />
    {/* espejo bajo apoyado en la pared */}
    <g transform={`translate(820 ${SUELO_T}) rotate(-5)`}><rect x={0} y={-250} width={170} height={250} rx={10} fill="#9FC3D8" stroke="#6B5647" strokeWidth={14} /><path d="M20 -230 L80 -230 L20 -120 Z M100 -60 L150 -150 L150 -60 Z" fill="#fff" opacity={0.3} /></g>
    {/* banco probador */}
    <g>
      <ellipse cx={(BANCO.x1 + BANCO.x2) / 2} cy={SUELO_T + 10} rx={280} ry={18} fill="#000" opacity={0.3} />
      {[BANCO.x1 + 40, BANCO.x2 - 40].map((x, i) => <path key={i} d={`M${x - 16} ${BANCO.y + 20} L${x - 26} ${SUELO_T} M${x + 16} ${BANCO.y + 20} L${x + 26} ${SUELO_T}`} stroke="#1A222E" strokeWidth={14} strokeLinecap="round" />)}
      <rect x={BANCO.x1} y={BANCO.y} width={BANCO.x2 - BANCO.x1} height={26} rx={10} fill="#8A6D55" stroke={T} strokeWidth={5} />
      <rect x={BANCO.x1 + 10} y={BANCO.y + 4} width={BANCO.x2 - BANCO.x1 - 20} height={6} rx={3} fill="#fff" opacity={0.2} />
    </g>
    {/* cajas */}
    {caja && <g transform={`translate(${BANCO.x1 - 10} ${SUELO_T})`}>
      <rect x={0} y={-76} width={190} height={76} rx={6} fill="#27384D" stroke={T} strokeWidth={5} /><rect x={-6} y={-92} width={202} height={24} rx={6} fill="#31465E" stroke={T} strokeWidth={5} />
      <rect x={16} y={-168} width={176} height={76} rx={6} fill="#C74B3A" stroke={T} strokeWidth={5} transform="rotate(-4 100 -130)" />
      <g transform="rotate(-4 100 -130)"><rect x={10} y={-184} width={188} height={24} rx={6} fill="#D9614A" stroke={T} strokeWidth={5} /><rect x={108} y={-150} width={72} height={46} rx={5} fill="#F3ECDA" /><text x={144} y={-114} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={40} fill={T}>40</text></g>
    </g>}
  </g>
);
