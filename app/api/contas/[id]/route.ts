import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/contas/:id → busca uma conta específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const conta = await prisma.conta.findUnique({
    where: { id },
    include: {
      cliente: true,
      transacoesEnviadas: true,
      transacoesRecebidas: true
    }
  })

  if (!conta) {
    return Response.json(
      { erro: 'Conta não encontrada' },
      { status: 404 }
    )
  }

  return Response.json(conta)
}