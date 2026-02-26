import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserContextService } from '../common/auth/user-context.service';
import { computeDisplayStatus } from '../items/item-status.util';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService, private stats: StatsService) {}

  async get(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const all: any[] = await this.prisma.inventoryItem.findMany({ where: { householdId }, orderBy: { createdAt: 'desc' } });
    const useSoon = all.filter((i) => ['use_soon', 'expires_today', 'expired_check'].includes(computeDisplayStatus(i.status, i.expiryDate)));
    const week = all.filter((i) => {
      if (!i.expiryDate) return false;
      const d = Math.ceil((i.expiryDate.getTime() - Date.now()) / 86400000);
      return d >= 0 && d <= 7;
    });
    const summary = await this.stats.summary(userId);

    return {
      useSoon: useSoon.slice(0, 10),
      thisWeek: week.slice(0, 10),
      recentlyAdded: all.slice(0, 10),
      estimatedSavings: summary.estimatedSavingsMinor,
      rescuedItems: summary.rescuedItems,
      discardedItems: summary.discardedItems,
      estimated: true,
    };
  }
}
