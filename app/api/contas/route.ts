import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/contas → lista todas as contas
export async function GET() {
  const contas = await prisma.conta.findMany({
    include: {
      cliente: true // traz os dados do dono da conta
    }
  })

  return Response.json(contas)
}

// POST /api/contas → cria uma nova conta
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { clienteId, depositoInicial, limite } = body

  // valida se o cliente existe
  if (!clienteId) {
    return Response.json(
      { erro: 'clienteId é obrigatório' },
      { status: 400 }
    )
  }

  const clienteExiste = await prisma.cliente.findUnique({
    where: { id: clienteId }
  })

  if (!clienteExiste) {
    return Response.json(
      { erro: 'Cliente não encontrado' },
      { status: 404 }
    )
  }

  // cria a conta — depósito inicial e limite são opcionais
  const conta = await prisma.conta.create({
    data: {
      clienteId,
      saldo: depositoInicial ?? 0,
      limite: limite ?? 0
    }
  })

  // se veio depósito inicial, registra como transação
  if (depositoInicial && depositoInicial > 0) {
    await prisma.transacao.create({
      data: {
        tipo: 'DEPOSITO',
        valor: depositoInicial,
        descricao: 'Depósito inicial na abertura da conta',
        contaDestinoId: conta.id
      }
    })
  }

  return Response.json(conta, { status: 201 })
}