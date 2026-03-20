'use client'

import { useState, useEffect } from 'react'

type Conta = {
  id: string
  numero: string
  saldo: number
  limite: number
  cliente: { nome: string }
}

export default function Saque() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [avisoLimite, setAvisoLimite] = useState<{ limiteDisponivel: number } | null>(null)
  const [form, setForm] = useState({ contaId: '', valor: '' })

  useEffect(() => {
    fetch('/api/contas')
      .then(res => res.json())
      .then(data => setContas(data))
  }, [])

  const contaSelecionada = contas.find(c => c.id === form.contaId)

  async function realizarSaque(usarLimite: boolean) {
    setErro('')
    setSucesso('')
    setLoading(true)

    try {
      const res = await fetch('/api/operacoes/saque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contaId: form.contaId,
          valor: Number(form.valor),
          usarLimite
        })
      })

      const data = await res.json()

      // API avisou que tem limite disponível — pergunta ao usuário
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

      setSucesso(`Saque de R$ ${Number(form.valor).toFixed(2)} realizado! Novo saldo: R$ ${data.novoSaldo.toFixed(2)}`)
      setForm({ contaId: '', valor: '' })
      setAvisoLimite(null)

      const contasAtualizadas = await fetch('/api/contas').then(r => r.json())
      setContas(contasAtualizadas)

    } catch {
      setErro('Erro ao realizar saque.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    realizarSaque(false)
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

      {/* aviso de limite — aparece só quando a API retorna temLimite: true */}
      {avisoLimite && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-sm space-y-3">
          <p>⚠️ Saldo insuficiente. Você possui <strong>R$ {avisoLimite.limiteDisponivel.toFixed(2)}</strong> de limite disponível.</p>
          <p>Deseja usar o limite para completar o saque?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => realizarSaque(true)}
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
        <label className="block text-sm text-zinc-400 mb-1">Conta *</label>
        <select
          value={form.contaId}
          onChange={e => setForm({ ...form, contaId: e.target.value })}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
        >
          <option value="">Selecione uma conta</option>
          {contas.map(c => (
            <option key={c.id} value={c.id}>
              {c.cliente.nome} — {c.numero}
            </option>
          ))}
        </select>
      </div>

      {contaSelecionada && (
        <div className="bg-zinc-800 rounded-lg px-4 py-3 text-sm flex gap-6">
          <div>
            <span className="text-zinc-400">Saldo: </span>
            <span className={contaSelecionada.saldo < 0 ? 'text-red-400 font-medium' : 'text-emerald-400 font-medium'}>
              R$ {contaSelecionada.saldo.toFixed(2)}
            </span>
          </div>
          {contaSelecionada.limite > 0 && (
            <div>
              <span className="text-zinc-400">Limite: </span>
              <span className="text-yellow-400 font-medium">
                R$ {contaSelecionada.limite.toFixed(2)}
              </span>
            </div>
          )}
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
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
          placeholder="0,00"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !!avisoLimite}
        className="w-full bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Processando...' : 'Realizar Saque'}
      </button>

    </form>
  )
}