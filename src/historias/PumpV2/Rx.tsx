// Antebrazo en radiografía (E69 v2): objeto protagonista centrado, sin mano (la muñeca sale por arriba y se funde).
// pump 0–1: músculos de verde a rojo y se hinchan · aprieta 0–1: estrechan la arteria · flujo 0–1: velocidad y cantidad de sangre ·
// residuos 0–1: partículas amarillas que se acumulan · tiembla 0–1. Coordenadas de pantalla (1080×1920).
import React from "react";
import { useCurrentFrame } from "remotion";

const mezcla = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b), k = Math.max(0, Math.min(1, t));
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
};
const X = 540, Y0 = 1760, Y1 = 380; // codo abajo, muñeca arriba
const ancho = (y: number, b: number) => { const t = (Y0 - y) / (Y0 - Y1); return (150 + 40 * b) * (1 - t) + 92 * t + 40 * b * Math.sin(Math.PI * Math.min(1, t * 1.6)) * (1 - t); };
const lado = (s: 1 | -1, b: number) => Array.from({ length: 30 }, (_, i) => { const y = Y0 - (i / 29) * (Y0 - Y1); return `${X + s * ancho(y, b)} ${y}`; });

export const Rx: React.FC<{ pump?: number; aprieta?: number; flujo?: number; residuos?: number; tiembla?: number; z?: number; dy?: number; verde?: number }> = ({ pump = 0, aprieta = 0, flujo = 1, residuos = 0, tiembla = 0, z = 1, dy = 0, verde = 0 }) => {
  const f = useCurrentFrame(), b = pump * (1 + 0.04 * Math.sin(f * 0.6)), sx = tiembla * Math.sin(f * 2.3) * 5;
  const mus = mezcla("#3FB56B", "#E5484D", pump - verde), glow = mezcla("#8EE6B0", "#FF6B5E", pump - verde);
  const contorno = `M${lado(-1, b).join(" L")} L${lado(1, b).reverse().join(" L")} Z`;
  // arteria: x desplazada a la izquierda; se estrecha en la zona media según `aprieta`
  const ax = (y: number) => X - 40 + 10 * Math.sin(y / 140), aw = (y: number) => 26 * (1 - 0.8 * aprieta * Math.exp(-(((y - 1080) / 260) ** 2)));
  const art = Array.from({ length: 60 }, (_, i) => Y0 - 40 - (i / 59) * (Y0 - Y1 - 80));
  const gotas = Array.from({ length: Math.round(6 + 18 * flujo) }, (_, i) => { const L = Y0 - Y1 - 80, p = ((i * 97 + f * (2 + 9 * flujo)) % L); return Y0 - 40 - p; });
  const res = Array.from({ length: Math.round(46 * residuos) }, (_, i) => ({ x: X - 110 + ((i * 53) % 220), y: 760 + ((i * 131) % 700), r: 6 + (i % 3) * 3 }));
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="rxBrillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        <linearGradient id="rxFunde" x1="0" y1="0" x2="0" y2="1"><stop offset="0.12" stopColor="#fff" stopOpacity="0" /><stop offset="0.3" stopColor="#fff" stopOpacity="1" /><stop offset="0.93" stopColor="#fff" stopOpacity="1" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <mask id="rxMask"><rect width="1080" height="1920" fill="url(#rxFunde)" /></mask>
        <clipPath id="rxClip"><path d={contorno} /></clipPath>
      </defs>
      <g mask="url(#rxMask)" transform={`translate(${540 + sx} ${1080 + dy}) scale(${z}) translate(-540 -1080)`}>
        <path d={contorno} fill={glow} opacity={0.18 + 0.25 * pump} filter="url(#rxBrillo)" />
        <path d={contorno} fill="#0E1C2E" opacity={0.85} />
        <g clipPath="url(#rxClip)">
          {/* huesos: radio y cúbito */}
          <path d={`M${X - 70} ${Y0} Q${X - 20} 1100 ${X - 52} ${Y1}`} stroke="#DCE8F5" strokeWidth={34} strokeLinecap="round" fill="none" opacity={0.22} />
          <path d={`M${X + 74} ${Y0} Q${X + 40} 1100 ${X + 50} ${Y1}`} stroke="#DCE8F5" strokeWidth={28} strokeLinecap="round" fill="none" opacity={0.22} />
          {/* vientre muscular: uno solo, con fibras; se hincha y cambia de color */}
          <ellipse cx={X + 6} cy={1130} rx={120 + 55 * b} ry={400} fill={mus} opacity={0.5 + 0.25 * pump} filter="url(#rxBrillo)" />
          <ellipse cx={X + 6} cy={1130} rx={110 + 50 * b} ry={380} fill={mus} opacity={0.55 + 0.2 * pump} stroke={glow} strokeWidth={5} />
          {[-0.7, -0.35, 0, 0.35, 0.7].map((t, i) => <path key={i} d={`M${X + 6 + t * 40} 770 Q${X + 6 + t * (110 + 50 * b)} 1130 ${X + 6 + t * 40} 1490`} stroke={glow} strokeWidth={3} opacity={0.5} fill="none" />)}
          {/* vena */}
          <path d={`M${X + 60} ${Y0} Q${X + 20} 1080 ${X + 44} ${Y1}`} stroke="#5B8DEF" strokeWidth={18} fill="none" opacity={0.8} />
          {/* arteria con su estrechamiento */}
          {art.slice(0, -1).map((y, i) => <line key={i} x1={ax(y)} y1={y} x2={ax(art[i + 1])} y2={art[i + 1]} stroke="#FF5A5F" strokeWidth={aw(y)} strokeLinecap="round" />)}
          {gotas.map((y, i) => <circle key={i} cx={ax(y)} cy={y} r={Math.max(3, aw(y) * 0.3)} fill="#FFD1D1" opacity={0.9} />)}
          {res.map((p, i) => <circle key={i} cx={p.x + 4 * Math.sin(f * 0.2 + i)} cy={p.y} r={p.r} fill="#E6E35A" opacity={0.85} />)}
        </g>
        {[-66, -24, 18, 58].map((o, i) => <path key={i} d={`M${X + o * 0.8} ${Y1 + 10} L${X + o} ${Y1 - 110} L${X + o * 1.08} ${Y1 - 190} L${X + o * 1.12} ${Y1 - 250}`} stroke="#DCE8F5" strokeWidth={22 - i * 2} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.28} />)}
        <path d={`M${X - 84} ${Y1 + 10} L${X - 130} ${Y1 - 80} L${X - 150} ${Y1 - 140}`} stroke="#DCE8F5" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.28} />
        <path d={contorno} fill="none" stroke="#9EC5FF" strokeWidth={6} opacity={0.9} />
        <path d={contorno} fill="none" stroke="#9EC5FF" strokeWidth={18} opacity={0.25} filter="url(#rxBrillo)" />
      </g>
    </svg>
  );
};
