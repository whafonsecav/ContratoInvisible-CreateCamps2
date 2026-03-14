# Instrucciones para Actualizar GitHub Pages

Si el proyecto ya está subido a GitHub (hiciste un primer `upload`), para **actualizar los cambios que acabamos de hacer** necesitas seguir la ruta básica de los comandos de **Git**.

Aquí está el paso a paso:

### Opción 1: Si usas GitHub Desktop (La App Visual)
1. Abre GitHub Desktop.
2. Asegúrate de estar en el repositorio correcto (arriba a la izquierda, que diga `ContratoInvisible...`).
3. La aplicación automáticamente detectará que modificaste `index.html`, `app.js` y creaste `config.js`.
4. Abajo a la izquierda, en el cuadro **Summary**, escribe un mensaje corto, por ejemplo: *"Agrego config.js y corrijo iframes de video"*.
5. Dale clic al botón azul **"Commit to main"**.
6. Finalmente, dale clic arriba al botón **"Push origin"** (o "Sync").
7. ¡Listo! Espera un par de minutos a que GitHub Pages actualice la caché de la web y recarga con `Ctrl + F5`.

---

### Opción 2: Si usas la Terminal (Git Bash o Consola de VS Code)
Si estás en la carpeta del proyecto en la consola, ejecuta estos tres comandos uno tras otro pacientemente:

1. **Agrega los archivos modificados a la cola de subida:**
```bash
git add .
```

2. **Crea el "paquete" de actualización con un mensaje descriptivo:**
```bash
git commit -m "Solución a videos de YouTube y sección de Alfabetismo"
```

3. **Sube los cambios a la nube de GitHub:**
```bash
git push
```
*(Espera a que termine de cargar al 100%)*. En un par de minutos tu página en `whafonsecav.github.io` estará actualizada.

---

### Sobre los Videos (El Error de la Pantalla Negra)

En la captura que mandaste se ve que **SÍ está cargando el reproductor y SÍ reconoce el video**, pero al darle Play, YouTube lo bloquea. Esto ocurre por políticas de derechos de autor de la pista musical o configuración del canal de YouTube.

Dado que la cuenta de YouTube detecta que es "tu propio canal", el detalle está dentro del propio YouTube Studio. 

**Solución definitiva en YouTube:**
1. Ve a **YouTube Studio** (`studio.youtube.com`).
2. Entra a la pestaña **Contenido** (Content) a la izquierda.
3. Haz clic en el **lápiz de edición (Detalles)** del video problemático.
4. Baja del todo de esa página y busca el botón de **"Mostrar más" (Show More)**.
5. Sigue bajando hasta una sección que se llama **"Licencia" (License)**.
6. A la derecha, o debajo, asegúrate que la cajita que dice: **"Permitir inserción" (Allow embedding)** o **"Insertar video"** esté con un chulito azul `[✔]`.
7. Si el video tiene **música con Copyright** de artistas famosos, asegúrate de que esa música no tenga bloqueada la "reproducción en otros sitios web".
8. Guarda los cambios arriba a la derecha.

Este proceso de en YouTube debes hacerlo para los **tres videos** y el problema desaparecerá en tu web.
