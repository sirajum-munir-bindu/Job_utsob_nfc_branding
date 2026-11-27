import { z } from "zod";

/**
 * Validates and normalizes Bangladeshi phone numbers
 * Accepts formats:
 * - 01XXXXXXXXX (11 digits)
 * - +8801XXXXXXXXX (14 characters)
 * - 8801XXXXXXXXX (13 digits)
 * - with dashes or spaces: 01712-345678, 017 1234 5678
 */
export function normalizeBdPhoneNumber(phone: string): string {
  // Remove spaces, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Match BD mobile pattern
  const bdRegex = /^(?:\+?88)?(01\d{9})$/;
  const match = cleaned.match(bdRegex);

  if (match && match[1]) {
    return match[1]; // Standard 11 digit format e.g. 01712345678
  }

  return cleaned;
}

export function isValidBdPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return /^\d{7,15}$/.test(cleaned);
}

export const StudentFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .max(80, "Full Name must not exceed 80 characters")
    .transform((name) => name.trim().toUpperCase()),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(25, "Phone number is too long")
    .transform((phone) => normalizeBdPhoneNumber(phone.trim())),
  email: z
    .string()
    .min(3, "Email address is required")
    .transform((email) => email.trim().toLowerCase()),
});

export type StudentFormInput = z.infer<typeof StudentFormSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
