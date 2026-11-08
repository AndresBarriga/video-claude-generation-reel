// 2 · Caída (cambio a perfil): el pie salta, cae, la cuerda le engancha la pantorrilla y le da la vuelta. Golpe y corte a negro.
import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Camara, Etiqueta, Svg, golpe, sube, temblor, type P } from "./comun";
import { PlanoPerfil, H0, caida } from "./Perfil";

export const Caida: React.FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const t0 = 10, v = spring({ frame: f - t0, fps: 30, config: { damping: 11, stiffness: 120 } });
  const giro = -170 * sube(f, t0 + 4, t0 + 26) ** 0.8;
  const imp = t0 + 26;
  const negro = f >= d - 9;
  const g = caida(f < t0 ? 0 : v, giro);
  return (
    <Camara d={d} empuje={0.05} sacudida={Math.abs(golpe(f, imp, 16))} entrada={false}>
      <Svg>
        <PlanoPerfil f={f} v={f < t0 ? 0 : v} giro={giro} cara={f < t0 ? "miedo" : "dolor"} tr={f < t0 ? temblor(f, 1.6) : 0}
          zoom={{ s: 1.2, cx: (H0.x + g.hx) / 2, cy: (H0.y + g.hy) / 2 + 60, tx: 540, ty: 1000 }} />
        {f >= imp && f < imp + 3 && <rect width={1080} height={1920} fill="#fff" opacity={0.6} />}
        {negro && <rect width={1080} height={1920} fill="#000" />}
      </Svg>
      {!negro && <Etiqueta texto="TE VOLTEA" top={230} tam={130} desde={imp - 2} />}
    </Camara>
  );
};
