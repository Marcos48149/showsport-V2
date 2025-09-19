"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";
import { useBlog } from "@/contexts/BlogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowRight,
  Clock,
  User,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Star
} from "lucide-react";
import Link from "next/link";

export default function BlogHub() {
  const { state, getFeaturedPosts, searchPosts } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const featuredPosts = getFeaturedPosts(6);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchPosts(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-red-50 py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Blog ShowSport
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                Guías, consejos y todo lo que necesitás saber sobre zapatillas deportivas.
                Desde cómo elegir el talle perfecto hasta las últimas tendencias.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative px-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar guías, consejos, reviews..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-4 text-base md:text-lg border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-0"
                  />
                </div>

                {/* Search Results */}
                {showResults && (
                  <div className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.category.slug}/${post.slug}`}
                          className="block p-3 md:p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          onClick={() => setShowResults(false)}
                        >
                          <h4 className="font-medium text-gray-900 text-sm md:text-base">{post.title}</h4>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-white ${post.category.color}`}>
                              {post.category.name}
                            </span>
                            <span>{post.readingTime} min de lectura</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No se encontraron resultados para "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1 md:mb-2">50+</div>
                <div className="text-xs md:text-sm text-gray-600">Guías Completas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-1 md:mb-2">7</div>
                <div className="text-xs md:text-sm text-gray-600">Categorías Especializadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-500 mb-1 md:mb-2">100k+</div>
                <div className="text-xs md:text-sm text-gray-600">Lectores Mensuales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-500 mb-1 md:mb-2">4.9</div>
                <div className="text-xs md:text-sm text-gray-600">Rating Promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-8 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Explorá por Categoría
              </h2>
              <p className="text-base md:text-lg text-gray-600 px-4">
                Encuentra exactamente lo que necesitás con nuestras categorías especializadas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {state.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/${category.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-lg md:text-xl`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors text-sm md:text-base truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">{category.postCount} artículos</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center text-orange-500 text-xs md:text-sm font-medium group-hover:text-orange-600">
                    <span>Ver artículos</span>
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                  Artículos Destacados
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  Los artículos más útiles y populares de nuestro blog
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-orange-500">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Más leídos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group ${
                    index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <Link href={`/blog/${post.category.slug}/${post.slug}`}>
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm font-medium ${post.category.color}`}>
                          {post.category.name}
                        </span>
                      </div>
                      {post.schemaType && (
                        <div className="absolute top-3 md:top-4 right-3 md:right-4">
                          <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                            {post.schemaType === 'HowTo' && '📋 Guía'}
                            {post.schemaType === 'FAQ' && '❓ FAQ'}
                            {post.schemaType === 'Review' && '⭐ Review'}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 md:p-6">
                    <Link href={`/blog/${post.category.slug}/${post.slug}`}>
                      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-gray-500 mb-3 md:mb-4 gap-2">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="truncate">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{post.readingTime} min</span>
                        </div>
                      </div>
                      <time className="text-right">{formatDate(post.publishedAt)}</time>
                    </div>

                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link href={`/blog/${post.category.slug}/${post.slug}`}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 group text-sm md:text-base">
                        Leer Artículo
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-12">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Ver Todos los Artículos
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-8 md:py-16 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Suscribite al Newsletter
            </h2>
            <p className="text-lg md:text-xl text-orange-100 mb-6 md:mb-8 px-4">
              Recibí las últimas guías, consejos y ofertas exclusivas directamente en tu email
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto px-4">
              <Input
                type="email"
                placeholder="Tu email"
                className="flex-1 bg-white text-base"
              />
              <Button className="bg-white text-orange-500 hover:bg-gray-100 whitespace-nowrap">
                Suscribirme
              </Button>
            </div>

            <p className="text-sm text-orange-100 mt-3 md:mt-4 px-4">
              Sin spam. Solo contenido valioso. Cancelá cuando quieras.
            </p>
          </div>
        </section>

        {/* SEO Links Section */}
        <section className="py-8 md:py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
              Artículos Populares por Tema
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Running</h4>
                <ul className="space-y-1">
                  <li><Link href="/blog/guias-compra/zapatillas-running-principiantes" className="text-gray-600 hover:text-orange-500 block truncate">Zapatillas para principiantes</Link></li>
                  <li><Link href="/blog/guias-compra/zapatillas-running-avanzados" className="text-gray-600 hover:text-orange-500 block truncate">Running avanzado</Link></li>
                  <li><Link href="/blog/guia-talles/talle-nike-running" className="text-gray-600 hover:text-orange-500 block truncate">Talles Nike running</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basketball</h4>
                <ul className="space-y-1">
                  <li><Link href="/blog/guias-compra/zapatillas-basketball-interior" className="text-gray-600 hover:text-orange-500 block truncate">Basketball interior</Link></li>
                  <li><Link href="/blog/reviews-productos/jordan-vs-nike" className="text-gray-600 hover:text-orange-500 block truncate">Jordan vs Nike</Link></li>
                  <li><Link href="/blog/guia-talles/talle-adidas-basketball" className="text-gray-600 hover:text-orange-500 block truncate">Talles Adidas basketball</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cambios</h4>
                <ul className="space-y-1">
                  <li><Link href="/blog/devoluciones-cambios/como-cambiar-zapatillas" className="text-gray-600 hover:text-orange-500 block truncate">Cómo cambiar zapatillas</Link></li>
                  <li><Link href="/blog/devoluciones-cambios/politica-cambios" className="text-gray-600 hover:text-orange-500 block truncate">Política de cambios</Link></li>
                  <li><Link href="/blog/devoluciones-cambios/envio-gratuito" className="text-gray-600 hover:text-orange-500 block truncate">Envío gratuito</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Talles</h4>
                <ul className="space-y-1">
                  <li><Link href="/blog/guia-talles/conversion-talles" className="text-gray-600 hover:text-orange-500 block truncate">Conversión de talles</Link></li>
                  <li><Link href="/blog/guia-talles/medir-pie" className="text-gray-600 hover:text-orange-500 block truncate">Cómo medir el pie</Link></li>
                  <li><Link href="/blog/guia-talles/talles-por-marca" className="text-gray-600 hover:text-orange-500 block truncate">Talles por marca</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
