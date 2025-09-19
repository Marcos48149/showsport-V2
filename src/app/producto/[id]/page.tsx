"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/contexts/CartContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { ArrowLeft, Heart, Share2, Star } from "lucide-react";
import ProductReviews from "@/components/ProductReviews";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();
  const { getProductRating } = useReviews();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock product data - in a real app, this would come from an API
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
      description: "Las zapatillas Adidas Ultraboost 22 ofrecen el máximo retorno de energía con cada zancada. Diseñadas con tecnología BOOST y una suela Continental™, estas zapatillas de running te proporcionan la comodidad y el rendimiento que necesitas para superar tus límites.",
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
      description: "Las Nike Air Max 270 cuentan con la mayor unidad Air Max visible hasta la fecha, proporcionando una amortiguación excepcional y un estilo inconfundible. Perfectas para el uso diario con máximo confort.",
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      images: [
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png"
      ]
    },
    // Add more products as needed...
  ];

  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);
  const { average: rating, count: reviewCount } = getProductRating(productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor selecciona un talle");
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: { product, size: selectedSize }
    });

    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/#productos" className="text-gray-500 hover:text-orange-500">
              Productos
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {product.brand}
              </span>
              {product.discount && (
                <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  {product.discount}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({rating.toFixed(1)}) • {reviewCount} reseña{reviewCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-orange-500">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Seleccionar Talle</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border rounded-lg font-semibold transition-all ${
                      selectedSize === size
                        ? "border-orange-500 bg-orange-50 text-orange-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-4"
              >
                Agregar al carrito - {product.price}
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className={`flex-1 ${
                    isWishlisted
                      ? "border-red-500 text-red-500"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "En Favoritos" : "Agregar a Favoritos"}
                </Button>

                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Beneficios del producto</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span>
                  Envío gratis en compras superiores a $149.000
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span>
                  Cambios y devoluciones sin cargo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span>
                  6 cuotas sin interés con tarjetas bancarias
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span>
                  Garantía oficial de la marca
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <ProductReviews
          productId={productId}
          productName={product.name}
        />
      </div>
    </div>
  );
}
