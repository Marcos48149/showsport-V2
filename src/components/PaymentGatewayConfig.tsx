"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Eye, EyeOff, Shield, CheckCircle, AlertTriangle, Smartphone } from "lucide-react";
import type { PaymentGatewayConfig } from "@/lib/paymentService";

interface PaymentGatewayConfigProps {
  onConfigUpdate?: (config: PaymentGatewayConfig) => void;
}

export default function PaymentGatewayConfigComponent({ onConfigUpdate }: PaymentGatewayConfigProps) {
  const [config, setConfig] = useState<PaymentGatewayConfig>({
    mercadoPago: {
      accessToken: '',
      publicKey: '',
      testMode: true
    },
    goCuotas: {
      apiKey: '',
      merchantId: '',
      testMode: true
    },
    modo: {
      merchantId: '',
      apiKey: '',
      testMode: true
    }
  });

  const [showTokens, setShowTokens] = useState({
    mercadoPago: false,
    goCuotas: false,
    modo: false
  });

  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load configuration from localStorage
    const savedConfig = localStorage.getItem('paymentGatewayConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading payment config:', error);
      }
    }
  }, []);

  const updateConfig = (gateway: keyof PaymentGatewayConfig, field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  const toggleShowToken = (gateway: keyof typeof showTokens) => {
    setShowTokens(prev => ({
      ...prev,
      [gateway]: !prev[gateway]
    }));
  };

  const testConnection = async (gateway: string) => {
    setTestResults(prev => ({ ...prev, [gateway]: 'pending' }));

    // Simulate API test
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would test the actual API credentials
      const hasCredentials = gateway === 'mercadoPago'
        ? config.mercadoPago.accessToken && config.mercadoPago.publicKey
        : gateway === 'goCuotas'
        ? config.goCuotas.apiKey && config.goCuotas.merchantId
        : config.modo.merchantId && config.modo.apiKey;

      setTestResults(prev => ({
        ...prev,
        [gateway]: hasCredentials ? 'success' : 'error'
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [gateway]: 'error' }));
    }
  };

  const runFullTests = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/test-payments');
      const result = await response.json();

      if (result.success) {
        const report = result.data;
        alert(`Tests completados: ${report.summary.passedTests}/${report.summary.totalTests} pasaron`);

        // Update individual test results
        report.gateways.forEach((gateway: any) => {
          setTestResults(prev => ({
            ...prev,
            [gateway.gateway === 'mercadopago' ? 'mercadoPago' : gateway.gateway]: gateway.overallPass ? 'success' : 'error'
          }));
        });
      } else {
        alert('Error ejecutando tests: ' + result.error);
      }
    } catch (error) {
      console.error('Full test error:', error);
      alert('Error ejecutando tests');
    } finally {
      setIsSaving(false);
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('paymentGatewayConfig', JSON.stringify(config));

      // Call the callback if provided
      onConfigUpdate?.(config);

      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      mercadoPago: {
        accessToken: '',
        publicKey: '',
        testMode: true
      },
      goCuotas: {
        apiKey: '',
        merchantId: '',
        testMode: true
      },
      modo: {
        merchantId: 'SHOWSPORT',
        apiKey: '',
        testMode: true
      }
    });
    setTestResults({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuración de Pasarelas de Pago
        </h1>
        <p className="text-gray-600">
          Configura las credenciales para las pasarelas de pago argentinas
        </p>
      </div>

      {/* Mercado Pago Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MP</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Mercado Pago</h2>
            <p className="text-sm text-gray-600">Integración con Mercado Pago Argentina</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token *
            </label>
            <div className="relative">
              <Input
                type={showTokens.mercadoPago ? "text" : "password"}
                value={config.mercadoPago.accessToken}
                onChange={(e) => updateConfig('mercadoPago', 'accessToken', e.target.value)}
                placeholder="APP_USR-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowToken('mercadoPago')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showTokens.mercadoPago ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Key *
            </label>
            <Input
              value={config.mercadoPago.publicKey}
              onChange={(e) => updateConfig('mercadoPago', 'publicKey', e.target.value)}
              placeholder="APP_USR-..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.mercadoPago.testMode}
              onChange={(e) => updateConfig('mercadoPago', 'testMode', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Modo de prueba</span>
          </label>

          <Button
            onClick={() => testConnection('mercadoPago')}
            variant="outline"
            size="sm"
            disabled={testResults.mercadoPago === 'pending'}
          >
            {testResults.mercadoPago === 'pending' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            )}
            {testResults.mercadoPago === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
            {testResults.mercadoPago === 'error' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
            Probar Conexión
          </Button>
        </div>
      </div>

      {/* Go Cuotas Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">GC</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Go Cuotas</h2>
            <p className="text-sm text-gray-600">Pagos en cuotas sin interés</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key *
            </label>
            <div className="relative">
              <Input
                type={showTokens.goCuotas ? "text" : "password"}
                value={config.goCuotas.apiKey}
                onChange={(e) => updateConfig('goCuotas', 'apiKey', e.target.value)}
                placeholder="gc_live_..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowToken('goCuotas')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showTokens.goCuotas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Merchant ID *
            </label>
            <Input
              value={config.goCuotas.merchantId}
              onChange={(e) => updateConfig('goCuotas', 'merchantId', e.target.value)}
              placeholder="merchant_123"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.goCuotas.testMode}
              onChange={(e) => updateConfig('goCuotas', 'testMode', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Modo de prueba</span>
          </label>

          <Button
            onClick={() => testConnection('goCuotas')}
            variant="outline"
            size="sm"
            disabled={testResults.goCuotas === 'pending'}
          >
            {testResults.goCuotas === 'pending' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
            )}
            {testResults.goCuotas === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
            {testResults.goCuotas === 'error' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
            Probar Conexión
          </Button>
        </div>
      </div>

      {/* MODO Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">MODO</h2>
            <p className="text-sm text-gray-600">Pagos desde el celular</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Merchant ID *
            </label>
            <Input
              value={config.modo.merchantId}
              onChange={(e) => updateConfig('modo', 'merchantId', e.target.value)}
              placeholder="SHOWSPORT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key *
            </label>
            <div className="relative">
              <Input
                type={showTokens.modo ? "text" : "password"}
                value={config.modo.apiKey}
                onChange={(e) => updateConfig('modo', 'apiKey', e.target.value)}
                placeholder="modo_live_..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowToken('modo')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showTokens.modo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.modo.testMode}
              onChange={(e) => updateConfig('modo', 'testMode', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Modo de prueba</span>
          </label>

          <Button
            onClick={() => testConnection('modo')}
            variant="outline"
            size="sm"
            disabled={testResults.modo === 'pending'}
          >
            {testResults.modo === 'pending' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
            )}
            {testResults.modo === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
            {testResults.modo === 'error' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
            Probar Conexión
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Nota de Seguridad</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Las credenciales se almacenan localmente en tu navegador. Para producción,
              considera usar variables de entorno del servidor para mayor seguridad.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={resetToDefaults}
          variant="outline"
        >
          Restablecer
        </Button>

        <Button
          onClick={runFullTests}
          disabled={isSaving}
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Ejecutando Tests...
            </>
          ) : (
            'Ejecutar Tests Completos'
          )}
        </Button>

        <Button
          onClick={saveConfiguration}
          disabled={isSaving}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            'Guardar Configuración'
          )}
        </Button>
      </div>
    </div>
  );
}
