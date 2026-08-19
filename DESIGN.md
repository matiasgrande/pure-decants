---
name: PureDecants
description: Muestrario de fragancias originales en 5 y 10 ml, donde el pedido se arma como una bandeja de viales y se entrega por WhatsApp.
colors:
  ink: "#0A0A0B"
  ink-raised: "#121214"
  ink-well: "#050506"
  gold: "#C9A45C"
  gold-light: "#E6D2A4"
  gold-deep: "#7A5F2E"
  cream: "#F2ECE0"
  cream-dim: "#A9A196"
  glass: "#D8CDB8"
  alert: "#D98A5A"
typography:
  display:
    fontFamily: "var(--fuente-display), Didot, 'Bodoni 72', serif"
    fontSize: "clamp(2.6rem, 9vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.02em"
  grabado:
    fontFamily: "var(--fuente-display), Didot, serif"
    fontSize: "clamp(0.72rem, 1.6vw, 0.85rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.34em"
  body:
    fontFamily: "var(--fuente-texto), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0.005em"
  etiqueta:
    fontFamily: "var(--fuente-texto), system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  nada: "0px"
  vial: "2px"
  frasco: "6px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  boton-primario:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.vial}"
    padding: "16px 32px"
    typography: "{typography.etiqueta}"
  boton-primario-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.ink}"
  boton-contorno:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.vial}"
    padding: "14px 24px"
    typography: "{typography.etiqueta}"
  celda-vial:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.cream}"
    rounded: "{rounded.vial}"
    padding: "0px"
  medida-activa:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.vial}"
    padding: "10px 16px"
  medida-inactiva:
    backgroundColor: "transparent"
    textColor: "{colors.cream-dim}"
    rounded: "{rounded.vial}"
    padding: "10px 16px"
---

# PureDecants — sistema visual

## Overview

La superficie es **un muestrario**, no una tienda con fichas. El catálogo se lee como una
bandeja de viales alineados en un estuche: cada fragancia ocupa una casilla de la bandeja, y
el pedido que arma el visitante es literalmente el set que va poblando. Esa metáfora existe
porque el negocio no vende un frasco, vende la posibilidad de tener varios.

El mundo material viene del propio negocio: negro carbón de sus fotos de producto, dorado
tenue de su monograma, serif de alto contraste en mayúsculas muy espaciadas como en la portada
de su catálogo, y líneas topográficas doradas de ornamento. Nada de esto se inventó aquí: se
extrajo de sus piezas y se amplió a escala de web.

Oscuro por escena de uso, no por categoría: la persona llega desde Instagram, de noche, en un
teléfono, y las fotos que va a ver son frascos negros sobre fondo negro. Un fondo claro
recortaría cada foto con un halo y rompería la continuidad con el feed.

## Colors

`ink #0A0A0B` es el estuche cerrado y ocupa toda la superficie. `ink-raised #121214` es el
interior de la bandeja: las casillas se distinguen del fondo por medio tono, nunca por una
sombra dura. `ink-well #050506` es el hueco donde se apoya un vial.

`gold #C9A45C` es luz, no relleno: filetes de 1px, medida activa, acción principal, cifras.
`gold-light #E6D2A4` solo en hover y en texto dorado pequeño, donde el dorado medio pierde
contraste. `gold-deep #7A5F2E` únicamente en bordes y en las líneas topográficas.

`cream #F2ECE0` es todo el texto de lectura. El secundario es `cream-dim #A9A196`, tintado
hacia el cálido del fondo — nunca gris neutro. `alert #D98A5A` marca lo pendiente (un precio
sin confirmar) y lo agotado; es el único color que no pertenece al par negro/dorado y por eso
señala excepción.

Regla de proporción: el negro es el 85% de la superficie, el crema el 12%, el dorado el 3%.
El dorado deja de significar cuando cubre áreas.

## Typography

Dos familias, ambas variables y subseteadas a latín.

