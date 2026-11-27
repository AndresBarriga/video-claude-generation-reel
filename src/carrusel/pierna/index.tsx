// Carrusel «¿Bien o mal? #1 · La cuerda y tu pierna» (1080×1350, 10 diapositivas). Una por n.
// Fuentes de la regla y las situaciones: ver videos/escalada/C1-pierna/ficha.md.
import React from "react";
import { Persona, POSE } from "../../piezas/kit";
import { LOLA } from "../../historias/Miedo/comun";
import { fuenteTexto } from "../../tema";
import { COL, Cuerda, en, F, Forma, Linea, Marco, Svg, type Pt } from "../comun";
import { ENTRE, Escena, PASOALTO, type Config } from "./Escena";
import { Desplome, Placa } from "./Calcos";

const rad = (a: number) => (a * Math.PI) / 180;
const ext = (x: number, y: number, a: number, L: number): Pt => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];
const rota = ([x, y]: Pt, r: number): Pt => [x * Math.cos(rad(r)) - y * Math.sin(rad(r)), x * Math.sin(rad(r)) + y * Math.cos(rad(r))];
const T = COL.tinta;

const Tarjeta: React.FC<{ x: number; y: number; w: number; h: number; id: string; borde?: number; children: React.ReactNode }> = ({ x, y, w, h, id, borde = 9, children }) => (
  <g>
    <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={Math.min(44, h / 6)} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
    <rect x={x} y={y} width={w} height={h} rx={Math.min(44, h / 6)} fill="none" stroke={T} strokeWidth={borde} />
  </g>
);
/** Escena dentro de una tarjeta: `foco` (punto de la escena) queda en el centro, a escala `s`. */
const Ver: React.FC<{ c: Config; x: number; y: number; w: number; h: number; s: number; foco: Pt; id: string; borde?: number; children?: React.ReactNode }> = ({ c, x, y, w, h, s, foco, id, borde, children }) => (
  <Tarjeta x={x} y={y} w={w} h={h} id={id} borde={borde}>
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-foco[0]} ${-foco[1]})`}>
      <Escena c={c} />
      {children}
    </g>
  </Tarjeta>
);
/** Igual que Ver, pero para cualquier dibujo (los calcos). */
const VerD: React.FC<{ d: React.ReactNode; x: number; y: number; w: number; h: number; s: number; foco: Pt; id: string; borde?: number; children?: React.ReactNode }> = ({ d, x, y, w, h, s, foco, id, borde, children }) => (
  <Tarjeta x={x} y={y} w={w} h={h} id={id} borde={borde}>
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-foco[0]} ${-foco[1]})`}>{d}{children}</g>
  </Tarjeta>
);
const Etiqueta: React.FC<{ t: string; top: number; right?: number; left?: number; fs?: number }> = ({ t, top, right, left, fs = 34 }) => (
  <div style={{ position: "absolute", top, right, left, fontFamily: F, fontWeight: 800, fontSize: fs, color: T, background: COL.crema, border: `6px solid ${T}`, borderRadius: 22, padding: "2px 18px 6px", whiteSpace: "nowrap" }}>{t}</div>
);
const Badge: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 120 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: ok ? COL.verde : COL.rojo, border: `${size / 15}px solid ${T}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: size * 0.72, color: "#fff", lineHeight: 1, paddingBottom: size / 16, boxSizing: "border-box" }}>{ok ? "✓" : "✕"}</div>
);
const Circ: React.FC<{ p: Pt; r: number; ok: boolean }> = ({ p, r, ok }) => <circle cx={p[0]} cy={p[1]} r={r} fill="none" stroke={ok ? COL.verde : COL.rojo} strokeWidth={14} strokeDasharray="30 18" />;

// ——— Preguntas (1, 3, 5, 7): el detalle a la vista, sin marcar ———
const Pregunta: React.FC<{ n: number; c?: Config; d?: React.ReactNode; titulo: string; tag: string; foco?: Pt; s?: number; fs?: number }> = ({ n, c, d, titulo, tag, foco = [590, 830], s = 0.72, fs = 112 }) => (
  <Marco n={n}>
    <Svg>{d ? <VerD d={d} x={50} y={372} w={980} h={880} s={s} foco={foco} id={`p${n}`} /> : <Ver c={c!} x={50} y={372} w={980} h={880} s={s} foco={foco} id={`p${n}`} />}</Svg>
    <div style={{ position: "absolute", top: 104, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: fs, lineHeight: 1, color: T, letterSpacing: -2, whiteSpace: "nowrap" }}>{titulo}</div>
    <div style={{ position: "absolute", top: 248, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 74, color: "#fff", background: T, borderRadius: 40, padding: "4px 36px 12px" }}>¿BIEN O MAL?</span>
    </div>
    <Etiqueta t={tag} top={1180} right={84} />
  </Marco>
);

// ——— Respuestas (4, 6, 8) ———
const Respuesta: React.FC<{ n: number; ok: boolean; titulo: string; sub: string; c: Config; foco?: Pt; s?: number; children?: React.ReactNode }> = ({ n, ok, titulo, sub, c, foco = [590, 760], s = 0.6, children }) => (
  <Marco n={n}>
    <Svg><Ver c={c} x={50} y={540} w={980} h={712} s={s} foco={foco} id={`r${n}`}>{children}</Ver></Svg>
    <div style={{ position: "absolute", top: 96, left: 60, display: "flex", alignItems: "center", gap: 24 }}>
      <Badge ok={ok} />
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 112, color: T, lineHeight: 1 }}>{ok ? "BIEN" : "MAL"}</div>
    </div>
    <div style={{ position: "absolute", top: 250, left: 60, right: 60, fontFamily: F, fontWeight: 800, fontSize: 60, lineHeight: 1.05, color: T }}>{titulo}</div>
    <div style={{ position: "absolute", top: 400, left: 60, right: 60, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 36, lineHeight: 1.2, color: T, opacity: 0.85 }}>{sub}</div>
  </Marco>
);

/** 2 · la única caída dibujada entera: Lola cabeza abajo, la corva atrapada por la cuerda (tramos tensos, cinta hacia la carga). */
const Volteo: React.FC = () => {
  const S = 2.0, hip: Pt = [350, 420], rot = 162;
  const ang = { ...POSE.cae, torso: -8, cabeza: -12, piernaA: [8, 108] as [number, number], piernaB: [22, 30] as [number, number], brazoA: [150, 118] as [number, number], brazoB: [-146, -112] as [number, number] };
  const k = rota(ext(0, 0, ang.piernaA[0], 66), rot), rod: Pt = [hip[0] + k[0] * S, hip[1] + k[1] * S];
  const chapa: Pt = [758, 108], abajo: Pt = [700, 830];
  const u = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
  const r1 = u(chapa, rod), r2 = u(chapa, abajo), dir = u([0, 0], [r1[0] + r2[0], r1[1] + r2[1]]);
  const mos: Pt = [chapa[0] + dir[0] * 86, chapa[1] + dir[1] * 86];
  const angCinta = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI - 90, corva: Pt = [rod[0] + 4, rod[1] - 8];
  return (
    <g>
      <rect x={-20} y={-20} width={1020} height={830} fill="#DCEBF8" />
      <path d="M720 -20 L1000 -20 L1000 820 L760 820 Q735 520 752 300 Q760 120 720 -20 Z" fill="#E6DCC8" stroke={T} strokeWidth={9} />
      <Linea p={[[860, 120], [840, 380], [880, 600], [850, 800]]} c="#B3A58C" w={8} />
      <Cuerda p={[mos, en(mos, abajo, 0.5), abajo]} g={16} />
      <Forma p={[[738, 88], [778, 84], [782, 128], [742, 132]]} c="#B8C0CA" w={6} />
      <g transform={`rotate(${angCinta} ${chapa[0]} ${chapa[1]})`}><rect x={chapa[0] - 14} y={chapa[1] + 16} width={28} height={58} rx={10} fill={COL.lila} stroke={T} strokeWidth={6} /></g>
      <Cuerda p={[mos, en(mos, corva, 0.5), corva]} g={16} />
      <g transform={`translate(${hip[0]} ${hip[1]}) scale(${S}) translate(${-hip[0]} ${-hip[1]})`}><Persona p={{ x: hip[0], y: hip[1] }} ang={ang} rot={rot} aspecto={LOLA} cara="miedo" /></g>
      <Cuerda p={[corva, [corva[0] - 18, corva[1] + 26], [hip[0] - 4, hip[1] - 6]]} g={16} />
      <circle cx={mos[0]} cy={mos[1]} r={16} fill="none" stroke={T} strokeWidth={14} /><circle cx={mos[0]} cy={mos[1]} r={16} fill="none" stroke="#C9D0D8" strokeWidth={7} />
      <circle cx={rod[0]} cy={rod[1]} r={48} fill="none" stroke={COL.rojo} strokeWidth={9} strokeDasharray="18 12" />
      <path d="M170 150 A300 300 0 0 0 110 600" stroke={COL.rojo} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M66 560 L108 646 L166 580 Z" fill={COL.rojo} />
    </g>
  );
};
const S2: React.FC = () => (
  <Marco n={2}>
    <Svg>
      <Tarjeta x={50} y={470} w={980} h={790} id="t2"><g transform="translate(50 470)"><Volteo /></g></Tarjeta>
      <VerD d={<Placa />} x={640} y={880} w={386} h={380} s={1.45} foco={[300, 880]} id="lupa" borde={9}><Circ p={[300, 870]} r={80} ok={false} /></VerD>
    </Svg>
    <div style={{ position: "absolute", top: 96, left: 60, display: "flex", alignItems: "center", gap: 24 }}>
      <Badge ok={false} />
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 112, color: T, lineHeight: 1 }}>MAL</div>
    </div>
    <div style={{ position: "absolute", top: 250, left: 60, right: 60, fontFamily: F, fontWeight: 800, fontSize: 60, lineHeight: 1.05, color: T }}>Al caer, la cuerda te engancha la pierna y te da la vuelta.</div>
    <div style={{ position: "absolute", top: 400, left: 60, right: 60, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 36, color: T, opacity: 0.85 }}>Tu pierna quedó entre la cuerda y la roca.</div>
  </Marco>
);

/** 8 · respuesta del desplome: el detalle del pie de cerca, mal y bien, con la misma postura. */
const S8: React.FC = () => (
  <Marco n={8}>
    <Svg>
      <VerD d={<Desplome />} x={50} y={560} w={480} h={620} s={1.3} foco={[330, 560]} id="d8a"><Circ p={[346, 572]} r={58} ok={false} /></VerD>
      <VerD d={<Desplome mal={false} />} x={550} y={560} w={480} h={620} s={1.3} foco={[330, 560]} id="d8b"><Circ p={[346, 576]} r={58} ok /></VerD>
    </Svg>
    <div style={{ position: "absolute", top: 96, left: 60, display: "flex", alignItems: "center", gap: 24 }}>
      <Badge ok={false} />
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 112, color: T, lineHeight: 1 }}>MAL</div>
    </div>
    <div style={{ position: "absolute", top: 250, left: 60, right: 60, fontFamily: F, fontWeight: 800, fontSize: 60, lineHeight: 1.05, color: T }}>En el desplome también engancha.</div>
    <div style={{ position: "absolute", top: 400, left: 60, right: 60, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 36, lineHeight: 1.2, color: T, opacity: 0.85 }}>Si la cuerda pasa por fuera de la espinilla, al caer tira de la pierna y te gira. Pásala por dentro, contra la roca.</div>
    <div style={{ position: "absolute", top: 580, left: 70 }}><Badge ok={false} size={80} /></div>
    <div style={{ position: "absolute", top: 580, left: 570 }}><Badge ok size={80} /></div>
    <Etiqueta t="por fuera de la pierna" top={1100} left={70} fs={30} />
    <Etiqueta t="entre pierna y roca" top={1100} left={570} fs={30} />
  </Marco>
);

// ——— 9 · guía de prevención ———
const Caja: React.FC<{ top: number; left: number; w: number; h: number; children: React.ReactNode; bg?: string }> = ({ top, left, w, h, children, bg = "#fff" }) => (
  <div style={{ position: "absolute", top, left, width: w, height: h, background: bg, border: `7px solid ${T}`, borderRadius: 32, boxSizing: "border-box", padding: "20px 26px" }}>{children}</div>
);
const h3 = { fontFamily: F, fontWeight: 800, fontSize: 40, color: T, lineHeight: 1.05 } as const;
const txt = { fontFamily: fuenteTexto, fontWeight: 700, fontSize: 32, color: T, lineHeight: 1.2 } as const;
const S9: React.FC = () => (
  <Marco n={9}>
    <div style={{ position: "absolute", top: 70, left: 60, ...h3, fontSize: 92 }}>CÓMO EVITARLO</div>
    <div style={{ position: "absolute", top: 186, left: 60, ...txt, fontSize: 36 }}>La regla: tu pierna nunca entre la cuerda y la roca.</div>
    <Svg>
      <Ver c={ENTRE} x={60} y={250} w={470} h={420} s={0.42} foco={[566, 860]} id="g1" />
      <VerD d={<Placa />} x={550} y={250} w={470} h={420} s={0.62} foco={[330, 820]} id="g2" />
    </Svg>
    <div style={{ position: "absolute", top: 270, left: 80 }}><Badge ok size={84} /></div>
    <div style={{ position: "absolute", top: 270, left: 570 }}><Badge ok={false} size={84} /></div>
    <Etiqueta t="delante o entre las piernas" top={610} left={74} fs={30} />
    <Etiqueta t="detrás del gemelo o talón" top={610} left={564} fs={30} />
    <Caja top={700} left={60} w={960} h={300} bg={COL.crema}>
      <div style={h3}>MIRA DÓNDE VA TU CUERDA:</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginTop: 16 }}>
        {["al chapar", "al ir de lado o cruzar los pies", "al talonar o poner el pie en gancho", "al pasar un desplome"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ minWidth: 54, height: 54, borderRadius: 27, background: T, color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>{i + 1}</div>
            <div style={txt}>{s}</div>
          </div>
        ))}
      </div>
    </Caja>
    <Caja top={1030} left={60} w={470} h={230}>
      <div style={h3}>¿ESTÁ DETRÁS?</div>
      <div style={{ ...txt, marginTop: 10 }}>Para en una buena posición y pasa el pie por encima de la cuerda.</div>
    </Caja>
    <Caja top={1030} left={550} w={470} h={230}>
      <div style={h3}>QUIEN ASEGURA</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 46, color: "#fff", background: COL.rojo, border: `5px solid ${T}`, borderRadius: 24, padding: "0 16px 6px" }}>¡PIERNA!</div>
        <div style={txt}>Si la ve, avisa.</div>
      </div>
    </Caja>
  </Marco>
);

// ——— 10 · resumen + CTA ———
const RES: { c?: Config; d?: React.ReactNode; ok: boolean; t: string; foco: Pt; s: number }[] = [
  { d: <Placa />, ok: false, t: "placa", foco: [360, 760], s: 0.5 },
  { c: ENTRE, ok: true, t: "entre las piernas", foco: [566, 880], s: 0.4 },
  { c: PASOALTO, ok: true, t: "paso alto", foco: [700, 820], s: 0.4 },
  { d: <Desplome />, ok: false, t: "desplome", foco: [380, 620], s: 0.62 },
];
const S10: React.FC = () => (
  <Marco n={10} desliza={false}>
    <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", ...h3, fontSize: 82 }}>¿CUÁNTAS ACERTASTE?</div>
    <Svg>{RES.map((r, i) => r.d ? <VerD key={i} d={r.d} x={60 + (i % 2) * 490} y={200 + Math.floor(i / 2) * 400} w={470} h={380} s={r.s} foco={r.foco} id={`m${i}`} /> : <Ver key={i} c={r.c!} x={60 + (i % 2) * 490} y={200 + Math.floor(i / 2) * 400} w={470} h={380} s={r.s} foco={r.foco} id={`m${i}`} />)}</Svg>
    {RES.map((r, i) => (
      <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 76 + (i % 2) * 490, top: 216 + Math.floor(i / 2) * 400 }}><Badge ok={r.ok} size={76} /></div>
        <Etiqueta t={`${i + 1} · ${r.t}`} top={510 + Math.floor(i / 2) * 400} left={76 + (i % 2) * 490} />
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 50, color: "#fff", background: T, borderRadius: 36, padding: "6px 34px 12px" }}>Mándaselo a tu compañero de cordada</span>
    </div>
    <div style={{ position: "absolute", top: 1128, left: 0, right: 0, textAlign: "center", ...txt, fontSize: 38 }}>y guárdalo para tu próxima vía.</div>
    <div style={{ position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 34, color: T, opacity: 0.7 }}>Próximo · ¿Bien o mal? #2: las cintas</div>
  </Marco>
);

export const CarruselPierna: React.FC<{ n?: number }> = ({ n = 1 }) => {
  switch (n) {
    case 2: return <S2 />;
    case 3: return <Pregunta n={3} c={ENTRE} titulo="¿Y AQUÍ?" tag="2 de 4 · encima de la chapa" foco={[580, 820]} />;
    case 4: return <Respuesta n={4} ok c={ENTRE} titulo="Entre las piernas está bien." sub="Al caer, la cuerda va recta a la chapa sin pasar por detrás de ninguna pierna." foco={[580, 780]}><Circ p={[566, 900]} r={130} ok /></Respuesta>;
    case 5: return <Pregunta n={5} c={PASOALTO} titulo="¿Y ESTE PASO?" tag="3 de 4 · paso alto" foco={[640, 800]} />;
    case 6: return <Respuesta n={6} ok c={PASOALTO} titulo="La cuerda va entre tu pierna y la roca." sub="Al caer te separas de la pared y la pierna sale por delante de la cuerda." foco={[660, 760]}><Circ p={[790, 800]} r={100} ok /></Respuesta>;
    case 7: return <Pregunta n={7} d={<Desplome />} titulo="¿Y EN EL DESPLOME?" tag="4 de 4 · pie en gancho" foco={[372, 640]} s={1.2} fs={96} />;
    case 8: return <S8 />;
    case 9: return <S9 />;
    case 10: return <S10 />;
    default: return <Pregunta n={1} d={<Placa />} titulo="MIRA LA CUERDA." tag="1 de 4 · placa" foco={[380, 760]} s={1.07} />;
  }
};
