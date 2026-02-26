import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserContextService {
  constructor(private prisma: PrismaService) {}

  async getHouseholdId(userId: string) {
    const member = await this.prisma.householdMember.findUnique({ where: { userId } });
    if (!member) throw new NotFoundException('Household member not found');
    return member.householdId;
  }
}
