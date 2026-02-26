import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { CreateItemDto, ExtendExpiryDto, MoveItemDto, UpdateItemDto } from './items.dto';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private service: ItemsService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) { return this.service.list(userId); }

  @Get(':id')
  get(@CurrentUser('userId') userId: string, @Param('id') id: string) { return this.service.get(userId, id); }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateItemDto) { return this.service.create(userId, dto); }

  @Patch(':id')
  update(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateItemDto) { return this.service.update(userId, id, dto); }

  @Post(':id/mark-used')
  markUsed(@CurrentUser('userId') userId: string, @Param('id') id: string) { return this.service.markUsed(userId, id); }

  @Post(':id/mark-discarded')
  markDiscarded(@CurrentUser('userId') userId: string, @Param('id') id: string) { return this.service.markDiscarded(userId, id); }

  @Post(':id/move')
  move(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: MoveItemDto) { return this.service.move(userId, id, dto); }

  @Post(':id/extend-expiry')
  extend(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: ExtendExpiryDto) { return this.service.extendExpiry(userId, id, dto); }
}
