import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReminderPreferencesDto {
  @IsOptional() @IsArray() remindDaysBefore?: number[];
  @IsOptional() @IsBoolean() notifyExpired?: boolean;
  @IsOptional() @IsString() quietHoursStart?: string;
  @IsOptional() @IsString() quietHoursEnd?: string;
  @IsOptional() @IsBoolean() pushEnabled?: boolean;
  @IsOptional() @IsBoolean() emailEnabled?: boolean;
}
