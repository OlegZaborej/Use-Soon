import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already used');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name },
    });

    const household = await this.prisma.household.create({ data: { name: `${dto.name || 'My'} Household` } });
    await this.prisma.householdMember.create({
      data: { householdId: household.id, userId: user.id, role: 'OWNER' },
    });
    await this.prisma.storageZone.create({
      data: { householdId: household.id, name: 'Freezer', type: 'FREEZER' },
    });
    await this.prisma.reminderPreference.create({ data: { userId: user.id } });

    return this.buildAuthResponse(user.id, user.email, user.name);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.buildAuthResponse(user.id, user.email, user.name);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, householdMember: { select: { householdId: true, role: true } } },
    });
  }

  private buildAuthResponse(id: string, email: string, name: string | null) {
    return {
      accessToken: this.jwt.sign({ sub: id, email }),
      user: { id, email, name },
    };
  }
}
