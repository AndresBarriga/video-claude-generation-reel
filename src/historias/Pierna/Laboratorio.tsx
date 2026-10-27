// Segundo gancho: el experimento. Plataforma elevadora a 3,5 m; una investigadora le da con el martillo de reflejos en el talón.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { CIENTIFICA, Camara, Etiqueta, Fuente, SUJETO, Svg, type P } from "./comun";

const S = 1.3, SUELO = 1600, PLAT = 760, X0 = 120, X1 = 700;
export const Laboratorio: React.FC<P> = ({ e, d }) => {
  const f = useCurrentFrame();
  const ciclo = f % 36, golpeo = ciclo < 6 ? 1 - ciclo / 6 : 0; // martillazo cada 1,2 s
  const patada = ciclo >= 4 && ciclo < 14 ? Math.sin(((ciclo - 4) / 10) * Math.PI) : 0;
  const tijera = (y0: number, y1: number) => `M${X0 + 40} ${y0} L${X1 - 40} ${y1} M${X1 - 40} ${y0} L${X0 + 40} ${y1}`;
  const sx = X1 - 90, sy = PLAT - 136 * S; // cadera del sujeto
  const talon = { x: sx - 20 * S, y: PLAT - 18 };
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
        <g stroke="#0B1624" strokeWidth={6}><path d={`M890 ${PLAT} L890 ${SUELO}`} /><path d={`M865 ${PLAT} L915 ${PLAT} M865 ${SUELO} L915 ${SUELO}`} /></g>
        <Escalador x={X1 - 330} y={PLAT - 70 * S} quien="joe" look={CIENTIFICA} s={S} pose="agachado" cara="normal"
          angulos={{ brazoA: [78 - golpeo * 25, 96 - golpeo * 40], cabeza: 20 }} />
        <Escalador x={sx} y={sy} quien="simon" look={SUJETO} s={S} cara="miedo" sombra={PLAT}
          angulos={{ torso: -10, cabeza: 26, brazoA: [50, 30], brazoB: [-40, -20], piernaA: [8, 0], piernaB: [-8 + patada * 30, 0 + patada * 60] }} />
        {/* martillo de reflejos */}
        <g transform={`translate(${talon.x} ${talon.y}) rotate(${-20 - golpeo * 25})`}>
          <rect x={-170} y={-5} width={170} height={10} rx={5} fill="#3A4452" />
          <path d="M-6 -22 L14 -14 L14 14 L-6 22 Z" fill="#C8402E" />
        </g>
      </Svg>
      <Etiqueta texto={e.titulo} top={300} tam={130} />
      <Fuente texto={e.fuente ?? ""} />
    </Camara>
  );
};
