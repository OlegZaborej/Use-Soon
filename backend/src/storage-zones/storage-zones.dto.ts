import { IsOptional, IsString } from 'class-validator';

export const ZoneType = {
  FREEZER: 'FREEZER',
  FRIDGE: 'FRIDGE',
  PANTRY: 'PANTRY',
} as const;

type ZoneTypeValue = (typeof ZoneType)[keyof typeof ZoneType];

export class CreateStorageZoneDto {
  @IsString()
  name!: string;

  @IsString()
  type!: ZoneTypeValue;
}

export class UpdateStorageZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: ZoneTypeValue;
}
