import { PrismaClient } from "@prisma/client";
import { dbEnabled } from "./config";

/**
 * Prisma singleton (avoids exhausting connections in dev hot-reload).
 * If DATABASE_URL isn't set, `prisma` is null and callers degrade gracefully
 * (bookings/orders still complete via Stripe; they just aren't persisted).
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient | null = dbEnabled
  ? globalForPrisma.prisma ?? new PrismaClient({ log: ["error", "warn"] })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
