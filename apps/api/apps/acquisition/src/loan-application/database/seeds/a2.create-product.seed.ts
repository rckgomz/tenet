import { Seeder, Factory } from 'typeorm-seeding';
import { Product } from '../../../product/entities/product.entity';

export class CreateProduct implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Product)().create({
      termInMonths: 72,
    });
    await factory(Product)().createMany(5);
  }
}
