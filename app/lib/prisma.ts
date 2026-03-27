import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DB_PROVIDER = process.env.DB_PROVIDER || 'postgresql'

// Singleton pattern
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Função para verificar qual banco está ativo
export function getDbProvider(): string {
  return DB_PROVIDER
}

// Função para verificar se está usando SQLite
export function isUsingSQLite(): boolean {
  return DB_PROVIDER === 'sqlite'
}
