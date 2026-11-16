# Kit de cuerda (`src/piezas/kit`)

Personajes, material, decorados y física **reutilizables**: un vídeo nuevo de cuerda se monta cambiando números, no redibujando. E59 (`src/historias/Chapa`) ya lo usa y sirve de ejemplo. **Antes de empezar un vídeo: `npm run catalogo`** (→ `out/catalogo.png`; `npm run catalogo 4` = solo esa página) para ver qué hay.

```tsx
import { crearVia, PERFILES, Plano, Persona, Asegurador, Soga, porChapas, aparato, POSE, pChapa, caida, REPARTO } from "../../piezas/kit";
const VIA = crearVia({ metros: [3, 4.5, 6.3] });            // altura del mosquetón de cada chapa, a escala (170 px = 1 m)
const p = VIA.cadera(VIA.mos(1).y + 150);                    // cadera de quien escala, 150 px bajo la 2.ª chapa
<Plano via={VIA} cx={560} cy={2030} z={1.3} decorado="cueva">
  <Asegurador via={VIA} x={400} cuerda={false} />
  <Persona p={p} ang={pChapa(p, VIA.mos(1))} aspecto={REPARTO.ella} cara="esfuerzo" />
  <Soga pts={porChapas(VIA, aparato(VIA, 400), 1, p)} />
</Plano>
```

| Archivo | Qué da |
|---|---|
| `via.ts` | `crearVia({ perfil, metros \| chapas, suelo, presas })` → `xF`, `mos(i)`, `cadera(y)`, `pie`, `aM(m)`. `PERFILES`: desplome, vertical, placa, panel. `nudo(p)`, `aparato(via, x, dy)` |
| `rig.ts` | `POSE.*` (agarre, agarreMira, reposo, cae, caeRecogida, caeBien, recibe, colgado, sentado, pie) · `pNudo`, `pChapa(p, m, t, j)`, `pAgarra(p, m)`, `resbala` · `conMano`/`conManoB` (IK), `mix`, `mano`, `cabeza`, `boca` |
| `fisica.ts` | `caida(via, k, p0, pose, { i, comba, sacada, aire })` decide sola cuerda o suelo · `caeCuerda`, `caeSuelo`, `distCaida`, `tocaSuelo`, `saltoAseg(est, j, dina)` |
| `Personas.tsx` | `REPARTO` (ella, el, tu, ase, nueva, fantasma) · `Persona` · `Asegurador` (comba, feed, paso, alza, dy, vuelo; mano de freno siempre en la cuerda) |
| `Cuerda.tsx` | `Soga` (sag, brillo, fantasma, idea) · `porChapas` · `Expres`, `Cintas`, `Presas` · `ExpresGrande` (primer plano: abre, gira, cuerda, gatillo) |
| `Decorado.tsx` | `Plano` (cámara + decorado `"cueva"` \| `"sala"`; `fondo`/`mundo` para uno propio) · `Cueva`, `Fondo`, `Sala`, `FondoSala` |
| `Efectos.tsx` | `Cota` (flecha de medida con «3 m»), `Polvo`, `Destello`, `Diente`, `Mordida`, `Medidor`, `Bocadillo` |

## Reglas
- **Geometría siempre desde `crearVia`**: nada de coordenadas sueltas de chapas o suelo en las escenas.
- **Pose nueva que se vaya a repetir → a `POSE` en `rig.ts`** y a la página de poses de `src/historias/Catalogo`. Pieza nueva reutilizable → al kit + al catálogo + una línea en la tabla. Lo que solo sirve a un vídeo se queda en su plantilla.
- Mismo **reparto** entre vídeos (se reconocen). Personaje nuevo → `REPARTO`.
- Caídas con `k` = fotogramas desde que se suelta (física real); `c.est` sacude la cámara y levanta a quien asegura (`saltoAseg`).
- Al tocar el kit: comprobar que E59 no cambia (`npm run fotograma -- E59 11` y `28` antes y después).
