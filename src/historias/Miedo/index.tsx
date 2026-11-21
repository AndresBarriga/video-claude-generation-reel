// E72 «¿Miedo a caer? Se quita cayendo» (3 cosas). Hilo visual: el MEDIDOR DE MIEDO baja con cada paso, sube en roca y acaba en verde.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Sonidos } from "../../Sonidos";
import { Pasos } from "../../piezas/kit";
import type { P } from "./comun";
import { MedidorMiedo } from "./Ui";
import { Gancho, Material, Bucle } from "./Inicio";
import { Uno, Dos, Tres } from "./Pasos";
import { Roca, Entrena, Cta } from "./Final";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, material: Material, bucle: Bucle, uno: Uno, dos: Dos, tres: Tres, roca: Roca, entrena: Entrena, cta: Cta };
const CANDADO: Record<string, number> = { uno: 1, dos: 2, tres: 3 };
/** Miedo al principio y al final de cada escena. */
const MIEDO: Record<string, [number, number]> = { gancho: [0.95, 0.95], material: [0.9, 0.88], bucle: [0.9, 1], uno: [0.9, 0.6], dos: [0.6, 0.45], tres: [0.45, 0.28], roca: [0.3, 0.85], entrena: [0.6, 0.12], cta: [0.12, 0.1] };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

const Medidor: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig(), t = useCurrentFrame() / fps, es = datos.escenas;
  const i = Math.max(0, es.findIndex((e, j) => t < (es[j + 1]?.inicio ?? 1e9))), a = es[i].inicio ?? 0, b = es[i + 1]?.inicio ?? datos.duracion;
  const [v0, v1] = MIEDO[es[i].visual ?? ""] ?? [0.5, 0.5], prev = i > 0 ? (MIEDO[es[i - 1].visual ?? ""] ?? [0.5, 0.5])[1] : v0;
  const v = interpolate(t, [a, a + 0.4, b], [prev, v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <MedidorMiedo v={v} o={es[i].visual === "cta" ? interpolate(t, [a, a + 0.5], [1, 0], { extrapolateRight: "clamp" }) : 1} />;
};
export const Miedo: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#FDF3E3" }}>
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
      <Medidor datos={datos} />
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
