import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Hero',
  {},
  {
    _id: faker.datatype.number,
    name: faker.name.findName,
    description: faker.lorem.paragraph,
    location: () => ({
      coordinates: [faker.address.longitude(), faker.address.latitude()],
    }),
    status: () =>
      faker.helpers.arrayElement(['resting', 'out_of_combat', 'patrolling']),
    rank: faker.helpers.arrayElement(['S', 'A', 'B', 'C']),
  }
);

factory.define('Monster', {}, async () => {
  const hero = await factory.attrs('Hero');
  return {
    _id: faker.datatype.number,
    name: faker.name.findName,
    rank: faker.helpers.arrayElement(['God', 'Dragon', 'Tiger', 'Wolf']),
    location: () => ({
      coordinates: [faker.address.longitude(), faker.address.latitude()],
    }),
    heroes: [hero],
    status: faker.helpers.arrayElement(['fighting', 'defeated']),
  };
});

factory.define(
  'User',
  {},
  {
    name: faker.name.findName,
    email: faker.internet.email,
    password: faker.internet.password,
  }
);

export default factory;
