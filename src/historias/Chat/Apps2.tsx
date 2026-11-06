// Pantallas de apps (1080×1920): mapas (estilo mapa en línea), música (estilo reproductor en streaming) y galería (estilo fotos del móvil).
import React from "react";
import { Foto, UI } from "./comun";

/** Mapas: mapa claro con parques, agua, carreteras amarillas, ruta azul, buscador y panel inferior. */
export const Mapa: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#F1EEE6" />
    <path d="M0 0 H1080 V560 C860 520 700 640 520 600 C320 560 160 520 0 600Z" fill="#E4EFD4" opacity={0.0} />
    <path d="M620 160 C820 140 1000 220 1080 200 L1080 620 C900 600 760 540 660 420Z" fill="#CBE7C6" />
    <path d="M60 1000 C220 940 360 1020 480 1100 C560 1160 520 1280 380 1300 C220 1320 80 1260 40 1160Z" fill="#CBE7C6" />
    <path d="M700 1060 C860 1000 1000 1060 1080 1040 L1080 1500 C920 1480 780 1400 700 1280Z" fill="#CBE7C6" />
    <path d="M-20 1500 C220 1400 360 1560 560 1500 C760 1440 900 1560 1100 1480 L1100 1920 L-20 1920Z" fill="#AADAFF" />
    {[[0, 300, 1080, 330], [0, 760, 1080, 720], [0, 1180, 1080, 1150]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke="#fff" strokeWidth={22} />)}
    {[[220, 0, 260, 1500], [560, 0, 520, 1500], [880, 0, 940, 1500]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke="#fff" strokeWidth={18} />)}
    <path d="M-20 1060 C300 980 540 1100 820 900 C960 800 1020 560 1100 440" stroke="#F9C74F" strokeWidth={40} fill="none" /><path d="M-20 1060 C300 980 540 1100 820 900 C960 800 1020 560 1100 440" stroke="#FBE08A" strokeWidth={26} fill="none" />
    <path d="M200 1560 L240 1240 C260 1100 400 1040 560 1010 C740 970 800 860 860 700 L900 560" stroke="#1A73E8" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
    <circle cx={200} cy={1560} r={26} fill="#fff" stroke="#1A73E8" strokeWidth={9} />
    <g transform="translate(900 560)"><path d="M0 0 C-60 -70 -60 -130 0 -130 C60 -130 60 -70 0 0Z" fill="#EA4335" /><circle cy={-100} r={20} fill="#fff" /></g>
    {[["Parque natural", 780, 330], ["Carretera de acceso", 340, 1100], ["Río", 600, 1730]].map(([t, x, y]) => <text key={String(t)} x={Number(x)} y={Number(y)} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={34} fill="#5F6B73" opacity={0.85}>{t}</text>)}
    <rect x={40} y={90} width={1000} height={170} rx={34} fill="#fff" />
    <circle cx={110} cy={150} r={14} fill="#fff" stroke="#1A73E8" strokeWidth={7} /><circle cx={110} cy={212} r={14} fill="#EA4335" />
    <path d="M110 170 V196" stroke="#9AA0A6" strokeWidth={4} strokeDasharray="4 6" />
    <text x={170} y={162} fontFamily={UI} fontWeight={500} fontSize={42} fill="#5F6368">Tu ubicación</text><text x={170} y={226} fontFamily={UI} fontWeight={700} fontSize={42} fill="#202124">Chulilla, El Balcón</text>
    <rect y={1480} width={1080} height={440} rx={50} fill="#fff" />
    <rect x={470} y={1500} width={140} height={10} rx={5} fill="#DADCE0" />
    <text x={70} y={1620} fontFamily={UI} fontWeight={700} fontSize={80} fill="#188038">1 h 05</text><text x={400} y={1620} fontFamily={UI} fontWeight={500} fontSize={58} fill="#5F6368">(62 km)</text>
    <text x={70} y={1690} fontFamily={UI} fontWeight={500} fontSize={40} fill="#5F6368">Ruta más rápida, sin tráfico</text>
    <rect x={70} y={1740} width={380} height={110} rx={55} fill="#1A73E8" /><text x={260} y={1815} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={48} fill="#fff">Iniciar</text>
    <rect x={480} y={1740} width={360} height={110} rx={55} fill="#fff" stroke="#DADCE0" strokeWidth={3} /><text x={660} y={1815} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={44} fill="#1A73E8">Pasos</text>
  </g>
);

