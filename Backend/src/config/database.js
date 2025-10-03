import { PrismaClient } from '@prisma/client'

// Singleton - una sola instancia de Prisma
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ver consultas en consola
})

export default prisma