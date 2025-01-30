"use client";  

import Link from "next/link";  
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";  

import { useLanguage } from "../hooks/use-language";  
import { languages } from "../lib/languages";  

export function Footer() {  
  const { language } = useLanguage();  
  const t = languages[language];  

  return (  
    <footer className="bg-gradient-to-r from-blue-400 to-pink-500 text-white">  
      <div className="container mx-auto px-4 py-12">  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">  
          <div>  
            <h3 className="font-bold text-lg mb-4">AutoRent</h3>  
            <p className="text-sm">{t.footer.description}</p>  
          </div>  

          <div>  
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>  
            <ul className="space-y-2">  
              <li>  
                <Link href="/" className="hover:underline transition-colors">  
                  {t.navbar.home}  
                </Link>  
              </li>  
              <li>  
                <Link href="/about" className="hover:underline transition-colors">  
                  {t.navbar.about}  
                </Link>  
              </li>  
              <li>  
                <Link href="/contact" className="hover:underline transition-colors">  
                  {t.navbar.contact}  
                </Link>  
              </li>  
            </ul>  
          </div>  

          <div>  
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>  
            <ul className="space-y-2">  
              <li className="flex items-center space-x-2">  
                <Phone className="h-4 w-4" />  
                <span>+1 234 567 890</span>  
              </li>  
              <li className="flex items-center space-x-2">  
                <Mail className="h-4 w-4" />  
                <span>info@autorent.com</span>  
              </li>  
              <li className="flex items-center space-x-2">  
                <MapPin className="h-4 w-4" />  
                <span>123 Calle Principal</span>  
              </li>  
            </ul>  
          </div>  

          <div>  
            <h3 className="font-bold text-lg mb-4">{t.footer.follow}</h3>  
            <div className="flex space-x-4">  
              <a href="#" className="hover:text-blue-300 transition-colors">  
                <Facebook className="h-6 w-6" />  
              </a>  
              <a href="#" className="hover:text-purple-300 transition-colors">  
                <Instagram className="h-6 w-6" />  
              </a>  
              <a href="#" className="hover:text-blue-300 transition-colors">  
                <Twitter className="h-6 w-6" />  
              </a>  
            </div>  
          </div>  
        </div>  

        <div className="border-t border-white mt-8 pt-8 text-center text-sm">  
          <p>  
            &copy; {new Date().getFullYear()} AutoRent. {t.footer.rights}  
          </p>  
        </div>  
      </div>  
    </footer>  
  );  
}