// E42 «La puerta». Escenas en Escenas.tsx; aquí solo se encadenan.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Subtitulos } from "../../Subtitulos";
import { Grano } from "../../piezas/Grano";
import { Sonidos } from "../../Sonidos";
import { C } from "./comun";
import { ESCENAS } from "./Escenas";

const NOMBRES = ["1 · PIE CONTRARIO", "2 · BANDERA", "3 · CADERA"];
/** Barra de progreso de las 3 técnicas: se llena con cada una y se marca ✓ al terminar. */
const Progreso: React.FC<{ t0: number[]; t1: number; fin: number }> = ({ t0, t1, fin }) => {
  const { fps } = useVideoConfig(), t = useCurrentFrame() / fps;
  const o = interpolate(t, [t0[0] - 0.1, t0[0] + 0.25, fin - 0.3, fin], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 56, left: 50, right: 50, display: "flex", gap: 12, opacity: o }}>
      {NOMBRES.map((n, k) => {
        const a = t0[k], b = k < 2 ? t0[k + 1] : t1, p = interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), hecho = t >= b - 0.05;
        const pop = hecho ? 1 + 0.08 * Math.max(0, 1 - (t - b) * 5) : 1;
        return (
          <div key={k} style={{ flex: 1, height: 66, borderRadius: 33, background: "#0B1624CC", border: `3px solid ${hecho ? "#6FE08A" : "#5FD1C5"}`, position: "relative", overflow: "hidden", transform: `scale(${pop})` }}>
            <div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, background: hecho ? "#2E8B57" : "#2A9D8F" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: 0 }}>{hecho ? "✓ " : ""}{n}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Puerta: React.FC<{ datos: Datos }> = ({ datos }) => {
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
        const pal = (w: string) => { const p = datos.palabras.find((x) => x.start >= iniS - 0.01 && x.start < finS && norm(x.w) === norm(w)); return p ? Math.round((p.start - iniS) * fps) : undefined; };
        const Comp = ESCENAS[e.visual ?? ""] ?? ESCENAS.puerta;
        return <Sequence key={i} from={ini} durationInFrames={d}><Comp e={e} d={d} pal={pal} /></Sequence>;
      })}
      {(() => { const st = (v: string) => datos.escenas.find((x) => x.visual === v)?.inicio; const u = st("uno"), dd = st("dos"), tr = st("tres"), ll = st("llegas"), en = st("envio"); return u != null && dd != null && tr != null && ll != null && en != null ? <Progreso t0={[u, dd, tr]} t1={ll} fin={en} /> : null; })()}
      <Grano />
      <Subtitulos palabras={datos.palabras} acento={C.cuerda} estilo="contorno" />
    </AbsoluteFill>
  );
};
