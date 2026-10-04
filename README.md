# Galaxia morada 💜

Página con una galaxia 3D que se gira arrastrando, mensajes escondidos en el espacio y música de fondo.

## Personalizar
Todo está en `js/config.js`: el nombre, el título, los mensajes y la música.

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub y sube todo el contenido de esta carpeta (con `index.html` en la raíz).
2. Entra a Settings > Pages, elige la rama `main` y la carpeta `/ (root)`.
3. En un minuto tendrás un link tipo `https://tuusuario.github.io/nombre-del-repositorio/`.

## Probar en el computador
Abre una terminal en esta carpeta y ejecuta `python -m http.server 8000`, luego entra a `http://localhost:8000`.

## Música
- Si existe `assets/musica.mp3`, suena ese archivo.
- Si no, intenta los videos de YouTube de la lista `VIDEO_IDS` (puedes poner varios por si uno no deja incrustarse), en orden.
- Si ninguno funciona, suena un beat de rap generado por el navegador.

Antes de enviarla, pon `DEPURAR = false` en `js/config.js` para ocultar los avisos de prueba.
