// El cuerpo tendido de lado (coordenadas locales ~800×560): cabeza a la izquierda, piernas a la derecha. Sin gore, cara medio oculta por la capucha.
import React from "react";
import { Escarcha } from "./comun";

const trazo = (d: string, w: number, c: string, o = 1) => <path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={o} />;

export const CuerpoDibujo: React.FC = () => (
  <g>
    {/* botella de oxígeno naranja, medio enterrada detrás del torso */}
    <g transform="rotate(-24 330 190)"><rect x={250} y={150} width={190} height={66} rx={32} fill="#E58A1F" /><rect x={250} y={150} width={190} height={22} rx={11} fill="#F4B04A" opacity={0.8} /><rect x={395} y={150} width={26} height={66} fill="#2B3442" opacity={0.7} /></g>
    {/* piernas: muslo, pantorrilla, con sombra inferior y arrugas */}
    {trazo("M400 345 Q500 310 585 322", 128, "#27406A")}
    {trazo("M400 330 Q500 292 585 304", 118, "#3B5B8C")}
    {trazo("M585 322 Q665 345 742 398", 104, "#27406A")}
    {trazo("M585 306 Q665 328 742 382", 96, "#3F63A0")}
    {trazo("M470 292 Q490 330 470 362", 6, "#1D3458", 0.8)}{trazo("M520 288 Q540 322 522 352", 6, "#1D3458", 0.8)}{trazo("M620 316 Q640 346 628 372", 6, "#1D3458", 0.8)}
    {trazo("M420 276 Q520 246 590 262", 12, "#6E8FC4", 0.45)}
    {/* bota doble amarilla + polaina + crampones */}
    <path d="M722 352 L792 372 L812 430 L788 470 L716 462 L700 410 Z" fill="#E0B93A" />
    <path d="M722 352 L792 372 L800 396 L718 380 Z" fill="#F4D05A" opacity={0.9} />
    <path d="M708 452 L800 466 L800 486 L706 474 Z" fill="#2B3442" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${712 + i * 21} 478 L${722 + i * 21} 512 L${732 + i * 21} 480 Z`} fill="#D5DCE4" />)}
    {trazo("M700 408 L808 428", 8, "#7A6420", 0.8)}
    {/* torso: chaqueta de plumas con costuras */}
    {trazo("M215 292 Q310 270 420 336", 214, "#561D1D")}
    {trazo("M215 276 Q310 250 420 318", 202, "#8E2F2B")}
    {trazo("M222 214 Q320 190 420 262", 40, "#BC4B42", 0.75)}
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${255 + i * 36} ${178 + i * 22} Q${272 + i * 36} ${268 + i * 20} ${240 + i * 38} ${350 + i * 12}`} stroke="#561D1D" strokeWidth={7} fill="none" opacity={0.85} />)}
    {/* brazo doblado con guante */}
    {trazo("M250 330 Q330 392 292 448", 74, "#561D1D")}
    {trazo("M250 322 Q326 380 286 440", 64, "#8E2F2B")}
    <ellipse cx={282} cy={452} rx={44} ry={36} fill="#1B222C" /><ellipse cx={270} cy={440} rx={26} ry={16} fill="#394658" />
    {/* cabeza con capucha y cara medio vuelta */}
    <circle cx={150} cy={250} r={84} fill="#3C1414" />
    <circle cx={150} cy={250} r={84} fill="none" stroke="#C9B9A8" strokeWidth={14} strokeDasharray="3 10" opacity={0.65} />
    <ellipse cx={138} cy={262} rx={52} ry={58} fill="#AEB6C0" />
    <ellipse cx={128} cy={282} rx={42} ry={44} fill="#8B95A1" opacity={0.7} />
    {trazo("M104 246 Q122 238 142 246", 7, "#3B4350")}{trazo("M106 252 L100 262 M118 252 L114 264 M130 252 L130 265 M142 249 L148 260", 3, "#EAF4FF", 0.9)}
    {trazo("M112 300 Q132 306 152 298", 6, "#6C7684")}
    <Escarcha x={136} y={262} r={52} n={34} seed="cab" op={0.95} />
    {/* nieve acumulada: cubre cadera, parte de la pierna y el hombro */}
    <path d="M200 372 Q330 330 470 360 Q560 380 640 392 L690 430 Q520 440 360 430 Q240 424 190 400 Z" fill="#DCE8F3" />
    <path d="M200 372 Q330 330 470 360 Q540 372 600 380 Q470 352 330 372 Q250 380 200 392 Z" fill="#FFFFFF" opacity={0.7} />
    <path d="M190 240 Q250 196 330 214 Q300 236 250 252 Q214 258 190 270 Z" fill="#E6F0F8" opacity={0.9} />
    <path d="M330 300 Q400 280 470 300 Q420 320 360 322 Z" fill="#E6F0F8" opacity={0.85} />
  </g>
);
