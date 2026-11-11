// E55 «Free BASE»: una escena por archivo; aquí se encadenan con voz, sonido, grano y subtítulos.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { type P } from "./comun";
import { C } from "../Pegue/comun";
import { Pared } from "./Pared";
import { Resbala } from "./Resbala";
import { Real } from "./Real";
import { CaidaG } from "./CaidaG";
import { Mochila } from "./Mochila";
import { Arriba } from "./Arriba";
import { Franja } from "./Franja";
import { Foto } from "./Foto";
import { Repisa } from "./Repisa";
const Cierre: React.FC<P> = (p) => <Pared {...p} cierre />;
const LupaE: React.FC<P> = (p) => <Resbala {...p} lupa />;
const GanchoE: React.FC<P> = (p) => <Resbala {...p} gancho />;
const ESCENAS: Record<string, React.FC<P>> = { real: Real, resbala: GanchoE, lupa: LupaE, caida: CaidaG, fotos: Foto, pared: Pared, mochila: Mochila, arriba: Arriba, franja: Franja, foto: Foto, repisa: Repisa, cierre: Cierre };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const FreeBase: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#0B1624" }}>
      {datos.voz && <Audio src={staticFile(datos.voz)} />}
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const iniS = e.inicio ?? 0, ini = Math.round(iniS * fps);
        const finS = i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion;
        const d = i === n - 1 ? Math.max(1, durationInFrames - ini) : Math.max(1, Math.round(finS * fps) - ini);
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? Pared;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
