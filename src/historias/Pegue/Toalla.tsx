// «Lo que más ayuda no es la fuerza. Es haber tirado la toalla: dejas de apretar de más.»
// 1) Al pie de vía tira la toalla (literal). 2) En el paso clave, el temblor desaparece y la cara se relaja.
import React from "react";
import { Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { CRUX, Camara, Cielo, Cuerda, Pared, SUELO, Suelo, Svg, Zoom, borde, cadera, clamp, enCara, enSuelo, type P } from "./comun";

const H = 0.76;
export const Toalla: React.FC<P> = ({ d, pal }) => {
  const tTira = (pal("tirado") ?? Math.round(d * 0.45)) - 4;
  const tCalma = pal("dejas") ?? Math.round(d * 0.7);
  return (<>
    <Sequence durationInFrames={tCalma}><Tira tTira={tTira} tCalma={tCalma} /></Sequence>
    <Sequence from={tCalma}><Calma d={d - tCalma} fApretar={(pal("apretar") ?? tCalma + 15) - tCalma} /></Sequence>
  </>);
};

const Tira: React.FC<{ tTira: number; tCalma: number }> = ({ tTira, tCalma }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const S = 1.25, jx = 560, jy = enSuelo(S);
  const lanza = spring({ frame: f - tTira, fps, config: { damping: 16, stiffness: 120 } });
  const vuelo = interpolate(f, [tTira, tTira + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const hx = jx + 60 * S, hy = jy - 230 * S; // mano con la toalla, arriba
  const tx = interpolate(vuelo, [0, 1], [hx, 270]), ty = interpolate(vuelo, [0, 0.4, 1], [hy, hy - 120, SUELO - 6]);
  const giro = vuelo * 260;
  return (
    <Camara d={tCalma} empuje={0.06} foco="50% 60%">
      <Svg>
        <Cielo h={H} id="toa" />
        <Zoom s={1.35} cx={500} cy={1420} tx={540} ty={990}>
          <Pared h={H} marcas={8} />
          <Suelo h={H} />
          <Escalador x={800} y={enSuelo(1.15)} quien="simon" pose="pie" s={1.15} mira={-1} sombra={SUELO + 4} cara={lanza > 0.5 ? "miedo" : "normal"} angulos={{ brazoA: [120, 150], brazoB: [30, 90] }} />
          <Escalador x={jx} y={jy} quien="joe" pose="pie" s={S} sombra={SUELO + 4} cara={lanza > 0.3 ? "cerrados" : "dolor"}
            angulos={{ brazoA: [interpolate(lanza, [0, 1], [165, 40]), interpolate(lanza, [0, 1], [175, 20])], cabeza: lanza * 18, torso: lanza * 14 }} />
          <g transform={`translate(${tx} ${ty}) rotate(${giro})`}>
            <rect x={-46} y={-26} width={92} height={52} rx={12} fill="#EDE8DE" />
            <rect x={-46} y={-8} width={92} height={14} fill="#1F6E7E" />
          </g>
        </Zoom>
      </Svg>
    </Camara>
  );
};

/** Paso clave sin apretar: el temblor baja a cero y la cara pasa de esfuerzo a calma. */
const Calma: React.FC<{ d: number; fApretar: number }> = ({ d, fApretar }) => {
  const f = useCurrentFrame();
  const suelta = interpolate(f, [fApretar - 4, fApretar + 12], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tiembla = (k: number) => (Math.sin(f * 2.4 + k) * 4 + Math.sin(f * 4.1 + k) * 2) * (1 - suelta);
  const S = 1.15, c = cadera(enCara(CRUX) - 6, CRUX + 10, S);
  const ch = 740, rx = borde(ch) + 10, ry = ch + 50;
  return (
    <Camara d={d} empuje={0.06} foco="55% 40%">
      <Svg>
        <Cielo h={H + 0.02} id="cal" />
        <Zoom s={2} cx={c.x + 40} cy={c.y - 150} tx={600} ty={800}>
          <Pared h={H + 0.02} marcas={8} />
          <Cuerda d={`M${c.x} ${c.y} Q${c.x + 30} ${(c.y + ry) / 2 + 30} ${rx} ${ry} L${rx - 40} 2000`} />
          <Escalador x={c.x + tiembla(1)} y={c.y + tiembla(2)} quien="joe" pose="escalando" s={S} cara={suelta > 0.5 ? "cerrados" : "esfuerzo"}
            angulos={{ brazoA: [150 + suelta * 6, 175 - suelta * 25], brazoB: [120 - suelta * 10, 160 - suelta * 30], cabeza: -24 + suelta * 14, piernaA: [60 + tiembla(3), -10] }} />
        </Zoom>
      </Svg>
    </Camara>
  );
};
