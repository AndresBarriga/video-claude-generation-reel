// Primer plano de la MANO sobre una presa, vista por detrás (lo que ve quien escala): el antebrazo baja y el peso cuelga de la presa.
// tipo: "regleta" (dedos arqueados sobre el canto, pulgar encima del índice) · "romo" (mano abierta y plana sobre la bola) ·
// "pinza" (pulgar a un lado del bloque, dedos al otro). cierra 0–1 = de la mano abierta que llega a la mano cerrada que aprieta.
import React from "react";
import { COL, PIEL, T } from "./comun";

const { piel, pielS } = PIEL;
const L = (a: number, b: number, t: number) => a + (b - a) * t;
const dedo = (x: number, largo: number, ancho: number, rot: number, cierra: number, key: number, gancho = true) => (
  <g key={key} transform={`translate(${x} 0) rotate(${rot})`}>
    <rect x={-ancho / 2} y={-largo} width={ancho} height={largo + 30} rx={ancho / 2} fill={piel} stroke={T} strokeWidth={9} />
    {gancho && cierra > 0.3 && <><ellipse cx={0} cy={-largo + 10} rx={ancho / 2 + 2} ry={14 + 10 * cierra} fill={pielS} stroke={T} strokeWidth={8} /><path d={`M${-ancho / 2 + 10} ${-largo * 0.45} h${ancho - 20}`} stroke={pielS} strokeWidth={5} strokeLinecap="round" /></>}
    {!gancho && <path d={`M${-ancho / 2 + 10} ${-largo * 0.45} h${ancho - 20}`} stroke={pielS} strokeWidth={5} strokeLinecap="round" />}
  </g>
);
const Antebrazo: React.FC = () => (
  <g>
    <path d="M-120 240 Q-150 520 -170 900 L170 900 Q150 520 110 240 Z" fill={piel} stroke={T} strokeWidth={10} />
    <path d="M-60 330 Q-70 520 -86 700 M40 330 Q50 520 60 700" stroke={pielS} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
    <path d="M-176 760 Q0 720 176 760 L190 960 L-190 960 Z" fill={COL.azul} stroke={T} strokeWidth={10} />
  </g>
);
/** Dorso de la mano con nudillos (origen = centro de la línea de nudillos). */
const Dorso: React.FC<{ ancho?: number }> = ({ ancho = 250 }) => (
  <g>
    <path d={`M${-ancho / 2} 10 Q${-ancho / 2 - 10} 190 -105 250 L105 250 Q${ancho / 2 + 10} 190 ${ancho / 2} 10 Q0 -26 ${-ancho / 2} 10 Z`} fill={piel} stroke={T} strokeWidth={10} />
    {[-84, -28, 28, 84].map((x) => <path key={x} d={`M${x * 0.8} 60 L${x * 0.5} 200`} stroke={pielS} strokeWidth={7} strokeLinecap="round" opacity={0.75} />)}
  </g>
);

export const Presa: React.FC<{ tipo: "regleta" | "romo" | "pinza"; color: string }> = ({ tipo, color }) => {
  if (tipo === "regleta") return <g><rect x={-230} y={-150} width={460} height={64} rx={14} fill={color} stroke={T} strokeWidth={10} /><rect x={-230} y={-96} width={460} height={14} fill="#000" opacity={0.15} /><circle cx={190} cy={-118} r={12} fill={T} /></g>;
  if (tipo === "romo") return <g><path d="M-300 30 Q-290 -250 0 -270 Q290 -250 300 30 Z" fill={color} stroke={T} strokeWidth={10} /><path d="M-200 -150 Q-120 -230 0 -236" stroke="#fff" strokeWidth={14} opacity={0.45} fill="none" strokeLinecap="round" /></g>;
  return <g><path d="M-150 -300 Q0 -340 150 -300 L130 90 Q0 120 -130 90 Z" fill={color} stroke={T} strokeWidth={10} strokeLinejoin="round" /><path d="M-110 -270 L-96 60" stroke="#fff" strokeWidth={12} opacity={0.4} strokeLinecap="round" /><circle cx={0} cy={-270} r={12} fill={T} /></g>;
};

