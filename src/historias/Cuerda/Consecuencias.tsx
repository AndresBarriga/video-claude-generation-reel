// 3 · Consecuencias: quemadura en la pantorrilla → sin casco, la cabeza contra la pared → el asegurador, abajo, no siempre la ve.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Svg, golpe, sube, type P } from "./comun";
import { PlanoPerfil, caida } from "./Perfil";
import { Quemadura } from "./Quemadura";

export const Consecuencias: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tB = (pal("si") ?? Math.round(d * 0.35)) - 4, tC = (pal("casco") ?? Math.round(d * 0.8)) - 4;
  if (f < tB) return (
    <Camara d={tB} empuje={0.08} sacudida={f < 20 ? 2 : 0}><Quemadura f={f} /><Etiqueta texto="QUEMADURA" top={230} tam={130} desde={6} /></Camara>
  );
  const enB = f >= tB;
  const k = enB ? sube(f, tB, tB + 8) : 0;
  const vaiven = -175 - 28 * k + (enB ? 6 * Math.sin((f - tB) / 3) * Math.exp(-(f - tB - 8) / 12) * (f > tB + 8 ? 1 : 0) : 4 * Math.sin(f / 9));
  const g = caida(1, vaiven, 150 * k), imp = tB + 8;
  const zoom = enB ? { s: 1.5, cx: g.hx + 40, cy: g.hy + 200, tx: 520, ty: 980 } : { s: 2.3, cx: g.pant[0], cy: g.pant[1], tx: 540, ty: 1000 };
  return (
    <Camara d={d} empuje={0.04} sacudida={enB ? Math.abs(golpe(f, imp, 18)) : 0} entrada={false}>
      <Svg>
        <PlanoPerfil f={f} v={1} dx={150 * k} giro={vaiven} cara={enB && f > imp ? "cerrados" : "dolor"} quemadura={enB ? 1 : sube(f, 4, 16)} zoom={zoom} />
        {enB && f >= imp && f < imp + 3 && <rect width={1080} height={1920} fill="#fff" opacity={0.7} />}
      </Svg>
            <Etiqueta texto={f < tC ? "LA CABEZA, CONTRA LA PARED" : "POR ESO, CASCO"} top={230} tam={92} desde={f < tC ? tB + 2 : tC} />
    </Camara>
  );
};
