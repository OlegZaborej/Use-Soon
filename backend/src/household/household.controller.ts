import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { UpdateHouseholdDto } from './household.dto';

@UseGuards(JwtAuthGuard)
@Controller('household')
export class HouseholdController {
  constructor(private service: HouseholdService) {}

  @Get()
  get(@CurrentUser('userId') userId: string) {
    return this.service.getByUser(userId);
  }

  @Patch()
  patch(@CurrentUser('userId') userId: string, @Body() dto: UpdateHouseholdDto) {
    return this.service.updateByUser(userId, dto);
  }
}
