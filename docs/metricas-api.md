# Métricas de Instagram por API

Cada mañana (07:17, hora de Berlín) una GitHub Action lee las métricas de @ultimo.pegue, añade filas a `datos/publicados.csv`, regenera el dashboard y hace commit. A mano: `IG_TOKEN=… npm run ig -- --ultimos 5 --dry` (enseña sin escribir) o sin `--dry` (escribe).

## Montarlo (una vez, ~20 min)
**A. App en Meta**
1. Entra en developers.facebook.com con tu Facebook → **Mis apps** → **Crear app**.
2. «Conectar un negocio» (business portfolio): **omitir por ahora**.
3. Caso de uso: **Otro** → tipo de app: **Negocio** (Business). Nombre: p. ej. «metricas ultimo pegue». Crear.
   (Si te ofrece casos de uso con nombre, elige el de Instagram, p. ej. «Gestionar mensajes y contenido de Instagram».)
4. En la app, producto **Instagram** → **Configurar**. Se abre «Configuración de la API con inicio de sesión de Instagram».
5. Permisos: deja marcados solo **instagram_business_basic** e **instagram_business_manage_insights**. No envíes nada a revisión: para tu propia cuenta no hace falta (acceso estándar, la app puede quedarse en modo desarrollo).
6. En «Generar identificadores de acceso» → **Añadir cuenta** → entra con @ultimo.pegue (tiene que ser profesional y pública) → acepta.
7. Pulsa **Generar token** junto a la cuenta, entra otra vez si lo pide y **copia el token** (empieza por `IG…`, dura 60 días). No lo pegues en ningún chat ni archivo.

**B. Secrets en GitHub** (repo → Settings → Secrets and variables → Actions → **New repository secret**)
8. Nombre `IG_TOKEN`, valor: el token. Guardar.
9. Renovación automática (recomendado): github.com → tu foto → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate. Repositorio: solo `video-claude-generation-reel`. Permisos: **Secrets: Read and write**. Caducidad: 1 año (apúntalo). Cópialo y crea el secret `GH_PAT` con él.
   Sin `GH_PAT` la Action no puede reescribir el token: solo avisa y falla a ≤10 días de caducar (GitHub te manda un correo). Entonces repite el paso 7 y pega el token nuevo en `IG_TOKEN`.

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
