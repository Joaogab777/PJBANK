import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'

// esse é um Server Component — busca dados direto no banco
// sem precisar de fetch, sem precisar de API
export default async function Home() {
  const [totalClientes, totalContas, totalTransacoes] = await Promise.all([
    prisma.cliente.count(),
    prisma.conta.count(),
    prisma.transacao.count(),
  ])

  const ultimasTransacoes = await prisma.transacao.findMany({
    take: 5,
    orderBy: { criadoEm: 'desc' },
    include: {
      contaOrigem: { include: { cliente: true } },
      contaDestino: { include: { cliente: true } },
    }
  })

  return (
    <div className="space-y-8">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Visão geral do sistema bancário</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Total de Clientes</p>
          <p className="text-4xl font-bold mt-2 text-emerald-400">{totalClientes}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Total de Contas</p>
          <p className="text-4xl font-bold mt-2 text-blue-400">{totalContas}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 text-sm">Total de Transações</p>
          <p className="text-4xl font-bold mt-2 text-purple-400">{totalTransacoes}</p>
        </div>
      </div>

      {/* Atalhos */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/clientes/novo" className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-xl p-5 transition-colors">
            <p className="text-emerald-400 text-lg">👤</p>
            <p className="font-medium mt-2">Novo Cliente</p>
            <p className="text-zinc-400 text-sm">Cadastrar um novo cliente</p>
          </Link>
          <Link href="/contas/nova" className="bg-zinc-900 border border-zinc-800 hover:border-blue-500 rounded-xl p-5 transition-colors">
            <p className="text-blue-400 text-lg">🏦</p>
            <p className="font-medium mt-2">Nova Conta</p>
            <p className="text-zinc-400 text-sm">Abrir uma conta bancária</p>
          </Link>
          <Link href="/operacoes" className="bg-zinc-900 border border-zinc-800 hover:border-purple-500 rounded-xl p-5 transition-colors">
            <p className="text-purple-400 text-lg">💸</p>
            <p className="font-medium mt-2">Operações</p>
            <p className="text-zinc-400 text-sm">Depósito, saque ou transferência</p>
          </Link>
        </div>
      </div>

      {/* Últimas transações */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Últimas transações</h2>
        {ultimasTransacoes.length === 0 ? (
          <p className="text-zinc-500 text-sm">Nenhuma transação ainda.</p>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-800">
                <tr className="text-zinc-400">
                  <th className="text-left p-4">Tipo</th>
                  <th className="text-left p-4">Valor</th>
                  <th className="text-left p-4">Descrição</th>
                  <th className="text-left p-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {ultimasTransacoes.map((t) => (
                  <tr key={t.id} className="border-b border-zinc-800 last:border-0">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${t.tipo === 'DEPOSITO' ? 'bg-emerald-900 text-emerald-400' : ''}
                        ${t.tipo === 'SAQUE' ? 'bg-red-900 text-red-400' : ''}
                        ${t.tipo === 'TRANSFERENCIA' ? 'bg-blue-900 text-blue-400' : ''}
                      `}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      R$ {t.valor.toFixed(2)}
                    </td>
                    <td className="p-4 text-zinc-400">{t.descricao}</td>
                    <td className="p-4 text-zinc-400">
                      {new Date(t.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}