import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            posts: {
              where: { isPublished: true }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    // Transform to match frontend interface
    const formattedCategories = categories.map(category => ({
      id: category.id.toString(),
      slug: category.slug,
      name: category.name,
      description: category.description,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      featuredImage: category.featuredImage || `/blog/${category.slug}.jpg`,
      postCount: category._count.posts,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const category = await prisma.category.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
        color: data.color || 'bg-blue-500',
        icon: data.icon || '📁',
        sortOrder: data.sortOrder || 0
      }
    });

    return NextResponse.json({
      id: category.id.toString(),
      slug: category.slug,
      name: category.name,
      description: category.description,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      featuredImage: category.featuredImage,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      postCount: 0,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    });

  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
