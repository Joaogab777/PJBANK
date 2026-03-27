/**
 * Script de teste para verificar conexão com o banco
 */

import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient()
  
  console.log(`\n🔍 Testando conexão com o banco de dados...`)
  console.log(`   DB_PROVIDER: ${process.env.DB_PROVIDER || 'postgresql'}\n`)
  
  try {
    // Teste 1: Verificar conexão
    console.log('1️⃣  Testando conexão...')
    await prisma.$connect()
    console.log('   ✅ Conexão estabelecida com sucesso!')
    
    // Teste 2: Criar cliente de teste
    console.log('\n2️⃣  Testando criação de cliente...')
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Teste DB',
        cpf: `12345678900${Date.now()}`.slice(-11),
        email: `teste${Date.now()}@teste.com`,
        telefone: '11999999999'
      }
    })
    console.log(`   ✅ Cliente criado: ${cliente.id}`)
    
    // Teste 3: Criar conta para o cliente
    console.log('\n3️⃣  Testando criação de conta...')
    const conta = await prisma.conta.create({
      data: {
        numero: `TESTE${Date.now()}`.slice(-10),
        saldo: 1000,
        clienteId: cliente.id
      }
    })
    console.log(`   ✅ Conta criada: ${conta.id}`)
    
    // Teste 4: Criar transação (depósito)
    console.log('\n4️⃣  Testando transação...')
    const tipoTransacao = process.env.DB_PROVIDER === 'sqlite' ? 'DEPOSITO' : 'DEPOSITO'
    const transacao = await prisma.transacao.create({
      data: {
        tipo: tipoTransacao,
        valor: 500,
        descricao: 'Teste de transação',
        contaDestinoId: conta.id
      }
    })
    console.log(`   ✅ Transação criada: ${transacao.id}`)
    
    // Teste 5: Verificar saldo atualizado
    console.log('\n5️⃣  Verificando saldo...')
    const contaAtualizada = await prisma.conta.findUnique({
      where: { id: conta.id }
    })
    console.log(`   ✅ Saldo da conta: R$ ${contaAtualizada.saldo}`)
    
    // Teste 6: Buscar cliente com contas
    console.log('\n6️⃣  Buscando cliente com contas...')
    const clienteCompleto = await prisma.cliente.findUnique({
      where: { id: cliente.id },
      include: { contas: true }
    })
    console.log(`   ✅ Cliente: ${clienteCompleto.nome}`)
    console.log(`   ✅ Número de contas: ${clienteCompleto.contas.length}`)
    
    // Limpar dados de teste
    console.log('\n🧹 Limpando dados de teste...')
    await prisma.transacao.delete({ where: { id: transacao.id } })
    await prisma.conta.delete({ where: { id: conta.id } })
    await prisma.cliente.delete({ where: { id: cliente.id } })
    console.log('   ✅ Dados removidos com sucesso!')
    
    console.log('\n✅ Todos os testes passaram!')
    
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
