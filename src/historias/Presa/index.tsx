// E31 «La presa perfecta» (micro-vídeo sin voz). Escenas en Macro / Planos; aquí solo se encadenan según guion.json.
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { Etiqueta, type P } from "./comun";
import { Agarra, CepilloEsc, Dientes, Furia, Pie } from "./Macro";
import { Mira, Mochila, Sale, Sopla, Suelo, SuelaEsc, Yemas } from "./Planos";

const ESCENAS: Record<string, React.FC<P>> = {
  cepillo: CepilloEsc, sopla: Sopla, yemas: Yemas, furia: Furia, mochila: Mochila, dientes: Dientes,
  mira: Mira, agarra: Agarra, pie: Pie, sale: Sale, suelo: Suelo, suela: SuelaEsc,
};

export const Presa: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#2C3748" }}>
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const ini = Math.round((e.inicio ?? 0) * fps);
        const fin = Math.round((i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion) * fps);
        const Comp = ESCENAS[e.visual ?? ""] ?? CepilloEsc;
        return <Sequence key={i} from={ini} durationInFrames={Math.max(1, fin - ini)}><Comp e={e} d={Math.max(1, fin - ini)} pal={() => undefined} /></Sequence>;
      })}
      <Grano />
      {datos.escenas[0]?.titulo && <Sequence from={15} durationInFrames={Math.round(2.2 * fps)}><Etiqueta texto={datos.escenas[0].titulo} top={300} tam={84} /></Sequence>}
    </AbsoluteFill>
  );
};
