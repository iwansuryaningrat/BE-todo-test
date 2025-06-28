import { faker } from "@faker-js/faker";

export const userSeeder = () => {
  let users = [];
  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email();
    users.push({
      username: faker.internet.username(),
      name: faker.person.fullName(),
      email,
      password: email
    })
  }
  return users;
}