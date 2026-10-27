# Colaborar en el repo (amigos que ayudan con vídeos)

1. **Rama por vídeo:** `git checkout -b video/E7-nombre`. Nunca trabajar directamente en `main`.
2. Lee `CLAUDE.md`: Claude lo aplica solo. Tu vídeo va en `videos/<nicho>/<id>/` y su plantilla en `src/historias/<Plantilla>/`.
3. Elige ideas de `docs/ideas/` y avisa a Andrés de cuál coges (para no duplicar).
4. Código compartido (`src/piezas`, `tools`, `docs/guia-visual.md`, `docs/viralidad.md`): solo con un cambio pequeño y explicado.
5. `docs/no-me-gusta.md` recoge el gusto de **Andrés**: no lo edites con tus preferencias; propón en el PR.
6. **Voz:** no la generes tú. Pasa a Andrés el texto (`npm run texto -- <id>`); él genera el audio con la voz y la licencia de la cuenta.
7. Al terminar: push de tu rama y **pull request** con la hoja de escenas (`out/<id>-hoja.png`) adjunta. Andrés revisa y fusiona.
