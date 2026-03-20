import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinBank',
  description: 'Sistema Bancário',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-zinc-950 text-white min-h-screen`}>
        
        {/* Navbar */}
        <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-emerald-400">
              PJBANK
            </Link>
            <div className="flex gap-6 text-sm text-zinc-400">
              <Link href="/clientes" className="hover:text-white transition-colors">
                Clientes
              </Link>
              <Link href="/contas" className="hover:text-white transition-colors">
                Contas
              </Link>
              <Link href="/operacoes" className="hover:text-white transition-colors">
                Operações
              </Link>
            </div>
          </div>
        </nav>

        {/* Conteúdo da página */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>

      </body>
    </html>
  )
}