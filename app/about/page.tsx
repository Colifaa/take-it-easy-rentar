"use client";

import { Shield, Star, Clock, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "../../hooks/use-language";
import { languages } from "../../lib/languages";
import MusicPlayer from "@/components/MusicPlayer";

export default function About() {

    const { language } = useLanguage();
    const t = languages[language];
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white ">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">{t.about.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-semibold mb-6">{t.about.header}</h2>
              <p className="text-gray-600 mb-4">
              {t.about.paragraph1}
              </p>
              <p className="text-gray-600">
              {t.about.paragraph2}
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1562519819-016930ada31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Equipo de trabajo"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t.about.paragraph3}</h3>
              <p className="text-sm text-gray-600">{t.about.description1}</p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t.about.paragraph4}</h3>
              <p className="text-sm text-gray-600">{t.about.description2}</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t.about.paragraph5}</h3>
              <p className="text-sm text-gray-600">{t.about.description3}</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t.about.paragraph6}</h3>
              <p className="text-sm text-gray-600">{t.about.description4}</p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}