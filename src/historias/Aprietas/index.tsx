// E82 «No eres débil: aprietas demasiado». Ver comun.tsx para el hilo visual. Una escena por archivo.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import type { P } from "./comun";
import { Gancho, Pregunta, Cta } from "./Gancho";
import { Dominada } from "./Dominada";
import { Caida } from "./Caida";
import { Capitan } from "./Capitan";
import { Placa, Vuelta } from "./Placa";
import { Estudio } from "./Estudio";
import { Lista } from "./Lista";
import { Resumen } from "./Resumen";
import { Titular, titulares } from "./Titular";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, dominada: Dominada, caida: Caida, honnold: Capitan, placa: Placa, pregunta: Pregunta, estudio: Estudio, lista: Lista, resumen: Resumen, vuelta: Vuelta, cta: Cta };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Aprietas: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length, lista = React.useMemo(() => titulares(datos), [datos]);
  return (
    <AbsoluteFill style={{ background: "#E8F2FC" }}>
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
      {/* Franja del titular: blanco translúcido para que se lea sobre cualquier fondo claro. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, height: 300, background: "linear-gradient(rgba(255,253,248,.92) 75%, rgba(255,253,248,0))" }} />
      <Titular datos={datos} lista={lista} />
      {/* Subtítulos karaoke del formato, bajo el titular (y≈530 en vez de 255). */}
      <AbsoluteFill style={{ transform: "translateY(275px)" }}>
        <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
