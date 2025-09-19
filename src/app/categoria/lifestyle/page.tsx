"use client";

import Header from "@/components/Header";
import CategoryProductsSection from "@/components/CategoryProductsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";

export default function LifestylePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CategoryProductsSection
          category="lifestyle"
          categoryName="Lifestyle"
          categoryIcon="👟"
          categoryDescription="Zapatillas que combinan estilo y comodidad para tu día a día. Perfectas para cualquier ocasión urbana."
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
