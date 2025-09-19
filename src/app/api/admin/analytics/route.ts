import { NextRequest, NextResponse } from 'next/server';

// This would typically come from your database
// For now, we'll simulate the data structure

interface AnalyticsData {
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

// Simulate database queries
async function getAnalyticsData(timeRange: string): Promise<AnalyticsData> {
  // In a real implementation, you would query your database here
  // Example with Prisma:
  /*
  const transactions = await prisma.paymentTransaction.findMany({
    where: {
      createdAt: {
        gte: getDateForRange(timeRange)
      }
    },
    include: {
      paymentLogs: true
    }
  });

  const errorLogs = await prisma.paymentLog.findMany({
    where: {
      level: 'ERROR',
      timestamp: {
        gte: getDateForRange(timeRange)
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 10
  });
  */

  // Mock data for demonstration
  const now = new Date();
  const baseRevenue = timeRange === '24h' ? 150000 : timeRange === '7d' ? 1050000 : 4200000;
  const baseTransactions = timeRange === '24h' ? 45 : timeRange === '7d' ? 315 : 1260;

  return {
    totalTransactions: baseTransactions + Math.floor(Math.random() * 20),
    totalRevenue: baseRevenue + Math.floor(Math.random() * 100000),
    successRate: 94.5 + Math.random() * 4,
    averageOrderValue: 3200 + Math.floor(Math.random() * 800),
    dailyGrowth: -2 + Math.random() * 12,
    weeklyGrowth: 5 + Math.random() * 15,
    gatewayBreakdown: {
      mercadopago: {
        transactions: Math.floor(baseTransactions * 0.55) + Math.floor(Math.random() * 5),
        revenue: Math.floor(baseRevenue * 0.60) + Math.floor(Math.random() * 20000),
        successRate: 96 + Math.random() * 2
      },
      gocuotas: {
        transactions: Math.floor(baseTransactions * 0.25) + Math.floor(Math.random() * 3),
        revenue: Math.floor(baseRevenue * 0.25) + Math.floor(Math.random() * 10000),
        successRate: 92 + Math.random() * 4
      },
      modo: {
        transactions: Math.floor(baseTransactions * 0.20) + Math.floor(Math.random() * 3),
        revenue: Math.floor(baseRevenue * 0.15) + Math.floor(Math.random() * 8000),
        successRate: 94 + Math.random() * 3
      }
    },
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: `${23 - i}:00`,
      transactions: Math.floor(Math.random() * 12) + 1,
      revenue: Math.floor(Math.random() * 25000) + 5000,
      errors: Math.floor(Math.random() * 4)
    })),
    recentTransactions: [
      {
        id: "1",
        orderId: `ORD-${Date.now() - 1000}`,
        gateway: "mercadopago",
        amount: 15000 + Math.floor(Math.random() * 10000),
        status: "approved",
        timestamp: new Date(now.getTime() - 2 * 60000).toISOString(),
        customerEmail: "cliente1@email.com"
      },
      {
        id: "2",
        orderId: `ORD-${Date.now() - 2000}`,
        gateway: "gocuotas",
        amount: 8500 + Math.floor(Math.random() * 5000),
        status: Math.random() > 0.8 ? "pending" : "approved",
        timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
        customerEmail: "cliente2@email.com"
      },
      {
        id: "3",
        orderId: `ORD-${Date.now() - 3000}`,
        gateway: "modo",
        amount: 12000 + Math.floor(Math.random() * 8000),
        status: "approved",
        timestamp: new Date(now.getTime() - 8 * 60000).toISOString(),
        customerEmail: "cliente3@email.com"
      },
      {
        id: "4",
        orderId: `ORD-${Date.now() - 4000}`,
        gateway: "mercadopago",
        amount: 25000 + Math.floor(Math.random() * 15000),
        status: Math.random() > 0.9 ? "rejected" : "approved",
        timestamp: new Date(now.getTime() - 12 * 60000).toISOString(),
        customerEmail: "cliente4@email.com"
      },
      {
        id: "5",
        orderId: `ORD-${Date.now() - 5000}`,
        gateway: "gocuotas",
        amount: 18500 + Math.floor(Math.random() * 7000),
        status: "approved",
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
        customerEmail: "cliente5@email.com"
      }
    ],
    errorLog: Math.random() > 0.7 ? [
      {
        id: "1",
        gateway: "mercadopago",
        error: "Invalid webhook signature",
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
        count: Math.floor(Math.random() * 5) + 1
      },
      {
        id: "2",
        gateway: "gocuotas",
        error: "Connection timeout",
        timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
        count: Math.floor(Math.random() * 3) + 1
      }
    ] : []
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '24h';

    // Validate time range
    if (!['24h', '7d', '30d'].includes(timeRange)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time range' },
        { status: 400 }
      );
    }

    // Get analytics data
    const analyticsData = await getAnalyticsData(timeRange);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      metadata: {
        timeRange,
        generatedAt: new Date().toISOString(),
        // In production, add more metadata like data freshness, cache status, etc.
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to get date range for queries
function getDateForRange(range: string): Date {
  const now = new Date();
  switch (range) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
}

// Real-time metrics endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'get-live-metrics':
        // Return current system status and live metrics
        const liveData = {
          systemStatus: {
            mercadopago: { status: 'online', responseTime: 150 + Math.random() * 100 },
            gocuotas: { status: 'online', responseTime: 200 + Math.random() * 150 },
            modo: { status: Math.random() > 0.95 ? 'degraded' : 'online', responseTime: 180 + Math.random() * 120 }
          },
          activeTransactions: Math.floor(Math.random() * 15) + 5,
          queueLength: Math.floor(Math.random() * 3),
          lastProcessedTransaction: {
            gateway: ['mercadopago', 'gocuotas', 'modo'][Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 50000) + 10000,
            timestamp: new Date().toISOString()
          }
        };

        return NextResponse.json({
          success: true,
          data: liveData
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process analytics request',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
