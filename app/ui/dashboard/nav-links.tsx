import {
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

// Lista de enlaces de navegación
const links = [
  { name: "Vehículos", href: "/dashboard", icon: HomeIcon },
  { name: "Comentarios", href: "/dashboard/invoices", icon: DocumentDuplicateIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md 
              bg-[#704264]/50 p-3 text-sm font-medium text-[#DBAFA0] transition-all duration-300 
              hover:bg-[#BB8493]/80 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6 text-[#DBAFA0]" />
            <p className="hidden md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
