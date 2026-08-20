# PureDecants — sitio del muestrario

Catálogo de decants con bandeja de pedido que termina en WhatsApp. Sitio estático:
no hay servidor, ni base de datos, ni cobro en línea.

## Correr

```bash
npm run dev      # desarrollo en localhost:3000
npm run build    # export estático en out/
npm test         # comprueba el mensaje que se le manda al vendedor
```

`out/` se publica tal cual en cualquier hosting de archivos.

## Publicado

En vivo: **https://matiasgrande.github.io/pure-decants/**

Cada push a `main` dispara `.github/workflows/deploy.yml`, que corre el test, construye y
publica en GitHub Pages. Como el sitio vive en un subdirectorio, el flujo pasa
`NEXT_PUBLIC_BASE_PATH=/pure-decants` y `NEXT_PUBLIC_SITE_URL`; en local ambas quedan
vacías y el sitio corre en la raíz. Con dominio propio, se cambian esas dos variables.

## Cargar precios, stock y fragancias

Hay dos caminos y los dos escriben el mismo archivo, `src/datos/fragancias.json`.

### Desde el panel, sin tocar código

`https://matiasgrande.github.io/pure-decants/admin/` — el dueño entra con un token de
GitHub y desde ahí cambia precios, marca qué medidas hay en stock, edita textos, sube la
foto de un frasco y agrega o quita fragancias. Al pulsar **Publicar cambios** se guarda un
commit en `main`, el flujo de despliegue corre solo y en un par de minutos el sitio está al
día.

El token se crea una sola vez en
[github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens):
token de acceso fino, alcance **solo** el repositorio `matiasgrande/pure-decants`, permiso
**Contents** en lectura y escritura. Queda guardado en el navegador de quien entra, así que
en una computadora prestada hay que salir con el botón «Salir». Si el token se pierde o se
filtra, se revoca en esa misma página y se genera otro: no hay nada más que rotar.

El panel no está enlazado desde el sitio ni lo indexan los buscadores (`noindex`), pero
tampoco es secreto: quien abra la dirección ve la pantalla de acceso. Lo que protege el
catálogo es el token, no la dirección.

### Editando el JSON a mano

```json
{ "ml": 5,  "precio": 12,   "disponible": true },
{ "ml": 10, "precio": 20.5, "disponible": false }
```

`"precio": 0` se muestra como **A confirmar** y el pedido le pide el total al vendedor por
chat, en vez de sumar cifras incompletas. `"disponible": false` marca la medida como
agotada y bloquea el botón.

Para agregar una fragancia: copia un bloque, cambia el `slug` (va en la URL de su ficha) y
pon la foto en `public/perfumes/<slug>.webp`. Si todavía no hay foto, deja
`"imagen": null` y la ficha muestra el vial dibujado.

## Pendientes para el dueño

- **Dos precios sin cargar.** `Gucci Guilty Pour Homme Parfum` y
  `Maison Alhambra Amber and Leather` no aparecen en la lista de precios que pasó. Se
  cargan desde el panel.
- **Fotos.** Solo seis fragancias tienen foto propia; las otras diecinueve muestran el vial
  dibujado hasta que se suba una desde el panel.
- **Textos del catálogo.** Casa, nombre, acordes y precios salen de su catálogo y su lista
  de precios. Las descripciones y el «cuándo usarlo» de las seis primeras las escribió el
  sitio: revisarlas o borrarlas desde el panel.
- **Gucci Guilty.** Su catálogo lista `Guilty Pour Homme` y `Guilty Pour Homme Parfum` por
  separado, pero la lista de precios trae un solo `Gucci Guilty`. Confirmar si son dos
  productos o uno repetido.
- **Logo en alta.** El del encabezado se sacó de la foto de perfil de Instagram y solo
  existe a 100×100 px. Con el archivo original queda nítido en pantallas retina.

## Datos verificados

- WhatsApp `+58 424 824 8160`, resuelto desde el enlace `wa.link/yy6ya1` del bio.
- Medidas 5 ml y 10 ml, publicadas por el negocio.
