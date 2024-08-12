import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'robot' })
  name: string;

  @ApiProperty({ example: 'robot is better' })
  description: string;

  @ApiProperty({ example: 'robota' })
  productImg: string;

  @ApiProperty({ example: '1000' })
  price: number;

  @ApiProperty({ example: '6' })
  stock: number;

  @ApiProperty({ example: 'true' })
  isSale: boolean;
}
