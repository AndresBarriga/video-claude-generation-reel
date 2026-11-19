// E63 v5 — bloques 1-4: gancho (tienda, 180 €), reencuadre (MASOQUISMO tachado → 0 mm de aire), por dentro (con aire / una sola pieza), analogía (chanclas en el bordillo).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FondoInfo, Cifra, Barra, Nota, Sello, INFO } from "../../piezas/kit";
import { Compra } from "../Gatos/Compra";
import { Hueco } from "../Gatos/Hueco";
import { Puntera, Ventana } from "../Gatos/Puntera";
import { garraPara } from "../Gatos/Gato";
import { Svg, G, type P } from "../Gatos/comun";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GJ = garraPara(26);
const remap = (pal: P["pal"], m: Record<string, string>) => (w: string) => pal(m[w] ?? w);

export const Gancho: React.FC<P> = (p) => <Compra {...p} e={{ ...p.e, v2: true } as P["e"]} pal={remap(p.pal, { daño: "doler" })} />;

export const Reencuadre: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fM = pal("masoquismo") ?? 2, fA = (pal("milímetro") ?? 80) + 20, fP = pal("parezca") ?? 40;
  const tacha = interpolate(f, [fP, fP + 8], [0, 1], cl), sale = interpolate(f, [fA - 30, fA - 20], [1, 0], cl);
  return (
    <AbsoluteFill>
      <FondoInfo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: interpolate(f, [fM, fM + 5], [0, 1], cl) * sale, transform: `scale(${1 + 0.04 * Math.sin(f / 3)})` }}>
        <span style={{ position: "relative", fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 140, color: "#fff" }}>
          MASOQUISMO
          <i style={{ position: "absolute", left: -10, top: "52%", height: 16, width: `${tacha * 104}%`, background: INFO.rojo, transform: "rotate(-4deg)" }} />
        </span>
      </div>
      {f > fM && sale > 0 && <Sello x={540} y={560} ok={false} k={(f - fP) / 8} />}
      {sale < 1 && (
        <>
          <Svg><Ventana x={60} y={760} w={960} h={520} borde={G.bien}><Puntera k={78} x={720} y={360} L={26} g={GJ} halo={G.bien} haloO={1 - sale} /></Ventana></Svg>
          <Cifra texto="0 mm" etiqueta="de aire dentro del gato" y={430} k={(f - (fA - 20)) / 10} color={INFO.verde} tam={170} />
        </>
      )}
    </AbsoluteFill>
  );
};

export const Dentro: React.FC<P> = (p) => {
  const f = useCurrentFrame(), fD = p.pal("dobla") ?? 50, fU = p.pal("pieza") ?? 150;
  return (
    <AbsoluteFill>
      <Hueco {...p} pal={remap(p.pal, { hueco: "dobla" })} />
      <Barra valor={0.25} desde={1} etiqueta="fuerza" x={540} y={1380} alto={240} k={(f - fD) / 14} color={INFO.naranja} />
      <Nota texto="UNA SOLA PIEZA" x={300} y={1420} x2={560} y2={1160} k={(f - fU + 6) / 8} color={INFO.verde} />
    </AbsoluteFill>
  );
};

/** Chancla enorme subiendo un bordillo: el pie resbala dentro. */
export const Analogia: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("chanclas") ?? 20, sube = interpolate(f, [4, 22], [0, 1], cl), resbala = interpolate(f, [fC, fC + 14], [0, 1], cl);
  const x = 180 + sube * 200, y = 1150 - sube * 90;
  return (
    <AbsoluteFill>
      <FondoInfo tinte="#24324D" />
      <Svg>
        <rect x={0} y={1250} width={1080} height={700} fill="#3A4558" /><rect x={560} y={1060} width={560} height={900} fill="#9AA3AF" stroke="#06101C" strokeWidth={10} /><rect x={560} y={1060} width={560} height={40} fill="#C9D1DC" />
        <g transform={`translate(${x} ${y}) scale(1.5) rotate(${-sube * 18 + resbala * 10})`}>
          <path d="M-260 40 Q-280 -30 -200 -40 L240 -40 Q330 -30 320 30 Q300 70 220 70 L-200 70 Q-260 70 -260 40 Z" fill="#F5A524" stroke="#06101C" strokeWidth={10} />
          <path d="M-40 -40 Q20 -110 80 -40" stroke="#E5484D" strokeWidth={18} fill="none" />
          <g transform={`translate(${-60 + resbala * 150} ${-60 - resbala * 10})`}>
            <path d="M-160 20 Q-170 -40 -110 -50 L80 -50 Q150 -48 160 0 Q150 30 90 30 L-130 30 Z" fill={G.piel} stroke="#06101C" strokeWidth={8} />
            <rect x={-150} y={-240} width={90} height={200} rx={30} fill="#2E3440" stroke="#06101C" strokeWidth={8} />
          </g>
        </g>
      </Svg>
      <Cifra texto="+5" etiqueta="números de más" y={440} k={(f - 6) / 10} color={INFO.naranja} tam={170} />
      {resbala > 0.5 && <Sello x={880} y={860} ok={false} k={(resbala - 0.5) * 2} />}
    </AbsoluteFill>
  );
};
