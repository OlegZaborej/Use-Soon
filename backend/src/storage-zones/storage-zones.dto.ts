import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ZoneType } from '@prisma/client';

export class CreateStorageZoneDto {
  @IsString()
  name!: string;

  @IsEnum(ZoneType)
  type!: ZoneType;
}

export class UpdateStorageZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ZoneType)
  type?: ZoneType;
}
