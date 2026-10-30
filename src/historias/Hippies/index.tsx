// E36 «Los hippies del avión de marihuana». Una escena por archivo; aquí solo se encadenan.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import { C, Pelicula70, type P } from "./comun";
import { Avion, Cierre } from "./Avion";
import { Campamento } from "./Campamento";
import { Sobras } from "./Sobras";
import { Lsd } from "./Lsd";
import { Dilema } from "./Dilema";
import { Bajan } from "./Bajan";
import { Pose } from "./Pose";
import { Bloque, Util } from "./Bloque";
import { Loco } from "./Loco";
import { SinUnDuro } from "./SinUnDuro";

const ESCENAS: Record<string, React.FC<P>> = { avion: Avion, campamento: Campamento, sobras: Sobras, lsd: Lsd, dilema: Dilema, bajan: Bajan, pose: Pose, bloque: Bloque, util: Util, cierre: Cierre, loco: Loco, sinunduro: SinUnDuro };

export const Hippies: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
  return (
    <AbsoluteFill style={{ background: "#2A1A0A" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion + 0.5 : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Avion;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Pelicula70 />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
