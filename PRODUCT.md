# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Compradores venezolanos de fragancia, mayoritariamente en móvil y con datos limitados, que
quieren usar perfumes originales de casas conocidas (Dior, YSL, Armani, Versace, Jean Paul
Gaultier) sin pagar el frasco completo. Dos situaciones dominantes:

- **El que prueba antes de comprar.** Vio una fragancia recomendada y no quiere arriesgar el
  precio de un frasco entero en un aroma que quizá no le va.
- **El que arma variedad.** Quiere una fragancia distinta para entrenar, para trabajar y para
  salir, en vez de usar el mismo perfume todo el año.

Llegan casi siempre desde el Instagram del negocio (@puredecantsve), donde ya vieron el
producto; la web es el paso donde eligen concretamente qué y cuánto.

## Product Purpose

PureDecants reenvasa perfume 100% original en frascos de 5 ml y 10 ml y los vende a una
fracción del precio del frasco completo. La web existe para que el comprador arme su pedido
solo — fragancia, tamaño, cantidad — y lo entregue por WhatsApp ya redactado, en lugar de
describirlo a mano en un chat. Éxito es un pedido que llega al vendedor completo y sin
ambigüedad, y un comprador que entendió qué es un decant antes de escribir.

## Positioning

Perfume original, no imitación ni "inspirado en", en la cantidad que la persona realmente usa.
Sus propias palabras: **"Grandes aromas, pequeñas dosis."** y **"No compres a ciegas, prueba
primero."** El decant es reenvasado con un proceso limpio a partir del frasco original: la
fragancia es idéntica, lo único que cambia es el envase y la cantidad.

## Operating Context

- Base en Isla de Margarita, con envíos a toda Venezuela.
- El pago no puede automatizarse: acceder a las APIs de los bancos venezolanos exige ser
  empresa constituida. El pago se coordina y se verifica manualmente por WhatsApp.
- El canal de venta actual es Instagram y WhatsApp; la web se suma a ese flujo, no lo
  reemplaza.
- El pedido termina en WhatsApp **+58 424-824-8160** (resuelto desde `wa.link/yy6ya1`, el
  enlace del bio de Instagram).
- El envío no se calcula en la web: se acuerda en la conversación.

## Capabilities and Constraints

- Presentaciones confirmadas: **5 ml y 10 ml**.
- La web no cobra, no procesa pagos, no valida stock en vivo ni pide dirección de envío.
- Catálogo estático en un JSON del repositorio: agregar fragancia, cambiar precio o marcar
  agotado es editar ese archivo y volver a desplegar.
- El carrito vive en el navegador del visitante y sobrevive a recargar la página.
- Alcance: catálogo más una página por fragancia (notas, familia olfativa, descripción).
- Debe funcionar bien en móvil sobre conexiones lentas.
- **Sin decidir:** precios por presentación, catálogo completo y stock real. Los tiene el
  dueño; hasta que los confirme, cada precio se muestra como pendiente y nunca como cifra
  inventada.

## Brand Commitments

- Nombre: **PureDecants** (@puredecantsve).
- Identidad existente, tomada de sus propias piezas: negro carbón, dorado tenue, serif display
  fino en mayúsculas muy espaciadas, líneas topográficas doradas como ornamento, logo
  monograma "P" line-art con gota sobre disco crema.
- Fotografía de producto oscura y dramática, frasco protagonista.
- Frases propias que la web debe conservar: "Grandes aromas, pequeñas dosis.",
  "No compres a ciegas, prueba primero.", "Fragancias originales. Formatos mini."
- La web debe leerse como continuación de su Instagram, que es de donde llega la gente.

## Evidence on Hand

- Instagram @puredecantsve: 10 publicaciones, ~200 seguidores, fotografía propia de producto.
- Fragancias visibles en el feed: Jean Paul Gaultier Le Male, Armani Code Parfum, YSL Y EDP,
  Versace Eros EDP, Acqua di Giò Profondo, un Versace azul sin identificar con certeza.
- Portada de su catálogo (story destacada) con la identidad tipográfica y ornamental.
- **No hay:** testimonios, reseñas, cifras de ventas, garantías ni acuerdos con marcas. Nada
  de eso puede fabricarse en la web.

## Product Principles

1. **El pedido se arma solo, el trato es humano.** La web elimina el ida y vuelta de "¿qué
   tamaño?, ¿cuánto cuesta?", no la conversación.
2. **Original es la promesa central.** Cada pieza debe sostener que es perfume auténtico
   reenvasado, nunca imitación.
3. **Educar antes de vender.** Buena parte del visitante no sabe qué es un decant; si no lo
   entiende, no compra.
4. **Peso antes que espectáculo.** Móvil venezolano con datos caros: cada megabyte se justifica
   o se va.
5. **Ningún dato inventado.** Precio, stock o promesa que no venga del dueño se muestra como
   pendiente.

## Accessibility & Inclusion

Móvil primero sobre conexiones lentas. Contraste legible sobre fondo oscuro en pantallas
baratas y a plena luz. `prefers-reduced-motion` respetado sin excepción.
