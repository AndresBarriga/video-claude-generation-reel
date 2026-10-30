// Escenas 5 y 6 («22:00»): llega el helicóptero, su foco barre la arista; tú lo rechazas con los brazos y se va.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Escalador, POSES } from "../../piezas/Escalador";
import { Arista, Camara, CieloNoche, EL, ELLA, Etiqueta, Hora, Roca, Svg, T, Vaho, Viento, cabezaElla, caderaApoyada, sueloY, type P } from "./comun";
import { PAREJA, rocaDe } from "./Noche";
import { Heli } from "./Heli";

export const PlanoHeli: React.FC<{ d: number; fase: "llega" | "rechaza" | "abre"; hora?: string; serie?: boolean; titulo?: string; final?: string; tFinal?: number }> = ({ d, fase: f0, hora, serie, titulo, final, tFinal }) => {
  const fase = f0 === "abre" ? "rechaza" : f0;
  const f = useCurrentFrame(), { s, xa, xe } = PAREJA;
  const hx = f0 === "abre" ? 640 + Math.sin(f / 9) * 30 : fase === "llega" ? interpolate(f, [0, d], [-180, 640]) : interpolate(f, [0, d], [640, 1300]);
  const hy = 560 + Math.sin(f / 7) * 12, barrido = fase === "llega" ? interpolate(f, [0, d], [-30, 12]) : 12 + Math.sin(f / 3) * 4;
  const no = fase === "rechaza" ? Math.sin(f / 2.6) : 0;
  const pie = POSES.pie as { piernaA: [number, number]; piernaB: [number, number] };
  const he = caderaApoyada(xe, s, pie.piernaA, pie.piernaB, -1), ha = rocaDe(xa) - 8 * s;
  return (
    <Camara d={d} empuje={0.04} foco="50% 40%" sacudida={1.2}>
      <Svg>
        <CieloNoche id="he" />
        <g transform={`rotate(${barrido} ${hx} ${hy})`}><path d={`M${hx - (fase === "llega" ? -110 : 110)} ${hy + 40} L${hx - 260} ${1400} L${hx + 260} ${1400} Z`} fill="#FFF6D0" opacity={0.2} /></g>
        <g transform={`translate(${hx} ${hy}) scale(${fase === "llega" ? -1 : 1} 1) translate(${-hx} ${-hy})`}><Heli x={hx} y={hy} rot={fase === "llega" ? 6 : -4} s={0.95} /></g>
        <Arista base={1250} />
        <Roca x={xa} y={rocaDe(xa)} />
        <Escalador x={xa} y={ha} quien="joe" s={s} aspecto={ELLA} Cabeza={cabezaElla()} pose="sentado" cara={fase === "llega" ? "alivio" : "miedo"} mira={1} angulos={{ cabeza: fase === "llega" ? -40 : -10 }} frontal sombra={sueloY(xa)} />
        <Vaho x={xa + 30 * s} y={ha - 150 * s} fuerza={0.9} />
        <Escalador x={xe} y={he} quien="joe" s={s} aspecto={EL} mochila cara="normal" mira={-1}
          angulos={fase === "rechaza" ? { cabeza: -10 + 14 * no, brazoA: [88 + 22 * no, 92 + 22 * no], brazoB: [92 - 22 * no, 88 - 22 * no] } : { cabeza: -30 }} sombra={sueloY(xe)} />
        <Viento n={60} fuerza={1.6} op={0.55} />
      </Svg>
      <Hora t={hora} />
      {serie && <div style={{ position: "absolute", top: 365, left: 0, right: 0, textAlign: "center", fontFamily: T.fuenteTexto, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: "#fff", opacity: f >= 15 ? 0.9 : 0, textShadow: "0 2px 8px #000" }}>DECISIONES LÍMITE #2</div>}
      <Etiqueta texto={titulo} top={370} tam={110} desde={6} />
      {final && tFinal !== undefined && f >= tFinal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,11,20,.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center", fontFamily: T.fuenteTitulo, fontWeight: 800, fontSize: 84, lineHeight: 1.1, color: "#fff" }}>{final}</div>
      )}
    </Camara>
  );
};
export const Helicoptero: React.FC<P> = ({ e, d }) => <PlanoHeli d={d} fase="llega" hora={e.titulo} />;
export const Rechazo: React.FC<P> = ({ d }) => <PlanoHeli d={d} fase="rechaza" hora="22:00" />;
export const Abre: React.FC<P> = ({ e, d }) => <PlanoHeli d={d} fase="abre" hora={e.titulo} serie />;
export const CierreHeli: React.FC<P> = ({ e, d }) => <PlanoHeli d={d} fase="abre" hora="22:00" titulo={e.titulo} />;
