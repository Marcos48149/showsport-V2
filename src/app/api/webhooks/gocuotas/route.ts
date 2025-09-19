import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Go Cuotas webhook received:', body);

    // Verify webhook signature (implement according to Go Cuotas documentation)
    // const signature = request.headers.get('x-gocuotas-signature');
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { event_type, order_id, payment_id, status, amount } = body;

    if (event_type === 'payment.approved' || event_type === 'payment.completed') {
      console.log('Go Cuotas payment approved:', {
        orderId: order_id,
        paymentId: payment_id,
        amount,
        status
      });

      // In a real implementation:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Process fulfillment

      // Mock implementation
      // await updateOrderStatus(order_id, 'approved');
      // await sendOrderConfirmation(order_id);

      return NextResponse.json({ status: 'processed' }, { status: 200 });
    }

    if (event_type === 'payment.failed' || event_type === 'payment.cancelled') {
      console.log('Go Cuotas payment failed/cancelled:', {
        orderId: order_id,
        paymentId: payment_id,
        status
      });

      // Handle failed/cancelled payment
      // await updateOrderStatus(order_id, 'failed');

      return NextResponse.json({ status: 'processed' }, { status: 200 });
    }

    if (event_type === 'payment.pending') {
      console.log('Go Cuotas payment pending:', {
        orderId: order_id,
        paymentId: payment_id
      });

      // Handle pending payment
      // await updateOrderStatus(order_id, 'pending');

      return NextResponse.json({ status: 'processed' }, { status: 200 });
    }

    return NextResponse.json({ status: 'ignored' }, { status: 200 });

  } catch (error) {
    console.error('Go Cuotas webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Go Cuotas webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}
