import type { NextConfig } from "next";

// En GitHub Pages el sitio vive en /pure-decants/, no en la raíz del dominio.
// La variable la pone el flujo de despliegue; en local queda vacía.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Export estático: se publica en cualquier hosting, sin servidor Node.
  output: "export",
  basePath,
  images: {
    // El export estático no lleva optimizador en runtime; las imágenes ya vienen
    // comprimidas a webp en public/perfumes.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
