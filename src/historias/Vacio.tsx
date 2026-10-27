// E15 "Tocando el vacío" v2. Todo dibujado en SVG.
// Idea visual: la cuerda naranja es el hilo conductor (une, se corta, cae deshilachada y vuelve a anudarse al final).
// Personajes: Joe (rojo, casco amarillo) y Simon (azul petróleo, casco blanco), de src/piezas/Escalador.
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, random, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { fuenteTexto, fuenteTitulo } from "../tema";
import type { Datos, Escena } from "../tipos";
import { Subtitulos } from "../Subtitulos";
import { Escalador } from "../piezas/Escalador";
import { Grano } from "../piezas/Grano";

const C = {
  noche1: "#08111D", noche2: "#1A2C44", lejos: "#22364F", lejos2: "#2D4664",
  dia1: "#A9C0D6", dia2: "#EEF2F6", lejosDia: "#B9CADB", lejosDia2: "#8FA7BF",
  nieve: "#EEF3F8", nieveSombra: "#B9C8D6", nieveNoche: "#9FB2C6", nieveNocheS: "#6F86A0",
  roca: "#1E2937", roca2: "#2C3A4D", hielo1: "#0E2A40", hielo2: "#3C7FA8", hielo3: "#7FB7D6",
  cuerda: "#FF6A1F", cuerdaS: "#B8460E", blanco: "#FFFFFF", tinta: "#0B1624", luz: "#FFE7A8",
};
const W = 1080, H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- piezas comunes ---------- */
const Cielo: React.FC<{ a: string; b: string; id: string }> = ({ a, b, id }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);

/** Cordillera lejana (plano de fondo, poco contraste). */
const Cordillera: React.FC<{ y: number; color: string; seed: string; amp?: number; nieve?: string; dx?: number }> = ({ y, color, seed, amp = 260, nieve, dx = 0 }) => {
  const n = 9, pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([-100 + (i * (W + 200)) / n + dx, y - (i % 2 ? amp * (0.5 + random(`${seed}${i}`) * 0.6) : amp * 0.15 * random(`${seed}b${i}`))]);
  const d = `M-200 ${H} L${pts.map((p) => p.join(" ")).join(" L")} L${W + 200} ${H} Z`;
  return (
    <g>
      <path d={d} fill={color} />
      {nieve && pts.map((p, i) => i % 2 ? <path key={i} d={`M${p[0]} ${p[1]} l-46 ${60} l22 -6 l24 22 l20 -24 l22 6 Z`} fill={nieve} opacity={0.7} /> : null)}
    </g>
  );
};

const Copos: React.FC<{ n?: number; vel?: number; viento?: number; seed?: string; op?: number; grandes?: boolean }> = ({ n = 70, vel = 3, viento = 1, seed = "s", op = 0.8, grandes }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * W, y0 = random(`${seed}y${i}`) * H;
        const v = (0.5 + random(`${seed}v${i}`)) * vel, r = (grandes ? 9 : 2) + random(`${seed}r${i}`) * (grandes ? 14 : 5);
        const y = (y0 + f * v) % H, x = (((x0 + f * v * 0.4 * viento + Math.sin((f + i * 13) / 18) * 8) % W) + W) % W;
        return <circle key={i} cx={x} cy={y} r={r} fill={C.blanco} opacity={op * (0.4 + random(`${seed}o${i}`) * 0.6)} filter={grandes ? "url(#desenfoque)" : undefined} />;
      })}
    </g>
  );
};

/** Ráfagas de viento horizontales ("no le oye"). */
const Viento: React.FC<{ n?: number; seed?: string; op?: number }> = ({ n = 18, seed = "w", op = 0.25 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const y = 300 + random(`${seed}y${i}`) * 1100, L = 120 + random(`${seed}l${i}`) * 260, v = 24 + random(`${seed}v${i}`) * 30;
        const x = ((random(`${seed}x${i}`) * 2000 + f * v) % 2000) - 500;
        return <line key={i} x1={x} y1={y} x2={x + L} y2={y - 6} stroke={C.blanco} strokeWidth={3} strokeLinecap="round" opacity={op} />;
      })}
    </g>
  );
};

const Defs: React.FC = () => (
  <defs>
    <filter id="desenfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="desenfoque2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
    <radialGradient id="halo"><stop offset="0" stopColor={C.luz} stopOpacity="0.9" /><stop offset="1" stopColor={C.luz} stopOpacity="0" /></radialGradient>
  </defs>
);

