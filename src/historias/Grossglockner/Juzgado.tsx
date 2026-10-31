// «Eso no lo hiciste tú. Lo hizo él.» (webcam: su frontal bajando, «ÉL») → juicio: sala con paneles de madera, estrado alto con la jueza
// sentada detrás, él en su silla, la manta en la mesa de pruebas, mazazo. Detalle secundario: el secretario dormido con su café.
import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, EL, Etiqueta, PG, Svg, type P, T } from "./comun";
import { Fuente } from "../Pierna/comun";
import { PlanoWebcam } from "./Webcam";

const TOGA = { chaqueta: "#1B2230", chaquetaSombra: "#0E141E", pantalon: "#1B2230", casco: null, pelo: "#C9CDD2", peinado: "corto" as const, gafas: true, arnes: false };
const SECRE = { chaqueta: "#6E7B8A", chaquetaSombra: "#56616E", pantalon: "#2B3442", casco: null, pelo: "#3B2A20", peinado: "rizado" as const, arnes: false };
const SUELO = 1330;
const Silla: React.FC<{ x: number; y: number; mira?: 1 | -1 }> = ({ x, y, mira = 1 }) => (
  <g>
    <rect x={x - 46} y={y} width={92} height={16} rx={6} fill="#5A3F28" />
    <path d={`M${x - 40} ${y + 14} L${x - 40} ${SUELO} M${x + 40} ${y + 14} L${x + 40} ${SUELO}`} stroke="#4A3220" strokeWidth={10} />
    <rect x={x - 46 * mira - 8} y={y - 120} width={16} height={136} rx={6} fill="#5A3F28" />
  </g>
);

export const Juzgado: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), pc = pal("Cinco"), corte = pc != null ? pc - 2 : 0; // el plano webcam «ÉL» solo si el texto trae «Cinco…»
  if (corte > 0 && f < corte) return <PlanoWebcam d={corte} baja={[1.2, 2.2]} hora={(k) => `02:${String(31 + Math.floor(k / 30)).padStart(2, "0")}:00`} titulo="ÉL" />;
  const g = f - corte, golpe = g < 6 ? 0 : spring({ frame: g - 6, fps: 30, config: { damping: 7, stiffness: 320 } });
  const mazo = interpolate(golpe, [0, 1], [-50, 0]);
  return (
    <Camara d={d - corte} empuje={0.04} foco="50% 50%" sacudida={g > 7 && g < 13 ? 6 : 0}>
      <Svg>
        {/* sala: paneles de madera y suelo */}
        <rect width={1080} height={1920} fill="#B89A74" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * 124} y={0} width={8} height={SUELO} fill="#9C7F5C" />)}
        <rect y={SUELO} width={1080} height={700} fill="#6E5640" />
        <rect y={SUELO} width={1080} height={10} fill="#4A3220" />
        {/* jueza sentada tras el estrado (solo asoma de cintura para arriba) */}
        <Escalador x={500} y={760} quien="joe" s={1.5} aspecto={TOGA} cara="normal" angulos={{ brazoA: [100, 150], brazoB: [60, 100], cabeza: 6 }} />
        <rect x={160} y={700} width={760} height={360} fill="#7A5638" stroke="#4A3220" strokeWidth={8} />
        <rect x={140} y={680} width={800} height={40} rx={6} fill="#5A3F28" />
        <circle cx={540} cy={860} r={60} fill="#C9A24A" stroke="#7A5A10" strokeWidth={6} />
        {/* mazo */}
        <g transform={`translate(640 690) rotate(${mazo})`}><rect x={-6} y={-90} width={12} height={90} rx={5} fill="#4A3220" /><rect x={-30} y={-110} width={60} height={34} rx={10} fill="#5A3F28" /></g>
        {/* mesa de pruebas con la manta */}
        <rect x={600} y={1150} width={260} height={20} rx={6} fill="#5A3F28" />
        <path d="M620 1170 L620 1330 M840 1170 L840 1330" stroke="#4A3220" strokeWidth={10} />
        <rect x={650} y={1060} width={160} height={90} rx={10} fill="#DDEBF4" opacity={0.7} stroke="#9AA6B2" strokeWidth={4} />
        <path d="M670 1130 L700 1080 L740 1095 L780 1075 L795 1130 Z" fill={PG.oro} stroke="#7A5A10" strokeWidth={3} />
        {/* él, sentado en su silla, de espaldas al público */}
        <Silla x={320} y={1170} mira={1} />
        <Escalador x={320} y={1160} quien="joe" s={1.6} aspecto={{ ...EL, casco: null }} pose="sentado" cara="normal" mira={1} angulos={{ cabeza: -14, piernaA: [70, 10], piernaB: [64, 4] }} />
        {/* secretario dormido con su café */}
        <rect x={880} y={1160} width={200} height={20} rx={6} fill="#5A3F28" />
        <Silla x={980} y={1200} mira={-1} />
        <Escalador x={980} y={1190} quien="joe" s={1.1} aspecto={SECRE} pose="sentado" cara="cerrados" mira={-1} angulos={{ torso: 34, cabeza: 44, brazoA: [70, 110], brazoB: [60, 100] }} />
        <rect x={900} y={1120} width={30} height={40} rx={6} fill="#EEF1F4" stroke="#0B1624" strokeWidth={4} />
      </Svg>
      <div style={{ position: "absolute", top: 1010, left: 730, transform: "translateX(-50%)", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 30, color: "#C8402E", background: "#fff", borderRadius: 10, padding: "2px 10px" }}>PRUEBA</div>
      <Etiqueta texto={e.titulo} top={250} tam={80} desde={4} />
      <Fuente texto={e.fuente ?? ""} />
    </Camara>
  );
};
