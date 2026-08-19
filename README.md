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

## Cargar precios y fragancias

Todo el catálogo vive en `src/datos/fragancias.json`. Mientras una medida tenga
`"precio": 0`, la web la muestra como **A confirmar** y el pedido le pide el total al
vendedor por chat. Al cargar los precios reales, el aviso naranja desaparece solo y el
total se calcula.

```json
{ "ml": 5,  "precio": 12,   "disponible": true },
{ "ml": 10, "precio": 20.5, "disponible": false }
```

`"disponible": false` marca la medida como agotada y bloquea el botón.

Para agregar una fragancia: copia un bloque, cambia el `slug` (va en la URL de su ficha)
y pon la foto en `public/perfumes/<slug>.webp`. Nada más que tocar.

## Pendientes para el dueño

- **Precios de cada medida.** Hoy están todos en 0.
- **Catálogo completo.** Las seis fragancias cargadas salieron de las fotos de
  @puredecantsve; faltan las que no estén publicadas ahí.
- **Nombres exactos.** Verificar `Le Male Le Parfum`, `Y Eau de Parfum` y
  `Versace Dylan Blue`: la foto no alcanza para distinguirlos con certeza de sus
  versiones hermanas.
- **Textos del catálogo.** Descripciones, "cuándo usarlo", notas olfativas y la
  disponibilidad de cada medida son borrador redactado por el sitio, no información que
  haya dado el negocio. Revisar antes de publicar.
- **Logo en alta.** El del encabezado se sacó de la foto de perfil de Instagram y solo
  existe a 100×100 px. Con el archivo original queda nítido en pantallas retina.
- **Fotos propias de los decants.** Los viales del sitio son dibujos; una foto real de
  un frasco de 5 y 10 ml los reemplazaría bien.

## Datos verificados

- WhatsApp `+58 424 824 8160`, resuelto desde el enlace `wa.link/yy6ya1` del bio.
- Medidas 5 ml y 10 ml, publicadas por el negocio.
