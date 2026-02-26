import { IsOptional, IsString } from 'class-validator';

export class UpdateHouseholdDto {
  @IsOptional()
  @IsString()
  name?: string;
}
