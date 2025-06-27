import { PrismaClient, ProjectRole } from '@prisma/client';
import { projectSeeder } from './seeders/project.seeder';
import { userSeeder } from './seeders/user.seeder';
import * as bcrypt from 'bcryptjs';

const hashPassword = (password: string) => {
  const salt = 10;
  return bcrypt.hashSync(password, salt);
}

const prisma = new PrismaClient();

async function seedUsers() {
  const users = userSeeder().map(user => ({
    ...user,
    password: hashPassword(user.password),
  }));

  return await Promise.all(users.map(user => prisma.users.create({ data: user })));
}

async function seedProjects() {
  const users = await prisma.users.findMany({
    where: {},
    take: projectSeeder().length
  })
  return await Promise.all(projectSeeder().map((project, i) => prisma.projects.create({
    data: {
      ...project,
      createdBy: users[i].id
    }
  })));
}

async function seedProjectMembers() {
  const users = await prisma.users.findMany({});
  const projects = await prisma.projects.findMany({});

  return await Promise.all(projects.map(async (project, i) => {
    await Promise.all(users.map(async (user, j) => {
      const projectRole = user.id === project.createdBy ? ProjectRole.owner : ProjectRole.member;
      const isActive = i == 1
      await prisma.projectMembers.create({
        data: {
          userId: user.id,
          projectId: project.id,
          role: projectRole,
          isActive,
        }
      })
    }))
  }));
}

function seed() {
  return prisma.$connect().then(async () => {
    await seedUsers();
    await seedProjects();
    await seedProjectMembers();
  })
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(
  async () => {
    await prisma.$disconnect();
  }
)