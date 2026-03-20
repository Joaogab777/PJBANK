import { Suspense } from 'react'
import FormularioConta from './FormularioConta'

export default function NovaContaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nova Conta</h1>
        <p className="text-zinc-400 mt-1">Abrir uma conta bancária para um cliente</p>
      </div>
      {/* Suspense é necessário por causa do useSearchParams */}
      <Suspense fallback={<p className="text-zinc-400">Carregando...</p>}>
        <FormularioConta />
      </Suspense>
    </div>
  )
}