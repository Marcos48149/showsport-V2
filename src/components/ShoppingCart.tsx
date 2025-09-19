"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

export default function ShoppingCart() {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size } });
  };

  const removeItem = (id: number, size?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  };

  const getTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace('.', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const closeCart = () => {
    dispatch({ type: 'SET_CART_OPEN', payload: false });
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold">
              Carrito ({state.items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 mt-2">Agregá productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${index}`} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-white rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">Talle: {item.selectedSize}</p>
                      )}
                      <p className="text-orange-500 font-bold mt-1">{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.selectedSize)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="p-1 hover:bg-white rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${(parseFloat(item.price.replace('$', '').replace('.', '')) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-orange-500">
                ${getTotal().toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  if (!authState.user) {
                    alert('Debes iniciar sesión para continuar con la compra');
                    return;
                  }
                  setShowCheckout(true);
                }}
              >
                Iniciar Compra
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeCart}
              >
                Seguir Comprando
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Envío gratis en compras superiores a $149.000
            </p>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
