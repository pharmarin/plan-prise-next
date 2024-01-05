import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";

export type FakeUser = Omit<User, "id">;

export const fakeUserBase = (): FakeUser => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const creationDate = faker.date.past({ years: 5 });

  return {
    firstName,
    lastName,
    displayName: `${firstName} ${lastName} Display`,
    email,
    password: faker.internet.password(),
    admin: false,
    student: false,
    rpps: BigInt(faker.string.numeric(11)),
    certificate: null,
    createdAt: creationDate,
    updatedAt: null,
    approvedAt: null,
    maxId: 0,
  };
};
