import { faker } from "@faker-js/faker";

export const userSeeder = () => {
  let users = [];
  for (let i = 0; i < 5; i++) {
    users.push({
      username: faker.internet.username(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.email()
    })
  }
  return users;
}