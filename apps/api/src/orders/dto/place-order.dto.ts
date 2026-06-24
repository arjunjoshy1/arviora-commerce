import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class OrderLineDto {
  @IsString()
  productId!: string;

  @IsString()
  @MinLength(1)
  size!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

class ShippingAddressDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(5)
  phone!: string;

  @IsString()
  @MinLength(3)
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @IsString()
  @MinLength(2)
  state!: string;

  @IsString()
  @MinLength(4)
  postalCode!: string;
}

/** Body for POST /api/orders. */
export class PlaceOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping!: ShippingAddressDto;
}
