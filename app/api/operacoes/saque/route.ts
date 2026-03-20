import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// POST /api/operacoes/saque
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { contaId, valor, usarLimite } = body

  if (!contaId || !valor || valor <= 0) {
    return Response.json(
      { erro: 'contaId e valor positivo são obrigatórios' },
      { status: 400 }
    )
  }

  const conta = await prisma.conta.findUnique({
    where: { id: contaId }
  })

  if (!conta) {
    return Response.json(
      { erro: 'Conta não encontrada' },
      { status: 404 }
    )
  }

  if (!conta.ativa) {
    return Response.json(
      { erro: 'Conta inativa' },
      { status: 403 }
    )
  }

  // regra: não permite saque com saldo zero sem limite
  if (conta.saldo === 0 && conta.limite === 0) {
    return Response.json(
      { erro: 'Saldo insuficiente' },
      { status: 422 }
    )
  }

  const saldoDisponivel = conta.saldo + (usarLimite ? conta.limite : 0)

  // regra: se tem limite mas usarLimite não veio, avisa o cliente
  if (valor > conta.saldo && conta.limite > 0 && !usarLimite) {
    return Response.json(
      {
        erro: 'Saldo insuficiente',
        temLimite: true,
        limiteDisponivel: conta.limite,
        mensagem: 'Você possui limite disponível. Envie usarLimite: true para confirmar.'
      },
      { status: 422 }
    )
  }

  if (valor > saldoDisponivel) {
    return Response.json(
      { erro: 'Valor excede o saldo e limite disponíveis' },
      { status: 422 }
    )
  }

  const [contaAtualizada, transacao] = await prisma.$transaction([
    prisma.conta.update({
      where: { id: contaId },
      data: { saldo: { decrement: valor } }
    }),
    prisma.transacao.create({
      data: {
        tipo: 'SAQUE',
        valor,
        descricao: `Saque de R$ ${valor.toFixed(2)}`,
        contaOrigemId: contaId
      }
    })
  ])

  return Response.json({
    mensagem: 'Saque realizado com sucesso',
    novoSaldo: contaAtualizada.saldo,
    transacao
  })
}