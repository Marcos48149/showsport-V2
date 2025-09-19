"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Cloud,
  Settings,
  Info,
  ArrowRight
} from "lucide-react";

interface CloudinaryStatusProps {
  onConfigurationChange?: () => void;
}

export default function CloudinaryStatus({ onConfigurationChange }: CloudinaryStatusProps) {
  const [configStatus, setConfigStatus] = useState({
    isConfigured: false,
    cloudName: '',
    hasApiKey: false,
    hasApiSecret: false,
    isDemo: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const checkConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/upload/status');
      if (response.ok) {
        const data = await response.json();

        setConfigStatus({
          isConfigured: data.isConfigured || false,
          cloudName: data.cloudName || 'demo',
          hasApiKey: data.hasApiKey || false,
          hasApiSecret: data.hasApiSecret || false,
          isDemo: data.isDemo !== false
        });
      } else {
        // Fallback to demo mode
        setConfigStatus({
          isConfigured: false,
          cloudName: 'demo',
          hasApiKey: false,
          hasApiSecret: false,
          isDemo: true
        });
      }

      onConfigurationChange?.();
    } catch (error) {
      console.error('Error checking Cloudinary status:', error);
      // Fallback to demo mode
      setConfigStatus({
        isConfigured: false,
        cloudName: 'demo',
        hasApiKey: false,
        hasApiSecret: false,
        isDemo: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  const copyEnvTemplate = () => {
    const template = `# Cloudinary (configuración real)
CLOUDINARY_CLOUD_NAME="tu-cloud-name-real"
CLOUDINARY_API_KEY="tu-api-key-real"
CLOUDINARY_API_SECRET="tu-api-secret-real"`;

    navigator.clipboard.writeText(template);
    alert('¡Template copiado al portapapeles!');
  };

  const openCloudinary = () => {
    window.open('https://cloudinary.com/users/register/free', '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span>Verificando configuración de Cloudinary...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Estado de Cloudinary
            </h3>
            <p className="text-sm text-gray-600">
              Configuración para upload real de imágenes
            </p>
          </div>
        </div>

        <Button
          onClick={checkConfiguration}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${
          configStatus.isConfigured
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {configStatus.isConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="font-medium">
              {configStatus.isConfigured ? 'Configurado ✅' : 'Modo Demo 🎭'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {configStatus.isConfigured
              ? 'Cloudinary está configurado correctamente'
              : 'Usando imágenes de Unsplash para testing'
            }
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Cloud Name</span>
          </div>
          <p className="text-sm text-gray-600 font-mono">
            {configStatus.cloudName || 'No configurado'}
          </p>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Detalles de Configuración:</h4>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {configStatus.cloudName && configStatus.cloudName !== 'demo' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span>Cloud Name: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {configStatus.cloudName || 'No configurado'}
            </code>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {configStatus.hasApiKey ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span>API Key: {configStatus.hasApiKey ? 'Configurado ✅' : 'No configurado ❌'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {configStatus.hasApiSecret ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span>API Secret: {configStatus.hasApiSecret ? 'Configurado ✅' : 'No configurado ❌'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {!configStatus.isConfigured && (
          <>
            <Button
              onClick={openCloudinary}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Crear Cuenta Gratis
            </Button>

            <Button
              onClick={() => setShowGuide(!showGuide)}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <Info className="h-4 w-4 mr-2" />
              {showGuide ? 'Ocultar' : 'Ver'} Guía Completa
            </Button>

            <Button
              onClick={copyEnvTemplate}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Template
            </Button>
          </>
        )}

        {configStatus.isConfigured && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">¡Cloudinary configurado correctamente! Uploads reales activados 🚀</span>
          </div>
        )}
      </div>

      {/* Configuration Guide */}
      {showGuide && !configStatus.isConfigured && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-4 text-lg">📋 Guía Paso a Paso:</h4>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-white rounded-lg border">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium text-gray-900 mb-1">🆓 Crear cuenta en Cloudinary</p>
                <p className="text-gray-600 text-sm mb-2">Regístrate gratis en cloudinary.com (solo toma 2 minutos)</p>
                <Button
                  onClick={openCloudinary}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Ir a Cloudinary <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium text-gray-900 mb-1">🔑 Obtener credenciales</p>
                <p className="text-gray-600 text-sm mb-2">En tu dashboard, copia:</p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  <div>Cloud name: <span className="text-blue-600">tu-cloud-name</span></div>
                  <div>API Key: <span className="text-blue-600">123456789012345</span></div>
                  <div>API Secret: <span className="text-blue-600">abcDEF123...</span></div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium text-gray-900 mb-1">⚙️ Actualizar .env.local</p>
                <p className="text-gray-600 text-sm mb-2">Reemplaza en tu archivo .env.local:</p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  <div>CLOUDINARY_CLOUD_NAME="tu-cloud-name-real"</div>
                  <div>CLOUDINARY_API_KEY="tu-api-key-real"</div>
                  <div>CLOUDINARY_API_SECRET="tu-secret-real"</div>
                </div>
                <Button
                  onClick={copyEnvTemplate}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  <Copy className="h-4 w-4 mr-1" /> Copiar Template
                </Button>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-lg border">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-medium text-gray-900 mb-1">🔄 Reiniciar servidor</p>
                <p className="text-gray-600 text-sm mb-2">Detén con Ctrl+C y ejecuta:</p>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  bun run dev
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">✅ Beneficios del Upload Real:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Upload real de archivos desde tu computadora</li>
              <li>• Optimización automática de imágenes (WebP, AVIF)</li>
              <li>• CDN global para carga súper rápida</li>
              <li>• 25GB gratis mensual (perfecto para empezar)</li>
              <li>• Transformaciones automáticas</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
