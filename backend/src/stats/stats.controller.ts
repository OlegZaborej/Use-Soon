import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { StatsService } from './stats.service';
import { CurrentUser } from '../common/auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private service: StatsService) {}

  @Get('summary')
  summary(@CurrentUser('userId') userId: string) { return this.service.summary(userId); }
}
