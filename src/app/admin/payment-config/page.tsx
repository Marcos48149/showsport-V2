"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PaymentGatewayConfig from "@/components/PaymentGatewayConfig";

export default function PaymentConfigPage() {
  const { state: authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      router.push('/');
    }
  }, [authState.isAuthenticated, authState.user?.role, router]);

  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Solo los administradores pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PaymentGatewayConfig />
    </div>
  );
}
