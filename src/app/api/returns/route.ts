import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, use your actual database
const mockReturns: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let filteredReturns = mockReturns;

    // Apply filters
    if (status && status !== 'all') {
      filteredReturns = filteredReturns.filter(ret => ret.status === status);
    }

    if (type && type !== 'all') {
      filteredReturns = filteredReturns.filter(ret => ret.type === type);
    }

    if (search) {
      filteredReturns = filteredReturns.filter(ret =>
        ret.id.toLowerCase().includes(search.toLowerCase()) ||
        ret.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        ret.customerName.toLowerCase().includes(search.toLowerCase()) ||
        ret.customerEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredReturns,
      total: filteredReturns.length
    });

  } catch (error) {
    console.error('Returns API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch returns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      customerEmail,
      customerName,
      type,
      resolution,
      reason,
      items
    } = body;

    // Validate required fields
    if (!orderNumber || !customerEmail || !type || !resolution || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new return request
    const newReturn: any = {
      id: `RET-${Date.now()}`,
      orderNumber,
      customerEmail,
      customerName,
      type,
      resolution,
      reason,
      items,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Generate coupon immediately for changes
    if (type === 'change' && resolution === 'coupon') {
      const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      newReturn.couponCode = `CAMBIO-${Date.now().toString().slice(-6)}`;
      newReturn.couponAmount = totalAmount;
      newReturn.status = 'approved';

      // In production, save coupon to database and send email
      console.log(`Coupon generated: ${newReturn.couponCode} for $${totalAmount}`);
    }

    // Save to mock database
    mockReturns.push(newReturn);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Generate shipping label if approved
    // 4. Send notifications

    return NextResponse.json({
      success: true,
      data: newReturn,
      message: 'Return request created successfully'
    });

  } catch (error) {
    console.error('Create return error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create return request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find and update return
    const returnIndex = mockReturns.findIndex(ret => ret.id === id);

    if (returnIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Return request not found' },
        { status: 404 }
      );
    }

    // Update return status
    mockReturns[returnIndex] = {
      ...mockReturns[returnIndex],
      status,
      notes,
      updatedAt: new Date().toISOString()
    };

    // Handle status-specific actions
    switch (status) {
      case 'approved':
        // Generate shipping label and send notifications
        mockReturns[returnIndex].shippingLabel = `https://shipping.andreani.com/label/AR${Date.now()}`;
        mockReturns[returnIndex].trackingNumber = `AR${Date.now().toString().slice(-8)}`;
        break;

      case 'completed':
        // Process refund if needed
        if (mockReturns[returnIndex].resolution === 'refund') {
          const totalAmount = mockReturns[returnIndex].items.reduce(
            (sum: number, item: any) => sum + (item.price * item.quantity),
            0
          );
          mockReturns[returnIndex].refundAmount = totalAmount;
          mockReturns[returnIndex].refundProcessedAt = new Date().toISOString();
        }
        break;
    }

    return NextResponse.json({
      success: true,
      data: mockReturns[returnIndex],
      message: 'Return request updated successfully'
    });

  } catch (error) {
    console.error('Update return error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update return request' },
      { status: 500 }
    );
  }
}
