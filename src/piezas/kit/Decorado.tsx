// KIT · decorados: reciben la geometría (perfil de pared y suelo) como parámetro. CUEVA = roca al anochecer · SALA = rocódromo de cuerda.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { PC, Svg, cam } from "./base";
import { Expres } from "./Cuerda";
import { PERFILES, type Perfil, type Via } from "./via";

/** Fondo: boca de la cueva abierta al cañón. Se mueve menos que la cueva (paralaje). `calido` 0–1 = luz del final. */
export const Fondo: React.FC<{ cx: number; cy: number; z: number; calido?: number }> = ({ cx, cy, z, calido = 0 }) => {
  const px = (cx - 600) * 0.25, py = (cy - 1300) * 0.18, s = 1 + (z - 1) * 0.25;
  return (
    <g>
      <defs>
        <linearGradient id="sl-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PC.cieloA} /><stop offset="0.55" stopColor={PC.cieloB} /><stop offset="0.85" stopColor={PC.cieloC} />
          <stop offset="1" stopColor={PC.horizonte} stopOpacity={0.35 + 0.5 * calido} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#sl-cielo)" />
      <g transform={`translate(540 960) scale(${s}) translate(${-540 - px} ${-960 - py})`}>
        {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={random(`es${i}`) * 1080} cy={120 + random(`ey${i}`) * 520} r={1.5 + random(`er${i}`) * 2} fill="#EAF2FA" opacity={0.25 + random(`eo${i}`) * 0.4 * (1 - calido)} />)}
        <circle cx={250} cy={1180} r={130} fill={PC.horizonte} opacity={0.12 + 0.4 * calido} />
        {/* paredes del cañón al otro lado */}
        <path d="M-200 1050 L60 980 L150 1010 L260 940 L380 1000 L470 960 L560 1030 L560 2100 L-200 2100 Z" fill={PC.lejos} />
        <path d="M-200 1250 Q100 1180 300 1230 T700 1260 L700 2100 L-200 2100 Z" fill={PC.medio} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-150 + i * 80} 1050 l14 ${180 + random(`gr${i}`) * 160}`} stroke="#2C4460" strokeWidth={6} opacity={0.5} />)}
        {/* río y árboles en el fondo del cañón */}
        <path d="M-200 1520 Q150 1470 320 1540 T700 1590" stroke={PC.rio} strokeWidth={16} fill="none" opacity={0.75} />
        {Array.from({ length: 34 }).map((_, i) => <ellipse key={i} cx={-180 + random(`tx${i}`) * 820} cy={1440 + random(`ty${i}`) * 260} rx={16 + random(`tr${i}`) * 12} ry={22} fill={i % 3 ? "#1B2D3D" : "#22384A"} />)}
      </g>
    </g>
  );
};

/** Decorado CUEVA (exterior, anochecer): pared desplomada (derecha), techo (arriba) y suelo con bloques. Chapas con cintas exprés. */
export const Cueva: React.FC<{ xF?: Perfil; suelo?: number; cintas?: number[]; magnesio?: number[][] }> = ({ xF = PERFILES.desplome, suelo: SUELO = 2650, cintas = [], magnesio = [[700, 0.6], [640, 0.5], [600, 0.8], [830, 0.5], [900, 0.4], [1080, 0.5]] }) => {
  const ys = Array.from({ length: 60 }, (_, i) => -300 + i * 52);
  const cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      {/* techo de la cueva */}
      <path d="M-400 -400 L1600 -400 L1600 260 Q1100 330 700 230 Q350 150 120 300 Q-60 420 -400 360 Z" fill={PC.techo} />
      <path d="M-400 360 Q-60 420 120 300 Q350 150 700 230" stroke="#3D4552" strokeWidth={14} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => { const x = -300 + i * 70 + random(`st${i}`) * 30, y0 = 300 + Math.sin(i) * 40, l = 40 + random(`sl${i}`) * 90; return <path key={i} d={`M${x - 12} ${y0} Q${x} ${y0 + l} ${x + 12} ${y0}`} fill={PC.techo} />; })}
      {/* pared: luz fría que entra por la boca de la cueva (izquierda) y se apaga hacia dentro */}
      <defs>
        <linearGradient id="sl-roca" x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0" stopColor="#8E98A4" /><stop offset="0.18" stopColor={PC.roca} /><stop offset="0.6" stopColor="#4A515C" /><stop offset="1" stopColor="#353B45" />
        </linearGradient>
        <linearGradient id="sl-tufa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B49A76" /><stop offset="0.5" stopColor={PC.ocre} /><stop offset="1" stopColor="#6A5A47" />
        </linearGradient>
      </defs>
      <path d={`M${cara} L1600 ${SUELO + 400} L1600 -300 Z`} fill="url(#sl-roca)" />
      {/* estratos y fisuras siguiendo el desplome */}
      {Array.from({ length: 9 }).map((_, i) => { const y = 260 + i * 290 + random(`ey${i}`) * 80; return <path key={i} d={`M${xF(y) + 10} ${y} q260 ${-30 - random(`eq${i}`) * 40} 620 ${20 + random(`ew${i}`) * 50} t520 ${-20}`} stroke="#3B414B" strokeWidth={5 + random(`es${i}`) * 5} fill="none" opacity={0.55} />; })}
      {/* chorreras (tufas): columnas colgantes con volumen */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y0 = 120 + i * 260 + random(`tu${i}`) * 90, x0 = xF(y0) + 70 + random(`tx${i}`) * 300, l = 420 + random(`tl${i}`) * 520, w = 22 + random(`tw${i}`) * 26, dx = l * 0.22;
        const d = `M${x0 - w} ${y0} C${x0 - w * 1.3} ${y0 + l * 0.35} ${x0 - w * 0.4 + dx * 0.6} ${y0 + l * 0.7} ${x0 + dx - 4} ${y0 + l} C${x0 + dx + w * 0.5} ${y0 + l * 0.9} ${x0 + w * 1.2 + dx * 0.4} ${y0 + l * 0.45} ${x0 + w} ${y0} Z`;
        return <g key={i} opacity={0.55 + random(`to${i}`) * 0.3}><path d={d} fill="url(#sl-tufa)" /><path d={`M${x0 - w * 0.6} ${y0 + 20} C${x0 - w * 0.9} ${y0 + l * 0.35} ${x0 - w * 0.2 + dx * 0.6} ${y0 + l * 0.7} ${x0 + dx - 6} ${y0 + l - 20}`} stroke="#D6C3A2" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" /></g>;
      })}
      {/* agujeros (bidedos) */}
      {Array.from({ length: 46 }).map((_, i) => { const y = random(`py${i}`) * 2700, x = xF(y) + 60 + random(`px${i}`) * 760, r = 7 + random(`pr${i}`) * 13; return <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill="#2B3039" opacity={0.8} /><path d={`M${x - r} ${y - 1} Q${x} ${y - r * 0.9} ${x + r} ${y - 1}`} stroke="#9AA3AD" strokeWidth={3} fill="none" opacity={0.45} /></g>; })}
      {/* borde iluminado por el cielo */}
      <path d={`M${cara}`} stroke="#A9C4D8" strokeWidth={10} fill="none" opacity={0.55} />
      <path d={`M${cara}`} stroke={PC.tinta} strokeWidth={4} fill="none" opacity={0.6} />
      {/* presas con magnesio cerca del escalador */}
      {magnesio.map(([y, o], i) => <g key={i}><ellipse cx={xF(y) + 12} cy={y} rx={22} ry={9} fill="#585F69" /><ellipse cx={xF(y) + 12} cy={y - 4} rx={18} ry={6} fill="#F1F3F5" opacity={o} /></g>)}
      {/* suelo de la cueva */}
      <path d={`M-400 ${SUELO + 20} Q300 ${SUELO - 10} 900 ${SUELO} L1600 ${SUELO} L1600 3200 L-400 3200 Z`} fill={PC.suelo} />
      {[[-120, 40, 90], [140, 25, 60], [420, 30, 50], [980, 10, 120]].map(([x, dy, r], i) => <ellipse key={i} cx={x} cy={SUELO + dy} rx={r} ry={r * 0.45} fill="#2C3137" />)}
      {cintas.map((y, i) => <Expres key={i} x={xF(y)} y={y} />)}
    </g>
  );
};

/** Fondo de SALA: nave de rocódromo con ventanales y focos (paralaje suave). */
export const FondoSala: React.FC<{ cx: number; cy: number; z: number }> = ({ cx, cy, z }) => {
  const px = (cx - 600) * 0.25, py = (cy - 1300) * 0.18, s = 1 + (z - 1) * 0.25;
  return (
    <g>
      <defs><linearGradient id="kit-sala" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C2430" /><stop offset="0.6" stopColor="#2E3948" /><stop offset="1" stopColor="#3B4757" /></linearGradient></defs>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#kit-sala)" />
      <g transform={`translate(540 960) scale(${s}) translate(${-540 - px} ${-960 - py})`}>
        {[0, 1, 2].map((i) => <g key={i}><rect x={-120 + i * 250} y={420} width={190} height={560} rx={10} fill="#5F7F9C" opacity={0.55} /><path d={`M${-25 + i * 250} 420 v560 M${-120 + i * 250} 700 h190`} stroke="#2E3948" strokeWidth={10} /></g>)}
        <path d="M-200 330 H800" stroke="#151B24" strokeWidth={26} />
        {[60, 330, 600].map((x, i) => <g key={i}><path d={`M${x} 330 v70`} stroke="#151B24" strokeWidth={8} /><path d={`M${x - 34} 400 h68 l18 34 h-104 Z`} fill="#151B24" /><path d={`M${x - 50} 434 L${x - 190} 1500 H${x + 190} L${x + 50} 434 Z`} fill="#FFE9B8" opacity={0.07} /></g>)}
        {/* pared del fondo con presas pequeñas, desenfocada */}
        <path d="M-200 1050 L560 1010 L560 2200 L-200 2200 Z" fill="#46546A" />
        {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={-180 + random(`sx${i}`) * 720} cy={1080 + random(`sy${i}`) * 700} rx={9 + random(`sr${i}`) * 9} ry={7} fill={["#D9B44A", "#C2553F", "#5FA37A", "#6C8FD1", "#B77FC4"][i % 5]} opacity={0.45} />)}
      </g>
    </g>
  );
};
const COL = ["#E0B63C", "#D4533F", "#4FA06F", "#4F7FD0", "#B06FC4", "#E8E3D6"];
/** Decorado SALA: muro de paneles con presas de colores, colchoneta y cintas fijas. */
export const Sala: React.FC<{ xF?: Perfil; suelo?: number; cintas?: number[]; color?: number }> = ({ xF = PERFILES.panel, suelo = 2650, cintas = [], color = 3 }) => {
  const ys = Array.from({ length: 60 }, (_, i) => -300 + i * 52), cara = ys.map((y) => `${xF(y)} ${y}`).join(" L");
  return (
    <g>
      <defs><linearGradient id="kit-panel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D8D2C4" /><stop offset="0.25" stopColor="#BDB7AA" /><stop offset="1" stopColor="#8E897F" /></linearGradient></defs>
      <path d={`M${cara} L1600 ${suelo + 400} L1600 -300 Z`} fill="url(#kit-panel)" />
      {/* juntas de panel y tuercas */}
      {Array.from({ length: 13 }).map((_, i) => { const y = -200 + i * 244; return <path key={i} d={`M${xF(y)} ${y} H1600`} stroke="#7F7A70" strokeWidth={5} opacity={0.7} />; })}
      {[260, 520, 780].map((dx) => <path key={dx} d={`M${ys.map((y) => `${xF(y) + dx} ${y}`).join(" L")}`} stroke="#7F7A70" strokeWidth={5} fill="none" opacity={0.6} />)}
      {Array.from({ length: 150 }).map((_, i) => { const y = -100 + Math.floor(i / 5) * 98, x = xF(y) + 48 + (i % 5) * 122 + (Math.floor(i / 5) % 2) * 61; return <circle key={i} cx={x} cy={y} r={4} fill="#6F6A61" opacity={0.6} />; })}
      {/* presas de otras vías (apagadas) y la vía propia (color vivo, junto al canto) */}
      {Array.from({ length: 46 }).map((_, i) => { const y = random(`hy${i}`) * 2600, x = xF(y) + 150 + random(`hx${i}`) * 700, r = 16 + random(`hr${i}`) * 26, c = COL[i % 6]; return <g key={i} transform={`rotate(${random(`ht${i}`) * 180} ${x} ${y})`} opacity={0.7}><ellipse cx={x} cy={y} rx={r} ry={r * 0.62} fill={c} stroke={PC.tinta} strokeWidth={4} /><circle cx={x} cy={y} r={4} fill={PC.tinta} opacity={0.6} /></g>; })}
      {Array.from({ length: 30 }).map((_, i) => { const y = suelo - 150 - i * 84 - (i % 3) * 10, x = xF(y) + 36 + (i % 2) * 14, r = 20 + random(`vr${i}`) * 8; return <g key={i} transform={`rotate(${-20 + random(`vt${i}`) * 40} ${x} ${y})`}><ellipse cx={x} cy={y} rx={r} ry={r * 0.5} fill={COL[color]} stroke={PC.tinta} strokeWidth={4} /><ellipse cx={x - 2} cy={y - 4} rx={r * 0.6} ry={r * 0.2} fill="#fff" opacity={0.4} /></g>; })}
      <path d={`M${cara}`} stroke="#F2EEE4" strokeWidth={10} fill="none" opacity={0.6} />
      <path d={`M${cara}`} stroke={PC.tinta} strokeWidth={4} fill="none" opacity={0.6} />
      {/* suelo: colchoneta */}
      <path d={`M-400 ${suelo} H1600 V3200 H-400 Z`} fill="#27456B" />
      <path d={`M-400 ${suelo} H1600`} stroke="#4E78AE" strokeWidth={12} />
      <path d={`M-400 ${suelo + 70} H1600`} stroke="#1C3352" strokeWidth={8} />
      {cintas.map((y, i) => <Expres key={i} x={xF(y)} y={y} color="#22262C" />)}
    </g>
  );
};

/** Plano con cámara. `decorado`: "cueva" | "sala". Los hijos se dibujan en coordenadas de mundo, por delante del decorado.
 *  `sh` = sacudida (px). Para un decorado propio, pasa `fondo` y `mundo`. */
export const Plano: React.FC<{ via: Via; cx: number; cy: number; z: number; sh?: number; decorado?: "cueva" | "sala"; cintas?: boolean; calido?: number; fondo?: React.ReactNode; mundo?: React.ReactNode; children?: React.ReactNode }> = ({ via, cx, cy, z, sh = 0, decorado = "cueva", cintas = true, calido, fondo, mundo, children }) => {
  const ch = cintas ? via.chapas : [];
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${Math.abs(sh) * 0.7}px)` }}>
      <Svg>
        {fondo ?? (decorado === "sala" ? <FondoSala cx={cx} cy={cy} z={z} /> : <Fondo cx={cx} cy={cy} z={z} calido={calido} />)}
        <g transform={cam(cx, cy, z)}>
          {mundo ?? (decorado === "sala" ? <Sala xF={via.xF} suelo={via.suelo} cintas={ch} /> : <Cueva xF={via.xF} suelo={via.suelo} cintas={ch} magnesio={via.presas.map((y) => [y, 0.55])} />)}
          {children}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
