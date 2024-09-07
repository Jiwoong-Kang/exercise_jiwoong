import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    // const products = await this.productRepository.find();
    // return { count: products.length, data: products };
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy('product.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
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
