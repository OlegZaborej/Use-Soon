import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../common/auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get()
  get(@CurrentUser('userId') userId: string) { return this.service.get(userId); }
}
