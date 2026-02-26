import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { StorageZonesService } from './storage-zones.service';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { CreateStorageZoneDto, UpdateStorageZoneDto } from './storage-zones.dto';

@UseGuards(JwtAuthGuard)
@Controller('storage-zones')
export class StorageZonesController {
  constructor(private service: StorageZonesService) {}

  @Get()
  list(@CurrentUser('userId') userId: string) {
    return this.service.list(userId);
  }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateStorageZoneDto) {
    return this.service.create(userId, dto);
  }

  @Patch(':id')
  update(@CurrentUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateStorageZoneDto) {
    return this.service.update(userId, id, dto);
  }
}
