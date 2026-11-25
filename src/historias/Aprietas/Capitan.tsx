// E82 · rehook: El Capitán enorme y Honnold diminuto SIN CUERDA. La cámara sale del muñeco a la pared entera (884 m),
// luego entra el reloj «3 h 56 min». Exterior de día, claro (paleta fría + granito).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASPECTO_H, CUERPO_H, CabezaHonnold } from "../../piezas/Honnold";
import { Cifra } from "../../piezas/kit";
import { Svg, COL, F, pop, cl, sale, type P } from "./comun";

export const Cielo: React.FC<{ calido?: number }> = ({ calido = 0 }) => (
  <g>
    <defs><linearGradient id="ap-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={calido ? "#F7C99B" : "#BFDDF7"} /><stop offset="1" stopColor={calido ? "#FDE9CF" : "#F4F8FC"} /></linearGradient></defs>
    <rect x={-2000} y={-2000} width={5000} height={6000} fill="url(#ap-cielo)" />
    <path d="M-1000 1250 Q-200 1020 300 1180 T1300 1120 L2500 1200 L2500 2600 L-1000 2600 Z" fill="#C9D6E3" />
  </g>
);
/** El Capitán: proa de granito (x, base, alto en px de pantalla a z 1). */
export const Proa: React.FC = () => (
  <g>
    <path d="M60 1560 C120 1200 180 900 330 700 C420 590 560 560 700 600 C860 650 980 760 1180 800 L1400 820 L1400 1560 Z" fill="#D8D5CD" stroke={COL.tinta} strokeWidth={6} strokeLinejoin="round" />
    <path d="M330 700 C420 590 560 560 700 600 C620 640 560 760 540 900 C520 1100 520 1300 560 1560 L60 1560 C120 1200 180 900 330 700 Z" fill="#C3BFB6" />
    {[[620, 640, 1500, 16], [760, 660, 1300, 10], [880, 740, 1450, 14], [450, 760, 1200, 8], [1020, 790, 1380, 12]].map(([x, y0, y1, w], i) => <path key={i} d={`M${x} ${y0} Q${x + 14} ${(y0 + y1) / 2} ${x - 6} ${y1}`} stroke="#A9A499" strokeWidth={w} strokeLinecap="round" opacity={0.55} />)}
    {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M${-60 + i * 60} 1560 l30 -${90 + (i % 4) * 26} l30 ${90 + (i % 4) * 26} Z`} fill={i % 2 ? "#3E6B52" : "#2F5A44"} />)}
    <rect x={-400} y={1555} width={2000} height={600} fill="#7FA46A" />
  </g>
);
export const HX = 650, HY0 = 1130;

export const Capitan: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), fN = pal("ochocientos") ?? 40, fC = pal("cuerda") ?? 90, fH = pal("casi") ?? d - 70;
  const t = interpolate(f, [0, fN + 6], [0, 1], { ...cl, easing: (x) => 1 - (1 - x) ** 3 }), z = 4.2 + (1 - 4.2) * t;
  const sube = interpolate(f, [0, d], [0, -60]), hy = HY0 + sube, paso = Math.sin(f / 6) * 10;
  const ang = { torso: 10, cabeza: -10, brazoA: [150 + paso, 170], brazoB: [120 - paso, 150], piernaA: [80 + paso, 20], piernaB: [50 - paso, 6] } as any;
  return (
    <>
      <Svg>
        <g transform={`translate(${HX} ${hy}) scale(${z}) translate(${-HX} ${-hy})`}>
          <Cielo /><Proa />
          <Escalador x={HX - 8} y={hy} quien="joe" s={0.2} angulos={ang} aspecto={ASPECTO_H} {...CUERPO_H} Cabeza={CabezaHonnold} cara="normal" />
          {f > fN && <g opacity={sale((f - fN) / 8)}><path d={`M1010 ${1550} V${800}`} stroke={COL.tinta} strokeWidth={6} strokeDasharray="18 12" /><path d="M990 830 l20 -30 l20 30 M990 1520 l20 30 l20 -30" stroke={COL.tinta} strokeWidth={6} fill="none" /></g>}
        </g>
      </Svg>
      {f > fC - 4 && f < fH && <div style={{ position: "absolute", left: HX - 30, top: hy - 160, transform: `scale(${pop(f - fC + 4)})`, fontFamily: F, fontWeight: 900, fontSize: 46, color: "#fff", background: COL.rojo, border: `6px solid ${COL.tinta}`, borderRadius: 22, padding: "4px 16px 8px", whiteSpace: "nowrap" }}><span style={{ textDecoration: "line-through", textDecorationThickness: 6 }}>CUERDA</span></div>}
      <div style={{ position: "absolute", left: 90, top: 1180, width: 520, height: 260, borderRadius: 40, background: "rgba(20,33,58,.88)", opacity: f > fN - 2 ? 1 : 0, transform: `scale(${pop(f - fN + 2)})` }} />
      {f < fH + 4 && <Cifra valor={884} despues=" m" x={350} y={1210} k={(f - fN) / 20} tam={150} color={COL.amarillo} etiqueta="SIN CUERDA" />}
      {f >= fH + 4 && <Cifra texto="3 h 56 min" x={350} y={1225} k={(f - fH) / 10} tam={96} color={COL.amarillo} etiqueta="EN LA PARED" />}
    </>
  );
};
