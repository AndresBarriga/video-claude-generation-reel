// s7 CIERRE: otra vez arriba, con la cuerda en la mano antes de chapar: mira la puerta (lupa de frente, puerta al lado bueno, ✓).
// Envío en rótulo y, en los últimos fotogramas, vuelta al fotograma 0 del gancho (bucle).
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Plano, Persona, Asegurador, Soga, aparato, accChapar, sogaChapar, Lupa, Envio, Sello, Pregunta } from "../../piezas/kit";
import { suave, type P, VIA, TU, ASE, TOP, B6, XASE, VERDE } from "./comun";
import { PlanoGancho } from "./Gancho";
import { CintaF, ParedCerca } from "./Macro";

export const Cierre: React.FC<P> = ({ d, pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  if (f >= d - 8) return <PlanoGancho f={0} />;
  const fM = pal("mira") ?? 42, p = VIA.cadera(B6.y + 96), t = 0.24 + 0.4 * suave(f / fM) + 0.36 * suave((f - fM - 22) / 16);
  const a = accChapar(VIA, p, TOP, t), k = spring({ frame: f - fM + 6, fps, config: { damping: 12, stiffness: 170 } });
  return (
    <>
      <Plano via={VIA} cx={520} cy={B6.y + 120} z={1.5 + f * 0.002} decorado="roca">
        <Asegurador via={VIA} x={XASE} aspecto={ASE} cuerda={false} alza={1} />
        <Soga pts={sogaChapar(VIA, aparato(VIA, XASE), TOP, p, a)} />
        <Persona p={p} ang={{ ...a.ang, cabeza: -34 }} aspecto={TU} cara={a.chapada ? "alivio" : "serio"} />
      </Plano>
      <Lupa x={300} y={960} r={250} k={k} fondo="#CDBB9E">
        <g transform="scale(0.9)"><ParedCerca seed="ci" /><CintaF x={-30} y={-250} s={0.62} puerta="izq" haloArriba={VERDE} haloAbajo={VERDE} /></g>
      </Lupa>
      <Sello x={470} y={790} ok k={suave((f - fM - 4) / 8)} s={0.8} />
      <Envio a="tu cordada" k={suave((f - fM - 10) / 10)} top={1255} />
      <Pregunta texto="¿SE SUELTA?" tam={112} />
    </>
  );
};
