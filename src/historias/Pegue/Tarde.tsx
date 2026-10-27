// «Por la tarde te la sabes de memoria, pero ya no te quedan dedos»: 18:30, todas las presas marcadas. La mano resbala en el paso clave.
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { C, CRUX, Camara, Cielo, Cuerda, Etiqueta, Pared, Pegues, Svg, Zoom, borde, cadera, clamp, enCara, golpe, type P } from "./comun";

export const Tarde: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const tMem = pal("memoria,") ?? Math.round(d * 0.35);
  const tDed = pal("dedos.") ?? Math.round(d * 0.75);
  const marcas = interpolate(f, [0, tMem + 6], [3, 8], clamp);
  const S = 1.15, c0 = cadera(enCara(CRUX) - 6, CRUX + 10, S);
  const resbala = interpolate(f, [tDed - 14, tDed], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const caeT = interpolate(f, [tDed, tDed + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const reb = f > tDed + 8 ? Math.sin((f - tDed - 8) / 3) * 16 * Math.exp(-(f - tDed - 8) / 10) : 0;
  const x = c0.x - caeT * 40, y = c0.y + resbala * 18 + caeT * 260 + reb;
  const tiembla = Math.sin(f * 2.3) * 3 * (0.3 + resbala);
  const ch = 740, rx = borde(ch) + 10, ry = ch + 50;
  const hx = enCara(CRUX), hy = CRUX - 8;
  return (
    <Camara d={d} empuje={0.08} foco="55% 40%">
      <Svg>
        <Cielo h={0.62} id="tar" />
        <Zoom s={1.9} cx={c0.x + 40} cy={c0.y - 140} tx={600} ty={820}>
          <g transform={`translate(${golpe(f, tDed + 8, 9)} 0)`}>
            <Pared h={0.62} marcas={marcas} />
            <Cuerda d={`M${x} ${y} Q${(x + rx) / 2 + 20} ${(y + ry) / 2 + 30} ${rx} ${ry} L${rx - 40} 2000`} />
            <Escalador x={x + tiembla} y={y} quien="joe" pose="escalando" poseB="cayendo" t={caeT} s={S}
              cara={resbala > 0.2 ? "dolor" : "esfuerzo"}
              angulos={caeT > 0 ? undefined : { brazoA: [150 + resbala * 25, 175 + resbala * 10], cabeza: -24 }} />
            {/* nube de magnesio al resbalar */}
            {f > tDed - 6 && Array.from({ length: 14 }).map((_, i) => {
              const k = Math.max(0, f - tDed + 6);
              const a = random(`m${i}`) * Math.PI * 2, r = k * (2 + random(`mr${i}`) * 3);
              return <circle key={i} cx={hx + Math.cos(a) * r} cy={hy + Math.sin(a) * r * 0.6 + k * 1.5} r={5 + random(`ms${i}`) * 8 + k * 0.3} fill={C.magnesio} opacity={Math.max(0, 0.8 - k / 22)} />;
            })}
          </g>
        </Zoom>
      </Svg>
      <Pegues n={9} />
      <Etiqueta texto={e.titulo} />
    </Camara>
  );
};
