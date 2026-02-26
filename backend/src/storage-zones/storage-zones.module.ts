import { Module } from '@nestjs/common';
import { StorageZonesController } from './storage-zones.controller';
import { StorageZonesService } from './storage-zones.service';

@Module({ controllers: [StorageZonesController], providers: [StorageZonesService], exports: [StorageZonesService] })
export class StorageZonesModule {}
