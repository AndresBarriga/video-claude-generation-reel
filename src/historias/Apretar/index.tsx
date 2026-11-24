// E78 «Agarre: lo que predijo su muerte no fue la tensión». Escenas: Estudio (estudio, tension), Dinamo (apretar, riesgo, cuanto),
// Cuerpo (no, chivato), Referencia (referencia, curva), Pared (pared, presas), Cierre (capa, salud).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import type { P } from "./comun";
import { Estudio, Tension } from "./Estudio";
import { Apretar as ApretarE, Riesgo, Cuanto } from "./Dinamo";
import { No, Chivato } from "./Cuerpo";
import { Referencia, Curva } from "./Referencia";
import { Pared, Presas } from "./Pared";
import { Capa, Salud } from "./Cierre";

const ESCENAS: Record<string, React.FC<P>> = { estudio: Estudio, tension: Tension, apretar: ApretarE, riesgo: Riesgo, no: No, chivato: Chivato, referencia: Referencia, curva: Curva, pared: Pared, presas: Presas, capa: Capa, salud: Salud, cuanto: Cuanto };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
export const Apretar: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig(), n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#F6F1E7" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Estudio;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
