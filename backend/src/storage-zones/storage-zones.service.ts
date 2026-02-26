import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserContextService } from '../common/auth/user-context.service';
import { CreateStorageZoneDto, UpdateStorageZoneDto } from './storage-zones.dto';

@Injectable()
export class StorageZonesService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService) {}

  async list(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.storageZone.findMany({ where: { householdId }, orderBy: { createdAt: 'asc' } });
  }

  async create(userId: string, dto: CreateStorageZoneDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    return this.prisma.storageZone.create({ data: { ...dto, householdId } });
  }

  async update(userId: string, id: string, dto: UpdateStorageZoneDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const zone = await this.prisma.storageZone.findFirst({ where: { id, householdId } });
    if (!zone) throw new Error('Zone not found');
    return this.prisma.storageZone.update({ where: { id }, data: dto });
  }
}