const PISTAS: [string, string][] = [["Sin cuerda", "Los de la Roca"], ["Otro día será", "Magnesio"], ["Reunión en la R2", "Vía Normal"], ["Presa pequeña", "Dos Chapas"], ["Cinta exprés", "Los Anclajes"]];
/** Música: oscura, portada con degradado, título de lista, botones y lista de pistas. */
export const Musica: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="mus" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A3A8A" /><stop offset="0.45" stopColor="#241A38" /><stop offset="1" stopColor="#121212" /></linearGradient>
      <linearGradient id="musc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#7A2BD1" /></linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#mus)" />
    <path d="M90 130 L50 170 L90 210" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(250 240)"><rect width={580} height={580} rx={14} fill="url(#musc)" /><path d="M120 480 L230 250 L290 340 L350 270 L470 480Z" fill="#fff" opacity={0.85} /><circle cx={420} cy={150} r={46} fill="#fff" opacity={0.85} /></g>
    <text x={70} y={930} fontFamily={UI} fontWeight={700} fontSize={70} fill="#fff">Para escalar</text>
    <text x={70} y={995} fontFamily={UI} fontWeight={500} fontSize={40} fill="#B3B3B3">Lista · 48 canciones · 3 h 12 min</text>
    <circle cx={150} cy={1100} r={30} fill="#7A2BD1" /><text x={200} y={1112} fontFamily={UI} fontWeight={500} fontSize={36} fill="#B3B3B3">Tuya</text>
    <g transform="translate(820 1050)"><path d="M0 40 L30 40 C50 40 60 0 90 0 M0 0 L30 0 C50 0 60 40 90 40" stroke="#1ED760" strokeWidth={6} fill="none" strokeLinecap="round" /></g>
    <circle cx={960} cy={1110} r={64} fill="#1ED760" /><path d="M944 1080 L994 1110 L944 1140Z" fill="#121212" />
    {PISTAS.map(([t, a], i) => (
      <g key={t}>
        <text x={70} y={1260 + i * 130} fontFamily={UI} fontWeight={700} fontSize={48} fill={i === 1 ? "#1ED760" : "#fff"}>{t}</text>
        <text x={70} y={1312 + i * 130} fontFamily={UI} fontWeight={500} fontSize={36} fill="#B3B3B3">{a}</text>
        <g fill="#B3B3B3"><circle cx={990} cy={1260 + i * 130 - 12} r={6} /><circle cx={990} cy={1260 + i * 130 + 10} r={6} /><circle cx={990} cy={1260 + i * 130 + 32} r={6} /></g>
      </g>
    ))}
    <rect y={1800} width={1080} height={120} fill="#181818" /><rect x={50} y={1830} width={90} height={90} rx={10} fill="url(#musc)" />
    <text x={170} y={1870} fontFamily={UI} fontWeight={700} fontSize={36} fill="#fff">Otro día será</text><text x={170} y={1908} fontFamily={UI} fontWeight={500} fontSize={30} fill="#B3B3B3">Magnesio</text>
    <path d="M920 1840 L970 1865 L920 1890Z" fill="#fff" />
  </g>
);

/** Galería: foto grande a pantalla casi completa, cabecera con fecha y tira de miniaturas. */
export const Galeria: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#000" />
    <g transform="translate(0 230)"><svg width={1080} height={1250} viewBox="0 0 1080 1250"><Foto w={1080} h={1250} id="gal" /></svg></g>
    <rect width={1080} height={200} fill="#101010" />
    <path d="M70 100 L36 130 L70 160" stroke="#3D8BFF" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text x={540} y={112} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={44} fill="#fff">Ayer</text><text x={540} y={158} textAnchor="middle" fontFamily={UI} fontWeight={500} fontSize={30} fill="#9A9A9A">18:42</text>
    <rect y={1480} width={1080} height={440} fill="#101010" />
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${12 + i * 150} 1520)`}><rect width={i === 3 ? 160 : 140} height={i === 3 ? 160 : 140} rx={10} fill={["#C9955E", "#7FA0C4", "#8C6A4A", "#D9A86B", "#6E8F5A", "#B07B4C", "#9DB4CC"][i]} stroke={i === 3 ? "#fff" : "none"} strokeWidth={4} /></g>)}
    <g fill="none" stroke="#3D8BFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M120 1780 v-40 M100 1760 h40" /><circle cx={420} cy={1760} r={34} /><path d="M690 1790 c-50 -30 -50 -80 0 -60 c50 -20 50 30 0 60z" /><path d="M960 1730 h-60 v60 h60z M920 1730 v-20 h20 v20" />
    </g>
  </g>
);
