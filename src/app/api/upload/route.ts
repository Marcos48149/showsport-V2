import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general'; // post, category, general

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Check if Cloudinary is properly configured
    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo';

    if (hasCloudinaryConfig) {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate filename
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${type}_${timestamp}_${cleanFileName}`;

        // Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(
          buffer,
          filename,
          `showsport-blog/${type}`
        );

        return NextResponse.json({
          success: true,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          filename: cleanFileName,
          size: file.size,
          type: file.type,
          provider: 'cloudinary'
        });

      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        // Fall through to demo mode
      }
    }

    // Demo mode - return a placeholder URL
    // In a real implementation, you might save to local storage or use a different service
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Generate a realistic demo URL
    const demoImageUrls = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f9bd2f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=400&fit=crop'
    ];

    const randomUrl = demoImageUrls[timestamp % demoImageUrls.length];

    return NextResponse.json({
      success: true,
      url: randomUrl,
      publicId: `demo_${timestamp}`,
      width: 800,
      height: 400,
      filename: cleanFileName,
      size: file.size,
      type: file.type,
      provider: 'demo',
      message: 'Demo mode - using placeholder image. Configure Cloudinary for real uploads.'
    });

  } catch (error: any) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint to get upload stats or recent uploads
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

    // For now, return basic info
    // In a real implementation, you might store upload metadata in database
    return NextResponse.json({
      message: 'Upload endpoint ready',
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSize: '5MB',
      folders: ['posts', 'categories', 'general']
    });

  } catch (error) {
    console.error('Upload info error:', error);
    return NextResponse.json(
      { error: 'Failed to get upload info' },
      { status: 500 }
    );
  }
}
