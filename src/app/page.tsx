"use client";

import { useState } from "react";
import Header from "@/components/Header";
import NewsletterModal from "@/components/NewsletterModal";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import PromoBanner from "@/components/PromoBanner";
import ReturnsBanner from "@/components/ReturnsBanner";
import BrandsSection from "@/components/BrandsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";

export default function Home() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <div id="productos">
          <ProductsSection />
        </div>
        <PromoBanner />
        <ReturnsBanner />
        <BrandsSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </div>
  );
}
