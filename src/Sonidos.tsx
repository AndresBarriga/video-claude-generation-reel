// Capa de efectos de sonido. Lee datos.sonido (copia de videos/<nicho>/<id>/sonido.json) y coloca cada efecto
// en su escena o palabra. La voz va por encima: mientras se habla, los efectos bajan (bajoVoz).
// Los archivos están en public/sonido/<id>/<nombre>.wav (los prepara `npm run sonido -- <id>`).
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import type { Datos } from "./tipos";

/** Dónde empieza/acaba un efecto. escena: índice (0 = primera) o id de `visual` ("navaja", "navaja#2" = 2.ª vez). */
export type Ancla = { escena?: number | string; palabra?: string; fraccion?: number; final?: boolean; mas?: number };
export type Efecto = {
  nombre?: string;            // archivo public/sonido/<id>/<nombre>.wav
  silencio?: boolean;         // en vez de sonar, apaga los demás efectos durante `duracion`
  inicio: Ancla; fin?: Ancla; duracion?: number;
  volumen?: number;           // 0-1 (por defecto 0.5)
  fundido?: [number, number]; // entrada, salida (s)
  bucle?: boolean;
  bajoVoz?: number;           // cuánto baja mientras se habla (0-1); por defecto el global
  ignoraSilencio?: boolean;
};
export type ConfigSonido = { bajoVoz?: number; efectos: Efecto[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9]/g, "");

export function resolverAncla(a: Ancla, datos: Datos): number {
  const esc = datos.escenas;
  let ini = 0, fin = datos.duracion;
  if (a.escena !== undefined) {
    let i = -1;
    if (typeof a.escena === "number") i = a.escena;
    else {
      const [vis, nStr] = a.escena.split("#"); const n = Number(nStr ?? 1);
      let c = 0; i = esc.findIndex((e) => e.visual === vis && ++c === n);
    }
    if (i < 0 || i >= esc.length) throw new Error(`sonido.json: no encuentro la escena ${JSON.stringify(a.escena)}`);
    ini = esc[i].inicio ?? 0; fin = i === esc.length - 1 ? datos.duracion : esc[i + 1].inicio ?? datos.duracion;
  }
  let t = a.final ? fin : ini + (a.fraccion ?? 0) * (fin - ini);
  if (a.palabra) {
    const w = datos.palabras.find((p) => p.start >= ini - 0.01 && p.start <= fin && norm(p.w) === norm(a.palabra!));
    if (!w) throw new Error(`sonido.json: no encuentro la palabra "${a.palabra}"`);
    t = w.start;
  }
  return Math.max(0, t + (a.mas ?? 0));
}

export const Sonidos: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const cfg = datos.sonido;
  if (!cfg?.efectos?.length) return null;
  const total = datos.duracion;
  const efectos = cfg.efectos.map((e) => {
    const t0 = resolverAncla(e.inicio, datos);
    const t1 = e.fin ? resolverAncla(e.fin, datos) : e.duracion !== undefined ? t0 + e.duracion : total;
    return { ...e, t0, t1: Math.min(total, Math.max(t0 + 0.05, t1)) };
  });
  const silencios = efectos.filter((e) => e.silencio);
  const silencio = (t: number) => {
    let g = 1;
    for (const s of silencios) g = Math.min(g, interpolate(t, [s.t0 - 0.03, s.t0, s.t1, s.t1 + 0.5], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    return g;
  };
  const habla = (t: number) => {
    let h = 0;
    for (const p of datos.palabras) {
      if (p.start - 0.2 > t) break;
      h = Math.max(h, interpolate(t, [p.start - 0.12, p.start, p.end + 0.08, p.end + 0.3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
    return h;
  };
  return (
    <>
      {efectos.filter((e) => e.nombre).map((e, i) => {
        const from = Math.round(e.t0 * fps), dur = Math.max(1, Math.round((e.t1 - e.t0) * fps));
        const [fi, fo] = e.fundido ?? [0.02, 0.15];
        const vol = e.volumen ?? 0.5, duck = e.bajoVoz ?? cfg.bajoVoz ?? 0.45;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Audio src={staticFile(`sonido/${datos.id}/${e.nombre}.wav`)} loop={e.bucle}
              volume={(f) => {
                const s = f / fps, t = e.t0 + s, d = e.t1 - e.t0;
                const fade = Math.min(fi > 0 ? Math.min(1, s / fi) : 1, fo > 0 ? Math.min(1, (d - s) / fo) : 1);
                return Math.max(0, vol * fade * (1 - duck * habla(t)) * (e.ignoraSilencio ? 1 : silencio(t)));
              }} />
          </Sequence>
        );
      })}
    </>
  );
};
