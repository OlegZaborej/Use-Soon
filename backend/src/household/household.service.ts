import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserContextService } from '../common/auth/user-context.service';
import { UpdateHouseholdDto } from './household.dto';

@Injectable()
export class HouseholdService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService) {}

  async getByUser(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.household.findUnique({ where: { id: householdId } });
  }

  async updateByUser(userId: string, dto: UpdateHouseholdDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.household.update({ where: { id: householdId }, data: dto });
  }
}