/** Mano (por detrás) en su presa. (x, y) = centro de la línea de nudillos en pantalla. */
export const ManoPresa: React.FC<{ x: number; y: number; s?: number; tipo: "regleta" | "romo" | "pinza"; cierra: number; color?: string; tiembla?: number }> = ({ x, y, s = 1, tipo, cierra, color = COL.amarillo, tiembla = 0 }) => {
  const c = Math.max(0, Math.min(1, cierra));
  if (tipo === "regleta") {
    // abierta: dedos rectos por encima del canto · cerrada: dedos cortos (la falange se dobla sobre el canto), mano un poco más abajo (cuelga)
    const dy = L(150, 0, c), largo = L(170, 168, c);
    return (
      <g transform={`translate(${x + tiembla} ${y}) scale(${s})`}>
        <Presa tipo="regleta" color={color} />
        <g transform={`translate(0 ${dy})`}>
          <Antebrazo /><Dorso />
          {[-84, -28, 28, 84].map((fx, i) => dedo(fx, largo - Math.abs(i - 1.5) * 8 - (i === 3 ? 18 : 0), 56, 0, c, i))}
          {/* pulgar: con la mano cerrada se cruza encima del índice (regleta cerrada) */}
          <g transform={`translate(-118 120) rotate(${L(-30, 52, c)})`}><rect x={-30} y={-150} width={62} height={170} rx={31} fill={piel} stroke={T} strokeWidth={9} /><ellipse cx={0} cy={-140} rx={24} ry={16} fill={pielS} opacity={c} /></g>
        </g>
      </g>
    );
  }
  if (tipo === "romo") {
    const abre = L(6, 16, c), dy = L(-40, 20, c);
    return (
      <g transform={`translate(${x + tiembla} ${y}) scale(${s})`}>
        <Presa tipo="romo" color={color} />
        <g transform={`translate(0 ${dy})`}>
          <Antebrazo /><Dorso ancho={270} />
          {[-1.5, -0.5, 0.5, 1.5].map((k, i) => dedo(k * 60, 200 - Math.abs(k) * 22, 56, k * abre, c, i, false))}
          <g transform={`translate(-128 150) rotate(${L(-40, -62, c)})`}><rect x={-30} y={-160} width={62} height={180} rx={31} fill={piel} stroke={T} strokeWidth={9} /></g>
          {/* yemas aplastadas contra la bola */}
          {[-1.5, -0.5, 0.5, 1.5].map((k, i) => { const a = (k * abre * Math.PI) / 180, l = 200 - Math.abs(k) * 22; return <ellipse key={i} cx={k * 60 + Math.sin(a) * (l - 14)} cy={-Math.cos(a) * (l - 14)} rx={30} ry={L(14, 8, c)} fill={pielS} opacity={0.7 * c} />; })}
        </g>
      </g>
    );
  }
  // pinza: bloque vertical; pulgar a la izquierda, dedos asomando por el canto derecho
  const cierreX = L(40, 0, c);
  return (
    <g transform={`translate(${x + tiembla} ${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={110 + cierreX} y={-330 + i * 58} width={L(70, 56, c)} height={52} rx={26} fill={piel} stroke={T} strokeWidth={9} />)}
      <Presa tipo="pinza" color={color} />
      <g transform="translate(0 -110) scale(0.92)"><Antebrazo /><Dorso ancho={230} /></g>
      <g transform={`translate(${-124 - cierreX} -80) rotate(${L(-26, -12, c)})`}><rect x={-32} y={-230} width={62} height={250} rx={31} fill={piel} stroke={T} strokeWidth={9} /><ellipse cx={0} cy={-215} rx={24} ry={16} fill={pielS} /></g>
    </g>
  );
};
