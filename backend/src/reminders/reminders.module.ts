import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ItemsModule } from '../items/items.module';

@Module({ imports: [NotificationsModule, ItemsModule], controllers: [RemindersController], providers: [RemindersService], exports: [RemindersService] })
export class RemindersModule {}
