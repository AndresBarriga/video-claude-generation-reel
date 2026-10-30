// Escena 10: «Eso no lo hiciste tú. Lo hizo él.» (webcam: su frontal bajando, marcado) → juicio: mazazo, la manta como PRUEBA, el secretario dormido con su café.
import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Camara, EL, Etiqueta, Manta, Svg, type P, T } from "./comun";
import { Fuente } from "../Pierna/comun";
import { PlanoWebcam } from "./Webcam";

const TOGA = { chaqueta: "#1B2230", chaquetaSombra: "#0E141E", pantalon: "#1B2230", casco: null, pelo: "#C9CDD2", gafas: true, arnes: false };
const SECRE = { chaqueta: "#6E7B8A", chaquetaSombra: "#56616E", pantalon: "#2B3442", casco: null, pelo: "#3B2A20", peinado: "rizado" as const, arnes: false };
export const Juzgado: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame(), corte = (pal("Cinco") ?? Math.round(d * 0.4)) - 2;
  if (f < corte) return <PlanoWebcam d={corte} baja={[1.2, 2.2]} hora={(k) => `02:${String(31 + Math.floor(k / 30)).padStart(2, "0")}:00`} titulo="ÉL" />;
  const g = f - corte, maza = spring({ frame: g - 2, fps: 30, config: { damping: 8, stiffness: 300 } });
  return (
    <Camara d={d - corte} empuje={0.04} foco="50% 55%" sacudida={g > 4 && g < 10 ? 5 : 0}>
      <Svg>
        <rect width={1080} height={1920} fill="#E6DCCB" />
        <rect y={0} width={1080} height={300} fill="#CDBFA8" />
        <Escalador x={540} y={760} quien="joe" s={1.5} aspecto={TOGA} cara="normal" angulos={{ brazoA: [120 - 40 * maza, 150 - 30 * maza] }} />
        <rect x={150} y={780} width={780} height={300} fill="#7A5638" stroke="#4A3220" strokeWidth={8} />
        <rect x={150} y={760} width={780} height={60} fill="#5A3F28" />
        <g transform={`translate(760 700)`}><rect x={-80} y={-70} width={160} height={120} rx={10} fill="#DDEBF4" opacity={0.6} stroke="#9AA6B2" strokeWidth={4} /><Manta x={0} y={-10} s={1.6} /><text x={0} y={40} textAnchor="middle" fontFamily={T.fuenteTexto} fontWeight={800} fontSize={24} fill="#C8402E">PRUEBA</text></g>
        <rect y={1180} width={1080} height={800} fill="#B9A88E" />
        <Escalador x={420} y={1250} quien="joe" s={1.8} aspecto={{ ...EL, casco: null }} pose="sentado" cara="normal" mira={1} angulos={{ cabeza: -12 }} />
        {/* secretario dormido con su café (detalle secundario) */}
        <rect x={760} y={1120} width={240} height={90} rx={8} fill="#7A5638" />
        <Escalador x={860} y={1140} quien="joe" s={1.2} aspecto={SECRE} pose="sentado" cara="cerrados" mira={-1} angulos={{ torso: 30, cabeza: 40 }} />
        <rect x={930} y={1080} width={34} height={40} rx={6} fill="#EEF1F4" stroke="#0B1624" strokeWidth={4} />
      </Svg>
      <Etiqueta texto={e.titulo} top={250} tam={80} desde={4} />
      <Fuente texto={e.fuente ?? ""} />
    </Camara>
  );
};
