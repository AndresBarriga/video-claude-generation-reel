// «O lo encadenas, o sale peor que todos»: pantalla partida por la cuerda. Arriba, colgado de la cadena celebrando; abajo, cae en el primer paso.
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTexto } from "../../tema";
import { Escalador } from "../../piezas/Escalador";
import { C, CADENA, Camara, Cielo, Cuerda, Pared, Svg, Zoom, borde, cadera, clamp, enCara, golpe, type P } from "./comun";

const Rotulo: React.FC<{ texto: string; top: number; on: number }> = ({ texto, top, on }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: on, transform: `scale(${0.85 + 0.15 * on})` }}>
    <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 50, color: C.blanco, background: "rgba(5,11,20,.75)", borderRadius: 40, padding: "8px 30px" }}>{texto}</div>
  </div>
);

export const Dos: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tA = pal("encadenas,") ?? 6, tB = pal("peor") ?? Math.round(d * 0.45);
  const onA = spring({ frame: f - tA, fps, config: { damping: 12, stiffness: 170 } });
  const onB = spring({ frame: f - tB, fps, config: { damping: 12, stiffness: 170 } });
  // arriba: colgado bajo la cadena, brazos arriba
  const S = 1.15, ax = borde(CADENA) - 50, ay = CADENA + 200 + Math.sin(f / 7) * 6;
  // abajo: en la segunda presa, suelta y cae
  const hB = 1360, cb = cadera(enCara(hB) - 6, hB + 30, S);
  const caeT = interpolate(f, [tB, tB + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const rebote = f > tB + 8 ? Math.sin((f - tB - 8) / 3) * 18 * Math.exp(-(f - tB - 8) / 10) : 0;
  const by = cb.y + caeT * 150 + rebote, bx = cb.x - caeT * 40;
  const chB = 1290, rx = borde(chB) + 10, ry = chB + 50;
  return (
    <Camara d={d} empuje={0.04}>
      <Svg>
        <defs>
          <clipPath id="arriba"><rect x={0} y={0} width={1080} height={955} /></clipPath>
          <clipPath id="abajo"><rect x={0} y={965} width={1080} height={955} /></clipPath>
        </defs>
        <g clipPath="url(#arriba)" opacity={0.55 + 0.45 * Math.max(onA, 1 - onB * 0.6)}>
          <g transform="translate(0 -480)"><Cielo h={0.8} id="dosA" /></g>
          <Zoom s={1.45} cx={ax + 40} cy={ay - 120} tx={560} ty={560}>
            <Pared h={0.8} marcas={8} chapas={false} />
            <Cuerda d={`M${ax} ${ay} L${borde(CADENA) + 34} ${CADENA + 56}`} />
            <Escalador x={ax} y={ay} quien="joe" pose="colgado" poseB="celebrando" t={onA} s={S} cara={onA > 0.5 ? "alivio" : "esfuerzo"} />
          </Zoom>
        </g>
        <g clipPath="url(#abajo)" opacity={0.45 + 0.55 * onB}>
          <g transform="translate(0 400)"><Cielo h={0.88} id="dosB" /></g>
          <Zoom s={1.35} cx={cb.x + 40} cy={cb.y - 120} tx={560} ty={1010}>
            <g transform={`translate(${golpe(f, tB + 8, 10)} 0)`}>
              <Pared h={0.88} marcas={8} />
              <Cuerda d={`M${bx} ${by} Q${(bx + rx) / 2} ${(by + ry) / 2 + 30 * (1 - caeT)} ${rx} ${ry} L${rx - 50} 2200`} />
              <Escalador x={bx} y={by} quien="joe" pose="escalando" poseB="cayendo" t={caeT} s={S} cara={caeT > 0.3 ? "dolor" : "esfuerzo"} />
            </g>
          </Zoom>
        </g>
        <Cuerda d="M-20 960 Q540 975 1100 960" w={12} />
      </Svg>
      <Rotulo texto="Lo encadenas" top={230} on={onA} />
      <Rotulo texto="Peor que todos" top={1000} on={onB} />
    </Camara>
  );
};
