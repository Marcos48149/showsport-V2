import { NextRequest, NextResponse } from 'next/server';

// Mock coupons database - in production, use your actual database
const mockCoupons: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { returnId, amount, customerEmail } = body;

    // Validate required fields
    if (!returnId || !amount || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique coupon code
    const couponCode = `CAMBIO-${Date.now().toString().slice(-6)}`;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months validity

    // Create coupon object
    const coupon = {
      id: `CUP-${Date.now()}`,
      code: couponCode,
      returnId,
      amount,
      customerEmail,
      status: 'active',
      usageCount: 0,
      maxUsage: 1,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
      usedAt: null,
      orderUsedIn: null
    };

    // Save to mock database
    mockCoupons.push(coupon);

    // In production, you would:
    // 1. Save to database
    // 2. Send email with coupon
    // 3. Log the transaction
    // 4. Update return request with coupon info

    console.log(`Coupon generated: ${couponCode} for $${amount} - Customer: ${customerEmail}`);

    // Simulate sending email
    const emailContent = {
      to: customerEmail,
      subject: 'Su cupón de cambio ShowSport',
      html: `
        <h2>¡Su cupón de cambio está listo!</h2>
        <div style="border: 2px dashed #f97316; padding: 20px; text-align: center; margin: 20px 0;">
          <h3 style="color: #f97316; margin: 0;">Código de cupón</h3>
          <h1 style="font-size: 2em; color: #f97316; margin: 10px 0;">${couponCode}</h1>
          <p style="font-size: 1.2em; color: #059669;">Valor: $${amount.toLocaleString()}</p>
        </div>
        <p>Su cupón es válido hasta el ${new Date(expiryDate).toLocaleDateString('es-AR')}.</p>
        <p>Puede usarlo inmediatamente en nuestra tienda online.</p>
        <a href="${process.env.BASE_URL || 'http://localhost:3000'}"
           style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Comprar Ahora
        </a>
      `
    };

    return NextResponse.json({
      success: true,
      data: {
        couponCode,
        amount,
        expiryDate: expiryDate.toISOString(),
        emailSent: true
      },
      message: 'Coupon generated and email sent successfully'
    });

  } catch (error) {
    console.error('Coupon generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate coupon' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon in mock database
    const coupon = mockCoupons.find(c => c.code === code);

    if (!coupon) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Cupón no encontrado'
      });
    }

    // Check if coupon is valid
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (now > expiryDate) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Cupón expirado'
      });
    }

    if (coupon.status !== 'active') {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Cupón no válido'
      });
    }

    if (coupon.usageCount >= coupon.maxUsage) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Cupón ya utilizado'
      });
    }

    // Optional: Check if email matches (for extra security)
    if (email && coupon.customerEmail !== email) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Cupón no válido para este usuario'
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        amount: coupon.amount,
        expiryDate: coupon.expiryDate,
        remainingUses: coupon.maxUsage - coupon.usageCount
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al validar el cupón' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, action, orderNumber } = body;

    if (!code || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find coupon
    const couponIndex = mockCoupons.findIndex(c => c.code === code);

    if (couponIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Coupon not found'
      }, { status: 404 });
    }

    const coupon = mockCoupons[couponIndex];

    switch (action) {
      case 'use':
        if (coupon.usageCount >= coupon.maxUsage) {
          return NextResponse.json({
            success: false,
            error: 'Coupon already used'
          }, { status: 400 });
        }

        // Mark coupon as used
        mockCoupons[couponIndex] = {
          ...coupon,
          usageCount: coupon.usageCount + 1,
          usedAt: new Date().toISOString(),
          orderUsedIn: orderNumber,
          status: coupon.usageCount + 1 >= coupon.maxUsage ? 'used' : 'active'
        };

        return NextResponse.json({
          success: true,
          message: 'Coupon used successfully',
          data: mockCoupons[couponIndex]
        });

      case 'cancel':
        // Cancel/deactivate coupon
        mockCoupons[couponIndex] = {
          ...coupon,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Coupon cancelled successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Coupon update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}
