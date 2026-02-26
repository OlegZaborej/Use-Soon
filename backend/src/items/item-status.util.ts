export type ItemStatus = 'ACTIVE' | 'USED' | 'DISCARDED' | 'EXPIRED_CHECK';
export type DisplayStatus = 'fresh' | 'use_soon' | 'expires_today' | 'expired_check' | 'used' | 'discarded';

export function computeDisplayStatus(status: ItemStatus, expiryDate?: Date | null): DisplayStatus {
  if (status === 'USED') return 'used';
  if (status === 'DISCARDED') return 'discarded';
  if (status === 'EXPIRED_CHECK') return 'expired_check';
  if (!expiryDate) return 'fresh';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.round((exp.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return 'expired_check';
  if (diffDays === 0) return 'expires_today';
  if (diffDays <= 3) return 'use_soon';
  return 'fresh';
}
