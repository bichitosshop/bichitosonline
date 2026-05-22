# /preview — Levantar servidor local para ver la página

Levanta un servidor web local para que puedas ver los cambios en el navegador antes de subir a GitHub.

## Pasos

1. Corré `python3 -m http.server 3000 --directory "/Users/Juani/Desktop/BICHITOS SHOP"` en background
2. Abrí `http://localhost:3000` en el navegador con `open http://localhost:3000`
3. Confirmame que el servidor está corriendo

## Para detenerlo

Buscá el proceso con `lsof -i :3000` y matalo con `kill <PID>`, o simplemente cerrá la terminal.
