// E82 · TITULAR FIJO de 2 líneas arriba (como el original): etiqueta pequeña + línea 1 en tinta + línea 2 resaltada en amarillo.
// Se lee sin sonido desde el fotograma 0 (formato §8). Cambia en la escena o en la palabra `desde` de guion.json → `titulares`.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { COL, F } from "./comun";

type Tit = { t: number; l: [string, string]; et: string };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export const titulares = (datos: Datos): Tit[] => {
  const out: Tit[] = [];
  datos.escenas.forEach((e: any, i) => {
    const ini = e.inicio ?? 0, fin = datos.escenas[i + 1]?.inicio ?? datos.duracion;
    for (const t of e.titulares ?? []) {
      const w = t.desde ? datos.palabras.find((p) => p.start >= ini - 0.01 && p.start < fin && norm(p.w) === norm(t.desde)) : undefined;
      out.push({ t: w ? w.start - 0.05 : ini, l: t.l, et: e.etiqueta ?? "" });
    }
  });
  return out;
};

const tam = (s: string) => Math.min(92, Math.floor(1500 / Math.max(8, s.length)));

export const Titular: React.FC<{ datos: Datos; lista: Tit[] }> = ({ datos, lista }) => {
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = f / fps;
  // Bucle: los últimos 8 fotogramas vuelven al titular del fotograma 0 para que el vídeo empalme.
  const fin = f >= durationInFrames - 8;
  let i = 0;
  lista.forEach((x, j) => { if (t >= x.t) i = j; });
  // El primer titular está entero desde el fotograma 0 (gancho sin sonido).
  const cur = fin ? lista[0] : lista[i], k = fin || i === 0 ? 99 : Math.round((t - cur.t) * fps);
  const e1 = interpolate(k, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e2 = interpolate(k, [3, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s1 = tam(cur.l[0]), s2 = tam(cur.l[1]), ancho = Math.min(1, 0.4 + 0.6 * e2);
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 262 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Figtree", fontWeight: 800, fontSize: 30, letterSpacing: 4, color: COL.tinta, opacity: 0.75 }}>
        <div style={{ width: 16, height: 16, background: COL.amarillo, border: `3px solid ${COL.tinta}` }} />{cur.et}
      </div>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: s1, lineHeight: 1.04, color: COL.tinta, marginTop: 6, opacity: e1, transform: `translateY(${(1 - e1) * 24}px)`, whiteSpace: "nowrap" }}>{cur.l[0]}</div>
      <div style={{ display: "inline-block", fontFamily: F, fontWeight: 900, fontSize: s2, lineHeight: 1.04, color: COL.tinta, marginTop: 4, padding: "0 14px 6px", marginLeft: -14, background: COL.amarillo, borderRadius: 12, clipPath: `inset(0 ${(1 - ancho) * 100}% 0 0)`, opacity: e2, whiteSpace: "nowrap" }}>{cur.l[1]}</div>
    </div>
  );
};