/** Cuerda con sombra y trenzado. */
const Cuerda: React.FC<{ d: string; w?: number; dash?: number; largo?: number; op?: number }> = ({ d, w = 11, dash, largo = 3000, op = 1 }) => {
  const da = dash !== undefined ? largo : undefined, off = dash !== undefined ? largo * (1 - dash) : undefined;
  return (
    <g opacity={op}>
      <path d={d} stroke={C.cuerdaS} strokeWidth={w + 4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da} strokeDashoffset={off} />
      <path d={d} stroke={C.cuerda} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da} strokeDashoffset={off} />
      {dash === undefined && <path d={d} stroke="#FFB27F" strokeWidth={Math.max(2, w * 0.22)} fill="none" strokeDasharray={`${w * 0.9} ${w * 1.1}`} opacity={0.7} />}
    </g>
  );
};

/** Extremo cortado y deshilachado de la cuerda en (x, y) apuntando con ángulo `a` (grados). */
const Deshilachado: React.FC<{ x: number; y: number; a?: number; w?: number }> = ({ x, y, a = 0, w = 11 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    {[-0.4, -0.15, 0.1, 0.35].map((k, i) => (
      <path key={i} d={`M0 ${k * w * 1.6} q${w * 0.9} ${k * w * 1.4 + (i % 2 ? 3 : -3)} ${w * 1.6} ${k * w * 2.6}`} stroke={i % 2 ? C.cuerda : "#FFB27F"} strokeWidth={Math.max(2, w * 0.28)} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

const Etiqueta: React.FC<{ texto?: string; oscuro?: boolean }> = ({ texto, oscuro = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!texto) return null;
  const s = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top: 220, left: 70, right: 70, display: "flex", justifyContent: "center" }}>
      <div style={{
        fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 66, lineHeight: 1.05, textAlign: "center",
        color: oscuro ? C.blanco : C.tinta, transform: `translateY(${(1 - s) * -30}px)`, opacity: s,
        textShadow: oscuro ? "0 4px 24px rgba(0,0,0,.55)" : "0 2px 16px rgba(255,255,255,.6)",
      }}>{texto}</div>
    </div>
  );
};

/** Contador grande (dato animado). */
const Contador: React.FC<{ texto: string; sub?: string; top?: number; color?: string }> = ({ texto, sub, top = 300, color = C.blanco }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, color, textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>
    <div style={{ fontSize: 132, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{texto}</div>
    {sub && <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 46, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{sub}</div>}
  </div>
);

/** Cámara: zoom de entrada + empuje lento hacia un punto; sacudida opcional. */
const Camara: React.FC<{ d: number; children: React.ReactNode; empuje?: number; sacudida?: number; foco?: string }> = ({ d, children, empuje = 0.05, sacudida = 0, foco = "50% 50%" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const entrada = spring({ frame: f, fps, config: { damping: 20, stiffness: 160 } });
  const sc = 1 + 0.06 * (1 - entrada) + empuje * (f / Math.max(1, d));
  const sx = sacudida ? Math.sin(f * 2.3) * sacudida : 0, sy = sacudida ? Math.cos(f * 1.7) * sacudida : 0;
  return <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${sc})`, transformOrigin: foco }}>{children}</AbsoluteFill>;
};

/** Acerca el plano medio (personajes ≥25 % de altura) sin tocar el cielo. */
const Zoom: React.FC<{ s: number; cx: number; cy: number; dy?: number; children: React.ReactNode }> = ({ s, cx, cy, dy = 0, children }) => (
  <g transform={`translate(${cx} ${cy + dy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}><Defs />{children}</svg>
);
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* ---------- escenas ---------- */
type P = { e: Escena; d: number };

// Gancho y cierre comparten imagen (bucle): Simon aguanta en la nieve, Joe cuelga bajo el saliente.
const ImagenColgando: React.FC = () => {
  const f = useCurrentFrame();
  const vaiven = Math.sin(f / 18);
  const jx = 790 + vaiven * 16, jy = 1030;
  const sx = 390, sy = 560;
  return (
    <Svg>
      <Cielo a={C.noche1} b={C.noche2} id="fcol" />
      <Cordillera y={1000} color={C.lejos} seed="c1" nieve="#3B5577" />
      <Copos seed="col" vel={4} viento={1.5} op={0.7} />
      <Zoom s={1.4} cx={600} cy={760} dy={60}>
      {/* pared con desplome: la base se mete hacia dentro, Joe cuelga en el vacío */}
      <path d="M0 600 Q320 560 640 590 L700 612 Q660 650 600 668 Q560 900 540 1920 L0 1920 Z" fill={C.roca} />
      <path d="M600 668 Q560 900 540 1920 L500 1920 Q520 900 570 680 Z" fill={C.roca2} />
      <path d="M0 586 Q320 540 650 576 L706 606 L696 620 Q600 600 320 608 Q160 612 0 622 Z" fill={C.nieveNoche} />
      <path d="M0 586 Q320 540 650 576 L706 606" stroke={C.nieve} strokeWidth={6} fill="none" opacity={0.7} />
      {/* asiento excavado */}
      <ellipse cx={sx - 10} cy={sy + 26} rx={110} ry={26} fill={C.nieveNocheS} />
      <Escalador x={sx} y={sy} quien="simon" pose="tirando" cara="esfuerzo" s={0.95} />
      <Cuerda d={`M${sx + 22} ${sy - 18} Q${(sx + 700) / 2} ${sy + 20} 696 606 L${jx + 6} ${jy - 46}`} />
      <Escalador x={jx} y={jy} quien="joe" pose="colgadoRota" cara="miedo" s={1.05} rot={-vaiven * 4} />
      </Zoom>
      {/* primer plano: ventisca desenfocada */}
      <Copos seed="colG" n={10} vel={10} viento={2} op={0.5} grandes />
    </Svg>
  );
};

const Colgando: React.FC<P> = ({ e, d }) => (
  <>
    <Camara d={d} empuje={0.1} foco="60% 55%"><ImagenColgando /></Camara>
    <Etiqueta texto={e.titulo} />
  </>
);

const Mapa: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pin = spring({ frame: f - 8, fps, config: { damping: 11 } });
  const ano = Math.round(interpolate(f, [0, d * 0.55], [2026, 1985], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <Camara d={d} empuje={0.06} foco="50% 60%">
      <Svg>
        <Cielo a="#C9D8E6" b="#F4F7FA" id="fmap" />
        <Cordillera y={1240} color={C.lejosDia} seed="m1" amp={220} />
        {/* Siula Grande: cara oeste */}
        <path d="M120 1500 L380 1120 L470 1180 L560 860 L650 1060 L720 1010 L960 1500 Z" fill="#7F97B0" />
        <path d="M560 860 L470 1180 L520 1140 L548 1260 L590 1100 L650 1060 Z" fill="#617A94" />
        <path d="M560 860 L506 960 L536 948 L560 1000 L586 950 L620 980 Z" fill={C.nieve} />
        <path d="M380 1120 L340 1180 L372 1170 L392 1200 L410 1160 Z" fill={C.nieve} opacity={0.9} />
        <Cordillera y={1560} color={C.roca2} seed="m2" amp={180} />
        <g transform={`translate(560 ${840 - (1 - pin) * 260}) scale(${pin})`}>
          <path d="M0 0 C-40 -40 -40 -100 0 -100 C40 -100 40 -40 0 0 Z" fill={C.cuerda} />
          <circle cx={0} cy={-64} r={16} fill={C.blanco} />
        </g>
      </Svg>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, color: C.tinta }}>
        <div style={{ fontSize: 170, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{ano}</div>
        <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 48, marginTop: 8, color: "#3C4E63", letterSpacing: 4 }}>PERÚ</div>
      </div>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Pierna: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const t0 = d * 0.3, t = d * 0.48;
  const caida = interpolate(f, [t0, t], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const flash = interpolate(f, [t, t + 2, t + 9], [0, 1, 0], clamp);
  const suelo = f >= t;
  const jx = interpolate(caida, [0, 1], [430, 560]), jy = interpolate(caida, [0, 1], [780, 1170]);
  const puff = Math.max(0, f - t);
  return (
    <Camara d={d} empuje={0.08} foco="55% 62%" sacudida={f > t && f < t + 10 ? 12 : 0}>
      <Svg>
        <Cielo a="#B4C7DA" b="#EEF2F6" id="fpie" />
        <Cordillera y={980} color={C.lejosDia} seed="p1" amp={240} nieve="#E4ECF3" />
        {/* escalón de hielo */}
        <path d="M0 830 L470 830 L500 870 L520 1120 L1080 1260 L1080 1920 L0 1920 Z" fill={C.nieve} />
        <path d="M470 830 L500 870 L520 1120 L470 1110 Z" fill={C.hielo3} />
        <path d="M520 1120 L1080 1260" stroke={C.nieveSombra} strokeWidth={8} />
        {suelo && <ellipse cx={560} cy={1200} rx={130} ry={18} fill="#000" opacity={0.15} />}
        <Escalador x={jx} y={suelo ? 1176 : jy} quien="joe" pose={suelo ? "tumbadoRota" : "pie"} poseB={suelo ? undefined : "cayendo"} t={caida}
          cara={suelo ? "dolor" : caida > 0 ? "miedo" : "normal"} rot={suelo ? 14 : caida * 50} s={1.1} sombra={suelo ? undefined : 836} />
        {puff > 0 && Array.from({ length: 26 }).map((_, i) => {
          const a = random(`pa${i}`) * Math.PI, v = 6 + random(`pv${i}`) * 12;
          return <circle key={i} cx={560 + Math.cos(a) * v * puff * 1.4} cy={1190 - Math.sin(a) * v * puff + puff * puff * 0.25} r={6 + random(`pr${i}`) * 12} fill={C.blanco} opacity={interpolate(puff, [0, 24], [1, 0], clamp)} />;
        })}
        <rect width={W} height={H} fill={C.blanco} opacity={flash * 0.7} />
      </Svg>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Descenso: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const tramos = 3, p = f / d;
  const k = Math.min(tramos - 0.001, p * tramos), base = Math.floor(k), dentro = k - base;
  const tramo = Easing.inOut(Easing.cubic)(Math.min(1, dentro * 1.3));
  // la ladera se desplaza: cada tramo, Joe baja 90 m y la escena "sube" para seguirle
  const ang = 32, sx = 250, sy = 620;
  const dist = 140 + 520 * tramo;
  const jx = sx + Math.cos((ang * Math.PI) / 180) * dist, jy = sy + Math.sin((ang * Math.PI) / 180) * dist;
  const metros = Math.round(90 * tramo);
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Cielo a="#93A9C0" b="#DCE5EE" id="fdes" />
        <Cordillera y={900} color={C.lejosDia2} seed={`d${base}`} amp={200} nieve="#E4ECF3" />
        <path d={`M0 ${sy + 40 - Math.tan((ang * Math.PI) / 180) * sx} L${W} ${sy + 40 + Math.tan((ang * Math.PI) / 180) * (W - sx)} L${W} ${H} L0 ${H} Z`} fill={C.nieve} />
        <path d={`M0 ${sy + 40 - Math.tan((ang * Math.PI) / 180) * sx} L${W} ${sy + 40 + Math.tan((ang * Math.PI) / 180) * (W - sx)}`} stroke={C.nieveSombra} strokeWidth={8} />
        {/* surco que deja Joe al deslizarse */}
        <line x1={sx + 60} y1={sy + 70} x2={jx - 20} y2={jy + 40} stroke={C.nieveSombra} strokeWidth={22} strokeLinecap="round" opacity={0.6} />
        <ellipse cx={sx - 10} cy={sy + 34} rx={100} ry={24} fill={C.nieveSombra} transform={`rotate(${ang} ${sx} ${sy + 34})`} />
        <Escalador x={sx} y={sy} quien="simon" pose="sentado" cara="esfuerzo" rot={ang * 0.5} s={0.95} />
        <Cuerda d={`M${sx + 40} ${sy - 4} L${jx - 70} ${jy - 8}`} />
        <Escalador x={jx} y={jy} quien="joe" pose="tumbadoRota" cara="dolor" rot={ang} s={0.95} />
      </Svg>
      {/* indicador de cuerda */}
      <div style={{ position: "absolute", right: 90, top: 330, width: 26, height: 360, borderRadius: 13, background: "rgba(11,22,36,.18)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${(metros / 90) * 100}%`, borderRadius: 13, background: C.cuerda }} />
      </div>
      <div style={{ position: "absolute", right: 60, top: 710, width: 200, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 62, color: C.tinta, fontVariantNumeric: "tabular-nums" }}>{metros} m</div>
      <div style={{ position: "absolute", right: 60, top: 780, width: 200, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 34, color: "#3C4E63" }}>tramo {base + 1}</div>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Noche: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const vaiven = Math.sin(f / 14);
  const jx = 820 + vaiven * 18, jy = 1120;
  const sx = 360, sy = 620;
  return (
    <Camara d={d} empuje={0.05} foco="60% 50%">
      <Svg>
        <Cielo a="#03070D" b="#0E1C2E" id="fnoc" />
        <Cordillera y={1000} color="#13233A" seed="n1" />
        <Zoom s={1.3} cx={620} cy={800}>
        <path d="M0 660 Q320 620 640 650 L720 672 Q680 700 620 716 Q580 960 560 1920 L0 1920 Z" fill={C.roca} />
        <path d="M0 646 Q320 600 660 636 L724 668 L712 682 Q600 662 320 668 Q160 672 0 682 Z" fill={C.nieveNocheS} />
        {/* frontal de Simon: la luz llega al borde y no pasa del saliente */}
        <path d={`M${sx + 56} ${sy - 150} L726 600 L716 700 Z`} fill={C.luz} opacity={0.22} />
        <ellipse cx={706} cy={662} rx={40} ry={16} fill={C.luz} opacity={0.35} />
        <Escalador x={sx} y={sy} quien="simon" pose="tirando" cara="miedo" s={0.95} />
        <Cuerda d={`M${sx + 22} ${sy - 18} Q450 ${sy + 30} 714 666 L${jx + 6} ${jy - 46}`} />
        {/* Joe, en la oscuridad bajo el desplome; solo su frontal */}
        <circle cx={jx + 18} cy={jy - 140} r={120} fill="url(#halo)" opacity={0.35} />
        <g opacity={0.9}><Escalador x={jx} y={jy} quien="joe" pose="colgadoRota" cara="miedo" s={0.95} rot={-vaiven * 5} /></g>
        </Zoom>
        <rect x={0} y={0} width={W} height={H} fill="#03070D" opacity={0.25} />
        <Viento seed="noc" n={22} op={0.22} />
        <Copos seed="noc" n={140} vel={9} viento={3} op={0.55} />
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

/** Hora y media aguantando: el asiento de nieve cede y Simon resbala hacia el borde. */
const Resbala: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const tiempo = interpolate(f, [0, d * 0.75], [0, 90], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const h = Math.floor(tiempo / 60), m = Math.floor(tiempo % 60);
  const ceder = interpolate(f, [d * 0.35, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const sx = 280 + ceder * 200, sy = 990, borde = 860;
  const talon = sx + 200;
  return (
    <Camara d={d} empuje={0.08} foco="60% 55%" sacudida={ceder * 3}>
      <Svg>
        <Cielo a="#050B14" b="#16283E" id="fres" />
        <Cordillera y={1060} color="#152740" seed="r1" />
        <path d={`M0 1040 L${borde} 1040 L${borde + 30} 1066 Q${borde + 10} 1090 ${borde - 20} 1110 L${borde - 60} 1920 L0 1920 Z`} fill={C.roca} />
        <path d={`M0 1022 L${borde} 1022 L${borde + 34} 1060 L${borde + 20} 1080 Q600 1062 0 1080 Z`} fill={C.nieveNoche} />
        {/* surcos que dejan los talones */}
        <path d={`M${280 + 200} 1046 L${talon} 1046`} stroke={C.nieveNocheS} strokeWidth={18} strokeLinecap="round" opacity={ceder > 0 ? 1 : 0} />
        {/* grietas en la cornisa */}
        <path d={`M${borde - 40} 1030 l-30 30 l20 20 l-24 26 M${borde - 120} 1032 l14 28 l-18 26`} stroke={C.tinta} strokeWidth={5} fill="none" opacity={interpolate(ceder, [0.4, 0.7], [0, 0.8], clamp)} />
        <Escalador x={sx} y={sy} quien="simon" pose="tirando" cara="esfuerzo" s={1.65} />
        <Cuerda d={`M${sx + 40} ${sy - 30} L${borde + 10} 1050 L${borde + 30} ${H}`} w={14} />
        {/* nieve que salta de los talones y cae por el borde */}
        {Array.from({ length: 24 }).map((_, i) => {
          const fase = ((f * (2 + random(`n${i}`) * 3) + random(`m${i}`) * 60) % 60) / 60;
          return <circle key={i} cx={talon + fase * (borde - talon + 60) + random(`x${i}`) * 30} cy={1030 - Math.sin(fase * Math.PI) * 40 + Math.max(0, fase - 0.7) * 600} r={4 + random(`r${i}`) * 7} fill={C.nieve} opacity={ceder} />;
        })}
        <Copos seed="res" n={80} vel={7} viento={2} op={0.45} />
      </Svg>
      <Contador texto={`${h}:${String(m).padStart(2, "0")} h`} top={330} />
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

/** Primer plano: la mano de Simon corta la cuerda en el borde. */
const Corte: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const t = Math.round(d * 0.58);
  const entra = interpolate(f, [0, t * 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sierra = f < t && f > t * 0.7 ? Math.sin(f * 1.6) * 14 : 0;
  const cae = Math.max(0, f - t);
  const flash = interpolate(f, [t, t + 2, t + 8], [0, 1, 0], clamp);
  const cx = 560, cy = 960; // punto de corte
  return (
    <Camara d={d} empuje={0.14} foco={`${(cx / W) * 100}% ${(cy / H) * 100}%`} sacudida={cae > 0 && cae < 12 ? 14 : 0}>
      <Svg>
        <Cielo a="#02050A" b="#0C1828" id="fcor" />
        {/* nieve del borde (primer plano) y vacío a la derecha */}
        <path d="M0 1000 Q500 980 780 1010 L820 1060 Q700 1090 0 1120 Z" fill={C.nieveNocheS} />
        <path d="M0 1080 Q500 1060 800 1080 L760 1920 L0 1920 Z" fill={C.roca} />
        <path d="M0 990 Q500 966 790 1000 L822 1050" stroke={C.nieve} strokeWidth={6} fill="none" opacity={0.6} />
        {cae === 0 ? (
          <Cuerda d={`M-40 900 L${cx} ${cy} L800 1004 L840 ${H}`} w={40} />
        ) : (
          <>
            {/* lado de Simon: retrocede */}
            <g transform={`translate(${-Math.min(cae * 14, 160)} ${-Math.min(cae * 4, 40)})`}>
              <Cuerda d={`M-40 900 L${cx - 16} ${cy - 2}`} w={40} />
              <Deshilachado x={cx - 16} y={cy - 2} a={6} w={40} />
            </g>
            {/* lado de Joe: se va por el borde */}
            <g transform={`translate(${cae * 6} ${cae * cae * 3})`} opacity={interpolate(cae, [8, 20], [1, 0], clamp)}>
              <Cuerda d={`M${cx + 16} ${cy + 2} L800 1004 L840 ${H}`} w={40} />
              <Deshilachado x={cx + 16} y={cy + 2} a={186} w={40} />
            </g>
          </>
        )}
        {/* brazo de Simon con la navaja */}
        <g transform={`translate(${interpolate(entra, [0, 1], [-200, 0]) + sierra} ${interpolate(entra, [0, 1], [500, 0]) + (cae > 0 ? Math.min(cae * 10, 120) : 0)})`}>
          <path d={`M60 1920 L${cx - 120} ${cy + 140}`} stroke="#1F6E7E" strokeWidth={130} strokeLinecap="round" />
          <path d={`M60 1920 L${cx - 120} ${cy + 140}`} stroke="#144B57" strokeWidth={40} strokeLinecap="round" opacity={0.4} transform="translate(-30 10)" />
          <path d={`M${cx - 150} ${cy + 190} L${cx - 128} ${cy + 160}`} stroke="#F2C230" strokeWidth={130} strokeLinecap="butt" opacity={0} />
          <path d={`M${cx - 168} ${cy + 214} L${cx - 140} ${cy + 176}`} stroke="#144B57" strokeWidth={138} strokeLinecap="butt" />
          <circle cx={cx - 100} cy={cy + 110} r={72} fill="#1B2230" />
          <path d={`M${cx - 60} ${cy + 60} q40 -10 50 20 M${cx - 48} ${cy + 96} q44 -6 50 24`} stroke="#2E3848" strokeWidth={22} strokeLinecap="round" fill="none" />
          <g transform={`translate(${cx - 70} ${cy + 70}) rotate(-52)`}>
            <rect x={-20} y={-24} width={110} height={48} rx={18} fill="#2A3442" />
            <path d="M84 -18 L250 -6 L262 8 L84 20 Z" fill="#E8EDF2" />
            <path d="M84 -18 L250 -6 L262 8 Z" fill="#FFFFFF" />
          </g>
        </g>
        <rect width={W} height={H} fill={C.blanco} opacity={flash} />
      </Svg>
    </Camara>
  );
};

const No: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = d * 0.6;
  const s = spring({ frame: f - t, fps, config: { damping: 9, stiffness: 220 } });
  const balanceo = Math.sin(f / 12) * 6;
  return (
    <AbsoluteFill style={{ background: "#03070D" }}>
      <Svg>
        <g transform={`rotate(${balanceo} 540 0)`} opacity={interpolate(f, [t - 4, t + 6], [1, 0.25], clamp)}>
          <Cuerda d="M540 -20 L540 820" w={26} />
          <Deshilachado x={540} y={820} a={90} w={26} />
        </g>
      </Svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 420, color: C.cuerda, transform: `scale(${s})`, opacity: f > t ? 1 : 0, marginTop: -260 }}>NO.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Grieta: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const ta = d * 0.68;
  const p = interpolate(f, [0, ta], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const aterriza = f >= ta;
  const scroll = p * 2600;
  const prof = Math.round(p * 60);
  const pared = (lado: number, tono: string, seed: string) => {
    const pts: string[] = [];
    const paso = 150, desf = scroll % paso, fila = Math.floor(scroll / paso);
    for (let i = -2; i < 16; i++) {
      const r = random(`${seed}${i + fila}`);
      const x = lado < 0 ? 200 + r * 120 : 880 - r * 120;
      pts.push(`${x},${i * paso - desf}`);
    }
    const borde = lado < 0 ? 0 : W;
    return <polygon points={`${borde},-400 ${pts.join(" ")} ${borde},2400`} fill={tono} />;
  };
  // el puente de nieve aparece desde abajo al final de la caída
  const puenteY = interpolate(p, [0.75, 1], [2100, 1220], clamp);
  return (
    <Camara d={d} empuje={0.02} sacudida={aterriza && f < ta + 9 ? 14 : 0}>
      <Svg>
        <Cielo a="#0B2236" b="#01060B" id="fgri" />
        <g opacity={0.5}>{pared(-1, "#123650", "gl")}{pared(1, "#0F2E45", "gr")}</g>
        {pared(-1, C.hielo2, "al")}{pared(1, "#2F6A91", "ar")}
        <path d={`M150 ${puenteY} Q540 ${puenteY - 30} 930 ${puenteY} L900 ${puenteY + 70} Q540 ${puenteY + 40} 180 ${puenteY + 70} Z`} fill="#CFE6F3" />
        {aterriza ? (
          <>
            <Cuerda d="M610 1190 Q700 1150 760 1196 Q800 1220 840 1200" w={10} />
            <Escalador x={500} y={1190} quien="joe" pose="tumbadoRota" cara="dolor" s={1.05} />
          </>
        ) : (
          <>
            <Cuerda d={`M540 780 Q${540 + Math.sin(f / 3) * 60} 560 ${520 + Math.cos(f / 4) * 40} 360`} w={10} />
            <Deshilachado x={520 + Math.cos(f / 4) * 40} y={360} a={-90} w={10} />
            <Escalador x={540} y={880} quien="joe" pose="cayendo" cara="miedo" rot={Math.sin(f / 5) * 25} s={1.1} />
          </>
        )}
      </Svg>
      <Contador texto={`−${prof} m`} top={330} />
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

/** Arriba es imposible: baja más hondo y encuentra luz. */
const Salida: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const baja = interpolate(f, [d * 0.25, d * 0.62], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const luz = interpolate(f, [d * 0.5, d * 0.85], [0, 1], clamp);
  const gira = interpolate(f, [d * 0.68, d * 0.95], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const jy = 740 + baja * 400;
  return (
    <Camara d={d} empuje={0.06} foco="55% 55%">
      <Svg>
        <Cielo a="#06131F" b="#010508" id="fsal" />
        {/* rendija lejana arriba: inalcanzable */}
        <path d="M480 0 L600 0 L560 380 L520 380 Z" fill="#9CC4DD" opacity={0.25} />
        <path d="M0 0 L470 0 Q380 600 300 1920 L0 1920 Z" fill="#1E4A68" />
        <path d="M1080 0 L610 0 Q720 700 820 1920 L1080 1920 Z" fill="#163C56" />
        <path d="M330 612 L540 604 L524 636 Q430 664 330 690 Z" fill="#CFE6F3" />
        <path d="M540 604 L524 636 Q430 664 330 690 L330 700 Q440 676 520 648 Z" fill="#6FA3C4" />
        {/* luz de la salida */}
        <path d={`M1080 980 L700 1160 L700 1300 L1080 1420 Z`} fill={C.luz} opacity={luz * 0.35} />
        <ellipse cx={1060} cy={1200} rx={220} ry={260} fill="url(#halo)" opacity={luz} />
        <path d="M0 1290 Q540 1260 1080 1290 L1080 1920 L0 1920 Z" fill="#7FB0CF" />
        <path d="M0 1290 Q540 1260 1080 1290" stroke="#CFE6F3" strokeWidth={10} fill="none" />
        <Cuerda d={`M470 630 L470 ${jy - 120}`} w={10} />
        <Escalador x={470 + gira * 160} y={gira > 0 ? 1246 : jy} quien="joe" pose={gira > 0 ? "arrastre" : "colgadoRota"} cara={luz > 0.4 ? "esfuerzo" : "dolor"} s={1.05} />
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Arrastre: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, d * 0.95], [0, 1], clamp);
  const dia = Math.min(3, 1 + Math.floor(p * 3));
  const km = (p * 8).toFixed(1).replace(".", ",");
  const ciclo = (p * 3) % 1; // 0 día · 0.5 noche
  const noche = Math.sin(ciclo * Math.PI);
  const mezcla = (a: string, b: string, t: number) => {
    const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const [x, y] = [h(a), h(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
  };
  const avance = f * 6;
  const brazo = Math.sin(f / 6);
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Cielo a={mezcla("#9FB9D1", "#050B14", noche)} b={mezcla("#EADFCB", "#1A2C44", noche)} id="farr" />
        <g transform={`translate(${-avance * 0.15} 0)`}><Cordillera y={1000} color={mezcla("#A9B9C9", "#1B2D45", noche)} seed="a1" nieve={mezcla("#EEF2F6", "#3B5577", noche)} /></g>
        <path d={`M0 1240 L${W} 1240 L${W} ${H} L0 ${H} Z`} fill={mezcla("#B7AA95", "#2E3442", noche)} />
        {/* piedras de la morrena en dos planos */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = ((random(`pa${i}`) * 2400 - avance * 0.6) % 2400 + 2400) % 2400 - 300, y = 1250 + random(`pb${i}`) * 60, r = 14 + random(`pc${i}`) * 26;
          return <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r} fill={mezcla("#8F826D", "#232836", noche)} />;
        })}
        <Escalador x={500} y={1204} quien="joe" pose="arrastre" angulos={{ brazoA: [70 + brazo * 25, 120 + brazo * 15], brazoB: [30 - brazo * 25, 80 - brazo * 10] }} cara="dolor" s={1.45} sombra={1270} />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = ((random(`fa${i}`) * 2600 - avance * 1.6) % 2600 + 2600) % 2600 - 300, r = 40 + random(`fc${i}`) * 50;
          return <ellipse key={i} cx={x} cy={1390 + random(`fb${i}`) * 80} rx={r * 1.4} ry={r} fill={mezcla("#7A6E5C", "#1A1F2B", noche)} />;
        })}
        {/* estrellas de noche */}
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`e${i}`) * W} cy={random(`ey${i}`) * 900} r={2 + random(`er${i}`) * 2} fill="#fff" opacity={noche * 0.8} />)}
      </Svg>
      <Contador texto={`DÍA ${dia}`} sub={`${km} / 8 km`} top={300} />
    </Camara>
  );
};

const Campamento: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const llega = interpolate(f, [0, d * 0.85], [80, 400], clamp);
  const gira = f > d * 0.55;
  const brazo = Math.sin(f / 6);
  return (
    <Camara d={d} empuje={0.05} foco="50% 60%">
      <Svg>
        <Cielo a="#0D1424" b="#4A3550" id="fcam" />
        <Cordillera y={1060} color="#25243A" seed="k1" />
        <path d="M0 1240 L1080 1210 L1080 1920 L0 1920 Z" fill="#3E3A44" />
        <circle cx={690} cy={1120} r={220} fill="url(#halo)" opacity={0.35 + 0.08 * Math.sin(f / 5)} />
        <path d="M560 1236 L690 1040 L820 1236 Z" fill="#FF9A3C" />
        <path d="M690 1040 L670 1236 L710 1236 Z" fill="#B8541A" />
        {gira && <path d={`M890 ${880} L${llega + 60} 1140 L${llega + 60} 1260 Z`} fill={C.luz} opacity={0.18} />}
        <Escalador x={930} y={1056} quien="simon" pose="pie" mira={gira ? -1 : 1} cara={gira ? "miedo" : "normal"} mochila s={1.4} sombra={1236} />
        <Escalador x={llega} y={1206} quien="joe" pose="arrastre" angulos={{ brazoA: [70 + brazo * 25, 120], brazoB: [30 - brazo * 25, 80] }} cara="dolor" s={1.35} />
      </Svg>
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};

const Abrazo: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const une = interpolate(f, [d * 0.1, d * 0.55], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const nudo = interpolate(f, [d * 0.55, d * 0.7], [0, 1], clamp);
  const ax = interpolate(une, [0, 1], [120, 510]), bx = interpolate(une, [0, 1], [960, 570]);
  return (
    <Camara d={d} empuje={0.04} foco="50% 55%">
      <Svg>
        <Cielo a="#F6D9B0" b="#F3E7D3" id="fabr" />
        <Cordillera y={1060} color="#E2C6A0" seed="b1" nieve="#FFF4E2" />
        <path d="M0 1200 L1080 1200 L1080 1920 L0 1920 Z" fill="#D6BB8E" />
        <Escalador x={470} y={1100} quien="simon" pose="abrazo" cara="cerrados" s={1.15} sombra={1196} />
        <Escalador x={610} y={1100} quien="joe" pose="abrazo" mira={-1} cara="alivio" s={1.15} sombra={1196} />
        {/* los dos extremos cortados vuelven a juntarse */}
        <Cuerda d={`M-40 1290 L${ax} 1290`} w={14} />
        <Cuerda d={`M${W + 40} 1290 L${bx} 1290`} w={14} />
        {une < 1 && <><Deshilachado x={ax} y={1290} a={0} w={14} /><Deshilachado x={bx} y={1290} a={180} w={14} /></>}
        {nudo > 0 && <g transform={`translate(540 1290) scale(${nudo})`}><circle r={26} fill={C.cuerda} stroke={C.cuerdaS} strokeWidth={6} /><path d="M-18 -8 Q0 14 18 -8" stroke="#FFB27F" strokeWidth={5} fill="none" /></g>}
      </Svg>
      <Etiqueta texto={e.titulo} oscuro={false} />
    </Camara>
  );
};

const Pregunta: React.FC<P> = ({ e }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Camara d={60} empuje={0}><ImagenColgando /></Camara>
      <AbsoluteFill style={{ background: "rgba(3,7,13,.35)" }} />
      <Etiqueta texto={e.titulo} />
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40, transform: `scale(${s})` }}>
        {["SÍ", "NO"].map((x) => (
          <div key={x} style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 80, color: C.blanco, background: x === "SÍ" ? C.cuerda : "#1F6E7E", padding: "14px 70px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>{x}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ESCENAS: Record<string, React.FC<P>> = {
  colgando: Colgando, mapa: Mapa, pierna: Pierna, descenso: Descenso, noche: Noche, resbala: Resbala, reloj: Resbala,
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
        const Comp = ESCENAS[e.visual ?? ""] ?? Colgando;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
