// E15 "Tocando el vacío" v3. Todo dibujado en SVG.
// Idea visual: la cuerda naranja es el hilo conductor (tensa en el gancho, se corta, cae deshilachada, se anuda al final).
// Apertura en tensión (mano con navaja) y cierre en bucle con el mismo plano.
// Personajes: Joe (rojo, casco amarillo) y Simon (azul petróleo, casco blanco), de src/piezas/Escalador.
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, random, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { fuenteTexto, fuenteTitulo } from "../tema";
import type { Datos, Escena } from "../tipos";
import { Subtitulos } from "../Subtitulos";
import { Escalador, PERSONAJES } from "../piezas/Escalador";
import { Grano } from "../piezas/Grano";
import { Sonidos } from "../Sonidos";

const C = {
  noche1: "#08111D", noche2: "#1A2C44", lejos: "#22364F",
  lejosDia: "#B9CADB", lejosDia2: "#8FA7BF",
  nieve: "#EEF3F8", nieveSombra: "#B9C8D6", nieveNoche: "#9FB2C6", nieveNocheS: "#6F86A0",
  roca: "#1E2937", roca2: "#2C3A4D", hielo2: "#3C7FA8", hielo3: "#7FB7D6",
  cuerda: "#FF6A1F", cuerdaS: "#B8460E", blanco: "#FFFFFF", tinta: "#0B1624", luz: "#FFE7A8",
};
const W = 1080, H = 1920;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- piezas comunes ---------- */
const Cielo: React.FC<{ a: string; b: string; id: string }> = ({ a, b, id }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect x={-200} y={-400} width={W + 400} height={H + 800} fill={`url(#${id})`} />
  </>
);

