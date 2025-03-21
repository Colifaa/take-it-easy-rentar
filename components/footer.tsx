"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

export function Footer() {
  const { language } = useLanguage();
  const t = languages[language];

  return (
    <footer className="relative bg-gradient-to-r from-[#c47369] to-[#d8847a] text-white bg-opacity-95">
      <div className="before:bg-wave-pattern before:absolute before:top-0 before:left-0 before:w-full before:h-8"></div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* LOGO + DESCRIPCIÓN */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src="/logo.png" alt="AutoRent Logo" className="w-40 h-auto mb-6" />
            <p className="text-neutral-100">{t.footer.description}</p>
          </div>

          {/* ENLACES */}
          <div>
            <h3 className="font-semibold text-lg md:text-xl mb-4 tracking-wide">Links</h3>
            <ul className="space-y-2 text-neutral-200">
              <li>
                <Link href="/" className="hover:underline">{t.navbar.home}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">{t.navbar.about}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">{t.navbar.contact}</Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="font-semibold text-lg md:text-xl mb-4 tracking-wide">{t.footer.contact}</h3>
            <ul className="space-y-2 text-neutral-200">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-white" />
                <span>+61 421 602 018</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-white" />
                <span>info@autorent.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-white" />
                <span> 21 Eumundi Rd </span>
              </li>
            </ul>
          </div>

          {/* REDES SOCIALES */}
          <div>
            <h3 className="font-semibold text-lg md:text-xl mb-4 tracking-wide">{t.footer.follow}</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:scale-110 transition-transform">
                <Facebook className="h-7 w-7 text-white" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Instagram className="h-7 w-7 text-white" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <Twitter className="h-7 w-7 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white mt-12 pt-6 text-center text-xs text-neutral-200">
          <p>&copy; {new Date().getFullYear()} AutoRent. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
