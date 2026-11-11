// s3: carrera MIEDO vs CABEZA sobre su cara: el miedo llega de golpe en «salta»; la cabeza se arrastra hasta «tarde».
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Svg, clamp, golpe, type P, Fondo, Cueva, CuerdaSL, Tu, ARRIBA, ANG_AGARRE, cam, PC } from "./comun";
import { fuenteTitulo } from "../../tema";

const Barra: React.FC<{ y: number; nombre: string; v: number; color: string; o: number; dx?: number }> = ({ y, nombre, v, color, o, dx = 0 }) => (
  <div style={{ position: "absolute", top: y, left: 90 + dx, right: 90 - dx, opacity: o, transform: `translateX(${(1 - o) * -60}px)` }}>
    <div style={{ fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 56, color, WebkitTextStroke: "8px #050B14", paintOrder: "stroke fill", marginBottom: 8 }}>{nombre}</div>
    <div style={{ height: 50, borderRadius: 26, background: "rgba(5,11,20,.75)", border: "5px solid #050B14", overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0.02, v) * 100}%`, height: "100%", background: color, borderRadius: 26 }} />
    </div>
  </div>
);

export const Carrera: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const fS = pal("salta") ?? 62, fCab = pal("cabeza") ?? 92, fTa = pal("tarde") ?? 118;
  const miedo = f < fS ? 0.04 + 0.02 * Math.sin(f / 3) : interpolate(f, [fS, fS + 4, fS + 8], [0.05, 1.04, 1], clamp);
  const cabeza = interpolate(f, [fCab - 6, fTa + 8], [0.03, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const sh = golpe(f, fS, 16), late = 1 + 0.025 * Math.max(0, Math.sin(f / 4.5)) ** 8;
  const z = interpolate(f, [0, d], [2.3, 2.6], clamp) * late;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh}px, ${sh * 0.5}px)` }}>
      <Svg>
        <Fondo cx={ARRIBA.x + 20} cy={640} z={z} />
        <g transform={cam(ARRIBA.x + 20, 640, z)}>
          <Cueva />
          <CuerdaSL arnes={ARRIBA} idea={1} />
          <Tu x={ARRIBA.x} y={ARRIBA.y} ang={ANG_AGARRE} tiembla={f >= fS ? Math.sin(f * 2.4) * 4 : Math.sin(f * 1.9) * 2} />
        </g>
        <rect x={0} y={0} width={1080} height={1920} fill="#050B14" opacity={0.35} />
      </Svg>
      <Barra y={1040} nombre="MIEDO" v={miedo} color={PC.miedo} o={interpolate(f, [0, 8], [0, 1], clamp)} />
      <Barra y={1220} nombre="CABEZA" v={cabeza} color={PC.cabeza} o={interpolate(f, [3, 11], [0, 1], clamp)} />
      {f >= fS + 2 && <div style={{ position: "absolute", top: 1036, right: 100, fontFamily: fuenteTitulo, fontWeight: 800, fontSize: 52, color: "#fff", WebkitTextStroke: "8px #050B14", paintOrder: "stroke fill" }}>1.º</div>}
    </AbsoluteFill>
  );
};
