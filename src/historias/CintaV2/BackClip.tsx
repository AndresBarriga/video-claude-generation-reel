// Error 1, de frente: el cabo que va al asegurador y el que va a tu arnés. BIEN: el del asegurador entra por detrás (lado de la pared) y el
// de tu arnés sale por DELANTE. BACK-CLIP: al revés. «Nada de back-clip» → back-clip ✗ · «El tramo que va a tu arnés…» → bien ✓ ·
// «Al revés, al caer…» → back-clip otra vez: al caer, el cabo de tu arnés pasa por encima de la puerta, la abre y se sale.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Destello, Chip, Pasos } from "../../piezas/kit";
import { Svg, clamp, golpe, suave, type P, ROJO, VERDE, CintaF, ParedCerca, CuerdaM, abajoDe, Rot } from "./comun";

const Detras: React.FC<{ d: string }> = ({ d }) => <g><CuerdaM d={d} /><path d={d} stroke="#050B14" strokeWidth={52} fill="none" strokeLinecap="round" opacity={0.32} /></g>;
export const BackClip: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fEl = pal("tramo") ?? 50, fRev = pal("revés") ?? 150, fCae = pal("caer") ?? 165, fSal = (pal("salirse") ?? 215) - 2;
  const bien = f >= fEl && f < fRev, back = !bien, falla = f >= fRev;
  const baja = falla ? suave((f - fCae) / Math.max(1, fSal - fCae)) : 0, fuera = f - fSal;
  const cinta = { x: 470, y: -150, puerta: "der" as const, giro: -6 + (falla && fuera <= 0 ? 26 * baja : 0) + (fuera > 0 ? Math.sin(fuera * 0.45) * 16 * Math.exp(-fuera / 26) : 0),
    abreAbajo: fuera > 0 ? Math.max(0, 1 - fuera / 8) : suave((baja - 0.55) / 0.4), haloAbajo: fuera > 0 ? undefined : bien ? VERDE : ROJO };
  const ab = abajoDe(cinta), th = (-58 + 128 * baja) * Math.PI / 180, L = 1150;
  const ase = `M${ab.x - 170} 2300 Q${ab.x - 120} ${ab.y + 420} ${ab.x - 4} ${ab.y + 44}`;
  const arnes = `M${ab.x - 4} ${ab.y + 44} Q${ab.x + 60} ${ab.y - 40} ${ab.x + 30 + Math.cos(th) * L} ${ab.y + 30 + Math.sin(th) * L}`;
  const z = interpolate(f, [0, fEl, fRev, d], [1.35, 1.5, 1.45, 1.65], clamp), sh = golpe(f, fSal, 16);
  const k1 = interpolate(f, [fEl + 4, fEl + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, 0)` }}>
      <Svg><g transform={`translate(540 980) scale(${z}) translate(${-(ab.x + 60)} ${-(ab.y - 40)})`}>
        <ParedCerca seed="bc" />
        {fuera <= 0 ? <>
          {bien ? <Detras d={ase} /> : <Detras d={arnes} />}
          <CintaF {...cinta} />
          {bien ? <CuerdaM d={arnes} /> : <CuerdaM d={ase} />}
        </> : <>
          <CintaF {...cinta} />
          <CuerdaM d={`M${ab.x - 170 + fuera * 6} 2300 Q${ab.x + 40 + fuera * 14} ${ab.y + 320} ${ab.x + 160 + fuera * 24} ${ab.y + 140 + fuera * 28} T${ab.x + 900} ${ab.y + 1300 + fuera * 40}`} />
        </>}
        <Destello x={ab.x + 50} y={ab.y + 10} k={fuera} r={110} />
      </g></Svg>
      <Pasos actual={1} y={430} k={1} />
      <Chip texto={bien ? "✓ BIEN" : "✗ BACK-CLIP"} top={700} tam={56} color={bien ? "rgba(31,110,64,.92)" : "rgba(178,58,42,.92)"} k={fuera > 0 ? 0 : 1} />
      <Rot x={820} y={1080} texto="A TU ARNÉS ↗" color="#FFE3A0" k={bien ? k1 : 0} tam={56} />
      <Rot x={300} y={1720} texto="AL ASEGURADOR ↓" k={bien ? k1 : 0} tam={50} />
      <Rot x={780} y={1260} texto="DELANTE" color="#8FE0AE" k={bien ? interpolate(f, [fEl + 30, fEl + 38], [0, 1], clamp) : 0} tam={64} />
      <Rot x={300} y={1450} texto="CAES ↓" k={interpolate(f, [fCae - 4, fCae + 4, fSal - 2, fSal + 4], [0, 1, 1, 0], clamp)} tam={78} />
      <Rot x={540} y={1400} texto="¡FUERA!" color="#FF8E7E" k={fuera > 0 ? Math.min(1, fuera / 5) : 0} tam={120} />
    </AbsoluteFill>
  );
};
