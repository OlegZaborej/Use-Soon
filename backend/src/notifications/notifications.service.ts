import { Injectable } from '@nestjs/common';
import { NotificationStatus, NotificationType } from '@prisma/client';
import { UserContextService } from '../common/auth/user-context.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService) {}

  async list(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.notificationQueue.findMany({ where: { householdId }, orderBy: { createdAt: 'desc' } });
  }

  async test(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.notificationQueue.create({
      data: {
        householdId,
        userId,
        type: NotificationType.TEST,
        status: NotificationStatus.PENDING,
        title: 'Test notification',
        body: 'Smart Pantry test notification',
        scheduledFor: new Date(),
      },
    });
  }
}
