import { Global, Module } from '@nestjs/common';
import { UserContextService } from './auth/user-context.service';

@Global()
@Module({ providers: [UserContextService], exports: [UserContextService] })
export class CommonModule {}
