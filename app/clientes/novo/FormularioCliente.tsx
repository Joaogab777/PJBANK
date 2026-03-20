'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FormularioCliente() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro)
        return
      }

      // cadastrou com sucesso → volta pra listagem
      router.push('/clientes')
      router.refresh() // força o Next.js a rebuscar os dados
    } catch (err) {
      setErro('Erro ao cadastrar cliente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Nome completo *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="João Silva"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">CPF *</label>
        <input
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Email *</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="joao@email.com"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Telefone</label>
        <input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="(34) 99999-9999"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
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