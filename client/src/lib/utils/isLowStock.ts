export interface InventoryStockItem {
  quantity?: number | string | null;
  reorderLevel?: number | string | null;
}

export function getEffectiveReorderLevel(item: InventoryStockItem): number {
  const reorder = Number(item?.reorderLevel);
  return !isNaN(reorder) && reorder > 0 ? reorder : 10;
}

export function isLowStock(item: InventoryStockItem): boolean {
  const qty = Number(item?.quantity ?? 0);
  const reorder = getEffectiveReorderLevel(item);
  return qty <= reorder;
}

export function isCriticalStock(item: InventoryStockItem): boolean {
  const qty = Number(item?.quantity ?? 0);
  const reorder = getEffectiveReorderLevel(item);
  return qty <= Math.max(1, Math.floor(reorder / 2));
}
