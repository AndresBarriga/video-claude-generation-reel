// E43 «Las cinco fases del pump». Escenas en archivos aparte; aquí se encadenan y se dibujan las barras PUMP (5 bloques = 5 fases) y AGARRE.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { BLOQUES, BarraBloques, C, PM, clamp, type P } from "./comun";
import { Gancho } from "./Gancho";
import { Fases12 } from "./Fases12";
import { Fase3 } from "./Fase3";
import { Fase4 } from "./Fase4";
import { Rehook } from "./Rehook";
import { Cierre, Dura, Truco } from "./Espera";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, f12: Fases12, f3: Fase3, f4: Fase4, rehook: Rehook, truco: Truco, dura: Dura, cierre: Cierre };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
type Kf = [number, number][];
const kf = (t: number, p: Kf) => interpolate(t, p.map((x) => x[0]), p.map((x) => x[1]), clamp);

export const Pump: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps, n = datos.escenas.length;
  const tw = (w: string, i = 0): number => datos.palabras.filter((x) => norm(x.w) === norm(w))[i]?.start ?? 0;
  const ini = (v: string) => datos.escenas.find((e) => e.visual === v)?.inicio ?? 0;
  const bombas: Kf = [
    [0, 5], [tw("Pero") + 0.3, 5], [tw("antes") + 0.25, 0],
    [tw("uno") - 0.1, 0], [tw("uno") + 0.5, 1], [tw("dos") + 0.1, 1], [tw("calienta"), 2],
    [tw("tres") + 0.1, 2], [tw("piedra") + 0.2, 3], [tw("cuatro", 1) + 0.1, 3], [tw("cerrar"), 4],
    [tw("sueltas"), 4], [tw("bien"), 1], [tw("repitas"), 1], [tw("minutos", 1) + 0.3, 4.2], [tw("veinte"), 4.2], [tw("veinte") + 0.9, 0],
    [ini("cierre") - 0.01, 0], [ini("cierre"), 5],
  ];
  const agarre: Kf = [
    [tw("fuerza") - 0.1, 1], [tw("cae") + 0.4, 0.3], [tw("sueltas"), 0.3], [tw("volver") + 0.8, 0.55],
    [tw("repitas"), 0.55], [tw("minutos", 1) + 0.3, 0.2], [tw("veinte"), 0.2], [tw("veinte") + 0.9, 1],
  ];
  const oculta = interpolate(t, [ini("dura") - 0.01, ini("dura"), ini("cierre") - 0.01, ini("cierre")], [1, 0, 0, 1], clamp);
  const ag = interpolate(t, [tw("fuerza") - 0.3, tw("fuerza") - 0.1], [0, 1], clamp) * (t < ini("dura") ? 1 : 0);
  const enCierre = t >= ini("cierre");
  return (
    <AbsoluteFill style={{ background: "#08111D" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini0 = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const dur = Math.max(1, Math.round(finS * fps) - ini0);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Gancho;
        return <Sequence key={i} from={ini0} durationInFrames={dur}><Comp e={e} d={dur} pal={pal} /></Sequence>;
      })}
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <BarraBloques x={996} y0={420} y1={1220} v={kf(t, bombas)} cols={BLOQUES} etiqueta="PUMP" nota="ilustrativo" o={oculta} numeros={enCierre} />
        <BarraBloques x={84} y0={640} y1={1220} v={kf(t, agarre) * 5} n={5} ancho={44} cols={[PM.hielo]} etiqueta="AGARRE" o={ag * oculta} />
      </svg>
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
