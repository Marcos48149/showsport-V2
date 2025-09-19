"use client";

import Header from "@/components/Header";
import CategoryProductsSection from "@/components/CategoryProductsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";

export default function RunningPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CategoryProductsSection
          category="running"
          categoryName="Running"
          categoryIcon="🏃‍♂️"
          categoryDescription="Descubrí las mejores zapatillas de running para maximizar tu rendimiento. Tecnología de punta para corredores exigentes."
        />
      </main>
      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
