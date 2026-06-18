import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Query parameters accepted by GET /api/products. */
export class FindProductsDto {
  /** Filter by category slug, e.g. ?category=jewellery */
  @IsOptional()
  @IsString()
  category?: string;

  /** Free-text search over product name. */
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}
