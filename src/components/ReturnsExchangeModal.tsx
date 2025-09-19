"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReturns, type ReturnRequest } from "@/contexts/ReturnsContext";
import {
  X,
  Package,
  RefreshCw,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageCircle,
  Download,
  Copy
} from "lucide-react";

interface ReturnsExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnsExchangeModal({ isOpen, onClose }: ReturnsExchangeModalProps) {
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnType, setReturnType] = useState<'change' | 'return'>('change');
  const [resolution, setResolution] = useState<'coupon' | 'refund'>('coupon');
  const [reason, setReason] = useState("");
  const [completedRequest, setCompletedRequest] = useState<ReturnRequest | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { validateOrder, submitReturnRequest, generateShippingLabel, state } = useReturns();

  if (!isOpen) return null;

  const handleValidateOrder = async () => {
    if (!orderNumber || !email) {
      setValidationError("Por favor complete todos los campos");
      return;
    }

    setIsValidating(true);
    setValidationError("");

    try {
      const result = await validateOrder(orderNumber, email);

      if (result.valid && result.orderData) {
        setOrderData(result.orderData);
        setSelectedItems(result.orderData.items.map((item: any) => ({
          ...item,
          selected: false,
          reason: ''
        })));
        setStep(2);
      } else {
        setValidationError("No se encontró un pedido con esos datos. Verifique el número de pedido y email.");
      }
    } catch (error) {
      setValidationError("Error al validar el pedido. Intente nuevamente.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleItemSelection = (itemIndex: number, selected: boolean, itemReason?: string) => {
    setSelectedItems(prev => prev.map((item, index) =>
      index === itemIndex
        ? { ...item, selected, reason: itemReason || item.reason }
        : item
    ));
  };

  const handleSubmitRequest = async () => {
    const selectedProducts = selectedItems.filter(item => item.selected);

    if (selectedProducts.length === 0) {
      alert("Seleccione al menos un producto");
      return;
    }

    if (!reason) {
      alert("Ingrese el motivo de la solicitud");
      return;
    }

    try {
      const requestData = {
        orderNumber,
        customerEmail: email,
        customerName: orderData.customerName,
        type: returnType,
        resolution,
        reason,
        items: selectedProducts.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason
        }))
      };

      const newRequest = await submitReturnRequest(requestData);
      setCompletedRequest(newRequest);
      setStep(4);

      // If it's a change with coupon, the coupon is generated automatically
      if (returnType === 'change' && resolution === 'coupon') {
        // Generate shipping label automatically for changes
        setTimeout(() => {
          generateShippingLabel(newRequest.id);
        }, 2000);
      }

    } catch (error) {
      alert("Error al procesar la solicitud. Intente nuevamente.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  const resetModal = () => {
    setStep(1);
    setOrderNumber("");
    setEmail("");
    setOrderData(null);
    setSelectedItems([]);
    setReturnType('change');
    setResolution('coupon');
    setReason("");
    setCompletedRequest(null);
    setValidationError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Cambios y Devoluciones
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      stepNumber <= step
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {stepNumber === 4 && completedRequest ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        stepNumber < step ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {step === 1 && "Validar Pedido"}
                {step === 2 && "Seleccionar Productos"}
                {step === 3 && "Tipo de Solicitud"}
                {step === 4 && "Confirmación"}
              </span>
            </div>
          </div>

          {/* Step 1: Order Validation */}
          {step === 1 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <Package className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Buscar su Pedido</h3>
                <p className="text-gray-600">
                  Ingrese su número de pedido y email para comenzar
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Pedido *
                  </label>
                  <Input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="Ej: ORD-123456"
                    className="text-center font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de la Compra *
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {validationError}
                  </div>
                )}

                <Button
                  onClick={handleValidateOrder}
                  disabled={isValidating || !orderNumber || !email}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Validando...
                    </>
                  ) : (
                    'Buscar Pedido'
                  )}
                </Button>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">¿Dónde encuentro mi número de pedido?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• En el email de confirmación de compra</li>
                  <li>• En la sección "Mis Pedidos" de su cuenta</li>
                  <li>• En el comprobante de pago</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Product Selection */}
          {step === 2 && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Seleccionar Productos</h3>
                <p className="text-gray-600">
                  Elija los productos que desea cambiar o devolver
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Pedido: <span className="font-medium">{orderNumber}</span> •
                  Fecha: <span className="font-medium">{new Date(orderData?.date).toLocaleDateString('es-AR')}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-colors ${
                      item.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => handleItemSelection(index, e.target.checked)}
                        className="mt-1"
                      />

                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-contain bg-white rounded"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-gray-600">Talle: {item.size}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="font-semibold text-orange-500">${item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {item.selected && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motivo del cambio/devolución
                        </label>
                        <select
                          value={item.reason}
                          onChange={(e) => handleItemSelection(index, true, e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="">Seleccione un motivo</option>
                          <option value="talle_incorrecto">Talle incorrecto</option>
                          <option value="no_me_gusto">No me gustó</option>
                          <option value="defecto_producto">Defecto en el producto</option>
                          <option value="diferente_foto">Diferente a la foto</option>
                          <option value="llego_danado">Llegó dañado</option>
                          <option value="otro">Otro motivo</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedItems.filter(item => item.selected).length === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Request Type */}
          {step === 3 && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tipo de Solicitud</h3>
                <p className="text-gray-600">
                  Elija si desea cambiar o devolver los productos seleccionados
                </p>
              </div>

              {/* Request Type Selection */}
              <div className="space-y-4 mb-6">
                <div
                  onClick={() => setReturnType('change')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    returnType === 'change' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Cambio de Producto</h4>
                      <p className="text-sm text-gray-600">
                        Cambiar por otro talle, color o producto diferente
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setReturnType('return')}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    returnType === 'return' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Devolución</h4>
                      <p className="text-sm text-gray-600">
                        Devolver el producto y recibir reembolso
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Method */}
              <div className="mb-6">
                <h4 className="font-medium mb-4">¿Cómo desea recibir la compensación?</h4>
                <div className="space-y-3">
                  <div
                    onClick={() => setResolution('coupon')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      resolution === 'coupon' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <div>
                        <h5 className="font-medium">Cupón Inmediato</h5>
                        <p className="text-sm text-gray-600">
                          Recibe un cupón por email al instante para comprar de nuevo
                        </p>
                        {returnType === 'change' && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                            Recomendado para cambios
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setResolution('refund')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      resolution === 'refund' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-blue-500" />
                      <div>
                        <h5 className="font-medium">Reembolso</h5>
                        <p className="text-sm text-gray-600">
                          Reembolso al método de pago original (5-10 días hábiles)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Comments */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios adicionales
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describa el motivo de su solicitud..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={state.isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {state.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && completedRequest && (
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  ¡Solicitud Enviada Exitosamente!
                </h3>
                <p className="text-gray-600">
                  Su solicitud de {completedRequest.type === 'change' ? 'cambio' : 'devolución'} ha sido procesada
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Número de solicitud:</span>
                    <div className="font-semibold">{completedRequest.id}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <div className="font-semibold text-green-600">
                      {completedRequest.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Information */}
              {completedRequest.couponCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Su Cupón de Cambio</h4>
                  </div>

                  <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700 mb-2">
                      {completedRequest.couponCode}
                    </div>
                    <div className="text-lg font-semibold text-green-600 mb-3">
                      ${completedRequest.couponAmount?.toLocaleString()}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(completedRequest.couponCode!)}
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código
                    </Button>
                  </div>

                  <p className="text-sm text-green-700 mt-3 text-center">
                    ¡Puede usar este cupón inmediatamente para su nueva compra!
                  </p>
                </div>
              )}

              {/* Next Steps */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">Próximos pasos:</h4>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Confirmación por email</h5>
                    <p className="text-sm text-gray-600">
                      Le enviamos un email con todos los detalles a {completedRequest.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Etiqueta de envío</h5>
                    <p className="text-sm text-gray-600">
                      Recibirá una etiqueta prepagada para devolver el producto sin costo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Seguimiento automático</h5>
                    <p className="text-sm text-gray-600">
                      Le notificaremos cada paso del proceso por email y WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => window.open('/', '_blank')}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Comprar Ahora
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
