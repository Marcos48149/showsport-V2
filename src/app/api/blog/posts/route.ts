import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog/posts - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (published === 'true') {
      where.isPublished = true;
    } else if (published === 'false') {
      where.isPublished = false;
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    // Transform to match frontend interface
    const formattedPosts = posts.map(post => ({
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: {
        id: post.category.id.toString(),
        slug: post.category.slug,
        name: post.category.name,
        description: post.category.description,
        metaTitle: post.category.metaTitle,
        metaDescription: post.category.metaDescription,
        featuredImage: post.category.featuredImage || `/blog/${post.category.slug}.jpg`,
        postCount: 0, // Will be calculated separately if needed
        color: post.category.color,
        icon: post.category.icon
      },
      tags: post.tags.map(pt => pt.tag.name),
      author: post.author.name || post.author.email,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      featuredImage: post.featuredImage || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop`,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt,
      isPublished: post.isPublished,
      readingTime: post.readingTime,
      views: post.views,
      schemaType: post.schemaType as 'Article' | 'FAQ' | 'HowTo' | 'Review',
      faqItems: post.faqItems as any,
      howToSteps: post.howToSteps as any,
      reviewRating: post.reviewRating as any
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create new post
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

    // Create post
    const post = await prisma.post.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
        isPublished: data.isPublished || false,
        readingTime: data.readingTime || 5,
        schemaType: data.schemaType || 'Article',
        faqItems: data.faqItems,
        howToSteps: data.howToSteps,
        reviewRating: data.reviewRating,
        authorId: parseInt(session.user.id),
        categoryId: parseInt(data.categoryId),
        publishedAt: data.isPublished ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    });

    // Handle tags
    if (data.tags && data.tags.length > 0) {
      const tagPromises = data.tags.map(async (tagName: string) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }
        });

        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id
          }
        });

        return tag;
      });

      await Promise.all(tagPromises);
    }

    return NextResponse.json({
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: {
        id: post.category.id.toString(),
        slug: post.category.slug,
        name: post.category.name,
        description: post.category.description,
        metaTitle: post.category.metaTitle,
        metaDescription: post.category.metaDescription,
        featuredImage: post.category.featuredImage,
        postCount: 0,
        color: post.category.color,
        icon: post.category.icon
      },
      tags: data.tags || [],
      author: post.author.name || post.author.email,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      featuredImage: post.featuredImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      isPublished: post.isPublished,
      readingTime: post.readingTime,
      views: post.views,
      schemaType: post.schemaType as any,
      faqItems: post.faqItems,
      howToSteps: post.howToSteps,
      reviewRating: post.reviewRating
    });

  } catch (error: any) {
    console.error('Error creating post:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Post slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
