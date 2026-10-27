// Segundo gancho: el experimento. Plataforma elevadora a 3,5 m; una investigadora le da con el martillo de reflejos en el talón.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { ASEG, CIENTIFICA, Camara, Etiqueta, Fuente, Svg, type P } from "./comun";

const S = 1.75, SUELO = 1640, PLAT = 900, X0 = 60, X1 = 760;
export const Laboratorio: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const ciclo = f % 36, golpeo = ciclo < 6 ? 1 - ciclo / 6 : 0; // martillazo cada 1,2 s
  const patada = ciclo >= 4 && ciclo < 14 ? Math.sin(((ciclo - 4) / 10) * Math.PI) : 0;
  const tijera = (y0: number, y1: number) => `M${X0 + 40} ${y0} L${X1 - 40} ${y1} M${X1 - 40} ${y0} L${X0 + 40} ${y1}`;
  const sx = X1 - 90, sy = PLAT - 136 * S; // cadera del sujeto
  const talon = { x: sx - 14 * S, y: PLAT - 22 };
  return (
    <Camara d={d} empuje={0.05}>
      <Svg>
        <rect width={1080} height={1920} fill="#C9D3DC" />
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={0} y={i * 260} width={1080} height={4} fill="#B4C0CB" />)}
        <rect y={SUELO} width={1080} height={400} fill="#8E9AA6" />
        <g stroke="#4A5563" strokeWidth={16} strokeLinecap="round">
          <path d={tijera(PLAT + 30, PLAT + 300)} /><path d={tijera(PLAT + 300, PLAT + 570)} /><path d={tijera(PLAT + 570, SUELO - 20)} />
        </g>
        <rect x={X0} y={SUELO - 30} width={X1 - X0} height={30} rx={6} fill="#3A4452" />
        <rect x={X0} y={PLAT} width={X1 - X0} height={34} rx={6} fill="#5A6676" />
        <rect x={X0} y={PLAT + 34} width={X1 - X0} height={10} fill="#F2C230" />
        <g stroke="#0B1624" strokeWidth={6}><path d={`M1010 ${PLAT} L1010 ${SUELO}`} /><path d={`M985 ${PLAT} L1035 ${PLAT} M985 ${SUELO} L1035 ${SUELO}`} /></g>
        <Escalador x={X1 - 470} y={PLAT - 70 * S} quien="joe" look={CIENTIFICA} s={S} pose="agachado" cara="normal"
          angulos={{ brazoA: [78 - golpeo * 25, 96 - golpeo * 40], cabeza: 20 }} />
        <Escalador x={sx} y={sy} quien="simon" look={ASEG} s={S} cara="miedo" sombra={PLAT}
          angulos={{ torso: -10, cabeza: 26, brazoA: [50, 30], brazoB: [-40, -20], piernaA: [8, 0], piernaB: [-8 + patada * 30, 0 + patada * 60] }} />
        {/* martillo de reflejos */}
        <g transform={`translate(${talon.x} ${talon.y}) rotate(${-20 - golpeo * 25})`}>
          <rect x={-250} y={-7} width={250} height={14} rx={7} fill="#3A4452" />
          <path d="M-10 -32 L20 -20 L20 20 L-10 32 Z" fill="#C8402E" stroke="#0B1624" strokeWidth={4} />
        </g>
      </Svg>
      <Etiqueta texto={e.titulo} top={(PLAT + SUELO) / 2 - 140} tam={110} />
      <Fuente texto={e.fuente ?? ""} />
    </Camara>
  );
};
