// E69 «Pump: no estás flojo (3 cosas)», formato de las referencias. Una escena por archivo; aquí se encadenan y van los candados 1-2-3.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { Pasos } from "../../piezas/kit";
import type { P } from "./comun";
import { Gancho, Reencuadre, Lista, GanchoB, ReencuadreB } from "./Inicio";
import { Dentro } from "./Dentro";
import { Cronos } from "./Cronos";
import { Bolsas } from "./Bolsas";
import { Sacude } from "./Sacude";
import { Suave } from "./Suave";
import { Cta } from "./Cta";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, reencuadre: Reencuadre, ganchoB: GanchoB, reencuadreB: ReencuadreB, dentro: Dentro, cronos: Cronos, lista: Lista, bolsas: Bolsas, sacude: Sacude, suave: Suave, cta: Cta };
const CANDADO: Record<string, number> = { bolsas: 1, sacude: 2, suave: 3 };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const PumpV2: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#08111D" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Gancho, c = CANDADO[e.visual ?? ""];
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} />{c && <Pasos actual={c} y={430} k={1} />}</Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
