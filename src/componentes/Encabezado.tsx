import Image from "next/image";
import Link from "next/link";
import { rutaPublica } from "@/lib/rutas";

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 border-b border-oro-hondo/35 bg-tinta/92 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6 py-3 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={rutaPublica("/logo-puredecants.webp")}
            alt=""
            width={100}
            height={100}
            className="h-9 w-9 rounded-full"
            priority
          />
          <span className="grabado leading-none text-crema">
            Pure<span className="text-oro">Decants</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
