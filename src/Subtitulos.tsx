import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTitulo, fuenteTexto, tema } from "./tema";
import type { Palabra } from "./tipos";

/** Subtítulos palabra a palabra: grupos de 3-4 palabras, la palabra activa resaltada. */
const norm = (w: string) => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9%]/g, "");

/** Formato fijo (19-nov, docs/formato.md): arriba, 2–5 palabras que aparecen al decirse; lo dicho en gris,
 *  la palabra que suena en blanco; las palabras CLAVE (lista `claves`) en un recuadro con tiradores. */
const Arriba: React.FC<{ palabras: Palabra[]; claves: string[]; t: number }> = ({ palabras, claves, t }) => {
  const grupos: Palabra[][] = [];
  let actual: Palabra[] = [];
  for (const p of palabras) {
    actual.push(p);
    if (actual.length >= 5 || /[.!?¿¡:,]$/.test(p.w)) { grupos.push(actual); actual = []; }
  }
  if (actual.length) grupos.push(actual);
  const g = grupos.find((x) => t >= x[0].start - 0.05 && t <= x[x.length - 1].end + 0.2);
  if (!g) return null;
  const cl = new Set(claves.map(norm));
  const dichas = g.filter((p) => t >= p.start - 0.03);
  const ultima = dichas[dichas.length - 1];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 255, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 22px" }}>
      {dichas.map((p, i) => {
        const clave = cl.has(norm(p.w)), viva = p === ultima, e = Math.min(1, (t - p.start + 0.03) / 0.12);
        return (
          <span key={i} style={{ position: "relative", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 64, lineHeight: 1.25, color: viva || clave ? "#fff" : "#8D95A3", textShadow: "0 3px 14px rgba(0,0,0,.55)", WebkitTextStroke: "9px #0B1220", paintOrder: "stroke fill", opacity: e, transform: `translateY(${(1 - e) * 10}px)`, display: "inline-block", padding: clave ? "0 12px" : 0, background: clave ? "rgba(18,32,70,.72)" : "transparent", outline: clave ? "3px solid #5B8DEF" : "none" }}>
            {p.w}
            {clave && [[-7, -7], [-7, null], [null, -7], [null, null]].map(([l, tp], j) => <i key={j} style={{ position: "absolute", width: 11, height: 11, borderRadius: 6, background: "#fff", border: "2px solid #5B8DEF", left: l ?? undefined, right: l === null ? -7 : undefined, top: tp ?? undefined, bottom: tp === null ? -7 : undefined }} />)}
          </span>
        );
      })}
    </div>
  );
};

export const Subtitulos: React.FC<{ palabras: Palabra[]; acento: string; estilo?: "caja" | "contorno" | "arriba"; claves?: string[] }> = ({ palabras, acento, estilo = "caja", claves = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (estilo === "arriba") return <Arriba palabras={palabras} claves={claves} t={t} />;

  // Agrupar en bloques de hasta 4 palabras (o corta en signos de puntuación)
  const grupos: Palabra[][] = [];
  let actual: Palabra[] = [];
  for (const p of palabras) {
    actual.push(p);
    if (actual.length >= 4 || /[.!?¿¡:]$/.test(p.w)) {
      grupos.push(actual);
      actual = [];
    }
  }
  if (actual.length) grupos.push(actual);

  const grupo = grupos.find((g) => t >= g[0].start - 0.05 && t <= g[g.length - 1].end + 0.25);
  if (!grupo) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: tema.seguro.lados,
        right: tema.seguro.lados,
        bottom: estilo === "contorno" ? tema.seguro.abajo + 90 : tema.seguro.abajo,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: estilo === "contorno" ? "4px 30px" : "6px 18px",
      }}
    >
      {grupo.map((p, i) => {
        const activa = t >= p.start && t < p.end + 0.02;
        return (
          <span
            key={i}
            style={
              estilo === "contorno"
                ? {
                    fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 84, lineHeight: 1.05,
                    color: activa ? acento : "#fff", WebkitTextStroke: "14px #050B14", paintOrder: "stroke fill",
                    transform: activa ? "scale(1.08)" : "scale(1)", display: "inline-block",
                  }
                : {
                    fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 78, lineHeight: 1.05,
                    color: activa ? "#fff" : tema.tinta, background: activa ? acento : "transparent",
                    padding: "2px 14px", borderRadius: 14, transform: activa ? "scale(1.06)" : "scale(1)",
                  }
            }
          >
            {p.w}
          </span>
        );
      })}
    </div>
  );
};
