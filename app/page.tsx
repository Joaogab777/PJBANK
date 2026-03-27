import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import Background from "@/components/Background";
import { LiquidGlassCard } from "react-liquid-glass-card";

export default async function Home() {
  const [totalClientes, totalContas, totalTransacoes] = await Promise.all([
    prisma.cliente.count(),
    prisma.conta.count(),
    prisma.transacao.count(),
  ]);

  const ultimasTransacoes = await prisma.transacao.findMany({
    take: 5,
    orderBy: { criadoEm: "desc" },
    include: {
      contaOrigem: { include: { cliente: true } },
      contaDestino: { include: { cliente: true } },
    },
  });

  // Configuração padrão para os cards de vidro para manter consistência
  const glassConfig = {
    brightness: 1.15,
    blur: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  };

  return (
    <div className="relative space-y-12 pb-12">
      <Background />

      {/* Cabeçalho */}
      <div className="relative pt-8">
        <h1 className="text-5xl font-chillax font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-white mt-2 text-lg font-light">
          Bem-vindo ao centro de controle do seu sistema bancário.
        </p>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/20 blur-[80px] rounded-full -z-10" />
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LiquidGlassCard
          padding="2rem"
          borderRadius="1.5rem"
          {...glassConfig}
          
        >
          <p className="text-white text-xs font-semibold uppercase tracking-widest">
            Total de Clientes
          </p>
          <div className="flex items-baseline gap-2 mt-4">
            <p className="text-5xl font-chillax font-bold text-emerald-400 transition-transform">
              {totalClientes}
            </p>
            <span className="text-white text-sm">usuários</span>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard
          padding="2rem"
          borderRadius="1.5rem"
          {...glassConfig}
        >
          <p className="text-white text-xs font-semibold uppercase tracking-widest">
            Total de Contas
          </p>
          <div className="flex items-baseline gap-2 mt-4">
            <p className="text-5xl font-chillax font-bold text-blue-400 transition-transform">
              {totalContas}
            </p>
            <span className="text-white text-sm">ativas</span>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard
          padding="2rem"
          borderRadius="1.5rem"
          {...glassConfig}
        >
          <p className="text-white text-xs font-semibold uppercase tracking-widest">
            Total de Transações
          </p>
          <div className="flex items-baseline gap-2 mt-4">
            <p className="text-5xl font-chillax font-bold text-purple-400 transition-transform">
              {totalTransacoes}
            </p>
            <span className="text-white text-sm">realizadas</span>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Atalhos */}
      <div className="relative">
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
        <h2 className="text-2xl font-chillax font-semibold mb-6 text-white">
          Ações rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/clientes/novo" className="group block">
            <LiquidGlassCard
              padding="1.5rem"
              borderRadius="1.5rem"
              backgroundColor="rgba(255, 255, 255, 0.02)"
              brightness={1.2}
              blur={10}
            >
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                👤
              </div>
              <p className="font-chillax font-bold text-xl mb-1 text-white group-hover:text-emerald-400 transition-colors">
                Novo Cliente
              </p>
              <p className="text-white text-sm font-light">
                Cadastrar um novo cliente no sistema
              </p>
            </LiquidGlassCard>
          </Link>

          <Link href="/contas/nova" className="group block">
            <LiquidGlassCard
              padding="1.5rem"
              borderRadius="1.5rem"
              backgroundColor="rgba(255, 255, 255, 0.02)"
              brightness={1.2}
              blur={10}
            >
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                🏦
              </div>
              <p className="font-chillax font-bold text-xl mb-1 text-white group-hover:text-blue-400 transition-colors">
                Nova Conta
              </p>
              <p className="text-white text-sm font-light">
                Abrir uma nova conta bancária
              </p>
            </LiquidGlassCard>
          </Link>

          <Link href="/operacoes" className="group block">
            <LiquidGlassCard
              padding="1.5rem"
              borderRadius="1.5rem"
              backgroundColor="rgba(255, 255, 255, 0.02)"
              brightness={1.2}
              blur={10}
            >
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                💸
              </div>
              <p className="font-chillax font-bold text-xl mb-1 text-white group-hover:text-purple-400 transition-colors">
                Operações
              </p>
              <p className="text-white text-sm font-light">
                Depósito, saque ou transferência rápida
              </p>
            </LiquidGlassCard>
          </Link>
        </div>
      </div>

      {/* Últimas transações */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-chillax font-semibold text-white">
            Últimas transações
          </h2>
          <Link
            href="/operacoes"
            className="text-white hover:text-white text-sm transition-colors border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-full"
          >
            Ver todas &rarr;
          </Link>
        </div>

        <LiquidGlassCard
          padding="0"
          borderRadius="1.5rem"
          {...glassConfig}
        >
          {ultimasTransacoes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-white italic font-light">
                Nenhuma transação encontrada no sistema.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-white/[0.02] text-white text-xs uppercase tracking-wider">
                    <th className="p-5 font-medium">Tipo</th>
                    <th className="p-5 font-medium">Valor</th>
                    <th className="p-5 font-medium">Descrição</th>
                    <th className="p-5 font-medium text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {ultimasTransacoes.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase
                          ${t.tipo === "DEPOSITO" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : ""}
                          ${t.tipo === "SAQUE" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ""}
                          ${t.tipo === "TRANSFERENCIA" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : ""}
                        `}
                        >
                          {t.tipo}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="font-chillax font-semibold text-white">
                          R${" "}
                          {t.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="p-5 text-white text-sm font-light">
                        {t.descricao}
                      </td>
                      <td className="p-5 text-white text-sm text-right font-light">
                        {new Date(t.criadoEm).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </LiquidGlassCard>
      </div>
    </div>
  );
}