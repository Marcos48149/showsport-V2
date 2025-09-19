"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShoppingCart from "@/components/ShoppingCart";
import { Button } from "@/components/ui/button";
import { useBlog, type BlogPost } from "@/contexts/BlogContext";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import {
  ArrowLeft,
  Clock,
  User,
  ChevronRight,
  Share2,
  BookOpen,
  Star,
  Calendar,
  Tag,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface BlogPostPageProps {
  categorySlug?: string;
  postSlug?: string;
}

export default function BlogPostPage({ categorySlug: propCategorySlug, postSlug: propPostSlug }: BlogPostPageProps) {
  const params = useParams();
  const { getPostBySlug, getRelatedPosts, getCategoryBySlug } = useBlog();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categorySlug = propCategorySlug || (params?.category as string);
  const postSlug = propPostSlug || (params?.slug as string);

  const category = getCategoryBySlug(categorySlug);

  useEffect(() => {
    const loadPost = async () => {
      if (!categorySlug || !postSlug) return;

      setIsLoading(true);
      try {
        const fetchedPost = await getPostBySlug(categorySlug, postSlug);
        setPost(fetchedPost);

        if (fetchedPost) {
          const related = await getRelatedPosts(fetchedPost.id, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [categorySlug, postSlug, getPostBySlug, getRelatedPosts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? `${post.title} - ${post.excerpt}` : '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareLink = '';
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Enlace copiado al portapapeles');
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post || !category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
            <p className="text-gray-600 mb-6">
              El artículo que buscas no existe o ha sido movido.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/blog">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Volver al Blog
                </Button>
              </Link>
              <Link href={`/blog/${categorySlug}`}>
                <Button variant="outline">
                  Ver {category?.name || 'Categoría'}
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-orange-500">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-orange-500">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/blog/${category.slug}`} className="hover:text-orange-500">
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>

          {/* Back Button */}
          <Link href={`/blog/${category.slug}`}>
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {category.name}
            </Button>
          </Link>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${category.color}`}>
                {category.icon} {category.name}
              </span>
              {post.schemaType && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {post.schemaType === 'HowTo' && '📋 Guía Paso a Paso'}
                  {post.schemaType === 'FAQ' && '❓ Preguntas Frecuentes'}
                  {post.schemaType === 'Review' && '⭐ Review Completo'}
                  {post.schemaType === 'Article' && '📰 Artículo'}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min de lectura</span>
              </div>
              {post.reviewRating && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{post.reviewRating.ratingValue}/5 ({post.reviewRating.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Mock content - in a real implementation, this would be rich content */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                {post.content || "Este es el contenido del artículo. En una implementación real, aquí estaría el contenido completo del post, incluyendo texto enriquecido, imágenes, listas, y otros elementos formativos."}
              </p>

              {/* FAQ Items if available */}
              {post.faqItems && post.faqItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 my-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
                  <div className="space-y-4">
                    {post.faqItems.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How-to Steps if available */}
              {post.howToSteps && post.howToSteps.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 my-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pasos a Seguir</h2>
                  <ol className="space-y-4">
                    {post.howToSteps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{step.name}</h3>
                          <p className="text-gray-700">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Related Products CTA */}
              {post.relatedProducts && post.relatedProducts.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-8">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    Productos Relacionados
                  </h3>
                  <p className="text-orange-800 mb-4">
                    Encuentra los productos mencionados en este artículo en nuestra tienda.
                  </p>
                  <Link href="/productos">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Ver Productos
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Etiquetas:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Compartir este artículo:</span>
              </div>

              <div className="relative">
                <Button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="text-green-600">📱</span> WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="text-blue-600">📘</span> Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="text-blue-400">🐦</span> Twitter
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span>🔗</span> Copiar enlace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Artículos Relacionados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <Link href={`/blog/${relatedPost.category.slug}/${relatedPost.slug}`}>
                      <div className="relative aspect-video bg-gray-200">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ${relatedPost.category.color}`}>
                          {relatedPost.category.name}
                        </span>
                      </div>

                      <Link href={`/blog/${relatedPost.category.slug}/${relatedPost.slug}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {relatedPost.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{relatedPost.readingTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href={`/blog/${category.slug}`}>
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                    Ver Más en {category.name}
                    <BookOpen className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Te Gustó Este Artículo?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Suscribite para recibir más contenido como este directo en tu email
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3">
                Suscribirme
              </Button>
            </div>

            <p className="text-sm text-orange-100 mt-4">
              Solo contenido de calidad. Cancelá cuando quieras.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ShoppingCart />
    </div>
  );
}
