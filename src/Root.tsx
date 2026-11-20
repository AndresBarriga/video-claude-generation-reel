import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel } from "./Reel";
import { Vacio } from "./historias/Vacio";
import { Poses } from "./historias/Poses";
import { Pegue } from "./historias/Pegue";
import { Bloque } from "./historias/Bloque";
import { Pierna } from "./historias/Pierna";
import { Traductor } from "./historias/Traductor";
import { Beta } from "./historias/Beta";
import { Presa } from "./historias/Presa";
import { ChatRechazo } from "./historias/Chat";
import { Asmr } from "./historias/Asmr";
import { Honnold } from "./historias/Honnold";
import { Grossglockner } from "./historias/Grossglockner";
import { Hippies } from "./historias/Hippies";
import { Puerta } from "./historias/Puerta";
import { Descanso } from "./historias/Descanso";
import { Pump } from "./historias/Pump";
import { Rapel } from "./historias/Rapel";
import { Asegurador } from "./historias/Asegurador";
import { Poleas } from "./historias/Poleas";
import { Everest } from "./historias/Everest";
import { Cuerda } from "./historias/Cuerda";
import { Nanga } from "./historias/Nanga";
import { Ferrata } from "./historias/Ferrata";
import { FreeBase } from "./historias/FreeBase";
import { Suelta } from "./historias/Suelta";
import { Factor } from "./historias/Factor";
import { Chapa } from "./historias/Chapa";
import { Agarra } from "./historias/Agarra";
import { Freno } from "./historias/Freno";
import { Catalogo } from "./historias/Catalogo";
import { InfoDemo } from "./historias/InfoDemo";
import { GatosV2 } from "./historias/GatosV2";
import { CintaV2 } from "./historias/CintaV2";
import { PumpV2 } from "./historias/PumpV2";

import { Gatos } from "./historias/Gatos";
import { Cinta } from "./historias/Cinta";

const PLANTILLAS: Record<string, React.FC<{ datos: Datos }>> = { ChatRechazo, Vacio, Pegue, Bloque, Pierna, Traductor, Beta, Presa, Asmr, Hippies, Puerta, Pump, Rapel, Asegurador, Poleas, Everest, Cuerda, Nanga, Ferrata, FreeBase, Suelta, Factor, Chapa, Descanso, Grossglockner, Honnold, Poses: Poses as any, Catalogo: Catalogo as any, Agarra, Freno, Gatos, Cinta, InfoDemo: InfoDemo as any, GatosV2, CintaV2, PumpV2 };
const Video: React.FC<{ datos: Datos }> = ({ datos }) => {
  const C = (datos.plantilla && PLANTILLAS[datos.plantilla]) || Reel;
  return <C datos={datos} />;
};
import type { Datos } from "./tipos";

const vacio: Datos = { id: "_ejemplo", titulo: "", nicho: "otro", fps: 30, duracion: 5, palabras: [], escenas: [] };

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Video}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={150}
    defaultProps={{ datos: vacio, id: "_ejemplo" } as any}
    calculateMetadata={async ({ props }: any) => {
      const r = await fetch(staticFile(`datos/${props.id}.json`));
      const datos: Datos = await r.json();
      return { durationInFrames: Math.ceil(datos.duracion * datos.fps) + ((datos as any).mudo ? 0 : 15), fps: datos.fps, props: { ...props, datos } };
    }}
  />
);
