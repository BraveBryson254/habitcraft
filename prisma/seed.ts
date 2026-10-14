/**
 * Optional seed — the Store products live in code (lib/products.ts), so there's
 * nothing required to seed. This script just verifies the DB connection and can
 * be extended if you move products into the database.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.count();
  const orders = await prisma.order.count();
  console.log(`✓ Database reachable. Bookings: ${bookings}, Orders: ${orders}.`);
  console.log("Products are defined in lib/products.ts — no seeding needed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
