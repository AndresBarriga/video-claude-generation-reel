// E43 «Pump»: congestión del antebrazo. Escenas en archivos aparte; aquí se encadenan y se dibujan las barras PUMP (5 bloques) y AGARRE.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { BLOQUES, BarraBloques, C, PM, clamp, type P } from "./comun";
import { Gancho } from "./Gancho";
import { Produce } from "./Produce";
import { Split } from "./Split";
import { Evita } from "./Evita";
import { Cierre, Descansa } from "./Descansa";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, produce: Produce, split: Split, evita: Evita, descansa: Descansa, cierre: Cierre };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
type Kf = [number, number][];
const kf = (t: number, p: Kf) => interpolate(t, p.map((x) => x[0]), p.map((x) => x[1]), clamp);

export const Pump: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps, n = datos.escenas.length;
  const tw = (w: string, i = 0): number => datos.palabras.filter((x) => norm(x.w) === norm(w))[i]?.start ?? 0;
  const ini = (v: string) => datos.escenas.find((e) => e.visual === v)?.inicio ?? 0;
  const pump: Kf = [
    [0, 5], [tw("riego") + 0.4, 5], [tw("Cuanto") + 0.3, 0.8], [tw("hincha"), 2], [tw("mitad"), 3], [tw("sangre"), 3.6], [tw("hinchado"), 4.4], [tw("sin"), 5], [ini("split"), 5],
    [ini("evita"), 1.4], [tw("pies"), 1.6], [tw("chapa"), 2.4], [tw("sacude"), 2.6], [tw("sacude") + 0.9, 2.0], [tw("luego") + 0.1, 2.1], [tw("luego") + 1.0, 1.5], [ini("descansa") - 0.01, 1.5],
    [ini("descansa"), 4.5], [tw("soltar"), 4.5], [tw("enseguida") + 0.2, 0.9], [tw("repitas"), 0.9], [tw("minutos") + 0.2, 5], [tw("nivel"), 5], [tw("veinte"), 0.2], [ini("cierre") - 0.01, 1.2], [ini("cierre"), 5],
  ];
  const agarre: Kf = [
    [tw("sin") - 0.1, 1], [tw("sin") + 0.9, 0.3], [ini("descansa"), 0.3], [tw("fuerza", 2), 0.3], [tw("repitas"), 0.5], [tw("minutos") + 0.3, 0.2], [tw("veinte") + 0.8, 1],
  ];
  const hasta = (a: number, b: number) => interpolate(t, [a - 0.01, a, b - 0.01, b], [0, 1, 1, 0], clamp);
  const oculta = interpolate(t, [ini("split") - 0.01, ini("split"), ini("evita") - 0.01, ini("evita")], [1, 0, 0, 1], clamp);
  const ag = Math.max(hasta(tw("sin") - 0.2, ini("split")), hasta(ini("descansa"), ini("cierre")));
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
        <BarraBloques x={996} y0={420} y1={1220} v={kf(t, pump)} cols={BLOQUES} etiqueta="PUMP" nota="ilustrativo" o={oculta} numeros={enCierre} />
        <BarraBloques x={84} y0={640} y1={1220} v={kf(t, agarre) * 5} n={5} ancho={44} cols={[PM.hielo]} etiqueta="AGARRE" o={ag * oculta} />
      </svg>
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
