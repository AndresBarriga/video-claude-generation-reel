// s5: «En un estudio, nueve de cada diez escaladores escalaban con dolor de pies.» Diez escaladores distintos al pie de la placa:
// cinco sentados en un banco de piedra y cinco de pie detrás, sobre un escalón. El contador sube y, uno a uno, nueve levantan el pie con cara de dolor.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Escalador, type Angulos } from "../../piezas/Escalador";
import type { Aspecto } from "../../piezas/Rasgos";
import { fuenteTexto } from "../../tema";
import { Svg, clamp, cam, Rotulo, T, type P } from "./comun";
import { FondoP, Placa, SUELO_P, luz } from "./Placa";

const p = (chaqueta: string, chaquetaSombra: string, piel: string, pielSombra: string, r: Partial<Aspecto>): Aspecto => ({ chaqueta, chaquetaSombra, piel, pielSombra, pantalon: "#2E3440", casco: null, manos: "piel", ...r });
const GENTE: (Aspecto & { pies: string })[] = [
  { ...p("#C8553D", "#8F3A29", "#C99A72", "#A67A55", { pelo: "#2A1B14", peinado: "melena" }), pies: "#E2B93B" },
  { ...p("#2F6F8F", "#1F4E66", "#EBC2A0", "#CC9C78", { pelo: "#B98A3A", peinado: "corto", barba: "#B98A3A" }), pies: "#D9614A" },
  { ...p("#E0A526", "#A87A14", "#8A5A3C", "#6B442C", { pelo: "#17100C", peinado: "rizado" }), pies: "#3FA7A0" },
  { ...p("#5E8A4A", "#42663A", "#E3B089", "#C48E66", { gorro: "#33475E", pelo: "#5A3A22", peinado: "coleta" }), pies: "#E8E4DA" },
  { ...p("#6D5B9A", "#4B3F70", "#D9A77E", "#B8875F", { pelo: "#3B2A20", peinado: "rapado", gafas: true }), pies: "#E2B93B" },
  { ...p("#3FA7A0", "#2B7570", "#B9825A", "#94613E", { pelo: "#1E1612", peinado: "trenzas" }), pies: "#D9614A" },
  { ...p("#D9614A", "#9C3F2E", "#EBC2A0", "#CC9C78", { casco: "#F2EFE6", pelo: "#8A4A22", barba: "#8A4A22" }), pies: "#5B86C9" },
  { ...p("#33475E", "#22303F", "#C99A72", "#A67A55", { pelo: "#C9B79A", peinado: "corto", gafas: true }), pies: "#E2B93B" },
  { ...p("#B8862B", "#86601A", "#E3B089", "#C48E66", { gorro: "#C74B3A", pelo: "#2A1B14", peinado: "melena" }), pies: "#3FA7A0" },
  { ...p("#3F8F63", "#2C6A48", "#8A5A3C", "#6B442C", { pelo: "#17100C", peinado: "corto" }), pies: "#8FB05A" },
];
const SENT: Angulos = { torso: -4, cabeza: 6, brazoA: [22, 64], brazoB: [14, 58], piernaA: [80, 0], piernaB: [72, -2] };
const PIE: Angulos = { torso: 0, cabeza: 6, brazoA: [14, 20], brazoB: [-12, -8], piernaA: [6, 0], piernaB: [-6, 0] };
const TERRAZA = SUELO_P - 190, BANCO = SUELO_P - 80;

export const Estudio: React.FC<P> = ({ e, d, pal }) => {
  const f = useCurrentFrame();
  const fN = pal("nueve") ?? 28, L = luz(0.3);
  const n = Math.round(interpolate(f, [fN, fN + 22], [0, 9], clamp));
  const z = interpolate(f, [0, d], [1.16, 1.24], clamp);
  const uno = (i: number) => {
    const detras = i % 2 === 1, k = Math.floor(i / 2), x = (detras ? 110 : 190) + k * 172, sano = i === 8;
    const fi = fN + (i + 1) * 2.4, t = f - fi, duele = !sano && t >= 0, sac = duele ? Math.sin(t * 0.9) * Math.exp(-t / 26) : 0, sube = duele ? Math.min(1, t / 4) : 0;
    const base = detras ? PIE : SENT;
    const a: Angulos = sano ? { ...base, piernaA: [80 + Math.sin(f / 5) * 5, 8 + Math.sin(f / 5) * 8], cabeza: -4 }
      : { ...base, cabeza: base.cabeza + sube * 16, torso: base.torso + sube * (detras ? 8 : 16), piernaA: detras ? [6 + sube * 44, -sube * 50 + sac * 14] : [80 + sube * 12 + sac * 6, sube * 26 + sac * 16], brazoA: detras ? [14 + sube * 40, 20 + sube * 30] : [22 + sube * 30, 64 - sube * 20] };
    return <Escalador key={i} x={x} y={(detras ? TERRAZA - 136 : BANCO - 7) - (duele ? Math.max(0, Math.sin(Math.min(t, 6) * 0.52)) * 12 : 0)} quien="joe" angulos={a} cara={sano ? "alivio" : duele ? "dolor" : "normal"} aspecto={GENTE[i]} pies={GENTE[i].pies} mira={i % 4 < 2 ? 1 : -1} sombra={detras ? TERRAZA + 4 : undefined} />;
  };
  return (
    <AbsoluteFill>
      <Svg>
        <FondoP h={0.3} cx={500} cy={2260} z={z} />
        <g transform={cam(505, 2330, z)}>
          <Placa h={0.3} cintas={99999} />
          {/* escalón de roca (detrás) y banco de piedra (delante) */}
          <path d={`M-200 ${TERRAZA} Q300 ${TERRAZA - 16} 1000 ${TERRAZA + 4} L1100 ${SUELO_P + 20} L-200 ${SUELO_P + 20} Z`} fill={L.rocaS} stroke={T} strokeWidth={5} />
          <path d={`M-200 ${TERRAZA + 2} Q300 ${TERRAZA - 14} 1000 ${TERRAZA + 6}`} stroke={L.rocaL} strokeWidth={10} fill="none" />
          {[1, 3, 5, 7, 9].map(uno)}
          <ellipse cx={540} cy={SUELO_P + 12} rx={520} ry={20} fill="#000" opacity={0.25} />
          <path d={`M90 ${BANCO} Q520 ${BANCO - 12} 980 ${BANCO + 2} L970 ${BANCO + 44} Q520 ${BANCO + 36} 100 ${BANCO + 46} Z`} fill={L.roca} stroke={T} strokeWidth={5} strokeLinejoin="round" />
          {[150, 520, 900].map((x) => <rect key={x} x={x} y={BANCO + 40} width={70} height={44} rx={10} fill={L.rocaS} stroke={T} strokeWidth={5} />)}
          {[0, 2, 4, 6, 8].map(uno)}
        </g>
      </Svg>
      <Rotulo texto={`${n} de 10`} desde={fN - 4} top={236} tam={170} color={n >= 9 ? "#FF6A1F" : "#fff"} sub="con dolor de pies al escalar" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1318, textAlign: "center", fontFamily: fuenteTexto, fontWeight: 700, fontSize: 30, color: "#fff", opacity: interpolate(f, [fN, fN + 8], [0, 0.92], clamp), textShadow: "0 2px 6px #000, 0 0 3px #000" }}>{e.fuente}</div>
    </AbsoluteFill>
  );
};
