import { IsString, MinLength } from 'class-validator';

/** Body for POST /api/categories (admin only). */
export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name!: string;
}
