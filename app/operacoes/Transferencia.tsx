'use client'

import { useState, useEffect } from 'react'

type Conta = {
  id: string
  numero: string
  saldo: number
  limite: number
  cliente: { nome: string }
}

export default function Transferencia() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [avisoLimite, setAvisoLimite] = useState<{ limiteDisponivel: number } | null>(null)
  const [form, setForm] = useState({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: ''
  })

  useEffect(() => {
    fetch('/api/contas')
      .then(res => res.json())
      .then(data => setContas(data))
  }, [])

  const contaOrigem = contas.find(c => c.id === form.contaOrigemId)

  // filtra a conta destino para não mostrar a mesma conta de origem
  const contasDestino = contas.filter(c => c.id !== form.contaOrigemId)

  async function realizarTransferencia(usarLimite: boolean) {
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const res = await fetch('/api/operacoes/transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contaOrigemId: form.contaOrigemId,
          contaDestinoId: form.contaDestinoId,
          valor: Number(form.valor),
          usarLimite
        })
      })

      const data = await res.json()

      if (res.status === 422 && data.temLimite) {
        setAvisoLimite({ limiteDisponivel: data.limiteDisponivel })
        setLoading(false)
        return
      }

      if (!res.ok) {
        setErro(data.erro)
        setLoading(false)
        return
      }

      setSucesso(`Transferência de R$ ${Number(form.valor).toFixed(2)} realizada com sucesso!`)
      setForm({ contaOrigemId: '', contaDestinoId: '', valor: '' })
      setAvisoLimite(null)

      const contasAtualizadas = await fetch('/api/contas').then(r => r.json())
      setContas(contasAtualizadas)

    } catch {
      setErro('Erro ao realizar transferência.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    realizarTransferencia(false)
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

      {avisoLimite && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm space-y-3">
          <p>⚠️ Saldo insuficiente. Limite disponível: <strong>R$ {avisoLimite.limiteDisponivel.toFixed(2)}</strong></p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => realizarTransferencia(true)}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Sim, usar limite
            </button>
            <button
              type="button"
              onClick={() => setAvisoLimite(null)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-4 py-1.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Conta origem *</label>
        <select
          value={form.contaOrigemId}
          onChange={e => setForm({ ...form, contaOrigemId: e.target.value, contaDestinoId: '' })}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Selecione a conta de origem</option>
          {contas.map(c => (
            <option key={c.id} value={c.id}>
              {c.cliente.nome} — {c.numero}
            </option>
          ))}
        </select>
      </div>

      {contaOrigem && (
        <div className="bg-zinc-800 rounded-lg px-4 py-3 text-sm flex gap-6">
          <div>
            <span className="text-zinc-400">Saldo: </span>
            <span className={contaOrigem.saldo < 0 ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
              R$ {contaOrigem.saldo.toFixed(2)}
            </span>
          </div>
          {contaOrigem.limite > 0 && (
            <div>
              <span className="text-zinc-400">Limite: </span>
              <span className="text-yellow-400 font-medium">
                R$ {contaOrigem.limite.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Conta destino *</label>
        <select
          value={form.contaDestinoId}
          onChange={e => setForm({ ...form, contaDestinoId: e.target.value })}
          required
          disabled={!form.contaOrigemId}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
        >
          <option value="">Selecione a conta de destino</option>
          {contasDestino.map(c => (
            <option key={c.id} value={c.id}>
              {c.cliente.nome} — {c.numero}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Valor *</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="0,00"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !!avisoLimite}
        className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Processando...' : 'Realizar Transferência'}
      </button>

    </form>
  )
}