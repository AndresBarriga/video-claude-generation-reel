// 3 · «En mi roco esto es un seis A.» (Nico de cerca, chulo, ya bajo el desplome) → aquí, otro deporte (la cámara se aleja: un techo enorme y él diminuto).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Cielo } from "../Pegue/comun";
import { CrashPad } from "../../piezas/CrashPad";
import { Camara, Etiqueta, Nico, Partida, Planos, Svg, Zoom, clamp, type P } from "./comun";

/** v3: es el gancho. Fotograma 0 = el desplome entero con Nico diminuto y chulo; rótulo a los 0,5 s; luego su cara de miedo. */
export const Roco: React.FC<P> = (p) => <Partida p={p} dice={(d) => <><Techo d={d} modo="ancho" /><Etiqueta texto="«Es un quinto»" top={330} tam={118} desde={15} /></>} significa={(d) => <Techo d={d} modo="cara" />} />;

/** El primer fotograma (también el final del bucle, dentro del móvil). */
export const PlanoDesplome: React.FC = () => <TechoSvg modo="ancho" k={1} />;

const SU = 1500;
type Modo = "dice" | "abre" | "cara" | "ancho";
const Techo: React.FC<{ d: number; modo: Modo }> = ({ d, modo }) => {
  const f = useCurrentFrame();
  const k = modo === "dice" ? 0 : modo === "ancho" || modo === "cara" ? 1 : interpolate(f, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Camara d={d} empuje={modo === "ancho" ? 0.14 : 0.04} entrada={modo === "dice"}>
      <Svg><TechoSvg modo={modo} k={k} fr={f} /></Svg>
    </Camara>
  );
};
const TechoSvg: React.FC<{ modo: Modo; k: number; fr?: number }> = ({ modo, k, fr = 0 }) => {
  const cara = modo === "cara";
  const z = 3 + (1 - 3) * k, cx = 744 + (540 - 744) * k, cy = 1290 + (1100 - 1290) * k;
  return (<g transform={cara ? `translate(540 860) scale(3.4) translate(-830 -1110)` : `translate(540 1100) scale(${z}) translate(${-cx} ${-cy})`}>
        <Cielo h={0.4} id="techo" sol={false} />
        <path d={`M-300 ${SU} L1400 ${SU} L1400 2400 L-300 2400 Z`} fill="#4D4A40" />
        {/* desplome gigante: entra por la derecha y se tumba por encima de la cabeza */}
        <path d={`M1400 ${SU} L980 ${SU} Q900 1100 700 700 Q520 420 160 330 Q40 300 -40 360 L-60 140 L1400 -100 Z`} fill="#6E6670" stroke="#141B26" strokeOpacity={0.3} strokeWidth={8} />
        <path d={`M-60 360 Q140 300 360 380 Q600 480 760 760 Q860 960 900 1300`} stroke="#957F78" strokeWidth={30} fill="none" opacity={0.6} />
        {[[90, 380], [330, 440], [560, 580], [730, 820], [850, 1080], [930, 1330]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={10} fill="#4B4150" /><path d={`M${x - 8} ${y - 6} q8 -6 16 0`} stroke="#F4F7FA" strokeWidth={4} opacity={0.8} /></g>)}
        <CrashPad x={620} y={SU - 26} w={240} grosor={26} />
        {/* colgado de la presa del techo, pies sueltos, balanceándose */}
        <g transform={`rotate(${Math.sin(fr / 6) * 4} 850 1080)`}><Nico x={821} y={1226} s={0.8} pose="escalando" cara={cara ? "miedo" : "esfuerzo"} angulos={{ piernaA: [20 + Math.sin(fr / 4) * 14, -10], piernaB: [-10 - Math.sin(fr / 4) * 14, 0], cabeza: cara ? 10 : -20 }} /></g>
      </g>
  );
};
