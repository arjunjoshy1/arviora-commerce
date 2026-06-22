import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

export class CartLineDto {
  @IsString()
  productId!: string;

  @IsString()
  size!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class SyncCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartLineDto)
  items!: CartLineDto[];
}

export class UpsertCartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  size!: string;

  @IsInt()
  quantity!: number;
}
