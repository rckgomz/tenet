import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../entities/product.entity';

define(Product, () => {
  const product = new Product();

  product.id = faker.datatype.uuid();
  product.name = faker.lorem.slug();
  product.type = 'car';
  product.termInMonths = faker.datatype.number({ min: 60, max: 120 });

  return product;
});
