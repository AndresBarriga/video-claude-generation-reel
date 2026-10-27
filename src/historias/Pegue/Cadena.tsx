// «Y a veces... sale.» Lanza: se agacha (anticipación) y salta a la presa de arriba. Cadena: la coge, chapa la reunión y celebra colgado.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { C, CADENA, CRUX, Camara, Cielo, Cuerda, Pared, Svg, Zoom, borde, cadera, clamp, enCara, golpe, type P } from "./comun";

const S = 1.15, H = 0.8;
const base = cadera(enCara(CRUX) - 6, CRUX + 10, S);
const arriba = cadera(enCara(545) - 6, 545 + 6, S);
const ch = 740, rx = borde(ch) + 10, ry = ch + 50;

export const Lanza: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const baja = interpolate(f, [0, d * 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const sube = interpolate(f, [d * 0.72, d], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const x = base.x - baja * 8 + sube * (arriba.x - base.x), y = base.y + baja * 34 - sube * (base.y - arriba.y + 34 + 30);
  return (
    <Camara d={d} empuje={0.12} foco="55% 40%" entrada={false}>
      <Svg>
        <Cielo h={H} id="lan" />
        <Zoom s={2} cx={base.x + 40} cy={base.y - 150} tx={600} ty={800}>
          <Pared h={H} marcas={8} />
          <Cuerda d={`M${x} ${y} Q${x + 30} ${(y + ry) / 2 + 30} ${rx} ${ry} L${rx - 40} 2000`} />
          <Escalador x={x} y={y} quien="joe" pose="escalando" s={S} cara={sube > 0 ? "esfuerzo" : "cerrados"}
            angulos={{ brazoA: [150 - baja * 25 + sube * 30, 175 - baja * 60 + sube * 60], brazoB: [120, 160 - baja * 30], piernaA: [60 + baja * 30, -10 - baja * 30], cabeza: -10 - sube * 30 }} />
        </Zoom>
      </Svg>
    </Camara>
  );
};

export const Cadena: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const tClic = 6;
  const cuelga = interpolate(f, [tClic + 4, tClic + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const x = arriba.x - cuelga * 40, y = arriba.y + cuelga * 70;
  const anillo = { x: borde(CADENA) + 34, y: CADENA + 56 };
  const flash = interpolate(f, [tClic, tClic + 1, tClic + 6], [0, 0.5, 0], clamp);
  const cuerda = f < tClic ? `M${x} ${y} Q${x + 30} ${(y + ry) / 2 + 30} ${rx} ${ry} L${rx - 40} 2000` : `M${x} ${y} L${anillo.x} ${anillo.y} L${rx + 20} ${ry + 200} L${rx - 40} 2000`;
  return (
    <Camara d={d} empuje={0.05} foco="55% 35%" entrada={false}>
      <Svg>
        <Cielo h={H} id="cad" />
        <Zoom s={2} cx={base.x + 40} cy={base.y - 150} tx={600 + golpe(f, 1, 12)} ty={800 + (base.y - arriba.y) * 2 * 0.55}>
          <Pared h={H} marcas={8} />
          <Cuerda d={cuerda} />
          <Escalador x={x} y={y} quien="joe" pose="escalando" poseB="celebrando" t={cuelga} s={S} cara={cuelga > 0.3 ? "alivio" : "esfuerzo"} />
        </Zoom>
        <rect width={1080} height={1920} fill={C.luz} opacity={flash} />
      </Svg>
    </Camara>
  );
};
