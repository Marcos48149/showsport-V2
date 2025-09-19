"use client";

import { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { AlertTriangle, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LowStockNotifications() {
  const { getLowStockAlerts, acknowledgeAlert } = useInventory();
  const [isExpanded, setIsExpanded] = useState(false);

  const alerts = getLowStockAlerts();

  if (alerts.length === 0) return null;

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'out_of_stock');

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Notification Badge */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
            criticalAlerts.length > 0
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-orange-500 text-white'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {alerts.length} alerta{alerts.length > 1 ? 's' : ''} de stock
          </span>
        </button>
      )}

      {/* Expanded Notifications */}
      {isExpanded && (
        <div className="bg-white border rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Alertas de Inventario</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-b last:border-b-0 ${
                  alert.severity === 'out_of_stock'
                    ? 'bg-red-50 border-l-4 border-l-red-500'
                    : alert.severity === 'critical'
                    ? 'bg-orange-50 border-l-4 border-l-orange-500'
                    : 'bg-yellow-50 border-l-4 border-l-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4" />
                      <h4 className="font-medium text-sm">{alert.productName}</h4>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      {alert.severity === 'out_of_stock'
                        ? 'Sin stock disponible'
                        : `Solo ${alert.currentStock} unidades disponibles`
                      }
                    </p>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        alert.severity === 'out_of_stock'
                          ? 'bg-red-100 text-red-800'
                          : alert.severity === 'critical'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.severity === 'out_of_stock' ? 'Sin Stock' :
                         alert.severity === 'critical' ? 'Crítico' : 'Bajo Stock'}
                      </span>

                      <span className="text-xs text-gray-500">
                        {new Date(alert.date).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    ✓
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t">
            <Button
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600 text-xs"
              onClick={() => {
                // Navigate to admin inventory page
                window.location.href = '/admin';
              }}
            >
              Ver Inventario Completo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
