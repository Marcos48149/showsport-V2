import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/blog/search - Search posts and get related posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const postId = searchParams.get('related');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Search posts
    if (query) {
      const posts = await prisma.post.findMany({
        where: {
          isPublished: true,
          AND: [
            category ? { category: { slug: category } } : {},
            {
              OR: [
                { title: { contains: query } },
                { excerpt: { contains: query } },
                { content: { contains: query } }
              ]
            }
          ]
        },
        include: {
          author: {
            select: {
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
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        }
      });

      const formattedPosts = posts.map(post => ({
        id: post.id.toString(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: {
          id: post.category.id.toString(),
          slug: post.category.slug,
          name: post.category.name,
          color: post.category.color,
          icon: post.category.icon
        },
        tags: post.tags.map(pt => pt.tag.name),
        author: post.author.name || post.author.email,
        publishedAt: post.publishedAt?.toISOString(),
        readingTime: post.readingTime,
        featuredImage: post.featuredImage
      }));

      return NextResponse.json(formattedPosts);
    }

    // Get related posts
    if (postId) {
      const currentPost = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      if (!currentPost) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      // Find related posts by category and tags
      const tagIds = currentPost.tags.map(pt => pt.tag.id);

      const relatedPosts = await prisma.post.findMany({
        where: {
          isPublished: true,
          id: { not: currentPost.id },
          OR: [
            { categoryId: currentPost.categoryId },
            tagIds.length > 0 ? {
              tags: {
                some: {
                  tagId: { in: tagIds }
                }
              }
            } : {}
          ].filter(Boolean)
        },
        include: {
          author: {
            select: {
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
        take: limit,
        orderBy: {
          publishedAt: 'desc'
        }
      });

      const formattedRelatedPosts = relatedPosts.map(post => ({
        id: post.id.toString(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: {
          id: post.category.id.toString(),
          slug: post.category.slug,
          name: post.category.name,
          color: post.category.color,
          icon: post.category.icon
        },
        tags: post.tags.map(pt => pt.tag.name),
        author: post.author.name || post.author.email,
        publishedAt: post.publishedAt?.toISOString(),
        readingTime: post.readingTime,
        featuredImage: post.featuredImage
      }));

      return NextResponse.json(formattedRelatedPosts);
    }

    return NextResponse.json([]);

  } catch (error) {
    console.error('Error in blog search:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
