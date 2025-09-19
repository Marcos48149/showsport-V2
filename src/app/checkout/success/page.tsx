"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    paymentId: '',
    status: '',
    amount: ''
  });

  useEffect(() => {
    // Extract payment details from URL parameters
    const orderId = searchParams?.get('order_id') || '';
    const paymentId = searchParams?.get('payment_id') || '';
    const status = searchParams?.get('status') || 'approved';
    const amount = searchParams?.get('amount') || '';

    setOrderDetails({
      orderNumber: orderId,
      paymentId: paymentId,
      status: status,
      amount: amount
    });

    // Simulate order processing
    setTimeout(() => {
      // Here you would typically update the order status in your database
      console.log('Payment confirmed:', { orderId, paymentId, status });
    }, 1000);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Te enviaremos un email de confirmación en breve.
        </p>

        {orderDetails.orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Número de orden:</span>
                <span className="font-semibold">{orderDetails.orderNumber}</span>
              </div>

              {orderDetails.paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID de pago:</span>
                  <span className="font-mono text-xs">{orderDetails.paymentId}</span>
                </div>
              )}

              {orderDetails.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-semibold">${orderDetails.amount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <span className="text-green-600 font-semibold">Aprobado</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 text-blue-800">
            <Package className="h-5 w-5" />
            <div className="text-left">
              <h3 className="font-medium">Próximos pasos</h3>
              <p className="text-sm text-blue-700">
                Recibirás un email con el seguimiento de tu pedido en las próximas 24 horas.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/cuenta" className="block">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Ver mis pedidos
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Continuar comprando
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500">
            ¿Tienes alguna pregunta? Contáctanos por WhatsApp o email
          </p>
        </div>
      </div>
    </div>
  );
}
