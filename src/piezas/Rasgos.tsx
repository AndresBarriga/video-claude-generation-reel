// Rasgos para variar el reparto con el mismo dibujo (guía visual: «reparto variado, mismo estilo»).
// Tocado = pelo, gorro, gafas y barba sobre la cabeza de Escalador. Objeto = lo que lleva en la mano delantera.
import React from "react";

export type Aspecto = {
  chaqueta?: string; chaquetaSombra?: string; pantalon?: string; piel?: string; pielSombra?: string;
  /** null = sin casco (bloque) */ casco?: string | null;
  gorro?: string; pelo?: string; peinado?: "corto" | "rizado" | "coleta" | "trenzas" | "rapado";
  barba?: string; gafas?: boolean; arnes?: boolean; manos?: "guante" | "piel";
};
export type Objeto = "movil" | "movilLuz" | "cepillo" | "lija" | "crema" | "platano" | "nueces" | "movilNegro" | "cepilloDientes";

const R = 30; // radio de la cabeza en Escalador
/** Pelo, gorro y barba. capa "debajo" = barba (bajo los ojos); "encima" = pelo y gorro (sobre los ojos, que ya van recortados a la cara).
 *  La línea del gorro queda por encima de las cejas (y ≈ -12) para que nunca tape ni pise los ojos. */
export const Tocado: React.FC<{ a: Aspecto; capa?: "debajo" | "encima" }> = ({ a, capa = "encima" }) => {
  const pelo = a.pelo ?? "#2B1D14";
  if (capa === "debajo") return a.barba ? <path d={`M${-R + 4} 4 Q${-R + 6} ${R + 10} 6 ${R + 6} Q${R} ${R + 4} ${R - 2} 8 Q14 20 4 18 Q-8 20 ${-R + 4} 4 Z`} fill={a.barba} /> : null;
  return (
    <g>
      {!a.gorro && a.peinado === "rizado" && [[-24, -22], [-10, -32], [6, -34], [20, -28], [-30, -6], [28, -16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill={pelo} />)}
      {!a.gorro && a.peinado !== "rizado" && a.peinado !== "rapado" && <path d={`M${-R - 2} -2 A${R + 2} ${R + 2} 0 0 1 ${R + 2} -10 Q8 -18 -6 -16 Q-18 -14 ${-R + 6} 2 Z`} fill={pelo} />}
      {a.peinado === "rapado" && <path d={`M${-R + 1} -6 A${R - 1} ${R - 1} 0 0 1 ${R - 1} -6 Q0 -20 ${-R + 1} -6 Z`} fill={pelo} opacity={0.5} />}
      {a.peinado === "trenzas" && <g fill={pelo}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={-R + 2 - i * 2} cy={8 + i * 15} r={9 - i} />)}</g>}
      {a.peinado === "coleta" && <path d={`M${-R + 2} -8 q-30 6 -26 40 q10 -14 22 -22 Z`} fill={pelo} />}
      {a.gorro && <g>
        {a.peinado === "rizado" && [[-31, -2], [-29, 12], [30, -2]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={pelo} />)}
        <path d={`M${-R - 3} -14 A${R + 3} ${R + 4} 0 0 1 ${R + 3} -14 Z`} fill={a.gorro} />
        <rect x={-R - 5} y={-24} width={2 * R + 10} height={13} rx={6} fill={a.gorro} stroke="#000" strokeOpacity={0.18} strokeWidth={3} />
        <circle cx={0} cy={-R - 18} r={9} fill={a.gorro} stroke="#000" strokeOpacity={0.12} strokeWidth={3} />
      </g>}
    </g>
  );
};

/** Gafas, en el mismo sistema que los ojos de Escalador (ojos en x 7 y 23, y -3). */
export const Gafas: React.FC = () => (
  <g stroke="#141B26" strokeWidth={3.5} fill="#fff" fillOpacity={0.18}>
    <circle cx={7} cy={-3} r={10} /><circle cx={24} cy={-3} r={10} /><path d="M17 -3 L14 -3" fill="none" />
  </g>
);

/** Objeto en la mano. (0,0) = mano; el eje +x apunta hacia donde sigue el antebrazo. */
export const ObjetoMano: React.FC<{ o: Objeto }> = ({ o }) => {
  switch (o) {
    case "platano":
      return (<g transform="rotate(-30)">
        <path d="M-6 -46 Q30 -20 14 30 Q8 40 2 30 Q12 -6 -14 -40 Z" fill="#F2C94C" stroke="#141B26" strokeWidth={3.5} />
        <path d="M-14 -40 L-12 -50 L-4 -48 Z" fill="#5E4A2A" />
      </g>);
    case "nueces":
      return (<g>
        <path d="M-22 -30 L22 -30 L28 20 Q0 28 -28 20 Z" fill="#C9A06A" stroke="#141B26" strokeWidth={3.5} />
        {[[-10, -32], [4, -36], [14, -30]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={7} fill="#8A5A2B" stroke="#141B26" strokeWidth={2.5} />)}
      </g>);
    case "movilNegro":
      return (<g><rect x={-12} y={-30} width={24} height={44} rx={5} fill="#141B26" /><rect x={-9} y={-26} width={18} height={34} rx={3} fill="#05080D" /></g>);
    case "movil": case "movilLuz":
      return (<g>
        {o === "movilLuz" && <path d="M10 -20 L520 -200 L520 160 Z" fill="#FFF3C4" opacity={0.09} />}
        <rect x={-12} y={-30} width={24} height={44} rx={5} fill="#141B26" />
        <rect x={-9} y={-26} width={18} height={34} rx={3} fill={o === "movilLuz" ? "#2A3442" : "#7FB7D6"} />
        {o === "movilLuz" && <circle cx={6} cy={-24} r={5} fill="#FFF7D6" />}
      </g>);
    case "cepillo":
      return (<g><rect x={-4} y={-6} width={60} height={12} rx={6} fill="#C9A06A" /><rect x={52} y={-12} width={22} height={24} rx={4} fill="#2B3442" /></g>);
    case "cepilloDientes":
      return (<g transform="rotate(-70)"><rect x={-6} y={-5} width={74} height={10} rx={5} fill="#4F9FD9" stroke="#141B26" strokeWidth={2.5} /><rect x={50} y={-14} width={18} height={10} rx={3} fill="#7FD1E8" /></g>);
    case "lija":
      return <rect x={-6} y={-14} width={30} height={28} rx={4} fill="#A9926B" stroke="#7A6648" strokeWidth={3} />;
    case "crema":
      return <rect x={-8} y={-30} width={18} height={44} rx={6} fill="#EDEFF2" stroke="#1F6E7E" strokeWidth={4} />;
  }
};
