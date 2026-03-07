import { PrismaClient } from '@prisma/client'

// PrismaClient is meant to be used on the server side (Node.js/Backend).
// Running this directly in a Vite/React frontend will cause errors.
// Use this inside an Express/Next.js/Hono server.

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
