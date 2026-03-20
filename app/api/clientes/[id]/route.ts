import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/clientes/:id → busca um cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { contas: true }
  })

  if (!cliente) {
    return Response.json(
      { erro: 'Cliente não encontrado' },
      { status: 404 }
    )
  }

  return Response.json(cliente)
}

// DELETE /api/clientes/:id → remove um cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.cliente.delete({
    where: { id }
  })

  return Response.json({ mensagem: 'Cliente removido com sucesso' })
}
