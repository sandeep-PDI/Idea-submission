import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.user.deleteMany();

  // Create initial users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        department: 'Technology',
        lineOfBusiness: 'SOFTWARE'
      }
    }),
    prisma.user.create({
      data: {
        email: 'reviewer@example.com',
        name: 'Reviewer User',
        role: 'REVIEWER',
        department: 'R&D',
        lineOfBusiness: 'RESEARCH'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'APPLICANT',
        department: 'Engineering',
        lineOfBusiness: 'HARDWARE'
      }
    })
  ]);

  // Create sample ideas
  await prisma.idea.create({
    data: {
      title: 'AI-Powered Code Review Assistant',
      description: 'An intelligent system that automatically reviews code changes and suggests improvements based on best practices and historical data.',
      expectedImpact: 'Reduce code review time by 40% and improve code quality across all projects.',
      status: 'SUBMITTED',
      submittedBy: users[2].id,
      coApplicants: [],
      lineOfBusiness: 'SOFTWARE'
    }
  });

  console.log('Database seeded successfully');
}

seed()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });