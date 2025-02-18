import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-[#49243E] text-white px-4 py-6 shadow-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center mb-6">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </Link>

      {/* Navegación */}
      <div className="flex flex-col gap-y-1 justify-between">
  

        <NavLinks />
        
 
      </div>
    </div>
  );
}
