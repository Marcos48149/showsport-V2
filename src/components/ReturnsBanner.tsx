"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReturnsExchangeModal from "@/components/ReturnsExchangeModal";
import { RefreshCw, CreditCard, Truck, Clock, ArrowRight, CheckCircle } from "lucide-react";

export default function ReturnsBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Content */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="h-8 w-8 text-blue-200" />
                <h2 className="text-3xl font-bold">
                  Cambios y Devoluciones Automáticas
                </h2>
              </div>

              <p className="text-xl text-blue-100 mb-6">
                Proceso 100% digital. Sin WhatsApp, sin esperas.
                Cupón inmediato y envío gratuito garantizado.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">Cupón en 1 minuto</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">Envío gratuito</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">30 días para cambios</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-blue-100">Sin complicaciones</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
                >
                  Iniciar Cambio/Devolución
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                  onClick={() => window.open('/devoluciones', '_blank')}
                >
                  Más Información
                </Button>
              </div>
            </div>

            {/* Right side - Process steps */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Proceso en 4 pasos simples:
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Buscar pedido</h4>
                    <p className="text-sm text-gray-600">Número de pedido + email</p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400 ml-auto" />
                  <span className="text-xs text-gray-500">1 min</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Elegir productos</h4>
                    <p className="text-sm text-gray-600">Cambio o devolución</p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400 ml-auto" />
                  <span className="text-xs text-gray-500">2 min</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recibir cupón</h4>
                    <p className="text-sm text-gray-600">Para cambios, inmediato</p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400 ml-auto" />
                  <span className="text-xs text-gray-500 font-semibold text-green-600">¡Ya!</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envío gratis</h4>
                    <p className="text-sm text-gray-600">Etiqueta prepagada</p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400 ml-auto" />
                  <span className="text-xs text-gray-500">24-48h</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">¡Asegurá tu stock!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Con el cupón inmediato podés recomprar el producto correcto al instante
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Modal */}
      <ReturnsExchangeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
