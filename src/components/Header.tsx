import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

<Link href="/">Home</Link>


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo */}
        <link href="/" className="text-xl font-bold text-orange-600">
          SHOWSPORT
        </link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden bg-white border-t transition-all duration-300 ${
          menuOpen ? "max-h-96 py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-4 px-4">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
// ...existing code...