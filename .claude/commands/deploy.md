# /deploy — Subir cambios a GitHub Pages

Hace commit de todos los cambios actuales y los sube a GitHub. La página se actualiza automáticamente.

## Pasos

1. Mostrame qué archivos cambiaron con `git status` y `git diff --stat`
2. Pedime un mensaje breve describiendo qué cambió (o generalo vos si es obvio)
3. Hacé `git add` de los archivos relevantes (nunca `.env` ni archivos con tokens)
4. Commit con el mensaje
5. `git push`
6. Confirmame que se subió y decime que en ~2 minutos se ve en https://bichitosshop.github.io/bichitosonline/

## Notas

- El remote es `origin` → `https://github.com/bichitosshop/bichitosonline`
- Credenciales guardadas en osxkeychain
- Si el push falla por divergencia, avisame antes de hacer force push
