import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    include: { contas: true },
    orderBy: { criadoEm: 'desc' }
  })

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-zinc-400 mt-1">{clientes.length} clientes cadastrados</p>
        </div>
        <Link
          href="/clientes/novo"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Novo Cliente
        </Link>
      </div>

      {/* Lista */}
      {clientes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">Nenhum cliente cadastrado ainda.</p>
          <Link href="/clientes/novo" className="text-emerald-400 hover:underline text-sm mt-2 inline-block">
            Cadastrar primeiro cliente
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800">
              <tr className="text-zinc-400">
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">CPF</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Contas</th>
                <th className="text-left p-4">Cadastrado em</th>
                <th className="text-left p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium">{cliente.nome}</td>
                  <td className="p-4 text-zinc-400">{cliente.cpf}</td>
                  <td className="p-4 text-zinc-400">{cliente.email}</td>
                  <td className="p-4">
                    <span className="bg-zinc-800 px-2 py-1 rounded-full text-xs">
                      {cliente.contas.length} conta(s)
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">
                    {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/contas/nova?clienteId=${cliente.id}`}
                      className="text-blue-400 hover:underline text-xs"
                    >
                      Abrir conta
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