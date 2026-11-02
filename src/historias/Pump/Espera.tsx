// 6-8 · Cuánto esperar (35,2–47,9 s): repetir a los 5 min (la barra sube más rápido), unos 20 min, «más duro y más largo, más tiempo» y cierre en bucle.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Brazo } from "./Brazo";
import { BLOQUES, BR, Cabeza, Camara, Chip, Cronometro, Fondo, P, PM, Rotulo, Svg, Txt, ei } from "./comun";

export const Truco: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fRep = pal("repitas") ?? 18, fMin = pal("minutos") ?? 60, fVeinte = pal("veinte") ?? 150;
  const agarra = ei(f, fRep, fRep + 12, 0, 1), reposo = ei(f, fVeinte - 30, fVeinte - 8, 0, 1);
  const lejos = 1 - agarra * (1 - reposo);
  const bomba = ei(f, fRep + 4, fMin + 10, 0.1, 0.95) * (1 - reposo) + 0.02 * reposo;
  const min = f < fVeinte - 26 ? 5 : ei(f, fVeinte - 26, fVeinte + 24, 5, 20);
  return (
    <Camara d={d} empuje={0.03} foco="52% 50%">
      <Svg>
        <Fondo />
        <Brazo {...BR} f={f} bomba={bomba} calor={bomba * 0.8} abre={lejos * 0.9} dx={-70 * lejos} dy={90 * lejos} giro={8 * lejos} cierra={agarra * (1 - reposo)} polvo={0.4} />
        <Cabeza x={170} y={470} cara={reposo > 0.6 ? "alivio" : f > fRep ? "esfuerzo" : "normal"} aro={reposo > 0.6 ? BLOQUES[0] : BLOQUES[3]} />
        <Cronometro x={800} y={1170} r={86 + 18 * reposo} min={min} col={reposo > 0.5 ? BLOQUES[0] : "#FF8A4A"} />
        <Chip x={800} y={1318} t={reposo > 0.5 ? "20 MIN" : "5 MIN"} col={reposo > 0.5 ? BLOQUES[0] : "#FF8A4A"} />
        {f > fRep - 2 && f < fVeinte - 34 && <Rotulo f={f} ini={fRep - 2} fin={fVeinte - 34} t="REPITES" y={250} tam={112} col="#FF8A4A" />}
        {f >= fVeinte - 20 && <Rotulo f={f} ini={fVeinte - 20} t="UNOS 20 MIN" y={250} tam={112} col={BLOQUES[0]} />}
      </Svg>
    </Camara>
  );
};

const Fila: React.FC<{ y: number; w: number; max: number; col: string; nombre: string; o?: number }> = ({ y, w, max, col, nombre, o = 1 }) => (
  <g opacity={o}>
    <text x={90} y={y - 34} fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={44} fill="#fff" stroke="#050B14" strokeWidth={9} paintOrder="stroke">{nombre}</text>
    <rect x={90} y={y} width={max} height={74} rx={37} fill="#0B1624" opacity={0.85} stroke="#fff" strokeWidth={4} />
    <rect x={98} y={y + 8} width={Math.max(40, w - 16)} height={58} rx={29} fill={col} />
  </g>
);

export const Dura: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fDuro = pal("duro") ?? 22, fLargo = pal("largo") ?? 50, fTiempo = pal("tiempo") ?? 96;
  const w1 = ei(f, 4, 14, 140, 240) + ei(f, fDuro, fDuro + 10, 0, 220) + ei(f, fLargo, fLargo + 14, 0, 310);
  const w2 = ei(f, fTiempo - 4, fTiempo + 26, 140, w1);
  const col = f < fDuro ? BLOQUES[1] : f < fLargo ? BLOQUES[3] : BLOQUES[4];
  return (
    <Camara d={d} empuje={0.02} foco="50% 50%">
      <Svg>
        <Fondo />
        <Fila y={800} w={w1} max={900} col={col} nombre="INTENTO" />
        <Fila y={1080} w={w2} max={900} col={BLOQUES[0]} nombre="DESCANSO" o={ei(f, fTiempo - 20, fTiempo - 6, 0.35, 1)} />
        <Cabeza x={170} y={470} r={100} cara={f < fDuro ? "normal" : "esfuerzo"} aro={col} />
        {f < fDuro && <Txt x={540} y={620} t="UN INTENTO…" tam={58} col="#fff" />}
        {f >= fDuro && f < fLargo && <Txt x={540} y={620} t="MÁS DURO" tam={58} col="#FF8A4A" />}
        {f >= fLargo && <Txt x={540} y={620} t="MÁS DURO · MÁS LARGO" tam={50} col="#FF6A1F" />}
      </Svg>
    </Camara>
  );
};

export const Cierre: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const temblor = 2.5 * Math.sin(f * 2.4) + 1.2 * Math.sin(f * 4.1);
  return (
    <Camara d={d} empuje={0.05} foco="62% 45%">
      <Svg>
        <Fondo />
        <Brazo {...BR} f={f} bomba={1} calor={0.6} dx={temblor} cierra={1} polvo={0.6} />
        <Rotulo f={f} ini={0} t="TU ANTEBRAZO" y={225} tam={84} />
        <Rotulo f={f} ini={0} t="NO FALLA DE GOLPE" y={320} tam={84} />
        <Rotulo f={f} ini={6} t="MÁNDASELO AL QUE" y={1230} tam={52} col="#FFB070" />
        <Rotulo f={f} ini={6} t="LLEGA A LA FASE 5" y={1294} tam={52} col="#FFB070" />
      </Svg>
    </Camara>
  );
};
