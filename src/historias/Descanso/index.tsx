// E44 «Descansar en la vía». Por ahora solo la hoja de poses; las escenas finales se montan cuando llegue la voz.
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Datos } from "../../tipos";
import { Svg } from "../Pump/comun";
import { Poses4 } from "./Poses4";

export const Descanso: React.FC<{ datos: Datos }> = () => (
  <AbsoluteFill><Svg><Poses4 /></Svg></AbsoluteFill>
);
