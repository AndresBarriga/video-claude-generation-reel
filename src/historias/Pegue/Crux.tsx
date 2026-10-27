// Gancho y cierre en bucle: alguien colgado del paso clave, estirándose hacia la presa, con el sol en el horizonte.
// Apertura: tú (rojo) al atardecer, pegue 14. Cierre: tu compañero (azul) de noche con frontal, pegue 1.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Escalador, type Quien } from "../../piezas/Escalador";
import { Camara, Cielo, Cuerda, Etiqueta, Pared, Pegues, Svg, Zoom, borde, cadera, enCara, type P } from "./comun";

const S = 1.15;
export const PlanoCrux: React.FC<{ d: number; quien: Quien; h: number; frontal?: boolean; titulo?: string; pegue: number; caida?: number }> = ({ d, quien, h, frontal, titulo, pegue, caida = 0 }) => {
  const f = useCurrentFrame();
  // se estira hacia la presa de arriba y no llega: avanza y retrocede, con temblor
  const estira = 0.5 + 0.5 * Math.sin(f / 9);
  const tiembla = (k: number) => Math.sin(f * 2.1 + k) * 2.2 + Math.sin(f * 3.9 + k) * 1.2;
  const objetivo = 545, hueco = 58 - estira * 30;
  const c = cadera(enCara(objetivo) - 6, objetivo + hueco, S);
  const chapa = 740, cx = borde(chapa) + 10, cy = chapa + 50;
  return (
    <Camara d={d} empuje={0.07} foco="55% 45%">
      <Svg>
        <Cielo h={h} id={`cx${quien}`} />
        {h > 0.9 && Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 900} r={1.5 + random(`sr${i}`) * 2.5} fill="#fff" opacity={0.3 + 0.5 * random(`so${i}`)} />)}
        <Zoom s={1.75} cx={c.x + 40} cy={c.y - 160} tx={600} ty={800}>
          <Pared h={h} marcas={8} />
          <Cuerda d={`M${c.x} ${c.y + caida} Q${c.x + 30} ${(c.y + cy) / 2 + 40} ${cx} ${cy} L${cx - 40} 1960`} />
          <Escalador x={c.x + tiembla(1) - caida * 0.2} y={c.y + tiembla(2) + caida} quien={quien} pose="escalando" poseB="cayendo" t={Math.min(1, caida / 120)} s={S} cara={caida > 20 ? "dolor" : "esfuerzo"} frontal={frontal}
            angulos={{ brazoA: [158 - estira * 8, 176], brazoB: [110, 150], piernaA: [64 + tiembla(3) * 2, -14], piernaB: [16, -24 + tiembla(4) * 2], cabeza: -34 }} />
        </Zoom>
      </Svg>
      <Pegues n={pegue} />
      <Etiqueta texto={titulo} />
    </Camara>
  );
};

export const Crux: React.FC<P> = ({ e, d }) => <PlanoCrux d={d} quien="joe" h={0.78} titulo={e.titulo} pegue={14} />;
export const CruxNoche: React.FC<P> = ({ e, d }) => <PlanoCrux d={d} quien="simon" h={1} frontal titulo={e.titulo} pegue={1} />;

/** Inicio alternativo D: cámara rápida de 14 pegues en el mismo paso mientras cae el sol; se congela en el 14 con «¿El último?». */
export const Contador: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const fin = Math.max(20, (pal("Y") ?? Math.round(d * 0.55)) - 2);
  const k = interpolate(f, [0, fin], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = 1 + Math.floor(k * 13);
  const ciclo = (f % 7) / 7, cae = f < fin ? Math.max(0, ciclo - 0.45) * 2 * 260 : 0;
  return <PlanoCrux d={d} quien="joe" h={0.05 + 0.73 * k} titulo={f >= fin ? e.titulo : undefined} pegue={n} caida={cae} />;
};
