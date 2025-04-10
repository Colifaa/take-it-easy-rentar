import {
  HomeIcon,
  DocumentDuplicateIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Lista de enlaces de navegación
const links = [
  { name: "Vehículos", href: "/dashboard", icon: HomeIcon },
  { name: "Comentarios", href: "/dashboard/invoices", icon: DocumentDuplicateIcon },
  { name: "Música", href: "/dashboard/music", icon: MusicalNoteIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex h-[48px] grow items-center justify-start gap-2 rounded-lg 
                p-3 text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-[#BB8493] text-white shadow-lg' 
                  : 'bg-[#704264]/30 text-[#DBAFA0] hover:bg-[#BB8493]/20 hover:text-white'
                }`}
            >
              <LinkIcon className={`w-6 ${isActive ? 'text-white' : 'text-[#DBAFA0]'}`} />
              <span>{link.name}</span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
