import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTitulo, tema } from "./tema";
import type { Palabra } from "./tipos";

/** Subtítulos palabra a palabra: grupos de 3-4 palabras, la palabra activa resaltada. */
export const Subtitulos: React.FC<{ palabras: Palabra[]; acento: string; estilo?: "caja" | "contorno" }> = ({ palabras, acento, estilo = "caja" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

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
