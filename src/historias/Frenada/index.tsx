// E79 «Frenada según la pared» (Caer y asegurar 1/3). Ver comun.tsx para el hilo visual.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import type { P } from "./comun";
import { Gancho, Suelta, Desplome, Cta } from "./Desplome";
import { Vertical, RepisaE, Corta } from "./Vertical";
import { Placa } from "./Placa";
import { Cuatro, Tarjeta } from "./Cuatro";
import { GGancho, GArregla } from "./G3Gancho";
import { GGolpe, GAgarra } from "./G3Golpe";
import { GUno, GDos, GTres } from "./G3Pasos";
import { GTarjeta, GCta } from "./G3Cierre";
import { BComba, BCaeMas, BAcompana } from "./G2Uno";
import { BIdea2, BAntes } from "./G2Dos";
import { BIdea3, BRepisa } from "./G2Tres";
import { BTarjeta, BPractica, BCta } from "./G2Cierre";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, suelta: Suelta, cuatro: Cuatro, desplome: Desplome, vertical: Vertical, repisa: RepisaE, corta: Corta, placa: Placa, tarjeta: Tarjeta, cta: Cta,
  // E80 (2/3, lo que no es frenada blanda)
  bComba: BComba, bCaeMas: BCaeMas, bAcompana: BAcompana, bIdea2: BIdea2, bAntes: BAntes, bIdea3: BIdea3, bRepisa: BRepisa, bTarjeta: BTarjeta, bPractica: BPractica, bCta: BCta,
  // E81 (3/3, grigri)
  gGancho: GGancho, gArregla: GArregla, gGolpe: GGolpe, gAgarra: GAgarra, gUno: GUno, gDos: GDos, gTres: GTres, gTarjeta: GTarjeta, gCta: GCta };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Frenada: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#E8F2FC" }}>
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
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
