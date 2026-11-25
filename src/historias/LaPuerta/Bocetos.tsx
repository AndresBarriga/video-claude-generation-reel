// E83 · bocetos de la propuesta (3 fotogramas fijos): 0–0,99 s reparto, 1–1,99 s la puerta, 2–2,99 s la bandera.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Novato, NOVATOS, type Pt } from "../../piezas/Novato";
import { fuenteTitulo, fuenteTexto } from "../../tema";
import type { Datos } from "../../tipos";

const ROJO = "#E2533F", VERDE = "#3FA66B", TINTA = "#141B26";

/** Pared clara de rocódromo: paneles, agujeros de tornillo y presas. */
export const Pared: React.FC<{ presas: { p: Pt; r: number; c: string; brillo?: boolean }[] }> = ({ presas }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <rect width={1080} height={1920} fill="#ECE6DC" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${i * 360 - 40} 0 L${i * 360 + 20} 1920`} stroke="#D8D0C3" strokeWidth={3} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={"h" + i} d={`M0 ${i * 380 + 60} L1080 ${i * 380 + 20}`} stroke="#D8D0C3" strokeWidth={3} />)}
    {Array.from({ length: 13 * 22 }).map((_, i) => <circle key={"t" + i} cx={(i % 13) * 88 + 30 + ((Math.floor(i / 13) % 2) * 44)} cy={Math.floor(i / 13) * 92 + 20} r={4} fill="#C9C0B2" />)}
    {presas.map((h, i) => <g key={"p" + i}>
      {h.brillo && <circle cx={h.p.x} cy={h.p.y} r={h.r * 2.1} fill="#FFE3A0" opacity={0.6} />}
      <ellipse cx={h.p.x + 6} cy={h.p.y + 8} rx={h.r} ry={h.r * 0.78} fill="#000" opacity={0.12} />
      <ellipse cx={h.p.x} cy={h.p.y} rx={h.r} ry={h.r * 0.78} fill={h.c} />
      <ellipse cx={h.p.x - h.r * 0.3} cy={h.p.y - h.r * 0.3} rx={h.r * 0.35} ry={h.r * 0.2} fill="#fff" opacity={0.3} />
    </g>)}
  </svg>
);

const Titular: React.FC<{ l1: string; l2: string; caja?: string }> = ({ l1, l2, caja = ROJO }) => (
  <div style={{ position: "absolute", top: 270, width: "100%", textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `14px ${TINTA}`, paintOrder: "stroke" }}>
    <div>{l1}</div>
    <div style={{ display: "inline-block", marginTop: 12, padding: "0 22px", background: caja, borderRadius: 14, WebkitTextStroke: "0", color: "#fff" }}>{l2}</div>
  </div>
);
const Etiqueta: React.FC<{ x: number; y: number; t: string; c?: string; tam?: number }> = ({ x, y, t, c = TINTA, tam = 34 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: fuenteTexto, fontWeight: 700, fontSize: tam, letterSpacing: 3, color: "#fff", background: c, padding: "6px 16px", borderRadius: 10, whiteSpace: "nowrap" }}>{t}</div>
);
const Barra: React.FC<{ v: number; t: string; c: string; top?: number }> = ({ v, t, c, top = 560 }) => (
  <div style={{ position: "absolute", top, left: 240, width: 600 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: TINTA }}><span>{t}</span><span /></div>
    <div style={{ height: 26, borderRadius: 13, background: "#2A3140", marginTop: 6 }}><div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 13, background: c }} /></div>
  </div>
);
const Sub: React.FC<{ t: string; clave?: string; c?: string }> = ({ t, clave, c = ROJO }) => (
  <div style={{ position: "absolute", bottom: 420, width: "100%", textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 64, color: "#fff", WebkitTextStroke: `10px ${TINTA}`, paintOrder: "stroke" }}>
    {t} {clave && <span style={{ background: c, WebkitTextStroke: "0", padding: "0 14px", borderRadius: 10 }}>{clave}</span>}
  </div>
);

// Escena común: misma vía para la puerta y la bandera.
const C = { x: 560, y: 1180, s: 1.15 };
const MD = { x: 740, y: 800 }, PD = { x: 600, y: 1470 }, OBJ = { x: 250, y: 740 };
const PRESAS = [
  { p: MD, r: 34, c: VERDE }, { p: PD, r: 26, c: VERDE }, { p: { x: 470, y: 820 }, r: 30, c: VERDE },
  { p: OBJ, r: 36, c: "#F2C230", brillo: true }, { p: { x: 900, y: 1100 }, r: 24, c: "#7E8AA0" }, { p: { x: 160, y: 1320 }, r: 26, c: "#7E8AA0" },
  { p: { x: 820, y: 1620 }, r: 22, c: "#7E8AA0" }, { p: { x: 1000, y: 1350 }, r: 22, c: "#7E8AA0" },
];

const Reparto: React.FC = () => {
  const nombres: [keyof typeof NOVATOS, string, string, any][] = [["fermin", "FERMÍN", "torpe con gafas", "miedo"], ["quique", "QUIQUE", "rizos, todo ilusión", "normal"], ["tono", "TOÑO", "barba, cuarentón", "esfuerzo"]];
  return (
    <AbsoluteFill>
      <Pared presas={[0, 1, 2].flatMap((i) => [{ p: { x: 200 + i * 340 - 70, y: 820 }, r: 22, c: VERDE }, { p: { x: 200 + i * 340 + 70, y: 820 }, r: 22, c: VERDE }])} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {nombres.map(([k], i) => {
          const x = 200 + i * 340;
          return <Novato key={k} x={x} y={1170} s={0.72} aspecto={NOVATOS[k]} manoI={{ x: x - 70, y: 820 }} manoD={{ x: x + 70, y: 820 }} pieI={{ x: x - 70, y: 1340 }} pieD={{ x: x + 60, y: 1350 }} mira={i === 1 ? 1 : -1} cara={nombres[i][3]} cuerda />;
        })}
      </svg>
      {nombres.map(([k, n, d], i) => <React.Fragment key={k}><Etiqueta x={200 + i * 340} y={1480} t={n} c={NOVATOS[k].camiseta} tam={44} /><div style={{ position: "absolute", top: 1530, left: 200 + i * 340 - 160, width: 320, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 28, color: TINTA }}>{d}</div></React.Fragment>)}
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 80, color: TINTA }}>¿Quién es la puerta?</div>
      <div style={{ position: "absolute", top: 410, width: "100%", textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 36, color: "#6B6258" }}>3 candidatos · de espaldas a cámara, giran la cara</div>
    </AbsoluteFill>
  );
};

const Puerta: React.FC = () => {
  const hx = (MD.x + PD.x) / 2, abre = 0.55; // ~57° de apertura
  return (
    <AbsoluteFill>
      <Pared presas={PRESAS} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M${MD.x + 25} ${MD.y - 120} L${PD.x - 20} ${PD.y + 90}`} stroke={ROJO} strokeWidth={7} strokeDasharray="22 14" />
        <g transform={`translate(${hx} 0) scale(${Math.cos(abre)} 1) translate(${-hx} 0)`}>
          <Novato {...C} aspecto={NOVATOS.fermin} manoD={MD} pieD={PD} manoI={{ x: 140, y: 760 }} pieI={{ x: 470, y: 1530 }} mira={-1} cara="miedo" inclina={-6} />
        </g>
        <path d="M330 1000 Q200 1080 260 1220" stroke={ROJO} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M232 1196 L262 1240 L292 1196" stroke={ROJO} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Titular l1="FERMÍN NO ES DÉBIL." l2="ES UNA PUERTA." />
      <Barra v={0.96} t="GIRO" c={ROJO} top={500} />
      <Etiqueta x={MD.x + 130} y={690} t="BISAGRA" c={ROJO} />
      <Etiqueta x={hx} y={1610} t="MANO + PIE DEL MISMO LADO" c={TINTA} tam={28} />
    </AbsoluteFill>
  );
};

