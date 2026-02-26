import { ItemCategory, ItemSource } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString() name!: string;
  @IsEnum(ItemCategory) category!: ItemCategory;
  @IsOptional() @IsNumber() quantityValue?: number;
  @IsOptional() @IsString() quantityUnit?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @IsNumber() priceMinor?: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsString() storageZoneId!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsEnum(ItemSource) source?: ItemSource;
}

export class UpdateItemDto extends CreateItemDto {}

export class MoveItemDto {
  @IsString() storageZoneId!: string;
}

export class ExtendExpiryDto {
  @IsDateString() expiryDate!: string;
}
