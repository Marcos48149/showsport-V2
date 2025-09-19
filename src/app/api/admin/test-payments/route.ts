import { NextRequest, NextResponse } from 'next/server';
import { paymentTesting } from '@/lib/paymentTesting';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Check if user has admin access (you might want to add proper auth here)
    const { searchParams } = new URL(request.url);
    const gateway = searchParams.get('gateway');
    const testType = searchParams.get('type') || 'full';

    let results;

    if (gateway) {
      // Test specific gateway
      results = await paymentTesting.testGateway(gateway);
    } else if (testType === 'health') {
      // Quick health check
      results = await paymentTesting.quickHealthCheck();
    } else {
      // Full test suite
      results = await paymentTesting.runAllTests();
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Payment test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run payment tests',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, gateway, config: newConfig } = body;

    switch (action) {
      case 'test-gateway':
        const testResult = await paymentTesting.testGateway(gateway);
        return NextResponse.json({ success: true, data: testResult });

      case 'validate-config':
        const validation = config.validateConfig();
        return NextResponse.json({
          success: true,
          data: {
            isValid: validation.isValid,
            errors: validation.errors,
            environment: config.isProduction() ? 'production' : 'test'
          }
        });

      case 'health-check':
        const health = await paymentTesting.quickHealthCheck();
        return NextResponse.json({ success: true, data: health });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Payment test POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
