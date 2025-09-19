import { NextRequest, NextResponse } from 'next/server';

// Mock orders database - in production, use your actual database
const mockOrders = [
  {
    orderNumber: 'ORD-123456',
    customerEmail: 'juan.perez@email.com',
    customerName: 'Juan Pérez',
    status: 'delivered',
    items: [
      {
        productId: '1',
        productName: 'Adidas Ultraboost 22',
        productImage: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
        size: '42',
        quantity: 1,
        price: 149000
      }
    ],
    total: 149000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    deliveredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    orderNumber: 'ORD-789012',
    customerEmail: 'maria.garcia@email.com',
    customerName: 'María García',
    status: 'delivered',
    items: [
      {
        productId: '2',
        productName: 'Nike Air Max 270',
        productImage: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png',
        size: '38',
        quantity: 1,
        price: 159000
      }
    ],
    total: 159000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    deliveredDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    orderNumber: 'ORD-345678',
    customerEmail: 'carlos.lopez@email.com',
    customerName: 'Carlos López',
    status: 'delivered',
    items: [
      {
        productId: '3',
        productName: 'Puma RS-X Efekt',
        productImage: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393161/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Sneakers',
        size: '41',
        quantity: 1,
        price: 129000
      },
      {
        productId: '4',
        productName: 'Nike LeBron 20',
        productImage: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-5cc7de3b-2c49-4174-933c-78d3aa0f8532/lebron-20-basketball-shoes-PzDGCK.png',
        size: '43',
        quantity: 1,
        price: 199000
      }
    ],
    total: 328000,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    deliveredDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, email } = body;

    // Validate required fields
    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    // Find order in mock database
    const order = mockOrders.find(
      o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
           o.customerEmail.toLowerCase() === email.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'No se encontró un pedido con esos datos. Verifique el número de pedido y email.'
      });
    }

    // Check if order is eligible for returns/exchanges
    const deliveredDate = new Date(order.deliveredDate);
    const now = new Date();
    const daysSinceDelivery = Math.floor((now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));
    const returnWindowDays = 30;

    if (daysSinceDelivery > returnWindowDays) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `El período de cambios y devoluciones ha expirado. Tiene ${returnWindowDays} días desde la entrega para realizar cambios.`
      });
    }

    if (order.status !== 'delivered') {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Solo se pueden procesar cambios y devoluciones de pedidos entregados.'
      });
    }

    // Check if there are already pending returns for this order
    // In production, check your returns database
    const hasPendingReturns = false; // Mock check

    if (hasPendingReturns) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Ya existe una solicitud de cambio/devolución pendiente para este pedido.'
      });
    }

    // Return valid order data
    return NextResponse.json({
      success: true,
      valid: true,
      orderData: {
        ...order,
        daysSinceDelivery,
        remainingDays: returnWindowDays - daysSinceDelivery
      }
    });

  } catch (error) {
    console.error('Order validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al validar el pedido. Intente nuevamente.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find order by number only (for admin purposes)
    const order = mockOrders.find(
      o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      orderData: order
    });

  } catch (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar el pedido' },
      { status: 500 }
    );
  }
}
