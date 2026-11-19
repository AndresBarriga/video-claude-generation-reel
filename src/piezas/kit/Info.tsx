// KIT · INFO: capa infográfica del formato fijo (docs/formato.md). Todo en coordenadas de PANTALLA (1080×1920).
// k = aparición 0→1 (fotogramas desde que entra / duración de entrada). Se usan CUANDO ENCAJAN, no siempre.
import React from "react";
import { useCurrentFrame } from "remotion";

export const INFO = { fondo: "#0B1220", fondo2: "#1B2A44", naranja: "#F5A524", rojo: "#E5484D", verde: "#3FB56B", azul: "#5B8DEF", gris: "#8D95A3", txt: "#fff" };
const cl = (v: number) => Math.max(0, Math.min(1, v));
const sale = (k: number) => 1 - Math.pow(1 - cl(k), 3);
const caps: React.CSSProperties = { fontFamily: "Figtree", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#C9D1DC" };

/** Fondo oscuro con partículas desenfocadas que flotan (el «look» de las referencias). */
export const FondoInfo: React.FC<{ tinte?: string; n?: number }> = ({ tinte = INFO.fondo2, n = 26 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 45%, ${tinte} 0%, ${INFO.fondo} 75%)`, overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const x = (i * 397) % 1080, y = ((i * 733) % 1920 + 1920 - f * (0.3 + (i % 5) * 0.15)) % 1920, r = 3 + (i % 4) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: i % 3 ? "#FFE3A0" : "#9EC5FF", opacity: 0.12 + (i % 4) * 0.06, filter: `blur(${1 + (i % 3)}px)` }} />;
      })}
    </div>
  );
};

/** Cifra grande que cuenta hasta su valor, con etiqueta en versalitas debajo. `texto` sustituye a la cuenta («×3», «2/3»). */
export const Cifra: React.FC<{ valor?: number; antes?: string; despues?: string; texto?: string; etiqueta?: string; x?: number; y: number; k: number; color?: string; tam?: number }> = ({ valor = 0, antes = "", despues = "", texto, etiqueta, x = 540, y, k, color = INFO.naranja, tam = 190 }) => {
  if (k <= 0) return null;
  const v = texto ?? `${antes}${Math.round(valor * sale(k * 1.4)).toLocaleString("es-ES")}${despues}`;
  return (
    <div style={{ position: "absolute", left: x - 500, width: 1000, top: y, textAlign: "center", opacity: cl(k * 3), transform: `scale(${0.7 + 0.3 * sale(k * 2)})` }}>
      <div style={{ fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: tam, lineHeight: 1, color, textShadow: `0 0 40px ${color}55` }}>{v}</div>
      {etiqueta && <div style={{ ...caps, fontSize: 34, marginTop: 14 }}>{etiqueta}</div>}
    </div>
  );
};

/** Cuadrícula de personitas: `marcados` de `total` se encienden en `color`. */
export const Personitas: React.FC<{ total?: number; marcados: number; cols?: number; x?: number; y: number; ancho?: number; k: number; color?: string; etiqueta?: string }> = ({ total = 100, marcados, cols = 10, x = 540, y, ancho = 720, k, color = INFO.rojo, etiqueta }) => {
  if (k <= 0) return null;
  const c = ancho / cols, on = Math.round(marcados * sale(k * 1.3));
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y, width: ancho, opacity: cl(k * 3) }}>
      <svg width={ancho} height={Math.ceil(total / cols) * c * 1.25}>
        {Array.from({ length: total }, (_, i) => {
          const cx = (i % cols) * c + c / 2, cy = Math.floor(i / cols) * c * 1.25 + c * 0.6, col = i < on ? color : "#3A4660";
          return <g key={i} fill={col}><circle cx={cx} cy={cy - c * 0.22} r={c * 0.16} /><rect x={cx - c * 0.2} y={cy - c * 0.02} width={c * 0.4} height={c * 0.42} rx={c * 0.14} /></g>;
        })}
      </svg>
      {etiqueta && <div style={{ ...caps, fontSize: 30, textAlign: "center", marginTop: 6 }}>{etiqueta}</div>}
    </div>
  );
};

/** Barra vertical que se llena o se vacía hasta `valor` (0–1). */
export const Barra: React.FC<{ valor: number; desde?: number; etiqueta?: string; x: number; y: number; alto?: number; k: number; color?: string; marca?: string }> = ({ valor, desde = 0, etiqueta, x, y, alto = 520, k, color = INFO.naranja, marca }) => {
  if (k <= 0) return null;
  const v = desde + (valor - desde) * sale(k);
  return (
    <div style={{ position: "absolute", left: x - 45, top: y, width: 90, opacity: cl(k * 3) }}>
      {etiqueta && <div style={{ ...caps, fontSize: 28, textAlign: "center", marginBottom: 12, marginLeft: -60, marginRight: -60 }}>{etiqueta}</div>}
      <div style={{ position: "relative", height: alto, borderRadius: 45, background: "#1A2236", border: "4px solid #2C3854", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${v * 100}%`, background: `linear-gradient(${color}, ${color}AA)`, boxShadow: `0 0 30px ${color}88` }} />
      </div>
      {marca && <div style={{ position: "absolute", left: 100, top: (etiqueta ? 52 : 0) + alto * (1 - v) - 26, fontFamily: "Figtree", fontWeight: 800, fontSize: 40, color: "#fff", background: "rgba(5,11,20,.85)", borderRadius: 12, padding: "2px 12px" }}>{marca}</div>}
    </div>
  );
};

