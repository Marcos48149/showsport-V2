"use client";

import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { EmailProvider } from "@/contexts/EmailContext";
import { VtexProvider } from "@/contexts/VtexContext";
import { ReturnsProvider } from "@/contexts/ReturnsContext";
import { BlogProvider } from "@/contexts/BlogContext";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <AuthProvider>
        <VtexProvider>
          <EmailProvider>
            <InventoryProvider>
              <ReviewsProvider>
                <ReturnsProvider>
                  <BlogProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
                  </BlogProvider>
                </ReturnsProvider>
              </ReviewsProvider>
            </InventoryProvider>
          </EmailProvider>
        </VtexProvider>
      </AuthProvider>
    </div>
  );
}
