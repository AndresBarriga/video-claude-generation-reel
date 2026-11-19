// E63 v5 — bloques 8-9: tres reglas (1-2-3 con candados) y CTA (se los quita al bajar · guardar · enviar · piel/sintético).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FondoInfo, Cifra, Pasos, Tarjeta, Nota, Guardar, HojaEnviar, Chip, INFO } from "../../piezas/kit";
import { Puntera } from "../Gatos/Puntera";
import { garraPara } from "../Gatos/Gato";
import { Cierre } from "../Gatos/Cierre";
import { Svg, G, type P } from "../Gatos/comun";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GJ = garraPara(26);

export const Reglas: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), f1 = pal("una") ?? 30, f2 = pal("dos") ?? 110, f3 = pal("diez") ?? 170, fD = pal("deseando") ?? 260;
  const actual = f < f2 ? 1 : f < f3 ? 2 : f < fD ? 3 : 4;
  return (
    <AbsoluteFill>
      <FondoInfo />
      <Pasos actual={Math.min(actual, 3)} y={400} k={(f - 4) / 8} />
      {f < f1 && <Cifra texto="3 REGLAS" y={760} k={f / 8} color="#fff" tam={150} />}
      {actual === 1 && f >= f1 && <>
        <Svg><Puntera k={34} x={900} y={1060} L={26} g={GJ} halo={G.bien} haloO={1} /></Svg>
        <Nota texto="UN POCO DOBLADOS, NO EN PUÑO" x={460} y={720} x2={860} y2={1010} k={(f - f1) / 8} color={INFO.verde} />
      </>}
      {actual === 2 && <Cifra texto="0 mm" etiqueta="de aire en el talón" y={700} k={(f - f2) / 10} color={INFO.verde} tam={200} />}
      {actual >= 3 && <>
        <Cifra texto={(() => { const s = Math.round(600 * Math.max(0, Math.min(1, 1 - (f - f3) / Math.max(1, fD - f3)))); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; })()} etiqueta="minutos de pie en la tienda" y={620} k={(f - f3) / 8} color={INFO.naranja} tam={200} />
        <Tarjeta ok={false} titulo="Son pequeños" sub="si estás deseando quitártelos" x={540} y={1000} k={(f - fD) / 8} ancho={620} />
      </>}
    </AbsoluteFill>
  );
};

export const Cta: React.FC<P> = (p) => {
  const f = useCurrentFrame(), fG = p.pal("guárdalo") ?? 4, fM = p.pal("mándaselo") ?? 50, d = p.d;
  return (
    <AbsoluteFill>
      <Cierre {...p} e={{ ...p.e, v2: true } as P["e"]} pal={(w) => (w === "quitándotelos" ? 20 : w === "bajar" ? 46 : p.pal(w))} />
      <div style={{ opacity: interpolate(f, [fM - 4, fM + 2], [1, 0], cl) }}><Guardar k={(f - fG) / 8} y={420} /></div>
      <HojaEnviar k={(f - fM) / 40} para="Al que dice «ya darán de sí»" />
      <Chip texto="PIEL +½ TALLA · SINTÉTICO ≈ 0" top={420} tam={44} k={(f - (d - 40)) / 8} />
    </AbsoluteFill>
  );
};