**Bodoni Moda** para display y para lo grabado. Alto contraste modulado, como el serif de su
catálogo. Dos usos y no más: títulos grandes en tamaño óptico display, y "grabados" — líneas
cortas en mayúsculas con `letter-spacing: 0.34em`, que imitan el texto impreso sobre vidrio de
una etiqueta. El grabado es el kicker del sistema, y por eso aparece contado: encabeza la
bandeja y la ficha de fragancia, no cada sección.

**Archivo** para todo lo demás: párrafos, controles, etiquetas de interfaz, cifras. Las
medidas (5 ml, 10 ml) y los precios usan `font-variant-numeric: tabular-nums` para que las
columnas de la bandeja alineen.

Medida de lectura entre 62 y 72 caracteres. Display tope 5.6rem. Tracking del display 0.02em
positivo — este serif se abre, no se aprieta.

## Layout

Bandeja de ancho máximo 1240px con canal lateral de 24px en móvil y 48px desde 900px.

La bandeja es una grilla de casillas: 1 columna hasta 520px, 2 hasta 900px, 3 arriba. Las
casillas comparten filetes de 1px `gold-deep` a 40% en lugar de separarse con espacio, porque
en un estuche los compartimientos se tocan. El ritmo vertical usa un solo paso: 96px entre
capítulos, 48px dentro, 24px entre elementos hermanos, y siempre más aire arriba de un título
que debajo.

El panel de pedido es lateral fijo desde 1024px y barra inferior fija en móvil, con la altura
del pulgar en cuenta.

## Elevation & Depth

No hay tarjetas flotantes. La profundidad es de estuche: un hueco más oscuro (`ink-well`) con
un filete claro arriba y una sombra interior baja simula el rebaje donde descansa el vial.
Cuando una casilla se eleva al hover, sube 2px y su filete pasa de `gold-deep` a `gold`; la
sombra que la acompaña tiene desplazamiento vertical real y desenfoque suave, nunca un halo
centrado.

El vidrio del vial se sugiere con un gradiente vertical estrecho y un reflejo de 1px, no con
`backdrop-filter`.

## Shapes

Casi rectas. Radio 2px en viales y controles, 6px en la foto de un frasco, 0 en las bandejas.
Un estuche no tiene esquinas redondeadas: las tienen los frascos que guarda.

Las líneas topográficas doradas son el único ornamento, dibujadas en SVG inline, a 1px, con
opacidad entre 0.12 y 0.22, ancladas a esquinas y nunca detrás de texto de lectura.

## Components

- **Casilla de fragancia:** foto del frasco a sangre, grabado con la casa, nombre en display,
  familia olfativa en `cream-dim`, selector de medida y acción de poner en bandeja. El precio
  pendiente se muestra como tal, en `alert`, nunca como cifra.
- **Selector de medida:** dos segmentos, 5 ml y 10 ml, uno activo en dorado sólido. Es un
  control de radio real, operable con teclado, no dos botones.
- **Bandeja de pedido:** lista de viales colocados con su medida y cantidad, más el conteo. Su
  estado vacío dice qué hacer, no que está vacío. Cierra con la acción a WhatsApp.
- **Acción a WhatsApp:** dorado sólido, la única de ese peso en toda la página. Su etiqueta
  nombra lo que hace — enviar el pedido —, no "comprar", porque el pago se acuerda después.
- **Aviso de precio pendiente:** franja discreta en `alert` que explica que las cifras las
  confirma el vendedor por WhatsApp. Desaparece sola cuando el JSON trae precios.

## Do's and Don'ts

- Escribe en la lengua del negocio: bandeja, vial, medida, fragancia, casa. Nada de "producto",
  "item" ni "SKU".
- Una sola pieza de movimiento autorizada: el vial que viaja a la bandeja al agregarlo, con la
  bandeja acusando recibo. Todo lo demás entra ya visible.
- No inventes precio, stock, reseña ni acuerdo con una marca. Lo que no confirmó el dueño se
  muestra pendiente.
- No agregues tarjetas de icono más título más texto, ni numeración de secciones, ni contadores
  de estadísticas. La estructura es la bandeja.
- No uses el dorado como fondo de áreas grandes ni como texto sobre crema.
- `prefers-reduced-motion: reduce` apaga el viaje del vial; el estado final es idéntico.
