// Piezas de E59: envoltorios finos sobre el KIT (src/piezas/kit) con la vía y el reparto de este vídeo.
import React from "react";
import { Asegurador, Persona, Expres, Presas, Cintas, Plano as PlanoKit, Fondo, Cueva, aparato, type Pt } from "../../piezas/kit";
import { VIA, ELLA, EL, HY, xF, SUELO, type Angulos, type Cara } from "./comun";
export { Soga, Polvo, Mordida, Diente } from "../../piezas/kit";
export type { Pt };

export const Via: React.FC = () => <g><Presas via={VIA} /><Cintas via={VIA} /></g>;
/** La 1.ª cinta otra vez, por delante de la escaladora (su pie la taparía). */
export const Chapa1: React.FC = () => <Expres x={xF(HY[0])} y={HY[0]} />;
export const Mundo: React.FC<{ children: React.ReactNode }> = ({ children }) => <><Cueva /><Via />{children}</>;
export const Plano: React.FC<{ cx: number; cy: number; z: number; sh?: number; children: React.ReactNode }> = ({ cx, cy, z, sh = 0, children }) => (
  <PlanoKit via={VIA} cx={cx} cy={cy} z={z} sh={sh} fondo={<Fondo cx={cx} cy={cy} z={z} />} mundo={<><Cueva /><Via /></>}>{children}</PlanoKit>
);
export const apDe = (x: number, dy = 0) => aparato(VIA, x, dy);
export const Aseg: React.FC<{ x: number; dy?: number; cara?: Cara; comba?: number; feed?: number; paso?: number; alza?: number; pilaDx?: number; pilaR?: number }> = (p) => <Asegurador via={VIA} aspecto={EL} {...p} />;
export const Ella: React.FC<{ p: { x: number; y: number }; ang: Angulos; cara?: Cara; rot?: number; tiembla?: number; sombra?: boolean }> = ({ p, ang, cara = "miedo", rot = 0, tiembla = 0, sombra }) => (
  <Persona p={p} ang={ang} aspecto={ELLA} cara={cara} rot={rot} tiembla={tiembla} sombra={sombra ? SUELO : undefined} />
);
