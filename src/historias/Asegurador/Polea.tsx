// 2 · La primera cinta hace de polea: la cuerda se ilumina (él → cinta → tú) y ella sube; lupa sobre la cinta.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, CINTA1, Caida, Camara, Chip, Encuadre, Fondo, Publico, Svg, aPantalla, clamp, ei, estado, arnes, ELLA, ENC, SUELO, type P } from "./comun";

export const Polea: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fCinta = pal("cinta") ?? 30, fArriba = pal("arriba") ?? 90;
  const k = ei(f, 0, fArriba + 8, 0.38, 1, Easing.inOut(Easing.cubic));
  const brillo = interpolate(f, [0, d], [0, 2.2], clamp);
  const st = estado(k);
  const lupa = ei(f, fCinta - 4, fCinta + 8, 0, 1);
  const [px] = arnes(st.mx, st.my, ELLA.s);
  const LX = 300, LY = 420, cs = aPantalla(CINTA1.x, CINTA1.y);
  const polvo = st.u > 0.02 ? Math.min(1, st.u * 3) : 0;
  return (
    <Camara d={d} empuje={0.05} foco="60% 50%" entrada={false}>
      <Svg>
        <Encuadre>
          <Fondo />
          <Caida k={k} brillo={brillo} publico={<Publico r="miedo" />} />
          {polvo > 0 && [0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={px - 40 + i * 16} cy={SUELO - 10 - polvo * (20 + i * 9)} r={10 + polvo * 16} fill={C.magnesio} opacity={0.45 * (1 - polvo * 0.7)} />)}
        </Encuadre>
        {lupa > 0 && <g opacity={lupa}>
          <path d={`M${LX + 120} ${LY + 120} L${cs[0] - 20} ${cs[1] - 20}`} stroke="#F4F7FA" strokeWidth={6} opacity={0.6} />
          <circle cx={LX} cy={LY} r={180} fill="#0B1624" stroke="#F4F7FA" strokeWidth={8} />
          <clipPath id="lupaA"><circle cx={LX} cy={LY} r={172} /></clipPath>
          <g clipPath="url(#lupaA)"><g transform={`translate(${LX} ${LY}) scale(${ENC.s * 2.6}) translate(${-CINTA1.x} ${-CINTA1.y - 20})`}><Fondo /><Caida k={k} brillo={brillo} /></g>
            <path d={`M${LX - 70} ${LY + 20} l0 90 m-22 -24 l22 24 l22 -24`} stroke="#5FD1C5" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>}
        <Chip x={LX} y={LY + 220} t="PRIMERA CINTA" o={lupa} col="#FF6A1F" />
      </Svg>
    </Camara>
  );
};
