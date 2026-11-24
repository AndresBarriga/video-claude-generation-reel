# Métricas de Instagram por API

Cada mañana (07:17, hora de Berlín) una GitHub Action lee las métricas de @ultimo.pegue, añade filas a `datos/publicados.csv`, regenera el dashboard y hace commit. A mano: `IG_TOKEN=… npm run ig -- --ultimos 5 --dry` (enseña sin escribir) o sin `--dry` (escribe).

## Montarlo (una vez, ~20 min)
**A. App en Meta** (hecho el 24-nov; app «ultimo.pegue», id 29075926305421407)
Las apps nuevas ya no tienen «API con inicio de sesión de Instagram»: usan **Unified login** y dan un token de Facebook (`EAA…`) que va contra `graph.facebook.com`. El script lo detecta solo.
1. developers.facebook.com → **My Apps** → la app → **Use cases** → «Manage messaging & content on Instagram» → **Customize**.
2. **Permissions and features**: `instagram_basic`, `instagram_business_basic`, `instagram_business_manage_insights` e `instagram_manage_insights` en «Ready for testing». Sin App Review: la app sigue en modo desarrollo y solo lee tu cuenta.
3. **App roles → Roles → Add People → Instagram Tester** → `ultimo.pegue`. En Instagram (web): Configuración → Apps y sitios web → **Invitaciones de tester** → Accept.
4. Vuelve al caso de uso → pestaña **API setup with Unified login** → «2. Generate access tokens» → junto a ultimo.pegue, **Generate token** → cópialo. No lo pegues en ningún chat.

**B. Secrets en GitHub** (repo → Settings → Secrets and variables → Actions → **New repository secret**)
8. Nombre `IG_TOKEN`, valor: el token. Guardar.
9. Solo si el token es de Instagram (`IG…`). Renovación automática: github.com → tu foto → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate. Repositorio: solo `video-claude-generation-reel`. Permisos: **Secrets: Read and write**. Caducidad: 1 año (apúntalo). Cópialo y crea el secret `GH_PAT` con él.
   Con token de Facebook (`EAA…`) no hace falta: la Action mira cuándo caduca y avisa (falla a ≤10 días). Sin `GH_PAT` la Action no puede reescribir el token: solo avisa y falla a ≤10 días de caducar (GitHub te manda un correo). Entonces repite el paso 7 y pega el token nuevo en `IG_TOKEN`.

**C. Primera prueba**
10. Repo → **Actions** → «Métricas Instagram» → **Run workflow**. Al acabar debe haber un commit «Métricas IG …».
11. Si hay reels sin asociar, el registro lo dice: abre `datos/ig-map.json`, pon el id (`"video": "E72"`) o `"-"` para ignorarlo, y commit.

## Qué mide y de dónde sale cada columna
| Columna CSV | Métrica API | Nota |
|---|---|---|
| vistas | `views` | |
| espectadores | `reach` (cuentas alcanzadas) | |
| likes, comentarios, envios, guardados, reposts | `likes`, `comments`, `shares`, `saved`, `reposts` | |
| visto_medio_s | `ig_reels_avg_watch_time` ÷ 1000 | La doc no da unidad; se asume ms → comprobar con captura |
| skip_pct | `reels_skip_rate` | «En desarrollo»; vacío en reels con pocas vistas |
| seguidores | **estimado** (ver abajo) | notas: «seg. estimados por día» |
| duracion_s, titulo, formato, estilo | de la fila anterior del mismo vídeo | |

- **Qué reels:** los de ≤7 días, una fila por día; luego una a los 14 y a los 30 días.
- **Asociar a E…:** por pie de foto (descripción de la ficha) y hora de subida del CSV. Lo dudoso va a `datos/ig-map.json`.
- **Seguidores por reel:** la API no da altas por reel. Se piden las altas diarias de la cuenta (`follower_count`, solo últimos 30 días y cuentas ≥100 seguidores) y se reparten: con fotos diarias de vistas (desde el 2.º día de Action), **según las vistas que ganó cada reel ese día**; sin ellas, al reel publicado ese día. Es una estimación: no la mezcles con las cifras de captura al comparar seg./1k.
- Datos de apoyo: `datos/ig-diario.json` (altas y vistas por día), `datos/ig-token.json` (solo fecha de caducidad, nunca el token).
- Los datos de Instagram pueden ir hasta 48 h por detrás.

## Lo que no se puede automatizar (sigue por captura)
- **Curva de retención** (no existe en la API): captura solo de los vídeos que destaquen y lectura en la ficha.
- **Seguidores reales por reel** («follows» de cada reel): no existe para reels en la API.
- **Visitas al perfil por reel**, fuentes de tráfico (Reels/Explorar/Feed), «mayor/menor que lo normal»: no salen.
- Demografía de la cuenta (`datos/cuenta.json`): se puede pedir, no está montado.

## Pendiente de comprobar con la 1.ª ejecución real
- Unidad de `visto_medio_s` y escala de `skip_pct` frente a 2 capturas (±5 %).
- Que `follower_count` cuenta altas (no neto de bajas).
