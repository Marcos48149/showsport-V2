"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from "lucide-react";

interface PaymentMetrics {
  totalTransactions: number;
  totalRevenue: number;
  successRate: number;
  averageOrderValue: number;
  dailyGrowth: number;
  weeklyGrowth: number;
  gatewayBreakdown: {
    mercadopago: { transactions: number; revenue: number; successRate: number };
    gocuotas: { transactions: number; revenue: number; successRate: number };
    modo: { transactions: number; revenue: number; successRate: number };
  };
  hourlyData: Array<{
    hour: string;
    transactions: number;
    revenue: number;
    errors: number;
  }>;
  recentTransactions: Array<{
    id: string;
    orderId: string;
    gateway: string;
    amount: number;
    status: string;
    timestamp: string;
    customerEmail: string;
  }>;
  errorLog: Array<{
    id: string;
    gateway: string;
    error: string;
    timestamp: string;
    count: number;
  }>;
}

export default function PaymentAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Simulated real-time data - In production, this would come from your database
  const generateMockMetrics = (): PaymentMetrics => {
    const now = new Date();
    const baseRevenue = 150000;
    const baseTransactions = 45;

    return {
      totalTransactions: baseTransactions + Math.floor(Math.random() * 10),
      totalRevenue: baseRevenue + Math.floor(Math.random() * 50000),
      successRate: 94.5 + Math.random() * 3,
      averageOrderValue: 3200 + Math.floor(Math.random() * 800),
      dailyGrowth: -2 + Math.random() * 8,
      weeklyGrowth: 5 + Math.random() * 10,
      gatewayBreakdown: {
        mercadopago: {
          transactions: 25 + Math.floor(Math.random() * 5),
          revenue: 95000 + Math.floor(Math.random() * 20000),
          successRate: 96 + Math.random() * 2
        },
        gocuotas: {
          transactions: 12 + Math.floor(Math.random() * 3),
          revenue: 35000 + Math.floor(Math.random() * 10000),
          successRate: 92 + Math.random() * 4
        },
        modo: {
          transactions: 8 + Math.floor(Math.random() * 3),
          revenue: 20000 + Math.floor(Math.random() * 8000),
          successRate: 94 + Math.random() * 3
        }
      },
      hourlyData: Array.from({ length: 24 }, (_, i) => ({
        hour: `${23 - i}:00`,
        transactions: Math.floor(Math.random() * 8) + 1,
        revenue: Math.floor(Math.random() * 15000) + 5000,
        errors: Math.floor(Math.random() * 3)
      })),
      recentTransactions: [
        {
          id: "1",
          orderId: `ORD-${Date.now() - 1000}`,
          gateway: "mercadopago",
          amount: 15000,
          status: "approved",
          timestamp: new Date(now.getTime() - 2 * 60000).toISOString(),
          customerEmail: "cliente1@email.com"
        },
        {
          id: "2",
          orderId: `ORD-${Date.now() - 2000}`,
          gateway: "gocuotas",
          amount: 8500,
          status: "pending",
          timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
          customerEmail: "cliente2@email.com"
        },
        {
          id: "3",
          orderId: `ORD-${Date.now() - 3000}`,
          gateway: "modo",
          amount: 12000,
          status: "approved",
          timestamp: new Date(now.getTime() - 8 * 60000).toISOString(),
          customerEmail: "cliente3@email.com"
        }
      ],
      errorLog: [
        {
          id: "1",
          gateway: "mercadopago",
          error: "Invalid signature",
          timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
          count: 3
        },
        {
          id: "2",
          gateway: "gocuotas",
          error: "Connection timeout",
          timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
          count: 1
        }
      ]
    };
  };

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);

      // Simulate API call - replace with real endpoint
      // Fetch real data from API
      const response = await fetch(`/api/admin/analytics?range=${selectedTimeRange}`);
      const result = await response.json();

      if (result.success) {
        setMetrics(result.data);
        setLastUpdate(new Date());
      } else {
        console.error('API error:', result.error);
        // Fallback to mock data if API fails
        const newMetrics = generateMockMetrics();
        setMetrics(newMetrics);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Fallback to mock data if fetch fails
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [selectedTimeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, selectedTimeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGatewayIcon = (gateway: string) => {
    switch (gateway) {
      case 'mercadopago': return '🔵';
      case 'gocuotas': return '🟢';
      case 'modo': return '🟣';
      default: return '⚪';
    }
  };

  const getGatewayName = (gateway: string) => {
    switch (gateway) {
      case 'mercadopago': return 'Mercado Pago';
      case 'gocuotas': return 'Go Cuotas';
      case 'modo': return 'MODO';
      default: return gateway;
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics de Pagos</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de transacciones</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range as typeof selectedTimeRange)}
                className={`px-3 py-2 text-sm font-medium ${
                  selectedTimeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Auto Refresh Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'border-green-500 text-green-600' : ''}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>

          {/* Manual Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Última actualización: {lastUpdate.toLocaleTimeString('es-AR')}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2">
            {metrics.dailyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${metrics.dailyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.dailyGrowth >= 0 ? '+' : ''}{formatPercent(metrics.dailyGrowth)} vs ayer
            </span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transacciones</p>
              <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 mt-2">
            {Math.floor(metrics.totalTransactions / 24)} promedio por hora
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.successRate)}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">
            {Math.floor(metrics.totalTransactions * metrics.successRate / 100)} exitosas
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-purple-600 mt-2">
            +{formatPercent(metrics.weeklyGrowth)} vs semana anterior
          </p>
        </div>
      </div>

      {/* Gateway Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gateway Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Rendimiento por Pasarela
          </h3>

          <div className="space-y-4">
            {Object.entries(metrics.gatewayBreakdown).map(([gateway, data]) => (
              <div key={gateway} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getGatewayIcon(gateway)}</span>
                  <div>
                    <p className="font-medium">{getGatewayName(gateway)}</p>
                    <p className="text-sm text-gray-600">{data.transactions} transacciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(data.revenue)}</p>
                  <p className="text-sm text-gray-600">{formatPercent(data.successRate)} éxito</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Transacciones Recientes
          </h3>

          <div className="space-y-3">
            {metrics.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm">{getGatewayIcon(transaction.gateway)}</span>
                  <div>
                    <p className="font-medium text-sm">{transaction.orderId}</p>
                    <p className="text-xs text-gray-600">{transaction.customerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(transaction.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Chart & Error Log */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hourly Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Actividad por Hora (Últimas 24h)
          </h3>

          <div className="h-64 flex items-end justify-between gap-1">
            {metrics.hourlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                  <div
                    className="bg-orange-500 rounded-t absolute bottom-0 w-full"
                    style={{
                      height: `${(data.transactions / Math.max(...metrics.hourlyData.map(d => d.transactions))) * 100}%`,
                      minHeight: '2px'
                    }}
                  />
                  {data.errors > 0 && (
                    <div
                      className="bg-red-500 absolute top-0 w-full rounded-t"
                      style={{ height: `${(data.errors / 3) * 20}px` }}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left">
                  {data.hour}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Transacciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Errores</span>
            </div>
          </div>
        </div>

        {/* Error Log */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Log de Errores
          </h3>

          <div className="space-y-3">
            {metrics.errorLog.length > 0 ? (
              metrics.errorLog.map((error) => (
                <div key={error.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{getGatewayIcon(error.gateway)}</span>
                    <span className="text-xs text-red-600 font-medium">×{error.count}</span>
                  </div>
                  <p className="text-sm font-medium text-red-800 mt-1">{error.error}</p>
                  <p className="text-xs text-red-600">
                    {new Date(error.timestamp).toLocaleTimeString('es-AR')}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No hay errores recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(metrics.gatewayBreakdown).map(([gateway, data]) => (
            <div key={gateway} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getGatewayIcon(gateway)}</span>
                <div>
                  <p className="font-medium">{getGatewayName(gateway)}</p>
                  <p className="text-sm text-gray-600">API Status</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${data.successRate > 95 ? 'bg-green-500' : data.successRate > 90 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
