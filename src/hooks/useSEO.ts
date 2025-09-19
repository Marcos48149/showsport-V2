"use client";

import { useEffect } from 'react';
import type { BlogPost, BlogCategory } from '@/contexts/BlogContext';

interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  structuredData?: any;
}

interface BlogPostSEO {
  post: BlogPost;
  category: BlogCategory;
}

interface BlogCategorySEO {
  category: BlogCategory;
  postsCount: number;
}

const SITE_CONFIG = {
  siteName: 'ShowSport',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://showsport.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@ShowSport',
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
};

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Update page title
    if (config.title) {
      document.title = config.title;
    }

    // Update meta tags
    updateMetaTag('description', config.description);
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateMetaTag('og:title', config.title, 'property');
    updateMetaTag('og:description', config.description, 'property');
    updateMetaTag('og:image', config.image, 'property');
    updateMetaTag('og:url', config.url, 'property');
    updateMetaTag('og:type', config.type || 'website', 'property');
    updateMetaTag('og:site_name', SITE_CONFIG.siteName, 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:site', SITE_CONFIG.twitterHandle, 'name');
    updateMetaTag('twitter:title', config.title, 'name');
    updateMetaTag('twitter:description', config.description, 'name');
    updateMetaTag('twitter:image', config.image, 'name');

    // Article specific tags
    if (config.type === 'article') {
      updateMetaTag('article:published_time', config.publishedTime, 'property');
      updateMetaTag('article:modified_time', config.modifiedTime, 'property');
      updateMetaTag('article:author', config.author, 'property');

      // Article tags
      if (config.tags) {
        // Remove existing article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());

        // Add new tags
        config.tags.forEach(tag => {
          updateMetaTag('article:tag', tag, 'property');
        });
      }
    }

    // Add structured data
    if (config.structuredData) {
      updateStructuredData(config.structuredData);
    }

    // Canonical URL
    updateLinkTag('canonical', config.url);

  }, [config]);
}

// Hook for blog post SEO
export function useBlogPostSEO({ post, category }: BlogPostSEO) {
  const config: SEOConfig = {
    title: post.metaTitle || `${post.title} | ${category.name} | ${SITE_CONFIG.siteName}`,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage,
    url: `${SITE_CONFIG.siteUrl}/blog/${category.slug}/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author,
    tags: post.tags,
    structuredData: generatePostStructuredData(post, category)
  };

  useSEO(config);
}

// Hook for blog category SEO
export function useBlogCategorySEO({ category, postsCount }: BlogCategorySEO) {
  const config: SEOConfig = {
    title: category.metaTitle || `${category.name} | Blog ${SITE_CONFIG.siteName}`,
    description: category.metaDescription || `${category.description} Descubre ${postsCount} artículos sobre ${category.name.toLowerCase()}.`,
    image: category.featuredImage || SITE_CONFIG.defaultImage,
    url: `${SITE_CONFIG.siteUrl}/blog/${category.slug}`,
    type: 'blog',
    structuredData: generateCategoryStructuredData(category, postsCount)
  };

  useSEO(config);
}

// Hook for blog hub SEO
export function useBlogHubSEO(categoriesCount: number, postsCount: number) {
  const config: SEOConfig = {
    title: `Blog ${SITE_CONFIG.siteName} | Guías y Consejos sobre Zapatillas Deportivas`,
    description: `Descubre ${postsCount} artículos en ${categoriesCount} categorías especializadas. Guías de compra, reviews, consejos de talles y las últimas tendencias en calzado deportivo.`,
    image: SITE_CONFIG.defaultImage,
    url: `${SITE_CONFIG.siteUrl}/blog`,
    type: 'blog',
    structuredData: generateBlogHubStructuredData(categoriesCount, postsCount)
  };

  useSEO(config);
}

// Utility functions
function updateMetaTag(name: string, content?: string, attribute: 'name' | 'property' = 'name') {
  if (!content) return;

  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (meta) {
    meta.content = content;
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.content = content;
    document.head.appendChild(meta);
  }
}

function updateLinkTag(rel: string, href?: string) {
  if (!href) return;

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (link) {
    link.href = href;
  } else {
    link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}

function updateStructuredData(data: any) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Structured data generators
function generatePostStructuredData(post: BlogPost, category: BlogCategory) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "url": `${SITE_CONFIG.siteUrl}/blog/${category.slug}/${post.slug}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.siteUrl}/blog/${category.slug}/${post.slug}`
    },
    "keywords": post.tags.join(', '),
    "articleSection": category.name,
    "wordCount": post.content?.length || 1000,
    "timeRequired": `PT${post.readingTime}M`
  };

  // Add specific schema based on post type
  if (post.schemaType === 'HowTo' && post.howToSteps) {
    return {
      ...baseData,
      "@type": "HowTo",
      "name": post.title,
      "description": post.excerpt,
      "totalTime": `PT${post.readingTime}M`,
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "step": post.howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        "name": step.name,
        "text": step.text,
        "position": index + 1
      }))
    };
  }

  if (post.schemaType === 'FAQ' && post.faqItems) {
    return {
      ...baseData,
      "@type": "FAQPage",
      "mainEntity": post.faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  if (post.schemaType === 'Review' && post.reviewRating) {
    return {
      ...baseData,
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": post.reviewRating.ratingValue,
        "bestRating": post.reviewRating.bestRating,
        "worstRating": post.reviewRating.worstRating
      },
      "itemReviewed": {
        "@type": "Product",
        "name": post.title
      }
    };
  }

  return baseData;
}

function generateCategoryStructuredData(category: BlogCategory, postsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": `${SITE_CONFIG.siteUrl}/blog/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": postsCount,
      "itemListElement": Array.from({ length: Math.min(postsCount, 10) }).map((_, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_CONFIG.siteUrl}/blog/${category.slug}/post-${index + 1}`
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": SITE_CONFIG.siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${SITE_CONFIG.siteUrl}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category.name,
          "item": `${SITE_CONFIG.siteUrl}/blog/${category.slug}`
        }
      ]
    }
  };
}

function generateBlogHubStructuredData(categoriesCount: number, postsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `Blog ${SITE_CONFIG.siteName}`,
    "description": `Blog especializado en zapatillas deportivas con ${postsCount} artículos en ${categoriesCount} categorías.`,
    "url": `${SITE_CONFIG.siteUrl}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.siteUrl}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_CONFIG.siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

// Export utility function for generating breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
