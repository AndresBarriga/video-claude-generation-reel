// 3 · Mismo paso, dos escaladores (23–29,7 s): plano amplio del desplome y la imagen se parte. Izquierda: codos doblados (barra PUMP rápida). Derecha: brazos estirados (barra lenta, esqueleto).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Resina } from "../../piezas/Rocodromo";
import { BLOQUES, BarraBloques, Camara, P, Svg, ei } from "./comun";
import { Cuerda, Esc, FondoGym, GY, MANOS, Vig, Zoom, cyDoblado, cyEstirado } from "./Gym";

const Etq: React.FC<{ x: number; y: number; t: string; col: string; o: number }> = ({ x, y, t, col, o }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={52} fill={col} stroke="#050B14" strokeWidth={11} paintOrder="stroke" opacity={o}>{t}</text>
);

const Mundo: React.FC<{ estirado: boolean; f: number; halo: number; huesos: number; codo: string; mismo: number }> = ({ estirado, f, halo, huesos, codo, mismo }) => {
  const cy = estirado ? cyEstirado : cyDoblado, dy = estirado ? 80 : 0;
  return (
    <g>
      <FondoGym fuerte={0.2} />
      {[[470, 1236], [610, 1250], [470, 1316], [610, 1330]].map(([x, y], i) => <Resina key={i} x={x} y={y} r={30} c={GY.ruta} seed={`sf${i}`} magnesio={0.7} />)}
      {mismo > 0 && [MANOS.L, MANOS.R].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={58 + 6 * Math.sin(f * 0.4)} fill="none" stroke="#fff" strokeWidth={8} opacity={mismo} />)}
      <Cuerda perno={[540, 430]} arnes={[540, cy + 14]} flojo={0.5} />
      <Esc cx={540} cy={cy} manoL={MANOS.L} manoR={MANOS.R} pieL={[470, 1236 + dy]} pieR={[610, 1250 + dy]} cara={estirado ? "normal" : "esfuerzo"} f={f} halo={halo} huesos={huesos} codos={{ col: codo, o: 1 }} />
    </g>
  );
};

export const Split: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fFlex = pal("flexionados") ?? 42, fMus = pal("músculo") ?? pal("musculo") ?? 80, fEst = pal("estirados") ?? 130, fEsq = pal("esqueleto") ?? 170;
  const sp = ei(f, 16, 34, 0, 1), ancho = 1 - sp, o = ei(f, 22, 36, 0, 1);
  const mismo = ei(f, 4, 12, 0, 1) * (1 - ei(f, 44, 54, 0, 1));
  const haloL = 0.5 + 0.5 * ei(f, fMus - 4, fMus + 6, 0, 1), huesos = ei(f, fEsq - 10, fEsq + 4, 0, 1);
  const bL = ei(f, 36, d - 6, 0.5, 4.3, (x) => x), bR = ei(f, 36, d - 6, 0.5, 1.4, (x) => x);
  return (
    <Camara d={d} empuje={0.02} foco="50% 52%">
      <Svg>
        <g opacity={ancho} transform="translate(540 1000) scale(0.8) translate(-540 -1000)"><Mundo estirado={false} f={f} halo={0} huesos={0} codo="#FF4A3A" mismo={mismo} /></g>
        <g opacity={sp}>
          <clipPath id="pL"><rect x={270} y={0} width={540} height={1920} /></clipPath><clipPath id="pR"><rect x={270} y={0} width={540} height={1920} /></clipPath>
          <g clipPath="url(#pL)" transform="translate(-270 0)"><Zoom z={1.3} oy={900}><Mundo estirado={false} f={f} halo={haloL} huesos={0} codo="#FF4A3A" mismo={mismo} /></Zoom></g>
          <g clipPath="url(#pR)" transform="translate(270 0)"><Zoom z={1.3} oy={900}><Mundo estirado f={f} halo={0} huesos={huesos} codo="#5FD1C5" mismo={mismo} /></Zoom></g>
          <rect x={534} y={0} width={12} height={1920} fill="#fff" opacity={0.9} />
        </g>
        <Vig />
        <Etq x={270} y={250} t="CODOS DOBLADOS" col="#FF6A5A" o={o * ei(f, fFlex - 6, fFlex + 4, 0, 1)} />
        <Etq x={810} y={250} t="BRAZOS ESTIRADOS" col={BLOQUES[0]} o={o * ei(f, fEst - 6, fEst + 4, 0, 1)} />
        <BarraBloques x={66} y0={420} y1={1220} v={bL} cols={BLOQUES} etiqueta="PUMP" o={o} ancho={54} />
        <BarraBloques x={1014} y0={420} y1={1220} v={bR} cols={BLOQUES} etiqueta="PUMP" o={o} ancho={54} />
      </Svg>
    </Camara>
  );
};
