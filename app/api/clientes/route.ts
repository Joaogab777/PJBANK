import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'

// GET /api/clientes → lista todos os clientes
export async function GET() {
  const clientes = await prisma.cliente.findMany({
    include: {
      contas: true // traz as contas junto
    }
  })

  return Response.json(clientes)
}

// POST /api/clientes → cadastra um novo cliente
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nome, cpf, email, telefone } = body

  // validação básica
  if (!nome || !cpf || !email) {
    return Response.json(
      { erro: 'Nome, CPF e email são obrigatórios' },
      { status: 400 }
    )
  }

  // verifica se CPF já existe
  const clienteExistente = await prisma.cliente.findUnique({
    where: { cpf }
  })

  if (clienteExistente) {
    return Response.json(
      { erro: 'CPF já cadastrado' },
      { status: 409 }
    )
  }

  const cliente = await prisma.cliente.create({
    data: { nome, cpf, email, telefone }
  })

  return Response.json(cliente, { status: 201 })
}