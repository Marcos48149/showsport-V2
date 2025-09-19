"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const orderId = searchParams?.get('order_id') || '';
    setOrderNumber(orderId);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pago Exitoso</h1>
        <p className="text-gray-600 mb-6">Tu pago se procesó correctamente.</p>
        {orderNumber && (
          <p className="text-gray-800 font-semibold mb-6">
            Número de orden: {orderNumber}
          </p>
        )}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
