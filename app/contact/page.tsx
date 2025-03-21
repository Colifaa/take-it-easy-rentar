"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../../hooks/use-language";
import { languages } from "../../lib/languages";
import { Footer } from "@/components/footer";

export default function Contact() {
  const { language } = useLanguage();
  const t = languages[language];

  return (
    <main className="min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">
            {t.contact.sendMessage}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.contact.phone}</h3>
              <p className="text-gray-600">+61 421 602 018</p>
              <p className="text-gray-600">{t.contact.hours}</p>
            </Card>
            <Card className="p-6">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.contact.email}</h3>
              <p className="text-gray-600">info@autorent.com</p>
              <p className="text-gray-600">soporte@autorent.com</p>
            </Card>
            <Card className="p-6">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.contact.location}</h3>
              <p className="text-gray-600">21 Eumundi Rd</p>
              <p className="text-gray-600">Australia Noosaville Queensland</p>
            </Card>
          </div>

        
           

            {/* Mapa */}
            <div className="overflow-hidden rounded-lg">
              <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] border border-gray-200 shadow-md rounded-md">
               <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3573.7449698814685!2d153.04977737542188!3d-26.399425776956832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDIzJzU3LjkiUyAxNTPCsDAzJzA4LjUiRQ!5e0!3m2!1ses-419!2sar!4v1740002613373!5m2!1ses-419!2sar"
                width="1800"
                height="800"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              </div>
            </div>
          </div>
   
      </section>

      <Footer />
    </main>
  );
}
