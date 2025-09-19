"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVtex, VtexConfig } from "@/contexts/VtexContext";
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Key,
  Server,
  Zap,
  RefreshCw,
  Database
} from "lucide-react";

export default function VtexConfiguration() {
  const { state, connectToVtex, syncProducts, syncOrders, syncInventory } = useVtex();
  const [config, setConfig] = useState<VtexConfig>({
    storeName: '',
    environment: 'stable',
    appKey: '',
    appToken: '',
    baseUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConfigChange = (field: keyof VtexConfig, value: string) => {
    const newConfig = { ...config, [field]: value };

    // Auto-generate base URL when store name changes
    if (field === 'storeName' && value) {
      newConfig.baseUrl = `https://${value}.vtexcommercestable.com.br`;
    }

    setConfig(newConfig);
  };

  const handleConnect = async () => {
    setIsSubmitting(true);
    try {
      const success = await connectToVtex(config);
      if (success) {
        // Configuration saved successfully
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await Promise.all([
        syncProducts(),
        syncOrders(),
        syncInventory()
      ]);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const isFormValid = config.storeName && config.appKey && config.appToken;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Settings className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración VTEX</h2>
          <p className="text-gray-600">Conecta tu tienda VTEX para sincronizar productos, pedidos e inventario</p>
        </div>
      </div>

      {/* Connection Status */}
      {state.config && (
        <div className={`p-4 rounded-lg border ${
          state.isConnected
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {state.isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold ${
                state.isConnected ? 'text-green-800' : 'text-red-800'
              }`}>
                {state.isConnected ? 'Conectado a VTEX' : 'Desconectado de VTEX'}
              </h3>
              <p className={`text-sm ${
                state.isConnected ? 'text-green-700' : 'text-red-700'
              }`}>
                {state.isConnected
                  ? `Tienda: ${state.config.storeName} | Última sincronización: ${
                      state.lastSync ? new Date(state.lastSync).toLocaleString('es-AR') : 'Nunca'
                    }`
                  : state.error || 'No conectado a VTEX'
                }
              </p>
            </div>
            {state.isConnected && (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sincronizar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">Configuración de Conexión</h3>

        <div className="grid gap-6">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Tienda *
            </label>
            <div className="relative">
              <Input
                type="text"
                value={config.storeName}
                onChange={(e) => handleConfigChange('storeName', e.target.value)}
                placeholder="ej: showsport"
                className="pr-10"
              />
              <Server className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              El nombre de tu tienda VTEX (aparece en la URL: nombredlatienda.vtexcommercestable.com.br)
            </p>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ambiente
            </label>
            <select
              value={config.environment}
              onChange={(e) => handleConfigChange('environment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="stable">Stable (Producción)</option>
              <option value="beta">Beta (Pruebas)</option>
            </select>
          </div>

          {/* API Credentials */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Key *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={config.appKey}
                  onChange={(e) => handleConfigChange('appKey', e.target.value)}
                  placeholder="vtexappkey-..."
                  className="pr-10"
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Token *
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={config.appToken}
                  onChange={(e) => handleConfigChange('appToken', e.target.value)}
                  placeholder="••••••••••••••••"
                  className="pr-10"
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Base
            </label>
            <Input
              type="url"
              value={config.baseUrl}
              onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
              placeholder="https://showsport.vtexcommercestable.com.br"
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se genera automáticamente basada en el nombre de la tienda
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Cómo obtener las credenciales de VTEX</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Accede a tu Admin VTEX</li>
                  <li>Ve a "Configuración de la cuenta" → "Gestión de la cuenta"</li>
                  <li>Selecciona "Claves de aplicación"</li>
                  <li>Crea una nueva clave con los permisos necesarios</li>
                  <li>Copia el App Key y App Token aquí</li>
                </ol>
                <a
                  href="https://help.vtex.com/es/tutorial/claves-de-aplicacion--2iffYzlvvz4BDMr6WGUtet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ver documentación VTEX
                </a>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleConnect}
              disabled={!isFormValid || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {state.isConnected ? 'Actualizar Conexión' : 'Conectar a VTEX'}
            </Button>

            {state.isConnected && (
              <Button
                onClick={() => window.open('https://help.vtex.com/es/', '_blank')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Documentación VTEX
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sync Statistics */}
      {state.isConnected && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Productos</h4>
                <p className="text-sm text-gray-600">Sincronizados desde VTEX</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {state.products.length.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Pedidos</h4>
                <p className="text-sm text-gray-600">Últimos 30 días</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {state.orders.length.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Inventario</h4>
                <p className="text-sm text-gray-600">SKUs rastreados</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(state.inventory).length.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
