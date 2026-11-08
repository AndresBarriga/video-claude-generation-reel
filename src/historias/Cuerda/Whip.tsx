// 0 · Whip en el segundo 1: cae, pasa de largo la cinta, la cuerda le engancha la pantorrilla y la voltea POR DEBAJO de la cinta. «Mira tu pie» → zoom a la pierna.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Svg, golpe, sube, type P } from "./comun";
import { PlanoPerfil, caida, H0, CHX, CHY } from "./Perfil";
import { Garabato } from "./Garabato";

/** Estado del whip en el fotograma g (lento = factor de cámara lenta). */
export const whip = (g: number) => {
  const T = 16; // fotograma en que la cuerda se tensa (ya por debajo de la cinta)
  const libre = Math.min(1, Math.max(0, g / T)) ** 2 * 0.86; // caída libre, acelerando
  const tir = g > T ? spring({ frame: g - T, fps: 30, config: { damping: 7, stiffness: 160 } }) : 0; // estiramiento y rebote
  const v = libre + 0.14 * tir;
  const giro = -18 * Math.min(1, g / T) - 157 * (g > T - 2 ? 1 - Math.exp(-(g - T + 2) / 4) : 0);
  return { v, giro, imp: T + 6 };
};

export const Whip: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const { v, giro, imp } = whip(f);
  const sway = f > imp ? 5 * Math.sin((f - imp) / 6) * Math.exp(-(f - imp) / 40) : 0;
  const g = caida(v, giro + sway);
  const tM = (pal("mira") ?? Math.round(d * 0.72)) - 3;
  const zM = spring({ frame: f - tM, fps: 30, config: { damping: 14, stiffness: 220 } });
  const cx = (CHX + g.hx) / 2 - 60, cy = Math.min(g.hy + 80, (CHY + g.hy) / 2 + 160);
  const zoom = { s: 1.25 + 0.85 * zM, cx: cx + (g.pant[0] - cx) * zM, cy: cy + (g.pant[1] - cy) * zM, tx: 540, ty: 800 + 200 * zM };
  return (
    <Camara d={d} empuje={0.03} sacudida={Math.abs(golpe(f, imp, 18))} entrada={false}>
      <Svg>
        <PlanoPerfil f={f} v={v} giro={giro + sway} cara={f < 10 ? "miedo" : "dolor"} zoom={zoom} />
        {f >= imp && f < imp + 2 && <rect width={1080} height={1920} fill="#fff" opacity={0.55} />}
        {f > tM + 6 && <Garabato x={540} y={1020} r={110} f={f - tM - 6} />}
      </Svg>
      <Etiqueta texto={f < tM ? "TE VOLTEA" : "MIRA TU PIE"} top={230} tam={130} desde={f < tM ? 8 : tM} />
    </Camara>
  );
};
export { H0 };