/** Cordillera lejana (plano de fondo, poco contraste). */
const Cordillera: React.FC<{ y: number; color: string; seed: string; amp?: number; nieve?: string }> = ({ y, color, seed, amp = 260, nieve }) => {
  const n = 9, pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([-100 + (i * (W + 200)) / n, y - (i % 2 ? amp * (0.5 + random(`${seed}${i}`) * 0.6) : amp * 0.15 * random(`${seed}b${i}`))]);
  const d = `M-200 ${H + 400} L${pts.map((p) => p.join(" ")).join(" L")} L${W + 200} ${H + 400} Z`;
  return (
    <g>
      <path d={d} fill={color} />
      {nieve && pts.map((p, i) => i % 2 ? <path key={i} d={`M${p[0]} ${p[1]} l-46 60 l22 -6 l24 22 l20 -24 l22 6 Z`} fill={nieve} opacity={0.7} /> : null)}
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

const Defs: React.FC = () => (
  <defs>
    <filter id="desenfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
    <radialGradient id="halo"><stop offset="0" stopColor={C.luz} stopOpacity="0.9" /><stop offset="1" stopColor={C.luz} stopOpacity="0" /></radialGradient>
    <linearGradient id="hieloV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5E9DC4" /><stop offset="0.5" stopColor="#9CCBE4" /><stop offset="1" stopColor="#4D8AB3" /></linearGradient>
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

/** Extremo cortado y deshilachado de la cuerda en (x, y), apuntando con ángulo `a` (grados). */
const Deshilachado: React.FC<{ x: number; y: number; a?: number; w?: number }> = ({ x, y, a = 0, w = 11 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    {[-0.4, -0.15, 0.1, 0.35].map((k, i) => (
      <path key={i} d={`M0 ${k * w * 1.6} q${w * 0.9} ${k * w * 1.4 + (i % 2 ? 3 : -3)} ${w * 1.6} ${k * w * 2.6}`} stroke={i % 2 ? C.cuerda : "#FFB27F"} strokeWidth={Math.max(2, w * 0.28)} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

const Etiqueta: React.FC<{ texto?: string; oscuro?: boolean; grande?: boolean }> = ({ texto, oscuro = true, grande }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!texto) return null;
  const s = spring({ frame: f - 2, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top: grande ? 240 : 220, left: 70, right: 70, display: "flex", justifyContent: "center" }}>
      <div style={{
        fontFamily: fuenteTitulo, fontWeight: 800, fontSize: grande ? 110 : 66, lineHeight: 1.05, textAlign: "center",
        color: oscuro ? C.blanco : C.tinta, transform: `translateY(${(1 - s) * -30}px) scale(${0.9 + 0.1 * s})`, opacity: s,
        textShadow: oscuro ? "0 4px 24px rgba(0,0,0,.6)" : "0 2px 16px rgba(255,255,255,.6)",
      }}>{texto}</div>
    </div>
  );
};

/** Contador grande (dato animado). */
const Contador: React.FC<{ texto: string; sub?: string; top?: number; color?: string; op?: number }> = ({ texto, sub, top = 300, color = C.blanco, op = 1 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, color, opacity: op, textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>
    <div style={{ fontSize: 132, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{texto}</div>
    {sub && <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 46, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{sub}</div>}
  </div>
);

/** Cámara: zoom de entrada + empuje lento hacia un punto; sacudida opcional. */
const Camara: React.FC<{ d: number; children: React.ReactNode; empuje?: number; sacudida?: number; foco?: string; entrada?: boolean }> = ({ d, children, empuje = 0.05, sacudida = 0, foco = "50% 50%", entrada = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const e = entrada ? spring({ frame: f, fps, config: { damping: 20, stiffness: 160 } }) : 1;
  const sc = 1 + 0.06 * (1 - e) + empuje * (f / Math.max(1, d));
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

/* ---------- escenas ---------- */
/** e: escena · d: duración en fotogramas · pal(w): fotograma (relativo a la escena) en que se dice la palabra w */
type P = { e: Escena; d: number; pal: (w: string) => number | undefined };

/* --- Navaja: primer plano de la mano de Simon (gancho, corte y cierre en bucle) --- */
// Geometría compartida: la cuerda sube desde el arnés de Simon (abajo a la izquierda), pasa por el borde y cae al vacío.
const NV = { x0: -60, y0: 1420, bx: 850, by: 930, cx: 470 }; // cx = punto de corte sobre la cuerda
const pendiente = (NV.by - NV.y0) / (NV.bx - NV.x0);
const cy = NV.y0 + pendiente * (NV.cx - NV.x0);
const angCuerda = (Math.atan2(NV.by - NV.y0, NV.bx - NV.x0) * 180) / Math.PI;

const Mano: React.FC<{ x: number; y: number; ang: number }> = ({ x, y, ang }) => {
  const c = PERSONAJES.simon;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(1.3)`}>
      {/* antebrazo (manga) hacia atrás, fuera de plano */}
      <rect x={-1100} y={-62} width={1050} height={124} rx={50} fill={c.chaqueta} />
      <rect x={-1100} y={14} width={1050} height={40} rx={20} fill={c.chaquetaSombra} opacity={0.6} />
      <rect x={-96} y={-66} width={40} height={132} rx={14} fill={c.chaquetaSombra} />
      {/* mango */}
      <rect x={-30} y={-20} width={150} height={40} rx={16} fill="#2A3442" />
      <circle cx={104} cy={0} r={6} fill="#8C97A4" />
      {/* hoja */}
      <path d="M116 -16 L250 -8 Q268 0 250 10 L116 14 Z" fill="#DDE3EA" />
      <path d="M116 -16 L250 -8 Q262 -4 260 0 L116 0 Z" fill="#FFFFFF" />
      {/* guante: puño cerrado sobre el mango */}
      <rect x={-70} y={-58} width={120} height={116} rx={48} fill="#1B2230" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-44 + i * 24} y={14} width={26} height={52} rx={13} fill="#232C3B" stroke="#10151E" strokeWidth={3} />)}
      <path d="M-30 -52 Q20 -78 58 -34" stroke="#2E3848" strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d="M-50 -30 Q-10 -46 30 -40" stroke="#3A4558" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.6} />
    </g>
  );
};

const PlanoNavaja: React.FC<{ d: number; tCorte?: number; tension?: number }> = ({ d, tCorte, tension = 1 }) => {
  const f = useCurrentFrame();
  const cortado = tCorte !== undefined && f >= tCorte;
  const tras = tCorte !== undefined ? Math.max(0, f - tCorte) : 0;
  // temblor de la mano y vibración de la cuerda tensa
  const tiembla = (k: number) => (Math.sin(f * 1.9 + k) * 0.6 + Math.sin(f * 3.7 + k * 2) * 0.4) * tension;
  const sierra = tCorte !== undefined && !cortado ? Math.sin(f * 0.9) * 22 * interpolate(f, [0, tCorte * 0.5], [0, 1], clamp) : 0;
  const vib = cortado ? 0 : Math.sin(f * 2.6) * 2.5 * tension;
  const bladeAng = angCuerda - 90; // hoja cruzada sobre la cuerda (apunta hacia arriba-izquierda)
  const rad = (bladeAng * Math.PI) / 180;
  const contacto = 175 * 1.3; // distancia del puño al punto de contacto en la hoja
  const retroceso = cortado ? Math.min(tras * 14, 90) : 0;
  const mx = NV.cx - Math.cos(rad) * (contacto + sierra - retroceso) + tiembla(1) * 3;
  const my = cy - Math.sin(rad) * (contacto + sierra - retroceso) + tiembla(2) * 3;
  const flash = tCorte !== undefined ? interpolate(f, [tCorte, tCorte + 1, tCorte + 4], [0, 0.55, 0], clamp) : 0;
  const fibras = interpolate(f, [0, tCorte ?? d], [0.2, 1], clamp);
  return (
    <Svg>
      <Cielo a="#02050A" b="#0B1726" id="fnav" />
      {/* vacío a la derecha del borde, con nieve que cae */}
      <Copos seed="nav" n={60} vel={6} viento={2} op={0.5} />
      {/* ladera de nieve en primer plano */}
      <path d={`M-20 -20 L930 -20 Q890 500 ${NV.bx + 20} ${NV.by} Q820 1400 800 ${H + 20} L-20 ${H + 20} Z`} fill={C.nieveNocheS} />
      <path d={`M930 -20 Q890 500 ${NV.bx + 20} ${NV.by} Q820 1400 800 ${H + 20}`} stroke={C.nieve} strokeWidth={8} fill="none" opacity={0.55} />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`nt${i}`) * 820} cy={random(`nu${i}`) * H} r={3 + random(`nr${i}`) * 6} fill={C.nieve} opacity={0.25} />)}
      {/* pared bajo el borde */}
      <path d={`M${NV.bx + 20} ${NV.by} Q820 1400 800 ${H + 20} L${NV.bx + 60} ${H + 20} Q${NV.bx + 40} 1400 ${NV.bx + 30} ${NV.by + 40} Z`} fill={C.roca} opacity={0.8} />
      {!cortado ? (
        <g transform={`translate(0 ${vib})`}>
          <Cuerda d={`M${NV.x0} ${NV.y0} L${NV.bx} ${NV.by} Q${NV.bx + 30} ${NV.by + 10} ${NV.bx + 34} ${NV.by + 60} L${NV.bx + 40} ${H + 40}`} w={54} />
          {/* fibras que empiezan a abrirse donde apoya la hoja */}
          {Array.from({ length: 7 }).map((_, i) => {
            const a = angCuerda - 90 + (random(`fa${i}`) - 0.5) * 60, L = (10 + random(`fl${i}`) * 26) * fibras;
            const ox = NV.cx + (random(`fo${i}`) - 0.5) * 16;
            return <line key={i} x1={ox} y1={cy - 14} x2={ox + Math.cos((a * Math.PI) / 180) * L} y2={cy - 14 + Math.sin((a * Math.PI) / 180) * L} stroke="#FFB27F" strokeWidth={3} strokeLinecap="round" />;
          })}
        </g>
      ) : (
        <>
          {/* lado de Simon: se afloja y cae en la nieve */}
          <g>
            <Cuerda d={`M${NV.x0} ${NV.y0} Q${(NV.x0 + NV.cx) / 2} ${NV.y0 - 60 + Math.min(tras * 6, 140)} ${NV.cx - 40 - Math.min(tras * 4, 60)} ${cy + 10 + Math.min(tras * 5, 90)}`} w={54} />
            <Deshilachado x={NV.cx - 40 - Math.min(tras * 4, 60)} y={cy + 10 + Math.min(tras * 5, 90)} a={angCuerda} w={54} />
          </g>
          {/* lado de Joe: se va por el borde */}
          {tras < 14 && (
            <g transform={`translate(${tras * 30} ${tras * tras * 6})`} opacity={interpolate(tras, [6, 13], [1, 0], clamp)}>
              <Cuerda d={`M${NV.cx + 30} ${cy - 14} L${NV.bx} ${NV.by} Q${NV.bx + 30} ${NV.by + 10} ${NV.bx + 34} ${NV.by + 60} L${NV.bx + 40} ${H + 40}`} w={54} />
              <Deshilachado x={NV.cx + 30} y={cy - 14} a={angCuerda + 180} w={54} />
            </g>
          )}
        </>
      )}
      <Mano x={mx} y={my} ang={bladeAng + tiembla(3) * 1.2} />
      <rect x={-200} y={-400} width={W + 400} height={H + 800} fill={C.blanco} opacity={flash} />
    </Svg>
  );
};

const Navaja: React.FC<P> = ({ e, d }) => (
  <>
    <Camara d={d} empuje={0.08} foco={`${(NV.cx / W) * 100}% ${(cy / H) * 100}%`}><PlanoNavaja d={d} tension={e.tipo === "cierre" ? 0.8 : 1} /></Camara>
    <Etiqueta texto={e.titulo} grande />
  </>
);

const Corte: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tCorte = Math.min(d - 2, (pal("Cortó.") ?? 0) + 9); // al terminar de decir "Cortó"
  const tras = Math.max(0, f - tCorte);
  return (
    <Camara d={d} empuje={0} entrada={false} sacudida={tras > 0 && tras < 8 ? 12 : 0} foco={`${(NV.cx / W) * 100}% ${(cy / H) * 100}%`}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + interpolate(f, [0, tCorte], [0, 0.08], clamp)})`, transformOrigin: `${(NV.cx / W) * 100}% ${(cy / H) * 100}%` }}>
        <PlanoNavaja d={d} tCorte={tCorte} />
      </AbsoluteFill>
    </Camara>
  );
};

/* --- Cumbre: presentación de los dos, la cuerda que les une se rompe en "Cortó" --- */
const Cumbre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const ano = Math.round(interpolate(f, [0, d * 0.4], [2026, 1985], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const tCorto = pal("Cortó.") ?? d * 0.6;
  const roto = f >= tCorto + 4;
  const tras = Math.max(0, f - tCorto - 4);
  const nombre = (k: number) => spring({ frame: f - 6 - k * 6, fps, config: { damping: 12 } });
  const sx = 400, jx = 680, y = 1080;
  return (
    <Camara d={d} empuje={0.05} foco="50% 60%" sacudida={roto && tras < 6 ? 6 : 0}>
      <Svg>
        <Cielo a="#7FA1C2" b="#E9EFF5" id="fcum" />
        <Cordillera y={1180} color={C.lejosDia} seed="cu1" amp={260} nieve="#F2F6FA" />
        <Cordillera y={1300} color={C.lejosDia2} seed="cu2" amp={180} />
        {/* arista de cumbre */}
        <path d="M-40 1400 L300 1200 L540 1170 L780 1200 L1120 1420 L1120 1940 L-40 1940 Z" fill={C.nieve} />
        <path d="M-40 1400 L300 1200 L540 1170 L780 1200 L1120 1420" stroke={C.nieveSombra} strokeWidth={10} fill="none" />
        <path d="M540 1170 L600 1940 L1120 1940 L1120 1420 L780 1200 Z" fill={C.nieveSombra} opacity={0.45} />
        <Escalador x={sx} y={y} quien="simon" pose="pie" cara="normal" s={1.25} sombra={1196} />
        <Escalador x={jx} y={y} quien="joe" pose="pie" poseB="celebrando" t={interpolate(f, [4, 16], [0, 1], clamp)} mira={-1} cara="alivio" s={1.25} sombra={1196} />
        {!roto ? (
          <Cuerda d={`M${sx + 20} ${y - 30} Q540 ${y + 110} ${jx - 20} ${y - 30}`} w={10} />
        ) : (
          <>
            <Cuerda d={`M${sx + 20} ${y - 30} Q${470} ${y + 90 + Math.min(tras * 4, 50)} ${520} ${y + 70 + Math.min(tras * 6, 70)}`} w={10} />
            <Deshilachado x={520} y={y + 70 + Math.min(tras * 6, 70)} a={30} w={10} />
            <Cuerda d={`M${jx - 20} ${y - 30} Q${610} ${y + 90 + Math.min(tras * 4, 50)} ${560} ${y + 70 + Math.min(tras * 6, 70)}`} w={10} />
            <Deshilachado x={560} y={y + 70 + Math.min(tras * 6, 70)} a={150} w={10} />
          </>
        )}
      </Svg>
      {/* nombres */}
      {[["SIMON", sx, PERSONAJES.simon.chaqueta], ["JOE", jx, PERSONAJES.joe.chaqueta]].map(([n, x, col], k) => (
        <div key={n as string} style={{ position: "absolute", left: (x as number) - 110, width: 220, top: 760, display: "flex", justifyContent: "center", transform: `scale(${nombre(k)})` }}>
          <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 46, color: "#fff", background: col as string, padding: "6px 26px", borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>{n as string}</div>
        </div>
      ))}
      <Contador texto={String(ano)} sub="PERÚ · SIULA GRANDE" top={290} color={C.tinta} />
    </Camara>
  );
};

/* --- Caída: cortado de hielo más alto que él, aterriza con la pierna recta, no puede levantarse --- */
const Caida: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const s = 1.15, alto = 820, borde = 610, suelo = borde + alto; // coordenadas del mundo
  const tCae = d * 0.12, tImp = d * 0.36;
  const caida = interpolate(f, [tCae, tImp], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const imp = f >= tImp;
  const tras = Math.max(0, f - tImp);
  const caderaPie = 130 * s; // altura de la cadera sobre los pies
  // cámara que sigue la caída
  const oy = interpolate(f, [tCae, tImp + 4], [0, 420], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const jx = 455 + caida * 60;
  let jy = borde - caderaPie + caida * alto;
  // poses tras el impacto: pierna recta → rodilla cede → sentado agarrándose → intenta levantarse → cae
  let pose: any = "pie", poseB: any = "aterriza", t = Math.min(1, caida * 2), cara: any = caida > 0 ? "miedo" : "esfuerzo";
  let ang: any = undefined, rot = 0;
  if (imp) {
    cara = "dolor";
    const u = tras / (d - tImp);
    if (u < 0.12) { pose = "aterriza"; poseB = undefined; ang = { piernaA: [-6, interpolate(u, [0, 0.12], [0, 48])] as [number, number] }; jy = suelo - caderaPie + interpolate(u, [0, 0.12], [0, 30]); }
    else if (u < 0.35) { pose = "aterriza"; poseB = "sentadoSuelo"; t = interpolate(u, [0.12, 0.35], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }); jy = interpolate(t, [0, 1], [suelo - caderaPie + 30, suelo - 26]); }
    else if (u < 0.65) { pose = "sentadoSuelo"; poseB = "agachado"; t = interpolate(u, [0.35, 0.55, 0.65], [0, 0.7, 0.4], clamp); jy = suelo - 26 - t * 60; cara = "esfuerzo"; }
    else { pose = "sentadoSuelo"; poseB = "agachado"; t = interpolate(u, [0.65, 0.75], [0.4, 0], clamp); jy = suelo - 26 - t * 60; cara = "dolor"; rot = -4; }
  }
  const puff = tras;
  return (
    <Camara d={d} empuje={0.04} foco="45% 60%" sacudida={tras > 0 && tras < 9 ? 14 : 0}>
      <Svg>
        <Cielo a="#9DB6CE" b="#EEF2F6" id="fcai" />
        <g transform={`translate(0 ${-oy * 0.25})`}><Cordillera y={1000} color={C.lejosDia} seed="ca1" amp={260} nieve="#EEF3F8" /></g>
        <g transform={`translate(0 ${-oy})`}>
          {/* parte alta y pared de hielo */}
          <path d={`M-40 ${borde} L${borde - 20} ${borde} L${borde} ${borde + 30} L${borde + 14} ${suelo} L-40 ${suelo} Z`} fill="url(#hieloV)" />
          <path d={`M-40 ${borde - 18} L${borde - 10} ${borde - 18} L${borde + 4} ${borde + 18} L${borde - 30} ${borde + 12} L-40 ${borde + 20} Z`} fill={C.nieve} />
          {[0.2, 0.45, 0.7].map((k, i) => <path key={i} d={`M${borde - 60 - i * 70} ${borde + alto * k} l40 60 l-20 80 l30 70`} stroke="#D8EEF8" strokeWidth={5} fill="none" opacity={0.7} />)}
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${borde - 30 - i * 60} ${borde + 20} l12 ${50 + random(`ic${i}`) * 60} l12 ${-(50 + random(`ic${i}`) * 60)}`} fill="#D8EEF8" opacity={0.8} />)}
          {/* ladera de abajo */}
          <path d={`M-40 ${suelo} L${W + 40} ${suelo + 120} L${W + 40} ${suelo + 1400} L-40 ${suelo + 1400} Z`} fill={C.nieve} />
          <path d={`M-40 ${suelo} L${W + 40} ${suelo + 120}`} stroke={C.nieveSombra} strokeWidth={8} />
          <ellipse cx={jx + 10} cy={suelo + 8} rx={imp ? 110 : 30 + caida * 80} ry={14} fill="#000" opacity={0.12 + caida * 0.06} />
          <Escalador x={jx} y={jy} quien="joe" pose={pose} poseB={poseB} t={t} angulos={ang} cara={cara} s={s} rot={rot} />
          {puff > 0 && Array.from({ length: 28 }).map((_, i) => {
            const a = random(`pa${i}`) * Math.PI, v = 5 + random(`pv${i}`) * 13;
            return <circle key={i} cx={jx + Math.cos(a) * v * puff * 1.6} cy={suelo - Math.sin(a) * v * puff + puff * puff * 0.3} r={6 + random(`pr${i}`) * 13} fill={C.blanco} opacity={interpolate(puff, [0, 22], [1, 0], clamp)} />;
          })}
        </g>
        <rect x={-200} y={-400} width={W + 400} height={H + 800} fill={C.blanco} opacity={interpolate(f, [tImp, tImp + 1, tImp + 6], [0, 0.5, 0], clamp)} />
      </Svg>
    </Camara>
  );
};

/* --- Hoyo: Simon le baja sentado en un hoyo en la nieve; no hay anclaje (corte transversal de la ladera) --- */
const Hoyo: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const ang = 33, k = Math.tan((ang * Math.PI) / 180);
  const ladera = (x: number) => 620 + x * k; // y de la superficie
  const sx = 330, sy = ladera(sx) + 34; // Simon hundido en el hoyo
  const baja = interpolate(f, [0, d], [0, 1], clamp);
  const jxx = 660 + baja * 200;
  const jx = jxx, jy = ladera(jxx) - 18;
  const grietas = interpolate(f, [d * 0.7, d], [0, 1], clamp);
  return (
    <Camara d={d} empuje={0.12} foco={`${(sx / W) * 100}% ${(sy / H) * 100}%`}>
      <Svg>
        <Cielo a="#3F5168" b="#9AABBE" id="fhoy" />
        <Cordillera y={900} color="#6F829A" seed="h1" amp={200} nieve="#C9D5E1" />
        {/* ladera en corte: capas de nieve suelta, sin roca ni hielo donde anclarse */}
        <path d={`M-40 ${ladera(-40)} L${W + 40} ${ladera(W + 40)} L${W + 40} ${H + 40} L-40 ${H + 40} Z`} fill={C.nieve} />
        {[60, 130, 210, 300].map((o, i) => <path key={i} d={`M-40 ${ladera(-40) + o} L${W + 40} ${ladera(W + 40) + o}`} stroke={C.nieveSombra} strokeWidth={4} strokeDasharray="30 22" opacity={0.6 - i * 0.1} />)}
        {Array.from({ length: 60 }).map((_, i) => { const x = random(`hx${i}`) * W; return <circle key={i} cx={x} cy={ladera(x) + 40 + random(`hy${i}`) * 500} r={3 + random(`hr${i}`) * 5} fill={C.nieveSombra} opacity={0.5} />; })}
        {/* el hoyo: cuenco excavado */}
        <path d={`M${sx - 140} ${ladera(sx - 140)} Q${sx - 120} ${sy + 70} ${sx + 10} ${sy + 64} Q${sx + 120} ${sy + 60} ${sx + 150} ${ladera(sx + 150)} Z`} fill={C.nieveSombra} />
        <path d={`M${sx - 140} ${ladera(sx - 140)} Q${sx - 120} ${sy + 70} ${sx + 10} ${sy + 64} Q${sx + 120} ${sy + 60} ${sx + 150} ${ladera(sx + 150)}`} stroke="#93A6BA" strokeWidth={6} fill="none" />
        {/* surco de Joe */}
        <line x1={sx + 170} y1={ladera(sx + 170) + 6} x2={jx - 40} y2={ladera(jx - 40) + 6} stroke={C.nieveSombra} strokeWidth={26} strokeLinecap="round" />
        <Escalador x={sx} y={sy} quien="simon" pose="sentado" angulos={{ brazoA: [80, 70], brazoB: [60, 100] }} cara="esfuerzo" rot={ang * 0.5} s={1.3} />
        <Cuerda d={`M${sx + 30} ${sy - 30} L${jx - 70} ${jy - 10}`} />
        <Escalador x={jx} y={jy} quien="joe" pose="tumbadoRota" cara="dolor" rot={ang} s={1.0} />
        {/* grietas en el borde delantero del hoyo (preludio) */}
        <path d={`M${sx + 150} ${ladera(sx + 150)} l-26 30 l18 24 l-22 30 M${sx + 110} ${ladera(sx + 110) + 4} l10 26 l-16 24`} stroke={C.tinta} strokeWidth={5} fill="none" opacity={grietas * 0.8} />
        <Copos seed="hoy" n={90} vel={7} viento={3} op={0.6} />
      </Svg>
    </Camara>
  );
};

/* --- Cortado: de noche, la ladera termina en un cortado que no ven; Joe pasa por el borde --- */
const Cortado: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const ang = 30, k = Math.tan((ang * Math.PI) / 180);
  const ladera = (x: number) => 560 + x * k;
  const bx = 720, by = ladera(bx); // borde
  const tBorde = d * 0.62;
  const p = interpolate(f, [0, tBorde], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const jxx = 300 + p * (bx - 300);
  const pasa = interpolate(f, [tBorde, tBorde + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const vaiven = f > tBorde ? Math.sin((f - tBorde) / 7) * 18 * Math.exp(-(f - tBorde) / 40) : 0;
  const jx = f < tBorde ? jxx : bx + 70 + vaiven;
  const jy = f < tBorde ? ladera(jxx) - 18 : by + 40 + pasa * 300;
  const sx = 120, sy = ladera(sx) + 20;
  return (
    <Camara d={d} empuje={0.1} foco="62% 50%">
      <Svg>
        <Cielo a="#03070D" b="#10213A" id="fcor" />
        <Cordillera y={900} color="#14243A" seed="co1" />
        {/* ladera y cortado con desplome */}
        <path d={`M-40 ${ladera(-40)} L${bx} ${by} L${bx + 12} ${by + 24} Q${bx - 30} ${by + 80} ${bx - 70} ${by + 160} L${bx - 120} ${H + 40} L-40 ${H + 40} Z`} fill={C.nieveNocheS} />
        <path d={`M${bx - 70} ${by + 160} Q${bx - 30} ${by + 80} ${bx + 12} ${by + 24} L${bx} ${by} L${bx - 30} ${by + 60} Q${bx - 90} ${by + 200} ${bx - 120} ${H + 40} L${bx - 260} ${H + 40} Z`} fill={C.roca} />
        {/* luz de luna en el filo: el espectador lo ve, ellos no */}
        <path d={`M${bx - 200} ${ladera(bx - 200)} L${bx} ${by} L${bx + 12} ${by + 24}`} stroke="#C9DAEA" strokeWidth={6} fill="none" opacity={0.8} />
        {/* frontal de Simon: no llega al borde */}
        <path d={`M${sx + 40} ${sy - 150} L${sx + 380} ${sy + 40} L${sx + 300} ${sy + 160} Z`} fill={C.luz} opacity={0.18} />
        <Escalador x={sx} y={sy} quien="simon" pose="sentado" cara="esfuerzo" rot={ang * 0.5} s={0.9} />
        <Cuerda d={f < tBorde ? `M${sx + 24} ${sy - 26} L${jx - 60} ${jy - 8}` : `M${sx + 24} ${sy - 26} L${bx} ${by} L${jx + 4} ${jy - 50}`} />
        {f < tBorde
          ? <Escalador x={jx} y={jy} quien="joe" pose="tumbadoRota" cara="dolor" rot={ang} s={1.05} />
          : <Escalador x={jx} y={jy} quien="joe" pose="tumbadoRota" poseB="colgadoRota" t={pasa} cara="miedo" rot={ang * (1 - pasa) - vaiven * 0.2} s={1.05} />}
        <rect x={-200} y={-400} width={W + 400} height={H + 800} fill="#03070D" opacity={0.2} />
        <Copos seed="cor" n={130} vel={9} viento={3} op={0.55} />
      </Svg>
    </Camara>
  );
};

/* --- Colgando: plano del gancho abierto; hora y media; el hoyo cede --- */
const ImagenColgando: React.FC<{ ceder?: number }> = ({ ceder = 0 }) => {
  const f = useCurrentFrame();
  const vaiven = Math.sin(f / 18);
  const jx = 790 + vaiven * 16, jy = 1030;
  const sx = 390 + ceder * 70, sy = 560 + ceder * 8;
  return (
    <Svg>
      <Cielo a={C.noche1} b={C.noche2} id="fcol" />
      <Cordillera y={1000} color={C.lejos} seed="c1" nieve="#3B5577" />
      <Copos seed="col" vel={4} viento={1.5} op={0.7} />
      <Zoom s={1.4} cx={600} cy={760} dy={60}>
        <path d="M0 600 Q320 560 640 590 L700 612 Q660 650 600 668 Q560 900 540 1920 L0 1920 Z" fill={C.roca} />
        <path d="M600 668 Q560 900 540 1920 L500 1920 Q520 900 570 680 Z" fill={C.roca2} />
        <path d="M0 586 Q320 540 650 576 L706 606 L696 620 Q600 600 320 608 Q160 612 0 622 Z" fill={C.nieveNoche} />
        <path d="M0 586 Q320 540 650 576 L706 606" stroke={C.nieve} strokeWidth={6} fill="none" opacity={0.7} />
        <ellipse cx={sx - 10} cy={sy + 26} rx={110} ry={26} fill={C.nieveNocheS} />
        {/* el hoyo se agrieta y la nieve cae por el borde */}
        <path d={`M${sx + 100} ${sy + 18} l18 22 l-12 18 l20 16 M${sx + 40} ${sy + 30} l-10 20 l14 16 M${sx + 150} ${sy + 22} l-8 26`} stroke={C.tinta} strokeWidth={4} fill="none" opacity={interpolate(ceder, [0.1, 0.5], [0, 0.9], clamp)} />
        {Array.from({ length: 16 }).map((_, i) => {
          const fase = ((f * (2 + random(`cn${i}`) * 3) + random(`cm${i}`) * 50) % 50) / 50;
          return <circle key={i} cx={sx + 120 + fase * (700 - sx - 100)} cy={sy + 20 - Math.sin(fase * Math.PI) * 26 + Math.max(0, fase - 0.8) * 900} r={3 + random(`cr${i}`) * 5} fill={C.nieve} opacity={ceder} />;
        })}
        <Escalador x={sx} y={sy} quien="simon" pose="tirando" cara={ceder > 0.5 ? "miedo" : "esfuerzo"} s={0.95} />
        <Cuerda d={`M${sx + 22} ${sy - 18} Q${(sx + 700) / 2} ${sy + 20} 696 606 L${jx + 6} ${jy - 46}`} />
        <Escalador x={jx} y={jy} quien="joe" pose="colgadoRota" cara="miedo" s={1.05} rot={-vaiven * 4} />
      </Zoom>
      <Copos seed="colG" n={10} vel={10} viento={2} op={0.5} grandes />
    </Svg>
  );
};

const Colgando: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tHora = pal("Hora") ?? d * 0.25, tHoyo = pal("hoyo") ?? d * 0.65;
  const minutos = interpolate(f, [tHora, tHoyo], [0, 90], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ceder = interpolate(f, [tHoyo - 6, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <>
      <Camara d={d} empuje={0.08} foco="45% 30%" sacudida={ceder * 4}><ImagenColgando ceder={ceder} /></Camara>
      <Contador texto={`${Math.floor(minutos / 60)}:${String(Math.floor(minutos % 60)).padStart(2, "0")} h`} top={250} op={interpolate(f, [tHora - 3, tHora + 3], [0, 1], clamp)} />
    </>
  );
};

/* --- Grieta: cae, aterriza en un puente de nieve; tenía que estar muerto --- */
const Grieta: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const ta = d * 0.38;
  const p = interpolate(f, [0, ta], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const aterriza = f >= ta;
  const scroll = p * 2600;
  const prof = Math.round(p * 60);
  const pared = (lado: number, tono: string, seed: string) => {
    const pts: string[] = [];
    const paso = 150, desf = scroll % paso, fila = Math.floor(scroll / paso);
    for (let i = -2; i < 16; i++) {
      const r = random(`${seed}${i + fila}`);
      pts.push(`${lado < 0 ? 200 + r * 120 : 880 - r * 120},${i * paso - desf}`);
    }
    const b = lado < 0 ? -40 : W + 40;
    return <polygon points={`${b},-400 ${pts.join(" ")} ${b},2400`} fill={tono} />;
  };
  const puenteY = interpolate(p, [0.75, 1], [2100, 1180], clamp);
  const oscuro = interpolate(f, [ta + 6, d * 0.8], [0, 0.45], clamp);
  return (
    <Camara d={d} empuje={0.03} foco="50% 60%" sacudida={aterriza && f < ta + 9 ? 16 : 0}>
      <Svg>
        <Cielo a="#0B2236" b="#01060B" id="fgri" />
        <g opacity={0.5}>{pared(-1, "#123650", "gl")}{pared(1, "#0F2E45", "gr")}</g>
        {pared(-1, C.hielo2, "al")}{pared(1, "#2F6A91", "ar")}
        <path d={`M150 ${puenteY} Q540 ${puenteY - 30} 930 ${puenteY} L900 ${puenteY + 70} Q540 ${puenteY + 40} 180 ${puenteY + 70} Z`} fill="#CFE6F3" />
        {aterriza ? (
          <>
            <Cuerda d="M640 1150 Q720 1110 780 1156 Q820 1180 860 1160" w={10} />
            <Deshilachado x={860} y={1160} a={-20} w={10} />
            <Escalador x={520} y={1150} quien="joe" pose="tumbadoRota" cara={f > d * 0.85 ? "dolor" : "cerrados"} s={1.2} />
          </>
        ) : (
          <>
            <Cuerda d={`M540 760 Q${540 + Math.sin(f / 3) * 60} 560 ${520 + Math.cos(f / 4) * 40} 380`} w={10} />
            <Deshilachado x={520 + Math.cos(f / 4) * 40} y={380} a={-90} w={10} />
            <Escalador x={540} y={880} quien="joe" pose="cayendo" cara="miedo" rot={Math.sin(f / 5) * 25} s={1.2} />
          </>
        )}
        <rect x={-200} y={-400} width={W + 400} height={H + 800} fill="#01060B" opacity={oscuro} />
      </Svg>
      <Contador texto={`−${prof} m`} top={300} op={interpolate(f, [ta + 10, ta + 25], [1, 0.35], clamp)} />
    </Camara>
  );
};

/* --- Arrastre: tres días, ocho kilómetros --- */
const Arrastre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, d * 0.95], [0, 1], clamp);
  const dia = Math.min(3, 1 + Math.floor(p * 3));
  const km = (p * 8).toFixed(1).replace(".", ",");
  const noche = Math.sin(((p * 3) % 1) * Math.PI);
  const mezcla = (a: string, b: string, t: number) => {
    const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const [x, y] = [h(a), h(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
  };
  const avance = f * 6, brazo = Math.sin(f / 6);
  return (
    <Camara d={d} empuje={0.03}>
      <Svg>
        <Cielo a={mezcla("#9FB9D1", "#050B14", noche)} b={mezcla("#EADFCB", "#1A2C44", noche)} id="farr" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`e${i}`) * W} cy={random(`ey${i}`) * 900} r={2 + random(`er${i}`) * 2} fill="#fff" opacity={noche * 0.8} />)}
        <g transform={`translate(${-avance * 0.15} 0)`}><Cordillera y={1000} color={mezcla("#A9B9C9", "#1B2D45", noche)} seed="a1" nieve={mezcla("#EEF2F6", "#3B5577", noche)} /></g>
        <path d={`M-40 1240 L${W + 40} 1240 L${W + 40} ${H + 40} L-40 ${H + 40} Z`} fill={mezcla("#B7AA95", "#2E3442", noche)} />
        {Array.from({ length: 30 }).map((_, i) => {
          const x = ((random(`pa${i}`) * 2400 - avance * 0.6) % 2400 + 2400) % 2400 - 300, y = 1250 + random(`pb${i}`) * 60, r = 14 + random(`pc${i}`) * 26;
          return <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r} fill={mezcla("#8F826D", "#232836", noche)} />;
        })}
        <Escalador x={500} y={1204} quien="joe" pose="arrastre" angulos={{ brazoA: [70 + brazo * 25, 120 + brazo * 15], brazoB: [30 - brazo * 25, 80 - brazo * 10] }} cara="dolor" s={1.45} sombra={1270} />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = ((random(`fa${i}`) * 2600 - avance * 1.6) % 2600 + 2600) % 2600 - 300, r = 40 + random(`fc${i}`) * 50;
          return <ellipse key={i} cx={x} cy={1390 + random(`fb${i}`) * 80} rx={r * 1.4} ry={r} fill={mezcla("#7A6E5C", "#1A1F2B", noche)} />;
        })}
      </Svg>
      <Contador texto={`DÍA ${dia}`} sub={`${km} / 8 km`} top={300} />
    </Camara>
  );
};

/* --- Campamento: llega horas antes de que Simon se vaya --- */
const Campamento: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const llega = interpolate(f, [0, d * 0.85], [80, 400], clamp);
  const gira = f > d * 0.55;
  const brazo = Math.sin(f / 6);
  return (
    <Camara d={d} empuje={0.05} foco="50% 60%">
      <Svg>
        <Cielo a="#0D1424" b="#4A3550" id="fcam" />
        <Cordillera y={1060} color="#25243A" seed="k1" />
        <path d="M-40 1240 L1120 1210 L1120 1960 L-40 1960 Z" fill="#3E3A44" />
        <circle cx={690} cy={1120} r={220} fill="url(#halo)" opacity={0.35 + 0.08 * Math.sin(f / 5)} />
        <path d="M560 1236 L690 1040 L820 1236 Z" fill="#FF9A3C" />
        <path d="M690 1040 L670 1236 L710 1236 Z" fill="#B8541A" />
        {gira && <path d={`M890 880 L${llega + 60} 1140 L${llega + 60} 1260 Z`} fill={C.luz} opacity={0.18} />}
        <Escalador x={930} y={1056} quien="simon" pose="pie" mira={gira ? -1 : 1} cara={gira ? "miedo" : "normal"} mochila s={1.4} sombra={1236} />
        <Escalador x={llega} y={1206} quien="joe" pose="arrastre" angulos={{ brazoA: [70 + brazo * 25, 120], brazoB: [30 - brazo * 25, 80] }} cara="dolor" s={1.35} />
      </Svg>
    </Camara>
  );
};

/* --- Abrazo: el corte les salvó a los dos; los extremos de la cuerda vuelven a anudarse --- */
const Abrazo: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const une = interpolate(f, [d * 0.1, d * 0.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const nudo = interpolate(f, [d * 0.5, d * 0.62], [0, 1], clamp);
  const ax = interpolate(une, [0, 1], [120, 510]), bx = interpolate(une, [0, 1], [960, 570]);
  return (
    <Camara d={d} empuje={0.05} foco="50% 55%">
      <Svg>
        <Cielo a="#F6D9B0" b="#F3E7D3" id="fabr" />
        <Cordillera y={1060} color="#E2C6A0" seed="b1" nieve="#FFF4E2" />
        <path d="M-40 1200 L1120 1200 L1120 1960 L-40 1960 Z" fill="#D6BB8E" />
        <Escalador x={470} y={1050} quien="simon" pose="abrazo" cara="cerrados" s={1.4} sombra={1196} />
        <Escalador x={620} y={1050} quien="joe" pose="abrazo" mira={-1} cara="alivio" s={1.4} sombra={1196} />
        <Cuerda d={`M-40 1290 L${ax} 1290`} w={14} />
        <Cuerda d={`M${W + 40} 1290 L${bx} 1290`} w={14} />
        {une < 1 && <><Deshilachado x={ax} y={1290} a={0} w={14} /><Deshilachado x={bx} y={1290} a={180} w={14} /></>}
        {nudo > 0 && <g transform={`translate(540 1290) scale(${nudo})`}><circle r={26} fill={C.cuerda} stroke={C.cuerdaS} strokeWidth={6} /><path d="M-18 -8 Q0 14 18 -8" stroke="#FFB27F" strokeWidth={5} fill="none" /></g>}
      </Svg>
    </Camara>
  );
};

const ESCENAS: Record<string, React.FC<P>> = {
  navaja: Navaja, cumbre: Cumbre, caida: Caida, hoyo: Hoyo, cortado: Cortado, colgando: Colgando,
  corte: Corte, grieta: Grieta, arrastre: Arrastre, campamento: Campamento, abrazo: Abrazo,
};

export const Vacio: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
  return (
    <AbsoluteFill style={{ background: C.noche1 }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0;
        const ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => {
          const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w));
          return p ? Math.round((p.start - iniS) * fps) : undefined;
        };
        const Comp = ESCENAS[e.visual ?? ""] ?? Navaja;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
