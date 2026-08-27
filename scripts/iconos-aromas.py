"""Genera los iconos de familia olfativa a partir de las ilustraciones del duenio.

    python3 scripts/iconos-aromas.py [hoja-de-contacto.png]

Recorta el fondo de las ilustraciones de aroma y las normaliza a un icono
cuadrado con alpha, en los dos tamanos que dibuja la pagina. El fondo es casi
negro y el trazo es dorado brillante, asi que la propia luminancia sirve de
mascara: no hace falta recortar a mano."""
from PIL import Image
import os, sys

ORIGEN = "puredecants-iconos-aromas"
DESTINO = "public/aromas"
LADOS = (64, 144)       # casilla del catalogo a 2x, barra de la ficha a 3x
MARGEN = 0.06           # aire alrededor del dibujo, igual para todos
TOPE = 0.97             # ni el lado largo del dibujo mas grande toca el borde
TINTA = 0.17            # cobertura de trazo de la ilustracion promedio
COMP, COMP_MIN, COMP_MAX = 0.12, 0.90, 1.06   # cuanto se corrige por esa cobertura
PISO, TECHO = 55, 150   # fondo por debajo del piso, trazo pleno por encima del techo
VISIBLE = 40            # alpha desde el que un pixel cuenta para encuadrar

# El nombre del archivo es el del dibujo, no el de la familia: hay familias con
# dos dibujos —"cuero" y "animalico" caen las dos en cuero— y el que reparte cual
# le toca a cada acorde es src/lib/acordes.ts, no esta tabla.
DIBUJO = {
    "01-marino": "marino",
    "02-aromatico": "aromatico",
    "03-citrico": "citrico",
    "04-fresco-especiado": "fresco-especiado",
    "05-fresco": "fresco",
    "06-avainillado": "avainillado",
    "07-amaderado": "amaderado",
    "08-cuero": "cuero",
    "09-ambar": "ambar",
    "10-dulce": "dulce",
    "11-afrutado": "afrutado",
    "12-calido-especiado": "calido-especiado",
    "13-lavanda": "lavanda",
    "14-verde": "verde",
    "15-atalcado": "atalcado",
    "16-oud": "oud",
    "17-cacao": "cacao",
    "18-ozonico": "ozonico",
    "19-animalico": "animalico",
    "20-balsamico": "balsamico",
    "21-terroso": "terroso",
    "22-florales": "florales",
    "23-floral-blanco": "floral-blanco",
    "24-nueces": "nueces",
    "25-almendrado": "almendrado",
    "26-ahumado": "ahumado",
}

RAMPA = [0 if v <= PISO else 255 if v >= TECHO else round((v - PISO) * 255 / (TECHO - PISO))
         for v in range(256)]


def recortar(ruta):
    """Devuelve el dibujo sin fondo, pegado a sus bordes.

    El recuadro sale de los pixeles que de verdad se ven, no de cualquiera con
    alpha mayor que cero. Algunos originales traen un halo tenue alrededor del
    trazo —`02-aromatico` llega a inflar su ancho al doble— y encuadrar contra
    ese halo deja el dibujo chico y descentrado: al bajar a 144 px el halo se
    evapora y el dibujo queda nadando en su propio margen.
    """
    rgb = Image.open(ruta).convert("RGB")
    alpha = rgb.convert("L").point(RAMPA)
    caja = alpha.point(lambda v: 255 if v > VISIBLE else 0).getbbox()
    if caja is None:
        raise SystemExit(f"{ruta}: la mascara salio vacia, revisar el umbral")
    return rgb.crop(caja), alpha.crop(caja)


def cobertura(alpha):
    """Que porcion del recuadro del dibujo esta realmente trazada."""
    suma = sum(v * c for v, c in enumerate(alpha.histogram()))
    return suma / 255 / (alpha.width * alpha.height)


def encuadrar(rgb, alpha, lado):
    """Mete el dibujo en un cuadrado con el mismo peso optico que sus hermanos.

    Dos correcciones, ambas medidas sobre el dibujo y no sobre su recuadro:

    El original encuadra a su antojo —marino llena la hoja, lavanda ocupa un
    tercio— y ajustar solo por el lado largo dejaria a la lavanda y a la hoja de
    aromatico leyendose flacas al lado de un circulo lleno. Promediar el lado
    largo con la media geometrica les devuelve presencia sin deformar nada.

    Y un disco de trazo apretado —citrico, amaderado— pesa mas que una hoja del
    mismo alto, asi que la cobertura de trazo lo encoge un punto y agranda a la
    hoja. Los tres numeros de COMP estan tanteados a ojo contra la hoja de
    contacto de estas trece; si entran ilustraciones de otra mano, revisarlos.
    """
    largo = max(rgb.size)
    medio = (rgb.width * rgb.height) ** 0.5
    peso = min(COMP_MAX, max(COMP_MIN, (TINTA / cobertura(alpha)) ** COMP))
    escala = peso * lado * (1 - 2 * MARGEN) / (0.65 * largo + 0.35 * medio)
    escala = min(escala, lado * TOPE / largo)
    tam = (max(1, round(rgb.width * escala)), max(1, round(rgb.height * escala)))
    rgb, alpha = rgb.resize(tam, Image.LANCZOS), alpha.resize(tam, Image.LANCZOS)

    # El original ya venia oscurecido contra su fondo negro; al volverlo
    # semitransparente el trazo se apagaria dos veces. Deshacer ese
    # premultiplicado devuelve el dorado a su brillo real.
    px, pa = rgb.load(), alpha.load()
    for y in range(rgb.height):
        for x in range(rgb.width):
            a = pa[x, y]
            if 0 < a < 255:
                r, g, b = px[x, y]
                k = 255 / a
                px[x, y] = (min(255, round(r * k)), min(255, round(g * k)), min(255, round(b * k)))

    rgb.putalpha(alpha)
    lienzo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    lienzo.paste(rgb, ((lado - tam[0]) // 2, (lado - tam[1]) // 2))
    return lienzo


os.makedirs(DESTINO, exist_ok=True)
hojas, total = [], 0
for base, dibujo in sorted(DIBUJO.items()):
    rgb, alpha = recortar(f"{ORIGEN}/{base}.jpg")
    pesos = []
    for lado in LADOS:
        icono = encuadrar(rgb.copy(), alpha.copy(), lado)
        salida = f"{DESTINO}/{dibujo}{'' if lado == max(LADOS) else f'-{lado}'}.webp"
        icono.save(salida, "WEBP", quality=88, method=6)
        peso = os.path.getsize(salida)
        total += peso
        pesos.append(f"{lado}px {peso / 1024:5.1f} KB")
        if lado == max(LADOS):
            hojas.append(icono)
    print(f"{dibujo:18} {'   '.join(pesos)}")
print(f"{'total':18} {total / 1024:.1f} KB")

# Hoja de contacto sobre el negro real de la pagina, para revisar el recorte.
cols, celda = 5, 160
hoja = Image.new("RGB", (cols * celda, -(-len(hojas) // cols) * celda), (0x0A, 0x0A, 0x0B))
for i, ic in enumerate(hojas):
    hoja.paste(ic, ((i % cols) * celda + 8, (i // cols) * celda + 8), ic)
hoja.save(sys.argv[1] if len(sys.argv) > 1 else "hoja-aromas.png")
