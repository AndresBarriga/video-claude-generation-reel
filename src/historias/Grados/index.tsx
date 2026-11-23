// E77 «Rocódromo vs roca: por qué bajas grados». Escenas en archivos: Inicio (gancho, razones), Uno, Dos, Tres, Final (plan, CTA).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import type { P } from "./comun";
import { Gancho, Razones3 } from "./Inicio";
import { Uno } from "./Uno";
import { Dos } from "./Dos";
import { Tres } from "./Tres";
import { Plan, Cta } from "./Final";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, razones: Razones3, uno: Uno, dos: Dos, tres: Tres, plan: Plan, cta: Cta };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
export const Grados: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig(), n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#FDF3E3" }}>
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
