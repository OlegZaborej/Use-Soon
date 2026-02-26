import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StatsModule } from '../stats/stats.module';

@Module({ imports: [StatsModule], controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
