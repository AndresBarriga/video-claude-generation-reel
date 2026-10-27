// Plantilla a medida para T15 "Tocando el vacío". Todo dibujado en SVG.
// Idea visual: la cuerda naranja es el hilo conductor de toda la historia.
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, random, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { fuenteTexto, fuenteTitulo } from "../tema";
import type { Datos, Escena } from "../tipos";
import { Subtitulos } from "../Subtitulos";
import config from "../../config.json";

const C = {
  noche1: "#0B1624", noche2: "#1C2E45", dia1: "#AFC3D6", dia2: "#EEF2F6",
  nieve: "#EEF3F8", nieveSombra: "#C5D2DE", roca: "#24303F", roca2: "#34445A",
  hielo1: "#0F2B40", hielo2: "#3E7EA6", cuerda: "#FF6A1F", blanco: "#FFFFFF", rojo: "#FF4B4B",
  tinta: "#0B1624",
};
const W = 1080, H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- piezas comunes ---------- */
const Fondo: React.FC<{ a: string; b: string; id: string }> = ({ a, b, id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);

const Nieve: React.FC<{ n?: number; vel?: number; viento?: number; seed?: string; op?: number }> = ({ n = 70, vel = 3, viento = 1, seed = "s", op = 0.8 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * W, y0 = random(`${seed}y${i}`) * H;
        const v = (0.5 + random(`${seed}v${i}`)) * vel, r = 2 + random(`${seed}r${i}`) * 5;
        const y = (y0 + f * v) % H, x = (x0 + f * v * 0.4 * viento + Math.sin((f + i * 13) / 18) * 8) % W;
        return <circle key={i} cx={x} cy={y} r={r} fill={C.blanco} opacity={op * (0.4 + random(`${seed}o${i}`) * 0.6)} />;
      })}
    </g>
  );
};

type Pose = "pie" | "sentado" | "colgado" | "cayendo" | "tumbado" | "arrastre";
const Persona: React.FC<{ x: number; y: number; pose: Pose; color?: string; s?: number; rot?: number; pierna?: boolean }> = ({ x, y, pose, color = C.blanco, s = 1.6, rot = 0, pierna }) => {
  const st = { stroke: color, strokeWidth: 14, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const P: Record<Pose, React.ReactElement> = {
    pie: (<g><circle cx={0} cy={-112} r={24} fill={color} /><path d="M0 -84 L0 -14 M0 -70 L-30 -34 M0 -70 L30 -34 M0 -14 L-22 44 M0 -14 L22 44" {...st} /></g>),
    sentado: (<g><circle cx={-18} cy={-96} r={24} fill={color} /><path d="M-12 -70 L10 -10 M-6 -56 L36 -40 M10 -10 L64 -18 M64 -18 L74 26 M10 -10 L58 4" {...st} /></g>),
    colgado: (<g><circle cx={0} cy={-88} r={24} fill={color} /><path d="M0 -62 L0 0 M0 -50 L-26 -6 M0 -50 L24 -8 M0 0 L-16 60 M0 0 L14 58" {...st} /></g>),
    cayendo: (<g><circle cx={0} cy={-88} r={24} fill={color} /><path d="M0 -62 L0 0 M0 -50 L-44 -86 M0 -50 L42 -90 M0 0 L-34 46 M0 0 L30 56" {...st} /></g>),
    tumbado: (<g><circle cx={-96} cy={-22} r={24} fill={color} /><path d="M-68 -16 L0 -10 M-50 -14 L-56 18 M0 -10 L58 -2 M0 -10 L56 20" {...st} /></g>),
    arrastre: (<g><circle cx={-92} cy={-40} r={24} fill={color} /><path d="M-66 -28 L0 -14 M-52 -24 L-74 14 M-40 -20 L-22 14 M0 -14 L60 -6 M0 -14 L52 12" {...st} /></g>),
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {P[pose]}
      {pierna && <circle cx={pose === "tumbado" || pose === "arrastre" ? 40 : 18} cy={pose === "tumbado" || pose === "arrastre" ? 6 : 26} r={16} fill={C.rojo} />}
    </g>
  );
};

const Cuerda: React.FC<{ d: string; w?: number; dash?: number; largo?: number }> = ({ d, w = 12, dash, largo = 3000 }) => (
  <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round"
    strokeDasharray={dash !== undefined ? largo : undefined} strokeDashoffset={dash !== undefined ? largo * (1 - dash) : undefined} />
);

const Etiqueta: React.FC<{ texto?: string; oscuro?: boolean }> = ({ texto, oscuro = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!texto) return null;
  const s = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top: 210, left: 70, right: 70, display: "flex", justifyContent: "center" }}>
      <div style={{
        fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 64, lineHeight: 1.05, textAlign: "center",
        color: oscuro ? C.blanco : C.tinta, transform: `translateY(${(1 - s) * -30}px)`, opacity: s,
        textShadow: oscuro ? "0 4px 24px rgba(0,0,0,.45)" : "none",
      }}>{texto}</div>
    </div>
  );
};

