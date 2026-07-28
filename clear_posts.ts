import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log("Deleting all posts...");
  await prisma.post.deleteMany();
  console.log("Posts cleared successfully!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
