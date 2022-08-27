import { Seeder, Factory } from 'typeorm-seeding';
import { Product } from '../../entities/product.entity';

export class CreateProduct implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Product)().createMany(5);
  }
}
