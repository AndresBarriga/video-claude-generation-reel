import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Subtitulos } from "./Subtitulos";
import { Cierre, Cifra, Gancho, Lista, Texto } from "./escenas/Escenas";
import { tema } from "./tema";
import type { Datos } from "./tipos";
import config from "../config.json";

export const Reel: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const acento = tema.acento[datos.nicho] ?? tema.acento.otro;
  const total = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: tema.papel }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      {datos.escenas.map((e, i) => {
        const ini = Math.round((e.inicio ?? 0) * fps);
        // cada escena dura hasta el inicio de la siguiente (sin huecos)
        const finSeg = i === total - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? e.fin ?? datos.duracion;
        const dur = Math.max(1, Math.round(finSeg * fps) - ini);
        const comun = { e, acento };
        return (
          <Sequence key={i} from={ini} durationInFrames={dur}>
            {e.tipo === "gancho" && <Gancho {...comun} />}
            {e.tipo === "cifra" && <Cifra {...comun} />}
            {e.tipo === "lista" && <Lista {...comun} />}
            {e.tipo === "texto" && <Texto {...comun} />}
            {e.tipo === "cierre" && <Cierre {...comun} cuenta={config.cuenta} />}
          </Sequence>
        );
      })}
      <Subtitulos palabras={datos.palabras} acento={acento} />
    </AbsoluteFill>
  );
};
