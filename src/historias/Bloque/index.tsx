// E6 v2 «El último pegue» en bloque. Una escena por archivo/grupo; aquí solo se encadenan según guion.json.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Cierre, Noche, Noche23, Rebobina } from "./Noche";
import { Cepillo, Cinta, DesdePaso, Flapper, Lija } from "./Sesion";
import { Movil, TopOut } from "./Final";

const ESCENAS: Record<string, React.FC<P>> = {
  noche: Noche, rebobina: Rebobina, cepillo: Cepillo, cinta: Cinta, desdepaso: DesdePaso, flapper: Flapper,
  lija: Lija, noche23: Noche23, topout: TopOut, movil: Movil, cierre: Cierre,
};

export const Bloque: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9]/g, "");
  return (
    <AbsoluteFill style={{ background: "#08111D" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => {
          const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w));
          return p ? Math.round((p.start - iniS) * fps) : undefined;
        };
        const Comp = ESCENAS[e.visual ?? ""] ?? Noche;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
