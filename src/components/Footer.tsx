import { useState } from "react";
import { ChevronDown, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const footerSections = [
    {
      title: "INFORMACIÓN",
      items: ["Términos y condiciones", "Política de privacidad", "Defensa del consumidor"]
    },
    {
      title: "AYUDA",
      items: ["Preguntas frecuentes", "Contacto", "Cambios y devoluciones"]
    },
    {
      title: "CLIENTES",
      items: ["Mi cuenta", "Mis pedidos", "Lista de deseos"]
    }
  ];

  return (
    <footer className="bg-gray-200 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Popular search terms */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-base sm:text-lg">Términos más buscados</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-sm">
            {[
              "zapatillas", "zapatillas mujer", "futbol", "adidas", "running",
              "botines", "medias", "tenis", "mochila", "basquet"
            ].map((term, index) => (
              <div key={index} className="hover:text-orange-500 cursor-pointer transition-colors">
                {index + 1}. {term}
              </div>
            ))}
          </div>
        </div>

        {/* Footer sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {footerSections.map((section) => (
            <div key={section.title} className="border-b md:border-b-0 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-left font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-expanded={openSections.includes(section.title)}
                aria-controls={`footer-section-${section.title}`}
              >
                {section.title}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes(section.title) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`footer-section-${section.title}`}
                className={`${
                  openSections.includes(section.title) ? 'block' : 'hidden'
                } md:block`}
              >
                <ul className="space-y-2 text-sm pt-2">
                  {section.items.map((item, index) => (
                    <li key={index} className="hover:text-orange-500 cursor-pointer transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Social media and copyright */}
        <div className="border-t pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center">
            <div className="w-full md:w-auto flex flex-col items-center md:items-start mb-4 md:mb-0">
              <h4 className="font-semibold mb-2 text-base sm:text-lg">SEGUINOS</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-6 w-6 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-6 w-6 hover:text-orange-500 cursor-pointer transition-colors" />
                </a>
              </div>
            </div>
            <div className="w-full md:w-auto text-center md:text-right text-sm text-gray-600">
              © 2022 Showsport - Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
// ...existing code...