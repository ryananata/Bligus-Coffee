/**
 * Generates an order ID adhering to format: BLG-YYYYMMDD-XXXX
 * Example: BLG-20260917-001 or BLG-20260917-4829
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  // 3 to 4 digit random code
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  
  return `BLG-${year}${month}${day}-${randomSuffix}`;
}
