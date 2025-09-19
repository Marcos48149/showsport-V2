import { NextResponse } from 'next/server';

// Mock data - in production, this would fetch from your database/CMS
const categories = [
  'guias-compra',
  'devoluciones-cambios',
  'guia-talles',
  'reviews-productos',
  'promociones',
  'tendencias',
  'faq'
];

const posts = [
  { category: 'guias-compra', slug: 'zapatillas-running-principiantes', lastmod: '2024-02-15' },
  { category: 'guias-compra', slug: 'zapatillas-basketball-interior', lastmod: '2024-02-14' },
  { category: 'guias-compra', slug: 'como-pagar-cuotas-sin-interes', lastmod: '2024-02-13' },
  { category: 'guias-compra', slug: 'zapatillas-running-avanzados', lastmod: '2024-02-12' },
  { category: 'guias-compra', slug: 'que-zapatillas-comprar-segun-deporte', lastmod: '2024-02-11' },
  { category: 'devoluciones-cambios', slug: 'como-cambiar-zapatillas', lastmod: '2024-02-10' },
  { category: 'devoluciones-cambios', slug: 'politica-cambios', lastmod: '2024-02-09' },
  { category: 'devoluciones-cambios', slug: 'envio-gratuito', lastmod: '2024-02-08' },
  { category: 'guia-talles', slug: 'conversion-talles', lastmod: '2024-02-07' },
  { category: 'guia-talles', slug: 'medir-pie', lastmod: '2024-02-06' },
  { category: 'guia-talles', slug: 'talle-nike-running', lastmod: '2024-02-05' },
  { category: 'guia-talles', slug: 'talle-adidas-basketball', lastmod: '2024-02-04' },
  { category: 'guia-talles', slug: 'talles-por-marca', lastmod: '2024-02-03' },
  { category: 'reviews-productos', slug: 'jordan-vs-nike', lastmod: '2024-02-02' },
  { category: 'reviews-productos', slug: 'adidas-ultraboost-review', lastmod: '2024-02-01' },
  { category: 'reviews-productos', slug: 'nike-air-max-270-review', lastmod: '2024-01-31' },
  { category: 'promociones', slug: 'mejores-ofertas-enero-2024', lastmod: '2024-01-30' },
  { category: 'promociones', slug: 'lanzamientos-febrero-2024', lastmod: '2024-01-29' },
  { category: 'tendencias', slug: 'tendencias-moda-deportiva-2024', lastmod: '2024-01-28' },
  { category: 'faq', slug: 'preguntas-frecuentes-envios', lastmod: '2024-01-27' },
  { category: 'faq', slug: 'preguntas-frecuentes-pagos', lastmod: '2024-01-26' }
];

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://showsport.com';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog Hub -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Product Categories -->
  <url>
    <loc>${baseUrl}/categoria/running</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/categoria/basketball</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/categoria/lifestyle</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- All Products Page -->
  <url>
    <loc>${baseUrl}/productos</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Returns Page -->
  <url>
    <loc>${baseUrl}/devoluciones</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog Categories -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/blog/${category}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Blog Posts -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.category}/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <news:news>
      <news:publication>
        <news:name>ShowSport Blog</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${post.lastmod}</news:publication_date>
      <news:title>ShowSport - ${post.slug.replace(/-/g, ' ')}</news:title>
    </news:news>
  </url>`).join('')}

  <!-- Product Pages -->
  <url>
    <loc>${baseUrl}/producto/1</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/producto/2</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/producto/3</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/producto/4</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/producto/5</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/producto/6</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/cuenta</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  });
}
