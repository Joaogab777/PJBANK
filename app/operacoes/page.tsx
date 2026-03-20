'use client'

import { useState } from 'react'
import Deposito from './Deposito'
import Saque from './Saque'
import Transferencia from './Transferencia'

const abas = [
  { id: 'deposito',      label: '💰 Depósito',      cor: 'emerald' },
  { id: 'saque',         label: '💸 Saque',          cor: 'red'     },
  { id: 'transferencia', label: '🔄 Transferência',  cor: 'blue'    },
] as const

type Aba = typeof abas[number]['id']

export default function OperacoesPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('deposito')

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Operações</h1>
        <p className="text-zinc-400 mt-1">Realize depósitos, saques e transferências</p>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-zinc-800 pb-0">
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors -mb-px border-b-2
              ${abaAtiva === aba.id
                ? `border-${aba.cor}-500 text-white bg-zinc-900`
                : 'border-transparent text-zinc-400 hover:text-white'
              }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg">
        {abaAtiva === 'deposito'      && <Deposito />}
        {abaAtiva === 'saque'         && <Saque />}
        {abaAtiva === 'transferencia' && <Transferencia />}
      </div>

    </div>
  )
}