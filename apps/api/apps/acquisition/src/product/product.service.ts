import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newProduct = this.repo.create({
      ...createProductDto,
      type: createProductDto.type || 'car',
      termInMonths: createProductDto.termInMonths || 72,
    });

    return this.repo.save(newProduct);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.repo.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
