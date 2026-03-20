import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// POST /api/operacoes/transferencia
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { contaOrigemId, contaDestinoId, valor, usarLimite } = body

  if (!contaOrigemId || !contaDestinoId || !valor || valor <= 0) {
    return Response.json(
      { erro: 'contaOrigemId, contaDestinoId e valor são obrigatórios' },
      { status: 400 }
    )
  }

  if (contaOrigemId === contaDestinoId) {
    return Response.json(
      { erro: 'Conta de origem e destino não podem ser iguais' },
      { status: 400 }
    )
  }

  const [contaOrigem, contaDestino] = await Promise.all([
    prisma.conta.findUnique({ where: { id: contaOrigemId } }),
    prisma.conta.findUnique({ where: { id: contaDestinoId } })
  ])

  if (!contaOrigem) {
    return Response.json({ erro: 'Conta de origem não encontrada' }, { status: 404 })
  }

  if (!contaDestino) {
    return Response.json({ erro: 'Conta de destino não encontrada' }, { status: 404 })
  }

  if (!contaOrigem.ativa || !contaDestino.ativa) {
    return Response.json({ erro: 'Uma das contas está inativa' }, { status: 403 })
  }

  const saldoDisponivel = contaOrigem.saldo + (usarLimite ? contaOrigem.limite : 0)

  if (valor > contaOrigem.saldo && contaOrigem.limite > 0 && !usarLimite) {
    return Response.json(
      {
        erro: 'Saldo insuficiente',
        temLimite: true,
        limiteDisponivel: contaOrigem.limite,
        mensagem: 'Você possui limite disponível. Envie usarLimite: true para confirmar.'
      },
      { status: 422 }
    )
  }

  if (valor > saldoDisponivel) {
    return Response.json(
      { erro: 'Saldo insuficiente para transferência' },
      { status: 422 }
    )
  }

  // $transaction garante que o débito e crédito acontecem juntos
  const [origem, destino, transacao] = await prisma.$transaction([
    prisma.conta.update({
      where: { id: contaOrigemId },
      data: { saldo: { decrement: valor } }
    }),
    prisma.conta.update({
      where: { id: contaDestinoId },
      data: { saldo: { increment: valor } }
    }),
    prisma.transacao.create({
      data: {
        tipo: 'TRANSFERENCIA',
        valor,
        descricao: `Transferência de R$ ${valor.toFixed(2)}`,
        contaOrigemId,
        contaDestinoId
      }
    })
  ])

  return Response.json({
    mensagem: 'Transferência realizada com sucesso',
    saldoOrigem: origem.saldo,
    saldoDestino: destino.saldo,
    transacao
  })
}