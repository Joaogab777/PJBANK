import FormularioCliente from './FormularioCliente'

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Cliente</h1>
        <p className="text-zinc-400 mt-1">Preencha os dados para cadastrar</p>
      </div>
      <FormularioCliente />
    </div>
  )
}