/** Cámara: pequeño zoom de entrada + empuje lento; sacudida opcional */
const Camara: React.FC<{ d: number; children: React.ReactNode; empuje?: number; sacudida?: number }> = ({ d, children, empuje = 0.05, sacudida = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const entrada = spring({ frame: f, fps, config: { damping: 20, stiffness: 160 } });
  const sc = 1 + 0.07 * (1 - entrada) + empuje * (f / Math.max(1, d));
  const sx = sacudida ? Math.sin(f * 2.3) * sacudida : 0, sy = sacudida ? Math.cos(f * 1.7) * sacudida : 0;
  return <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${sc})` }}>{children}</AbsoluteFill>;
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

/* ---------- escenas ---------- */
type P = { e: Escena; d: number };

// Gancho y cierre comparten imagen (bucle)
const ImagenColgando: React.FC<{ noche?: boolean }> = ({ noche = true }) => {
  const f = useCurrentFrame();
  const jx = 720 + Math.sin(f / 16) * 14, jy = 1230;
  return (
    <Svg>
      <Fondo a={noche ? C.noche1 : C.dia1} b={noche ? C.noche2 : C.dia2} id="fcol" />
      <Nieve seed="col" vel={4} viento={1.5} />
      {/* meseta de nieve y pared */}
      <path d={`M0 760 Q300 700 640 742 L660 760 L700 1920 L0 1920 Z`} fill={C.roca} />
      <path d={`M0 700 Q330 650 650 700 L640 760 Q300 720 0 770 Z`} fill={C.nieve} />
      <path d={`M640 742 L700 1920`} stroke={C.roca2} strokeWidth={6} />
      <Persona x={330} y={700} pose="sentado" />
      <Cuerda d={`M372 664 Q520 700 650 724 L${jx} ${jy}`} />
      <Persona x={jx} y={jy + 6} pose="colgado" pierna />
    </Svg>
  );
};

const Colgando: React.FC<P> = ({ e, d }) => (
  <>
    <Camara d={d} empuje={0.08}><AbsoluteFill style={{ transform: "scale(1.25)", transformOrigin: "62% 52%" }}><ImagenColgando /></AbsoluteFill></Camara>
    <Etiqueta texto={e.titulo} />
  </>
);

const Mapa: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = spring({ frame: f - 6, fps, config: { damping: 11 } });
  const alt = Math.round(interpolate(f, [6, d * 0.7], [0, 6344], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const ano = Math.round(interpolate(f, [0, d * 0.6], [2026, 1985], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <Fondo a="#D7E2EC" b="#F4F7FA" id="fmap" />
        <path d="M0 1380 L120 1200 L230 1300 L360 1080 L470 1210 L560 900 L660 1150 L780 1040 L900 1240 L1080 1120 L1080 1920 L0 1920 Z" fill="#9FB3C7" />
        <path d="M0 1500 L160 1330 L300 1440 L440 1260 L560 1380 L700 1290 L860 1420 L1080 1300 L1080 1920 L0 1920 Z" fill="#6F879F" />
        <path d="M560 900 L520 960 L548 950 L566 990 L590 950 L612 972 Z" fill={C.nieve} />
        <path d="M0 1640 L200 1540 L420 1620 L640 1520 L860 1610 L1080 1540 L1080 1920 L0 1920 Z" fill={C.roca2} />
        <g transform={`translate(560 ${880 - (1 - pin) * 300}) scale(${pin})`}>
          <path d="M0 0 C-40 -40 -40 -100 0 -100 C40 -100 40 -40 0 0 Z" fill={C.cuerda} />
          <circle cx={0} cy={-64} r={16} fill={C.blanco} />
        </g>
      </Svg>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, color: C.tinta }}>
        <div style={{ fontSize: 150, lineHeight: 1 }}>{ano}</div>
        <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 44, marginTop: 8, color: "#3C4E63" }}>PERÚ · {alt.toLocaleString("es-ES")} m</div>
      </div>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Pierna: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const t = d * 0.45;
  const caida = interpolate(f, [t - 6, t], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flash = interpolate(f, [t, t + 3, t + 12], [0, 1, 0], clamp);
  return (
    <Camara d={d} empuje={0.08} sacudida={f > t && f < t + 10 ? 10 : 0}>
      <Svg>
        <Fondo a="#C4D3E1" b="#EEF2F6" id="fpie" />
        <path d="M0 1100 L1080 1500 L1080 1920 L0 1920 Z" fill={C.nieve} />
        <path d="M0 1100 L1080 1500" stroke={C.nieveSombra} strokeWidth={8} />
        <Persona x={interpolate(caida, [0, 1], [500, 560])} y={interpolate(caida, [0, 1], [1210, 1300])}
          pose={caida < 1 ? "pie" : "tumbado"} color={C.tinta} rot={caida < 1 ? caida * 70 : 22} pierna={f > t} />
        {f > t && (
          <g transform="translate(600 1290)" opacity={interpolate(f, [t, t + 30], [1, 0.6], clamp)}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 90} y2={Math.sin((a * Math.PI) / 180) * 90} stroke={C.rojo} strokeWidth={10} strokeLinecap="round" />
            ))}
          </g>
        )}
        <rect width={W} height={H} fill={C.blanco} opacity={flash * 0.8} />
      </Svg>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Descenso: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  // 3 tramos de bajada
  const tramos = 3, p = f / d;
  const k = Math.min(tramos - 0.001, p * tramos), base = Math.floor(k), dentro = k - base;
  const avance = (base + Easing.inOut(Easing.cubic)(Math.min(1, dentro * 1.4))) / tramos;
  const x0 = 260, y0 = 520, x1 = 900, y1 = 1600;
  const jx = x0 + (x1 - x0) * (0.2 + 0.75 * avance), jy = y0 + (y1 - y0) * (0.2 + 0.75 * avance);
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Fondo a="#9DB2C7" b="#E3EAF1" id="fdes" />
        <path d={`M0 380 L1080 1500 L1080 1920 L0 1920 Z`} fill={C.nieve} />
        <path d={`M0 380 L1080 1500`} stroke={C.nieveSombra} strokeWidth={8} />
        <Persona x={x0} y={y0} pose="sentado" color={C.tinta} rot={46} />
        <Cuerda d={`M${x0 + 30} ${y0 - 20} L${jx} ${jy - 40}`} />
        <Persona x={jx} y={jy} pose="tumbado" color={C.tinta} rot={46} pierna />
        {/* regla de 90 m */}
        {[0, 1, 2, 3].map((i) => {
          const q = i / 3, rx = x0 + 120 + (x1 - x0 - 120) * q * 0.95, ry = y0 - 120 + (y1 - y0) * q * 0.95;
          return <g key={i}><line x1={rx} y1={ry} x2={rx + 40} y2={ry - 40} stroke={C.tinta} strokeWidth={6} />
            <text x={rx + 54} y={ry - 44} fontFamily={fuenteTexto} fontWeight={700} fontSize={40} fill={C.tinta}>{i * 90} m</text></g>;
        })}
      </Svg>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Noche: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const jx = 760 + Math.sin(f / 14) * 18;
  const x = interpolate(f, [d * 0.4, d * 0.55], [0, 1], clamp);
  return (
    <Camara d={d} empuje={0.05}>
      <Svg>
        <Fondo a="#050B14" b="#13233A" id="fnoc" />
        <Nieve seed="noc" n={140} vel={9} viento={3} op={0.6} />
        <path d="M0 860 L620 860 L640 900 L660 1920 L0 1920 Z" fill={C.roca} />
        <path d="M0 820 L630 820 L640 870 L0 880 Z" fill={C.nieveSombra} opacity={0.8} />
        <Persona x={260} y={830} pose="sentado" />
        <Cuerda d={`M300 794 L630 846 L${jx} 1420`} />
        <Persona x={jx} y={1426} pose="colgado" pierna />
        <line x1={290} y1={760} x2={jx} y2={1340} stroke={C.blanco} strokeWidth={5} strokeDasharray="14 16" opacity={0.6} />
        <g transform={`translate(560 1010) scale(${x})`}>
          <line x1={-50} y1={-50} x2={50} y2={50} stroke={C.rojo} strokeWidth={18} strokeLinecap="round" />
          <line x1={50} y1={-50} x2={-50} y2={50} stroke={C.rojo} strokeWidth={18} strokeLinecap="round" />
        </g>
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Reloj: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, d * 0.85], [0, 90], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const h = Math.floor(t / 60), m = Math.floor(t % 60);
  const ang = (t / 60) * 360;
  const ceder = interpolate(f, [d * 0.5, d], [0, 1], clamp);
  return (
    <Camara d={d} empuje={0.07} sacudida={ceder * 4}>
      <Svg>
        <Fondo a="#081220" b="#182A40" id="frel" />
        <Nieve seed="rel" n={90} vel={6} viento={2} op={0.5} />
        <circle cx={540} cy={760} r={250} fill="none" stroke={C.blanco} strokeWidth={14} opacity={0.9} />
        <path d={`M540 760 L540 510 A250 250 0 ${ang % 360 > 180 ? 1 : 0} 1 ${540 + 250 * Math.sin((ang * Math.PI) / 180)} ${760 - 250 * Math.cos((ang * Math.PI) / 180)} Z`} fill={C.cuerda} opacity={0.35} />
        <line x1={540} y1={760} x2={540 + 210 * Math.sin((ang * Math.PI) / 180)} y2={760 - 210 * Math.cos((ang * Math.PI) / 180)} stroke={C.cuerda} strokeWidth={16} strokeLinecap="round" />
        <circle cx={540} cy={760} r={18} fill={C.blanco} />
        {/* asiento de nieve que cede */}
        <g transform={`translate(0 ${ceder * 40})`}>
          <path d="M120 1260 Q420 1200 700 1250 L720 1320 L100 1330 Z" fill={C.nieve} />
          <Persona x={340 + ceder * 40} y={1250} pose="sentado" />
          <Cuerda d={`M380 1214 Q600 1240 720 1300 L760 1920`} />
          {Array.from({ length: 22 }).map((_, i) => (
            <circle key={i} cx={220 + random(`c${i}`) * 480} cy={1330 + ((f * (3 + random(`v${i}`) * 5) + random(`y${i}`) * 300) % 400) * ceder}
              r={4 + random(`r${i}`) * 8} fill={C.nieve} opacity={ceder} />
          ))}
          {ceder > 0.2 && <path d={`M300 1230 L330 1262 L310 1290 M520 1226 L500 1260 L530 1300`} stroke={C.tinta} strokeWidth={6} fill="none" opacity={ceder} />}
        </g>
      </Svg>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 120, color: C.blanco, fontVariantNumeric: "tabular-nums" }}>
        {h}:{String(m).padStart(2, "0")}
      </div>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Corte: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const t = Math.round(d * 0.55);
  const navaja = interpolate(f, [0, t], [1300, 600], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cae = Math.max(0, f - t);
  const flash = interpolate(f, [t, t + 2, t + 8], [0, 1, 0], clamp);
  return (
    <Camara d={d} empuje={0.12} sacudida={cae > 0 && cae < 12 ? 16 : 0}>
      <Svg>
        <Fondo a="#03070D" b="#0E1B2C" id="fcor" />
        <Nieve seed="cor" n={50} vel={5} op={0.4} />
        {/* cuerda vertical gruesa, primer plano */}
        {cae === 0 ? (
          <path d={`M540 0 L540 1920`} stroke={C.cuerda} strokeWidth={46} />
        ) : (
          <>
            <path d={`M540 0 L540 ${960 - Math.min(cae * 30, 300)}`} stroke={C.cuerda} strokeWidth={46} strokeLinecap="round" />
            <g transform={`translate(${cae * 2} ${cae * cae * 2.2}) rotate(${cae * 1.2} 540 960)`}>
              <path d={`M540 990 L540 1920`} stroke={C.cuerda} strokeWidth={46} strokeLinecap="round" />
            </g>
          </>
        )}
        {/* trenzado */}
        {cae === 0 && Array.from({ length: 30 }).map((_, i) => <line key={i} x1={518} y1={i * 64} x2={562} y2={i * 64 + 30} stroke="#C84A0E" strokeWidth={6} />)}
        {/* navaja */}
        <g transform={`translate(${navaja} 975) rotate(-8)`} opacity={cae > 20 ? interpolate(cae, [20, 30], [1, 0], clamp) : 1}>
          <path d="M0 0 L260 -30 L280 0 L260 22 Z" fill="#D8DEE6" />
          <path d="M0 0 L260 -30 L280 0 Z" fill="#F4F7FA" />
          <rect x={270} y={-26} width={260} height={52} rx={18} fill="#2A3442" />
        </g>
        <rect width={W} height={H} fill={C.blanco} opacity={flash} />
      </Svg>
    </Camara>
  );
};

const No: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = d * 0.62;
  const s = spring({ frame: f - t, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ background: "#03070D", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 420, color: C.cuerda, transform: `scale(${s})`, opacity: f > t ? 1 : 0, marginTop: -200 }}>NO.</div>
    </AbsoluteFill>
  );
};

const Grieta: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, d * 0.7], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const aterriza = f > d * 0.7;
  const scroll = p * 2400;
  const prof = Math.round(p * 60);
  const pared = (lado: number) => {
    const pts: string[] = [];
    for (let i = -2; i < 30; i++) {
      const y = i * 160 - (scroll % 160) - 160 * Math.floor(scroll / 160) + scroll - scroll; // estable
      const yy = i * 160 - (scroll % 320);
      const x = lado < 0 ? 260 + random(`g${lado}${i + Math.floor(scroll / 320) * 2}`) * 90 : 820 - random(`g${lado}${i + Math.floor(scroll / 320) * 2}`) * 90;
      pts.push(`${x},${yy}`);
      void y;
    }
    return lado < 0 ? `0,-400 ${pts.join(" ")} 0,2400` : `1080,-400 ${pts.join(" ")} 1080,2400`;
  };
  return (
    <Camara d={d} empuje={0.02} sacudida={aterriza && f < d * 0.7 + 8 ? 12 : 0}>
      <Svg>
        <Fondo a="#0A1F30" b="#020910" id="fgri" />
        <polygon points={pared(-1)} fill={C.hielo2} />
        <polygon points={pared(1)} fill="#2F6A91" />
        {aterriza && <path d="M380 1280 L700 1270 L680 1320 L400 1330 Z" fill="#BFE0F2" />}
        <Persona x={540} y={aterriza ? 1262 : 900} pose={aterriza ? "tumbado" : "cayendo"} rot={aterriza ? 0 : f * 4} pierna />
        <Cuerda d={aterriza ? "M600 1250 Q700 1180 640 1100" : `M540 860 Q${540 + Math.sin(f / 3) * 60} 600 ${520 + Math.cos(f / 4) * 40} 420`} />
      </Svg>
      <div style={{ position: "absolute", right: 80, top: 560, fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 96, color: C.blanco, fontVariantNumeric: "tabular-nums" }}>−{prof} m</div>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Salida: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const baja = interpolate(f, [0, d * 0.45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const luz = interpolate(f, [d * 0.4, d * 0.8], [0, 1], clamp);
  return (
    <Camara d={d} empuje={0.06}>
      <Svg>
        <Fondo a="#06131F" b="#010508" id="fsal" />
        <path d="M0 0 L300 0 L240 1920 L0 1920 Z" fill="#1E4A68" />
        <path d="M1080 0 L780 0 L860 1920 L1080 1920 Z" fill="#163C56" />
        <path d={`M1080 900 L640 1080 L640 1240 L1080 1400 Z`} fill="#FFF6DA" opacity={luz * 0.55} />
        <circle cx={1040} cy={1150} r={200} fill="#FFF6DA" opacity={luz * 0.7} />
        <Cuerda d={`M520 300 L520 ${600 + baja * 420}`} w={10} />
        <Persona x={520 + luz * 160} y={700 + baja * 420} pose={luz > 0.3 ? "arrastre" : "colgado"} pierna />
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Arrastre: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, d * 0.92], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const dia = Math.min(3, 1 + Math.floor(p * 3));
  const km = (p * 8).toFixed(1).replace(".", ",");
  const camino = "M200 520 C420 640 260 900 480 1000 C700 1100 560 1300 760 1380 C900 1440 860 1560 900 1600";
  const L = 1900;
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Fondo a="#E9E4DA" b="#D9D1C2" id="farr" />
        {Array.from({ length: 70 }).map((_, i) => (
          <circle key={i} cx={random(`p${i}`) * W} cy={300 + random(`q${i}`) * 1500} r={6 + random(`r${i}`) * 18} fill="#B9AE9B" opacity={0.6} />
        ))}
        <path d={camino} stroke="#8F836F" strokeWidth={10} fill="none" strokeDasharray="4 22" strokeLinecap="round" />
        <path d={camino} stroke={C.cuerda} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
        <path d="M150 500 L250 490 L240 540 L160 545 Z" fill={C.hielo2} />
        <path d="M860 1600 L940 1600 L900 1530 Z" fill="#3A6B4F" />
      </Svg>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", color: C.tinta, fontFamily: fuenteTitulo, fontWeight: 800 }}>
        <div style={{ fontSize: 120, lineHeight: 1 }}>DÍA {dia}</div>
        <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 52, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{km} / 8 km · sin comida</div>
      </div>
    </Camara>
  );
};

const Campamento: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const llega = interpolate(f, [0, d * 0.9], [80, 380], clamp);
  return (
    <Camara d={d} empuje={0.05}>
      <Svg>
        <Fondo a="#2B2140" b="#E58E5A" id="fcam" />
        <path d="M0 1240 L1080 1200 L1080 1920 L0 1920 Z" fill="#5D4A3E" />
        <circle cx={780} cy={1110} r={180} fill="#FFC27A" opacity={0.25 + 0.1 * Math.sin(f / 5)} />
        <path d="M640 1220 L780 1010 L920 1220 Z" fill="#FF9A3C" />
        <path d="M780 1010 L760 1220 L800 1220 Z" fill="#B8541A" />
        <Persona x={980} y={1176} pose="pie" />
        <rect x={900} y={1130} width={50} height={70} rx={12} fill="#2A3442" />
        <Persona x={llega} y={1236} pose="arrastre" pierna />
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Abrazo: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const une = interpolate(f, [d * 0.15, d * 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <Fondo a="#F3E3C9" b="#EBD2A8" id="fabr" />
        <path d="M0 1300 L1080 1300 L1080 1920 L0 1920 Z" fill="#D6BB8E" />
        <Persona x={400} y={1250} pose="pie" color={C.tinta} />
        <Persona x={680} y={1250} pose="pie" color={C.tinta} />
        <Cuerda d="M400 1220 Q540 1330 680 1220" dash={une} largo={400} />
      </Svg>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Pregunta: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <ImagenColgando />
      <AbsoluteFill style={{ background: "rgba(3,7,13,.45)" }} />
      <Etiqueta texto={e.titulo} />
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40, transform: `scale(${s})` }}>
        {["SÍ", "NO"].map((x) => (
          <div key={x} style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 80, color: C.blanco, background: x === "SÍ" ? C.cuerda : "#2F6A91", padding: "16px 64px", borderRadius: 999 }}>{x}</div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 40, color: C.blanco, opacity: s }}>Responde en comentarios · {config.cuenta}</div>
    </AbsoluteFill>
  );
};

const ESCENAS: Record<string, React.FC<P>> = {
  colgando: Colgando, mapa: Mapa, pierna: Pierna, descenso: Descenso, noche: Noche, reloj: Reloj,
  corte: Corte, no: No, grieta: Grieta, salida: Salida, arrastre: Arrastre, campamento: Campamento,
  abrazo: Abrazo, pregunta: Pregunta,
};

export const Vacio: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: C.noche1 }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      {datos.escenas.map((e, i) => {
        const ini = Math.round((e.inicio ?? 0) * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = Math.max(1, Math.round(finS * fps) - ini);
        const Comp = ESCENAS[(e as any).visual] ?? Colgando;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} /></Sequence>;
      })}
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
