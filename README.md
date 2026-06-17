# Rabieta — Flujo de retiro

Sitio estático de 3 páginas que reproduce la interfaz de Skipit para el retiro de productos Rabieta.

## Páginas

1. **`index.html`** — *Mis productos*. Lista de cervezas con checkboxes. Botón **Confirmar Retiro** (habilitado al seleccionar al menos un producto).
2. **`retirar.html`** — *Confirmar retiro*. Resumen de lo elegido + control **deslizar para confirmar**.
3. **`confirmado.html`** — *Retiro confirmado*. Pantalla de éxito con código de retiro.

El estado (productos seleccionados) se guarda en `sessionStorage`, por lo que persiste entre páginas.

## Estructura

```
.
├── index.html
├── retirar.html
├── confirmado.html
├── .nojekyll
└── assets/
    ├── styles.css
    ├── app.js          # lógica compartida + datos de productos
    ├── slider.js       # control deslizar-para-confirmar (página 2)
    ├── confirm.js      # placeholder (página 3 usa app.js)
    ├── beer.svg
    └── favicon.svg
```

## Probar localmente

```bash
python3 -m http.server 8080
# luego abrir http://localhost:8080
```

## Desplegar en GitHub Pages

1. Crear un repositorio y subir todo el contenido de esta carpeta a la raíz.
2. En **Settings → Pages**, elegir la rama (`main`) y carpeta `/ (root)`.
3. La URL será `https://<usuario>.github.io/<repo>/`.

> Los enlaces usan rutas **relativas** (`./retirar.html`, `./assets/...`), así que funcionan tanto en la raíz del dominio como en un subdirectorio de GitHub Pages. El archivo `.nojekyll` evita que Jekyll ignore la carpeta `assets/`.

## Editar productos

Modificar el array `PRODUCTS` en [`assets/app.js`](assets/app.js).
