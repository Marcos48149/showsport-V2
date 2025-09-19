"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock analytics data
  const salesData = [
    { date: "01/09", sales: 125000, orders: 15, customers: 12 },
    { date: "02/09", sales: 189000, orders: 22, customers: 18 },
    { date: "03/09", sales: 234000, orders: 28, customers: 24 },
    { date: "04/09", sales: 156000, orders: 18, customers: 15 },
    { date: "05/09", sales: 298000, orders: 35, customers: 28 },
    { date: "06/09", sales: 267000, orders: 31, customers: 26 },
    { date: "07/09", sales: 345000, orders: 42, customers: 34 }
  ];

  const categoryData = [
    { name: "Running", value: 45, sales: 1250000, color: "#FF6B35" },
    { name: "Basketball", value: 30, sales: 890000, color: "#F7931E" },
    { name: "Lifestyle", value: 25, sales: 675000, color: "#FFD23F" }
  ];

  const topProducts = [
    { name: "Adidas Ultraboost 22", sales: 45, revenue: 670500, growth: 12.5 },
    { name: "Nike Air Max 270", sales: 32, revenue: 508800, growth: 8.3 },
    { name: "Nike LeBron 20", sales: 28, revenue: 557200, growth: 15.7 },
    { name: "Puma RS-X Efekt", sales: 24, revenue: 309600, growth: -2.1 },
    { name: "Adidas Dame 8", sales: 22, revenue: 393800, growth: 6.8 }
  ];

  const conversionData = [
    { step: "Visitas", count: 2450, percentage: 100 },
    { step: "Productos Vistos", count: 1875, percentage: 76.5 },
    { step: "Carrito", count: 456, percentage: 18.6 },
    { step: "Checkout", count: 298, percentage: 12.2 },
    { step: "Compra", count: 156, percentage: 6.4 }
  ];

  const kpiData = [
    {
      title: "Ventas Totales",
      value: "$2.847.500",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Pedidos",
      value: "156",
      change: "+8.3%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Conversión",
      value: "6.4%",
      change: "-0.8%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Ticket Promedio",
      value: "$18.254",
      change: "+4.2%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const timeRanges = [
    { value: "7d", label: "7 días" },
    { value: "30d", label: "30 días" },
    { value: "90d", label: "90 días" },
    { value: "1y", label: "1 año" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Métricas de rendimiento y ventas en tiempo real</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${kpi.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {kpi.change}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{kpi.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Tendencia de Ventas</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Últimos 7 días
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: string) => [
                  name === 'sales' ? `$${value.toLocaleString()}` : value,
                  name === 'sales' ? 'Ventas' : 'Pedidos'
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Ventas por Categoría</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: string) => [`${value}%`, 'Participación']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <span className="font-medium">${category.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Productos Más Vendidos</h3>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} ventas</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-sm">${product.revenue.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-xs ${
                    product.growth > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {product.growth > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Embudo de Conversión</h3>

          <div className="space-y-3">
            {conversionData.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{step.step}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold">{step.count.toLocaleString()}</span>
                    <span className="text-xs text-gray-600 ml-2">({step.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>

                {index < conversionData.length - 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Drop-off: {(conversionData[index].percentage - conversionData[index + 1].percentage).toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Pedidos y Clientes</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Pedidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Clientes</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="orders" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="customers" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