const Bandera: React.FC = () => {
  const hx = (MD.x + PD.x) / 2;
  return (
    <AbsoluteFill>
      <Pared presas={PRESAS} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d={`M${MD.x + 25} ${MD.y - 120} L${PD.x - 20} ${PD.y + 90}`} stroke={VERDE} strokeWidth={7} strokeDasharray="22 14" />
        <Novato x={C.x - 70} y={C.y - 20} s={C.s} aspecto={NOVATOS.fermin} manoD={MD} pieD={PD} manoI={OBJ} pieI={{ x: 1120, y: 1360 }} banderaI mira={1} cara="alivio" inclina={-14} />
        {/* cota de palanca: del centro de masas a la bisagra, antes (rojo, tenue) y ahora (verde) */}
        <path d={`M${C.x - 70} 1265 L${MD.x + 25 + (PD.x - 20 - MD.x - 25) * ((1265 - MD.y + 120) / (PD.y + 90 - MD.y + 120))} 1265`} stroke={VERDE} strokeWidth={8} />
        <circle cx={C.x - 70} cy={1265} r={14} fill="#fff" stroke={TINTA} strokeWidth={5} />
        <path d="M1010 1200 Q1060 1100 990 1030" stroke={VERDE} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M1015 1030 L985 1025 L995 1055" stroke={VERDE} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Etiqueta x={hx - 40} y={1320} t="PALANCA CORTA" c={VERDE} tam={30} />
      <Etiqueta x={930} y={1250} t="CONTRAGIRO" c={VERDE} tam={30} />
      <Etiqueta x={540} y={300} t="LA BANDERA" c={VERDE} tam={44} />
      <Barra v={0.45} t="GIRO" c="#E3A33B" top={380} />
      <Etiqueta x={540} y={1660} t="RODILLA DE APOYO HACIA DONDE APUNTA EL PIE" c={TINTA} tam={26} />
    </AbsoluteFill>
  );
};

export const LaPuertaBocetos: React.FC<{ datos: Datos }> = () => {
  const f = useCurrentFrame();
  return f < 30 ? <Reparto /> : f < 60 ? <Puerta /> : <Bandera />;
};
