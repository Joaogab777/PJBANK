'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Cliente = {
  id: string
  nome: string
  cpf: string
}

export default function FormularioConta() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // pega o clienteId da URL se vier da página de clientes
  const clienteIdParam = searchParams.get('clienteId') ?? ''

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    clienteId: clienteIdParam,
    depositoInicial: '',
    limite: ''
  })

  // busca os clientes quando a tela carrega
  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const res = await fetch('/api/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: form.clienteId,
          depositoInicial: form.depositoInicial ? Number(form.depositoInicial) : 0,
          limite: form.limite ? Number(form.limite) : 0,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro)
        return
      }

      router.push('/contas')
      router.refresh()
    } catch (err) {
      setErro('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

      {erro && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Cliente *</label>
        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome} — {c.cpf}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">
          Depósito inicial <span className="text-zinc-500">(opcional)</span>
        </label>
        <input
          name="depositoInicial"
          type="number"
          min="0"
          step="0.01"
          value={form.depositoInicial}
          onChange={handleChange}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="0,00"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">
          Limite <span className="text-zinc-500">(opcional)</span>
        </label>
        <input
          name="limite"
          type="number"
          min="0"
          step="0.01"
          value={form.limite}
          onChange={handleChange}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="0,00"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>

    </form>
  )
}