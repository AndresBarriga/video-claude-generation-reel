// s3: la cámara baja por las chapas hasta la 2.ª (se marca en rojo) → «alto»: regla desde el suelo hasta su cadera →
// «bajo»: fantasma rojo donde la pararía la cuerda: con los pies bajo el suelo.
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Escalador } from "../../piezas/Escalador";
import { Pildora, Dato } from "../Factor/comun";
import { clamp, type P, ALTO, B1, HY, SUELO, PC, PM, FANTASMA, ANG_COLGADO, xF, nudo, mano, pAlto } from "./comun";
import { Plano, Soga, Aseg, Ella, Chapa1 } from "./piezas";

export const Peligrosa: React.FC<P> = ({ pal }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), io = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const fPel = pal("peligrosa") ?? 55, fAlto = pal("alto") ?? 77, fBajo = pal("bajo") ?? 121;
  const baja = interpolate(f, [0, fPel - 12], [0, 1], io), abre = interpolate(f, [fAlto - 8, fAlto + 12], [0, 1], io);
  const cx = 720 + (ALTO.x + 40 - 720) * baja + (600 - ALTO.x - 40) * abre, cy = 1380 + (1960 - 1380) * baja + (2270 - 1960) * abre, z = 1.3 + 0.2 * baja + (1.0 - 1.5) * abre;
  const S = (wx: number, wy: number) => ({ x: 540 + (wx - cx) * z, y: 960 + (wy - cy) * z });
  const ang = { ...pAlto(f), cabeza: -30 + 44 * interpolate(f, [fBajo - 4, fBajo + 6], [0, 1], clamp) }, h = mano(ang), H = { x: ALTO.x + h.x, y: ALTO.y + h.y };
  const rojo = spring({ frame: f - fPel, fps, config: { damping: 10, stiffness: 170 } });
  const regla = interpolate(f, [fAlto, fAlto + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }), rx = ALTO.x - 150, alto = (SUELO - ALTO.y) * regla;
  const fan = interpolate(f, [fBajo, fBajo + 10], [0, 1], clamp), G = { x: B1.x - 18, y: B1.y + 440 }, dR = S(rx, SUELO - alto), dF = S(G.x, G.y);
  return (
    <>
      <Plano cx={cx} cy={cy} z={z}>
        <Aseg x={470} comba={0.2} alza={1} />
        {rojo > 0.01 && <circle cx={xF(HY[1]) + 4} cy={HY[1]} r={(40 + 6 * Math.sin(f / 3)) * rojo} fill="none" stroke={PC.miedo} strokeWidth={9} />}
        {regla > 0 && <g><path d={`M${rx} ${SUELO} V${SUELO - alto}`} stroke="#050B14" strokeWidth={16} strokeLinecap="round" /><path d={`M${rx} ${SUELO} V${SUELO - alto}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" />
          {[0, 1, 2, 3].map((m) => SUELO - m * PM >= SUELO - alto && <path key={m} d={`M${rx - 18} ${SUELO - m * PM} h36`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />)}
          <path d={`M${rx - 22} ${SUELO - alto} h44`} stroke="#fff" strokeWidth={8} strokeLinecap="round" /></g>}
        {fan > 0 && <g opacity={0.72 * fan}><Soga pts={[B1, nudo(G)]} fantasma /><Escalador x={G.x} y={G.y} quien="joe" angulos={ANG_COLGADO} cara="miedo" aspecto={FANTASMA} mira={1} /></g>}
        {fan > 0 && <path d={`M250 ${SUELO} H1000`} stroke="#fff" strokeWidth={5} strokeDasharray="18 12" opacity={0.8 * fan} />}
        <Ella p={ALTO} ang={ang} cara="miedo" tiembla={Math.sin(f * 1.9) * 2.5} />
        <Chapa1 /><Soga pts={[B1, { ...H, sx: -34 }, { ...nudo(ALTO), sag: 30, sx: -84 }]} />
      </Plano>
      {[0, 1, 2].map((i) => { const s = S(xF(HY[i]) + 96, HY[i] + 8), es2 = i === 1; return abre < 0.5 && s.y > 240 && s.y < 1380 ? <div key={i} style={{ position: "absolute", left: s.x, top: s.y, transform: `translate(-50%,-50%) scale(${es2 ? 1 + 0.35 * rojo : 1})`, fontFamily: "Bricolage Grotesque", fontWeight: 800, fontSize: 70, color: es2 && rojo > 0.3 ? PC.miedo : "#fff", WebkitTextStroke: "10px #050B14", paintOrder: "stroke fill", opacity: 1 - abre * 2 }}>{i + 1}.ª</div> : null; })}
      {regla > 0 && <Dato x={dR.x - 30} y={dR.y - 64} texto={`${(3.4 * regla).toFixed(1).replace(".", ",")} m`} s={Math.min(1, regla * 3) * (1 - fan)} tam={84} />}
      {fan > 0 && <Pildora x={Math.min(760, dF.x - 10)} top={dF.y - 330} texto="AQUÍ TE PARARÍA LA CUERDA" color={PC.miedo} o={fan} />}
    </>
  );
};
