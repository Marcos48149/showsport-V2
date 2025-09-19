"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEmail } from "@/contexts/EmailContext";
import { X, CreditCard, Shield, CheckCircle, ExternalLink, Smartphone } from "lucide-react";
import { paymentService, type OrderData } from "@/lib/paymentService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState } = useAuth();
  const { sendOrderConfirmation } = useEmail();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: authState.user?.name || '',
    lastName: authState.user?.lastName || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'gocuotas' | 'modo' | 'paypal'>('mercadopago');

  if (!isOpen) return null;

  const getTotal = () => {
    return cartState.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace('.', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getShippingCost = () => {
    const total = getTotal();
    return total >= 149000 ? 0 : 8500;
  };

  const getFinalTotal = () => {
    return getTotal() + getShippingCost();
  };

  const handlePaymentGatewayRedirect = async (gateway: string) => {
    setIsProcessing(true);

    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const orderTotal = getFinalTotal();

      const orderData: OrderData = {
        orderId: orderNumber,
        amount: orderTotal,
        currency: 'ARS',
        description: `Compra ShowSport - ${cartState.items.length} productos`,
        customerInfo: {
          email: shippingInfo.email,
          name: `${shippingInfo.name} ${shippingInfo.lastName}`,
          phone: shippingInfo.phone
        },
        items: cartState.items.map(item => ({
          id: item.id.toString(),
          title: item.name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price.replace('$', '').replace('.', ''))
        })),
        shippingInfo: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode
        }
      };

      const paymentResponse = await paymentService.createPayment(gateway, orderData);

      if (paymentResponse.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pendingOrder', JSON.stringify({
            orderId: orderNumber,
            paymentId: paymentResponse.paymentId,
            gateway: gateway,
            amount: orderTotal,
            items: cartState.items
          }));
        }

        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else if (paymentResponse.deepLink) {
          window.location.href = paymentResponse.deepLink;

          setTimeout(() => {
            const webUrl = `https://modo.com.ar/pay?order_id=${orderNumber}`;
            window.open(webUrl, '_blank');
          }, 3000);
        }
      } else {
        console.error('Payment creation failed:', paymentResponse.error);
        alert(`Error: ${paymentResponse.error || 'No se pudo crear el pago'}`);
        setIsProcessing(false);
      }

    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toLocaleDateString('es-AR');
    const orderTotal = getFinalTotal().toLocaleString();
    const shippingAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`;

    if (authState.user) {
      await sendOrderConfirmation({
        customerName: `${shippingInfo.name} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        orderNumber,
        orderDate,
        orderTotal: `${orderTotal}`,
        shippingAddress
      });
    }

    cartDispatch({ type: 'CLEAR_CART' });
    setOrderComplete(true);
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (orderComplete) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Compra Exitosa!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Número de orden</p>
              <p className="font-bold text-lg">#ORD-{Date.now().toString().slice(-6)}</p>
            </div>
            <Button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600">
              Continuar Comprando
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex">
            {/* Order Summary Sidebar */}
            <div className="w-1/3 bg-gray-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Resumen del pedido</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {cartState.items.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-white rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">Talle: {item.selectedSize}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>
                    {getShippingCost() === 0 ? 'Gratis' : `$${getShippingCost().toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-orange-500">${getFinalTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Compra Segura</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Transacción protegida con encriptación SSL
                </p>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="flex-1 p-6">
              {/* Progress Steps */}
              <div className="flex items-center mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= currentStep
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <Input
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <Input
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <Input
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <Input
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="Av. Corrientes 1234"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <Input
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <Input
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        placeholder="1043"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={!shippingInfo.name || !shippingInfo.address || !shippingInfo.email}
                  >
                    Continuar al Pago
                  </Button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Método de Pago</h2>

                  <div className="space-y-4 mb-6">
                    {/* Mercado Pago */}
                    <div
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'mercadopago' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MP</span>
                          </div>
                          <div>
                            <span className="font-medium">Mercado Pago</span>
                            <p className="text-xs text-gray-500">Paga con tu cuenta o tarjeta</p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Go Cuotas */}
                    <div
                      onClick={() => setPaymentMethod('gocuotas')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'gocuotas' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">GC</span>
                          </div>
                          <div>
                            <span className="font-medium">Go Cuotas</span>
                            <p className="text-xs text-gray-500">Paga en cuotas sin interés</p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* MODO */}
                    <div
                      onClick={() => setPaymentMethod('modo')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'modo' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-medium">MODO</span>
                            <p className="text-xs text-gray-500">Paga desde tu celular</p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Traditional Card Payment */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium">Tarjeta de Crédito/Débito</span>
                          <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                        </div>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div
                      onClick={() => setPaymentMethod('paypal')}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                          P
                        </div>
                        <span className="font-medium">PayPal</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateway Info */}
                  {['mercadopago', 'gocuotas', 'modo'].includes(paymentMethod) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Redirección Segura</h4>
                          <p className="text-sm text-blue-700">
                            Serás redirigido a {
                              paymentMethod === 'mercadopago' ? 'Mercado Pago' :
                              paymentMethod === 'gocuotas' ? 'Go Cuotas' : 'MODO'
                            } para completar tu pago de forma segura.
                          </p>
                          {paymentMethod === 'modo' && (
                            <p className="text-xs text-blue-600 mt-1">
                              <Smartphone className="h-3 w-3 inline mr-1" />
                              Asegúrate de tener la app MODO instalada en tu dispositivo
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Tarjeta *
                        </label>
                        <Input
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({
                            ...paymentInfo,
                            cardNumber: formatCardNumber(e.target.value)
                          })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            MM/AA *
                          </label>
                          <Input
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              expiryDate: formatExpiryDate(e.target.value)
                            })}
                            placeholder="12/25"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <Input
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value.replace(/\D/g, '')
                            })}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre en la Tarjeta *
                        </label>
                        <Input
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({
                            ...paymentInfo,
                            cardholderName: e.target.value
                          })}
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      Revisar Pedido
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Confirm */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Confirmar Pedido</h2>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2">Dirección de Envío</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.name} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.postalCode}<br />
                      {shippingInfo.email} • {shippingInfo.phone}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2">Método de Pago</h3>
                    <div className="flex items-center gap-2">
                      {paymentMethod === 'mercadopago' && (
                        <>
                          <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">MP</div>
                          <span className="text-sm">Mercado Pago</span>
                        </>
                      )}
                      {paymentMethod === 'gocuotas' && (
                        <>
                          <div className="w-5 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center">GC</div>
                          <span className="text-sm">Go Cuotas</span>
                        </>
                      )}
                      {paymentMethod === 'modo' && (
                        <>
                          <Smartphone className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">MODO</span>
                        </>
                      )}
                      {paymentMethod === 'card' && (
                        <>
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</span>
                        </>
                      )}
                      {paymentMethod === 'paypal' && (
                        <>
                          <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">P</div>
                          <span className="text-sm">PayPal</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={() => {
                        if (['mercadopago', 'gocuotas', 'modo'].includes(paymentMethod)) {
                          handlePaymentGatewayRedirect(paymentMethod);
                        } else {
                          handlePayment();
                        }
                      }}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {['mercadopago', 'gocuotas', 'modo'].includes(paymentMethod) ? 'Redirigiendo...' : 'Procesando...'}
                        </span>
                      ) : (
                        ['mercadopago', 'gocuotas', 'modo'].includes(paymentMethod) ? (
                          <span className="flex items-center gap-2">
                            Pagar con {
                              paymentMethod === 'mercadopago' ? 'Mercado Pago' :
                              paymentMethod === 'gocuotas' ? 'Go Cuotas' : 'MODO'
                            }
                            <ExternalLink className="h-4 w-4" />
                          </span>
                        ) : 'Confirmar Pago'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
