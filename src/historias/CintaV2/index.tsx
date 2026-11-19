// E64 v4 «Cómo chapar: 3 errores» (formato de las referencias). Una escena por archivo; aquí se encadenan y van los candados 1-2-3.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { Pasos } from "../../piezas/kit";
import type { P } from "./comun";
import { Caida } from "./Caida";
import { Reencuadre, Repaso } from "./Info";
import { BackClip } from "./BackClip";
import { Goma } from "./Goma";
import { Gancho, Giro, Puerta, Cta } from "./Escenas";

const ESCENAS: Record<string, React.FC<P>> = { gancho: Gancho, promesa: Caida, reencuadre: Reencuadre, backclip: BackClip, giro: Giro, puerta: Puerta, goma: Goma, repaso: Repaso, cta: Cta };
/** Candados encima de las escenas que no los dibujan: giro (2 tiembla), puerta (2), goma (3). */
const CANDADO: Record<string, number> = { giro: 2, puerta: 2, goma: 3 };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");
const Candados: React.FC<{ n: number; tiembla?: boolean }> = ({ n, tiembla }) => { const f = useCurrentFrame(); return <div style={{ position: "absolute", inset: 0, transform: `translateX(${tiembla ? Math.sin(f * 1.7) * 6 : 0}px)` }}><Pasos actual={n} y={430} k={1} /></div>; };

export const CintaV2: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#0B1220" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Gancho, c = CANDADO[e.visual ?? ""];
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} />{c && <Candados n={c} tiembla={e.visual === "giro"} />}</Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento="#fff" estilo="arriba" claves={datos.escenas.flatMap((e) => e.claves ?? [])} />
    </AbsoluteFill>
  );
};
