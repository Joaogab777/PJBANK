import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// POST /api/operacoes/deposito
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { contaId, valor } = body

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

  // atualiza saldo e registra transação ao mesmo tempo
  // o $transaction garante que os dois acontecem juntos
  // se um falhar, o outro desfaz automaticamente
  const [contaAtualizada, transacao] = await prisma.$transaction([
    prisma.conta.update({
      where: { id: contaId },
      data: { saldo: { increment: valor } }
    }),
    prisma.transacao.create({
      data: {
        tipo: 'DEPOSITO',
        valor,
        descricao: `Depósito de R$ ${valor.toFixed(2)}`,
        contaDestinoId: contaId
      }
    })
  ])

  return Response.json({
    mensagem: 'Depósito realizado com sucesso',
    novoSaldo: contaAtualizada.saldo,
    transacao
  })
}