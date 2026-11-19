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

/** Chancla cinco números más grande subiendo a un bordillo: la punta sobra, se dobla en el borde y el pie resbala dentro. */
export const Analogia: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), fC = pal("chanclas") ?? 20;
  const sube = interpolate(f, [2, 20], [0, 1], cl), dobla = interpolate(f, [fC, fC + 8], [0, 1], cl), resbala = interpolate(f, [fC + 4, fC + 16], [0, 1], cl);
  const BX = 600, BY = 1150; // borde del bordillo
  const x = -120 + sube * 270, y = BY + 150 - sube * 172; // talón: de la calle al borde del bordillo
  const T = "#06101C", PIEL = G.piel;
  return (
    <AbsoluteFill>
      <FondoInfo tinte="#24324D" />
      <Svg>
        {/* acera y bordillo */}
        <rect x={0} y={BY + 170} width={1080} height={700} fill="#2B3445" />
        <path d={`M${BX} ${BY} H1080 V1920 H${BX} Z`} fill="#8C96A6" stroke={T} strokeWidth={10} />
        <rect x={BX} y={BY} width={480} height={26} fill="#C2CAD6" />
        <g transform={`rotate(${-dobla * 16} ${BX} ${BY}) translate(${x} ${y})`}>
          {/* suela enorme: sobra por delante y se dobla en el borde */}
          <path d={`M-40 0 Q-60 -26 -10 -30 L520 -30 Q600 -28 600 0 Q596 22 500 22 L-10 22 Q-60 22 -40 0 Z`} fill="#F5A524" stroke={T} strokeWidth={10} strokeLinejoin="round" />
          {/* pie: resbala hacia delante dentro de la chancla */}
          <g transform={`translate(${resbala * 120} ${-34 + resbala * 6}) rotate(${resbala * 6})`}>
            <path d="M0 0 Q-40 -10 -30 -70 Q-20 -120 30 -130 L60 -140 Q120 -120 200 -80 Q280 -50 330 -40 Q360 -36 358 -14 Q356 4 330 4 Z" fill={PIEL} stroke={T} strokeWidth={9} strokeLinejoin="round" />
            {[0, 1, 2, 3].map((i) => <circle key={i} cx={300 - i * 26} cy={-6 - i * 4} r={13 - i} fill={PIEL} stroke={T} strokeWidth={6} />)}
            <rect x={-10} y={-470} width={120} height={350} rx={40} fill="#2E3440" stroke={T} strokeWidth={9} />
          </g>
          {/* tira de la chancla (entre los dedos) */}
          <path d={`M${120 + resbala * 40} -34 Q${200 + resbala * 60} -120 ${300 + resbala * 40} -40`} stroke="#E5484D" strokeWidth={20} fill="none" strokeLinecap="round" />
        </g>
        
      </Svg>
      <Cifra texto="+5" etiqueta="números de más" y={420} k={(f - 4) / 10} color={INFO.naranja} tam={170} />
      {resbala > 0.3 && <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: "Figtree", fontWeight: 800, fontSize: 46, letterSpacing: 3, color: "#fff", opacity: Math.min(1, resbala * 2) }}>EL PIE RESBALA DENTRO</div>}
      {resbala > 0.5 && <Sello x={880} y={900} ok={false} k={(resbala - 0.5) * 2} />}
    </AbsoluteFill>
  );
};
