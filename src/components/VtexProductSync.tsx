"use client";

import { useState } from "react";
import { useVtex } from "@/contexts/VtexContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  RefreshCw,
  Package,
  ExternalLink,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download
} from "lucide-react";

export default function VtexProductSync() {
  const { state, syncProducts, searchProducts } = useVtex();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(state.products);
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(state.products);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchProducts(searchQuery);
      setFilteredProducts(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncProducts();
      setFilteredProducts(state.products);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getProductStatus = (product: any) => {
    if (!product.isActive) return { label: 'Inactivo', color: 'text-red-600 bg-red-100' };
    if (!product.isVisible) return { label: 'No visible', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Activo', color: 'text-green-600 bg-green-100' };
  };

  const getSkuInventory = (skuId: string) => {
    return state.inventory[skuId] || 0;
  };

  if (!state.isConnected) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          VTEX no conectado
        </h3>
        <p className="text-gray-600 mb-4">
          Conecta tu tienda VTEX para sincronizar productos
        </p>
        <Button
          onClick={() => window.location.href = '/admin?tab=vtex'}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Configurar VTEX
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos VTEX</h2>
          <p className="text-gray-600">
            Gestiona y sincroniza productos desde tu tienda VTEX
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold">{state.products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold">
                {state.products.filter(p => p.isActive && p.isVisible).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold">
                {Object.values(state.inventory).filter(stock => stock < 10).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Última Sync</p>
              <p className="text-sm font-medium">
                {state.lastSync
                  ? new Date(state.lastSync).toLocaleString('es-AR')
                  : 'Nunca'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos en VTEX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                        {product.skus?.[0]?.Images?.[0] ? (
                          <img
                            src={product.skus[0].Images[0].ImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              getProductStatus(product).color
                            }`}>
                              {getProductStatus(product).label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>ID: {product.id}</span>
                          <span>Marca: {product.brandName || 'N/A'}</span>
                          <span>Categoría: {product.categoryName || 'N/A'}</span>
                          <span>SKUs: {product.skus?.length || 0}</span>
                        </div>

                        {/* SKUs Info */}
                        {product.skus && product.skus.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {product.skus.slice(0, 4).map((sku) => (
                                <div key={sku.id} className="text-xs">
                                  <div className="font-medium">{sku.skuName}</div>
                                  <div className="text-gray-500">
                                    Stock: {getSkuInventory(sku.id)}
                                  </div>
                                </div>
                              ))}
                              {product.skus.length > 4 && (
                                <div className="text-xs text-gray-500">
                                  +{product.skus.length - 4} más...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(
                        `${state.config?.baseUrl}/admin/products/${product.id}`,
                        '_blank'
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Mostrando {filteredProducts.length} de {state.products.length} productos
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
