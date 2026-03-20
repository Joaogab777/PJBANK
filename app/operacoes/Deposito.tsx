'use client'

import { useState, useEffect } from 'react'

type Conta = {
  id: string
  numero: string
  saldo: number
  cliente: { nome: string }
}

export default function Deposito() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [form, setForm] = useState({ contaId: '', valor: '' })

  useEffect(() => {
    fetch('/api/contas')
      .then(res => res.json())
      .then(data => setContas(data))
  }, [])

  // conta selecionada no momento
  const contaSelecionada = contas.find(c => c.id === form.contaId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const res = await fetch('/api/operacoes/deposito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contaId: form.contaId,
          valor: Number(form.valor)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro)
        return
      }

      setSucesso(`Depósito de R$ ${Number(form.valor).toFixed(2)} realizado! Novo saldo: R$ ${data.novoSaldo.toFixed(2)}`)
      setForm({ contaId: '', valor: '' })

      // atualiza a lista de contas para refletir novo saldo
      const contasAtualizadas = await fetch('/api/contas').then(r => r.json())
      setContas(contasAtualizadas)

    } catch {
      setErro('Erro ao realizar depósito.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {erro && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-lg text-sm">
          ✅ {sucesso}
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Conta destino *</label>
        <select
          value={form.contaId}
          onChange={e => setForm({ ...form, contaId: e.target.value })}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="">Selecione uma conta</option>
          {contas.map(c => (
            <option key={c.id} value={c.id}>
              {c.cliente.nome} — {c.numero}
            </option>
          ))}
        </select>
      </div>

      {/* mostra saldo atual da conta selecionada */}
      {contaSelecionada && (
        <div className="bg-zinc-800 rounded-lg px-4 py-3 text-sm">
          <span className="text-zinc-400">Saldo atual: </span>
          <span className="text-emerald-400 font-medium">
            R$ {contaSelecionada.saldo.toFixed(2)}
          </span>
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Valor *</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="0,00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Processando...' : 'Realizar Depósito'}
      </button>

    </form>
  )
}