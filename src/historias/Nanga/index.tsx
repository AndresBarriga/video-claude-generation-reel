// E54 «Nanga Parbat»: una escena por archivo; aquí se encadenan con voz, sonido, grano y subtítulos.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C, type P } from "./comun";
import { Cumbre } from "./Cumbre";
import { EnGrieta } from "./EnGrieta";
import { Diamir } from "./Diamir";
import { Grito } from "./Grito";
import { Ojos } from "./Ojos";
import { Escalones } from "./Escalones";
import { K2 } from "./K2";
import { Viva } from "./Viva";
import { Final } from "./Final";
import { Altimetro } from "./Altimetro";
import { Svg } from "./comun";
import { useCurrentFrame } from "remotion";
const Cierre: React.FC<P> = (p) => <Cumbre {...p} cierre />;

const ESCENAS: Record<string, React.FC<P>> = { ojos: Ojos, cumbre: Cumbre, grieta: EnGrieta, escalones: Escalones, k2: K2, diamir: Diamir, grito: Grito, viva: Viva, final: Final, cierre: Cierre };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const Nanga: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#05040C" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Cumbre;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Alti datos={datos} />
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};

/** Altímetro lateral: aparece en la grieta y se va al llegar a «Estaba viva». */
const Alti: React.FC<{ datos: Datos }> = ({ datos }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;
  const ini = (v: string) => datos.escenas.find((e) => e.visual === v)?.inicio ?? 0;
  const [g, es, k, di, gr, vi] = ["grieta", "escalones", "k2", "diamir", "grito", "viva"].map(ini);
  if (s < g || s >= vi) return null;
  const tramo = { t: [g, es, k, di, gr, vi], ella: [7280, 7280, 6700, 6400, 6100, 6100], ellos: [4800, 4800, 4800, 4800, 6100, 6100] };
  const horas = Math.round(interpolate(s, [g, gr], [6, 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <AbsoluteFill><Svg><Altimetro s={s} tramo={s < k ? { t: tramo.t, ella: tramo.ella } : tramo} horas={horas} /></Svg></AbsoluteFill>;
};
