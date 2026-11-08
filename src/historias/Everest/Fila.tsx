// Escena 2 · La fila: escaladores con cara subiendo junto a la roca; el último pasa ante el hombre sentado. «30+» grande.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { NOCHE, Nieve, Escarcha, Svg, Rotulo, ei, type P } from "./comun";

const ROPA = [
  { chaqueta: "#C8402E", chaquetaSombra: "#8E2A1F", casco: "#F2C230", piel: "#E9B990" },
  { chaqueta: "#2FA39A", chaquetaSombra: "#1F7770", casco: "#EDEFF2", piel: "#C98E67" },
  { chaqueta: "#7A4FA3", chaquetaSombra: "#563578", casco: "#2B3442", piel: "#E2B08A" },
  { chaqueta: "#D98A1E", chaquetaSombra: "#9A5F10", casco: "#EDEFF2", piel: "#B5784F" },
  { chaqueta: "#3C6EA5", chaquetaSombra: "#274A73", casco: "#F2C230", piel: "#E9B990" },
];

export const Fila: React.FC<P> = () => {
  const f = useCurrentFrame();
  const mov = ei(f, 0, 90, 0, 70);
  return (
    <AbsoluteFill style={{ background: NOCHE.cieloA }}>
      <Svg>
        <defs><linearGradient id="cieloF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.cieloA} /><stop offset="1" stopColor={NOCHE.cieloB} /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#cieloF)" />
        {/* cresta de nieve: tramo suave a la derecha, tramo empinado hacia arriba a la izquierda */}
        <path d="M1250 1760 L250 1330 L-100 620 L-100 2100 L1250 2100 Z" fill={NOCHE.nieveS} opacity={0.5} />
        <path d="M1250 1760 L250 1330 L-100 620" stroke={NOCHE.nieve} strokeWidth={6} fill="none" opacity={0.5} />
        {/* luces lejanas subiendo por el tramo empinado */}
        {Array.from({ length: 13 }).map((_, i) => {
          const t = i / 12, x = 215 - t * 290, y = 1245 - t * 600 - 70;
          return <g key={i}><circle cx={x} cy={y} r={20} fill="#FFE9B8" opacity={0.22} /><circle cx={x} cy={y} r={7} fill="#FFF7D6" /></g>;
        })}
        {/* cueva con el hombre sentado, abajo a la derecha */}
        <path d="M740 1330 Q900 1250 1180 1270 L1180 1680 L780 1700 Z" fill={NOCHE.roca} />
        <path d="M800 1400 Q930 1340 1180 1360 L1180 1680 L820 1690 Z" fill={NOCHE.rocaS} />
        <Escalador x={1000} y={1568} quien="simon" pose="sentadoSuelo" cara="cerrados" s={1.45} mira={-1}
          angulos={{ torso: -8, cabeza: 14, brazoA: [58, 140], brazoB: [50, 130], piernaA: [105, 12], piernaB: [100, 8] }}
          aspecto={{ chaqueta: "#7E2A2A", chaquetaSombra: "#561D1D", pantalon: "#222B38", casco: null, peinado: "corto", pelo: "#3A2A1E", piel: "#AEB6C0", pielSombra: "#8B95A1", manos: "piel" }} />
        <Escarcha x={975} y={1440} r={46} n={18} seed="fh" />
        {/* la fila de escaladores con cara, subiendo (miran a la izquierda) */}
        {ROPA.map((r, i) => {
          const x = 760 - i * 130 - mov * 0.4, yl = 1760 - (1250 - x) * (430 / 1000), s = 1.2 - i * 0.07;
          return <Escalador key={i} x={x} y={yl - 128 * s} quien="joe" pose="pie" cara={i === 0 ? "serio" : "normal"} s={s} mira={-1} frontal={i === 0 || i === 3}
            angulos={{ torso: 12 }}
            aspecto={{ ...r, pantalon: "#222B38", peinado: i % 2 ? "coleta" : "corto", pelo: "#2B1D14", manos: "guante" }} />;
        })}
        <Nieve f={f} n={55} />
      </Svg>
      <Svg>
        <Rotulo f={f} ini={0} t="EVEREST 2006" y={270} tam={74} col="#fff" />
        <Rotulo f={f} ini={6} t="30+" y={470} tam={230} col="#FF6A1F" />
      </Svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
