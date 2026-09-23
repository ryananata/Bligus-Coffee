/**
 * Format a number to Indonesian Rupiah currency string.
 * Example: 15000 -> "Rp15.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, "");
}

/**
 * Validate Indonesian / International WhatsApp phone number.
 * Accepts formats like: 08123456789, +628123456789, 6281234567890
 */
export function validateWhatsAppNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  // Must start with 08, 628, +628 and have 9-15 digits
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  return phoneRegex.test(cleaned);
}
