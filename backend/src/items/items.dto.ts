import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export const ItemCategory = {
  MEAT: 'MEAT',
  FISH: 'FISH',
  VEGETABLE: 'VEGETABLE',
  FRUIT: 'FRUIT',
  READY_MEAL: 'READY_MEAL',
  DAIRY: 'DAIRY',
  BAKERY: 'BAKERY',
  OTHER: 'OTHER',
} as const;

export const ItemSource = {
  MANUAL: 'MANUAL',
  RECEIPT: 'RECEIPT',
  IMPORT: 'IMPORT',
} as const;

type ItemCategoryType = (typeof ItemCategory)[keyof typeof ItemCategory];
type ItemSourceType = (typeof ItemSource)[keyof typeof ItemSource];

export class CreateItemDto {
  @IsString() name!: string;
  @IsString() category!: ItemCategoryType;
  @IsOptional() @IsNumber() quantityValue?: number;
  @IsOptional() @IsString() quantityUnit?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @IsNumber() priceMinor?: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsString() storageZoneId!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() source?: ItemSourceType;
}

export class UpdateItemDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() category?: ItemCategoryType;
  @IsOptional() @IsNumber() quantityValue?: number;
  @IsOptional() @IsString() quantityUnit?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @IsNumber() priceMinor?: number;
  @IsOptional() @IsString() currencyCode?: string;
  @IsOptional() @IsString() storageZoneId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() source?: ItemSourceType;
}

export class MoveItemDto {
  @IsString() storageZoneId!: string;
}

export class ExtendExpiryDto {
  @IsDateString() expiryDate!: string;
}
