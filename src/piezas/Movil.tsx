// El móvil como reloj del vídeo: indicador de batería pequeño en una esquina y pantalla grande (lo que graba el colega).
import React from "react";
import { useCurrentFrame } from "remotion";
import { fuenteTexto } from "../tema";

const ROJO = "#E5484D";
const colorBat = (p: number) => (p <= 15 ? ROJO : p <= 30 ? "#F2C230" : "#5BD38A");

/** Icono de batería (SVG). (x, y) = esquina superior izquierda; ancho 64·s. */
export const IconoBateria: React.FC<{ x: number; y: number; pct: number; s?: number }> = ({ x, y, pct, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={0} width={56} height={28} rx={7} fill="none" stroke="#fff" strokeWidth={4} />
    <rect x={58} y={9} width={6} height={10} rx={2} fill="#fff" />
    <rect x={5} y={5} width={Math.max(2, 46 * Math.min(1, pct / 100))} height={18} rx={3} fill={colorBat(pct)} />
  </g>
);

/** Indicador pequeño en la esquina superior derecha (HTML, dentro de la zona segura). Parpadea por debajo del 5 %. */
export const Bateria: React.FC<{ pct: number; top?: number }> = ({ pct, top = 214 }) => {
  const f = useCurrentFrame();
  const visible = pct > 5 || Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", top, right: 70, display: "flex", alignItems: "center", gap: 10, background: "rgba(5,11,20,.72)", borderRadius: 40, padding: "6px 18px", opacity: visible ? 1 : 0.35 }}>
      <svg width={66} height={30} viewBox="0 0 66 30"><IconoBateria x={1} y={1} pct={pct} /></svg>
      <span style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 36, color: pct <= 15 ? ROJO : "#fff", fontVariantNumeric: "tabular-nums" }}>{Math.round(pct)} %</span>
    </div>
  );
};

/** Móvil grande en mano. La pantalla (children) se recorta al cristal. `apagado` 0–1 funde a negro. (x, y) = centro. */
export const PantallaMovil: React.FC<{ x: number; y: number; s?: number; rot?: number; pct: number; rec?: boolean; apagado?: number; children?: React.ReactNode; id: string }> = ({ x, y, s = 1, rot = 0, pct, rec = true, apagado = 0, children, id }) => {
  const f = useCurrentFrame();
  const W = 560, H = 1040;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-W / 2 - 26} y={-H / 2 - 26} width={W + 52} height={H + 52} rx={70} fill="#141B26" />
      <clipPath id={id}><rect x={-W / 2} y={-H / 2} width={W} height={H} rx={48} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${-W / 2} ${-H / 2})`}>{children}</g>
        {apagado < 1 && <g opacity={1 - apagado}>
          {rec && <g><circle cx={-W / 2 + 50} cy={-H / 2 + 56} r={14} fill={ROJO} opacity={Math.floor(f / 10) % 2 ? 1 : 0.4} />
            <text x={-W / 2 + 76} y={-H / 2 + 68} fill="#fff" fontFamily={fuenteTexto} fontWeight={700} fontSize={34}>REC</text></g>}
          <IconoBateria x={W / 2 - 150} y={-H / 2 + 40} pct={pct} s={1.1} />
          <text x={W / 2 - 74} y={-H / 2 + 67} fill={pct <= 15 ? ROJO : "#fff"} fontFamily={fuenteTexto} fontWeight={700} fontSize={30}>{Math.round(pct)}%</text>
        </g>}
        <rect x={-W / 2} y={-H / 2} width={W} height={H} fill="#000" opacity={apagado} />
      </g>
      <rect x={-60} y={-H / 2 - 16} width={120} height={14} rx={7} fill="#05080D" />
    </g>
  );
};
