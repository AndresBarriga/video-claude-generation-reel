// Marcador de fase (arriba): «FASE 3» + cinco casillas que se llenan + nombre corto de la fase. Es lo que la gente comenta («yo, fase 4»).
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { fuenteTitulo, fuenteTexto } from "../../tema";

export const Marcador: React.FC<{ n: number; nombre?: string; rojo?: boolean }> = ({ n, nombre, rojo }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 11, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: 4, textShadow: "0 3px 8px #000a" }}>FASE {n}</span>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 46, height: 22, borderRadius: 11, border: "4px solid #fff", background: i < n ? "#FF6A1F" : i === n ? `rgba(255,106,31,${k})` : "rgba(5,11,20,.35)", boxShadow: "0 3px 8px #0006" }} />
        ))}
      </div>
      {nombre && (
        <div style={{ transform: `scale(${0.6 + 0.4 * k})`, fontFamily: fuenteTitulo, fontWeight: 800, fontSize: rojo ? 150 : 92, lineHeight: 1, textAlign: "center", padding: "0 50px",
          color: rojo ? "#FF6A1F" : "#fff", WebkitTextStroke: "12px #050B14", paintOrder: "stroke fill" }}>{nombre}</div>
      )}
    </div>
  );
};
