"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  Settings,
  CreditCard,
  RefreshCw
} from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import VtexConfiguration from "@/components/VtexConfiguration";
import PaymentGatewayConfig from "@/components/PaymentGatewayConfig";
import PaymentAnalyticsDashboard from "@/components/PaymentAnalyticsDashboard";
import ReturnsAdminPanel from "@/components/ReturnsAdminPanel";

export default function AdminDashboard() {
  const { state: authState } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not admin
  if (!authState.user || authState.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder al panel de administración</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Resumen", icon: TrendingUp },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "products", name: "Productos", icon: Package },
    { id: "orders", name: "Pedidos", icon: ShoppingCart },
    { id: "customers", name: "Clientes", icon: Users },
    { id: "inventory", name: "Inventario", icon: AlertTriangle },
    { id: "returns", name: "Devoluciones", icon: RefreshCw },
    { id: "payments", name: "Pagos", icon: CreditCard },
    { id: "vtex", name: "VTEX", icon: Settings },
  ];

  // Mock data
  const mockStats = {
    totalSales: 2847500,
    totalOrders: 156,
    totalCustomers: 89,
    lowStockProducts: 12
  };

  const mockProducts = [
    {
      id: 1,
      name: "Adidas Ultraboost 22",
      sku: "ADI-UB22-001",
      category: "Running",
      price: 149000,
      stock: 25,
      status: "active",
      sales: 45
    },
    {
      id: 2,
      name: "Nike Air Max 270",
      sku: "NIK-AM270-001",
      category: "Lifestyle",
      price: 159000,
      stock: 8,
      status: "active",
      sales: 32
    },
    {
      id: 3,
      name: "Puma RS-X Efekt",
      sku: "PUM-RSX-001",
      category: "Lifestyle",
      price: 129000,
      stock: 3,
      status: "low_stock",
      sales: 28
    }
  ];

  const mockOrders = [
    {
      id: "ORD-001",
      customer: "Juan Pérez",
      total: 298000,
      status: "pending",
      date: "2024-03-15",
      items: 2
    },
    {
      id: "ORD-002",
      customer: "María García",
      total: 179000,
      status: "shipped",
      date: "2024-03-14",
      items: 1
    },
    {
      id: "ORD-003",
      customer: "Carlos López",
      total: 149000,
      status: "delivered",
      date: "2024-03-13",
      items: 1
    }
  ];

  const mockCustomers = [
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      orders: 3,
      totalSpent: 445000,
      lastOrder: "2024-03-15"
    },
    {
      id: "2",
      name: "María García",
      email: "maria.garcia@email.com",
      orders: 2,
      totalSpent: 298000,
      lastOrder: "2024-03-14"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "low_stock":
        return "text-yellow-600 bg-yellow-100";
      case "out_of_stock":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold">${mockStats.totalSales.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% vs mes anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos</p>
              <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 mt-2">8 pedidos hoy</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-2xl font-bold">{mockStats.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-purple-600 mt-2">5 nuevos esta semana</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold">{mockStats.lowStockProducts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-orange-600 mt-2">Requiere atención</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Pedidos Recientes</h3>
          <div className="space-y-3">
            {mockOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Productos con Stock Bajo</h3>
          <div className="space-y-3">
            {mockProducts.filter(p => p.stock < 10).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">
                    {product.stock} unidades
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{product.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={product.stock < 10 ? "text-orange-600 font-medium" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.items}
                </td>
                <td className="px-6 py-4 font-medium">
                  ${order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "analytics":
        return <PaymentAnalyticsDashboard />;
      case "products":
        return renderProducts();
      case "orders":
        return renderOrders();
      case "customers":
        return (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Gestión de clientes en desarrollo</p>
          </div>
        );
      case "inventory":
        return (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Gestión de inventario en desarrollo</p>
          </div>
        );
      case "returns":
        return <ReturnsAdminPanel />;
      case "payments":
        return <PaymentGatewayConfig />;
      case "vtex":
        return <VtexConfiguration />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tu tienda deportiva</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-orange-50 text-orange-500 border border-orange-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
