"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/contexts/CartContext";
import Link from "next/link";

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { dispatch } = useCart();

  const categories = [
    { id: "all", name: "Todos", icon: "🏃" },
    { id: "running", name: "Running", icon: "🏃‍♂️" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "lifestyle", name: "Lifestyle", icon: "👟" },
  ];

  const products: Product[] = [
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
      description: "Zapatillas retro-futuristas con diseño boldEfekt y máxima comodidad",
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
    }
  ];

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Zapatillas Destacadas
          </h2>
          <p className="text-lg text-gray-600">
            Descubrí las mejores zapatillas de las marcas más prestigiosas
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {/* Product Image */}
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

              {/* Product Info */}
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

                {/* Price */}
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

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2"
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Ver todos los productos
          </Button>
        </div>
      </div>
    </section>
  );
}
