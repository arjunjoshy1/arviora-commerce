import {
  IsArray,
  IsHexColor,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

/** Body for POST /api/products (admin only). */
export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  description = '';

  /** Price in paise (integer) — e.g. ₹1,299.00 = 129900. */
  @IsInt()
  @Min(0)
  priceInPaise!: number;

  @IsOptional()
  @IsString()
  currency = 'INR';

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  /** Full image gallery for the product detail carousel. */
  @IsOptional()
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  images?: string[];

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsInt()
  @Min(0)
  stock = 0;

  /** Category to attach the product to. */
  @IsString()
  categorySlug!: string;
}
