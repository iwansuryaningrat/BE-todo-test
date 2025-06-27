import { faker } from "@faker-js/faker";

export const projectSeeder = () => {
  const projects = [];
  for (let i = 0; i < 3; i++) {
    projects.push({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
    });
  }
  return projects;
}