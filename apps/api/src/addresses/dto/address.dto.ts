import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpsertAddressDto {
  @IsString()
  @MinLength(1)
  label!: string;

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

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
