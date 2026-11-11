// Vista partida reutilizable: izquierda = tú en la vía larga; derecha = tu compañero en la cueva. Cada lado con su caída y su cámara.
import React from "react";
import { Panel, Divisor, Larga, AseguraL, CuerdaL, CuerdaC, Esc, caidaCorta, caidaLarga, L_ARRIBA, C_ARRIBA, TU_L, TU_CUEVA, Fondo, Cueva, Asegura, golpe } from "./comun";

export type Cam = { cx: number; cy: number; z: number };
export const camL0: Cam = { cx: 400, cy: 1150, z: 1.05 };

export const Dos: React.FC<{ f: number; fL: number; fR: number; camL?: Cam; camR?: Cam; oscL?: number; oscR?: number; brilloL?: number; brilloR?: number; seguroL?: { x: number; y: number }; resetL?: boolean; resetR?: boolean }> = ({ f, fL, fR, camL, camR, oscL = 0, oscR = 0, brilloL = 0, brilloR = 0, seguroL, resetL, resetR }) => {
  const pl = resetL ? caidaCorta(0, L_ARRIBA.y, L_ARRIBA.x) : caidaCorta(fL, L_ARRIBA.y, L_ARRIBA.x);
  const pr = resetR ? caidaLarga(0, C_ARRIBA.y, C_ARRIBA.x) : caidaLarga(fR, C_ARRIBA.y, C_ARRIBA.x);
  const dyL = pl.frenada ? -46 * Math.exp(-(fL - 19) / 6) : 0; // tirón seco hacia la reunión
  const dyR = pr.frenada ? -26 * Math.exp(-(fR - 44) / 14) : 0; // la aseguradora sube un poco: frenada dinámica
  const cl = camL ?? camL0;
  const cr = camR ?? { cx: pr.x + 70, cy: Math.min(2050, pr.y + 80), z: 0.95 };
  const shL = pl.frenada ? golpe(fL, 19, 22) : 0;
  return (
    <>
      <Panel lado={0} cx={cl.cx} cy={cl.cy} z={cl.z} oscuro={oscL} sh={shL}>
        <Larga f={f} />
        <CuerdaL arnes={pl} dy={dyL} floja={pl.floja} seguro={seguroL} brillo={brilloL} />
        <AseguraL dy={dyL} al={pl} cara={pl.frenada ? "dolor" : "normal"} />
        <Esc p={pl} a={TU_L} cara={pl.frenada ? "dolor" : "miedo"} />
      </Panel>
      <Panel lado={1} cx={cr.cx} cy={cr.cy} z={cr.z} oscuro={oscR} fondo={<Fondo cx={cr.cx} cy={cr.cy} z={cr.z} />}>
        <Cueva />
        <CuerdaC arnes={pr} dy={dyR} floja={pr.floja} brillo={brilloR} />
        <Asegura dy={dyR} cara={pr.frenada ? "esfuerzo" : "normal"} />
        <Esc p={pr} a={TU_CUEVA} cara={pr.frenada ? "alivio" : "miedo"} />
      </Panel>
      <Divisor />
    </>
  );
};
