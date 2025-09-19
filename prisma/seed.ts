import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@showsport.com' },
    update: {},
    create: {
      email: 'admin@showsport.com',
      name: 'Admin ShowSport',
      role: 'admin',
      password: adminPassword,
    },
  });

  console.log('👤 Admin user created:', adminUser.email);

  // Create categories
  const categories = [
    {
      slug: 'guias-compra',
      name: 'Guías de Compra',
      description: 'Todo lo que necesitás saber para comprar zapatillas perfectas',
      metaTitle: 'Guías de Compra | ShowSport',
      metaDescription: 'Guías completas para comprar zapatillas deportivas.',
      color: 'bg-blue-500',
      icon: '🛍️',
      sortOrder: 1
    },
    {
      slug: 'devoluciones-cambios',
      name: 'Devoluciones y Cambios',
      description: 'Proceso fácil y rápido para cambios y devoluciones',
      metaTitle: 'Devoluciones | ShowSport',
      metaDescription: 'Aprende cómo hacer cambios y devoluciones.',
      color: 'bg-green-500',
      icon: '🔄',
      sortOrder: 2
    },
    {
      slug: 'guia-talles',
      name: 'Guía de Talles',
      description: 'Encuentra tu talle perfecto con nuestras guías detalladas',
      metaTitle: 'Guía de Talles | ShowSport',
      metaDescription: 'Guías completas de talles para todas las marcas.',
      color: 'bg-purple-500',
      icon: '📏',
      sortOrder: 3
    },
    {
      slug: 'reviews-productos',
      name: 'Reviews de Productos',
      description: 'Análisis detallados y honestos de las mejores zapatillas',
      metaTitle: 'Reviews | ShowSport',
      metaDescription: 'Reviews honestos y detallados de zapatillas.',
      color: 'bg-orange-500',
      icon: '⭐',
      sortOrder: 4
    },
    {
      slug: 'promociones',
      name: 'Promociones y Novedades',
      description: 'Las mejores ofertas y lanzamientos del mundo deportivo',
      metaTitle: 'Promociones | ShowSport',
      metaDescription: 'Descubre las mejores promociones.',
      color: 'bg-red-500',
      icon: '🎉',
      sortOrder: 5
    },
    {
      slug: 'tendencias',
      name: 'Consejos y Tendencias',
      description: 'Últimas tendencias y consejos del mundo deportivo',
      metaTitle: 'Tendencias | ShowSport',
      metaDescription: 'Últimas tendencias en moda deportiva.',
      color: 'bg-pink-500',
      icon: '👟',
      sortOrder: 6
    },
    {
      slug: 'faq',
      name: 'Preguntas Frecuentes',
      description: 'Respuestas a las preguntas más comunes',
      metaTitle: 'FAQ | ShowSport',
      metaDescription: 'Encuentra respuestas rápidas.',
      color: 'bg-gray-500',
      icon: '❓',
      sortOrder: 7
    }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    createdCategories.push(category);
    console.log('📁 Category created:', category.name);
  }

  // Create tags
  const tags = [
    'running', 'basketball', 'lifestyle', 'nike', 'adidas', 'jordan',
    'principiantes', 'profesional', 'outdoor', 'indoor', 'mujer', 'hombre',
    'ofertas', 'descuentos', 'tendencias', 'guias', 'reviews'
  ];

  const createdTags = [];
  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
        color: 'bg-blue-500'
      },
    });
    createdTags.push(tag);
  }

  console.log('🏷️ Tags created:', createdTags.length);

  // Create sample posts
  const posts = [
    {
      slug: 'zapatillas-running-principiantes',
      title: 'Cómo Elegir Zapatillas de Running para Principiantes',
      excerpt: 'Guía completa para elegir tus primeras zapatillas de running. Aprende sobre tipos de pisada, amortiguación y las mejores marcas para comenzar.',
      content: `
# Cómo Elegir Zapatillas de Running para Principiantes

Si estás empezando en el mundo del running, elegir las zapatillas correctas es fundamental para evitar lesiones y disfrutar de cada carrera.

## Factores Clave a Considerar

### 1. Tipo de Pisada
- **Pronación**: El pie rota hacia adentro al tocar el suelo
- **Supinación**: El pie rota hacia afuera
- **Neutra**: Aterrizaje equilibrado

### 2. Superficie de Carrera
- **Asfalto**: Necesitas máxima amortiguación
- **Trail**: Requiere mayor agarre y protección
- **Cinta**: Menor amortiguación necesaria

### 3. Distancia y Frecuencia
- **Principiante**: 2-3 veces por semana, 3-5km
- **Intermedio**: 4-5 veces por semana, 5-10km
- **Avanzado**: Entrenamientos diarios, 10km+

## Recomendaciones por Marca

### Nike
- **Air Zoom Pegasus**: Versatil para principiantes
- **React Infinity**: Máxima amortiguación

### Adidas
- **Ultraboost**: Comodidad excepcional
- **Solar Boost**: Relación precio-calidad

### Asics
- **Gel-Nimbus**: Para corredores pesados
- **Gel-Cumulus**: Polivalente

## Consejos Finales

1. **Pruébate las zapatillas por la tarde** cuando el pie está más hinchado
2. **Deja un centímetro de espacio** entre el dedo más largo y la punta
3. **Reemplaza las zapatillas cada 500-800km**
4. **Considera tener dos pares** para alternar

¿Listo para empezar tu aventura en el running? ¡Elegí las zapatillas perfectas y salí a correr!
      `,
      categoryId: createdCategories[0].id, // Guías de Compra
      authorId: adminUser.id,
      isPublished: true,
      readingTime: 8,
      schemaType: 'HowTo',
      featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop',
      metaTitle: 'Zapatillas Running para Principiantes 2024 | Guía Completa',
      metaDescription: 'Aprende a elegir tus primeras zapatillas de running. Guía completa con tipos de pisada, marcas recomendadas y consejos expertos.',
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      howToSteps: [
        {
          name: 'Analiza tu tipo de pisada',
          text: 'Visita una tienda especializada para analizar cómo apoyas el pie al correr.'
        },
        {
          name: 'Define tu presupuesto',
          text: 'Las zapatillas de calidad rondan entre $80.000 y $150.000 pesos.'
        },
        {
          name: 'Prueba diferentes marcas',
          text: 'Cada marca tiene un calce diferente. Prueba Nike, Adidas, Asics y New Balance.'
        },
        {
          name: 'Camina y trota en la tienda',
          text: 'No te limites a estar parado. Muévete y siente cómo responde la zapatilla.'
        }
      ]
    },
    {
      slug: 'como-cambiar-zapatillas-automatico',
      title: 'Sistema Automático de Cambios: Cómo Funciona',
      excerpt: 'Descubre nuestro revolucionario sistema automático de cambios y devoluciones. Rápido, fácil y sin complicaciones.',
      content: `
# Sistema Automático de Cambios ShowSport

En ShowSport hemos revolucionado la experiencia de compra online con nuestro sistema automático de cambios y devoluciones.

## ¿Cómo Funciona?

### Proceso Automatizado
1. **Solicita el cambio** desde tu cuenta
2. **Recibe el código QR** al instante
3. **Imprime la etiqueta** de envío gratuito
4. **Despacha desde tu casa** o punto de retiro

### Beneficios del Sistema
- ✅ **Aprobación instantánea** en el 95% de los casos
- ✅ **Cupón automático** generado al momento
- ✅ **Sin esperas** ni llamadas telefónicas
- ✅ **Seguimiento en tiempo real**

## Tipos de Cambio Disponibles

### Por Talle
- Cambio directo sin costo adicional
- Misma marca y modelo
- Stock disponible

### Por Modelo
- Diferencia de precio se ajusta automáticamente
- Cupón por diferencia a favor
- Amplio catálogo disponible

### Devolución Completa
- Reintegro del 100% del dinero
- Cupón con 12 meses de validez
- Uso en toda la tienda online

## Política de Cambios

- **30 días** desde la compra
- **Producto sin uso** en empaque original
- **Etiquetas intactas** y en perfecto estado
- **Comprobante de compra** requerido

¿Necesitas hacer un cambio? ¡Es súper fácil con nuestro sistema automático!
      `,
      categoryId: createdCategories[1].id, // Devoluciones y Cambios
      authorId: adminUser.id,
      isPublished: true,
      readingTime: 5,
      schemaType: 'HowTo',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f9bd2f?w=800&h=400&fit=crop',
      metaTitle: 'Sistema Automático de Cambios | ShowSport',
      metaDescription: 'Descubre cómo funciona nuestro sistema automático de cambios. Rápido, fácil y sin complicaciones. Cambios en 24hs.',
      publishedAt: new Date('2024-01-20T10:00:00Z')
    },
    {
      slug: 'jordan-vs-nike-basketball-comparativa',
      title: 'Jordan vs Nike Basketball: Comparativa Completa 2024',
      excerpt: 'Análisis detallado entre Jordan y Nike Basketball. Performance, estilo, durabilidad y precio en la comparativa más completa.',
      content: `
# Jordan vs Nike Basketball: La Comparativa Definitiva

En el mundo del basketball, dos gigantes dominan las canchas: Jordan Brand y Nike Basketball. Ambas ofrecen zapatillas excepcionales, pero ¿cuál es mejor?

## Historia y Legado

### Jordan Brand
- **Fundada**: 1984 como división de Nike
- **Ícono**: Michael Jordan
- **Filosofía**: "Greatness is earned"

### Nike Basketball
- **Fundada**: 1971
- **Ícono**: Múltiples atletas (LeBron, Kobe, KD)
- **Filosofía**: "Just Do It"

## Comparativa Técnica

### Performance
| Aspecto | Jordan | Nike Basketball |
|---------|---------|-----------------|
| Amortiguación | Air Jordan (excelente) | Zoom Air/React (superior) |
| Soporte | Tradicional y efectivo | Tecnología avanzada |
| Durabilidad | Alta | Muy alta |
| Tracción | Buena | Excelente |

### Estilo y Diseño
- **Jordan**: Diseños icónicos y atemporales
- **Nike**: Innovación constante y colores llamativos

## Modelos Estrella 2024

### Jordan
1. **Air Jordan 38**: $180.000 - Performance premium
2. **Jordan Luka 2**: $145.000 - Versatilidad total
3. **Air Jordan 1**: $120.000 - Clásico atemporal

### Nike Basketball
1. **LeBron 21**: $190.000 - Máximo rendimiento
2. **KD 16**: $160.000 - Ligereza extrema
3. **Giannis Freak 5**: $130.000 - Explosividad

## Veredicto Final

### Elige Jordan si:
- ✅ Valoras el legado y la historia
- ✅ Prefieres diseños clásicos
- ✅ Buscas exclusividad

### Elige Nike Basketball si:
- ✅ Priorizas la tecnología más avanzada
- ✅ Quieres la máxima performance
- ✅ Te gustan las innovaciones constantes

**Ganador**: Empate técnico. La elección depende de tus preferencias personales y estilo de juego.

¿Con cuál te quedas? ¡La cancha está esperando!
      `,
      categoryId: createdCategories[3].id, // Reviews
      authorId: adminUser.id,
      isPublished: true,
      readingTime: 12,
      schemaType: 'Review',
      featuredImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=400&fit=crop',
      metaTitle: 'Jordan vs Nike Basketball 2024 | Comparativa Completa',
      metaDescription: 'Comparativa completa entre Jordan y Nike Basketball. Performance, precio, durabilidad y estilo. Descubre cuál es mejor para ti.',
      publishedAt: new Date('2024-01-25T10:00:00Z'),
      reviewRating: {
        ratingValue: 4.5,
        bestRating: 5,
        worstRating: 1,
        reviewCount: 127
      }
    }
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });

    // Add tags to posts
    const postTags = postData.slug.includes('running') ? ['running', 'principiantes', 'guias'] :
                     postData.slug.includes('cambios') ? ['devoluciones', 'guias'] :
                     ['basketball', 'jordan', 'nike', 'reviews'];

    for (const tagName of postTags) {
      const tag = createdTags.find(t => t.name === tagName);
      if (tag) {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    console.log('📝 Post created:', post.title);
  }

  console.log('✅ Database seed completed successfully!');
  console.log(`
🎯 Next steps:
1. Run: bun run dev
2. Visit: /admin (login with admin@showsport.com / admin123)
3. Visit: /blog (see your new blog in action)

📊 Created:
- 1 admin user
- ${createdCategories.length} categories
- ${createdTags.length} tags
- ${posts.length} sample posts
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
