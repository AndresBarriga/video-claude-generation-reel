// 1–2 · Cumbre de noche: negro → frontal; Tomek, agarrado a su hombro, mira a la nada: «No te veo». Dilema «¿LO DEJAS?».
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Bocadillo, Camara, CieloNoche, Cuerda, ELI, Etiqueta, INV, Oscuridad, Svg, TOMEK, Ventisca, Zoom, sube, temblor, type P } from "./comun";

export const Cumbre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const luz = sube(f, 2, 14);
  const tD = (pal("bajas") ?? Math.round(d * 0.55)) - 4;
  const z = spring({ frame: f - tD, fps: 30, config: { damping: 14, stiffness: 230 } });
  const tr = temblor(f, 1.2);
  return (
    <Camara d={d} empuje={0.05} entrada={false}>
      <Svg>
        <Zoom s={1.05 + 0.5 * z} cx={520} cy={960} tx={540} ty={1050}>
          <CieloNoche id="cu" />
          {/* arista cimera: cresta de nieve en diagonal, cornisa a la derecha */}
          <path d="M-200 1560 L380 1210 L520 1170 L700 1210 L1280 1580 L1280 2400 L-200 2400 Z" fill={INV.nieveS} />
          <path d="M-200 1560 L380 1210 L520 1170 L700 1210 L1280 1580" stroke={INV.nieve} strokeWidth={10} fill="none" />
          <path d="M520 1130 L560 1400 L470 1700 L380 1180 Z" fill={INV.nieve} opacity={0.5} />
          <path d="M700 1170 L760 1460 L1280 1520 Z" fill={INV.nieveSS} opacity={0.6} />
          <Cuerda d="M420 1160 Q520 1290 630 1170" w={9} />
          <Escalador x={400} y={1190 - 130 * 2.1} quien="joe" aspecto={ELI} s={2.1} pose="pie" cara={f > tD ? "miedo" : "serio"} frontal mira={1} angulos={{ cabeza: 8, brazoA: [40, 60] }} />
          <g transform={`translate(${tr} 0)`}>
            <Escalador x={640} y={1200 - 130 * 2.1} quien="simon" aspecto={TOMEK} s={2.1} pose="pie" cara="serio" mira={1} angulos={{ torso: -12, cabeza: -26, brazoA: [-70, -40], brazoB: [-20, -10], piernaA: [10, -6], piernaB: [-10, 4] }} />
          </g>
          <Ventisca f={f} n={60} />
        </Zoom>
        <Oscuridad x={560} y={980} r={260 + 900 * luz} id="cu" base={0.94} />
        {f < 3 && <rect width={1080} height={1920} fill="#000" />}
      </Svg>
      <Bocadillo texto="No te veo." x={760} y={600} ancho={420} desde={8} tam={72} />
      {f > tD && <Etiqueta texto="¿LO DEJAS?" top={230} tam={150} desde={tD + 2} />}
    </Camara>
  );
};
