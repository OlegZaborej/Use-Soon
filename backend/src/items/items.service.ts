import { Injectable, NotFoundException } from '@nestjs/common';
const EventType = { CREATED:'CREATED', UPDATED:'UPDATED', MARK_USED:'MARK_USED', MARK_DISCARDED:'MARK_DISCARDED', MOVED:'MOVED', EXTEND_EXPIRY:'EXTEND_EXPIRY', REMINDER_SENT:'REMINDER_SENT' } as const;
type EventType = typeof EventType[keyof typeof EventType];
const ItemStatus = { ACTIVE:'ACTIVE', USED:'USED', DISCARDED:'DISCARDED', EXPIRED_CHECK:'EXPIRED_CHECK' } as const;
type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus];
import { UserContextService } from '../common/auth/user-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, ExtendExpiryDto, MoveItemDto, UpdateItemDto } from './items.dto';
import { computeDisplayStatus } from './item-status.util';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService, private userCtx: UserContextService) {}

  async list(userId: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const items: any[] = await this.prisma.inventoryItem.findMany({ where: { householdId }, orderBy: { createdAt: 'desc' } });
    return items.map((item) => ({ ...item, displayStatus: computeDisplayStatus(item.status, item.expiryDate) }));
  }

  async get(userId: string, id: string) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const item = await this.prisma.inventoryItem.findFirst({ where: { id, householdId } });
    if (!item) throw new NotFoundException('Item not found');
    return { ...item, displayStatus: computeDisplayStatus(item.status, item.expiryDate) };
  }

  async create(userId: string, dto: CreateItemDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const item = await this.prisma.inventoryItem.create({
      data: { ...this.mapItemDto(dto), householdId, status: ItemStatus.ACTIVE },
    });
    await this.event(item.id, householdId, EventType.CREATED);
    return item;
  }

  async update(userId: string, id: string, dto: UpdateItemDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    await this.ensureItem(id, householdId);
    const item = await this.prisma.inventoryItem.update({ where: { id }, data: this.mapItemDto(dto) });
    await this.event(id, householdId, EventType.UPDATED);
    return item;
  }

  async markUsed(userId: string, id: string) {
    return this.mark(userId, id, ItemStatus.USED, EventType.MARK_USED);
  }

  async markDiscarded(userId: string, id: string) {
    return this.mark(userId, id, ItemStatus.DISCARDED, EventType.MARK_DISCARDED);
  }

  async move(userId: string, id: string, dto: MoveItemDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    await this.ensureItem(id, householdId);
    const item = await this.prisma.inventoryItem.update({ where: { id }, data: { storageZoneId: dto.storageZoneId } });
    await this.event(id, householdId, EventType.MOVED, { storageZoneId: dto.storageZoneId });
    return item;
  }

  async extendExpiry(userId: string, id: string, dto: ExtendExpiryDto) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    await this.ensureItem(id, householdId);
    const item = await this.prisma.inventoryItem.update({ where: { id }, data: { expiryDate: new Date(dto.expiryDate) } });
    await this.event(id, householdId, EventType.EXTEND_EXPIRY, { expiryDate: dto.expiryDate });
    return item;
  }

  private async mark(userId: string, id: string, status: ItemStatus, eventType: EventType) {
    const householdId = await this.userCtx.getHouseholdId(userId);
    const before = await this.ensureItem(id, householdId);
    const prevDisplayStatus = computeDisplayStatus(before.status, before.expiryDate);
    const item = await this.prisma.inventoryItem.update({ where: { id }, data: { status } });
    await this.event(id, householdId, eventType, { prevDisplayStatus });
    return item;
  }

  private async ensureItem(id: string, householdId: string) {
    const item = await this.prisma.inventoryItem.findFirst({ where: { id, householdId } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  private mapItemDto(dto: CreateItemDto | UpdateItemDto) {
    return {
      name: dto.name,
      category: dto.category,
      quantityValue: dto.quantityValue,
      quantityUnit: dto.quantityUnit,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      priceMinor: dto.priceMinor,
      currencyCode: dto.currencyCode,
      storageZoneId: dto.storageZoneId,
      notes: dto.notes,
      source: dto.source || 'MANUAL',
    };
  }

  async event(itemId: string, householdId: string, eventType: EventType, metadata?: Record<string, unknown>) {
    return this.prisma.itemEvent.create({ data: { itemId, householdId, eventType, metadata } });
  }
}
