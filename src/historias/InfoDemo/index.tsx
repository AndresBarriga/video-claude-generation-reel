// Muestrario del kit INFO + subtítulos «arriba» (formato fijo). 16 s, 2 s por pieza. `npm run fotograma -- _info <s>`.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { FondoInfo, Cifra, Personitas, Barra, Manometro, Nota, Pasos, Tarjeta, Cronos, Guardar, HojaEnviar, INFO } from "../../piezas/kit";

const K: React.FC<{ children: (k: number) => React.ReactNode }> = ({ children }) => { const f = useCurrentFrame(); return <>{children(f / 12)}</>; };
const PIEZAS: ((k: number) => React.ReactNode)[] = [
  (k) => <Cifra valor={53} despues=" %" etiqueta="escaladores de alto nivel" y={620} k={k} />,
  (k) => <><Cifra valor={53} despues=" %" y={420} k={1} tam={120} /><Personitas marcados={53} y={600} k={k} etiqueta="cada punto = 1 escalador" /></>,
  (k) => <Barra valor={0.33} desde={1} etiqueta="fuerza" marca="2/3" x={540} y={560} k={k} />,
  (k) => <Manometro valor={0.8} etiqueta="presión" y={700} k={k} />,
  (k) => <><Pasos actual={2} k={1} /><Nota texto="dedos tocando" x={540} y={900} x2={700} y2={1150} k={k} /></>,
  (k) => <><Tarjeta ok titulo="Apretada" sub="está bien" x={300} y={620} k={k} /><Tarjeta ok={false} titulo="Dolorosa" sub="no es normal" x={780} y={620} k={k - 0.4} /></>,
  (k) => <Cronos a={137} b={417} y={700} k={k} />,
  (k) => <><Guardar k={k} y={420} /><HojaEnviar k={k - 0.5} para="Al que dice que deben doler" /></>,
];
export const InfoDemo: React.FC<{ datos: Datos }> = ({ datos }) => (
  <AbsoluteFill style={{ background: INFO.fondo }}>
    <FondoInfo />
    {PIEZAS.map((p, i) => <Sequence key={i} from={i * 60} durationInFrames={60}><K>{p}</K></Sequence>)}
    <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
  </AbsoluteFill>
);
