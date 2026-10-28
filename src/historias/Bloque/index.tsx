// E6 v3 «El último pegue» en bloque. Escenas en Gancho / Excusas / Cuerpo / Final; aquí solo se encadenan según guion.json.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Alcanza, Alcanza23, Rebobina, SeVan } from "./Gancho";
import { Doce, Nueve, Platano, Quince } from "./Excusas";
import { BombaPlano, Flapper, Recogen } from "./Cuerpo";
import { Otro, Pantalla } from "./Final";

const ESCENAS: Record<string, React.FC<P>> = {
  alcanza: Alcanza, seVan: SeVan, rebobina: Rebobina, nueve: Nueve, doce: Doce, platano: Platano, quince: Quince,
  flapper: Flapper, antebrazo: BombaPlano, recogen: Recogen, alcanza23: Alcanza23, pantalla: Pantalla, otro: Otro,
};

export const Bloque: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
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
        const Comp = ESCENAS[e.visual ?? ""] ?? Alcanza;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
