import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'

export default async function ContasPage() {
  const contas = await prisma.conta.findMany({
    include: { cliente: true },
    orderBy: { criadoEm: 'desc' }
  })

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas</h1>
          <p className="text-zinc-400 mt-1">{contas.length} contas cadastradas</p>
        </div>
        <Link
          href="/contas/nova"
          className="bg-blue-500 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Nova Conta
        </Link>
      </div>

      {contas.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">Nenhuma conta cadastrada ainda.</p>
          <Link href="/contas/nova" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
            Criar primeira conta
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800">
              <tr className="text-zinc-400">
                <th className="text-left p-4">Número</th>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Saldo</th>
                <th className="text-left p-4">Limite</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-zinc-300">{conta.numero}</td>
                  <td className="p-4 font-medium">{conta.cliente.nome}</td>
                  <td className="p-4">
                    <span className={conta.saldo < 0 ? 'text-red-400' : 'text-emerald-400'}>
                      R$ {conta.saldo.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">
                    R$ {conta.limite.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${conta.ativa
                        ? 'bg-emerald-900 text-emerald-400'
                        : 'bg-red-900 text-red-400'
                      }`}>
                      {conta.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/operacoes?contaId=${conta.id}`}
                      className="text-purple-400 hover:underline text-xs"
                    >
                      Operar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}