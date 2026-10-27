// «El último pegue cae justo donde se cruzan»: el sol baja (fuerza) y las marcas de magnesio suben (memoria) hasta la misma altura: el paso clave.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fuenteTexto } from "../../tema";
import { Escalador } from "../../piezas/Escalador";
import { C, CRUX, Camara, Cielo, Pared, Svg, Zoom, clamp, enCara, type P } from "./comun";

const Pil: React.FC<{ texto: string; x: number; y: number; color: string; op: number }> = ({ texto, x, y, color, op }) => (
  <div style={{ position: "absolute", left: x - 150, top: y - 34, width: 300, display: "flex", justifyContent: "center", opacity: op }}>
    <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 44, color: C.tinta, background: color, borderRadius: 40, padding: "4px 24px" }}>{texto}</div>
  </div>
);

export const Cruce: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const tX = pal("cruzan.") ?? Math.round(d * 0.7);
  const k = interpolate(f, [0, tX], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const h = 0.6 + 0.2 * k; // el sol llega al horizonte justo al decir «cruzan»
  const pulso = interpolate(f, [tX, tX + 14], [0, 1], clamp);
  const sy = interpolate(h, [0, 0.8], [430, 1150], clamp);
  const s = 1.15, cxW = 680, ty = 1150;
  const xCrux = cxW + (enCara(CRUX) - cxW) * s;
  const yMarca = interpolate(k, [0, 1], [1900, ty]); // la línea de marcas sube por la pared
  const xm = xCrux + 90;
  return (
    <Camara d={d} empuje={0.05} foco="45% 60%">
      <Svg>
        <Cielo h={h} id="cru" />
        <Zoom s={s} cx={cxW} cy={CRUX} tx={cxW} ty={ty}>
          <Pared h={h} marcas={7 * k} />
          <Escalador x={enCara(CRUX) - 70} y={CRUX + 150} quien="joe" pose="colgado" s={0.95} mira={-1} cara={pulso > 0.2 ? "esfuerzo" : "normal"}
            angulos={{ cabeza: -20 + pulso * 20, brazoA: [150, 165] }} />
        </Zoom>
        <path d={`M250 560 L250 ${sy}`} stroke={C.sol} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
        <path d={`M${xm} 1900 L${xm} ${yMarca}`} stroke={C.magnesio} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        <circle cx={xm} cy={yMarca} r={14} fill={C.magnesio} />
        {pulso > 0 && <>
          <path d={`M330 ${ty} L${xm - 20} ${ty}`} stroke={C.cuerda} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${pulso * 700} 2000`} />
          <circle cx={xCrux} cy={ty - 6} r={30 + pulso * 80} fill="none" stroke={C.cuerda} strokeWidth={10 * (1 - pulso) + 3} opacity={1 - pulso * 0.6} />
        </>}
      </Svg>
      <Pil texto="Fuerza" x={250} y={480} color={C.sol} op={1} />
      <Pil texto="Memoria" x={930} y={Math.min(1360, yMarca + 70)} color={C.magnesio} op={1} />
    </Camara>
  );
};