/** Manómetro verde-amarillo-rojo con aguja en `valor` (0–1). */
export const Manometro: React.FC<{ valor: number; etiqueta?: string; x?: number; y: number; r?: number; k: number }> = ({ valor, etiqueta, x = 540, y, r = 300, k }) => {
  if (k <= 0) return null;
  const a = Math.PI * (1 - valor * sale(k)), arco = (a0: number, a1: number, col: string) => <path d={`M${r + Math.cos(a0) * r * 0.8} ${r - Math.sin(a0) * r * 0.8} A${r * 0.8} ${r * 0.8} 0 0 1 ${r + Math.cos(a1) * r * 0.8} ${r - Math.sin(a1) * r * 0.8}`} stroke={col} strokeWidth={r * 0.16} fill="none" />;
  return (
    <div style={{ position: "absolute", left: x - r, top: y, opacity: cl(k * 3) }}>
      <svg width={2 * r} height={r * 1.1}>
        {arco(Math.PI, Math.PI * 0.62, INFO.verde)}{arco(Math.PI * 0.62, Math.PI * 0.36, INFO.naranja)}{arco(Math.PI * 0.36, 0, INFO.rojo)}
        <line x1={r} y1={r} x2={r + Math.cos(a) * r * 0.66} y2={r - Math.sin(a) * r * 0.66} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        <circle cx={r} cy={r} r={20} fill="#fff" />
      </svg>
      {etiqueta && <div style={{ ...caps, fontSize: 32, textAlign: "center" }}>{etiqueta}</div>}
    </div>
  );
};

/** Etiqueta en versalitas con línea guía hasta un punto (x2, y2). */
export const Nota: React.FC<{ texto: string; x: number; y: number; x2: number; y2: number; k: number; color?: string }> = ({ texto, x, y, x2, y2, k, color = "#fff" }) => k <= 0 ? null : (
  <>
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: cl(k * 2) }} width={1080} height={1920}>
      <path d={`M${x} ${y} L${x + (x2 - x) * sale(k)} ${y + (y2 - y) * sale(k)}`} stroke={color} strokeWidth={4} />
      <circle cx={x2} cy={y2} r={9 * sale(k)} fill={color} />
    </svg>
    <div style={{ ...caps, position: "absolute", left: x - 300, width: 600, top: y - 52, textAlign: "center", fontSize: 32, color, opacity: cl(k * 3) }}>{texto}</div>
  </>
);
