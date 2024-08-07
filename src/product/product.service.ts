import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts() {
    const products = await this.productRepository.find();
    return { count: products.length, data: products };
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async postProduct(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async deleteProducts() {
    const deleteResponse = await this.productRepository.delete({});
    if (!deleteResponse) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return 'Deleted all products';
  }

  async deleteProductById(id: string) {
    const deleteResponse = await this.productRepository.delete({ id });
    if (!deleteResponse) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return 'Deleted selected product';
  }

  async updateProductById(id: string, updatedProductDto: CreateProductDto) {
    await this.productRepository.update(id, updatedProductDto);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
}
