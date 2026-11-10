// E55 «Free BASE»: piezas comunes. Reutiliza el kit de paisaje y roca de E56 (Ferrata).
// Escenario: cara norte del Eiger (caliza gris), valle de Grindelwald muy abajo y el Wetterhorn al fondo, verano por la tarde.
import React from "react";
import { random } from "remotion";
import { Cielo, Cordillera, Bosque, Bruma, NubeE, Rayos, Aves, CIELO, mix, type Hora } from "../Ferrata/paisaje";
export { Etiqueta, Svg, clamp, golpe, type P } from "../Ferrata/comun";
export { Roca, sPersona } from "../Ferrata/roca";
export { CIELO, mix };

export const H: Hora = "tarde";
/** El escalador: sin casco, pelo corto oscuro, sin camiseta, pantalón corto azul, pies de gato claros, contenedor azul. */
export const ESC = { chaqueta: "#D9A37A", chaquetaSombra: "#B8845E", pantalon: "#5D7FA8", casco: null, peinado: "corto" as const, pelo: "#2A1E16", manos: "piel" as const, arnes: false };
export const AZUL = "#2F6FD0", PIES = "#E6DCC8", MAGNESIO = "#F4F6F8";
export const CALIZA = "#9EA3A6";

/** Fondo épico: Wetterhorn a la izquierda, valle verde con el pueblo muy abajo. `y0` desplaza el valle (cuánto vacío se ve). */
export const Valle: React.FC<{ f: number; id: string; y0?: number }> = ({ f, id, y0 = 0 }) => (
  <g>
    <Cielo h={H} id={id} sol={[160, 520]} r={50} />
    <Rayos x={160} y={520} h={H} f={f} id={`${id}r`} o={0.18} />
    <NubeE x={300 + f * 0.3} y={300} s={1.1} h={H} o={0.85} /><NubeE x={820 - f * 0.2} y={460} s={0.7} h={H} o={0.7} />
    <Aves f={f} x={260} y={700} seed={`${id}a`} n={5} s={0.8} v={0.9} />
    <Cordillera id={`${id}W`} y={1000 + y0 * 0.3} amp={620} color="#6F7790" h={H} lejos={0.35} nieve={0.3} picos={2} x0={-400} x1={1100} />
    <Bruma y={900 + y0 * 0.3} alto={260} color={CIELO[H].bruma} id={`${id}b`} o={0.5} />
    <Cordillera id={`${id}M`} y={1250 + y0 * 0.6} amp={300} color="#4C6B58" h={H} lejos={0.2} picos={3} x0={-400} x1={1100} />
    <Bosque id={`${id}B`} x0={-300} x1={1100} y={1270 + y0 * 0.6} t={26} color="#2D5138" n={70} />
    <path d={`M-400 ${1290 + y0 * 0.8} Q200 ${1260 + y0 * 0.8} 700 ${1310 + y0 * 0.8} L1400 ${1300 + y0 * 0.8} L1400 4000 L-400 4000 Z`} fill={mix("#6E9A55", CIELO[H].bruma, 0.15)} />
    {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={40 + random(`${id}c${i}`) * 420} y={1330 + y0 * 0.8 + random(`${id}d${i}`) * 140} width={7} height={5} fill={i % 4 ? "#F2ECE2" : "#B5543A"} />)}
  </g>
);

/** Canto de pared de caliza (pared a la derecha de x, con estratos). */
export const ParedEiger: React.FC<{ x: number; pm: number; id: string; y0?: number; y1?: number }> = ({ x, pm, id, y0 = -800, y1 = 5000 }) => {
  const pts = Array.from({ length: 24 }, (_, i) => [x + Math.sin(i * 1.7) * 14 + (random(`${id}p${i}`) - 0.5) * 22, y0 + (i * (y1 - y0)) / 23] as [number, number]);
  return (
    <g>
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")} L2400 ${y1} L2400 ${y0} Z`} fill={CALIZA} />
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")} L${x + 160} ${y1} L${x + 160} ${y0} Z`} fill="#BFC3C4" opacity={0.6} />
      {Array.from({ length: 60 }).map((_, i) => { const yy = y0 + random(`${id}y${i}`) * (y1 - y0), xx = x + 30 + random(`${id}x${i}`) * 1200, l = (0.5 + random(`${id}l${i}`) * 3) * pm;
        return <path key={i} d={`M${xx} ${yy} q${l * 0.1} ${l * 0.5} ${-l * 0.04} ${l}`} stroke="#7E8488" strokeWidth={Math.max(1, pm * 0.03)} fill="none" opacity={0.5} />; })}
      {Array.from({ length: 40 }).map((_, i) => <ellipse key={`m${i}`} cx={x + 40 + random(`${id}mx${i}`) * 1100} cy={y0 + random(`${id}my${i}`) * (y1 - y0)} rx={pm * 0.04} ry={pm * 0.03} fill={MAGNESIO} opacity={0.5} />)}
    </g>
  );
};

