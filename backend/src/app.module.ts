import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { HouseholdModule } from './household/household.module';
import { StorageZonesModule } from './storage-zones/storage-zones.module';
import { ItemsModule } from './items/items.module';
import { RemindersModule } from './reminders/reminders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    CommonModule,
    AuthModule,
    HouseholdModule,
    StorageZonesModule,
    ItemsModule,
    RemindersModule,
    NotificationsModule,
    DashboardModule,
    StatsModule,
  ],
})
export class AppModule {}
