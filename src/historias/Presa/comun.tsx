// E31 «La presa perfecta»: piezas comunes. Rocódromo de bloque (pieza Rocodromo), presa rosa que se cepilla
// y, debajo, la presa de pie gris de polvo que nadie mira (la culpable).
import React from "react";
import { Escalador, type PropsEscalador } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { MAT, Resina, dePieR } from "../../piezas/Rocodromo";
import { Destellos, ROSA } from "../../piezas/Cepillado";
import { useCurrentFrame } from "remotion";
export { Camara, Svg, Zoom, clamp, golpe, Etiqueta, type P } from "../Pegue/comun";
export { MAT, dePieR };

export const S = 1.2;
/** Camiseta mostaza, rapado con barba corta, sin casco ni arnés. */
export const YO: Aspecto = { chaqueta: "#D9A32B", chaquetaSombra: "#A67A1B", pantalon: "#2F3A4C", piel: "#C99266", pielSombra: "#A06F48", casco: null, pelo: "#2A1C14", peinado: "rapado", barba: "#2A1C14", arnes: false, manos: "piel" };
export const MANO = { piel: YO.piel!, pielS: YO.pielSombra!, manga: YO.chaqueta! };
export const PIE = "#2FA39A";

export const Yo: React.FC<Omit<PropsEscalador, "quien" | "aspecto">> = (p) => <Escalador quien="joe" aspecto={YO} s={S} pies={PIE} {...p} />;

const canto = (y: number) => (y >= 1060 ? 400 + ((y - 1060) * 80) / 280 : y >= 930 ? 372 + ((y - 930) * 28) / 130 : 372 + ((930 - y) * 30) / 140);
/** La presa rosa (la del ritual) y la presa de pie sucia. */
export const AGARRE = { x: canto(860) + 18, y: 860 }, PIESUCIO = { x: canto(1200) + 10, y: 1200 };
/** Cadera del escalador de pie, frente a la pared. */
export const DE_PIE = { x: 262, y: dePieR(S) };

export const PresaRosa: React.FC<{ brillo?: number }> = ({ brillo = 0 }) => {
  const f = useCurrentFrame();
  return (<g>
    <Resina x={AGARRE.x} y={AGARRE.y} r={34} c={ROSA.c} seed="rosa" magnesio={0.2} />
    {brillo > 0 && <g opacity={brillo}>
      <path d={`M${AGARRE.x - 22} ${AGARRE.y - 22} q14 -10 30 -6`} stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" />
      <g transform={`translate(${AGARRE.x} ${AGARRE.y})`}><Destellos k={brillo} tw={f / 90} tam={16} pts={[[-26, -30, 1.2], [30, -18, 0.9], [4, -44, 0.8], [36, 10, 0.6]]} /></g>
    </g>}
  </g>);
};
/** Presa de pie gris, cubierta de polvo (se ve en varios planos sin subrayarla). */
export const PieSucio: React.FC = () => (
  <g>
    <Resina x={PIESUCIO.x} y={PIESUCIO.y} r={22} c="#8E949C" seed="pie" magnesio={0} />
    {[[-10, -14], [4, -18], [14, -10], [-2, -6]].map(([dx, dy], i) => <circle key={i} cx={PIESUCIO.x + dx} cy={PIESUCIO.y + dy} r={7} fill="#D9DCE0" opacity={0.8} />)}
  </g>
);
