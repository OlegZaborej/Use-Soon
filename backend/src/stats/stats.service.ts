import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserContextService } from '../common/auth/user-context.service';
import { computeDisplayStatus } from '../items/item-status.util';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService) {}

  async summary(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const usedEvents: any[] = await this.prisma.itemEvent.findMany({
      where: { householdId, eventType: 'MARK_USED' },
      include: { item: true },
    });

    const rescued = usedEvents.filter((e) => ['use_soon', 'expires_today', 'expired_check'].includes(e.metadata?.prevDisplayStatus || computeDisplayStatus(e.item.status, e.item.expiryDate)));
    const estimatedSavings = rescued.reduce((acc: number, e: any) => acc + (e.item.priceMinor || 0), 0);
    const discardedItems = await this.prisma.inventoryItem.count({ where: { householdId, status: 'DISCARDED' } });

    return {
      rescuedItems: rescued.length,
      discardedItems,
      estimatedSavingsMinor: estimatedSavings,
      estimated: true,
    };
  }
}
