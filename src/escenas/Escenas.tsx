import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fuenteTexto, fuenteTitulo, tema } from "../tema";
import type { Escena } from "../tipos";

const useEntrada = (retraso = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - retraso, fps, config: { damping: 14, stiffness: 140 } });
};

const Marco: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      padding: `${tema.seguro.arriba}px ${tema.seguro.lados}px ${tema.seguro.abajo + 260}px`,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Fuente: React.FC<{ texto?: string }> = ({ texto }) =>
  texto ? (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 500, fontSize: 30, color: tema.suave }}>
      Fuente: {texto}
    </div>
  ) : null;

export const Gancho: React.FC<{ e: Escena; acento: string }> = ({ e, acento }) => {
  const s = useEntrada();
  return (
    <Marco>
      {e.icono && <div style={{ fontSize: 220, transform: `scale(${s})`, marginBottom: 40 }}>{e.icono}</div>}
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 118, lineHeight: 1.02, color: tema.tinta, transform: `translateY(${(1 - s) * 60}px)`, opacity: s }}>
        {e.titulo ?? e.texto}
      </div>
      <div style={{ width: 220 * s, height: 14, background: acento, borderRadius: 7, marginTop: 40 }} />
    </Marco>
  );
};

export const Cifra: React.FC<{ e: Escena; acento: string }> = ({ e, acento }) => {
  const s = useEntrada();
  return (
    <Marco>
      <Fuente texto={e.fuente} />
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 300, lineHeight: 1, color: acento, transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>{e.cifra}</div>
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 700, fontSize: 70, lineHeight: 1.1, color: tema.tinta, marginTop: 30, opacity: s }}>{e.etiqueta ?? e.titulo}</div>
    </Marco>
  );
};

export const Lista: React.FC<{ e: Escena; acento: string }> = ({ e, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = e.items ?? [];
  const dur = Math.max(1, ((e.fin ?? 4) - (e.inicio ?? 0)) * fps);
  return (
    <Marco>
      <Fuente texto={e.fuente} />
      {e.titulo && <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 84, color: tema.tinta, marginBottom: 50 }}>{e.titulo}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "flex-start" }}>
        {items.map((it, i) => {
          const aparece = (dur * (i + 0.3)) / (items.length + 0.6);
          const s = spring({ frame: frame - aparece, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: acento, flexShrink: 0 }} />
              <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 64, color: tema.tinta, textAlign: "left" }}>{it}</div>
            </div>
          );
        })}
      </div>
    </Marco>
  );
};

export const Texto: React.FC<{ e: Escena; acento: string }> = ({ e, acento }) => {
  const s = useEntrada();
  return (
    <Marco>
      <Fuente texto={e.fuente} />
      {e.icono && <div style={{ fontSize: 200, transform: `scale(${s})`, marginBottom: 30 }}>{e.icono}</div>}
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 96, lineHeight: 1.08, color: tema.tinta, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
        {e.titulo ?? e.texto}
      </div>
      <div style={{ width: 120, height: 10, background: acento, borderRadius: 5, marginTop: 36 }} />
    </Marco>
  );
};

export const Cierre: React.FC<{ e: Escena; acento: string; cuenta: string }> = ({ e, acento, cuenta }) => {
  const s = useEntrada();
  const frame = useCurrentFrame();
  const pulso = 1 + 0.03 * Math.sin(frame / 6);
  return (
    <Marco>
      <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: tema.tinta, opacity: s }}>{e.titulo ?? e.texto}</div>
      <div style={{ marginTop: 50, fontFamily: fuenteTexto, fontWeight: 700, fontSize: 52, color: "#fff", background: acento, padding: "18px 40px", borderRadius: 60, transform: `scale(${pulso})` }}>{cuenta}</div>
    </Marco>
  );
};

export const interpolar = interpolate;
