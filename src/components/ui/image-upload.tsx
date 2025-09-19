"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  type?: 'post' | 'category' | 'general';
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  width: number;
  height: number;
  filename: string;
  size: number;
  type: string;
  error?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  type = 'general',
  className,
  placeholder = "Sube una imagen o pega una URL",
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        onChange(result.url);
        setUrlInput(result.url);
      } else {
        setUploadError(result.error || 'Error al subir la imagen');
      }
    } catch (error) {
      setUploadError('Error de conexión al subir la imagen');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [type, onChange]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <div className="relative aspect-video w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setUploadError('Error al cargar la imagen')}
            />
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Imagen actual: {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </p>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver ? "border-orange-500 bg-orange-50" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* Upload Text */}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Subiendo imagen...' : 'Arrastra una imagen aquí'}
            </p>
            <p className="text-xs text-gray-500">
              o haz clic para seleccionar (JPG, PNG, WebP - máx. 5MB)
            </p>
          </div>

          {/* Upload Button */}
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Seleccionar Archivo'}
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          O pega una URL de imagen:
        </label>
        <div className="flex gap-2">
          <Input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled || !urlInput.trim() || !isValidUrl(urlInput)}
            size="sm"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Configuration Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-blue-900">Estado de Configuración</span>
        </div>
        <p className="text-blue-800 mb-2">
          <strong>Modo actual:</strong> Demo (usando imágenes de Unsplash)
        </p>
        <p className="text-blue-700 text-xs">
          Para uploads reales, configura tus credenciales de Cloudinary en las variables de entorno.
        </p>
      </div>

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Consejos:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Usa imágenes de alta calidad (mínimo 800x400px)</li>
          <li>Formatos recomendados: PNG para gráficos, JPG para fotos</li>
          <li>En modo demo se asignan imágenes automáticamente</li>
        </ul>
      </div>
    </div>
  );
}
