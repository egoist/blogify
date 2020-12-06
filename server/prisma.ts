import { PrismaClient, Prisma } from '@prisma/client'

let prisma: PrismaClient

const options: Prisma.PrismaClientOptions = {
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(options)
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(options)
  }
  prisma = global.prisma
}

export { prisma }
