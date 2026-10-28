// E14 «Honnold»: el free solo de El Capitán visto desde el prado. Una escena por archivo; aquí solo se encadenan.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Gancho, PlanoGancho } from "./Gancho";
import { Prado } from "./Prado";
import { Retrato, PlanoRetrato } from "./Retrato";
import { Escaner } from "./Escaner";
import { Cerebros } from "./Cerebros";
import { Ensayo } from "./Ensayo";
import { Cumbre } from "./Cumbre";
import { PlanoEscalera } from "./Escalera";
import { Pared } from "./Pared";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, prado: Prado, retrato: Retrato, escaner: Escaner, cerebros: Cerebros, ensayo: Ensayo, cumbre: Cumbre, pared: Pared,
  escalera: ({ d }) => <PlanoEscalera d={d} />,
  cara: ({ d }) => <PlanoRetrato d={d} />,
  tuEscalera: ({ d, e }) => <PlanoEscalera d={d} m={2} nota={e.titulo} />,
  subida: ({ d, e }) => <PlanoGancho d={d} desde={100} hasta={150} nota={e.titulo} />,
  cierre: ({ d, e }) => <PlanoEscalera d={d} titulo={e.titulo} />,
};

export const Honnold: React.FC<{ datos: Datos }> = ({ datos }) => {
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
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Gancho;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
