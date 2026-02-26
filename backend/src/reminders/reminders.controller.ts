import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { UpdateReminderPreferencesDto } from './reminders.dto';

@UseGuards(JwtAuthGuard)
@Controller('reminder-preferences')
export class RemindersController {
  constructor(private service: RemindersService) {}

  @Get()
  get(@CurrentUser('userId') userId: string) { return this.service.get(userId); }

  @Patch()
  patch(@CurrentUser('userId') userId: string, @Body() dto: UpdateReminderPreferencesDto) { return this.service.patch(userId, dto); }
}
