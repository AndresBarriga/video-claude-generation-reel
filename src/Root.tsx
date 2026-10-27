import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel } from "./Reel";
import { Vacio } from "./historias/Vacio";

const PLANTILLAS: Record<string, React.FC<{ datos: Datos }>> = { Vacio };
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
      return { durationInFrames: Math.ceil(datos.duracion * datos.fps) + 15, fps: datos.fps, props: { ...props, datos } };
    }}
  />
);
