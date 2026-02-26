import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

type AnyObj = Record<string, any>;

@Injectable()
export class PrismaService implements OnModuleInit {
  private seq = 1;
  private id() { return `id_${this.seq++}`; }

  private db = {
    users: [] as AnyObj[],
    households: [] as AnyObj[],
    householdMembers: [] as AnyObj[],
    storageZones: [] as AnyObj[],
    inventoryItems: [] as AnyObj[],
    itemEvents: [] as AnyObj[],
    reminderPreferences: [] as AnyObj[],
    notificationQueue: [] as AnyObj[],
  };

  async onModuleInit() {
    if (!this.db.users.find((u) => u.email === 'demo@smartpantry.app')) {
      const user = { id: this.id(), email: 'demo@smartpantry.app', passwordHash: '$2b$10$bImLxAixcpoAJ0lsfFhhTejX9YkKvEtGfW9TpwkM3AqVT2B2X6m0S', name: 'Demo User', createdAt: new Date(), updatedAt: new Date() };
      this.db.users.push(user);
      const household = { id: this.id(), name: 'Demo Household', createdAt: new Date(), updatedAt: new Date() };
      this.db.households.push(household);
      this.db.householdMembers.push({ id: this.id(), householdId: household.id, userId: user.id, role: 'OWNER', createdAt: new Date(), updatedAt: new Date() });
      const zone = { id: this.id(), householdId: household.id, name: 'Freezer', type: 'FREEZER', createdAt: new Date(), updatedAt: new Date() };
      this.db.storageZones.push(zone);
      this.db.reminderPreferences.push({ id: this.id(), userId: user.id, remindDaysBefore: [7,3,1], notifyExpired: true, pushEnabled: true, emailEnabled: false, quietHoursStart: null, quietHoursEnd: null, createdAt: new Date(), updatedAt: new Date() });
    }
  }

  user = {
    findUnique: async ({ where, select }: AnyObj) => {
      const u = this.db.users.find((x) => (where.id ? x.id === where.id : x.email === where.email)) || null;
      if (!u) return null;
      if (!select) return u;
      const member = this.db.householdMembers.find((m) => m.userId === u.id);
      return { id: u.id, email: u.email, name: u.name, householdMember: member ? { householdId: member.householdId, role: member.role } : null };
    },
    create: async ({ data }: AnyObj) => {
      const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date() };
      this.db.users.push(row); return row;
    },
  };

  household = {
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date() }; this.db.households.push(row); return row; },
    findUnique: async ({ where }: AnyObj) => this.db.households.find((x) => x.id === where.id) || null,
    update: async ({ where, data }: AnyObj) => { const row = this.db.households.find((x) => x.id === where.id)!; Object.assign(row, data, { updatedAt: new Date() }); return row; },
  };

  householdMember = {
    findUnique: async ({ where }: AnyObj) => this.db.householdMembers.find((x) => x.userId === where.userId) || null,
    findFirst: async ({ where, include }: AnyObj) => {
      const m = this.db.householdMembers.find((x) => x.householdId === where.householdId) || null;
      if (!m || !include?.user) return m;
      return { ...m, user: this.db.users.find((u) => u.id === m.userId) };
    },
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date() }; this.db.householdMembers.push(row); return row; },
  };

  storageZone = {
    findMany: async ({ where }: AnyObj) => this.db.storageZones.filter((x) => x.householdId === where.householdId),
    findFirst: async ({ where }: AnyObj) => this.db.storageZones.find((x) => x.id === where.id && x.householdId === where.householdId) || null,
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date() }; this.db.storageZones.push(row); return row; },
    update: async ({ where, data }: AnyObj) => { const row = this.db.storageZones.find((x) => x.id === where.id)!; Object.assign(row, data, { updatedAt: new Date() }); return row; },
  };

  inventoryItem = {
    findMany: async ({ where }: AnyObj) => this.db.inventoryItems.filter((x) => Object.entries(where || {}).every(([k,v]) => typeof v === 'object' && v && 'not' in v ? x[k] !== v.not : x[k] === v)),
    findFirst: async ({ where }: AnyObj) => this.db.inventoryItems.find((x) => Object.entries(where || {}).every(([k,v]) => x[k] === v)) || null,
    findUnique: async ({ where }: AnyObj) => this.db.inventoryItems.find((x) => x.id === where.id) || null,
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date(), addedAt: new Date() }; this.db.inventoryItems.push(row); return row; },
    update: async ({ where, data }: AnyObj) => { const row = this.db.inventoryItems.find((x) => x.id === where.id)!; Object.assign(row, data, { updatedAt: new Date() }); return row; },
    count: async ({ where }: AnyObj) => this.db.inventoryItems.filter((x) => Object.entries(where || {}).every(([k,v]) => x[k] === v)).length,
  };

  itemEvent = {
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), ...data, createdAt: new Date(), updatedAt: new Date(), item: this.db.inventoryItems.find((i)=>i.id===data.itemId) }; this.db.itemEvents.push(row); return row; },
    findMany: async ({ where, include }: AnyObj) => this.db.itemEvents.filter((x) => Object.entries(where || {}).every(([k,v]) => x[k] === v)).map((e) => include?.item ? ({ ...e, item: this.db.inventoryItems.find((i)=>i.id===e.itemId) }) : e),
  };

  reminderPreference = {
    findUnique: async ({ where }: AnyObj) => this.db.reminderPreferences.find((x) => x.userId === where.userId) || null,
    create: async ({ data }: AnyObj) => { const row = { id: this.id(), remindDaysBefore:[7,3,1], notifyExpired:true, pushEnabled:true, emailEnabled:false, quietHoursStart:null, quietHoursEnd:null, ...data, createdAt:new Date(), updatedAt:new Date()}; this.db.reminderPreferences.push(row); return row; },
    upsert: async ({ where, create, update }: AnyObj) => { const ex = this.db.reminderPreferences.find((x) => x.userId === where.userId); if (!ex) { const row = { id: this.id(), remindDaysBefore:[7,3,1], notifyExpired:true, pushEnabled:true, emailEnabled:false, quietHoursStart:null, quietHoursEnd:null, ...create, createdAt:new Date(), updatedAt:new Date()}; this.db.reminderPreferences.push(row); return row; } Object.assign(ex, update, { updatedAt:new Date()}); return ex; },
  };

  notificationQueue = {
    findMany: async ({ where, include }: AnyObj) => this.db.notificationQueue.filter((x) => Object.entries(where || {}).every(([k,v]) => typeof v === 'object' && v && 'lte' in v ? x[k] <= (v as any).lte : x[k] === v)).map((n)=> include?.item ? ({...n,item:this.db.inventoryItems.find((i)=>i.id===n.itemId)}) : n),
    create: async ({ data }: AnyObj) => { const row = { id:this.id(), status:'PENDING', ...data, createdAt:new Date(), updatedAt:new Date()}; this.db.notificationQueue.push(row); return row; },
    update: async ({ where, data }: AnyObj) => { const row = this.db.notificationQueue.find((x)=>x.id===where.id)!; Object.assign(row,data,{updatedAt:new Date()}); return row; },
    upsert: async ({ where, create, update }: AnyObj) => { const ex = this.db.notificationQueue.find((x)=>x.dedupeKey===where.dedupeKey); if (!ex) { const row = { id:this.id(), status:'PENDING', ...create, createdAt:new Date(), updatedAt:new Date()}; this.db.notificationQueue.push(row); return row; } Object.assign(ex, update, {updatedAt:new Date()}); return ex; },
  };

  async enableShutdownHooks(_app: INestApplication) {}
}
