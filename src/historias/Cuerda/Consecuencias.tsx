// 3 · Consecuencias: quemadura en la pantorrilla → sin casco, la cabeza contra la pared → el asegurador, abajo, no siempre la ve.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Svg, golpe, sube, type P } from "./comun";
import { PlanoPerfil, caida } from "./Perfil";
import { PlanoAbajo } from "../Pierna/Abajo";

export const Consecuencias: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = (pal("peor") ?? Math.round(d * 0.3)) - 6, tC = (pal("quien") ?? Math.round(d * 0.72)) - 4;
  if (f >= tC) return (
    <Camara d={d - tC} empuje={0.06} foco="40% 60%"><PlanoAbajo cara="serio" gesto="quieto" /><Etiqueta texto="NO SIEMPRE LA VE" top={230} tam={88} desde={tC + 2} /></Camara>
  );
  const enB = f >= tB;
  const k = enB ? sube(f, tB, tB + 8) : 0;
  const vaiven = -170 - 28 * k + (enB ? 6 * Math.sin((f - tB) / 3) * Math.exp(-(f - tB - 8) / 12) * (f > tB + 8 ? 1 : 0) : 4 * Math.sin(f / 9));
  const g = caida(1 - 0.55 * k, vaiven, 110 * k), imp = tB + 8;
  const zoom = enB ? { s: 1.5, cx: g.hx + 40, cy: g.hy + 200, tx: 520, ty: 980 } : { s: 2.3, cx: g.pant[0], cy: g.pant[1], tx: 540, ty: 1000 };
  return (
    <Camara d={d} empuje={0.04} sacudida={enB ? Math.abs(golpe(f, imp, 18)) : 0} entrada={false}>
      <Svg>
        <PlanoPerfil f={f} v={1 - 0.55 * k} dx={110 * k} giro={vaiven} cara={enB && f > imp ? "cerrados" : "dolor"} quemadura={enB ? 1 : sube(f, 4, 16)} zoom={zoom} />
        {enB && f >= imp && f < imp + 3 && <rect width={1080} height={1920} fill="#fff" opacity={0.7} />}
      </Svg>
      {!enB && <Etiqueta texto="QUEMADURA DE CUERDA" top={230} tam={92} desde={3} />}
      {enB && <Etiqueta texto="LA CABEZA, CONTRA LA PARED" top={230} tam={92} desde={tB + 2} />}
    </Camara>
  );
};
