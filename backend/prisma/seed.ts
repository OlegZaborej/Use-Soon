import { PrismaClient, ItemCategory, ZoneType, ItemStatus, EventType, ItemSource } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@smartpantry.app';
  const passwordHash = await bcrypt.hash('demo1234', 10);

  await prisma.notificationQueue.deleteMany();
  await prisma.itemEvent.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.storageZone.deleteMany();
  await prisma.reminderPreference.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({ data: { email, passwordHash, name: 'Demo User' } });
  const household = await prisma.household.create({ data: { name: 'Demo Household' } });

  await prisma.householdMember.create({
    data: { householdId: household.id, userId: user.id, role: 'OWNER' },
  });

  await prisma.reminderPreference.create({ data: { userId: user.id } });

  const freezer = await prisma.storageZone.create({
    data: { householdId: household.id, name: 'Main Freezer', type: ZoneType.FREEZER },
  });

  const items = [
    ['Chicken breast', ItemCategory.MEAT, 2, 'packs', 2, 1200],
    ['Ground beef', ItemCategory.MEAT, 1, 'kg', 1, 1500],
    ['Frozen berries', ItemCategory.FRUIT, 1, 'bag', 7, 900],
    ['Salmon fillets', ItemCategory.FISH, 4, 'pcs', 0, 2400],
    ['Bacon', ItemCategory.MEAT, 1, 'pack', -1, 800],
    ['Broccoli', ItemCategory.VEGETABLE, 2, 'bags', 4, 600],
    ['Dumplings', ItemCategory.READY_MEAL, 1, 'pack', 10, 1100],
    ['Ice cream', ItemCategory.DAIRY, 1, 'box', 12, 700],
  ] as const;

  for (const [name, category, qty, unit, days, priceMinor] of items) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    const item = await prisma.inventoryItem.create({
      data: {
        householdId: household.id,
        storageZoneId: freezer.id,
        name,
        category,
        quantityValue: qty,
        quantityUnit: unit,
        expiryDate,
        priceMinor,
        currencyCode: 'USD',
        source: ItemSource.MANUAL,
        status: ItemStatus.ACTIVE,
      },
    });

    await prisma.itemEvent.create({
      data: { itemId: item.id, householdId: household.id, eventType: EventType.CREATED },
    });
  }

  console.log('Seed completed');
}

main().finally(async () => prisma.$disconnect());
