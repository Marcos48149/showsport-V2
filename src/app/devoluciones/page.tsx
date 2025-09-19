"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";
import ReturnsExchangeModal from "@/components/ReturnsExchangeModal";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Package,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageCircle,
  Shield,
  ArrowRight
} from "lucide-react";

export default function DevolucionesPage() {
  const [showModal, setShowModal] = useState(false);

  const steps = [
    {
      number: 1,
      icon: Package,
      title: "Ingresa tu pedido",
      description: "Número de pedido + email de compra",
      time: "1 minuto"
    },
    {
      number: 2,
      icon: RefreshCw,
      title: "Elige cambio o devolución",
      description: "Selecciona productos y tipo de solicitud",
      time: "2 minutos"
    },
    {
      number: 3,
      icon: CreditCard,
      title: "Recibe cupón inmediato",
      description: "Para cambios, cupón al instante por email",
      time: "Inmediato"
    },
    {
      number: 4,
      icon: Truck,
      title: "Envío gratuito",
      description: "Etiqueta prepagada para devolver productos",
      time: "24-48hs"
    }
  ];

  const faqs = [
    {
      question: "¿Cuánto tiempo tengo para hacer un cambio o devolución?",
      answer: "Tienes 30 días corridos desde la fecha de recepción del producto para realizar cambios o devoluciones."
    },
    {
      question: "¿Hay costo de envío para devoluciones?",
      answer: "No, el envío de devolución es completamente gratuito. Te proporcionamos una etiqueta prepagada."
    },
    {
      question: "¿Cuándo recibo mi cupón de cambio?",
      answer: "Para cambios, el cupón se genera inmediatamente al aprobar tu solicitud. Lo recibes por email al instante."
    },
    {
      question: "¿Puedo cambiar por un producto de diferente precio?",
      answer: "Sí, si el nuevo producto es más caro, pagas la diferencia. Si es más barato, el saldo queda como crédito."
    },
    {
      question: "¿Cómo sé el estado de mi solicitud?",
      answer: "Te enviamos notificaciones automáticas por email y WhatsApp en cada paso del proceso."
    },
    {
      question: "¿Qué productos puedo devolver?",
      answer: "Todos los productos en su estado original, con etiquetas y en su empaque original."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-8">
              <RefreshCw className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Cambios y Devoluciones
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Proceso 100% automatizado. Sin WhatsApp, sin esperas.
                Cupón inmediato para cambios y envío gratuito garantizado.
              </p>

              <Button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-lg"
              >
                Iniciar Cambio/Devolución
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-orange-500 mb-2">30</div>
                <div className="text-sm text-gray-600">Días para cambios</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-green-500 mb-2">0$</div>
                <div className="text-sm text-gray-600">Costo de envío</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl font-bold text-blue-500 mb-2">24h</div>
                <div className="text-sm text-gray-600">Procesamiento</div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Proceso Simplificado
              </h2>
              <p className="text-lg text-gray-600">
                Solo 4 pasos para resolver tu cambio o devolución
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm text-orange-500">
                      <Clock className="h-4 w-4" />
                      {step.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir nuestro sistema?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <CreditCard className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Cupón Inmediato</h3>
                <p className="text-gray-600">
                  Para cambios, recibís tu cupón por email al instante. No esperás días para recomprar.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <Truck className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Envío Gratuito</h3>
                <p className="text-gray-600">
                  Etiqueta prepagada incluida. Dejás el paquete en cualquier sucursal de Andreani u OCA.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <MessageCircle className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin WhatsApp</h3>
                <p className="text-gray-600">
                  Todo automatizado. No necesitás escribir mensajes ni esperar respuestas manuales.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <CheckCircle className="h-8 w-8 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stock Asegurado</h3>
                <p className="text-gray-600">
                  Al recibir tu cupón inmediato, podés recomprar y asegurar el stock del producto que querés.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <Mail className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Notificaciones Automáticas</h3>
                <p className="text-gray-600">
                  Te mantenemos informado en cada paso: solicitud, aprobación, envío, recepción.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <Shield className="h-8 w-8 text-indigo-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">100% Seguro</h3>
                <p className="text-gray-600">
                  Sistema protegido con validación de pedidos y seguimiento completo del proceso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-600">
                Resolvemos las dudas más comunes sobre cambios y devoluciones
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para hacer tu cambio o devolución?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Solo necesitás tu número de pedido y email. El proceso toma menos de 5 minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowModal(true)}
                className="bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Iniciar Proceso Ahora
              </Button>

              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 text-lg px-8 py-3"
                onClick={() => window.open('/cuenta', '_blank')}
              >
                Ver Mis Pedidos
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Proceso automatizado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Envío gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cupón inmediato</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ¿Necesitás ayuda adicional?
            </h3>
            <p className="text-gray-600 mb-6">
              Si tenés alguna consulta específica, nuestro equipo está disponible para ayudarte
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-700">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span>WhatsApp: +54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>Email: cambios@showsport.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ShoppingCart />

      {/* Returns Modal */}
      <ReturnsExchangeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
