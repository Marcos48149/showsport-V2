"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/contexts/CartContext";
import { Filter, Grid, List, SortAsc } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");
  const { dispatch } = useCart();

  const categories = [
    { id: "all", name: "Todos", icon: "🏃" },
    { id: "running", name: "Running", icon: "🏃‍♂️" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "lifestyle", name: "Lifestyle", icon: "👟" },
  ];

  // Mock data - In production, this would come from your API/database
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: "$149.000",
      originalPrice: "$189.000",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
      category: "running",
      discount: "21% OFF",
      description: "Zapatillas de running con tecnología BOOST para máximo retorno de energía",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_02_standard_hover.jpg"
      ]
    },
    {
      id: 2,
      name: "Nike Air Max 270",
      brand: "Nike",
      price: "$159.000",
      originalPrice: "$199.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png",
      category: "lifestyle",
      discount: "20% OFF",
      description: "Zapatillas lifestyle con la mayor unidad Air Max visible hasta la fecha",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png"
      ]
    },
    {
      id: 3,
      name: "Puma RS-X Efekt",
      brand: "Puma",
      price: "$129.000",
      originalPrice: "$169.000",
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393161/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Sneakers",
      category: "lifestyle",
      discount: "24% OFF",
      description: "Zapatillas retro-futuristas con diseño bold y máxima comodidad",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393161/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Sneakers"
      ]
    },
    {
      id: 4,
      name: "Nike LeBron 20",
      brand: "Nike",
      price: "$199.000",
      originalPrice: "$249.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-5cc7de3b-2c49-4174-933c-78d3aa0f8532/lebron-20-basketball-shoes-PzDGCK.png",
      category: "basketball",
      discount: "20% OFF",
      description: "Zapatillas de basketball profesional con tecnología Air Zoom",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-5cc7de3b-2c49-4174-933c-78d3aa0f8532/lebron-20-basketball-shoes-PzDGCK.png"
      ]
    },
    {
      id: 5,
      name: "Adidas Dame 8",
      brand: "Adidas",
      price: "$179.000",
      originalPrice: "$219.000",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b5f33c6f1d84327a4c1ae4301058c95_9366/Dame_8_Basketball_Shoes_Black_FZ1049_01_standard.jpg",
      category: "basketball",
      discount: "18% OFF",
      description: "Zapatillas de basketball Damian Lillard con tecnología Lightstrike",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      images: [
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b5f33c6f1d84327a4c1ae4301058c95_9366/Dame_8_Basketball_Shoes_Black_FZ1049_01_standard.jpg"
      ]
    },
    {
      id: 6,
      name: "Nike Pegasus 40",
      brand: "Nike",
      price: "$139.000",
      originalPrice: "$179.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/58f79c89-0ed3-4d67-b69a-2b0b1f85a8bb/air-zoom-pegasus-40-running-shoes-PzBKCp.png",
      category: "running",
      discount: "22% OFF",
      description: "Zapatillas de running diario con amortiguación Nike Air Zoom",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/58f79c89-0ed3-4d67-b69a-2b0b1f85a8bb/air-zoom-pegasus-40-running-shoes-PzBKCp.png"
      ]
    },
    {
      id: 7,
      name: "Nike Air Force 1 '07",
      brand: "Nike",
      price: "$119.000",
      originalPrice: "$149.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
      category: "lifestyle",
      discount: "20% OFF",
      description: "El ícono atemporal que redefinió el streetwear",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png"
      ]
    },
    {
      id: 8,
      name: "Adidas Alphabounce+",
      brand: "Adidas",
      price: "$109.000",
      originalPrice: "$139.000",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f59e7a8e3c4e8fab7aad1200d84a8a_9366/Alphabounce_Shoes_Black_EF1189_01_standard.jpg",
      category: "running",
      discount: "22% OFF",
      description: "Zapatillas de running versátiles con amortiguación adaptativa",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f59e7a8e3c4e8fab7aad1200d84a8a_9366/Alphabounce_Shoes_Black_EF1189_01_standard.jpg"
      ]
    },
    {
      id: 9,
      name: "Jordan Why Not Zer0.6",
      brand: "Nike",
      price: "$189.000",
      originalPrice: "$229.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ec41d423-5153-464c-a8e0-1e42b3964b99/jordan-why-not-zer06-basketball-shoes-QqXnLb.png",
      category: "basketball",
      discount: "17% OFF",
      description: "Diseñadas para jugar como Russell Westbrook: explosivo y sin límites",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ec41d423-5153-464c-a8e0-1e42b3964b99/jordan-why-not-zer06-basketball-shoes-QqXnLb.png"
      ]
    }
  ];

  // Filter products by category
  const categoryFilteredProducts = selectedCategory === "all"
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory);

  // Filter by price range
  const priceFilteredProducts = categoryFilteredProducts.filter(product => {
    const price = parseInt(product.price.replace(/[^0-9]/g, ''));
    switch (priceRange) {
      case "low":
        return price < 150000;
      case "mid":
        return price >= 150000 && price < 200000;
      case "high":
        return price >= 200000;
      default:
        return true;
    }
  });

  // Sort products
  const sortedProducts = [...priceFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
      case "brand":
        return a.brand.localeCompare(b.brand);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <Link href={`/producto/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 p-4 cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded">
              {product.discount}
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {product.brand}
          </span>
        </div>
        <Link href={`/producto/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-orange-500 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-orange-500">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2"
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex">
      <Link href={`/producto/${product.id}`} className="w-48 flex-shrink-0">
        <div className="relative aspect-square bg-gray-50 p-4 cursor-pointer h-48">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded">
              {product.discount}
            </span>
          )}
        </div>
      </Link>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {product.brand}
            </span>
          </div>
          <Link href={`/producto/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-orange-500 cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          <Button
            onClick={() => handleAddToCart(product)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
          >
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="py-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Todos los Productos
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explora nuestra colección completa de zapatillas deportivas de las mejores marcas
              </p>
              <div className="text-sm text-gray-500 mt-2">
                {sortedProducts.length} productos encontrados
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Price Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value as any)}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">Todos los precios</option>
                      <option value="low">Hasta $150.000</option>
                      <option value="mid">$150.000 - $200.000</option>
                      <option value="high">Más de $200.000</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="name">Ordenar por nombre</option>
                      <option value="price-low">Precio: menor a mayor</option>
                      <option value="price-high">Precio: mayor a menor</option>
                      <option value="brand">Ordenar por marca</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 text-sm ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 text-sm ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
              }>
                {sortedProducts.map((product) => (
                  viewMode === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <span className="text-6xl">🏃</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay productos que coincidan con los filtros
                </h3>
                <p className="text-gray-600 mb-6">
                  Prueba ajustando los filtros para ver más productos
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Load More Button (for pagination) */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="px-8 py-3 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Cargar más productos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
