import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('MODO webhook received:', body);

    // Verify webhook signature (implement according to MODO documentation)
    // const signature = request.headers.get('x-modo-signature');
    // if (!verifyModoSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const {
      event,
      payment_id,
      order_id,
      status,
      amount,
      currency,
      transaction_id,
      created_at
    } = body;

    switch (event) {
      case 'payment.success':
      case 'payment.approved':
        console.log('MODO payment approved:', {
          orderId: order_id,
          paymentId: payment_id,
          transactionId: transaction_id,
          amount,
          currency
        });

        // Process successful payment
        // await updateOrderStatus(order_id, 'approved');
        // await sendOrderConfirmation(order_id);
        // await updateInventory(order_id);

        return NextResponse.json({
          status: 'success',
          message: 'Payment processed successfully'
        }, { status: 200 });

      case 'payment.failed':
      case 'payment.error':
        console.log('MODO payment failed:', {
          orderId: order_id,
          paymentId: payment_id,
          status
        });

        // Handle failed payment
        // await updateOrderStatus(order_id, 'failed');
        // await notifyPaymentFailure(order_id);

        return NextResponse.json({
          status: 'processed',
          message: 'Payment failure processed'
        }, { status: 200 });

      case 'payment.cancelled':
        console.log('MODO payment cancelled:', {
          orderId: order_id,
          paymentId: payment_id
        });

        // Handle cancelled payment
        // await updateOrderStatus(order_id, 'cancelled');
        // await releaseInventoryReservation(order_id);

        return NextResponse.json({
          status: 'processed',
          message: 'Payment cancellation processed'
        }, { status: 200 });

      case 'payment.pending':
        console.log('MODO payment pending:', {
          orderId: order_id,
          paymentId: payment_id
        });

        // Handle pending payment
        // await updateOrderStatus(order_id, 'pending');

        return NextResponse.json({
          status: 'processed',
          message: 'Payment pending status updated'
        }, { status: 200 });

      default:
        console.log('Unknown MODO event:', event);
        return NextResponse.json({
          status: 'ignored',
          message: `Unknown event: ${event}`
        }, { status: 200 });
    }

  } catch (error) {
    console.error('MODO webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'MODO webhook endpoint active',
    timestamp: new Date().toISOString(),
    version: '1.0'
  });
}
