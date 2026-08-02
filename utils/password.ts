/**
 * Formats a default account password as: {Firstname}_{LAST_THREE_DIGIT_OF_PHONE}@JAIN{CURRENT_YEAR}
 */
export function generateFormattedPassword(name: string, phone: string): string {
  const firstName = (name || "User").trim().split(" ")[0];
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const lastThreeDigits = cleanPhone.length >= 3 ? cleanPhone.slice(-3) : "000";
  const currentYear = new Date().getFullYear();
  return `${firstName}_${lastThreeDigits}@JAIN${currentYear}`;
}
