// s1: abajo: «¡Suéltate, te tengo!» · arriba: «¡Ya voy!» · «Y no vas»: el reloj de colgado se dispara.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Svg, Etiqueta, clamp, type P, Fondo, Cueva, CuerdaSL, Tu, Asegura, Bocadillo, ARRIBA, ASE, ANG_AGARRE, cam } from "./comun";

// abre (E47B): primer plano del escalador agarrado desde el frame 0 + rótulo de gancho.
export const YaVoy: React.FC<P> = ({ e, d, pal }) => {
  const abre = !!(e as { abre?: boolean }).abre;
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const fS = pal("sueltate") ?? 20, fTu = pal("tu") ?? 62, fYa = pal("ya") ?? 78, fNo = pal("no") ?? 100;
  const arriba = abre || f >= fTu;
  const cx = arriba ? ARRIBA.x + 30 : ASE.x - 70, cy = arriba ? interpolate(f, [fTu, d], [700, 680], clamp) : interpolate(f, [0, fTu], [ASE.y - 260, ASE.y - 300], clamp);
  const z = abre ? interpolate(f, [0, fNo, d], [2.0, 1.75, 2.1], clamp) : arriba ? interpolate(f, [fTu, fNo, d], [1.6, 1.7, 2.1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : interpolate(f, [0, fTu], [1.45, 1.55], clamp);
  const b1 = spring({ frame: f - fS, fps, config: { damping: 12, stiffness: 200 } });
  const b2 = spring({ frame: f - fYa, fps, config: { damping: 12, stiffness: 200 } });
  const seg = Math.round(interpolate(f, [fNo, d], [12, 47], { ...clamp, easing: Easing.in(Easing.quad) }));
  return (
    <AbsoluteFill>
      <Svg>
        <Fondo cx={cx} cy={cy} z={z} />
        <g transform={cam(cx, cy, z)}>
          <Cueva />
          <CuerdaSL arnes={ARRIBA} />
          <Asegura cara="normal" />
          <Tu x={ARRIBA.x} y={ARRIBA.y} ang={ANG_AGARRE} tiembla={Math.sin(f * 1.9) * 3} cara={f >= fNo ? "esfuerzo" : "miedo"} />
        </g>
      </Svg>
      {!arriba && f >= fS && <Bocadillo x={540} y={620} texto="¡SUÉLTATE, TE TENGO!" s={b1} />}
      {abre && f >= fS && f < fYa && <Bocadillo x={540} y={1250} texto="¡SUÉLTATE, TE TENGO!" s={b1} />}
      {abre && f < fYa && <Etiqueta texto="¿POR QUÉ NO TE SUELTAS?" desde={-15} top={300} tam={92} />}
      {arriba && f >= fYa && <Bocadillo x={600} y={520} texto="¡YA VOY!" s={b2} />}
      {f >= fNo && (
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: "Figtree", fontWeight: 700, fontSize: 52, color: "#fff", background: "rgba(5,11,20,.78)", borderRadius: 44, padding: "8px 34px", letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>
            COLGADO <span style={{ color: "#FF6A1F" }}>0:{String(seg).padStart(2, "0")}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
