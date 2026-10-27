// Rasgos para variar el reparto con el mismo dibujo (guía visual: «reparto variado, mismo estilo»).
// Tocado = pelo, gorro, gafas y barba sobre la cabeza de Escalador. Objeto = lo que lleva en la mano delantera.
import React from "react";

export type Aspecto = {
  chaqueta?: string; chaquetaSombra?: string; pantalon?: string; piel?: string; pielSombra?: string;
  /** null = sin casco (bloque) */ casco?: string | null;
  gorro?: string; pelo?: string; peinado?: "corto" | "rizado" | "coleta";
  barba?: string; gafas?: boolean; arnes?: boolean; manos?: "guante" | "piel";
};
export type Objeto = "movil" | "movilLuz" | "cepillo" | "lija" | "crema";

const R = 30; // radio de la cabeza en Escalador
export const Tocado: React.FC<{ a: Aspecto }> = ({ a }) => {
  const pelo = a.pelo ?? "#2B1D14";
  return (
    <g>
      {a.barba && <path d={`M${-R + 4} 4 Q${-R + 6} ${R + 10} 6 ${R + 6} Q${R} ${R + 4} ${R - 2} 8 Q14 20 4 18 Q-8 20 ${-R + 4} 4 Z`} fill={a.barba} />}
      {!a.gorro && a.peinado === "rizado" && [[-24, -14], [-12, -26], [4, -30], [18, -24], [-28, 2], [26, -12]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={13} fill={pelo} />)}
      {!a.gorro && a.peinado !== "rizado" && <path d={`M${-R - 2} 2 A${R + 2} ${R + 2} 0 0 1 ${R + 2} -6 Q8 -14 -6 -10 Q-18 -8 ${-R + 8} 6 Z`} fill={pelo} />}
      {a.peinado === "coleta" && <path d={`M${-R + 2} -8 q-30 6 -26 40 q10 -14 22 -22 Z`} fill={pelo} />}
      {a.gorro && <g>
        {a.peinado === "rizado" && [[-30, 4], [-26, 16], [28, 4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10} fill={pelo} />)}
        <path d={`M${-R - 4} -2 A${R + 4} ${R + 6} 0 0 1 ${R + 4} -2 Z`} fill={a.gorro} />
        <rect x={-R - 6} y={-8} width={2 * R + 12} height={14} rx={6} fill={a.gorro} stroke="#000" strokeOpacity={0.15} strokeWidth={3} />
        <circle cx={0} cy={-R - 8} r={9} fill={a.gorro} stroke="#000" strokeOpacity={0.12} strokeWidth={3} />
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
    case "movil": case "movilLuz":
      return (<g>
        {o === "movilLuz" && <path d="M10 -20 L520 -200 L520 160 Z" fill="#FFF3C4" opacity={0.2} />}
        <rect x={-12} y={-30} width={24} height={44} rx={5} fill="#141B26" />
        <rect x={-9} y={-26} width={18} height={34} rx={3} fill={o === "movilLuz" ? "#2A3442" : "#7FB7D6"} />
        {o === "movilLuz" && <circle cx={6} cy={-24} r={5} fill="#FFF7D6" />}
      </g>);
    case "cepillo":
      return (<g><rect x={-4} y={-6} width={60} height={12} rx={6} fill="#C9A06A" /><rect x={52} y={-12} width={22} height={24} rx={4} fill="#2B3442" /></g>);
    case "lija":
      return <rect x={-6} y={-14} width={30} height={28} rx={4} fill="#A9926B" stroke="#7A6648" strokeWidth={3} />;
    case "crema":
      return <rect x={-8} y={-30} width={18} height={44} rx={6} fill="#EDEFF2" stroke="#1F6E7E" strokeWidth={4} />;
  }
};
