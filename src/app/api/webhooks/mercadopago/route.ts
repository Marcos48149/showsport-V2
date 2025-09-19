import { NextRequest, NextResponse } from 'next/server';
import { webhookSecurity } from '@/lib/webhookSecurity';
import { paymentLogger, LogLevel, PaymentEvent } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

  try {
    // Rate limiting
    const rateLimit = webhookSecurity.checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      await paymentLogger.log(
        LogLevel.WARN,
        PaymentEvent.WEBHOOK_FAILED,
        'mercadopago',
        { error: 'Rate limit exceeded', metadata: { clientIp } }
      );
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Get request body and headers
    const rawBody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    // Validate webhook signature
    const validation = await webhookSecurity.validateWebhook(
      'mercadopago',
      rawBody,
      headers
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the validated payload
    const body = JSON.parse(rawBody);
    const topic = body.topic || body.type;
    const id = body.id || body.data?.id;

    await paymentLogger.log(
      LogLevel.INFO,
      PaymentEvent.WEBHOOK_RECEIVED,
      'mercadopago',
      {
        metadata: { topic, id, orderId: body.external_reference }
      }
    );

    if (topic === 'payment') {
      const paymentId = id;
      const orderId = body.external_reference;

      // Simulate payment status determination
      const mockPaymentStatus = body.action === 'payment.created' ? 'approved' : 'pending';

      await paymentLogger.logPaymentStatusChange(
        'mercadopago',
        orderId,
        paymentId,
        'pending',
        mockPaymentStatus
      );

      // Here you would:
      // 1. Fetch payment details from Mercado Pago API
      // 2. Update order status in database
      // 3. Send confirmation emails
      // 4. Update inventory

      await paymentLogger.log(
        LogLevel.INFO,
        PaymentEvent.WEBHOOK_PROCESSED,
        'mercadopago',
        {
          orderId,
          paymentId,
          status: mockPaymentStatus,
          metadata: { topic, action: body.action }
        }
      );

      return NextResponse.json({ status: 'processed' }, { status: 200 });
    }

    if (topic === 'merchant_order') {
      await paymentLogger.log(
        LogLevel.INFO,
        PaymentEvent.WEBHOOK_PROCESSED,
        'mercadopago',
        { metadata: { topic, orderId: id } }
      );

      return NextResponse.json({ status: 'processed' }, { status: 200 });
    }

    return NextResponse.json({ status: 'ignored' }, { status: 200 });

  } catch (error) {
    await paymentLogger.logError('mercadopago', error as Error, {
      metadata: { clientIp, endpoint: 'webhook' }
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');

  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    status: 'Mercado Pago webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}
