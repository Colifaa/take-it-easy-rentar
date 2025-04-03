import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col bg-gradient-to-b from-[#49243E] to-[#704264] text-white px-6 py-8 shadow-xl"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center mb-8 transition-transform hover:scale-105">
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={150} 
          height={150}
          className="rounded-xl"
        />
      </Link>

      {/* Navegación */}
      <div className="flex flex-col gap-y-4">
        <h2 className="text-lg font-semibold text-[#DBAFA0] px-4 mb-2">Panel de Control</h2>
        <NavLinks />
      </div>

      {/* Botón de Salir */}
      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="flex items-center gap-2 p-4 text-sm text-[#DBAFA0] hover:text-white hover:bg-[#BB8493]/20 rounded-lg transition-all duration-300"
        >
          <PowerIcon className="w-6 h-6" />
          <span className="font-medium">Volver al Inicio</span>
        </Link>
      </div>
    </motion.div>
  );
}
