// 3 · Amanece: el mismo hombre, sentado al borde. Primer plano y tres marcas: sin guantes, sin gorro, traje abierto.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Camara, HALL, Marca, Nieve, Svg, Zoom, sube, type P } from "./comun";
import { Arista } from "./Arista";
import { CABEZA, CADERA, Sentado, Vaho } from "./Piezas";

export const Alba: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame();
  const luz = sube(f, 0, 30);
  const z = 1.2 + 0.9 * sube(f, 10, 40);
  const tG = (pal("guantes") ?? 60) - 4, tH = (pal("gorro") ?? 80) - 4, tT = (pal("traje") ?? 100) - 4;
  // coordenadas en pantalla tras el zoom
  const cx = CADERA.x - 80, cy = CADERA.y - 160, P = (x: number, y: number) => [540 + (x - cx) * z, 1000 + (y - cy) * z];
  const [hx, hy] = P(CADERA.x - 120, CADERA.y - 40), [kx, ky] = P(CABEZA.x, CABEZA.y - 30), [tx, ty] = P(CADERA.x - 20, CADERA.y - 170);
  return (
    <Camara d={d} empuje={0.03} entrada={false}>
      <Svg>
        <Zoom s={z} cx={cx} cy={cy} tx={540} ty={1000}>
          <Arista luz={luz} f={f} />
          <Sentado aspecto={HALL} cabeza={30} cara="cerrados" />
          <path d={`M${CADERA.x - 6} ${CADERA.y - 240} L${CADERA.x + 6} ${CADERA.y - 60}`} stroke="#F4EFE6" strokeWidth={16} strokeLinecap="round" opacity={0.95} />
          <Vaho f={f} x={CABEZA.x - 30} y={CABEZA.y + 30} on={0.7} />
          <Nieve f={f} n={20} op={0.4} />
        </Zoom>
        {f >= tG && <Marca texto="SIN GUANTES" x={hx} y={hy} tx={110} ty={1590} o={sube(f, tG, tG + 6)} />}
        {f >= tH && <Marca texto="SIN GORRO" x={kx} y={ky} tx={540} ty={420} o={sube(f, tH, tH + 6)} />}
        {f >= tT && <Marca texto="TRAJE ABIERTO" x={tx} y={ty} tx={540} ty={560} o={sube(f, tT, tT + 6)} />}
      </Svg>
    </Camara>
  );
};
