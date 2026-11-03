// E39 «Poleas»: Kilter → marioneta de huesos → partes → agarres → adaptación → crac → cierre. Láminas de Claude Design por capas.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "../Pump/comun";
import { Kilter } from "./Kilter";
import { Chulo } from "./Chulo";
import { Partes } from "./Partes";
import { Agarres } from "./Agarres";
import { Meses } from "./Meses";
import { Sofa } from "./Sofa";
import { Crac } from "./Crac";

const ESCENAS: Record<string, React.FC<P>> = { kilter: Kilter, chulo: Chulo, partes: Partes, meses: Meses, agarres: Agarres, crac: Crac, sofa: Sofa };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Poleas: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig(), n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#08111D" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini0 = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const dur = Math.max(1, Math.round(finS * fps) - ini0);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Kilter;
        return <Sequence key={i} from={ini0} durationInFrames={dur}><Comp e={e} d={dur} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