/** Vela de paracaídas BASE (cajones, ~7 m de envergadura) vista de frente, con líneas hasta el cuerpo. a = apertura 0–1. */
export const Vela: React.FC<{ x: number; y: number; pm: number; a: number; cuerpo: [number, number]; rot?: number }> = ({ x, y, pm, a, cuerpo, rot = 0 }) => {
  const w = 7 * pm * (0.2 + 0.8 * a), h = 1.1 * pm * (0.3 + 0.7 * a), n = 7;
  return (
    <g>
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${x - w / 2 + (i * w) / 7} ${y + h * 0.5} L${cuerpo[0]} ${cuerpo[1]}`} stroke="#3A3F48" strokeWidth={Math.max(0.6, pm * 0.012)} opacity={0.8} />)}
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <path d={`M${x - w / 2} ${y + h * 0.5} Q${x} ${y - h * 0.9} ${x + w / 2} ${y + h * 0.5} Q${x} ${y + h * 0.1} ${x - w / 2} ${y + h * 0.5} Z`} fill="#E04A2A" />
        {Array.from({ length: n - 1 }).map((_, i) => { const px = x - w / 2 + ((i + 1) * w) / n; return <path key={i} d={`M${px} ${y - h * 0.25 * Math.cos(((px - x) / w) * Math.PI)} L${px} ${y + h * 0.32}`} stroke="#A83018" strokeWidth={Math.max(1, pm * 0.03)} />; })}
        <path d={`M${x - w / 2} ${y + h * 0.5} Q${x} ${y - h * 0.9} ${x + w / 2} ${y + h * 0.5}`} stroke="#FFD27A" strokeWidth={Math.max(1, pm * 0.04)} fill="none" opacity={0.7} />
      </g>
    </g>
  );
};

/** Fondo en picado (se mira hacia abajo): horizonte alto con montañas pequeñas y el valle muy abajo, con campos, bosques,
 *  río, carreteras y casas diminutas que crecen hacia abajo (perspectiva). Da la sensación de cientos de metros de vacío. */
export const Abismo: React.FC<{ f: number; id: string; hz?: number }> = ({ f, id, hz = 430 }) => {
  const c = CIELO[H], campo = ["#7FA65A", "#94B866", "#6E9A4E", "#A9C277", "#86A85C"];
  const filas = 9;
  return (
    <g>
      <Cielo h={H} id={id} sol={[170, hz - 180]} r={44} />
      <Rayos x={170} y={hz - 180} h={H} f={f} id={`${id}r`} o={0.16} />
      <Cordillera id={`${id}W`} y={hz} amp={260} color="#6F7790" h={H} lejos={0.45} nieve={0.32} picos={3} x0={-300} x1={1400} />
      <rect x={-300} y={hz - 6} width={1700} height={3000} fill={mix("#7FA65A", c.bruma, 0.35)} />
      {Array.from({ length: filas }).map((_, r) => {
        const t = r / (filas - 1), y = hz + 20 + t * t * 1500, alto = 16 + t * t * 220, n = 10 - Math.round(t * 5);
        return Array.from({ length: n + 2 }).map((_, k) => { const w = 1500 / n, x = -250 + k * w + (random(`${id}o${r}${k}`) - 0.5) * w * 0.4;
          return <path key={`${r}-${k}`} d={`M${x} ${y} L${x + w * 0.95} ${y + alto * 0.1} L${x + w} ${y + alto} L${x + w * 0.05} ${y + alto * 0.92} Z`} fill={mix(campo[(r * 3 + k) % campo.length], c.bruma, 0.45 * (1 - t))} opacity={0.95} />; });
      })}
      {Array.from({ length: 26 }).map((_, i) => { const t = random(`${id}bt${i}`), y = hz + 40 + t * t * 1400, s = 10 + t * t * 120;
        const x = -200 + random(`${id}bx${i}`) * 1500, col = mix("#2F5A3A", c.bruma, 0.4 * (1 - t));
        return <g key={`b${i}`}>{[[-1.1, 0.1, 0.55], [0, -0.1, 0.7], [1.1, 0.05, 0.5], [0.5, 0.3, 0.45]].map(([dx, dy, r], k) => <ellipse key={k} cx={x + dx * s} cy={y + dy * s} rx={r * s * 1.3} ry={r * s * 0.6} fill={col} />)}</g>; })}
      <path d={`M-200 ${hz + 60} C200 ${hz + 120} 300 ${hz + 400} 160 ${hz + 900} S300 ${hz + 1500} 600 ${hz + 2000}`} stroke={mix("#6CC3D0", c.bruma, 0.3)} strokeWidth={14} fill="none" opacity={0.85} />
      <path d={`M1200 ${hz + 40} C900 ${hz + 160} 760 ${hz + 600} 820 ${hz + 1200} S700 ${hz + 1700} 650 ${hz + 2100}`} stroke="#E8E2D2" strokeWidth={6} fill="none" opacity={0.7} />
      {Array.from({ length: 40 }).map((_, i) => { const t = 0.15 + random(`${id}ct${i}`) * 0.35, y = hz + 60 + t * t * 1200, s = 4 + t * 14, x = 380 + random(`${id}cx${i}`) * 280;
        return <g key={`c${i}`}><rect x={x} y={y} width={s} height={s * 0.7} fill="#F2ECE2" /><path d={`M${x - s * 0.1} ${y} L${x + s * 0.5} ${y - s * 0.4} L${x + s * 1.1} ${y} Z`} fill="#B5543A" /></g>; })}
      <Bruma y={hz - 60} alto={260} color={c.bruma} id={`${id}h`} o={0.75} />
      <NubeE x={760 + f * 0.4} y={hz + 300} s={1.2} h={H} o={0.55} /><NubeE x={150 - f * 0.3} y={hz + 700} s={1.6} h={H} o={0.45} />
      <Aves f={f} x={300} y={hz + 200} seed={`${id}a`} n={5} s={0.7} v={0.8} />
    </g>
  );
};
