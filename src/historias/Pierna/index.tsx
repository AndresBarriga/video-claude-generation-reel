// E11 «Por qué te tiembla la pierna cuando miras abajo» (vía). Una escena por archivo; aquí solo se encadenan.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Vertigo } from "./Vertigo";
import { Asegurador } from "./Asegurador";
import { Elvis } from "./Elvis";
import { Gemelo } from "./Gemelo";
import { Reflejo } from "./Reflejo";
import { Chapa } from "./Chapa";
import { Volumen } from "./Volumen";
import { Laboratorio } from "./Laboratorio";
import { Consejos } from "./Consejos";
import { Cierre } from "./Cierre";

const ESCENAS: Record<string, React.FC<P>> = {
  vertigo: Vertigo, asegurador: Asegurador, elvis: Elvis, gemelo: Gemelo, reflejo: Reflejo, chapa: Chapa,
  volumen: Volumen, laboratorio: Laboratorio, consejos: Consejos, cierre: Cierre,
};

export const Pierna: React.FC<{ datos: Datos }> = ({ datos }) => {
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
        const Comp = ESCENAS[e.visual ?? ""] ?? Vertigo;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
