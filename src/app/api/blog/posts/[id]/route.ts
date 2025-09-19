import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/blog/posts/[id] - Get specific post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
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
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } }
    });

    const formattedPost = {
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
        postCount: 0,
        color: post.category.color,
        icon: post.category.icon
      },
      tags: post.tags.map(pt => pt.tag.name),
      author: post.author.name || post.author.email,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      featuredImage: post.featuredImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      isPublished: post.isPublished,
      readingTime: post.readingTime,
      views: post.views + 1,
      schemaType: post.schemaType as 'Article' | 'FAQ' | 'HowTo' | 'Review',
      faqItems: post.faqItems,
      howToSteps: post.howToSteps,
      reviewRating: post.reviewRating
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);
    const data = await request.json();

    // Check if user can edit this post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Only admin or the author can edit
    if (session.user.role !== 'admin' && existingPost.authorId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update post
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
        isPublished: data.isPublished,
        readingTime: data.readingTime,
        schemaType: data.schemaType,
        faqItems: data.faqItems,
        howToSteps: data.howToSteps,
        reviewRating: data.reviewRating,
        categoryId: parseInt(data.categoryId),
        publishedAt: data.isPublished && !existingPost.publishedAt ? new Date() : existingPost.publishedAt
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

    // Update tags
    if (data.tags) {
      // Remove existing tags
      await prisma.postTag.deleteMany({
        where: { postId }
      });

      // Add new tags
      if (data.tags.length > 0) {
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
    console.error('Error updating post:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Post slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);

    // Check if user can delete this post
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Only admin or the author can delete
    if (session.user.role !== 'admin' && existingPost.authorId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete post (tags will be deleted automatically due to cascade)
    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error deleting post:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
