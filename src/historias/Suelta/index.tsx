// E47 «Llevas cuerda. Tu cerebro no lo sabe» (Miedo 2). Una escena por archivo; aquí solo se encadenan.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Gancho } from "./Gancho";
import { YaVoy } from "./YaVoy";
import { Idea } from "./Idea";
import { Carrera } from "./Carrera";
import { Cae } from "./Cae";
import { Otra } from "./Otra";
import { Cierre } from "./Cierre";

const ESCENAS: Record<string, React.FC<P>> = { mano: Gancho, yavoy: YaVoy, idea: Idea, carrera: Carrera, cae: Cae, otra: Otra, cierre: Cierre };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Suelta: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#081120" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Gancho;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
