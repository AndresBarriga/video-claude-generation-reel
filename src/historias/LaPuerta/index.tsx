// E83 «La puerta» (réplica de @boldr.climbing «Carl is a door»). Protagonista fijo: Fermín (src/piezas/Fermin.tsx).
// Escenas: abre · bisagra · gira · bandera · contragiro · llega · parte2. Hilo visual: la línea de la bisagra (roja → verde).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import type { P } from "./comun";
import { Abre } from "./Abre";
import { Bisagra } from "./Bisagra";
import { Gira } from "./Gira";
import { Bandera } from "./Bandera";
import { Contragiro } from "./Contragiro";
import { Llega } from "./Llega";
import { Parte2 } from "./Parte2";

const ESCENAS: Record<string, React.FC<P>> = { abre: Abre, bisagra: Bisagra, gira: Gira, bandera: Bandera, contragiro: Contragiro, llega: Llega, parte2: Parte2 };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
export const LaPuerta: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig(), n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#ECE6DC" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Abre;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
