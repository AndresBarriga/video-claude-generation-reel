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
import { Asmr } from "./historias/Asmr";
import { Grossglockner } from "./historias/Grossglockner";

const PLANTILLAS: Record<string, React.FC<{ datos: Datos }>> = { Vacio, Pegue, Bloque, Pierna, Traductor, Beta, Presa, Asmr, Grossglockner, Poses: Poses as any };
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
