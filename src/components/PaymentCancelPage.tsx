"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({
    reason: '',
    orderNumber: '',
    errorCode: ''
  });

  useEffect(() => {
    const reason = searchParams?.get('reason') || 'cancelled';
    const orderId = searchParams?.get('order_id') || '';
    const errorCode = searchParams?.get('error_code') || '';

    setErrorDetails({
      reason,
      orderNumber: orderId,
      errorCode
    });
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (errorDetails.reason) {
      case 'cancelled':
        return {
          title: 'Pago Cancelado',
          message: 'Has cancelado el proceso de pago. Tu pedido no ha sido procesado.',
          icon: XCircle,
          color: 'text-orange-500'
        };
      case 'failed':
        return {
          title: 'Pago Fallido',
          message: 'Hubo un problema procesando tu pago. Por favor intenta nuevamente.',
          icon: XCircle,
          color: 'text-red-500'
        };
      case 'timeout':
        return {
          title: 'Tiempo Agotado',
          message: 'El tiempo para completar el pago ha expirado. Por favor intenta nuevamente.',
          icon: AlertTriangle,
          color: 'text-yellow-500'
        };
      default:
        return {
          title: 'Error en el Pago',
          message: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
          icon: AlertTriangle,
          color: 'text-red-500'
        };
    }
  };

  const errorInfo = getErrorMessage();
  const IconComponent = errorInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <IconComponent className={`h-16 w-16 ${errorInfo.color} mx-auto mb-6`} />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {errorInfo.title}
        </h1>

        <p className="text-gray-600 mb-6">{errorInfo.message}</p>

        {errorDetails.orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Número de orden:</span>
                <span className="font-semibold">{errorDetails.orderNumber}</span>
              </div>

              {errorDetails.errorCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Código de error:</span>
                  <span className="font-mono text-xs">{errorDetails.errorCode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3 text-yellow-800">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium">¿Qué puedes hacer?</h3>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Verificar que tu tarjeta tenga fondos suficientes</li>
                <li>• Intentar con otro método de pago</li>
                <li>• Contactarnos si el problema persiste</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.back()}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar Nuevamente
          </Button>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">¿Necesitas ayuda?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="#" className="text-blue-600 hover:underline">
              WhatsApp
            </Link>
            <Link href="#" className="text-blue-600 hover:underline">
              Email
            </Link>
            <Link href="#" className="text-blue-600 hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
