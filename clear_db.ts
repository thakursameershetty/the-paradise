import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log("Deleting all posts...");
  await prisma.post.deleteMany();
  console.log("Deleting all participants...");
  await prisma.participant.deleteMany();
  console.log("Database cleared successfully!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
