import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/upload/status - Check Cloudinary configuration status
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const hasCloudName = !!cloudName && cloudName !== 'demo';
    const hasApiKey = !!apiKey && apiKey !== 'demo-api-key' && apiKey !== '123456789012345';
    const hasApiSecret = !!apiSecret && apiSecret !== 'demo-api-secret' && apiSecret !== 'abcdefghijklmnopqrstuvwxyz123456';

    const isConfigured = hasCloudName && hasApiKey && hasApiSecret;
    const isDemo = !isConfigured;

    return NextResponse.json({
      isConfigured,
      isDemo,
      cloudName: cloudName || 'demo',
      hasApiKey,
      hasApiSecret,
      status: isConfigured ? 'configured' : 'demo',
      message: isConfigured
        ? 'Cloudinary está configurado correctamente'
        : 'Usando modo demo con imágenes de Unsplash',
      features: {
        realUploads: isConfigured,
        automaticOptimization: isConfigured,
        cdnDelivery: isConfigured,
        transformations: isConfigured
      },
      limits: {
        freeAccountBandwidth: '25GB/mes',
        maxFileSize: '5MB',
        supportedFormats: ['JPG', 'PNG', 'WebP', 'AVIF', 'GIF']
      }
    });

  } catch (error) {
    console.error('Error checking Cloudinary status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check configuration',
        isConfigured: false,
        isDemo: true,
        status: 'error'
      },
      { status: 500 }
    );
  }
}
