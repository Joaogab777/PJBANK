import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/contas/:id/saldo → consulta saldo de uma conta
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const conta = await prisma.conta.findUnique({
    where: { id },
    select: {
      id: true,
      numero: true,
      saldo: true,
      limite: true,
      // saldo disponível = saldo atual + limite
      cliente: {
        select: { nome: true }
      }
    }
  })

  if (!conta) {
    return Response.json(
      { erro: 'Conta não encontrada' },
      { status: 404 }
    )
  }

  return Response.json({
    ...conta,
    saldoDisponivel: conta.saldo + conta.limite
  })
}