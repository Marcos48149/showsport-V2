// src/app/api/blog/categories/[id]/route.ts

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  // Acá poné tu lógica, por ejemplo buscar categoría en la DB
  // Ejemplo de respuesta de prueba:
  return Response.json({
    success: true,
    categoryId: id,
    message: `Obteniendo categoría con id ${id}`
  })
}
