// E56 «Vía ferrata»: una escena por archivo; aquí se encadenan con voz, sonido, grano y subtítulos.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { EscaleraCielo } from "./Escalera";
import { Disipador } from "./Disipador";
import { Embalse } from "./Embalse";
import { Cresta } from "./Cresta";
import { Caida } from "./Caida";
import { Cambia } from "./Cambia";
import { Plan } from "./Plan";
const Final: React.FC<P> = (p) => <EscaleraCielo {...p} final />;

const ESCENAS: Record<string, React.FC<P>> = { escalera: EscaleraCielo, embalse: Embalse, cresta: Cresta, caida: Caida, disipador: Disipador, cambia: Cambia, plan: Plan, final: Final };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Ferrata: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#2F7FD0" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? EscaleraCielo;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
