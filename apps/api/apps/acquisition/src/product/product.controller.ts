import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { ReturnProductDto } from './dto/return-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return plainToClass(
      ReturnProductDto,
      this.productService.create(createProductDto),
    );
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return products.map((p) => plainToClass(ReturnProductDto, p));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return plainToClass(ReturnProductDto, this.productService.findOne(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
