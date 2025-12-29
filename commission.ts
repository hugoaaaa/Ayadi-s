export function computeCommission(totalCents: number, commissionPercent: number): number {
  return Math.round((totalCents * commissionPercent) / 100);
}

export function getDefaultCommissionPercent(): number {
  const v = process.env.DEFAULT_COMMISSION_PERCENT;
  const n = v ? Number(v) : 20;
  return Number.isFinite(n) ? n : 20;
}
