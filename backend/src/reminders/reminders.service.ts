import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventType, NotificationStatus, NotificationType } from '@prisma/client';
import { UserContextService } from '../common/auth/user-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateReminderPreferencesDto } from './reminders.dto';
import { computeDisplayStatus } from '../items/item-status.util';
import { ItemsService } from '../items/items.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService, private itemsService: ItemsService) {}

  async get(userId: string) {
    return this.prisma.reminderPreference.upsert({ where: { userId }, create: { userId }, update: {} });
  }

  async patch(userId: string, dto: UpdateReminderPreferencesDto) {
    return this.prisma.reminderPreference.upsert({ where: { userId }, create: { userId, ...dto }, update: dto });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async scheduler() {
    const activeItems = await this.prisma.inventoryItem.findMany({ where: { status: 'ACTIVE', expiryDate: { not: null } } });
    for (const item of activeItems) {
      const member = await this.prisma.householdMember.findFirst({ where: { householdId: item.householdId }, include: { user: true } });
      if (!member) continue;
      const prefs = await this.prisma.reminderPreference.findUnique({ where: { userId: member.userId } });
      const remindDays = prefs?.remindDaysBefore || [7, 3, 1];
      if (!item.expiryDate) continue;
      const now = new Date();
      const diff = Math.ceil((item.expiryDate.getTime() - now.getTime()) / 86400000);

      if (remindDays.includes(diff) || (diff < 0 && prefs?.notifyExpired)) {
        const type = diff < 0 ? NotificationType.EXPIRED_ALERT : NotificationType.EXPIRY_REMINDER;
        const dedupeKey = `${item.id}-${type}-${diff}`;
        await this.prisma.notificationQueue.upsert({
          where: { dedupeKey },
          create: {
            dedupeKey,
            householdId: item.householdId,
            userId: member.userId,
            itemId: item.id,
            type,
            title: diff < 0 ? `Expired: ${item.name}` : `Use soon: ${item.name}`,
            body: diff < 0 ? `${item.name} may be expired.` : `${item.name} expires in ${diff} day(s).`,
            scheduledFor: new Date(),
          },
          update: {},
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async dispatcher() {
    const notifications = await this.prisma.notificationQueue.findMany({
      where: { status: NotificationStatus.PENDING, scheduledFor: { lte: new Date() } },
      include: { item: true },
      take: 50,
    });

    for (const note of notifications) {
      const pref = await this.prisma.reminderPreference.findUnique({ where: { userId: note.userId } });
      if (this.isInQuietHours(pref?.quietHoursStart, pref?.quietHoursEnd)) continue;

      await this.prisma.notificationQueue.update({
        where: { id: note.id },
        data: { status: NotificationStatus.SENT, sentAt: new Date() },
      });

      if (note.itemId) {
        const item = await this.prisma.inventoryItem.findUnique({ where: { id: note.itemId } });
        if (item) {
          await this.itemsService.event(item.id, item.householdId, EventType.REMINDER_SENT, {
            notificationId: note.id,
            status: computeDisplayStatus(item.status, item.expiryDate),
          });
        }
      }
    }
  }

  private isInQuietHours(start?: string | null, end?: string | null) {
    if (!start || !end) return false;
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const s = sh * 60 + sm;
    const e = eh * 60 + em;
    return s <= e ? current >= s && current <= e : current >= s || current <= e;
  }
}
