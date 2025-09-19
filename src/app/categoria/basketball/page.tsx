"use client";

import Header from "@/components/Header";
import CategoryProductsSection from "@/components/CategoryProductsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";

export default function BasketballPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CategoryProductsSection
          category="basketball"
          categoryName="Basketball"
          categoryIcon="🏀"
          categoryDescription="Zapatillas profesionales de basketball para dominar la cancha. Soporte, tracción y estilo para tu mejor juego."
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
