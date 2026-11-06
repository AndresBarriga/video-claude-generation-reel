// E50 «No pasa nada» (micro-vídeo sin voz): chat que rechaza el plan y, al deslizar entre apps, él lo tiene todo preparado.
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { Datos } from "../../tipos";
import { Sonidos } from "../../Sonidos";
import { Chat } from "./Chat";
import { Tira } from "./Tira";

const ESCENAS: Record<string, React.FC<any>> = { chat: Chat, tira: Tira };

export const ChatRechazo: React.FC<{ datos: Datos }> = ({ datos }) => {
  const { fps } = useVideoConfig();
  const n = datos.escenas.length;
  return (
    <AbsoluteFill style={{ background: "#0F1620" }}>
      <Sonidos datos={datos} />
      {datos.escenas.map((e, i) => {
        const ini = Math.round((e.inicio ?? 0) * fps);
        const fin = Math.round((i === n - 1 ? datos.duracion : datos.escenas[i + 1].inicio ?? datos.duracion) * fps);
        const Comp = ESCENAS[e.visual ?? ""] ?? Chat;
        return <Sequence key={i} from={ini} durationInFrames={Math.max(1, fin - ini)}><Comp e={e} d={Math.max(1, fin - ini)} pal={() => undefined} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
